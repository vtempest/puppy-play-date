'use client'

import { X } from 'lucide-react'
import { AVAILABLE_BREEDS } from './constants'

interface FilterPanelProps {
  selectedBreeds: string[]
  onToggleBreed: (breed: string) => void
  onClose: () => void
}

export function FilterPanel({ selectedBreeds, onToggleBreed, onClose }: FilterPanelProps) {
  return (
    <div className="border-b border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filter by Breed</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {AVAILABLE_BREEDS.map((breed) => (
          <button
            key={breed}
            onClick={() => onToggleBreed(breed)}
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
  )
}
