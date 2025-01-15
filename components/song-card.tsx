"use client"

import { useState, useRef } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Pause, MessageSquare, Heart, Share2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SharedSong, UserProfile } from "@/types/social"
import { motion } from "framer-motion"

interface SongCardProps {
  song: SharedSong;
  onUserClick: (user: UserProfile) => void;
  onCommentUserClick: (user: UserProfile) => void;
}

export function SongCard({ song, onUserClick, onCommentUserClick }: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [localLikeCount, setLocalLikeCount] = useState(song.likes)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLocalLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now().toString(),
        content: newComment.trim(),
        user: song.user, // In a real app, this would be the current user
        createdAt: new Date(),
        likes: 0
      }
      song.comments.push(newCommentObj)
      setNewComment('')
    }
  }

  return (
    <>
      <Card 
        className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:bg-accent"
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="aspect-square relative">
          <img 
            src={song.coverUrl}
            alt={song.title}
            className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold truncate">{song.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
          <div className="flex items-center justify-between mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-transparent p-0"
              onClick={(e) => {
                e.stopPropagation();
                onUserClick(song.user);
              }}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={song.user.avatarUrl} alt={song.user.username} />
                <AvatarFallback>{song.user.username[0]}</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-xs">{song.user.username}</span>
            </Button>
            <span className="text-xs text-muted-foreground">
              {song.plays} plays
            </span>
          </div>
        </div>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{song.title}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img 
                src={song.coverUrl}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{song.artist}</h3>
                  <p className="text-sm text-muted-foreground">
                    Generated with {song.generator}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full",
                      isLiked && "text-red-500"
                    )}
                    onClick={handleLike}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium">{localLikeCount}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </h4>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {song.comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-transparent p-0"
                            onClick={() => onCommentUserClick(comment.user)}
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={comment.user.avatarUrl} alt={comment.user.username} />
                              <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
                            </Avatar>
                            <span className="ml-2 text-sm font-medium">{comment.user.username}</span>
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            {comment.likes}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                />
                <Button onClick={handleAddComment}>Post</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <audio ref={audioRef} src={song.audioUrl} onEnded={() => setIsPlaying(false)} />
    </>
  )
}

