'use client'

import { useState, useEffect } from 'react'
import { Puppy } from '../components/types'
import { PUPPY_NAMES, PUPPY_AGES, PUPPY_DISTANCES } from '../components/constants'

export function usePuppies(selectedBreeds: string[]) {
  const [puppies, setPuppies] = useState<Puppy[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextPuppyId, setNextPuppyId] = useState(1)

  useEffect(() => {
    if (selectedBreeds.length === 0) return

    const fetchDogImages = async () => {
      try {
        setLoading(true)

        const puppyData: Puppy[] = []
        let puppyId = 1
        const dogsPerBreed = Math.ceil(20 / selectedBreeds.length)

        for (let i = 0; i < selectedBreeds.length; i++) {
          try {
            const response = await fetch(
              `https://dog.ceo/api/breed/${selectedBreeds[i]}/images/random/${dogsPerBreed}`
            )
            const data = await response.json()

            let images: string[] = []
            if (data.status === 'success' && data.message && data.message.length > 0) {
              images = Array.isArray(data.message) ? data.message : [data.message]
            }

            for (let j = 0; j < images.length && puppyData.length < 20; j++) {
              puppyData.push({
                id: puppyId++,
                name: PUPPY_NAMES[Math.floor(Math.random() * PUPPY_NAMES.length)],
                breed: selectedBreeds[i].charAt(0).toUpperCase() + selectedBreeds[i].slice(1),
                age: PUPPY_AGES[Math.floor(Math.random() * PUPPY_AGES.length)],
                image: images[j],
                distance: PUPPY_DISTANCES[Math.floor(Math.random() * PUPPY_DISTANCES.length)],
              })
            }
          } catch (breedError) {
            console.error(`Failed to fetch images for ${selectedBreeds[i]}:`, breedError)
          }
        }

        setPuppies(puppyData)
        setNextPuppyId(puppyId)
      } catch (error) {
        console.error('Failed to fetch dog images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDogImages()
  }, [selectedBreeds])

  const loadMoreDogs = async () => {
    if (isLoadingMore) return

    try {
      setIsLoadingMore(true)

      const newPuppies: Puppy[] = []
      let currentId = nextPuppyId
      const dogsToAdd = 10

      for (let i = 0; i < selectedBreeds.length && newPuppies.length < dogsToAdd; i++) {
        try {
          const response = await fetch(
            `https://dog.ceo/api/breed/${selectedBreeds[i]}/images/random/2`
          )
          const data = await response.json()

          let images: string[] = []
          if (data.status === 'success' && data.message && data.message.length > 0) {
            images = Array.isArray(data.message) ? data.message : [data.message]
          }

          for (let j = 0; j < images.length && newPuppies.length < dogsToAdd; j++) {
            newPuppies.push({
              id: currentId++,
              name: PUPPY_NAMES[Math.floor(Math.random() * PUPPY_NAMES.length)],
              breed: selectedBreeds[i].charAt(0).toUpperCase() + selectedBreeds[i].slice(1),
              age: PUPPY_AGES[Math.floor(Math.random() * PUPPY_AGES.length)],
              image: images[j],
              distance: PUPPY_DISTANCES[Math.floor(Math.random() * PUPPY_DISTANCES.length)],
            })
          }
        } catch (error) {
          console.error(`Failed to load more dogs for ${selectedBreeds[i]}:`, error)
        }
      }

      setPuppies(prev => [...prev, ...newPuppies])
      setNextPuppyId(currentId)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return {
    puppies,
    loading,
    isLoadingMore,
    loadMoreDogs,
  }
}
