"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { MediaItem, MediaCategory, MediaCollection } from "@/types/media"

// Mock data for demonstration
import { demoMediaItems, demoMediaCategories, demoMediaCollections } from "@/lib/demo-media-data"

interface MediaContextProps {
  mediaItems: MediaItem[]
  featuredMedia: MediaItem[]
  trendingMedia: MediaItem[]
  recentMedia: MediaItem[]
  categories: MediaCategory[]
  collections: MediaCollection[]
  userMedia: MediaItem[]
  userCollections: MediaCollection[]
  isLoading: boolean
  getMediaById: (id: string) => MediaItem | undefined
  getMediaByCategory: (categoryId: string) => MediaItem[]
  getMediaByCreator: (creatorId: string) => MediaItem[]
  getCollectionById: (id: string) => MediaCollection | undefined
  likeMedia: (id: string) => void
  addView: (id: string) => void
  shareMedia: (id: string) => void
  searchMedia: (query: string) => MediaItem[]
}

const MediaContext = createContext<MediaContextProps | undefined>(undefined)

export function MediaProvider({ children }: { children: ReactNode }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [categories, setCategories] = useState<MediaCategory[]>([])
  const [collections, setCollections] = useState<MediaCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setMediaItems(demoMediaItems)
        setCategories(demoMediaCategories)
        setCollections(demoMediaCollections)
      } catch (error) {
        console.error("Error fetching media data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Derived media lists
  const featuredMedia = mediaItems.filter((item) => item.isFeatured)
  const trendingMedia = [...mediaItems].sort((a, b) => b.views - a.views).slice(0, 10)
  const recentMedia = [...mediaItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  // Mock user media (in a real app, this would be filtered by the logged-in user's ID)
  const userMedia = mediaItems.slice(0, 5)
  const userCollections = collections.slice(0, 3)

  const getMediaById = (id: string) => {
    return mediaItems.find((item) => item.id === id)
  }

  const getMediaByCategory = (categoryId: string) => {
    return mediaItems.filter((item) => item.category === categoryId)
  }

  const getMediaByCreator = (creatorId: string) => {
    return mediaItems.filter((item) => item.creatorId === creatorId)
  }

  const getCollectionById = (id: string) => {
    return collections.find((collection) => collection.id === id)
  }

  const likeMedia = (id: string) => {
    setMediaItems((prev) => prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item)))
  }

  const addView = (id: string) => {
    setMediaItems((prev) => prev.map((item) => (item.id === id ? { ...item, views: item.views + 1 } : item)))
  }

  const shareMedia = (id: string) => {
    setMediaItems((prev) => prev.map((item) => (item.id === id ? { ...item, shares: item.shares + 1 } : item)))
  }

  const searchMedia = (query: string) => {
    if (!query) return []

    const lowercaseQuery = query.toLowerCase()
    return mediaItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }

  return (
    <MediaContext.Provider
      value={{
        mediaItems,
        featuredMedia,
        trendingMedia,
        recentMedia,
        categories,
        collections,
        userMedia,
        userCollections,
        isLoading,
        getMediaById,
        getMediaByCategory,
        getMediaByCreator,
        getCollectionById,
        likeMedia,
        addView,
        shareMedia,
        searchMedia,
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  const context = useContext(MediaContext)
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider")
  }
  return context
}
