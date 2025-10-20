"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWallet } from "./wallet-provider"
import { Sparkles, Download, AlertCircle } from "lucide-react"

export function VideoGenerator() {
  const { isConnected } = useWallet()
  const [prompt, setPrompt] = useState("")
  const [duration, setDuration] = useState("5")
  const [isGenerating, setIsGenerating] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateVideo = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          duration: Number.parseInt(duration),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate video")
      }

      const data = await response.json()
      setVideoUrl(data.videoUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm p-6 hover:border-border/80 transition-all duration-300 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Video Meme Generator</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Meme Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your meme video... e.g., 'A cat dancing to electronic music with neon effects'"
              className="bg-input/50 border-border/50 backdrop-blur-sm placeholder-muted-foreground min-h-24 transition-all duration-300 focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
            <Input
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-input/50 border-border/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/50"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-lg flex items-center gap-2 animate-slide-in-right">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button
            onClick={generateVideo}
            disabled={isGenerating || !isConnected}
            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">⚡</span>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Video
              </>
            )}
          </Button>
        </div>
      </Card>

      {videoUrl && (
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm p-6 animate-fade-in-up">
          <h3 className="text-xl font-bold mb-4">Generated Video</h3>
          <video src={videoUrl} controls className="w-full rounded-lg bg-black shadow-lg" />
          <Button
            onClick={() => {
              const a = document.createElement("a")
              a.href = videoUrl
              a.download = "meme.mp4"
              a.click()
            }}
            className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-600/50 transition-all duration-300 transform hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Video
          </Button>
        </Card>
      )}
    </div>
  )
}
