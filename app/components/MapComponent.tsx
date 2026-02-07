'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapComponentProps {
  latitude: number
  longitude: number
  zoom?: number
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || ''

export function MapComponent({ latitude, longitude, zoom = 15 }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
    })

    // Add marker
    const markerEl = document.createElement('div')
    markerEl.innerHTML = `
      <div style="
        background-color: hsl(var(--primary));
        color: white;
        border-radius: 50%;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `

    new mapboxgl.Marker(markerEl)
      .setLngLat([longitude, latitude])
      .addTo(map.current)

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [latitude, longitude, zoom])

  return <div ref={mapContainer} className="h-full w-full" />
}
