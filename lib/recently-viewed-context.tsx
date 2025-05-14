"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Product } from "@/types"

type RecentlyViewedItem = {
  product: Product
  viewedAt: string // ISO string timestamp
}

type RecentlyViewedContextType = {
  recentlyViewed: RecentlyViewedItem[]
  addToRecentlyViewed: (product: Product) => void
  removeFromRecentlyViewed: (productId: string) => void
  clearRecentlyViewed: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  recentlyViewed: [],
  addToRecentlyViewed: () => {},
  removeFromRecentlyViewed: () => {},
  clearRecentlyViewed: () => {},
})

export const useRecentlyViewed = () => useContext(RecentlyViewedContext)

export const RecentlyViewedProvider = ({ children }: { children: React.ReactNode }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([])
  const [initialized, setInitialized] = useState(false)

  // Load recently viewed items from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      const savedItems = localStorage.getItem("eceRecentlyViewed")
      if (savedItems) {
        try {
          setRecentlyViewed(JSON.parse(savedItems))
        } catch (e) {
          console.error("Failed to parse recently viewed items", e)
        }
      }
      setInitialized(true)
    }
  }, [initialized])

  // Save to localStorage whenever the list changes
  useEffect(() => {
    if (typeof window !== "undefined" && initialized && recentlyViewed.length > 0) {
      localStorage.setItem("eceRecentlyViewed", JSON.stringify(recentlyViewed))
    }
  }, [recentlyViewed, initialized])

  // Use useCallback to memoize the function and prevent it from changing on every render
  const addToRecentlyViewed = useCallback((product: Product) => {
    if (!product || !product.id) return

    setRecentlyViewed((prev) => {
      // Check if the product is already in the list with the same ID
      const exists = prev.some((item) => item.product.id === product.id)

      // If it already exists, don't update the state to avoid re-renders
      if (exists) return prev

      // Remove the product if it already exists in the list
      const filtered = prev.filter((item) => item.product.id !== product.id)

      // Add the product to the beginning of the list with current timestamp
      const newItem = {
        product,
        viewedAt: new Date().toISOString(),
      }

      // Limit to 5 most recent items
      return [newItem, ...filtered].slice(0, 5)
    })
  }, [])

  const removeFromRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("eceRecentlyViewed")
    }
  }, [])

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        removeFromRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  )
}
