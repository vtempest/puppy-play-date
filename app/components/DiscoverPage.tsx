'use client'

import { useRef, useState } from 'react'
import { Heart, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { Puppy } from './types'

interface DiscoverPageProps {
  puppies: Puppy[]
  cardIndex: number
  loading: boolean
  isLoadingMore: boolean
  onSwipe: (direction: 'left' | 'right') => void
  onLoadMore: () => void
}

export function DiscoverPage({
  puppies,
  cardIndex,
  loading,
  isLoadingMore,
  onSwipe,
  onLoadMore,
}: DiscoverPageProps) {
  const [touchStart, setTouchStart] = useState(0)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [swipeRotation, setSwipeRotation] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX
    const diff = currentX - touchStart
    setSwipeOffset(diff)
    setSwipeRotation(diff * 0.05)

    if (Math.abs(diff) > 30) {
      setSwipeDirection(diff > 0 ? 'right' : 'left')
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const swipeThreshold = 50
    const distance = touchStart - endX

    if (Math.abs(distance) > swipeThreshold) {
      onSwipe(distance > 0 ? 'left' : 'right')
    }

    setSwipeOffset(0)
    setSwipeRotation(0)
    setSwipeDirection(null)
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    onSwipe(direction)
    setSwipeOffset(0)
    setSwipeRotation(0)
    setSwipeDirection(null)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Discover Card */}
      <div className="relative mb-6 flex flex-1 items-center justify-center">
        {loading ? (
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading pups...</p>
          </div>
        ) : cardIndex < puppies.length ? (
          <Card
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border-2 border-primary shadow-lg cursor-grab active:cursor-grabbing transition-transform duration-300"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateX(${swipeOffset}px) rotate(${swipeRotation}deg)`,
            }}
            ref={cardRef}
          >
            <div className="relative h-96 w-full bg-secondary">
              {puppies[cardIndex].image ? (
                <Image
                  key={cardIndex}
                  src={puppies[cardIndex].image || "/placeholder.svg"}
                  alt={puppies[cardIndex].name}
                  fill
                  sizes="(max-width: 640px) 100vw, 28rem"
                  className="object-cover"
                  priority
                  onError={() => console.log(`Image failed to load: ${puppies[cardIndex].image}`)}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">
                  <div className="text-center">
                    <div className="mb-2 text-4xl">🐕</div>
                    <p>Loading image...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Card Info */}
            <div className="relative -mt-16 bg-white px-6 py-4">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {puppies[cardIndex].name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {puppies[cardIndex].breed} • {puppies[cardIndex].age}
                </p>
                <div className="mt-2 flex items-center gap-1 text-primary">
                  <MapPin size={16} />
                  <span className="text-sm">{puppies[cardIndex].distance}</span>
                </div>
              </div>
            </div>

            {/* Swipe Indicators */}
            {swipeDirection === 'left' && (
              <div className="absolute right-6 top-6 rounded-2xl border-4 border-red-500 px-6 py-3 text-2xl font-bold text-red-500 transform -rotate-12">
                PASS
              </div>
            )}
            {swipeDirection === 'right' && (
              <div className="absolute left-6 top-6 rounded-2xl border-4 border-green-500 px-6 py-3 text-2xl font-bold text-green-500 transform rotate-12">
                LIKE
              </div>
            )}
          </Card>
        ) : (
          <div className="text-center">
            <Sparkles size={48} className="mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold text-primary">No more pups to discover!</h2>
            <p className="mt-2 text-muted-foreground">Check your matches or try again tomorrow</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {cardIndex < puppies.length && (
        <div className="flex gap-4">
          <Button
            onClick={() => handleSwipe('left')}
            variant="outline"
            size="lg"
            className="flex-1 rounded-full border-2 border-primary py-6 text-primary hover:bg-secondary"
          >
            Pass
          </Button>
          <Button
            onClick={() => handleSwipe('right')}
            size="lg"
            className="flex-1 rounded-full bg-primary py-6 text-white hover:bg-primary/90"
          >
            <Heart size={20} className="mr-2" />
            Like
          </Button>
        </div>
      )}
    </div>
  )
}
