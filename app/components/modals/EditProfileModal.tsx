'use client'

import { X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import Image from 'next/image'
import { UserProfile } from '../types'
import { AVAILABLE_BREEDS } from '../constants'

interface EditProfileModalProps {
  userProfile: UserProfile
  selectedBreeds: string[]
  onClose: () => void
  onSave: () => void
  onToggleBreed: (breed: string) => void
  onUpdateProfile: (profile: UserProfile) => void
  onRandomizePhotos: () => void
}

export function EditProfileModal({
  userProfile,
  selectedBreeds,
  onClose,
  onSave,
  onToggleBreed,
  onUpdateProfile,
  onRandomizePhotos,
}: EditProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <Card className="mx-4 my-8 max-w-sm space-y-6 rounded-3xl border-2 border-primary p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Edit Profile</h1>
          <button
            onClick={onClose}
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
              onClick={onRandomizePhotos}
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
                onValueChange={(value) =>
                  onUpdateProfile({ ...userProfile, maxDistance: value[0] })
                }
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
                  onClick={() => onToggleBreed(breed)}
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
          onClick={onSave}
          size="lg"
          className="w-full rounded-full bg-primary py-6 text-white hover:bg-primary/90"
        >
          Save Changes
        </Button>
      </Card>
    </div>
  )
}
