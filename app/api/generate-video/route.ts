import { type NextRequest, NextResponse } from "next/server"

const COMET_API_KEY = process.env.COMET_API_KEY
const COMET_API_URL = "https://api.cometapi.com/v1/sora"

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration } = await request.json()

    if (!COMET_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const response = await fetch(`${COMET_API_URL}/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COMET_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        duration: Math.min(duration, 60),
        model: "sora-1",
      }),
    })

    if (!response.ok) {
      throw new Error(`Sora API error: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      videoUrl: data.video_url || data.url,
      requestId: data.request_id,
    })
  } catch (error) {
    console.error("Video generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate video" },
      { status: 500 },
    )
  }
}
