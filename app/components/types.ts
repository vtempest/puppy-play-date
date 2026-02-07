export interface Puppy {
  id: number
  name: string
  breed: string
  age: string
  image: string
  distance: string
}

export interface UserProfile {
  name: string
  breed: string
  age: number
  description: string
  maxDistance: number
  photos: string[]
  preferredBreeds: string[]
}

export interface ChatMessage {
  id: number
  senderId: 'user' | 'match'
  text: string
  timestamp: string
}

export interface Match {
  id: number
  name: string
  breed: string
  avatar: string
  lastMessage: string
  time: string
  messages: ChatMessage[]
}
