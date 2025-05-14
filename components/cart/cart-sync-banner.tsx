"use client"

import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Cloud } from "lucide-react"
import Link from "next/link"

export function CartSyncBanner() {
  const { isAuthenticated } = useAuth()
  const { items } = useCart()

  // Only show banner if user is not authenticated and has items in cart
  if (isAuthenticated || items.length === 0) {
    return null
  }

  return (
    <Alert className="mb-4 bg-muted/50 border-muted">
      <Cloud className="h-4 w-4 text-muted-foreground" />
      <AlertDescription className="flex items-center justify-between">
        <span>Sign in to save your cart and access it on any device.</span>
        <Button asChild variant="outline" size="sm" className="ml-2">
          <Link href="/login">Sign In</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
