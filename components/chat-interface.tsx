"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Save, Share, Send, Mic, Music, Zap, Sparkles, AlertCircle, Check, Dice1Icon as Dice } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  sender: 'user' | 'ai'
  content: string
}

interface CustomArtist {
  id: string;
  name: string;
  description: string;
  style: string;
  musicType: string;
  imageUrl: string;
  lyrics: string[];
  status: 'pending' | 'added' | 'denied';
  denialReason?: string;
}

interface ChatInterfaceProps {
  artist: string | null
  onBack: () => void
  savedLyric?: SavedLyric
  customArtistData?: CustomArtist
}

const presets = [
  { id: 'preset1', name: 'Pop Star', description: 'Upbeat and catchy pop music style' },
  { id: 'preset2', name: 'Rock Legend', description: 'Powerful and energetic rock music style' },
  { id: 'preset3', name: 'R&B Sensation', description: 'Smooth and soulful R&B music style' },
  { id: 'preset4', name: 'Hip Hop Artist', description: 'Rhythmic and lyrical hip hop music style' },
  { id: 'preset5', name: 'Country Singer', description: 'Storytelling and twangy country music style' },
];

const models = [
  { id: 'model1', name: 'Cody Artist Lyrics 🎵' },
  { id: 'model2', name: 'Cody Artist Exp 🚀' },
  { id: 'model3', name: 'Cody Artist X1 ⚡' },
];

export function ChatInterface({ artist, onBack, savedLyric, customArtistData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('model1')
  const [randomPrompt, setRandomPrompt] = useState('')

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (savedLyric) {
      setMessages([{ sender: 'ai', content: savedLyric.content }])
    }
  }, [savedLyric])

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', content: input }
      setMessages(prev => [...prev, userMessage])
      setInput('')
      setIsTyping(true)
      setError(null)

      try {
        if (input.toLowerCase() === "error") {
          throw new Error("You triggered an error!")
        }
        
        // Simulate AI response
        await new Promise(resolve => setTimeout(resolve, 1500))
        let aiResponse = 'This is a simulated AI response. 🎵'
        
        if (customArtistData) {
          if (customArtistData.status === 'added') {
            aiResponse = `As ${customArtistData.name}, a ${customArtistData.musicType} artist with a ${customArtistData.style} style, I'd respond: ${customArtistData.description}`
          } else if (customArtistData.status === 'pending') {
            aiResponse = "This artist version is still pending. Please wait for it to be processed."
          } else if (customArtistData.status === 'denied') {
            aiResponse = `This artist version was denied. Reason: ${customArtistData.denialReason || "Unknown"}`
          }
        }
        
        const aiMessage = { sender: 'ai', content: aiResponse }
        setMessages(prev => [...prev, aiMessage])
      } catch (err) {
        if (err instanceof Error) {
          setError(`Oops! ${err.message}. Please try again.`)
        } else {
          setError("An unexpected error occurred. Please try again.")
        }
      } finally {
        setIsTyping(false)
      }
    }
  }

  const copyLyrics = () => {
    const lyrics = messages
      .filter(msg => msg.sender === 'ai')
      .map(msg => msg.content)
      .join('\n\n')
    navigator.clipboard.writeText(lyrics)
    toast({
      title: "Lyrics copied!",
      description: "The generated lyrics have been copied to your clipboard.",
    })
  }

  const generateRandomPrompt = () => {
    const prompts = [
      "Write a verse about heartbreak in the style of Taylor Swift",
      "Compose a chorus about overcoming challenges in the style of Beyoncé",
      "Create a bridge about finding love in the style of Ed Sheeran",
      "Write a song about nature's beauty",
      "Compose a rap verse about city life",
      "Create a love song with a sad ending",
      "Write a song about a historical event",
      "Compose a children's song about animals",
      "Create a song about a personal experience",
      "Write a song with a futuristic theme"
    ]
    const randomIndex = Math.floor(Math.random() * prompts.length)
    setRandomPrompt(prompts[randomIndex])
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-grow flex flex-col overflow-hidden relative">
        <CardHeader className="flex flex-row items-center justify-between p-4 relative z-10 bg-background">
          <CardTitle className="text-xl font-bold flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-2 p-0">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <span className="truncate">
              {customArtistData ? customArtistData.name : artist || 'Chat'} 🎤
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col space-y-4 p-4 pt-0 overflow-hidden">
          <div className="flex space-x-2">
            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="flex-grow pr-4 relative" ref={scrollAreaRef}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <span 
                    className={`inline-block p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                  >
                    {message.content}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                className="text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="inline-block p-3 rounded-lg bg-secondary">
                  <span className="typing-indicator"></span>
                </span>
              </motion.div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="mt-4 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message... 💬"
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button onClick={sendMessage} className="send-button">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={copyLyrics} className="action-button">
            <Copy className="h-4 w-4 mr-2" />
            Copy Lyrics
          </Button>
          <Button onClick={generateRandomPrompt} variant="outline" className="action-button">
            <Dice className="h-4 w-4 mr-2" />
            Random Prompt
          </Button>
        </div>
        {randomPrompt && (
          <div className="mt-2 text-sm text-muted-foreground">
            <strong>Random Prompt:</strong> {randomPrompt}
          </div>
        )}
      </div>
    </div>
  )
}

