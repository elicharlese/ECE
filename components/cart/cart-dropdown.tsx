"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

interface CartDropdownProps {
  showLabel?: boolean
}

export function CartDropdown({ showLabel = false }: CartDropdownProps) {
  const [mounted, setMounted] = useState(false)
  const { items = [] } = useCart?.() || {}
  const itemCount = items?.length || 0

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/80 transition-colors">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            {showLabel && <span className="hidden sm:inline">Cart</span>}
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Your Cart</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {itemCount === 0 ? (
          <div className="p-4 text-center text-muted-foreground">Your cart is empty</div>
        ) : (
          <>
            <div className="max-h-80 overflow-auto">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md">
                  <div className="w-10 h-10 bg-muted rounded-md flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name || `Product ${index + 1}`}</div>
                    <div className="text-xs text-muted-foreground">${item.price || "99.99"}</div>
                  </div>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2 flex justify-between">
              <span>Total:</span>
              <span className="font-bold">
                ${items.reduce((total, item) => total + (item.price || 99.99), 0).toFixed(2)}
              </span>
            </div>
          </>
        )}
        <DropdownMenuSeparator />
        <Link href="/app/cart">
          <DropdownMenuItem className="cursor-pointer">View Cart</DropdownMenuItem>
        </Link>
        <Link href="/app/checkout">
          <DropdownMenuItem className="cursor-pointer" disabled={itemCount === 0}>
            Checkout
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
