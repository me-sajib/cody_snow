"use client"

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, FolderPlus, Plus, Folder } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SavedLyric {
 id: string
 title: string
 content: string
 createdAt: Date
 folderId: string
}

interface LyricFolder {
 id: string
 name: string
}

interface SavedLyricsProps {
 onLyricSelect: (lyric: SavedLyric) => void
 selectedFolderId: string | null
 searchTerm?: string
 savedLyrics?: SavedLyric[]
}

export function SavedLyrics({ onLyricSelect, selectedFolderId, searchTerm = '', savedLyrics = [] }: SavedLyricsProps) {
 const [lyrics, setLyrics] = useState<SavedLyric[]>(savedLyrics)
 const [folders, setFolders] = useState<LyricFolder[]>([
   { id: 'folder_1', name: 'Pop Songs' },
   { id: 'folder_2', name: 'Rock Ballads' },
   { id: 'folder_3', name: 'Hip Hop' }
 ])
 const [newFolderName, setNewFolderName] = useState('')
 const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false)
 const [currentFolderId, setCurrentFolderId] = useState<string>(selectedFolderId || 'all')
 const [isNewLyricDialogOpen, setIsNewLyricDialogOpen] = useState(false)
 const [newLyric, setNewLyric] = useState<Omit<SavedLyric, 'id' | 'createdAt'>>({
   title: '',
   content: '',
   folderId: ''
 })

 useEffect(() => {
   setCurrentFolderId(selectedFolderId || 'all')
 }, [selectedFolderId])

 const filteredLyrics = lyrics.filter(lyric => 
   (currentFolderId === 'all' || lyric.folderId === currentFolderId || (!lyric.folderId && currentFolderId === 'none')) &&
   (lyric.title.toLowerCase().includes(searchTerm.toLowerCase()) || lyric.content.toLowerCase().includes(searchTerm.toLowerCase()))
 )

 const handleDelete = (id: string) => {
   setLyrics(lyrics.filter(lyric => lyric.id !== id))
 }

 const handleAddFolder = (name: string) => {
   if (name.trim()) {
     const newFolder: LyricFolder = {
       id: `folder_${Date.now()}`,
       name: name.trim()
     }
     setFolders([...folders, newFolder])
     return newFolder.id
   }
   return null
 }

 const handleAddLyric = () => {
   if (newLyric.title && newLyric.content && newLyric.folderId) {
     const lyricToAdd: SavedLyric = {
       ...newLyric,
       id: Date.now().toString(),
       createdAt: new Date()
     }
     setLyrics([...lyrics, lyricToAdd])
     setNewLyric({ title: '', content: '', folderId: '' })
     setIsNewLyricDialogOpen(false)
   }
 }

 const handleMoveLyric = (lyricId: string, newFolderId: string) => {
   setLyrics(lyrics.map(lyric => 
     lyric.id === lyricId ? { ...lyric, folderId: newFolderId === 'none' ? '' : newFolderId } : lyric
   ))
 }

 const x = useMotionValue(0);
 const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
 const rotate = useTransform(x, [-150, 0, 150], [-90, 0, 90], {
   clamp: false,
 });

 return (
   <motion.div
     className="space-y-4"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.5 }}
   >
     <div className="flex justify-between items-center">
       <h2 className="text-2xl font-bold">Saved Lyrics</h2>
       <div className="flex space-x-2">
         <Select value={currentFolderId} onValueChange={setCurrentFolderId}>
           <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="Select Folder" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All</SelectItem>
             <SelectItem value="none">No Folder</SelectItem>
             {folders.map((folder) => (
               <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
             ))}
           </SelectContent>
         </Select>
         <Dialog open={isAddFolderDialogOpen} onOpenChange={setIsAddFolderDialogOpen}>
           <DialogTrigger asChild>
             <Button variant="outline">
               <FolderPlus className="mr-2 h-4 w-4" />
               Add Folder
             </Button>
           </DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Add New Folder</DialogTitle>
             </DialogHeader>
             <Input
               placeholder="Enter folder name"
               value={newFolderName}
               onChange={(e) => setNewFolderName(e.target.value)}
             />
             <DialogFooter>
               <Button onClick={() => {
                 handleAddFolder(newFolderName)
                 setNewFolderName('')
                 setIsAddFolderDialogOpen(false)
               }}>Add Folder</Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
         <Dialog open={isNewLyricDialogOpen} onOpenChange={setIsNewLyricDialogOpen}>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Add New Lyric</DialogTitle>
             </DialogHeader>
             <div className="space-y-4">
               <div>
                 <Label htmlFor="lyric-title">Title</Label>
                 <Input
                   id="lyric-title"
                   value={newLyric.title}
                   onChange={(e) => setNewLyric({ ...newLyric, title: e.target.value })}
                   placeholder="Enter lyric title"
                 />
               </div>
               <div>
                 <Label htmlFor="lyric-content">Content</Label>
                 <Textarea
                   id="lyric-content"
                   value={newLyric.content}
                   onChange={(e) => setNewLyric({ ...newLyric, content: e.target.value })}
                   placeholder="Enter lyric content"
                   rows={5}
                 />
               </div>
               <div>
                 <Label htmlFor="lyric-folder">Folder</Label>
                 <Select
                   value={newLyric.folderId}
                   onValueChange={(value) => {
                     if (value === 'new') {
                       const newFolderName = prompt('Enter new folder name:')
                       if (newFolderName) {
                         const newFolderId = handleAddFolder(newFolderName)
                         if (newFolderId) {
                           setNewLyric({ ...newLyric, folderId: newFolderId })
                         }
                       }
                     } else {
                       setNewLyric({ ...newLyric, folderId: value })
                     }
                   }}
                 >
                   <SelectTrigger id="lyric-folder">
                     <SelectValue placeholder="Select a folder" />
                   </SelectTrigger>
                   <SelectContent>
                     {folders.map((folder) => (
                       <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                     ))}
                     <SelectItem value="new">Create New Folder</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
             <DialogFooter>
               <Button onClick={handleAddLyric}>Save Lyric</Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>
     </div>
     <ScrollArea className="h-[calc(100vh-200px)]">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         {filteredLyrics.map((lyric) => (
           <motion.div
             key={lyric.id}
             drag="x"
             dragConstraints={{ left: 0, right: 0 }}
             style={{ x, scale, rotate }}
             onDragEnd={(event, info) => {
               if (Math.abs(info.offset.x) > 100) {
                 console.log('Easter egg triggered!');
               }
             }}
           >
             <Card
               className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
               onClick={() => onLyricSelect(lyric)}
             >
               <CardHeader>
                 <CardTitle>{lyric.title}</CardTitle>
               </CardHeader>
               <CardContent className="flex-grow">
                 <p className="line-clamp-3">{lyric.content}</p>
                 <p className="text-sm text-muted-foreground mt-2">
                   Folder: {lyric.folderId ? folders.find(f => f.id === lyric.folderId)?.name || 'Unknown' : 'None'}
                 </p>
               </CardContent>
               <CardFooter className="flex justify-between">
                 <span className="text-sm text-muted-foreground">
                   Created: {lyric.createdAt.toLocaleDateString()}
                 </span>
                 <div className="flex space-x-2">
                   <Dialog>
                     <DialogTrigger asChild>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={(e) => e.stopPropagation()}
                       >
                         <Folder className="w-4 h-4 mr-2" />
                         Move
                       </Button>
                     </DialogTrigger>
                     <DialogContent>
                       <DialogHeader>
                         <DialogTitle>Move Lyric to Folder</DialogTitle>
                       </DialogHeader>
                       <Select
                         onValueChange={(value) => handleMoveLyric(lyric.id, value)}
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Select a folder" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="none">No Folder</SelectItem>
                           {folders.map((folder) => (
                             <SelectItem key={folder.id} value={folder.id}>
                               {folder.name}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </DialogContent>
                   </Dialog>
                   <AlertDialog>
                     <AlertDialogTrigger asChild>
                       <button
                         onClick={(e) => e.stopPropagation()}
                         className="text-destructive hover:text-destructive/80"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                       <AlertDialogHeader>
                         <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                         <AlertDialogDescription>
                           This action cannot be undone. This will permanently delete your saved lyric.
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter>
                         <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                         <AlertDialogAction onClick={(e) => {
                           e.stopPropagation();
                           handleDelete(lyric.id);
                         }}>
                           Delete
                         </AlertDialogAction>
                       </AlertDialogFooter>
                     </AlertDialogContent>
                   </AlertDialog>
                 </div>
               </CardFooter>
             </Card>
           </motion.div>
         ))}
       </div>
     </ScrollArea>
   </motion.div>
 )
}

