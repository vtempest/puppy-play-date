'use client'

import { useState, useEffect } from 'react'
import { usePuppies } from './hooks/usePuppies'
import {
  UserProfile,
  DEFAULT_USER_PROFILE,
  MOCK_MATCHES,
  Header,
  FilterPanel,
  BottomNav,
  DiscoverPage,
  MessagesPage,
  ProfilePage,
  IntroModal,
  UserInfoModal,
  EditProfileModal,
} from './components'

export default function Page() {
  const [currentPage, setCurrentPage] = useState<'discover' | 'messages' | 'profile'>('discover')
  const [cardIndex, setCardIndex] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const [showIntro, setShowIntro] = useState(true)
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(DEFAULT_USER_PROFILE.preferredBreeds)
  const [showFilters, setShowFilters] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE)

  const { puppies, loading, isLoadingMore, loadMoreDogs } = usePuppies(selectedBreeds)

  useEffect(() => {
    setSelectedBreeds(userProfile.preferredBreeds)
  }, [])

  useEffect(() => {
    if (!loading && puppies.length > 0) {
      setCardIndex(1)
    }
  }, [loading, puppies.length])

  const toggleBreed = (breed: string) => {
    const updated = selectedBreeds.includes(breed)
      ? selectedBreeds.filter(b => b !== breed)
      : [...selectedBreeds, breed]
    setSelectedBreeds(updated)
    setCardIndex(0)
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setLiked([...liked, puppies[cardIndex].id])
    }
    if (cardIndex < puppies.length - 1) {
      setCardIndex(cardIndex + 1)

      if (cardIndex >= puppies.length - 3 && !isLoadingMore) {
        loadMoreDogs()
      }
    }
  }

  const handleCloseUserInfo = () => {
    setShowUserInfo(false)
    setCardIndex(1)
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

  return (
    <div className="flex h-screen flex-col bg-secondary">
      {/* Modals */}
      {showUserInfo && (
        <UserInfoModal userProfile={userProfile} onClose={handleCloseUserInfo} />
      )}

      {showEditProfile && (
        <EditProfileModal
          userProfile={userProfile}
          selectedBreeds={selectedBreeds}
          onClose={() => setShowEditProfile(false)}
          onSave={() => setShowEditProfile(false)}
          onToggleBreed={toggleBreed}
          onUpdateProfile={setUserProfile}
          onRandomizePhotos={handleRandomizePhotos}
        />
      )}

      {showIntro && <IntroModal onGetStarted={() => setShowIntro(false)} />}

      {/* Header */}
      <Header
        currentPage={currentPage}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Filter Panel */}
      {showFilters && currentPage === 'discover' && (
        <FilterPanel
          selectedBreeds={selectedBreeds}
          onToggleBreed={toggleBreed}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden px-4 py-4">
        {currentPage === 'discover' && (
          <DiscoverPage
            puppies={puppies}
            cardIndex={cardIndex}
            loading={loading}
            isLoadingMore={isLoadingMore}
            onSwipe={handleSwipe}
            onLoadMore={loadMoreDogs}
          />
        )}

        {currentPage === 'messages' && <MessagesPage matches={MOCK_MATCHES} />}

        {currentPage === 'profile' && (
          <ProfilePage
            userProfile={userProfile}
            onEditProfile={() => setShowEditProfile(true)}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}
