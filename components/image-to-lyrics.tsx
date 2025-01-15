"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ImagePlus, Sparkles, Copy, Loader2, Save, Search } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// Example artists array - in a real app this would come from your backend
const artists = [
  { id: "1", name: "Luna Starlight", style: "Pop" },
  { id: "2", name: "The Groove Masters", style: "Funk" },
  { id: "3", name: "Elijah Soulful", style: "R&B" },
  { id: "4", name: "Neon Dreamers", style: "Synthwave" },
  { id: "5", name: "Aria Moonbeam", style: "Indie" },
]

export function ImageToLyrics({ isPro, onUpgradeToPro }: { isPro: boolean; onUpgradeToPro: () => void }) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [generatedLyrics, setGeneratedLyrics] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState<string>('')
  const [selectedArtist, setSelectedArtist] = useState<string>('')
  const [artistSearch, setArtistSearch] = useState('')
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [lyricTitle, setLyricTitle] = useState('')
  const [lyrics, setLyrics] = useState<string>('') // Added state for lyrics
  const { toast } = useToast() // Added useToast hook

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(artistSearch.toLowerCase())
  )

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateLyrics = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    let artist = selectedArtist ? artists.find(a => a.id === selectedArtist) : null
    
    if (!artist) {
      // Simulate automatic artist assignment based on the image
      const randomIndex = Math.floor(Math.random() * artists.length)
      artist = artists[randomIndex]
    }

    const fakeLyrics = `[Generated in style of ${artist?.name}]

In a world of pixels, colors bright,
A story unfolds, day and night.
Visual whispers, emotions strong,
Transforming sight into a song.

Chorus:
Image to lyrics, a magical art,
Where pictures and words never part.
Each pixel a note, each hue a rhyme,
Creating music, one frame at a time.

${prompt ? `Inspired by your prompt: "${prompt}"` : ''}
${!selectedArtist ? `\n[Artist automatically assigned based on the image]` : ''}`

    setGeneratedLyrics(fakeLyrics)
    setLyrics(fakeLyrics) // Update lyrics state
    setIsGenerating(false)
  }

  const copyLyrics = () => {
    navigator.clipboard.writeText(generatedLyrics)
    toast({
      title: "Lyrics copied!",
      description: "The generated lyrics have been copied to your clipboard.",
    })
  }

  const saveLyrics = () => {
    if (!lyricTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your lyrics.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically save to your backend
    toast({
      title: "Lyrics saved!",
      description: "Your lyrics have been saved successfully.",
    })
    setIsSaveDialogOpen(false)
    setLyricTitle('')
  }

  const handleSaveLyrics = () => { // Added function to handle saving lyrics
    // Here you would typically save to your backend
    // For now, we'll just show a toast notification
    toast({
      title: "Lyrics saved!",
      description: "Your lyrics have been saved successfully.",
    })
  }

  if (!isPro) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-6 w-6" />
            Image to Lyrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Unleash the power of visual inspiration with our cutting-edge Image to Lyrics feature:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Magically detects the perfect artist match for your image</li>
            <li>Choose your favourite artist</li>
            <li>Creates captivating, one-of-a-kind lyrics inspired by your visuals</li>
            <li></li>
          </ul>
          <Button onClick={onUpgradeToPro} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-6 w-6" />
            Image to Lyrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Uploaded" className="max-w-full max-h-[14rem] object-contain" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                      </>
                    )}
                  </div>
                  <Input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>

              <div className="space-y-2">
                <Label>Select Artist Style (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Choose an artist style or leave blank for automatic assignment based on your image.
                </p>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search artists..."
                    value={artistSearch}
                    onChange={(e) => setArtistSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <ScrollArea className="h-32 rounded-md border">
                  <div className="p-2">
                    {filteredArtists.map((artist) => (
                      <div
                        key={artist.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-accent ${
                          selectedArtist === artist.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => setSelectedArtist(artist.id)}
                      >
                        <span>{artist.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Optional Prompt</Label>
                <Input
                  id="prompt"
                  placeholder="Enter a prompt to guide the lyric generation (optional)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <Button 
                onClick={generateLyrics} 
                disabled={!selectedImage || isGenerating} 
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Lyrics'
                )}
              </Button>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Generated Lyrics:</h3>
              {lyrics ? (
                <>
                  <div className="space-y-2">
                    <Label>Generated Lyrics</Label>
                    <Textarea
                      value={lyrics}
                      onChange={(e) => setLyrics(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyLyrics} className="flex-1">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Lyrics
                    </Button>
                    <Button onClick={handleSaveLyrics} className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      Save Lyrics
                    </Button>
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No lyrics generated yet. Upload an image and click "Generate Lyrics" to start.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Lyrics</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a title for your lyrics"
                value={lyricTitle}
                onChange={(e) => setLyricTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveLyrics}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

