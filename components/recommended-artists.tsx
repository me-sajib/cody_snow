import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TrendingUp, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

const recommendedArtists = [
  { id: "1", name: "Luna Starlight", image: "https://picsum.photos/seed/luna/200", trending: true },
  { id: "2", name: "The Groove Masters", image: "https://picsum.photos/seed/groove/200", trending: false },
  { id: "3", name: "Elijah Soulful", image: "https://picsum.photos/seed/elijah/200", trending: true },
  { id: "4", name: "Neon Dreamers", image: "https://picsum.photos/seed/neon/200", trending: false },
  { id: "5", name: "Aria Moonbeam", image: "https://picsum.photos/seed/aria/200", trending: true },
  { id: "6", name: "Rhythm Rebels", image: "https://picsum.photos/seed/rhythm/200", trending: false },
  { id: "7", name: "Zephyr & the Windwalkers", image: "https://picsum.photos/seed/zephyr/200", trending: false },
  { id: "8", name: "Melody Maverick", image: "https://picsum.photos/seed/melody/200", trending: true },
  { id: "9", name: "Quantum Quartet", image: "https://picsum.photos/seed/quantum/200", trending: false },
  { id: "10", name: "Echo Enigma", image: "https://picsum.photos/seed/echo/200", trending: false },
  { id: "11", name: "Crimson Cascade", image: "https://picsum.photos/seed/crimson/200", trending: true },
  { id: "12", name: "Sapphire Serenade", image: "https://picsum.photos/seed/sapphire/200", trending: false },
]

const artists = recommendedArtists; // Added for clarity and to use in the filter

class Particle {
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  alpha: number;
  decay: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: Math.random() * 4 - 2,
      y: Math.random() * 4 - 2
    };
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.015;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 2, 2);
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= this.decay;
  }
}

export function FeaturedArtists({ onSelect, likedArtists = [] }: { onSelect: (artist: string) => void, likedArtists: string[] }) {
  const [starClicks, setStarClicks] = useState(0)
  const [konami, setKonami] = useState('')
  const [rainbowMode, setRainbowMode] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const isShowingLikedArtists = likedArtists.length > 0
  const displayedArtists = isShowingLikedArtists
    ? recommendedArtists.filter(artist => likedArtists.includes(artist.id))
    : recommendedArtists;

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKonami(prev => {
        const updated = (prev + e.key).slice(-10)
        if (updated === 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba') {
          triggerKonamiCode()
        }
        return updated
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (starClicks === 3) {
      createFireworks()
      setStarClicks(0)
    } else if (starClicks === 5) {
      triggerConfetti()
      setStarClicks(0)
    }
  }, [starClicks])

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current
      if (container) {
        setCanScrollLeft(container.scrollLeft > 0)
        setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      checkScroll()
    }

    return () => container?.removeEventListener('scroll', checkScroll)
  }, [])

  const createFireworks = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']

    for (let i = 0; i < 3; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const color = colors[Math.floor(Math.random() * colors.length)]

      for (let j = 0; j < 50; j++) {
        particlesRef.current.push(new Particle(x, y, color))
      }
    }

    if (!animationRef.current) {
      animateFireworks()
    }
  }

  const animateFireworks = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesRef.current.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        particlesRef.current.splice(index, 1)
      } else {
        particle.update()
        particle.draw(ctx)
      }
    })

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animateFireworks)
    } else {
      cancelAnimationFrame(animationRef.current!)
      animationRef.current = undefined
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const triggerKonamiCode = () => {
    setRainbowMode(true)
    setTimeout(() => setRainbowMode(false), 5000)
  }

  const handleIconClick = () => {
    setStarClicks(prev => prev + 1)
    if (isShowingLikedArtists) {
      // Add any specific behavior for clicking the heart icon
      console.log("Heart clicked!")
    } else {
      // Keep the existing star click behavior
      if (starClicks + 1 === 3) {
        createFireworks()
      } else if (starClicks + 1 === 5) {
        triggerConfetti()
      }
    }
  }

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rainbowMode) {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, red, orange, yellow, green, blue, indigo, violet)`
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = container.clientWidth
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <Card className="my-6 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <CardHeader>
        <CardTitle className="flex items-center">
          {isShowingLikedArtists ? "Liked Artists" : "Recommended Artists"}
          <motion.span 
            onClick={handleIconClick} 
            className="cursor-pointer select-none ml-2 text-2xl"
            whileHover={{ scale: 1.2, rotate: isShowingLikedArtists ? 0 : 180 }}
            whileTap={{ scale: 0.8 }}
          >
            {isShowingLikedArtists ? (
              <Heart className="h-6 w-6 text-red-500" />
            ) : (
              <Star className="h-6 w-6 text-yellow-500" />
            )}
          </motion.span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ScrollArea className="w-full overflow-x-auto">
            <div ref={scrollContainerRef} className="flex space-x-4 pb-4">
              {isShowingLikedArtists && displayedArtists.length === 0 && (
                <div className="text-center py-4">
                  <p>You haven't liked any artists yet. Go to the Artists page to like some!</p>
                </div>
              )}
              {displayedArtists.map((artist) => (
                <Card
                  key={artist.id} // Ensure each artist has a unique id
                  className="w-[150px] h-[180px] cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                  onClick={() => onSelect(artist.name)}
                  onMouseMove={handleCardHover}
                  style={rainbowMode ? { transition: 'background 0.3s ease' } : {}}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-sm flex items-center justify-center">
                      <span>{artist.name}</span>
                      {artist.trending && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TrendingUp className="h-4 w-4 ml-1 text-red-500 inline-block" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This artist is currently trending</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center pt-0">
                    <div className="relative">
                      <img src={artist.image} alt={artist.name} className="w-20 h-20 rounded-full object-cover" crossOrigin="anonymous" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

