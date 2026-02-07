'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { UserProfile } from '../types'

interface UserInfoModalProps {
  userProfile: UserProfile
  onClose: () => void
}

export function UserInfoModal({ userProfile, onClose }: UserInfoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="mx-4 max-w-sm space-y-6 rounded-3xl border-2 border-primary p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Your Dog's Profile</h1>
          <button
            onClick={onClose}
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
          <p className="mt-2 text-sm text-muted-foreground">
            {userProfile.breed} • {userProfile.age} years old
          </p>
          <p className="mt-4 text-sm text-foreground">
            {userProfile.description}
          </p>
        </div>

        <Button
          onClick={onClose}
          size="lg"
          className="w-full rounded-full bg-primary py-6 text-white hover:bg-primary/90"
        >
          Start Exploring
        </Button>
      </Card>
    </div>
  )
}
