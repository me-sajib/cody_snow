"use client"

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatInterface } from '@/components/chat-interface'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"


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

const models = [
  { id: 'model1', name: 'Cody Artist Lyrics 🎵' },
  { id: 'model2', name: 'Cody Artist Exp 🚀' },
  { id: 'model3', name: 'Cody Artist X1 ⚡' },
];

export default function CreateArtistPage() {
  const [artistName, setArtistName] = useState('')
  const [artistDescription, setArtistDescription] = useState('')
  const [artistStyle, setArtistStyle] = useState('')
  const [musicType, setMusicType] = useState('')
  const [artistImage, setArtistImage] = useState<File | null>(null)
  const [lyrics, setLyrics] = useState<File[]>([])
  const [customArtists, setCustomArtists] = useState<CustomArtist[]>([
    {
      id: '1',
      name: 'Rock Star Me',
      description: 'A high-energy rock persona',
      style: 'Rock',
      musicType: 'Hard Rock',
      imageUrl: '/placeholder.svg?height=100&width=100',
      lyrics: ['Sample lyric 1', 'Sample lyric 2', 'Sample lyric 3', 'Sample lyric 4'],
      status: 'added',
      
    },
    {
      id: '2',
      name: 'Acoustic Me',
      description: 'A mellow, acoustic persona',
      style: 'Acoustic',
      musicType: 'Folk',
      imageUrl: '/placeholder.svg?height=100&width=100',
      lyrics: ['Sample lyric 1', 'Sample lyric 2', 'Sample lyric 3', 'Sample lyric 4'],
      status: 'pending',
      
    },
    {
      id: '3',
      name: 'EDM Me',
      description: 'An electronic dance music persona',
      style: 'Electronic',
      musicType: 'EDM',
      imageUrl: '/placeholder.svg?height=100&width=100',
      lyrics: ['Sample lyric 1', 'Sample lyric 2', 'Sample lyric 3', 'Sample lyric 4'],
      status: 'denied',
      denialReason: 'Lyrics contain inappropriate content',
      
    }
  ])
  const [selectedArtist, setSelectedArtist] = useState<CustomArtist | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({ title: '', description: '' })
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (lyrics.length !== 4) {
      toast({
        title: "Error",
        description: "Please upload exactly 4 lyric files.",
        variant: "destructive",
      })
      return
    }

    const lyricContents = await Promise.all(
      lyrics.map(file => file.text())
    )

    const imageUrl = artistImage ? URL.createObjectURL(artistImage) : ''

    const newArtist: CustomArtist = {
      id: Date.now().toString(),
      name: artistName,
      description: artistDescription,
      style: artistStyle,
      musicType: musicType,
      imageUrl: imageUrl,
      lyrics: lyricContents,
      status: 'pending',
    }

    setCustomArtists([...customArtists, newArtist])

    // Reset form
    setArtistName('')
    setArtistDescription('')
    setArtistStyle('')
    setMusicType('')
    setArtistImage(null)
    setLyrics([])
    if (fileInputRef.current) fileInputRef.current.value = ''

    toast({
      title: "Artist Version Created",
      description: "Your new artist version has been successfully created!",
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtistImage(e.target.files[0])
    }
  }

  const handleLyricsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLyrics(Array.from(e.target.files).slice(0, 4))
    }
  }

  const handleArtistSelect = (artist: CustomArtist) => {
    if (artist.status === 'added') {
      setSelectedArtist(artist)
    } else if (artist.status === 'pending') {
      setDialogContent({
        title: "Artist Version Pending",
        description: "Your artist version is currently being processed. This won't take long as we train the model. It should be quick!"
      })
      setIsDialogOpen(true)
    } else if (artist.status === 'denied') {
      setDialogContent({
        title: "Artist Version Denied",
        description: artist.denialReason || "Your artist version was denied. Please review and try again."
      })
      setIsDialogOpen(true)
    }
  }

  return (
    <div className="container mx-auto py-8 text-black">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create New Version</TabsTrigger>
          <TabsTrigger value="versions">Your Versions</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Artist Version</CardTitle>
              <CardDescription>Fill in the details below to create a new version of yourself as an artist.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="artistName">Artist Name</Label>
                  <Input
                    id="artistName"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Enter your artist name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="artistDescription">Artist Description</Label>
                  <Textarea
                    id="artistDescription"
                    value={artistDescription}
                    onChange={(e) => setArtistDescription(e.target.value)}
                    placeholder="Describe yourself as an artist"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="artistStyle">Artist Style</Label>
                  <Input
                    id="artistStyle"
                    value={artistStyle}
                    onChange={(e) => setArtistStyle(e.target.value)}
                    placeholder="Describe your artistic style"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="musicType">Type of Music</Label>
                  <Input
                    id="musicType"
                    value={musicType}
                    onChange={(e) => setMusicType(e.target.value)}
                    placeholder="What type of music do you make?"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="artistImage">Artist Image</Label>
                  <Input
                    id="artistImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lyrics">Lyric Files (Upload 4 text files)</Label>
                  <Input
                    id="lyrics"
                    type="file"
                    accept=".txt"
                    multiple
                    onChange={handleLyricsUpload}
                    required
                    ref={fileInputRef}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {lyrics.length} / 4 files selected
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full">Create Artist Version</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="versions">
          <Card>
            <CardHeader>
              <CardTitle>Your Artist Versions</CardTitle>
              <CardDescription>Click on a version to start a chat with that artist version.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customArtists.map((artist) => (
                    <Card 
                      key={artist.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleArtistSelect(artist)}
                    >
                      <CardContent className="p-4">
                        <img src={artist.imageUrl} alt={artist.name} className="w-full h-32 object-cover rounded-md mb-2" />
                        <h3 className="font-semibold text-lg">{artist.name}</h3>
                        <p className="text-sm text-muted-foreground">{artist.musicType}</p>
                        <div className={`mt-2 px-2 py-1 rounded-full text-xs font-semibold inline-block
                          ${artist.status === 'added' ? 'bg-green-100 text-green-800' : 
                            artist.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedArtist && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Chat with {selectedArtist.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatInterface 
              artist={selectedArtist.name} 
              onBack={() => setSelectedArtist(null)}
              customArtistData={selectedArtist}
            />
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>
              {dialogContent.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

