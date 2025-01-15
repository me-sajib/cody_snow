"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Save, Share, Send, Mic, Music, Zap, Sparkles, AlertCircle, Check, Crown } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface Message {
  sender: 'user' | 'ai'
  content: string
}

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

const artists = [
  "Taylor Swift",
  "Ed Sheeran",
  "Beyoncé",
  "Drake",
  "Adele",
  "The Weeknd",
  "Billie Eilish",
  "Kendrick Lamar",
  // Add more artists as needed
]

export function ArtistBlending({ isPro, onUpgradeToPro }: { isPro: boolean; onUpgradeToPro: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [artist1, setArtist1] = useState('')
  const [artist2, setArtist2] = useState('')
  const [blendRatio, setBlendRatio] = useState<string>("50")
  const { toast } = useToast()
  const [presets, setPresets] = useState<Preset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [isCreatePresetOpen, setIsCreatePresetOpen] = useState(false)
  const [newPreset, setNewPreset] = useState<Omit<Preset, 'id'>>({
    name: '',
    avoidWords: [],
    rhymeScheme: "ALL",
    avoidThemes: [],
    isPublic: false,
    artistSpecific: '',
    slangWords: undefined,
  })
  // Removed artistSearch and filteredArtists states


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Removed useEffect for filteredArtists

  const filterLyrics = (lyrics: string) => {
    // Split the lyrics into lines
    const lines = lyrics.split('\n')
    
    // Remove empty lines and trim each line
    const filteredLines = lines.filter(line => line.trim() !== '').map(line => line.trim())
    
    // Add proper line breaks and indentation
    let formattedLyrics = ''
    let isChorus = false
    
    filteredLines.forEach((line, index) => {
      if (line.toLowerCase().includes('verse') || line.toLowerCase().includes('chorus')) {
        formattedLyrics += `\n${line}\n`
        isChorus = line.toLowerCase().includes('chorus')
      } else {
        formattedLyrics += `${isChorus ? '  ' : ''}${line}\n`
      }
    })
    
    return formattedLyrics.trim()
  }

  const sendMessage = async () => {
    if (input.trim() && artist1 && artist2) {
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
        const unfiltered_lyrics = `Blended lyrics in the style of ${artist1} (${blendRatio}%) and ${artist2} (${100 - parseInt(blendRatio)}%):

Verse 1:
In the neon lights of ${artist1}'s world,
We dance to ${artist2}'s rhythm unfurled.
A fusion of styles, a harmony divine,
Two artistic souls intertwine.

Chorus:
Blending voices, melding dreams,
Creating music beyond what it seems.
${artist1}'s passion, ${artist2}'s grace,
In this lyrical embrace.

Verse 2:
${artist1}'s melodies, soft and sweet,
Meet ${artist2}'s beats, a perfect feat.
Words flow like rivers, emotions soar,
Two legends united, forevermore.

Bridge:
From ${artist1}'s heart to ${artist2}'s soul,
A musical journey that makes us whole.
Genres collide, barriers fall,
In this blended masterpiece, we hear it all.

(Repeat Chorus)`

        const filteredLyrics = filterLyrics(unfiltered_lyrics)
        const aiMessage = { 
          sender: 'ai', 
          content: filteredLyrics
        }
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
      description: "The blended lyrics have been copied to your clipboard.",
    })
  }

  const handlePresetChange = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId)
    if (preset) {
      setSelectedPreset(presetId)
      // Apply preset settings here
      // For example, you might want to update the avoid words, rhyme scheme, etc.
    }
  }

  const handleCreatePreset = () => {
    setIsCreatePresetOpen(true)
  }

  const createPreset = (newPreset: Omit<Preset, 'id'>) => {
    const preset: Preset = {
      ...newPreset,
      id: Date.now().toString()
    }
    setPresets([...presets, preset])
    setSelectedPreset(preset.id)
    toast({
      title: "Preset created!",
      description: `Your new preset "${newPreset.name}" has been created.`,
    })
  }

  if (!isPro) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Artist Blending</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="mr-2 h-5 w-5 text-yellow-400" />
              Pro Feature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Artist Blending is an advanced feature that allows you to combine the styles of artists to create unique lyrical compositions. This powerful tool is exclusive to our Pro plan members.
            </p>
            <p className="mb-4">
              With Artist Blending, you can:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Mix the styles of 2 different artists</li>
              <li>Adjust the influence level of each artist</li>
              <li>Generate lyrics that capture you're favourite artists combined!</li>
              <li>Save and use custom presets for quick access to your favorite combinations</li>
            </ul>
            <Button onClick={onUpgradeToPro}>
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 container mx-auto max-w-5xl px-4">
      <Card className="flex-grow flex flex-col overflow-hidden relative">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 relative z-10 bg-background">
          <CardTitle className="text-xl font-bold flex items-center mb-2 sm:mb-0">
            <Crown className="mr-2 h-5 w-5 text-yellow-400" />
            <span className="truncate">
              Artist Blending Studio 🎭
            </span>
          </CardTitle>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex w-full sm:w-auto space-x-2">
              {/* Removed search input and clear button */}
            </div>
            <Select value={artist1} onValueChange={setArtist1}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Artist 1" />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder="Search artists..."
                  className="mb-2"
                  onChange={(e) => {
                    // Force re-render of SelectContent
                    e.target.dispatchEvent(new Event('input', { bubbles: true }));
                  }}
                />
                {artists
                  .filter(artist =>
                    artist.toLowerCase().includes(
                      ((document.querySelector('.mb-2') as HTMLInputElement)?.value || '').toLowerCase()
                    )
                  )
                  .map((artist) => (
                    <SelectItem key={artist} value={artist}>{artist}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={artist2} onValueChange={setArtist2}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Artist 2" />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder="Search artists..."
                  className="mb-2"
                  onChange={(e) => {
                    // Force re-render of SelectContent
                    e.target.dispatchEvent(new Event('input', { bubbles: true }));
                  }}
                />
                {artists
                  .filter(artist =>
                    artist.toLowerCase().includes(
                      ((document.querySelector('.mb-2:last-of-type') as HTMLInputElement)?.value || '').toLowerCase()
                    )
                  )
                  .map((artist) => (
                    <SelectItem key={artist} value={artist}>{artist}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col space-y-4 p-4 pt-0 overflow-hidden">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Blend Ratio:</span>
            <Select value={blendRatio || "50"} onValueChange={setBlendRatio}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm font-medium">{blendRatio}% - {100 - parseInt(blendRatio)}%</span>
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
            placeholder="Enter a theme or topic for your blended lyrics..."
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button onClick={sendMessage} className="send-button" disabled={!artist1 || !artist2}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <Select value={selectedPreset} onValueChange={handlePresetChange}>
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
            <Dialog open={isCreatePresetOpen} onOpenChange={setIsCreatePresetOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 create-preset-button">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Preset
                </Button>
              </DialogTrigger>
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
                      id="rhyme-scheme"
                      value={newPreset.rhymeScheme || "ALL"}
                      onValueChange={(value) => setNewPreset({ ...newPreset, rhymeScheme: value })}
                    >
                      <SelectTrigger className="w-full">
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
                  <Button onClick={() => {
                    createPreset(newPreset)
                    setIsCreatePresetOpen(false)
                  }} className="w-full create-preset-button">
                    <Zap className="mr-2 h-4 w-4" />
                    Create Preset
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={copyLyrics} className="action-button">
              <Copy className="h-4 w-4 mr-2" />
              Copy Blended Lyrics
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

