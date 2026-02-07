'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { UserProfile } from './types'

interface ProfilePageProps {
  userProfile: UserProfile
  onEditProfile: () => void
}

export function ProfilePage({ userProfile, onEditProfile }: ProfilePageProps) {
  return (
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
          onClick={onEditProfile}
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
  )
}
