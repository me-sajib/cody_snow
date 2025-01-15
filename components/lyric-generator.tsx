import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Copy } from 'lucide-react'

interface LyricGeneratorProps {
  setShowSaveLyricsPrompt: (show: boolean) => void
  addError: (message: string) => void
}

export function LyricGenerator({ setShowSaveLyricsPrompt, addError }: LyricGeneratorProps) {
  const [lyrics, setLyrics] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [input, setInput] = useState("")

  const generateLyrics = async () => {
    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const generatedLyrics = `Here are your generated lyrics...
Verse 1:
A neon whispered in a concrete jungle full of neon citys
Echoes of dreams, beyond these neon concrete jungle walls

Chorus:
We rise, we fall, we stand so neon
In this moment, we have it all`
      setLyrics(generatedLyrics)
      setShowSaveLyricsPrompt(true)
    } catch (err) {
      addError("Failed to generate lyrics. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyLyrics = () => {
    navigator.clipboard.writeText(lyrics)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const generateRandomError = () => {
    const errors = [
      "API rate limit exceeded",
      "Network connection lost",
      "Invalid input format",
      "Server is temporarily unavailable",
      "Unsupported language detected"
    ]
    const randomError = errors[Math.floor(Math.random() * errors.length)]
    addError(randomError)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="my-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Generate Lyrics ♪</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a theme or mood for your lyrics..."
            className="mb-4"
          />
          <div className="flex space-x-2">
            <Button onClick={generateLyrics} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Lyrics'
              )}
            </Button>
            {lyrics && (
              <Button onClick={copyLyrics} disabled={isCopied}>
                {isCopied ? (
                  'Copied!'
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Lyrics
                  </>
                )}
              </Button>
            )}
          </div>
          {lyrics && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-bold">Generated Lyrics:</h3>
              <p className="whitespace-pre-wrap">{lyrics}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

