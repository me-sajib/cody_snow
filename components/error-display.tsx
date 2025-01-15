import { useState, useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"

interface ErrorDisplayProps {
  errors: { id: string; message: string }[]
  onDismiss: (id: string) => void
  onClearAll: () => void
}

export function ErrorDisplay({ errors, onDismiss, onClearAll }: ErrorDisplayProps) {
  if (errors.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-4 right-4 z-50 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg max-w-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold flex items-center">
          <AlertCircle className="mr-2 h-4 w-4" />
          Error Log
        </h2>
        <button onClick={onClearAll} className="text-xs underline">
          Clear All
        </button>
      </div>
      <ScrollArea className="h-32">
        <AnimatePresence>
          {errors.map(error => (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-destructive/10 p-2 rounded mb-2 flex items-center justify-between text-sm"
            >
              <span>{error.message}</span>
              <button
                onClick={() => onDismiss(error.id)}
                className="ml-2 text-destructive-foreground/50 hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  )
}

