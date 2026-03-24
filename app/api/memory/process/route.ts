import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const runtime = "nodejs"

const OLLAMA_URL = "http://localhost:11434/api/generate"
const MODEL = "llama3:8b"

interface AIResponse {
  essence: string
  structuredUnderstanding: string[]
  summary: string
}

async function generateWithOllama(content: string): Promise<AIResponse | null> {
  const prompt = `
You are a helpful AI assistant. Analyze the following user memory and return a structured JSON response.
Do not output any text other than the JSON.

Memory content:
"${content}"

Return strictly this JSON format:
{
  "essence": "A single, concise sentence capturing the core meaning",
  "structuredUnderstanding": ["Key point 1", "Key point 2", "Key point 3"],
  "summary": "A short paragraph summarizing the context and details"
}
`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        format: "json", // Enforce JSON mode if supported by the model version, but prompt is also explicit
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Harden response validation
    if (!data || !data.response || typeof data.response !== "string") {
      console.error("Invalid Ollama response format:", JSON.stringify(data))
      return null
    }

    const rawResponse = data.response

    // Clean up response if it contains markdown code blocks
    const jsonString = rawResponse.replace(/```json\n?|\n?```/g, "").trim()
    
    try {
      const parsed: AIResponse = JSON.parse(jsonString)
      
      // Basic validation
      if (!parsed.essence || !Array.isArray(parsed.structuredUnderstanding) || !parsed.summary) {
        console.warn("Ollama returned incomplete JSON structure:", parsed)
        return null
      }
      
      return parsed
    } catch (parseError) {
      console.error("Failed to parse Ollama JSON:", rawResponse, parseError)
      return null
    }

  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === "AbortError") {
      console.error("Ollama request timed out after 60s")
    } else {
      console.error("Ollama connection failed:", error)
    }
    return null
  }
}

// Using POST to ensure safe execution and avoid GET-based race conditions/caching
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    // Get today's date string (YYYY-MM-DD)
    const now = new Date()
    const todayStr = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-")

    // 1. Identify "Dirty" Days
    // Find memories that are unprocessed AND belong to today
    // We only care about today per instructions
    const dirtyMemories = await db
      .collection("memories")
      .find({
        date: todayStr,
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ]
      })
      .project({ userId: 1, date: 1 }) // Only need these fields
      .toArray()

    // Group by unique (userId + date)
    const uniqueKeys = new Set<string>()
    const tasks: { userId: string, date: string }[] = []

    dirtyMemories.forEach(m => {
        const key = `${m.userId}_${m.date}`
        if (!uniqueKeys.has(key)) {
            uniqueKeys.add(key)
            tasks.push({ userId: m.userId, date: m.date })
        }
    })

    console.log(`Found ${tasks.length} dirty days to process for today (${todayStr})`)

    let processedCount = 0
    let skippedCount = 0
    let failedCount = 0

    // 2. Process each distinct User+Day
    for (const task of tasks) {
        const { userId, date } = task

        // B. Acquire Lock (Loop for re-entrancy)
        let keepProcessing = true
        let iterations = 0
        const MAX_ITERATIONS = 5

        while (keepProcessing && iterations < MAX_ITERATIONS) {
            iterations++
            keepProcessing = false // Default to stop unless we find more work

            // 1. Check/Acquire Lock
            // We need to re-check the latest memory each time because it might have changed
            const latestMemory = await db.collection("memories")
                .find({ userId, date })
                .sort({ createdAt: -1 })
                .limit(1)
                .next()

            if (!latestMemory) break;

            // Check if someone else holds the lock (and it's not us - though we don't track "us", 
            // we assume if we just finished a loop, we unlocked. If we are starting, we check.)
            // Actually, simply checking "processing: true" is enough. 
            // If WE set it, we are inside the critical section. 
            // But here we want to be atomic.
            
            // Optimization: If we are in loop 2+, we know we just unlocked. 
            // But another process might have grabbed it.
            // So we always treat it as a fresh acquisition.

            const activeProcess = await db.collection("memories").findOne({
                userId, date, processing: true
            })
            
            if (activeProcess) {
                console.log(`Skipping ${userId}/${date} - locked by another process`)
                skippedCount++
                break; // Stop this worker
            }

            // Lock the latest memory
            const lockResult = await db.collection("memories").updateOne(
                { _id: latestMemory._id, processing: { $ne: true } },
                { $set: { processing: true } }
            )

            if (lockResult.modifiedCount === 0) {
                console.log(`Failed to acquire lock for ${userId}/${date} - race condition?`)
                skippedCount++
                break;
            }

            try {
                // 2. Gather Context
                const dayMemories = await db.collection("memories")
                    .find({ userId, date })
                    .sort({ createdAt: 1 })
                    .toArray()
                
                // Track IDs we are processing to ensure we only mark THESE as processed
                const processedIds = dayMemories.map(m => m._id)

                const combinedContent = dayMemories
                    .map(m => m.content)
                    .filter(c => c && c.trim())
                    .join("\n\n---\n\n")

                console.log(`Processing day ${date} for user ${userId} (Iter ${iterations}). Inputs: ${dayMemories.length}`)

                // 3. Generate AI
                const aiResult = await generateWithOllama(combinedContent)

                if (aiResult) {
                    // 4. Save & Unlock
                    
                    // Update latest memory with AI
                    await db.collection("memories").updateOne(
                        { _id: latestMemory._id },
                        {
                            $set: {
                                essence: aiResult.essence,
                                structuredUnderstanding: aiResult.structuredUnderstanding,
                                summary: aiResult.summary,
                                processed: true,
                                processing: false,
                                processedAt: new Date(),
                                lastUpdatedAt: new Date()
                            }
                        }
                    )

                    // Mark other INCLUDED memories as processed
                    await db.collection("memories").updateMany(
                        { 
                            _id: { $in: processedIds, $ne: latestMemory._id } 
                        },
                        {
                            $set: { 
                                processed: true,
                                processing: false 
                            }
                        }
                    )

                    processedCount++
                } else {
                    console.warn(`AI generation failed for ${userId}/${date}`)
                    // Unlock
                    await db.collection("memories").updateOne(
                        { _id: latestMemory._id },
                        { $set: { processing: false } }
                    )
                    failedCount++
                }

                // 5. Check for new data (Race Condition Handling)
                // If new memories arrived while we were processing, they won't be in processedIds
                // and they will be processed: false.
                const leftovers = await db.collection("memories").countDocuments({
                    userId, 
                    date, 
                    processed: false
                })

                if (leftovers > 0) {
                    console.log(`Found ${leftovers} new memories for ${userId}/${date}, looping...`)
                    keepProcessing = true
                    // Small delay to be nice to DB
                    await new Promise(r => setTimeout(r, 500))
                }

            } catch (err) {
                console.error(`Error processing task ${userId}/${date}:`, err)
                // Unlock
                await db.collection("memories").updateOne(
                    { _id: latestMemory._id },
                    { $set: { processing: false } }
                )
                failedCount++
                break;
            }
        }
    }

    return NextResponse.json({ 
      success: true, 
      processedCount,
      skippedCount,
      failedCount,
      message: `Processed ${processedCount} days. Skipped ${skippedCount}. Failed ${failedCount}`
    })

  } catch (error) {
    console.error("Memory processing error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) }, 
      { status: 500 }
    )
  }
}
