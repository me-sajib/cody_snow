"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Edit, Trash2 } from 'lucide-react'

interface Artist {
  id: string;
  name: string;
  description: string;
  geniusLyrics: string[];
}

export function AdminArtistManagement() {
  const { toast } = useToast()
  const [artists, setArtists] = useState<Artist[]>([
    { id: '1', name: 'Taylor Swift', description: 'Pop sensation', geniusLyrics: ['https://genius.com/Taylor-swift-blank-space-lyrics', 'https://genius.com/Taylor-swift-shake-it-off-lyrics'] },
    { id: '2', name: 'Ed Sheeran', description: 'Singer-songwriter', geniusLyrics: ['https://genius.com/Ed-sheeran-shape-of-you-lyrics', 'https://genius.com/Ed-sheeran-perfect-lyrics'] },
    { id: '3', name: 'Beyoncé', description: 'R&B and pop icon', geniusLyrics: ['https://genius.com/Beyonce-halo-lyrics', 'https://genius.com/Beyonce-single-ladies-put-a-ring-on-it-lyrics'] },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditArtist = (artist: Artist) => {
    setEditingArtist(artist)
    setIsEditDialogOpen(true)
  }

  const handleDeleteArtist = (id: string) => {
    setArtists(artists.filter(artist => artist.id !== id))
    toast({
      title: "Artist Deleted",
      description: "The artist has been successfully removed.",
    })
  }

  const handleSaveEdit = () => {
    if (editingArtist) {
      setArtists(artists.map(artist => 
        artist.id === editingArtist.id ? editingArtist : artist
      ))
      setIsEditDialogOpen(false)
      setEditingArtist(null)
      toast({
        title: "Artist Updated",
        description: "The artist information has been successfully updated.",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Artists</h2>
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArtists.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell>{artist.name}</TableCell>
                <TableCell>{artist.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditArtist(artist)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the artist and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteArtist(artist.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Artist</DialogTitle>
          </DialogHeader>
          {editingArtist && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="artist-name">Artist Name</Label>
                <Input
                  id="artist-name"
                  value={editingArtist.name}
                  onChange={(e) => setEditingArtist({ ...editingArtist, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="artist-description">Description</Label>
                <Textarea
                  id="artist-description"
                  value={editingArtist.description}
                  onChange={(e) => setEditingArtist({ ...editingArtist, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="genius-lyrics">Genius Lyrics URLs</Label>
                {editingArtist.geniusLyrics.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={url}
                      onChange={(e) => {
                        const newLyrics = [...editingArtist.geniusLyrics];
                        newLyrics[index] = e.target.value;
                        setEditingArtist({ ...editingArtist, geniusLyrics: newLyrics });
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newLyrics = editingArtist.geniusLyrics.filter((_, i) => i !== index);
                        setEditingArtist({ ...editingArtist, geniusLyrics: newLyrics });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingArtist({ ...editingArtist, geniusLyrics: [...editingArtist.geniusLyrics, ''] })}
                  className="mt-2"
                >
                  Add Genius Lyrics URL
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

