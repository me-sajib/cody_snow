"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SongCard } from '@/components/song-card'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search } from 'lucide-react'
import { UserProfileDialog } from '@/components/user-profile-dialog'
import { SharedSong, UserProfile, Achievement } from '@/types/social'

// Sample achievements
const achievements: Achievement[] = [
  {
    id: "1",
    name: "First Share",
    icon: "🎵",
    description: "Share your first song",
  },
  {
    id: "2",
    name: "Rising Star",
    icon: "⭐",
    description: "Receive 100 likes",
  },
  {
    id: "3",
    name: "Community Voice",
    icon: "💬",
    description: "Leave 50 comments",
  },
  {
    id: "4",
    name: "Trending Artist",
    icon: "📈",
    description: "Have a song in trending",
  },
  {
    id: "5",
    name: "Collaboration King",
    icon: "👥",
    description: "Collaborate with 5 different artists",
  },
]

// Sample users
const users: UserProfile[] = [
  {
    id: "1",
    username: "MelodyMaster",
    avatarUrl: "/placeholder.svg?height=100&width=100&text=MM",
    joinDate: new Date("2023-01-15"),
    bio: "Creating vibes and spreading good music 🎵",
    achievements: achievements.map(a => ({
      ...a,
      unlockedAt: Math.random() > 0.5 ? new Date() : undefined
    })),
    connections: {
      udio: "https://udio.com/melodymaster",
      suno: "https://suno.com/melodymaster",
    },
    stats: {
      songsShared: 15,
      likesReceived: 230,
      commentsReceived: 45,
    }
  },
  {
    id: "2",
    username: "BeatBuilder",
    avatarUrl: "/placeholder.svg?height=100&width=100&text=BB",
    joinDate: new Date("2023-03-20"),
    bio: "Professional producer turned AI enthusiast 🎧",
    achievements: achievements.map(a => ({
      ...a,
      unlockedAt: Math.random() > 0.5 ? new Date() : undefined
    })),
    connections: {
      mureka: "https://mureka.ai/beatbuilder",
      sonauto: "https://sonauto.com/beatbuilder",
    },
    stats: {
      songsShared: 8,
      likesReceived: 156,
      commentsReceived: 32,
    }
  },
]

// Sample shared songs with comments
const sampleSharedSongs: SharedSong[] = [
  {
    id: "1",
    title: "Neon Dreams",
    artist: "MelodyMaster ft. AI",
    coverUrl: "/placeholder.svg?height=300&width=300&text=ND",
    audioUrl: "/sample-audio.mp3",
    user: users[0],
    createdAt: new Date("2024-01-05"),
    likes: 156,
    plays: 342,
    generator: "Suno",
    comments: [
      {
        id: "1",
        content: "This is absolutely incredible! The way you've blended the AI generation with your own style is seamless.",
        user: users[1],
        createdAt: new Date("2024-01-05T12:00:00"),
        likes: 12,
      },
    ]
  },
  {
    id: "2",
    title: "Digital Sunset",
    artist: "BeatBuilder x Suno",
    coverUrl: "/placeholder.svg?height=300&width=300&text=DS",
    audioUrl: "/sample-audio.mp3",
    user: users[1],
    createdAt: new Date("2024-01-04"),
    likes: 89,
    plays: 245,
    generator: "Suno",
    comments: [
      {
        id: "2",
        content: "The progression in this piece is mind-blowing! Would love to collab sometime.",
        user: users[0],
        createdAt: new Date("2024-01-04T15:30:00"),
        likes: 8,
      },
    ]
  },
]

export default function ShareSongs() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [songs, setSongs] = useState<SharedSong[]>(sampleSharedSongs)

  const filteredSongs = songs

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Creations</h1>
          <p className="text-sm text-muted-foreground">
            Discover and share AI-generated music with the community
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Share Creation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Creation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="song-title">Song Title</Label>
                <Input
                  id="song-title"
                  placeholder="Enter song title"
                />
              </div>
              <div>
                <Label htmlFor="song-artist">Artist Credit</Label>
                <Input
                  id="song-artist"
                  placeholder="How should the artist be credited?"
                />
              </div>
              <div>
                <Label htmlFor="song-generator">AI Generator Used</Label>
                <Select>
                  <SelectTrigger id="song-generator">
                    <SelectValue placeholder="Select AI generator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="udio">Udio</SelectItem>
                    <SelectItem value="suno">Suno</SelectItem>
                    <SelectItem value="mureka">Mureka</SelectItem>
                    <SelectItem value="sonauto">Sonauto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="song-file">Audio File</Label>
                <Input
                  id="song-file"
                  type="file"
                  accept="audio/*"
                />
              </div>
              <div>
                <Label htmlFor="song-cover">Cover Art</Label>
                <Input
                  id="song-cover"
                  type="file"
                  accept="image/*"
                />
              </div>
              <Button className="w-full">Share</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredSongs.map((song) => (
            <SongCard 
              key={song.id} 
              song={song}
              onUserClick={() => setSelectedUser(song.user)}
              onCommentUserClick={(user) => setSelectedUser(user)}
            />
          ))}
        </div>
      </ScrollArea>

      <UserProfileDialog
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}

