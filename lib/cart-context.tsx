"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  saveCartToDatabase,
  getCartFromDatabase,
  clearCartInDatabase,
  checkCartTableExists,
} from "@/actions/cart-actions"

export interface CartItem {
  id: number
  title: string
  price: number
  currency: string
  image: string
  quantity: number
  seller: {
    name: string
    verified: boolean
  }
  savedForLater?: boolean
  addedAt?: Date
}

interface SyncStatus {
  status: "idle" | "syncing" | "success" | "error"
  lastSynced: Date | null
  error: string | null
  retryCount: number
  pendingChanges: boolean
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity" | "savedForLater" | "addedAt">) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  isLoading: boolean
  syncCart: () => Promise<void>
  isSynced: boolean
  lastSynced: Date | null
  syncStatus: SyncStatus
  saveForLater: (itemId: number) => void
  moveToCart: (itemId: number) => void
  savedItems: CartItem[]
  recentlyAddedItems: CartItem[]
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
  isLoading: false,
  syncCart: async () => {},
  isSynced: false,
  lastSynced: null,
  syncStatus: {
    status: "idle",
    lastSynced: null,
    error: null,
    retryCount: 0,
    pendingChanges: false,
  },
  saveForLater: () => {},
  moveToCart: () => {},
  savedItems: [],
  recentlyAddedItems: [],
})

