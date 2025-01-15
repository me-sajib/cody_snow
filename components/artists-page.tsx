"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TrendingUp, Heart, Music } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Toggle } from "@/components/ui/toggle"

export const artists = [
  { id: "1", name: "Luna Starlight", image: "https://picsum.photos/seed/luna/200", trending: true, description: "Pop sensation with ethereal vocals and dreamy melodies." },
  { id: "2", name: "The Groove Masters", image: "https://picsum.photos/seed/groove/200", trending: false, description: "Funk collective with infectious rhythms and brass-heavy arrangements." },
  { id: "3", name: "Elijah Soulful", image: "https://picsum.photos/seed/elijah/200", trending: true, description: "R&B artist known for smooth vocals and heartfelt lyrics." },
  { id: "4", name: "Neon Dreamers", image: "https://picsum.photos/seed/neon/200", trending: false, description: "Synthwave band creating retro-futuristic soundscapes." },
  { id: "5", name: "Aria Moonbeam", image: "https://picsum.photos/seed/aria/200", trending: true, description: "Indie folk artist with haunting melodies and introspective lyrics." },
  { id: "6", name: "Rhythm Rebels", image: "https://picsum.photos/seed/rhythm/200", trending: false, description: "Rock band known for high-energy performances and catchy hooks." },
  { id: "7", name: "Zephyr & the Windwalkers", image: "https://picsum.photos/seed/zephyr/200", trending: false, description: "Folk ensemble blending traditional and contemporary sounds." },
  { id: "8", name: "Melody Maverick", image: "https://picsum.photos/seed/melody/200", trending: true, description: "Pop artist pushing boundaries with experimental production." },
  { id: "9", name: "Quantum Quartet", image: "https://picsum.photos/seed/quantum/200", trending: false, description: "Jazz fusion group exploring complex harmonies and rhythms." },
  { id: "10", name: "Echo Enigma", image: "https://picsum.photos/seed/echo/200", trending: false, description: "Alternative rock band with atmospheric sounds and cryptic lyrics." },
  { id: "11", name: "Crimson Cascade", image: "https://picsum.photos/seed/crimson/200", trending: true, description: "Metal band known for their intense live performances and technical prowess." },
  { id: "12", name: "Sapphire Serenade", image: "https://picsum.photos/seed/sapphire/200", trending: false, description: "Blues artist with a soulful voice and masterful guitar skills." },
]

export function ArtistsPage({ onSelect, searchTerm, onSearch, onLikeArtist, likedArtists, addError, setIsGenreSearch, isGenreSearch }: { 
  onSelect: (artist: string) => void, 
  searchTerm: string, 
  onSearch: (term: string, searchType: 'artists' | 'savedLyrics' | 'presets' | 'shareSongs') => void,
  onLikeArtist: (artistId: string) => void, 
  likedArtists: string[],
  addError: (message: string) => void,
  setIsGenreSearch: (isGenreSearch: boolean) => void,
  isGenreSearch: boolean
}) {
  //const [isGenreSearch, setIsGenreSearch] = useState(false)
  const [filteredArtists, setFilteredArtists] = useState(artists)

  useEffect(() => {
    const filtered = artists.filter(artist =>
      isGenreSearch
        ? artist.description.toLowerCase().includes(searchTerm.toLowerCase())
        : artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtists(filtered);
  }, [searchTerm, isGenreSearch]);

  const handleGenreToggle = (pressed: boolean) => {
    setIsGenreSearch(pressed);
    onSearch('', 'artists'); // Clear the search when toggling
  };

  const handleLikeArtist = (artistId: string) => {
    onLikeArtist(artistId);
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold">Artists</h2>
      <Alert>
        <AlertDescription>
          Liking an artist will add them to your liked artists list. This helps us personalize your experience.
        </AlertDescription>
      </Alert>
      <div className="flex items-center space-x-2">
        <Toggle
          aria-label="Toggle genre search"
          pressed={isGenreSearch}
          onPressedChange={handleGenreToggle}
        >
          <Music className="h-4 w-4 mr-2" />
          Genre
        </Toggle>
        <p className="text-sm text-muted-foreground">
          {isGenreSearch ? "Searching by genre" : "Searching by artist name"}
        </p>
      </div>
      {filteredArtists.length > 0 && (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredArtists.map((artist) => (
              <Card
                key={artist.id}
                className="cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-sm flex items-center justify-center">
                    {artist.name}
                    {artist.trending && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TrendingUp className="h-4 w-4 ml-1 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This artist is currently trending</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center pt-0 relative">
                  <div className="relative">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-24 h-24 rounded-full object-cover"
                      crossOrigin="anonymous"
                      onClick={() => onSelect(artist.name)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-0 right-0 bg-background rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeArtist(artist.id);
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${likedArtists.includes(artist.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      )}
      {filteredArtists.length === 0 && (
        <p className="text-center text-muted-foreground">No artists found. Try adjusting your search.</p>
      )}
    </motion.div>
  )
}

