"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { LyricGenerator } from '@/components/lyric-generator'
import { ChatInterface } from '@/components/chat-interface'
import { AIRecommendations } from '@/components/ai-recommendations'
import { RequestArtist } from '@/components/request-artist'
import { YourPresets } from '@/components/your-presets'
import { PublicPresets } from '@/components/public-presets'
import { ArtistsPage } from '@/components/artists-page'
import { FeaturedArtists } from '@/components/recommended-artists'
import { SavedLyrics } from '@/components/saved-lyrics'
import { SavedLyric } from '@/types/savedLyric'
import { Button } from "@/components/ui/button"
import { Rocket } from 'lucide-react'
import { BackgroundPage } from '@/components/background-page'
import { LyricsManager } from '@/components/lyrics-manager'
import { ArtistBlending } from '@/components/artist-blending'
import CreateArtistPage from '@/app/create-artist/page'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Zap } from 'lucide-react'
import ShareSongs from '@/app/share-songs/page'
import { ArtistChat } from '@/components/artist-chat'
import { ErrorDisplay } from '@/components/error-display'
import { AIMastering } from '@/components/ai-mastering'
import { AIStems } from '@/components/ai-stems'
import { artists } from '@/components/artist-selection'
import { DiscordConnectedPopup } from '@/components/discord-connected-popup'
import { ImageToLyrics } from '@/components/image-to-lyrics'

interface DashboardProps {}

const pageIds = {
  home: 'home',
  yourPresets: 'yourPresets',
  publicPresets: 'publicPresets',
  artists: 'artists',
  savedLyrics: 'savedLyrics',
  background: 'background',
  artistBlending: 'artistBlending',
  createArtist: 'createArtist',
  chat: 'chat',
  shareSongs: 'shareSongs',
  aiMastering: 'aiMastering',
  aiStems: 'aiStems',
  imageToLyrics: 'imageToLyrics'
};

