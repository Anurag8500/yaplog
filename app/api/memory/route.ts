import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const today = new Date()
    const dateStr = today.toISOString().split("T")[0] // YYYY-MM-DD

    const memory = {
      userId: session.user.id,
      content,
      date: dateStr,
      createdAt: new Date(),
      essence: null,
      structuredUnderstanding: [],
      summary: null,
      processed: false,
    }

    await db.collection("memories").insertOne(memory)

    return NextResponse.json({ success: true, memory })
  } catch (error) {
    console.error("Failed to create memory:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    const memories = await db
      .collection("memories")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ memories })
  } catch (error) {
    console.error("Failed to fetch memories:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
