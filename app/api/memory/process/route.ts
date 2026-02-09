import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const runtime = "nodejs"

// Using GET to allow easy manual execution via browser for now
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()

    // 1. Fetch unprocessed memories
    // Note: In a production app, we might limit batch size (e.g., limit(50))
    const unprocessedMemories = await db
      .collection("memories")
      .find({ processed: false })
      .toArray()

    let processedCount = 0

    // 2. Process each memory
    for (const memory of unprocessedMemories) {
      const content = memory.content || ""
      
      // --- Rule-Based Processing Logic (No AI) ---
      
      // Essence: First sentence or first 100 chars
      // Clean up whitespace and newlines
      const cleanContent = content.trim().replace(/\s+/g, " ")
      const firstSentenceMatch = cleanContent.match(/[^.!?]+[.!?]/)
      let essence = firstSentenceMatch ? firstSentenceMatch[0] : cleanContent
      if (essence.length > 100) {
        essence = essence.substring(0, 97) + "..."
      }

      // Structured Understanding: Split by sentences/newlines
      // Filter out short/empty strings
      const sentences = content
        .split(/[.!?\n]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 5)
      
      // Take up to 4 bullet points
      const structuredUnderstanding = sentences.slice(0, 4)
      
      // Fallback if no valid sentences found
      if (structuredUnderstanding.length === 0) {
        structuredUnderstanding.push(cleanContent)
      }

      // Summary: Combine understanding or use full content
      const summary = `Processed: ${cleanContent}`

      // 3. Update document
      await db.collection("memories").updateOne(
        { _id: memory._id },
        {
          $set: {
            essence,
            structuredUnderstanding,
            summary,
            processed: true,
            processedAt: new Date()
          }
        }
      )

      processedCount++
    }

    return NextResponse.json({ 
      success: true, 
      processedCount,
      message: `Successfully processed ${processedCount} memories`
    })

  } catch (error) {
    console.error("Memory processing error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) }, 
      { status: 500 }
    )
  }
}
