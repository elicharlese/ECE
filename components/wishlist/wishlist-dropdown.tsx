"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Heart, Trash2, ShoppingCart, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

export function WishlistDropdown() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const popoutRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle click outside to close popout
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popoutRef.current &&
        !popoutRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleMoveToCart = (item: any, e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      currency: item.currency,
      image: item.image,
      seller: item.seller,
    })
    removeItem(item.id)
  }

  const handleViewWishlist = () => {
    router.push("/app/wishlist")
    setIsOpen(false)
  }

  const togglePopout = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <Button ref={buttonRef} variant="outline" size="icon" className="relative" onClick={togglePopout}>
        <Heart className="h-[1.2rem] w-[1.2rem]" />
        {items.length > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#0e5f59] dark:bg-[#14a89d]"
            variant="default"
          >
            {items.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div
          ref={popoutRef}
          className="absolute right-0 mt-2 w-80 bg-background rounded-lg border shadow-lg z-50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3 border-b flex justify-between items-center">
            <span className="font-medium">My Wishlist ({items.length})</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  clearWishlist()
                }}
                className="h-8 px-2"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="py-6 text-center">
              <div className="flex justify-center mb-2">
                <Heart className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Your wishlist is empty</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  router.push("/app/marketplace")
                  setIsOpen(false)
                }}
              >
                Browse Marketplace
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="max-h-[300px]">
                <div className="p-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex p-2 gap-3 hover:bg-muted/50 rounded-md transition-colors">
                      <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.price} {item.currency}
                        </p>
                        <div className="flex gap-1 mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={(e) => handleMoveToCart(item, e)}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeItem(item.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator />
              <div className="p-3">
                <Button className="w-full" onClick={handleViewWishlist}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Wishlist
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
