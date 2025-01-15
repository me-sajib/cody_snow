"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FaDiscord } from "react-icons/fa6"
import { MusicIcon } from 'lucide-react'
import Link from "next/link"
import { AuthorizingScreen } from './authorizing-screen'

interface LoginSectionProps {
  onLogin: () => void
  initiateDiscordAuth: () => void;
  checkAuthStatus: () => Promise<{ isAuthenticated: boolean; user?: any }>;
}

const reviews = [
  {
    quote: "CodyAI has revolutionized my songwriting process. It's like having a co-writer available 24/7, helping me create unique and emotionally resonant lyrics faster than ever before.",
    author: "RoRoTruck, Udio Community Leader"
  },
  {
    quote: "Yo, this AI is straight fire! It helps me bust out fresh rhymes when I'm in a creative block. CodyAI is a game-changer for any rapper looking to level up their lyrical game.",
    author: "Bursty, Rapper"
  },
  {
    quote: "As a producer, I've found CodyAI to be an invaluable tool. It helps me brainstorm lyrical themes that complement my beats, creating a perfect synergy between words and music.",
    author: "YYTR Bubbles, Producer"
  },
  {
    quote: "CodyAI has become an essential part of my songwriting toolkit. It helps me explore new themes and perspectives, pushing my creativity to new heights.",
    author: "thatoneguy, Singer-Songwriter"
  },
  {
    quote: "I was skeptical at first, but CodyAI has truly impressed me. It's not just about generating lyrics; it's about inspiring new ideas and helping me find my voice as a singer.",
    author: "OHHCodi, Singer"
  },
  {
    quote: "CodyAI keeps me on my toes. It helps me experiment with different flows and wordplays, keeping my style fresh and innovative.",
    author: "RP, Rapper/Hip-Hop Artist"
  }
]

export function LoginSection({ onLogin, initiateDiscordAuth, checkAuthStatus }: LoginSectionProps) {
  const [agreed, setAgreed] = useState(false)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const [isInDiscordServer, setIsInDiscordServer] = useState(false)

  const canConnect = agreed

  const handleConnect = () => {
    if (canConnect) {
      initiateDiscordAuth();
      setIsAuthorizing(true);
    }
  };

  const checkDiscordServerMembership = () => {
    // Simulate checking if the user is in the Discord server
    const randomCheck = Math.random() < 0.5;
    setIsInDiscordServer(randomCheck);
    if (randomCheck) {
      onLogin();
    }
  };

  // Change review every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated, user } = await checkAuthStatus();
      if (isAuthenticated) {
        onLogin();
      }
    };
    checkAuth();
  }, [onLogin, checkAuthStatus]);

  // Check for Discord authorization code in URL
  useEffect(() => {
    const isAuthorized = localStorage.getItem('discordAuthorized') === 'true';
    if (isAuthorized) {
      setIsAuthorizing(true);
      checkDiscordServerMembership();
    }
  }, []);

  if (isAuthorizing) {
    return <AuthorizingScreen isInDiscordServer={isInDiscordServer} onCheckAgain={checkDiscordServerMembership} setIsInDiscordServer={setIsInDiscordServer} />
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left section */}
      <div className="relative hidden lg:flex items-center justify-center px-12 py-12 bg-black">
        <div>
          <div className="absolute top-8 left-8 flex items-center">
            <MusicIcon className="h-6 w-6 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">CodyAI</span>
          </div>
          <blockquote className="space-y-2">
            <p className="text-lg text-white">
              &ldquo;{reviews[currentReviewIndex].quote}&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">
              {reviews[currentReviewIndex].author}
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center justify-center px-8 py-12 bg-zinc-950">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome to CodyAI</h1>
            <p className="text-zinc-400">
              Connect with Discord to start generating amazing lyrics
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleConnect}
              disabled={!canConnect}
            >
              <FaDiscord className="mr-2 h-5 w-5" />
              Connect with Discord
            </Button>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreement" 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                />
                <label 
                  htmlFor="agreement" 
                  className="text-sm text-zinc-400 cursor-pointer"
                >
                  I agree to the{' '}
                  <Link href="#" className="underline underline-offset-4 hover:text-white">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="#" className="underline underline-offset-4 hover:text-white">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

