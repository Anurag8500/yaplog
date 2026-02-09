import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: true }) // Silent fail
    }

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ email })

    if (user && user.emailVerified === false) {
      // Check for cooldown (30 seconds)
      if (user.lastVerificationEmailSentAt) {
        const lastSent = new Date(user.lastVerificationEmailSentAt)
        const now = new Date()
        const diffInSeconds = (now.getTime() - lastSent.getTime()) / 1000

        if (diffInSeconds < 30) {
          // Silent fail for rate limiting
          return NextResponse.json({ success: true })
        }
      }

      const verificationToken = crypto.randomBytes(32).toString("hex")
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            verificationToken,
            verificationTokenExpires,
            lastVerificationEmailSentAt: new Date(),
          },
        }
      )

      try {
        await sendVerificationEmail({
          email: user.email,
          name: user.name,
          token: verificationToken,
        })
      } catch (error) {
        console.error("Failed to send verification email:", error)
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ success: true }) // Silent fail
  }
}
