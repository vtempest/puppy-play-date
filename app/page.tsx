'use client'

import React from "react"

import { useState, useEffect, useRef } from 'react'
import { Heart, MessageCircle, MapPin, Sparkles, Home, MessageSquare, User, X, Sliders, Upload, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import Image from 'next/image'

interface Puppy {
  id: number
  name: string
  breed: string
  age: string
  image: string
  distance: string
}

interface UserProfile {
  name: string
  breed: string
  age: number
  description: string
  maxDistance: number
  photos: string[]
  preferredBreeds: string[]
}

const AVAILABLE_BREEDS = [
  'golden',
  'dachshund',
  'corgi',
  'labrador',
  'poodle',
  'bulldog',
  'husky',
  'beagle',
  'german',
  'pug',
]

export default function Page() {
  const [currentPage, setCurrentPage] = useState<'discover' | 'messages' | 'profile'>('discover')
  const [cardIndex, setCardIndex] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const [puppies, setPuppies] = useState<Puppy[]>([])
  const [loading, setLoading] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(['golden', 'dachshund', 'corgi', 'labrador'])
  const [showFilters, setShowFilters] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [imageKey, setImageKey] = useState(0)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [swipeRotation, setSwipeRotation] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextPuppyId, setNextPuppyId] = useState(1)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    description: 'Love to play fetch and make new dog friends!',
    maxDistance: 25,
    photos: ['/buddy.jpg'],
    preferredBreeds: ['golden', 'dachshund', 'corgi', 'labrador'],
  })

  const handleGetStarted = () => {
    setShowIntro(false)
  }

  const toggleBreed = (breed: string) => {
    const updated = selectedBreeds.includes(breed)
      ? selectedBreeds.filter(b => b !== breed)
      : [...selectedBreeds, breed]
    setSelectedBreeds(updated)
  }

  useEffect(() => {
    // Update selected breeds from user preferences on mount
    setSelectedBreeds(userProfile.preferredBreeds)
  }, [])

  useEffect(() => {
    // Only fetch if we have selected breeds
    if (selectedBreeds.length === 0) return

    const fetchDogImages = async () => {
      try {
        setLoading(true)
        setCardIndex(0)
        
        const names = ['Max', 'Bella', 'Charlie', 'Duke', 'Daisy', 'Rocky', 'Sophie', 'Cooper', 'Sadie', 'Bailey', 'Buddy', 'Jasper']
        const ages = ['2 years', '1 year', '3 years', '2 years', '18 months', '2.5 years', '1 year', '3 years', '2 years', '1.5 years', '2.8 years', '1.2 years']
        const distances = ['2.3 km away', '1.8 km away', '3.1 km away', '1.5 km away', '2.1 km away', '1.9 km away', '2.8 km away', '1.2 km away', '2.6 km away', '1.4 km away', '2.9 km away', '1.7 km away']

        const puppyData: Puppy[] = []
        let puppyId = 1

        // Load 20 dogs by cycling through breeds and fetching multiple images per breed
        const dogsPerBreed = Math.ceil(20 / selectedBreeds.length)
        
        for (let i = 0; i < selectedBreeds.length; i++) {
          try {
            // Fetch multiple random images per breed
            const response = await fetch(
              `https://dog.ceo/api/breed/${selectedBreeds[i]}/images/random/${dogsPerBreed}`
            )
            const data = await response.json()
            
            let images: string[] = []
            if (data.status === 'success' && data.message && data.message.length > 0) {
              images = Array.isArray(data.message) ? data.message : [data.message]
            }

            // Create a puppy for each image
            for (let j = 0; j < images.length && puppyData.length < 20; j++) {
              puppyData.push({
                id: puppyId++,
                name: names[Math.floor(Math.random() * names.length)],
                breed: selectedBreeds[i].charAt(0).toUpperCase() + selectedBreeds[i].slice(1),
                age: ages[Math.floor(Math.random() * ages.length)],
                image: images[j],
                distance: distances[Math.floor(Math.random() * distances.length)],
              })
            }
          } catch (breedError) {
            console.error(`Failed to fetch images for ${selectedBreeds[i]}:`, breedError)
          }
        }

        console.log('[v0] Puppies loaded:', puppyData.length)
        setPuppies(puppyData)
        setNextPuppyId(puppyId)
        
        // Auto-pass the first dog and show the second dog
        setTimeout(() => {
          setCardIndex(1)
        }, 500)
      } catch (error) {
        console.error('Failed to fetch dog images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDogImages()
  }, [selectedBreeds])

  const matches = [
    {
      id: 1,
      name: 'Luna',
      lastMessage: 'Luna just wants to play!',
      time: '2m',
    },
    {
      id: 2,
      name: 'Max',
      lastMessage: 'Ready for park time? 🦴',
      time: '1h',
    },
  ]

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setLiked([...liked, puppies[cardIndex].id])
    }
    if (cardIndex < puppies.length - 1) {
      setCardIndex(cardIndex + 1)
      setSwipeOffset(0)
      setSwipeRotation(0)
      setSwipeDirection(null)
      
      // Load more dogs when near the end (within 2 cards)
      if (cardIndex >= puppies.length - 3 && !isLoadingMore) {
        loadMoreDogs()
      }
    }
  }

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
    handleSwipeGesture(endX)
    setSwipeOffset(0)
    setSwipeRotation(0)
    setSwipeDirection(null)
  }

  const handleSwipeGesture = (endX: number) => {
    const swipeThreshold = 50
    const distance = touchStart - endX

    if (Math.abs(distance) > swipeThreshold) {
      if (distance > 0) {
        handleSwipe('left')
      } else {
        handleSwipe('right')
      }
    }
  }

  const handleCloseUserInfo = () => {
    setShowUserInfo(false)
    // Auto-pass the first dog and move to the next
    setCardIndex(1)
    setSwipeOffset(0)
    setSwipeRotation(0)
    setSwipeDirection(null)
  }

  const handleSaveProfile = () => {
    setShowEditProfile(false)
  }

  const handleRandomizePhotos = async () => {
    try {
      const response = await fetch(
        `https://dog.ceo/api/breed/${userProfile.breed.toLowerCase().split(' ')[0]}/images/random/3`
      )
      const data = await response.json()
      
      if (data.status === 'success' && data.message) {
        setUserProfile(prev => ({
          ...prev,
          photos: data.message,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch new photos:', error)
    }
  }

  const loadMoreDogs = async () => {
    if (isLoadingMore) return
    
    try {
      setIsLoadingMore(true)
      
      const names = ['Max', 'Bella', 'Charlie', 'Duke', 'Daisy', 'Rocky', 'Sophie', 'Cooper', 'Sadie', 'Bailey', 'Buddy', 'Jasper']
      const ages = ['2 years', '1 year', '3 years', '2 years', '18 months', '2.5 years', '1 year', '3 years', '2 years', '1.5 years', '2.8 years', '1.2 years']
      const distances = ['2.3 km away', '1.8 km away', '3.1 km away', '1.5 km away', '2.1 km away', '1.9 km away', '2.8 km away', '1.2 km away', '2.6 km away', '1.4 km away', '2.9 km away', '1.7 km away']

      const newPuppies: Puppy[] = []
      let currentId = nextPuppyId
      const dogsToAdd = 10

      // Load 10 more dogs
      for (let i = 0; i < selectedBreeds.length && newPuppies.length < dogsToAdd; i++) {
        try {
          const response = await fetch(
            `https://dog.ceo/api/breed/${selectedBreeds[i]}/images/random/2`
          )
          const data = await response.json()
          
          let images: string[] = []
          if (data.status === 'success' && data.message && data.message.length > 0) {
            images = Array.isArray(data.message) ? data.message : [data.message]
          }

          for (let j = 0; j < images.length && newPuppies.length < dogsToAdd; j++) {
            newPuppies.push({
              id: currentId++,
              name: names[Math.floor(Math.random() * names.length)],
              breed: selectedBreeds[i].charAt(0).toUpperCase() + selectedBreeds[i].slice(1),
              age: ages[Math.floor(Math.random() * ages.length)],
              image: images[j],
              distance: distances[Math.floor(Math.random() * distances.length)],
            })
          }
        } catch (error) {
          console.error(`Failed to load more dogs for ${selectedBreeds[i]}:`, error)
        }
      }

      setPuppies(prev => [...prev, ...newPuppies])
      setNextPuppyId(currentId)
      console.log('[v0] Loaded more dogs:', newPuppies)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-secondary">
      {/* User Info Modal */}
      {showUserInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="mx-4 max-w-sm space-y-6 rounded-3xl border-2 border-primary p-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary">Your Dog's Profile</h1>
              <button
                onClick={handleCloseUserInfo}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center">
              <div className="relative mb-4 h-32 w-32 mx-auto overflow-hidden rounded-2xl">
                {userProfile.photos.length > 0 && (
                  <Image
                    src={userProfile.photos[0] || "/placeholder.svg"}
                    alt={userProfile.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
              <h2 className="text-2xl font-bold text-primary">{userProfile.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{userProfile.breed} • {userProfile.age} years old</p>
              <p className="mt-4 text-sm text-foreground">
                {userProfile.description}
              </p>
            </div>

            <Button
              onClick={handleCloseUserInfo}
              size="lg"
              className="w-full rounded-full bg-primary py-6 text-white hover:bg-primary/90"
            >
              Start Exploring
            </Button>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
          <Card className="mx-4 my-8 max-w-sm space-y-6 rounded-3xl border-2 border-primary p-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary">Edit Profile</h1>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Profile Photos */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Photos</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {userProfile.photos.map((photo, idx) => (
                    <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleRandomizePhotos}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full border-primary text-primary hover:bg-secondary bg-transparent"
                >
                  <Upload size={16} className="mr-2" />
                  Get Random Photos
                </Button>
              </div>

              {/* Match Distance */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Match Distance</h3>
                <div className="space-y-2">
                  <Slider
                    value={[userProfile.maxDistance]}
                    onValueChange={(value) => setUserProfile(prev => ({ ...prev, maxDistance: value[0] }))}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 mile</span>
                    <span className="font-semibold text-primary">{userProfile.maxDistance} miles</span>
                    <span>100 miles</span>
                  </div>
                </div>
              </div>

              {/* Preferred Breeds */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Preferred Breeds</h3>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_BREEDS.map((breed) => (
                    <button
                      key={breed}
                      onClick={() => toggleBreed(breed)}
                      className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                        selectedBreeds.includes(breed)
                          ? 'bg-primary text-white'
                          : 'border border-primary bg-white text-primary hover:bg-secondary'
                      }`}
                    >
                      {breed.charAt(0).toUpperCase() + breed.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              size="lg"
              className="w-full rounded-full bg-primary py-6 text-white hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </Card>
        </div>
      )}

      {/* Intro Modal */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="mx-4 max-w-sm space-y-6 rounded-3xl border-2 border-primary p-8">
            <div className="text-center">
              <div className="mb-4 text-5xl">🐾</div>
              <h1 className="text-3xl font-bold text-primary">Welcome to PawPal</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                The app that helps your dog find their next best friend!
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <p className="font-semibold text-foreground">Match by breed & play style</p>
                  <p className="text-xs text-muted-foreground">Find compatible pups nearby</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">Discover & connect</p>
                  <p className="text-xs text-muted-foreground">Chat and schedule safe playdates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">Build your community</p>
                  <p className="text-xs text-muted-foreground">Join meetups and events</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGetStarted}
              size="lg"
              className="w-full rounded-full bg-primary py-6 text-white hover:bg-primary/90"
            >
              Get Started
            </Button>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/dog-icon.svg"
              alt="PawPal logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <h1 className="text-2xl font-bold text-primary">PawPal</h1>
          </div>
          {currentPage === 'discover' && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-primary hover:text-primary/80"
              aria-label="Filter breeds"
            >
              <Sliders size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && currentPage === 'discover' && (
        <div className="border-b border-border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Filter by Breed</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_BREEDS.map((breed) => (
              <button
                key={breed}
                onClick={() => toggleBreed(breed)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedBreeds.includes(breed)
                    ? 'bg-primary text-white'
                    : 'border border-primary bg-white text-primary hover:bg-secondary'
                }`}
              >
                {breed.charAt(0).toUpperCase() + breed.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden px-4 py-4">
        {currentPage === 'discover' && (
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
                        key={cardIndex === 0 ? imageKey : cardIndex}
                        src={puppies[cardIndex].image || "/placeholder.svg"}
                        alt={puppies[cardIndex].name}
                        fill
                        sizes="(max-width: 640px) 100vw, 28rem"
                        className="object-cover"
                        priority
                        onError={() => console.log(`[v0] Image failed to load: ${puppies[cardIndex].image}`)}
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
        )}

        {currentPage === 'messages' && (
          <div className="space-y-3">
            <h2 className="mb-4 text-xl font-bold text-primary">Matches</h2>
            {matches.map((match) => (
              <Card key={match.id} className="cursor-pointer border-primary/20 p-4 hover:bg-secondary/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{match.name}</h3>
                    <p className="text-sm text-muted-foreground">{match.lastMessage}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{match.time}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {currentPage === 'profile' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="relative mb-4 h-32 w-full overflow-hidden rounded-2xl bg-secondary">
                {userProfile.photos.length > 0 && (
                  <Image
                    src={userProfile.photos[0] || "/placeholder.svg"}
                    alt={userProfile.name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
              <h2 className="text-2xl font-bold text-primary">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.breed} • {userProfile.age} years</p>
              <p className="mt-4 text-sm text-foreground">
                {userProfile.description}
              </p>

              {/* Preferences Info */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Match Distance:</span>
                  <span className="font-semibold text-primary">{userProfile.maxDistance} miles</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Preferred Breeds:</span>
                  <span className="font-semibold text-primary">{userProfile.preferredBreeds.length}</span>
                </div>
              </div>

              <Button 
                onClick={() => setShowEditProfile(true)}
                className="mt-4 w-full rounded-full bg-primary text-white hover:bg-primary/90"
              >
                Edit Profile
              </Button>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-foreground">Stats</h3>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Likes Received</span>
                  <span className="font-semibold text-primary">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Matches</span>
                  <span className="font-semibold text-primary">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Play Dates Scheduled</span>
                  <span className="font-semibold text-primary">2</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex border-t border-border bg-white">
        <button
          onClick={() => setCurrentPage('discover')}
          className={`flex-1 py-4 transition-colors ${
            currentPage === 'discover'
              ? 'border-t-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Home size={24} className="mx-auto" />
        </button>
        <button
          onClick={() => setCurrentPage('messages')}
          className={`flex-1 py-4 transition-colors ${
            currentPage === 'messages'
              ? 'border-t-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare size={24} className="mx-auto" />
        </button>
        <button
          onClick={() => setCurrentPage('profile')}
          className={`flex-1 py-4 transition-colors ${
            currentPage === 'profile'
              ? 'border-t-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User size={24} className="mx-auto" />
        </button>
      </div>
    </div>
  )
}
