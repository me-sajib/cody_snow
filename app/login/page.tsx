"use client"

import { LoginSection } from '@/components/login-section'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { initiateDiscordAuth, checkAuthStatus } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    router.push('/dashboard');
  };

  useEffect(() => {
    // Check if the user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      setIsLoggedIn(true);
      router.push('/dashboard');
    }
  }, [router]);

  if (isLoggedIn) {
    return null  // This will never render as we immediately redirect
  }

  return <LoginSection 
    onLogin={handleLogin} 
    initiateDiscordAuth={initiateDiscordAuth}
    checkAuthStatus={checkAuthStatus}
  />
}

