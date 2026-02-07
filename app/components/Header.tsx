'use client'

import { Sliders } from 'lucide-react'
import Image from 'next/image'

interface HeaderProps {
  currentPage: 'discover' | 'messages' | 'profile'
  showFilters: boolean
  onToggleFilters: () => void
}

export function Header({ currentPage, showFilters, onToggleFilters }: HeaderProps) {
  return (
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
        <div className="flex items-center gap-4">
          <a href="/pitch.html" className="text-sm font-medium text-primary hover:text-primary/80">
            Pitch
          </a>
          {currentPage === 'discover' && (
            <button
              onClick={onToggleFilters}
              className="text-primary hover:text-primary/80"
              aria-label="Filter breeds"
            >
              <Sliders size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
