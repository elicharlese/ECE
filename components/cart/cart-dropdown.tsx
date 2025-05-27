"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export function CartDropdown() {
  const [itemCount, setItemCount] = useState(2)
  const [items, setItems] = useState([
    { id: 1, name: "Security Scanner", price: 299.99, image: "/images/products/security-scanner.png" },
    { id: 2, name: "DeFi Protocol", price: 499.99, image: "/images/products/defi-protocol.png" },
  ])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // This would normally come from an API or context
    const storedCart = localStorage.getItem("cartItems")
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
          setItemCount(parsedCart.length)
        }
      } catch (e) {
        console.error("Error parsing cart data:", e)
      }
    }
  }, [])

  if (!mounted) return null

  const subtotal = items.reduce((total, item) => total + item.price, 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <DropdownMenuLabel>Your Cart</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {itemCount === 0 ? (
          <div className="p-4 text-center text-muted-foreground">Your cart is empty</div>
        ) : (
          <>
            <div className="max-h-72 overflow-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-muted/50">
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            <DropdownMenuSeparator />

            <div className="p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/app/cart">
                  <Button variant="outline" size="sm" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/app/checkout">
                  <Button size="sm" className="w-full">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
