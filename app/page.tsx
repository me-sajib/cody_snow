"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LoginSection } from '@/components/login-section'
import { Dashboard } from '@/components/dashboard'
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Sparkles, Music, Mic, FileText, Workflow, Settings2, BookOpen, Users, Wand2, PlayCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { FeatureCard } from '@/components/feature-card'
import { FeaturesSection } from '@/components/features-section'
import { HowItWorks } from '@/components/how-it-works'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)

  if (isLoggedIn) {
    return <Dashboard showInitialRocket={true} />
  }

  const features = [
    {
      title: "Content Collections",
      description: "Organize your lyrics into collections with built-in versioning and frontmatter validation. Keep track of your creative journey.",
      icon: FileText,
      gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
      visual: (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="h-24 rounded bg-white/5 animate-pulse" />
          <div className="h-24 rounded bg-white/5 animate-pulse delay-100" />
        </div>
      )
    },
    {
      title: "Zero Latency",
      description: "Our AI models are optimized for instant generation. Get your lyrics in milliseconds, not seconds.",
      icon: Zap,
      gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
      visual: (
        <div className="relative h-24 overflow-hidden rounded bg-black/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white/10">0</span>
          </div>
        </div>
      )
    },
    {
      title: "View Transitions",
      description: "Seamlessly morph between different lyric versions with built-in, browser-native View Transition APIs.",
      icon: Workflow,
      gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
      visual: (
        <div className="grid grid-cols-3 gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded bg-white/5" />
          ))}
        </div>
      )
    },
    {
      title: "Interactive Tutorial",
      description: "Get started quickly with our interactive tutorial. Learn by doing and master lyric generation in minutes.",
      icon: BookOpen,
      gradient: "from-green-500/20 via-green-500/10 to-transparent",
      large: true
    },
    {
      title: "Collaboration",
      description: "Work together with other artists in real-time. Share, comment, and iterate on lyrics together.",
      icon: Users,
      gradient: "from-pink-500/20 via-pink-500/10 to-transparent"
    },
    {
      title: "AI Mastering",
      description: "Polish your lyrics with AI-powered suggestions for rhyming, rhythm, and emotional impact.",
      icon: Wand2,
      gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent"
    }
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
              CodyAI
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Button 
              onClick={() => router.push('/login')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background/0 to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 transition-all duration-300 ease-in-out hover:bg-purple-600/30 hover:text-purple-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-float-and-shake">
                Now in Beta ⚡
              </span>
            </motion.div>
            
            <motion.h1 
              className="mt-8 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Next Generation
              </span>
              <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mt-1 pb-1">
                Lyric Generation
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Create <span className="relative"><span className="relative z-10">free</span><svg className="absolute bottom-0 left-0 w-full h-2 text-red-500" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,3 Q5,8 25,8 L75,8 Q95,8 100,3" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg></span>, professional, human-like lyrics powered by advanced AI. 
              Perfect for songwriters, producers, and artists looking to enhance their creative process.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                onClick={() => router.push('/login')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-purple-500/20 hover:bg-purple-500/10"
                onClick={() => setIsTutorialOpen(true)}
              >
                Watch Tutorial
              </Button>

              <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Tutorial Video</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Tutorial Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="flex justify-center -mt-10 mb-10">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="cursor-pointer"
          onClick={() => window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          })}
        >
          <ChevronDown className="h-8 w-8 text-purple-500" />
        </motion.div>
      </div>

      {/* Video Tutorial Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
              {!isVideoPlaying ? (
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/40 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-16 h-16 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xl font-medium text-white opacity-75 group-hover:opacity-100 transition-opacity">
                      Watch Tutorial
                    </span>
                  </div>
                </button>
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/your-video-id?autoplay=1"
                  title="Product Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Grid */}
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-background/0 to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Ready to Transform Your Songwriting?
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Join thousands of artists using CodyAI to create amazing lyrics and produce professional tracks.
              </p>
              <div className="mt-8">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/login')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

