"use client"

import { motion } from 'framer-motion'
import { FeatureCard } from './feature-card'
import { Music, Users, FolderOpen, Wand2, Layers, Sparkles, Settings, Share2, FileAudio, UserPlus, Combine, PresentationIcon as Preset, Save, Zap, Mic } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Lyric Generation",
      description: "Create professional-quality lyrics in seconds using our advanced AI models, trained on hundreds of artists and styles.",
      icon: Sparkles,
      gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
      visual: (
        <div className="space-y-2">
          <div className="h-2 bg-gradient-to-r from-purple-500/20 to-purple-500/5 rounded w-3/4" />
          <div className="h-2 bg-gradient-to-r from-purple-500/20 to-purple-500/5 rounded w-1/2" />
          <div className="h-2 bg-gradient-to-r from-purple-500/20 to-purple-500/5 rounded w-2/3" />
        </div>
      )
    },
    {
      title: "Extensive Artist Library",
      description: "Access hundreds of AI-trained artist models, each capturing unique styles and characteristics. Request new artists to expand our collection.",
      icon: Users,
      gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
      visual: (
        <div className="grid grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-full bg-white/5 overflow-hidden">
              <img 
                src={`/placeholder.svg?height=100&width=100&index=${i}`} 
                alt="Artist avatar" 
                className="w-full h-full object-cover opacity-75 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Artist Blending",
      description: "Create unique compositions by blending two or more artists. Combine styles, flows, and characteristics for truly original lyrics.",
      icon: Combine,
      gradient: "from-green-500/20 via-green-500/10 to-transparent",
      visual: (
        <div className="relative h-24 flex items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-green-500/20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse delay-100" />
        </div>
      )
    },
    {
      title: "Artistify",
      description: "Transform yourself into an AI artist. Upload your style, customize your characteristics, and generate lyrics that sound just like you.",
      icon: UserPlus,
      gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
      visual: (
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-2 bg-white/5 rounded w-3/4" />
            <div className="h-2 bg-white/5 rounded w-1/2" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white/5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 via-green-500/20 to-blue-500/20 animate-spin-slow rounded-full" />
          </div>
        </div>
      )
    },
    {
      title: "AI Mastering",
      description: "Enhance your tracks with AI-powered mastering. Automatically detect BPM & KEY while optimizing your sound to professional quality.",
      icon: Wand2,
      gradient: "from-pink-500/20 via-pink-500/10 to-transparent",
      visual: (
        <div className="space-y-2">
          <div className="h-2 bg-gradient-to-r from-pink-500/20 to-pink-500/5 rounded" />
          <div className="flex justify-between text-xs text-pink-500/50">
            <span>BPM: 128</span>
            <span>KEY: Am</span>
          </div>
        </div>
      )
    },
    {
      title: "AI Stem Separator",
      description: "Isolate vocals, instruments, and effects. Extract individual components with pristine quality for remixing or analysis.",
      icon: Layers,
      gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent",
      visual: (
        <div className="space-y-1">
          {['Vocals', 'Instruments', 'Effects'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/5 rounded" />
              <span className="text-xs text-white/40">{label}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Custom Presets",
      description: "Create and fine-tune presets for any artist or style. Save your favorite settings and share them with the community.",
      icon: Settings,
      gradient: "from-orange-500/20 via-orange-500/10 to-transparent",
      visual: (
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 rounded bg-white/5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-orange-500/20" />
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Lyric Organization",
      description: "Keep your creations organized with custom folders. Sort, tag, and categorize your lyrics for easy access and management.",
      icon: FolderOpen,
      gradient: "from-violet-500/20 via-violet-500/10 to-transparent",
      visual: (
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 rounded bg-white/5 p-2">
              <div className="h-2 w-2/3 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Share Your Creations",
      description: "Showcase your AI-generated songs with the community. Get feedback, collaborate, and inspire others with your unique creations.",
      icon: Share2,
      gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
      visual: (
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center">
            <FileAudio className="w-6 h-6 text-emerald-500/50" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-2 bg-white/5 rounded w-3/4" />
            <div className="h-2 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Powerful Features for Modern Songwriting
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              CodyAI combines cutting-edge AI technology with intuitive tools to revolutionize your lyric writing process.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

