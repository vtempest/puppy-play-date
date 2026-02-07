'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, Send, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Match, ChatMessage } from './types'
import Image from 'next/image'

// Dynamic import for map to avoid SSR issues
const MapComponent = dynamic(
  () => import('./MapComponent').then(mod => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }
)

interface ChatViewProps {
  match: Match
  onBack: () => void
}

// Dolores Park Dog Play Area in San Francisco
const DOG_PARK = {
  name: 'Dolores Park Dog Play Area',
  latitude: 37.7596,
  longitude: -122.4268,
}

export function ChatView({ match, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(match.messages)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: messages.length + 1,
      senderId: 'user',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-border bg-white p-4">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Back to messages"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-secondary">
          <Image
            src={match.avatar}
            alt={match.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{match.name}</h3>
          <p className="text-xs text-muted-foreground">{match.breed}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.senderId === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-secondary text-foreground rounded-bl-sm'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderId === 'user' ? 'text-white/70' : 'text-muted-foreground'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {/* Dog Park Suggestion Card */}
        <Card className="border-primary/20 overflow-hidden">
          <div className="p-3 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Suggested Meetup Spot</span>
            </div>
            <p className="text-sm text-foreground font-medium">{DOG_PARK.name}</p>
            <p className="text-xs text-muted-foreground">San Francisco, CA</p>
          </div>
          <div className="h-48 w-full">
            <MapComponent
              latitude={DOG_PARK.latitude}
              longitude={DOG_PARK.longitude}
              zoom={15}
            />
          </div>
          <div className="p-3">
            <Button
              size="sm"
              className="w-full rounded-full bg-primary text-white hover:bg-primary/90"
            >
              Suggest This Park
            </Button>
          </div>
        </Card>
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-white p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-border bg-secondary px-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="rounded-full bg-primary text-white hover:bg-primary/90"
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
