import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDiscord } from 'react-icons/fa6'

interface DiscordConnectedPopupProps {
  username: string
  avatarUrl: string
}

export function DiscordConnectedPopup({ username, avatarUrl }: DiscordConnectedPopupProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-[#5865F2] text-white p-4 rounded-lg shadow-lg z-50 flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <FaDiscord className="h-6 w-6" />
            <span className="font-semibold">Discord Connected</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src={avatarUrl} alt={username} className="w-8 h-8 rounded-full" />
            <span>{username}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

