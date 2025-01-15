"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminPanel } from './admin-panel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Cog, ShieldIcon as UserShield, Trash2, Menu, Search, UserCircle, CheckCircle, ExternalLink, X, Trophy, Loader2, LogOut } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DisclaimerModal } from "./disclaimer-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"


interface Notification {
  id: number;
  type: 'like' | 'save' | 'model';
  message: string;
  details: {
    songTitle?: string;
    modelName?: string;
    likedBy?: string;
  };
  read: boolean;
  timestamp: Date;
}

interface Achievement {
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}


export function Header({ 
  currentView, 
  onSearch, 
  artists, 
  onArtistSelect,
  onToggleSidebar,
  showSaveLyricsPrompt,
  onSaveLyrics,
  onViewChange,
  showChat,
  isGenreSearch
}: { 
  currentView: 'home' | 'yourPresets' | 'publicPresets' | 'artists' | 'savedLyrics' | 'artistBlending' | 'shareSongs' | 'background' | 'aiMastering' | 'aiStems', 
  onSearch: (term: string, searchType: 'artists' | 'savedLyrics' | 'presets' | 'shareSongs') => void,
  artists: { name: string, image: string }[],
  onArtistSelect: (artist: string) => void,
  onToggleSidebar: () => void,
  showSaveLyricsPrompt: boolean,
  onSaveLyrics: (save: boolean) => void,
  onViewChange: (view: 'home' | 'yourPresets' | 'publicPresets' | 'artists' | 'savedLyrics' | 'artistBlending' | 'shareSongs' | 'background' | 'aiMastering' | 'aiStems') => void,
  showChat: boolean,
  isGenreSearch: boolean
}) {
  const [showSettings, setShowSettings] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [filterArtist, setFilterArtist] = useState('_all')
  const [showProfile, setShowProfile] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    joinDate: "2023-01-15",
    description: "Aspiring songwriter and music enthusiast.",
    achievements: [
     { name: "First Chat", icon: '💬', description: "Chatted with an artist for the first time", unlocked: false },
     { name: "Wordsmith", icon: '📜', description: "Generated 100 lyrics", unlocked: false },
     { name: "Lyrical Genius", icon: '🎤', description: "Generated 1000 lyrics", unlocked: false },
     { name: "Safekeeper", icon: '💾', description: "Saved 10 lyrics", unlocked: false },
     { name: "Collector", icon: '🗄️', description: "Saved 100 lyrics", unlocked: false },
     { name: "Rising Star", icon: '⭐', description: "Received 100 likes", unlocked: false },
     { name: "Superstar", icon: '✨', description: "Received 1000 likes", unlocked: false },
     { name: "Icon", icon: '🏆', description: "Received 10000 likes", unlocked: false },
     { name: "First Remix", icon: '🎧', description: "Remixed a song using AI Stems", unlocked: false },
     { name: "Master Mixer", icon: '🎛️', description: "Mastered a song using AI Mastering", unlocked: false },
     { name: "Preset Maker", icon: '🎛️', description: "Created your first preset", unlocked: false },
     { name: "Preset Master", icon: '🧠', description: "Created 10 presets", unlocked: false },
     { name: "Artist Curator", icon: '🎨', description: "Uploaded your first artist", unlocked: false },
     { name: "Artist Collector", icon: '👥', description: "Uploaded 10 artists", unlocked: false },
    ],
    permissions: ["user", "admin"],
    avatarUrl: "/placeholder-avatar.jpg",
    plan: "Pro",
    udoiProfile: "",
    sunoProfile: "",
    murekaProfile: "",
    sonautoProfile: "",
    stats: {
      songsShared: 0,
      likesReceived: 0,
    },
    connections: {
      Udio: '',
      Suno: '',
      Mureka: '',
      Sonauto: ''
    }
  })
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, 
      type: 'like', 
      message: "Someone liked your preset!", 
      details: { likedBy: "JohnDoe" },
      read: false,
      timestamp: new Date()
    },
    { 
      id: 2, 
      type: 'save', 
      message: "Your lyrics have been saved.", 
      details: { songTitle: "Summer Nights" },
      read: false,
      timestamp: new Date()
    },
    { 
      id: 3, 
      type: 'model', 
      message: "Your requested artist is now available!", 
      details: { modelName: "The Beatles" },
      read: false,
      timestamp: new Date()
    },
  ])

  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 

  const getPlaceholder = () => {
    switch (currentView) {
      case 'savedLyrics':
        return "Search saved lyrics..."
      case 'publicPresets':
        return "Search public presets..."
      case 'yourPresets':
        return "Search your presets..."
      case 'shareSongs':
        return "Search shared songs..."
      case 'home':
      case 'background':
      case 'artists':
      case 'aiMastering':
      case 'aiStems':
      default:
        return "Search artists..."
    }
  }


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Define pages that should redirect to Artists page on search
    const artistSearchPages = ['home', 'background', 'artists', 'aiMastering', 'aiStems'];
    
    if (artistSearchPages.includes(currentView)) {
      if (term.trim() !== '') {
        onViewChange('artists');
      }
      if (typeof onSearch === 'function') {
        onSearch(term, 'artists');
      }
    } else {
      if (typeof onSearch === 'function') {
        onSearch(term, currentView as 'artists' | 'savedLyrics' | 'presets' | 'shareSongs');
      }
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const formatNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.details.likedBy} liked your preset!`
      case 'save':
        return `Your lyrics for "${notification.details.songTitle}" have been saved.`
      case 'model':
        return `Your requested artist "${notification.details.modelName}" is now available!`
      default:
        return notification.message
    }
  }

  const unlockAchievement = (achievementName: string) => {
    const achievement = userProfile.achievements.find(a => a.name === achievementName);
    if (achievement && !achievement.unlocked) {
      const updatedAchievements = userProfile.achievements.map(a => 
        a.name === achievementName ? { ...a, unlocked: true } : a
      );
      setUserProfile(prev => ({ ...prev, achievements: updatedAchievements }));
      setUnlockedAchievement(achievement);
      
      setTimeout(() => {
        setUnlockedAchievement(null);
      }, 5000);
    }
  };

  const checkAndUnlockAchievements = () => {
    
  };

  const handleFirstChat = () => {
    if (!userProfile.achievements.find(a => a.name === "First Chat")?.unlocked) {
      unlockAchievement("First Chat");
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
    // You might want to clear user session, redirect to login page, etc.
    // For example:
    // router.push('/login');
  };

  useEffect(() => {
    checkAndUnlockAchievements();
  }, [userProfile]);

  const validateProfileUrl = (url: string, domain: string) => {
    if (!url) return true; 
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.startsWith(domain);
    } catch {
      return false;
    }
  }

  const handleProfileUpdate = (field: string, value: string) => {
    let isValid = true;
    switch (field) {
      case 'udoiProfile':
        isValid = validateProfileUrl(value, 'udio.com');
        break;
      case 'sunoProfile':
        isValid = validateProfileUrl(value, 'suno.com');
        break;
      case 'murekaProfile':
        isValid = validateProfileUrl(value, 'mureka.ai');
        break;
      case 'sonautoProfile':
        isValid = validateProfileUrl(value, 'sonauto.com');
        break;
    }

    if (isValid) {
      setUserProfile(prev => ({ ...prev, [field]: value }));
    } else {
      toast({
        title: "Invalid URL",
        description: `Please enter a valid ${field.replace('Profile', '')} profile URL.`,
        variant: "destructive",
      });
    }
  }

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Button variant="ghost" className="md:hidden" onClick={onToggleSidebar}>
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex-1 mx-4">
        {showSaveLyricsPrompt ? (
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-bold mr-4">Save Lyrics?</h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onSaveLyrics(false)}>No</Button>
              <Button onClick={() => onSaveLyrics(true)}>Yes</Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={isGenreSearch ? "Search genres..." : getPlaceholder()}
              className="w-full pl-8"
              value={searchTerm} 
              onChange={handleSearch}
            />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DisclaimerModal />
        {notificationsEnabled && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Notifications</h3>
                <div className="space-x-2">
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearNotifications}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-muted-foreground">No notifications</p>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-2 rounded ${notification.read ? 'bg-muted' : 'bg-muted/50'}`}
                    >
                      <p className="text-sm">{formatNotificationMessage(notification)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp ? notification.timestamp.toLocaleString() : 'No date'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="User avatar"
                  className="rounded-full"
                  width={32}
                  height={32}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setShowProfileModal(true)}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Your Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowSettings(true)}>
                <Cog className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowAdminPanel(true)}>
                <UserShield className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLogout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
      {showSettings && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm border-l bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="default-model">Default AI Model</Label>
                <Select defaultValue="cody-artist-lyrics">
                  <SelectTrigger id="default-model">
                    <SelectValue placeholder="Select default model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cody-artist-lyrics">Cody Artist Lyrics 🎵</SelectItem>
                    <SelectItem value="cody-artist-exp">Cody Artist Exp 🚀</SelectItem>
                    <SelectItem value="cody-artist-x1">Cody Artist X1 ⚡</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="theme-mode">Theme Mode</Label>
                <Select defaultValue="system">
                  <SelectTrigger id="theme-mode">
                    <SelectValue placeholder="Select theme mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
                <Label htmlFor="notifications">Enable Notifications</Label>
              </div>
              <Button variant="destructive" className="w-full" onClick={() => {
                console.log("Wiping all saved lyrics");
                toast({
                  title: "All saved lyrics wiped",
                  description: "Your saved lyrics have been deleted.",
                  variant: "destructive",
                });
              }}>
                Wipe All Saved Lyrics
              </Button>
              <Button onClick={() => setShowSettings(false)} className="w-full">Close</Button>
            </div>
          </div>
        </div>
      )}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="bg-card rounded-lg shadow-lg p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <Button onClick={() => setShowAdminPanel(false)}>Close</Button>
              </div>
              <AdminPanel />
            </div>
          </div>
        </div>
      )}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Your Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Joined on {new Date(userProfile.joinDate).toLocaleDateString()}
                </p>
                <Badge variant="secondary" className="mt-1">{userProfile.plan} Plan</Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{userProfile.achievements.filter(a => a.unlocked).length}</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{userProfile.stats.songsShared}</div>
                <div className="text-xs text-muted-foreground">Songs Shared</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{userProfile.stats.likesReceived}</div>
                <div className="text-xs text-muted-foreground">Likes Received</div>
              </div>
            </div>

            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <div className="space-y-2">
                  <Label htmlFor="description">About Me</Label>
                  <Textarea
                    id="description"
                    value={userProfile.description}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>
              <TabsContent value="achievements">
                <ScrollArea className="h-[200px] pr-4">
                  <div className="grid grid-cols-2 gap-2">
                    {userProfile.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg border ${
                          achievement.unlocked ? 'bg-accent' : 'opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <div className="font-medium text-sm">{achievement.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {achievement.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="connections">
                <div className="space-y-4">
                  {Object.entries(userProfile.connections).map(([platform, url]) => (
                    <div key={platform} className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {platform}
                      </Badge>
                      {url ? (
                        <div className="flex items-center gap-2">
                          <Input value={url} readOnly className="w-48" />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleProfileUpdate(platform + 'Profile' as keyof typeof userProfile, '')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newUrl = prompt(`Enter your ${platform} profile URL:`);
                            if (newUrl) handleProfileUpdate(platform + 'Profile' as keyof typeof userProfile, newUrl);
                          }}
                        >
                          Add {platform}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
      <AnimatePresence>
        {unlockedAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex items-center space-x-4"
          >
            <Trophy className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Achievement Unlocked!</h3>
              <p>{unlockedAchievement.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