// Time constants
const SYNC_DEBOUNCE_TIME = 2000 // 2 seconds
const RETRY_DELAY_BASE = 3000 // 3 seconds
const MAX_RETRY_COUNT = 5
const RECENT_ITEM_THRESHOLD = 5 * 60 * 1000 // 5 minutes in milliseconds

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [syncTimeout, setSyncTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isSynced, setIsSynced] = useState(false)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [dbAvailable, setDbAvailable] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: "idle",
    lastSynced: null,
    error: null,
    retryCount: 0,
    pendingChanges: false,
  })
  const pendingChangesRef = useRef(false)
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  // Calculate total item count (excluding saved for later items)
  const itemCount = items.filter((item) => !item.savedForLater).reduce((total, item) => total + item.quantity, 0)

  // Calculate subtotal (excluding saved for later items)
  const subtotal = items
    .filter((item) => !item.savedForLater)
    .reduce((total, item) => total + item.price * item.quantity, 0)

  // Get saved items
  const savedItems = items.filter((item) => item.savedForLater)

  // Get recently added items (added in the last 5 minutes)
  const recentlyAddedItems = items.filter(
    (item) =>
      !item.savedForLater && item.addedAt && new Date().getTime() - item.addedAt.getTime() < RECENT_ITEM_THRESHOLD,
  )

  // Set isClient to true when component mounts (client-side)
  useEffect(() => {
    setIsClient(true)

    // Set up online/offline event listeners
    const handleOnline = () => {
      setIsOnline(true)
      // Try to sync when coming back online
      if (pendingChangesRef.current) {
        syncCartToDatabase()
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setSyncStatus((prev) => ({
        ...prev,
        status: "idle",
        error: "You are currently offline. Changes will be synced when you reconnect.",
        pendingChanges: true,
      }))
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Check if cart table exists
  useEffect(() => {
    if (isClient && isAuthenticated && user?.id) {
      checkCartTableExists().then((result) => {
        setDbAvailable(result.exists)
        if (!result.exists) {
          console.warn("Cart table does not exist yet. Some features may not work properly.")
        }
      })
    }
  }, [isClient, isAuthenticated, user?.id])

  // Load cart from localStorage on initial render (client-side only)
  useEffect(() => {
    if (isClient) {
      try {
        // Try to load from sessionStorage first (more temporary)
        const sessionCart = sessionStorage.getItem("eceCart")
        if (sessionCart) {
          const parsedCart = JSON.parse(sessionCart)
          // Convert string dates back to Date objects
          const processedCart = parsedCart.map((item: any) => ({
            ...item,
            addedAt: item.addedAt ? new Date(item.addedAt) : undefined,
          }))
          setItems(processedCart)
        } else {
          // Fall back to localStorage (more persistent)
          const savedCart = localStorage.getItem("eceCart")
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart)
            // Convert string dates back to Date objects
            const processedCart = parsedCart.map((item: any) => ({
              ...item,
              addedAt: item.addedAt ? new Date(item.addedAt) : undefined,
            }))
            setItems(processedCart)
          }
        }
      } catch (error) {
        console.error("Failed to parse cart from storage:", error)
        // Clear corrupted data
        localStorage.removeItem("eceCart")
        sessionStorage.removeItem("eceCart")
      }
      setIsLoading(false)
    }
  }, [isClient])

  // Sync with database when user logs in
  useEffect(() => {
    if (isClient && isAuthenticated && user?.id && dbAvailable && isOnline) {
      fetchCartFromDatabase()
    }
  }, [isClient, isAuthenticated, user?.id, dbAvailable, isOnline])

  // Update cart badge animation when item count changes
  useEffect(() => {
    if (isClient && itemCount > 0) {
      const cartBadge = document.querySelector(".cart-badge")
      if (cartBadge) {
        cartBadge.classList.add("pulse")
        setTimeout(() => {
          cartBadge.classList.remove("pulse")
        }, 1000)
      }
    }
  }, [itemCount, isClient])

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (isClient && !isLoading) {
      // Save to both storage types for redundancy
      try {
        // Convert Date objects to strings for storage
        const storageItems = items.map((item) => ({
          ...item,
          addedAt: item.addedAt ? item.addedAt.toISOString() : undefined,
        }))

        const cartJson = JSON.stringify(storageItems)
        localStorage.setItem("eceCart", cartJson)
        sessionStorage.setItem("eceCart", cartJson)

        // Mark that we have pending changes to sync
        if (items.length > 0) {
          pendingChangesRef.current = true
          setSyncStatus((prev) => ({ ...prev, pendingChanges: true }))
        }

        // Debounce database sync to avoid too many requests
        if (isAuthenticated && user?.id && dbAvailable && isOnline) {
          if (syncTimeout) clearTimeout(syncTimeout)

          const timeout = setTimeout(() => {
            syncCartToDatabase()
          }, SYNC_DEBOUNCE_TIME)

          setSyncTimeout(timeout)
        }
      } catch (error) {
        console.error("Failed to save cart to storage:", error)
        toast({
          title: "Error saving cart",
          description: "There was a problem saving your cart. Please try again.",
          variant: "destructive",
        })
      }
    }

    return () => {
      if (syncTimeout) clearTimeout(syncTimeout)
    }
  }, [items, isClient, isLoading, isAuthenticated, user?.id, dbAvailable, isOnline])

  // Fetch cart from database
  const fetchCartFromDatabase = async () => {
    if (!user?.id || !dbAvailable || !isOnline) return

    setIsLoading(true)
    setSyncStatus((prev) => ({ ...prev, status: "syncing" }))

    try {
      const result = await getCartFromDatabase(user.id)

      if (result.success && result.items) {
        // Merge with local cart
        const localCart = [...items]

        // Create maps for easier lookup
        const dbCartMap = new Map(
          result.items.map((item) => [
            item.id,
            {
              ...item,
              addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
            },
          ]),
        )
        const localCartMap = new Map(localCart.map((item) => [item.id, item]))

        // Start with DB items
        const mergedCart = result.items.map((item) => ({
          ...item,
          addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
          // Preserve saved for later status from local cart if it exists
          savedForLater: localCartMap.has(item.id) ? localCartMap.get(item.id)?.savedForLater : item.savedForLater,
        }))

        // Add local items that aren't in the database cart
        localCart.forEach((localItem) => {
          if (!dbCartMap.has(localItem.id)) {
            mergedCart.push(localItem)
          } else {
            // For items in both, use the higher quantity and most recent addedAt
            const index = mergedCart.findIndex((item) => item.id === localItem.id)
            if (index >= 0) {
              const dbItem = mergedCart[index]
              const localAddedAt = localItem.addedAt || new Date()
              const dbAddedAt = dbItem.addedAt ? new Date(dbItem.addedAt) : new Date()

              mergedCart[index] = {
                ...dbItem,
                quantity: Math.max(dbItem.quantity, localItem.quantity),
                addedAt: localAddedAt > dbAddedAt ? localAddedAt : dbAddedAt,
                savedForLater: localItem.savedForLater || dbItem.savedForLater,
              }
            }
          }
        })

        setItems(mergedCart)
        setIsSynced(true)
        setLastSynced(new Date())
        setSyncStatus({
          status: "success",
          lastSynced: new Date(),
          error: null,
          retryCount: 0,
          pendingChanges: false,
        })
        pendingChangesRef.current = false
      }
    } catch (error) {
      console.error("Error fetching cart from database:", error)
      setSyncStatus((prev) => ({
        ...prev,
        status: "error",
        error: "Failed to fetch your cart from the server.",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Sync cart to database with exponential backoff retry
  const syncCartToDatabase = async (retryCount = 0) => {
    if (!user?.id || !isOnline || !dbAvailable) {
      if (!isOnline) {
        pendingChangesRef.current = true
        setSyncStatus((prev) => ({
          ...prev,
          status: "error",
          error: "You are offline. Changes will be synced when you reconnect.",
          pendingChanges: true,
        }))
      }
      return
    }

    // Only sync active cart items (not saved for later)
    const activeItems = items.filter((item) => !item.savedForLater)

    if (activeItems.length === 0 && savedItems.length === 0) {
      // If cart is empty, clear in database
      try {
        await clearCartInDatabase(user.id)
        setIsSynced(true)
        setLastSynced(new Date())
        setSyncStatus({
          status: "success",
          lastSynced: new Date(),
          error: null,
          retryCount: 0,
          pendingChanges: false,
        })
        pendingChangesRef.current = false
        return
      } catch (error) {
        console.error("Error clearing empty cart in database:", error)
      }
    }

    setSyncStatus((prev) => ({ ...prev, status: "syncing" }))

    try {
      // Prepare items for database by converting Date objects to ISO strings
      const itemsForDb = items.map((item) => ({
        ...item,
        addedAt: item.addedAt ? item.addedAt.toISOString() : new Date().toISOString(),
      }))

      const result = await saveCartToDatabase(user.id, itemsForDb)

      if (result.success) {
        setIsSynced(true)
        setLastSynced(new Date())
        setSyncStatus({
          status: "success",
          lastSynced: new Date(),
          error: null,
          retryCount: 0,
          pendingChanges: false,
        })
        pendingChangesRef.current = false
      } else {
        throw new Error(result.error || "Unknown error syncing cart")
      }
    } catch (error) {
      console.error("Error syncing cart to database:", error)
      setIsSynced(false)

      // Implement exponential backoff for retries
      if (retryCount < MAX_RETRY_COUNT) {
        const nextRetryCount = retryCount + 1
        const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount)

        setSyncStatus((prev) => ({
          ...prev,
          status: "error",
          error: `Sync failed. Retrying in ${Math.round(delay / 1000)} seconds... (Attempt ${nextRetryCount}/${MAX_RETRY_COUNT})`,
          retryCount: nextRetryCount,
          pendingChanges: true,
        }))

        // Schedule retry
        setTimeout(() => {
          if (isOnline) {
            syncCartToDatabase(nextRetryCount)
          }
        }, delay)
      } else {
        // Max retries reached
        setSyncStatus((prev) => ({
          ...prev,
          status: "error",
          error: "Failed to sync after multiple attempts. Please try again later.",
          retryCount: MAX_RETRY_COUNT,
          pendingChanges: true,
        }))
      }
    }
  }

  // Manual sync function for critical operations
  const syncCart = useCallback(async () => {
    if (isAuthenticated && user?.id && dbAvailable && isOnline) {
      await syncCartToDatabase()
    } else if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Your cart will be synced when you reconnect to the internet.",
        duration: 3000,
      })
    }
  }, [isAuthenticated, user?.id, dbAvailable, isOnline, items])

  // Save item for later
  const saveForLater = useCallback((itemId: number) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, savedForLater: true } : item)))

    toast({
      title: "Item saved for later",
      description: "You can find this item in your saved items.",
      duration: 2000,
    })
  }, [])

  // Move item from saved to cart
  const moveToCart = useCallback((itemId: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, savedForLater: false, addedAt: new Date() } : item)),
    )

    toast({
      title: "Item moved to cart",
      description: "The item has been moved to your cart.",
      duration: 2000,
    })
  }, [])

  // Add item to cart
  const addItem = (item: Omit<CartItem, "quantity" | "savedForLater" | "addedAt">) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id && !i.savedForLater)

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        // Update the addedAt timestamp to now
        updatedItems[existingItemIndex].addedAt = new Date()

        toast({
          title: "Item quantity updated",
          description: `${item.title} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
          duration: 2000,
        })

        return updatedItems
      } else {
        // Check if item exists in saved items
        const savedItemIndex = prevItems.findIndex((i) => i.id === item.id && i.savedForLater)

        if (savedItemIndex >= 0) {
          // Item exists in saved items, move to cart and set quantity to 1
          const updatedItems = [...prevItems]
          updatedItems[savedItemIndex] = {
            ...updatedItems[savedItemIndex],
            savedForLater: false,
            quantity: 1,
            addedAt: new Date(),
          }

          toast({
            title: "Saved item added to cart",
            description: `${item.title} has been moved from saved items to your cart`,
            duration: 2000,
          })

          return updatedItems
        } else {
          // Item doesn't exist, add new item with quantity 1
          toast({
            title: "Item added to cart",
            description: `${item.title} has been added to your cart`,
            duration: 2000,
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const pathname = window.location.pathname
                  if (!pathname.includes("/app/cart") && !pathname.includes("/app/checkout")) {
                    window.location.href = "/app/cart"
                  }
                }}
              >
                View Cart
              </Button>
            ),
          })

          return [...prevItems, { ...item, quantity: 1, savedForLater: false, addedAt: new Date() }]
        }
      }
    })
  }

  // Remove item from cart
  const removeItem = (itemId: number) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === itemId)
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.title} has been removed from your ${itemToRemove.savedForLater ? "saved items" : "cart"}`,
          duration: 2000,
        })
      }

      const newItems = prevItems.filter((item) => item.id !== itemId)

      // If cart is empty after removal, clear localStorage
      if (newItems.length === 0 && isClient) {
        localStorage.removeItem("eceCart")
        sessionStorage.removeItem("eceCart")

        // Also clear database if user is authenticated
        if (isAuthenticated && user?.id && dbAvailable && isOnline) {
          clearCartInDatabase(user.id).catch((error) => {
            console.error("Error clearing cart in database:", error)
          })
        }
      }

      return newItems
    })
  }

  // Update item quantity
  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
    if (isClient) {
      localStorage.removeItem("eceCart")
      sessionStorage.removeItem("eceCart")

      // Also clear database if user is authenticated
      if (isAuthenticated && user?.id && dbAvailable && isOnline) {
        clearCartInDatabase(user.id).catch((error) => {
          console.error("Error clearing cart in database:", error)
        })
      }
    }

    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      duration: 2000,
    })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isLoading,
        syncCart,
        isSynced,
        lastSynced,
        syncStatus,
        saveForLater,
        moveToCart,
        savedItems,
        recentlyAddedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
