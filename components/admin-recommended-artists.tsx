"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Search } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface Artist {
  id: string;
  name: string;
  isRecommended: boolean;
}

export function AdminRecommendedArtists() {
  const { toast } = useToast()
  const [artists, setArtists] = useState<Artist[]>([
    { id: '1', name: 'Taylor Swift', isRecommended: true },
    { id: '2', name: 'Ed Sheeran', isRecommended: false },
    { id: '3', name: 'Beyoncé', isRecommended: true },
    { id: '4', name: 'Drake', isRecommended: false },
    { id: '5', name: 'Adele', isRecommended: true },
    { id: '6', name: 'The Weeknd', isRecommended: false },
    { id: '7', name: 'Billie Eilish', isRecommended: true },
    { id: '8', name: 'Kendrick Lamar', isRecommended: false },
    { id: '9', name: 'Ariana Grande', isRecommended: true },
    { id: '10', name: 'Post Malone', isRecommended: false },
    { id: '11', name: 'Dua Lipa', isRecommended: true },
    { id: '12', name: 'Justin Bieber', isRecommended: false },
    { id: '13', name: 'Rihanna', isRecommended: true },
    { id: '14', name: 'Shawn Mendes', isRecommended: false },
    { id: '15', name: 'Lady Gaga', isRecommended: true },
  ])
  const [searchTerm, setSearchTerm] = useState('')

  const handleRecommendedChange = (artistId: string, isChecked: boolean) => {
    setArtists(artists.map(artist => 
      artist.id === artistId ? { ...artist, isRecommended: isChecked } : artist
    ))
  }

  const handleSave = () => {
    // Here you would typically send the updated artists to your backend
    console.log('Saving updated recommended artists:', artists)
    toast({
      title: "Changes Saved",
      description: "The recommended artists have been updated.",
    })
  }

  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Recommended Artists</h2>
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
      <div className="border rounded-md">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artist Name</TableHead>
                <TableHead>Recommended</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArtists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={artist.isRecommended}
                      onCheckedChange={(checked) => handleRecommendedChange(artist.id, checked as boolean)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  )
}

