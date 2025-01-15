import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FaFolder, FaEdit, FaTrash } from 'react-icons/fa'

interface Lyric {
  id: string
  title: string
  artist: string
  folderId: string
  createdAt: Date
}

interface LyricFolder {
  id: string;
  name: string;
}

interface LyricsManagerProps {
  selectedFolderId: string | null;
  userId: string;
}

export function LyricsManager({ selectedFolderId, userId }: LyricsManagerProps) {
  const [lyrics, setLyrics] = useState<Lyric[]>([
    { id: '1', title: 'Summer Nights', artist: 'The Groove Masters', folderId: `${userId}_1`, createdAt: new Date('2023-06-15') },
    { id: '2', title: 'Neon Dreams', artist: 'Luna Starlight', folderId: `${userId}_1`, createdAt: new Date('2023-06-20') },
    { id: '3', title: 'Rocking All Night', artist: 'Rhythm Rebels', folderId: `${userId}_2`, createdAt: new Date('2023-06-25') },
    { id: '4', title: 'Urban Beat', artist: 'Elijah Soulful', folderId: `${userId}_3`, createdAt: new Date('2023-06-30') },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterArtist, setFilterArtist] = useState('_all')
  const [filterFolder, setFilterFolder] = useState('_all')
  const [sortBy, setSortBy] = useState('newest')

  const [folders, setFolders] = useState<LyricFolder[]>([
    { id: `${userId}_1`, name: 'Pop Songs' },
    { id: `${userId}_2`, name: 'Rock Ballads' },
    { id: `${userId}_3`, name: 'Hip Hop' },
  ])

  useEffect(() => {
    if (selectedFolderId) {
      setFilterFolder(selectedFolderId);
    }
  }, [selectedFolderId]);

  const filteredAndSortedLyrics = lyrics
    .filter(lyric => 
      lyric.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterArtist === '_all' || lyric.artist === filterArtist) &&
      (filterFolder === '_all' || lyric.folderId === filterFolder)
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt.getTime() - a.createdAt.getTime()
      if (sortBy === 'oldest') return a.createdAt.getTime() - b.createdAt.getTime()
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return 0
    })

  const artists = Array.from(new Set(lyrics.map(lyric => lyric.artist)))

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search lyrics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={filterArtist} onValueChange={setFilterArtist}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Artist" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Artists</SelectItem>
            {artists.map(artist => (
              <SelectItem key={artist} value={artist}>{artist}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterFolder} onValueChange={setFilterFolder}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Folders</SelectItem>
            {folders.map(folder => (
              <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedLyrics.map((lyric) => (
            <Card key={lyric.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {lyric.title}
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm">
                      <FaEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FaTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p><strong>Artist:</strong> {lyric.artist}</p>
                <p><strong>Folder:</strong> <FaFolder className="inline mr-1" />{folders.find(f => f.id === lyric.folderId)?.name}</p>
                <p><strong>Created:</strong> {lyric.createdAt.toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

