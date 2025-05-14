"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, CloudOff, RefreshCw } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CartSyncStatus() {
  const { syncStatus, syncCart } = useCart()
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  // Show the status indicator when there's an error or when syncing
  useEffect(() => {
    if (syncStatus.status === "error" || syncStatus.status === "syncing") {
      setVisible(true)
    } else if (syncStatus.status === "success") {
      // On success, show briefly then fade out
      setVisible(true)
      const timer = setTimeout(() => {
        setAnimating(true)
        const hideTimer = setTimeout(() => {
          setVisible(false)
          setAnimating(false)
        }, 500) // Duration of fade out animation
        return () => clearTimeout(hideTimer)
      }, 2000) // Show success for 2 seconds
      return () => clearTimeout(timer)
    }
  }, [syncStatus])

  if (!visible) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg p-3 text-sm shadow-lg transition-all duration-500",
        animating && "opacity-0 translate-y-2",
        syncStatus.status === "error" && "bg-destructive/10 text-destructive border border-destructive/20",
        syncStatus.status === "syncing" && "bg-primary/10 text-primary border border-primary/20",
        syncStatus.status === "success" && "bg-green-500/10 text-green-500 border border-green-500/20",
      )}
    >
      {syncStatus.status === "error" && (
        <>
          {navigator.onLine ? <AlertCircle className="h-4 w-4" /> : <CloudOff className="h-4 w-4" />}
          <span className="max-w-[200px]">{syncStatus.error || "Error syncing cart"}</span>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => syncCart()}>
            Retry
          </Button>
        </>
      )}

      {syncStatus.status === "syncing" && (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Syncing your cart...</span>
        </>
      )}

      {syncStatus.status === "success" && (
        <>
          <CheckCircle className="h-4 w-4" />
          <span>Cart synced successfully</span>
        </>
      )}
    </div>
  )
}
