export const AVAILABLE_BREEDS = [
  'golden',
  'dachshund',
  'corgi',
  'labrador',
  'poodle',
  'bulldog',
  'husky',
  'beagle',
  'german',
  'pug',
]

export const PUPPY_NAMES = [
  'Max', 'Bella', 'Charlie', 'Duke', 'Daisy', 'Rocky',
  'Sophie', 'Cooper', 'Sadie', 'Bailey', 'Buddy', 'Jasper'
]

export const PUPPY_AGES = [
  '2 years', '1 year', '3 years', '2 years', '18 months', '2.5 years',
  '1 year', '3 years', '2 years', '1.5 years', '2.8 years', '1.2 years'
]

export const PUPPY_DISTANCES = [
  '2.3 km away', '1.8 km away', '3.1 km away', '1.5 km away', '2.1 km away',
  '1.9 km away', '2.8 km away', '1.2 km away', '2.6 km away', '1.4 km away',
  '2.9 km away', '1.7 km away'
]

export const DEFAULT_USER_PROFILE = {
  name: 'Buddy',
  breed: 'Golden Retriever',
  age: 3,
  description: 'Love to play fetch and make new dog friends!',
  maxDistance: 25,
  photos: ['/buddy.jpg'],
  preferredBreeds: ['golden', 'dachshund', 'corgi', 'labrador'],
}

export const MOCK_MATCHES = [
  {
    id: 1,
    name: 'Luna',
    breed: 'Golden Retriever',
    avatar: '/luna.jpg',
    lastMessage: 'Luna just wants to play!',
    time: '2m',
    messages: [
      { id: 1, senderId: 'match' as const, text: 'Hey there! Luna here! 🐾', timestamp: '10:30 AM' },
      { id: 2, senderId: 'user' as const, text: 'Hi Luna! Your profile is adorable!', timestamp: '10:32 AM' },
      { id: 3, senderId: 'match' as const, text: 'Aww thanks! Buddy looks super friendly too!', timestamp: '10:33 AM' },
      { id: 4, senderId: 'user' as const, text: 'He is! Would love to set up a playdate', timestamp: '10:35 AM' },
      { id: 5, senderId: 'match' as const, text: 'That sounds pawsome! Do you know any good dog parks nearby?', timestamp: '10:36 AM' },
      { id: 6, senderId: 'user' as const, text: 'I know a great one in SF! Check out the map below', timestamp: '10:38 AM' },
      { id: 7, senderId: 'match' as const, text: 'Luna just wants to play!', timestamp: '10:40 AM' },
    ],
  },
  {
    id: 2,
    name: 'Max',
    breed: 'Husky',
    avatar: 'https://images.dog.ceo/breeds/husky/n02110185_10047.jpg',
    lastMessage: 'Ready for park time? 🦴',
    time: '1h',
    messages: [
      { id: 1, senderId: 'match' as const, text: 'Woof! Max here, ready to make new friends!', timestamp: '9:00 AM' },
      { id: 2, senderId: 'user' as const, text: 'Hey Max! Love your fluffy coat!', timestamp: '9:05 AM' },
      { id: 3, senderId: 'match' as const, text: 'Thanks! I love running and playing fetch', timestamp: '9:10 AM' },
      { id: 4, senderId: 'user' as const, text: 'Buddy loves fetch too! We should meet up', timestamp: '9:15 AM' },
      { id: 5, senderId: 'match' as const, text: 'Ready for park time? 🦴', timestamp: '9:20 AM' },
    ],
  },
  {
    id: 3,
    name: 'Bella',
    breed: 'Corgi',
    avatar: 'https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1030.jpg',
    lastMessage: 'See you at the park! 🌳',
    time: '3h',
    messages: [
      { id: 1, senderId: 'match' as const, text: 'Hi! Bella the corgi here!', timestamp: '7:00 AM' },
      { id: 2, senderId: 'user' as const, text: 'OMG those little legs are so cute!', timestamp: '7:10 AM' },
      { id: 3, senderId: 'match' as const, text: 'Hehe thanks! I may be short but I can run fast!', timestamp: '7:15 AM' },
      { id: 4, senderId: 'user' as const, text: 'Want to race at Dolores Park this weekend?', timestamp: '7:20 AM' },
      { id: 5, senderId: 'match' as const, text: 'See you at the park! 🌳', timestamp: '7:25 AM' },
    ],
  },
]
