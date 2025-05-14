"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useDemo } from "./demo-context"

// Define the wishlist item type
export type WishlistItem = {
  id: number
  title: string
  price: number
  currency: string
  image: string
  seller: {
    name: string
    verified: boolean
  }
  addedAt: string
}

// Define the wishlist context type
type WishlistContextType = {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, "addedAt">) => void
  removeItem: (id: number) => void
  clearWishlist: () => void
  isInWishlist: (id: number) => boolean
  toggleWishlist: (item: Omit<WishlistItem, "addedAt">) => void
}

// Create the wishlist context
const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearWishlist: () => {},
  isInWishlist: () => false,
  toggleWishlist: () => {},
})

// Create the wishlist provider
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { user } = useAuth()
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [initialized, setInitialized] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      const storedWishlist = localStorage.getItem("ece-wishlist")
      if (storedWishlist) {
        try {
          setItems(JSON.parse(storedWishlist))
        } catch (error) {
          console.error("Failed to parse wishlist from localStorage:", error)
        }
      }
      setInitialized(true)
    }
  }, [initialized])

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    if (initialized && typeof window !== "undefined") {
      localStorage.setItem("ece-wishlist", JSON.stringify(items))
    }
  }, [items, initialized])

  // Function to add an item to the wishlist
  const addItem = (item: Omit<WishlistItem, "addedAt">) => {
    setItems((prevItems) => {
      // Check if the item is already in the wishlist
      if (prevItems.some((i) => i.id === item.id)) {
        return prevItems
      }

      // Add the item to the wishlist with the current date
      const newItem: WishlistItem = {
        ...item,
        addedAt: new Date().toISOString(),
      }

      toast({
        title: "Added to Wishlist",
        description: `${item.title} has been added to your wishlist.`,
      })

      return [...prevItems, newItem]
    })
  }

  // Function to remove an item from the wishlist
  const removeItem = (id: number) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id)
      if (itemToRemove) {
        toast({
          title: "Removed from Wishlist",
          description: `${itemToRemove.title} has been removed from your wishlist.`,
        })
      }
      return prevItems.filter((item) => item.id !== id)
    })
  }

  // Function to clear the wishlist
  const clearWishlist = () => {
    setItems([])
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    })
  }

  // Function to check if an item is in the wishlist
  const isInWishlist = (id: number) => {
    return items.some((item) => item.id === id)
  }

  // Function to toggle an item in the wishlist
  const toggleWishlist = (item: Omit<WishlistItem, "addedAt">) => {
    if (isInWishlist(item.id)) {
      removeItem(item.id)
    } else {
      addItem(item)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// Create a hook to use the wishlist context
export const useWishlist = () => useContext(WishlistContext)
