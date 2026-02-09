import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // 1. Validate Input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // 2. Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      // Return 409 Conflict as requested
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // 4. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // 5. Create user
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      authProvider: "credentials",
      emailVerified: false,
      verificationToken,
      verificationTokenExpires,
      createdAt: new Date(),
    })

    // 6. Send verification email
    try {
      await sendVerificationEmail({
        email,
        name,
        token: verificationToken,
      })
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // We still return success because the account was created.
      // The user can request a new verification email later.
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
