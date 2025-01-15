"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { checkAuthStatus } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { isAuthenticated } = await checkAuthStatus()
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-500" />
        <p className="text-lg text-white">Authenticating with Discord...</p>
      </div>
    </div>
  )
}

