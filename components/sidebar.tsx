import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { X, BookOpen, Home, Music, Save, Settings, Globe, User, Mic, Image, Folder, ChevronDown, ChevronRight, Crown, Sparkles, Wand2, Layers, Check, ImagePlus } from 'lucide-react'
import { LegalModal } from './legal-modal'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import styles from '@/styles/Sidebar.module.css';

interface LyricFolder {
 id: string;
 name: string;
 songs: string[];
}

interface SidebarProps {
 onViewChange: (view: 'home' | 'yourPresets' | 'publicPresets' | 'artists' | 'savedLyrics' | 'background' | 'artistBlending' | 'createArtist' | 'shareSongs' | 'aiMastering' | 'aiStems' | 'imageToLyrics') => void
 onFolderSelect: (folderId: string) => void
 isOpen: boolean
 onClose: () => void
 userId: string
 isPro: boolean
 isPremium: boolean
}

export function Sidebar({ onViewChange, onFolderSelect, isOpen, onClose, userId, isPro, isPremium }: SidebarProps) {
 const [showTOS, setShowTOS] = useState(false)
 const [showPrivacy, setShowPrivacy] = useState(false)

 const [lyricFolders, setLyricFolders] = useState<LyricFolder[]>([
   { id: 'folder_1', name: 'Pop Songs', songs: ['Summer Vibes', 'City Lights', 'Neon Dreams'] },
   { id: 'folder_2', name: 'Rock Ballads', songs: ['Heartache', 'Midnight Drive', 'Eternal Flame'] },
   { id: 'folder_3', name: 'Hip Hop', songs: ['Urban Beat', 'Street Life', 'Rhythm & Rhyme'] },
   { id: 'folder_4', name: 'Electronic Beats', songs: ['Pulse', 'Synthwave', 'Electric Feel'] },
   { id: 'folder_5', name: 'Acoustic Jams', songs: ['Fireside', 'Sunrise', 'Ocean Breeze'] },
 ])

 const sidebarRef = useRef<HTMLDivElement>(null);
 const lyricFoldersRef = useRef<HTMLDivElement>(null);
 const [lyricFoldersHeight, setLyricFoldersHeight] = useState(100);


 useEffect(() => {
   const checkOverflow = () => {
     if (sidebarRef.current) {
       const isOverflowing = sidebarRef.current.scrollHeight > window.innerHeight;
     }
   };

   checkOverflow();

 }, []);

 const handleLyricFoldersResize = (e: React.MouseEvent<HTMLDivElement>) => {
   const startY = e.clientY;
   const startHeight = lyricFoldersHeight;

   const handleMouseMove = (e: MouseEvent) => {
     const deltaY = e.clientY - startY;
     setLyricFoldersHeight(Math.max(50, startHeight + deltaY));
   };

   const handleMouseUp = () => {
     window.removeEventListener('mousemove', handleMouseMove);
     window.removeEventListener('mouseup', handleMouseUp);
   };

   window.addEventListener('mousemove', handleMouseMove);
   window.addEventListener('mouseup', handleMouseUp);
 };


 return (
  <>
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
    )}
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 flex flex-col h-screen max-h-screen overflow-hidden`}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Music className="h-6 w-6 mr-2 text-purple-500" />
          <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 ${styles.animateGradientX}`}>CodyAI</h2>
        </div>
        <Button variant="ghost" className="md:hidden" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto md:overflow-y-auto sidebar-content">
        <nav className="space-y-2 p-2">
          <Button key="home" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('home')}>
             <Home className="mr-2 h-4 w-4" />
             Home
           </Button>
           <Button key="background" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('background')}>
             <Image className="mr-2 h-4 w-4" />
             Background
           </Button>
           <Button key="artists" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('artists')}>
             <Mic className="mr-2 h-4 w-4" />
             Artists
           </Button>
           <Button key="savedLyrics" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('savedLyrics')}>
             <Save className="mr-2 h-4 w-4" />
             Saved Lyrics
           </Button>
           <Button key="artistBlending" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('artistBlending')}>
             <Crown className="mr-2 h-4 w-4 text-yellow-400" />
             Artist Blending
             {!isPro && <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-1 rounded-full">PRO</span>}
           </Button>
           <Button key="imageToLyrics" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('imageToLyrics')}>
             <ImagePlus className="mr-2 h-4 w-4 text-yellow-400" />
             Image to Lyrics
             {!isPro && <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-1 rounded-full">PRO</span>}
           </Button>
           <Button key="artistify" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('createArtist')}>
             <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
             Artistify
             {!isPro && <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-1 rounded-full">PRO</span>}
           </Button>
           <Button key="publicPresets" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('publicPresets')}>
             <Globe className="mr-2 h-4 w-4" />
             Public Presets
           </Button>
           <Button key="yourPresets" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('yourPresets')}>
             <User className="mr-2 h-4 w-4" />
             Your Presets
           </Button>
           <Button key="aiMastering" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('aiMastering')}>
             <Wand2 className="mr-2 h-4 w-4 text-blue-400" />
             AI Mastering
             {!isPremium && <span className="ml-2 text-xs bg-gradient-to-r from-blue-400 to-pink-600 text-black font-semibold px-1 rounded-full">PREMIUM</span>}
           </Button>
           <Button key="aiStems" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('aiStems')}>
             <Layers className="mr-2 h-4 w-4 text-pink-600" />
             AI Stems
             {!isPremium && <span className="ml-2 text-xs bg-gradient-to-r from-blue-400 to-pink-600 text-black font-semibold px-1 rounded-full">PREMIUM</span>}
           </Button>
           <Button key="shareSongs" variant="ghost" className="w-full justify-start" onClick={() => onViewChange('shareSongs')}>
             <Music className="mr-2 h-4 w-4" />
             Share Songs
           </Button>
        </nav>
        <div className="border-t border-border my-2"></div>
        <div className="p-2">
          <h3 className="font-semibold mb-2">Lyric Folders</h3>
          <ScrollArea className="h-[100px] max-h-[30vh] pr-2" type="auto">
            {lyricFolders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center justify-between w-full px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                onClick={() => {
                  onFolderSelect(folder.id);
                  onViewChange('savedLyrics');
                }}
              >
                <span className="flex items-center">
                  <Folder className="mr-2 h-4 w-4" />
                  {folder.name}
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="border-t border-border my-2"></div>
      </div>
      <div className="p-2 mt-auto shrink-0 md:border-t-0 border-t border-border sticky bottom-0 bg-card">
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground mt-2">
          <button onClick={() => setShowTOS(true)} className="hover:underline">Terms of Service</button>
          <button onClick={() => setShowPrivacy(true)} className="hover:underline">Privacy Policy</button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mb-2">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-[#1a103c]">
            <div className="flex flex-col items-center gap-6">
               <Tabs defaultValue="monthly" className="w-full">
                 <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                   <TabsTrigger
                     value="monthly"
                     className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                   >
                     Monthly plan
                   </TabsTrigger>
                   <TabsTrigger
                     value="yearly"
                     className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                   >
                     Yearly plan
                   </TabsTrigger>
                 </TabsList>

                 <TabsContent value="monthly">
                   <div className="grid md:grid-cols-2 gap-4">
                     {/* Pro Plan - Monthly */}
                     <div className="rounded-lg border bg-card p-6 flex flex-col gap-4">
                       <div className="flex items-center gap-2">
                         <span className="font-semibold">Pro Plan</span>
                       </div>

                       <div className="flex items-baseline">
                         <span className="text-4xl font-bold text-cyan-400">$10</span>
                         <span className="text-muted-foreground">/month</span>
                       </div>

                       <div className="text-sm text-muted-foreground">
                         First month: $5 (50% off)
                       </div>

                       <Button className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-500 hover:to-purple-500">
                         Subscribe
                       </Button>

                       <ul className="space-y-2 text-sm">
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Artist Blending
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Artistify - Create your own AI artist
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Early access to new features
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           No generation queues
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Access to upcoming models
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-blue-400" />
                           Image to Lyrics - Transform visuals into captivating lyrics
                         </li>
                       </ul>
                     </div>

                     {/* Premium Plan - Monthly */}
                     <div className="rounded-lg border bg-card p-6 flex flex-col gap-4 relative">
                       <div className="absolute -top-2 -right-2">
                         <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                           ⚡ 50% off first month
                         </Badge>
                       </div>

                       <div className="flex items-center gap-2">
                         <span className="font-semibold">Premium Plan</span>
                       </div>

                       <div className="flex items-baseline">
                         <span className="text-4xl font-bold text-cyan-400">$15</span>
                         <span className="text-muted-foreground">/month</span>
                       </div>

                       <div className="text-sm text-muted-foreground">
                         First month: $7.50 (50% off)
                       </div>

                       <Button className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-500 hover:to-purple-500">
                         Subscribe
                       </Button>

                       <ul className="space-y-2 text-sm">
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Everything in Pro plan
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           AI Mastering
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           AI Stems separation
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Remove vocals, background vocals, and reverb
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Advanced audio controls
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Priority model additions and updates
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Exclusive access to beta features
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Priority support
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Unlimited high-quality exports
                         </li>
                       </ul>
                     </div>
                   </div>
                 </TabsContent>

                 <TabsContent value="yearly">
                   <div className="grid md:grid-cols-2 gap-4">
                     {/* Pro Plan - Yearly */}
                     <div className="rounded-lg border bg-card p-6 flex flex-col gap-4">
                       <div className="flex items-center gap-2">
                         <span className="font-semibold">Pro Plan</span>
                       </div>

                       <div className="flex items-baseline">
                         <span className="text-4xl font-bold text-cyan-400">$100</span>
                         <span className="text-muted-foreground">/year</span>
                       </div>

                       <div className="text-sm text-muted-foreground">
                         Save $20 compared to monthly
                       </div>

                       <Button className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-500 hover:to-purple-500">
                         Subscribe
                       </Button>

                       <ul className="space-y-2 text-sm">
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Artist Blending
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Artistify - Create your own AI artist
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Early access to new features
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           No generation queues
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Access to upcoming models
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-blue-400" />
                           Image to Lyrics - Transform visuals into captivating lyrics
                         </li>
                       </ul>
                     </div>

                     {/* Premium Plan - Yearly */}
                     <div className="rounded-lg border bg-card p-6 flex flex-col gap-4 relative">
                       <div className="absolute -top-2 -right-2">
                         <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                           ⚡ Best value
                         </Badge>
                       </div>

                       <div className="flex items-center gap-2">
                         <span className="font-semibold">Premium Plan</span>
                       </div>

                       <div className="flex items-baseline">
                         <span className="text-4xl font-bold text-cyan-400">$150</span>
                         <span className="text-muted-foreground">/year</span>
                       </div>

                       <div className="text-sm text-muted-foreground">
                         Save $30 compared to monthly
                       </div>

                       <Button className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-500 hover:to-purple-500">
                         Subscribe
                       </Button>

                       <ul className="space-y-2 text-sm">
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Everything in Pro plan
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           AI Mastering
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           AI Stems separation
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Remove vocals, background vocals, and reverb
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Advanced audio controls
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Priority model additions and updates
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Exclusive access to beta features
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Priority support
                         </li>
                         <li className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-cyan-400" />
                           Unlimited high-quality exports
                         </li>
                       </ul>
                     </div>
                   </div>
                 </TabsContent>
               </Tabs>

               <div className="flex gap-4 text-sm text-muted-foreground">
                 <button onClick={() => setShowPrivacy(true)} className="hover:underline">Privacy Policy</button>
                 <span>|</span>
                 <button onClick={() => setShowTOS(true)} className="hover:underline">Terms of Service</button>
               </div>
             </div>
           </DialogContent>
         </Dialog>
        <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md text-xs font-bold inline-block">
          BETA
        </div>
      </div>
    </div>
    <LegalModal
      isOpen={showTOS}
      onClose={() => setShowTOS(false)}
      title="Terms of Service"
      content="Terms of Service content goes here"
    />
    <LegalModal
      isOpen={showPrivacy}
      onClose={() => setShowPrivacy(false)}
      title="Privacy Policy"
      content="Privacy Policy content goes here"
    />
  </>
);
}

