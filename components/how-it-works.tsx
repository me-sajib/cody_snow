"use client"

import { motion } from 'framer-motion'
import { Mic, Sparkles, Music, ArrowRight } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Mic,
      title: "Choose Your Style",
      description: "Select from hundreds of artist models or blend multiple styles together."
    },
    {
      icon: Sparkles,
      title: "Generate Lyrics",
      description: "Let our AI create unique, professional-quality lyrics based on your chosen style."
    },
    {
      icon: Music,
      title: "Refine and Produce",
      description: "Edit, organize, and enhance your lyrics with our suite of AI-powered tools."
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Create amazing lyrics in just three simple steps
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="flex flex-col items-center text-center max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-zinc-400">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="w-6 h-6 text-purple-500 mt-4 hidden md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

