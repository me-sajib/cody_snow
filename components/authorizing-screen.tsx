import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { FaDiscord } from "react-icons/fa6"

interface AuthorizingScreenProps {
  isInDiscordServer: boolean
  onCheckAgain: () => void
  setIsInDiscordServer: React.Dispatch<React.SetStateAction<boolean>>
}

export function AuthorizingScreen({ isInDiscordServer, onCheckAgain, setIsInDiscordServer }: AuthorizingScreenProps) {
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (!isInDiscordServer) {
      setIsChecking(false)
    }
  }, [isInDiscordServer])

  const checkDiscordServerMembership = async () => {
    try {
      const response = await fetch('https://codyai.cc/api/auth/status', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        setIsInDiscordServer(false);
        return;
      }
      
      const data = await response.json();
      // Assuming the API returns server membership status
      setIsInDiscordServer(data.isInServer);
      if (data.isInServer) {
        onCheckAgain();
      }
    } catch (error) {
      setIsInDiscordServer(false);
      console.error('Failed to check server membership:', error);
    }
    setIsChecking(false);
  };

  const handleCheckAgain = () => {
    setIsChecking(true);
    checkDiscordServerMembership();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-center space-y-4">
        {isInDiscordServer ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
            <p className="text-xl text-white">Authorizing...</p>
          </div>
        ) : (
          <>
            <p className="text-xl text-white">You're not in our Discord server.</p>
            <p className="text-zinc-400">We require you to join our Discord server to use CodyAI.</p>
            <div className="space-y-2">
              <Button
                onClick={() => window.open('https://discord.gg/your-invite-link', '_blank')}
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
              >
                <FaDiscord className="mr-2 h-5 w-5" />
                Join our Discord
              </Button>
              <Button
                onClick={handleCheckAgain}
                disabled={isChecking}
                className="w-full bg-white hover:bg-gray-200 text-black"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "I Joined"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