export function Dashboard({}: DashboardProps) {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'yourPresets' | 'publicPresets' | 'artists' | 'savedLyrics' | 'background' | 'artistBlending' | 'createArtist' | 'shareSongs' | 'aiMastering' | 'aiStems' | 'imageToLyrics'>('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showSaveLyricsPrompt, setShowSaveLyricsPrompt] = useState(false)
  const [selectedSavedLyric, setSelectedSavedLyric] = useState<SavedLyric | null>(null)
  const [showRocket, setShowRocket] = useState(true)
  const [likedArtists, setLikedArtists] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([])
  const [filteredData, setFilteredData] = useState({
    artists: artists,
    savedLyrics: [], // Initialize with your saved lyrics data
    presets: [], // Initialize with your presets data
    sharedSongs: [], // Initialize with your shared songs data
  });
  const [searchTerm, setSearchTerm] = useState(''); // Added state for search term
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulating logged-in state
  const [username, setUsername] = useState("DiscordUser#1234");
  const [avatarUrl, setAvatarUrl] = useState("https://cdn.discordapp.com/avatars/123456789/abcdef123456.png");
  const [isGenreSearch, setIsGenreSearch] = useState(false);


  useEffect(() => {
    if (currentView === 'home') {
      setShowRocket(true);
      const timer = setTimeout(() => {
        setShowRocket(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentView])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const handleArtistSelect = (artist: string) => {
    setSelectedArtist(artist)
    setSelectedSavedLyric(null)
    setShowChat(true)
  }

  const handleSavedLyricSelect = (lyric: SavedLyric) => {
    setSelectedSavedLyric(lyric)
    setSelectedArtist(null)
    setShowChat(true)
  }

  const handleSaveLyrics = (save: boolean) => {
    if (save) {
      triggerSaveAnimation();
      // Implement the save functionality here
      console.log("Saving lyrics")
    }
    setShowSaveLyricsPrompt(false)
  }

  const handleLikeArtist = (artistId: string) => {
    setLikedArtists(prev => {
      if (prev.includes(artistId)) {
        return prev.filter(id => id !== artistId);
      } else {
        return [...prev, artistId];
      }
    });
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    setCurrentView('savedLyrics');
  };

  const triggerSaveAnimation = () => {
    const chatContent = document.querySelector('.flex-grow.flex.flex-col.space-y-4.p-4.pt-0.overflow-hidden');
    if (!chatContent) return;

    const container = document.createElement('div');
    container.className = 'absolute inset-0 flex items-center justify-center z-50 pointer-events-none';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';

    const content = document.createElement('div');
    content.className = 'bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 animate-scale-fade';
    content.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="text-lg font-semibold">Saved!</span>
    `;

    container.appendChild(content);
    chatContent.appendChild(container);

    setTimeout(() => {
      container.classList.add('animate-fade-out');
      setTimeout(() => {
        chatContent.removeChild(container);
      }, 500);
    }, 2000);
  };

  const handleUpgradeToPro = () => {
    setIsPro(true);
  }

  const handleUpgradeToPremium = () => {
    setIsPremium(true);
  }

  const addError = (message: string) => {
    setErrors(prev => [...prev, { id: Date.now().toString(), message }])
  }

  const dismissError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id))
  }

  const clearAllErrors = () => {
    setErrors([])
  }

  const handleSearch = (term: string, searchType: 'artists' | 'savedLyrics' | 'presets' | 'shareSongs') => {
    setSearchTerm(term);
    switch (searchType) {
      case 'artists':
        // Filtering is done in ArtistsPage component
        break;
      case 'savedLyrics':
        setFilteredData(prev => ({
          ...prev,
          savedLyrics: prev.savedLyrics.filter(lyric =>
            lyric.title.toLowerCase().includes(term.toLowerCase()) ||
            lyric.content.toLowerCase().includes(term.toLowerCase())
          )
        }));
        break;
      case 'presets':
        setFilteredData(prev => ({
          ...prev,
          presets: prev.presets.filter(preset =>
            preset.name.toLowerCase().includes(term.toLowerCase())
          )
        }));
        break;
      case 'shareSongs':
        setFilteredData(prev => ({
          ...prev,
          sharedSongs: prev.sharedSongs.filter(song =>
            song.title.toLowerCase().includes(term.toLowerCase()) ||
            song.artist.toLowerCase().includes(term.toLowerCase())
          )
        }));
        break;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background to-secondary/20 relative">
      {showRocket && currentView === 'home' && (
        <motion.div
          className="fixed z-50"
          initial={{ x: "100%", y: "100%" }}
          animate={{ x: "-100%", y: "-100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <Rocket className="h-12 w-12 text-primary" />
        </motion.div>
      )}
      <Sidebar
        onViewChange={(view: 'home' | 'yourPresets' | 'publicPresets' | 'artists' | 'savedLyrics' | 'background' | 'artistBlending' | 'createArtist' | 'shareSongs' | 'aiMastering' | 'aiStems' | 'imageToLyrics') => {
          setCurrentView(view)
          setShowChat(false)
        }}
        onFolderSelect={handleFolderSelect}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isPro={isPro}
        isPremium={isPremium}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentView={currentView}
          currentPageId={showChat ? pageIds.chat : pageIds[currentView]}
          artists={filteredData.artists}
          onSearch={handleSearch}
          onArtistSelect={handleArtistSelect}
          onToggleSidebar={toggleSidebar}
          showSaveLyricsPrompt={showSaveLyricsPrompt}
          onSaveLyrics={handleSaveLyrics}
          onViewChange={setCurrentView}
          isPro={isPro}
          isPremium={isPremium}
          showChat={showChat}
          isGenreSearch={isGenreSearch}
        />
        <motion.main
          className="flex-1 overflow-auto p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {showChat ? (
            selectedArtist ? (
              <ArtistChat
                artist={selectedArtist}
                onBack={() => {
                  setShowChat(false)
                  setSelectedArtist(null)
                }}
              />
            ) : (
              <ChatInterface
                artist={selectedArtist}
                onBack={() => {
                  setShowChat(false)
                  setSelectedSavedLyric(null)
                }}
                savedLyric={selectedSavedLyric}
              />
            )
          ) : (
            <>
              {currentView === 'home' && (
                <>
                  <FeaturedArtists onSelect={handleArtistSelect} likedArtists={likedArtists} />
                  <LyricGenerator setShowSaveLyricsPrompt={setShowSaveLyricsPrompt} addError={addError} />
                  <AIRecommendations />
                  <RequestArtist />
                </>
              )}
              {currentView === 'yourPresets' && (
                <YourPresets />
              )}
              {currentView === 'publicPresets' && (
                <PublicPresets />
              )}
              {currentView === 'artists' && (
                <ArtistsPage
                  onSelect={handleArtistSelect}
                  searchTerm={searchTerm}
                  onSearch={handleSearch}
                  onLikeArtist={handleLikeArtist}
                  likedArtists={likedArtists}
                  addError={addError}
                  setIsGenreSearch={setIsGenreSearch}
                />
              )}
              {currentView === 'artistBlending' && (
                <ArtistBlending
                  isPro={isPro}
                  onUpgradeToPro={handleUpgradeToPro}
                />
              )}
              {currentView === 'createArtist' && (
                isPro ? (
                  <CreateArtistPage />
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Artistify</h2>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                          Pro Feature
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Artistify is an advanced feature that allows you to transform yourself into an AI artist. Create a digital version of you with your unique style, voice, and creative vision.
                        </p>
                        <p className="mb-4">
                          With Artistify, you can:
                        </p>
                        <ul className="list-disc list-inside mb-4">
                          <li>Create an AI version of yourself as an artist</li>
                          <li>Define your personal style, preferred genres, and lyrical themes</li>
                          <li>Generate lyrics in your own unique voice and style</li>
                          <li>Collaborate with your AI self or blend it with other artists for innovative compositions</li>
                        </ul>
                        <Button onClick={handleUpgradeToPro}>
                          <Zap className="mr-2 h-4 w-4" />
                          Upgrade to Pro
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )
              )}
              {currentView === 'savedLyrics' && (
                <SavedLyrics
                  onLyricSelect={handleSavedLyricSelect}
                  selectedFolderId={selectedFolder}
                />
              )}
              {currentView === 'background' && (
                <BackgroundPage />
              )}
              {currentView === 'shareSongs' && (
                <ShareSongs />
              )}
              {currentView === 'aiMastering' && (
                <AIMastering
                  isPremium={isPremium}
                  onUpgradeToPremium={handleUpgradeToPremium}
                />
              )}
              {currentView === 'aiStems' && (
                <AIStems
                  isPremium={isPremium}
                  onUpgradeToPremium={handleUpgradeToPremium}
                />
              )}
              {currentView === 'imageToLyrics' && (
                <ImageToLyrics
                  isPro={isPro}
                  onUpgradeToPro={handleUpgradeToPro}
                />
              )}
            </>
          )}
        </motion.main>
      </div>
      <ErrorDisplay
        errors={errors}
        onDismiss={dismissError}
        onClearAll={clearAllErrors}
      />
      {isLoggedIn && (
        <DiscordConnectedPopup username={username} avatarUrl={avatarUrl} />
      )}
    </div>
  )
}
