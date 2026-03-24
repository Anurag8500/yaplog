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

    const now = new Date()
    const dateStr = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-")

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

    // Trigger AI processing in background (fire and forget)
    // Only for today's memories (which this is, since we just created it with 'now')
    const protocol = request.url.startsWith("https") ? "https" : "http"
    const host = request.headers.get("host") || "localhost:3000"
    const processUrl = `${protocol}://${host}/api/memory/process`

    fetch(processUrl, {
      method: "POST",
    }).catch((err) => console.error("Background processing trigger failed:", err))

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
