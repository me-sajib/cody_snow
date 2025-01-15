"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Send, AlertCircle, Sparkles, Zap, Share, Dice1Icon as Dice } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import confetti from 'canvas-confetti';

interface Preset {
  id: string
  name: string
  avoidWords: string[]
  rhymeScheme: string | "ALL"
  avoidThemes: string[]
  isPublic: boolean
  artistSpecific: string
  slangWords?: string[]
}

interface ArtistChatProps {
  artist: string
  onBack: () => void
}

export function ArtistChat({ artist, onBack }: ArtistChatProps) {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', content: string }[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [aiModel, setAiModel] = useState('cody-artist-lyrics')
  const { toast } = useToast()
  const [presets, setPresets] = useState<Preset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [isCreatePresetOpen, setIsCreatePresetOpen] = useState(false)
  const [isSharePresetOpen, setIsSharePresetOpen] = useState(false)
  const [newPreset, setNewPreset] = useState<Omit<Preset, 'id'>>({
    name: '',
    avoidWords: [],
    rhymeScheme: "ALL",
    avoidThemes: [],
    isPublic: false,
    artistSpecific: '',
    slangWords: undefined,
  })
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const userProfile = {plan: 'Free'}; // Replace with actual user profile data
  const isPremiumUser = userProfile.plan === 'Pro' || userProfile.plan === 'Premium';
  const [randomPrompt, setRandomPrompt] = useState<string | null>(null);
  const [isModelSelected, setIsModelSelected] = useState(false)

  const generateRandomPrompt = () => {
    const prompts = [
      "Write a song about a cat riding a unicorn.",
      "Compose lyrics about a robot falling in love with a human.",
      "Create a rap about the struggles of being a programmer.",
      "Write a country song about a lost dog.",
      "Compose a ballad about a brave knight.",
    ];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setRandomPrompt(prompts[randomIndex]);
  };


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Check if there's a preset ID in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const presetId = urlParams.get('preset')
    if (presetId) {
      loadPresetFromId(presetId)
    }
  }, [])

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', content: input }
      setMessages(prev => [...prev, userMessage])
      setInput('')
      setIsTyping(true)
      setError(null)

      if (!isPremiumUser) {
        setIsInQueue(true)
        setQueuePosition(Math.floor(Math.random() * 5) + 1) // Simulating queue position
        await new Promise(resolve => setTimeout(resolve, 3000)) // Simulating queue wait time
        setIsInQueue(false)
        setQueuePosition(null)
      }

      try {
        if (input.toLowerCase() === "error") {
          throw new Error("You triggered an error!")
        }
        // Simulate AI response
        await new Promise(resolve => setTimeout(resolve, 1500))
        const aiMessage = { sender: 'ai', content: `This is a simulated AI response from ${artist}. 🎵` }
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

  const handleCreatePreset = () => {
    const preset: Preset = {
      ...newPreset,
      id: Date.now().toString()
    }
    setPresets([...presets, preset])
    setSelectedPreset(preset.id)
    setIsCreatePresetOpen(false)
    setNewPreset({
      name: '',
      avoidWords: [],
      rhymeScheme: "ALL",
      avoidThemes: [],
      isPublic: false,
      artistSpecific: '',
      slangWords: undefined,
    })
    toast({
      title: "Preset created!",
      description: `Your new preset "${preset.name}" has been created.`,
    })
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  const sharePreset = (preset: Preset) => {
    const url = new URL(window.location.href)
    url.searchParams.set('preset', preset.id)
    navigator.clipboard.writeText(url.toString())
    setIsSharePresetOpen(false)
    toast({
      title: "Preset link copied!",
      description: "The link to share this preset has been copied to your clipboard.",
    })
  }

  const loadPresetFromId = (id: string) => {
    const preset = presets.find(p => p.id === id)
    if (preset) {
      setSelectedPreset(preset.id)
      toast({
        title: "Preset loaded!",
        description: `The preset "${preset.name}" has been loaded.`,
      })
    } else {
      toast({
        title: "Preset not found",
        description: "The requested preset could not be found.",
        variant: "destructive",
      })
    }
  }

  const handleModelChange = useCallback((value: string) => {
    setAiModel(value)
    setIsModelSelected(true)
    setTimeout(() => setIsModelSelected(false), 2000)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-grow flex flex-col overflow-hidden relative">
        <CardHeader className="flex flex-row items-center justify-between p-4 relative z-10 bg-background">
          <CardTitle className="text-xl font-bold flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-2 p-0">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <span className="truncate">
              {artist} 🎤
            </span>
          </CardTitle>
          <div className={`relative ${isModelSelected ? 'animate-pulse-glow' : ''}`}>
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-600 rounded-md blur ${isModelSelected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}></div>
            <Select value={aiModel} onValueChange={handleModelChange}>
              <SelectTrigger className="w-[220px] relative z-10">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cody-artist-lyrics">Cody Artist Lyrics 🎵</SelectItem>
                <SelectItem value="cody-artist-exp">Cody Artist Exp 🚀</SelectItem>
                <SelectItem value="cody-artist-x1">Cody Artist X1 ⚡</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col space-y-4 p-4 pt-0 overflow-hidden">
          <ScrollArea className="flex-grow pr-4 relative" ref={scrollAreaRef}>
            {!isPremiumUser && isInQueue && (
              <div className="bg-muted p-4 mb-4 rounded-lg">
                <p className="text-center">You are in queue for lyric generation.</p>
                {queuePosition !== null && (
                  <p className="text-center">Your position: {queuePosition}</p>
                )}
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  This should only take a second. For no queues, subscribe!
                </p>
              </div>
            )}
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
          <Select value={selectedPreset} onValueChange={setSelectedPreset}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Preset 📋" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button variant="outline" onClick={copyLyrics} className="action-button">
              <Copy className="h-4 w-4 mr-2" />
              Copy Lyrics
            </Button>
            <Button
              variant="outline"
              className="action-button"
              onClick={() => setIsSharePresetOpen(true)}
              disabled={!selectedPreset}
            >
              <Share className="h-4 w-4 mr-2" />
              Share Preset
            </Button>
            <Button variant="outline" onClick={() => setIsCreatePresetOpen(true)} className="create-preset-button">
              <Sparkles className="mr-2 h-4 w-4" />
              Create Preset
            </Button>
            <Button onClick={generateRandomPrompt} variant="outline" className="action-button">
              <Dice className="h-4 w-4 mr-2" />
              Random Prompt
            </Button>
          </div>
        </div>
        {randomPrompt && (
          <div className="mt-2 text-sm text-muted-foreground">
            <strong>Random Prompt:</strong> {randomPrompt}
          </div>
        )}
      </div>

      <Dialog open={isCreatePresetOpen} onOpenChange={setIsCreatePresetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Preset ✨</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={newPreset.name}
                onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                placeholder="My Awesome Preset 🎵"
              />
            </div>
            <div>
              <Label htmlFor="avoid-words">Avoid Words (comma-separated)</Label>
              <Input
                id="avoid-words"
                value={newPreset.avoidWords.join(', ')}
                onChange={(e) => setNewPreset({ ...newPreset, avoidWords: e.target.value.split(',').map(w => w.trim()) })}
                placeholder="love, hate, etc. 🚫"
              />
            </div>
            <div>
              <Label htmlFor="rhyme-scheme">Rhyme Scheme 🎭</Label>
              <Select
                value={newPreset.rhymeScheme}
                onValueChange={(value) => setNewPreset({ ...newPreset, rhymeScheme: value })}
              >
                <SelectTrigger id="rhyme-scheme">
                  <SelectValue placeholder="Select a rhyme scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Rhyme Schemes</SelectItem>
                  <SelectItem value="AABB">AABB - Pairs of rhyming lines</SelectItem>
                  <SelectItem value="ABAB">ABAB - Alternating rhyme</SelectItem>
                  <SelectItem value="ABBA">ABBA - Enclosed rhyme</SelectItem>
                  <SelectItem value="ABCB">ABCB - Ballad stanza</SelectItem>
                  <SelectItem value="AAAA">AAAA - Monorhyme</SelectItem>
                  <SelectItem value="ABCD">ABCD - No rhyme (free verse)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="avoid-themes">Avoid Themes (comma-separated)</Label>
              <Input
                id="avoid-themes"
                value={newPreset.avoidThemes.join(', ')}
                onChange={(e) => setNewPreset({ ...newPreset, avoidThemes: e.target.value.split(',').map(t => t.trim()) })}
                placeholder="breakup, war, etc. 🎨"
              />
            </div>
            <div>
              <Label htmlFor="artist-specific">Artist Specific (optional) 🎤</Label>
              <Input
                id="artist-specific"
                value={newPreset.artistSpecific}
                onChange={(e) => setNewPreset({ ...newPreset, artistSpecific: e.target.value })}
                placeholder="Enter artist name if this preset is for a specific artist"
              />
            </div>
            <div>
              <Label htmlFor="slang-words">Artist Slang / Common Words 🗣️ (Optional)</Label>
              <Input
                id="slang-words"
                value={newPreset.slangWords ? newPreset.slangWords.join(', ') : ''}
                onChange={(e) => setNewPreset({ ...newPreset, slangWords: e.target.value ? e.target.value.split(',').map(w => w.trim()) : undefined })}
                placeholder="yo, fam, lit, etc."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="preset-public"
                checked={newPreset.isPublic}
                onCheckedChange={(checked) => setNewPreset({ ...newPreset, isPublic: checked })}
              />
              <Label htmlFor="preset-public">Make Preset Public 🌍</Label>
            </div>
            <Button onClick={handleCreatePreset} className="w-full create-preset-button">
              <Zap className="mr-2 h-4 w-4" />
              Create Preset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSharePresetOpen} onOpenChange={setIsSharePresetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Share this preset with others:</p>
            <div className="flex items-center space-x-2">
              <Input 
                value={selectedPreset ? `${window.location.origin}${window.location.pathname}?preset=${selectedPreset}` : ''}
                readOnly
              />
              <Button onClick={() => selectedPreset && sharePreset(presets.find(p => p.id === selectedPreset)!)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

<style jsx global>{`
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
`}</style>

