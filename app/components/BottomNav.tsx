'use client'

import { Home, MessageSquare, User } from 'lucide-react'

type Page = 'discover' | 'messages' | 'profile'

interface BottomNavProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  return (
    <div className="flex border-t border-border bg-white">
      <button
        onClick={() => onPageChange('discover')}
        className={`flex-1 py-4 transition-colors ${
          currentPage === 'discover'
            ? 'border-t-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Home size={24} className="mx-auto" />
      </button>
      <button
        onClick={() => onPageChange('messages')}
        className={`flex-1 py-4 transition-colors ${
          currentPage === 'messages'
            ? 'border-t-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <MessageSquare size={24} className="mx-auto" />
      </button>
      <button
        onClick={() => onPageChange('profile')}
        className={`flex-1 py-4 transition-colors ${
          currentPage === 'profile'
            ? 'border-t-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <User size={24} className="mx-auto" />
      </button>
    </div>
  )
}
