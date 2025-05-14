"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Cloud } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CartSyncNotification() {
  const { isSynced, lastSynced, syncCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [showNotification, setShowNotification] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    // Don't show notification on initial load
    if (initialLoad) {
      setInitialLoad(false)
      return
    }

    if (isAuthenticated && isSynced) {
      setShowNotification(true)
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isSynced, isAuthenticated, initialLoad])

  if (!showNotification || !isAuthenticated) {
    return null
  }

  return (
    <Alert className="fixed bottom-4 right-4 w-auto max-w-md bg-white dark:bg-gray-800 shadow-lg border border-green-200 dark:border-green-900 z-50 animate-in slide-in-from-bottom-10 duration-300">
      <Cloud className="h-4 w-4 text-green-500" />
      <AlertTitle>Cart synced</AlertTitle>
      <AlertDescription>Your cart has been synced and will be available on all your devices.</AlertDescription>
    </Alert>
  )
}
