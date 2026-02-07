'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Match } from './types'
import { ChatView } from './ChatView'
import Image from 'next/image'

interface MessagesPageProps {
  matches: Match[]
}

export function MessagesPage({ matches }: MessagesPageProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  if (selectedMatch) {
    return (
      <ChatView
        match={selectedMatch}
        onBack={() => setSelectedMatch(null)}
      />
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="mb-4 text-xl font-bold text-primary">Matches</h2>
      {matches.map((match) => (
        <Card
          key={match.id}
          className="cursor-pointer border-primary/20 p-4 hover:bg-secondary/50 transition-colors"
          onClick={() => setSelectedMatch(match)}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-secondary flex-shrink-0">
              <Image
                src={match.avatar}
                alt={match.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{match.name}</h3>
                <span className="text-xs text-muted-foreground">{match.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{match.lastMessage}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
