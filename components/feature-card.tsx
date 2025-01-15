"use client"

import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { type LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  gradient?: string
  delay?: number
  large?: boolean
  visual?: React.ReactNode
  className?: string
}

export function FeatureCard({ 
  title, 
  description, 
  icon: Icon,
  gradient = "from-purple-500/20 via-purple-500/10 to-transparent",
  delay = 0,
  large = false,
  visual,
  className
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "group relative rounded-xl overflow-hidden",
        "border border-white/5 bg-gradient-to-b from-white/5 to-transparent",
        large ? "md:col-span-2" : "",
        className
      )}
    >
      {/* Background gradient overlay */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-gradient-to-br",
          gradient
        )} 
      />

      {/* Inner glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
        <div className="absolute inset-y-8 right-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={cn(
            "p-2 rounded-lg",
            "bg-white/5 group-hover:bg-white/10 transition-colors duration-500",
            "ring-1 ring-white/10 group-hover:ring-purple-500/50",
            "shadow-lg shadow-black/50"
          )}>
            <Icon className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        
        {visual && (
          <div className="mb-4 relative">
            {visual}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          </div>
        )}

        <p className="text-zinc-400 leading-relaxed">{description}</p>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-purple-500 to-transparent" />
        <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-purple-500 to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute bottom-0 right-0 w-px h-8 bg-gradient-to-t from-purple-500 to-transparent" />
        <div className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-purple-500 to-transparent" />
      </div>
    </motion.div>
  )
}

