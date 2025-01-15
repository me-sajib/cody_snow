import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Music, MessageSquare, Heart, ExternalLink } from 'lucide-react'
import { UserProfile } from "@/types/social"
import { motion } from "framer-motion"

interface UserProfileDialogProps {
  user: UserProfile | null;
  onClose: () => void;
}

export function UserProfileDialog({ user, onClose }: UserProfileDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <p className="text-sm text-muted-foreground">
                Joined {user.joinDate.toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm">{user.bio}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{user.stats.songsShared}</div>
              <div className="text-xs text-muted-foreground">Songs Shared</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{user.stats.likesReceived}</div>
              <div className="text-xs text-muted-foreground">Likes Received</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{user.stats.commentsReceived}</div>
              <div className="text-xs text-muted-foreground">Comments Received</div>
            </div>
          </div>

          <Tabs defaultValue="achievements">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements">
              <ScrollArea className="h-[200px] pr-4">
                <div className="grid grid-cols-2 gap-2">
                  {user.achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-2 rounded-lg border ${
                        achievement.unlockedAt ? 'bg-accent' : 'opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.description}
                          </div>
                          {achievement.unlockedAt && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Unlocked {achievement.unlockedAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="connections">
              <div className="space-y-4">
                {Object.entries(user.connections).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <div key={platform} className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {platform}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </a>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

