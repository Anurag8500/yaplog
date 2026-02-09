import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: true })
    }

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: "No user exists with this email address" },
        { status: 404 }
      )
    }

    if (user) {
      const resetPasswordToken = crypto.randomBytes(32).toString("hex")
      const resetPasswordTokenExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            resetPasswordToken,
            resetPasswordTokenExpires,
          },
        }
      )

      try {
        await sendPasswordResetEmail({
          email: user.email,
          token: resetPasswordToken,
        })
      } catch (error) {
        console.error("Failed to send password reset email:", error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ success: true })
  }
}
