"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ShoppingCart, Clock, X, Plus, Minus, Heart, ArrowRight, Tag, Truck, Search, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useRecentlyViewed } from "@/lib/recently-viewed-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

enum TabType {
  CART = "cart",
  RECENTLY_VIEWED = "recently",
  SAVED = "saved",
}

export function CartDropdown() {
  const { items, removeItem, clearCart, itemCount, subtotal, updateQuantity } = useCart()
  const { recentlyViewed, removeFromRecentlyViewed } = useRecentlyViewed()
  const { items: wishlistItems, removeItem: removeWishlistItem, addToCart: addWishlistItemToCart } = useWishlist()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CART)
  const [isOpen, setIsOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const popoutRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [persistentItemCount, setPersistentItemCount] = useState(0)
  const [persistentAuthState, setPersistentAuthState] = useState(false)

  // Add this useEffect to check for persistent auth state
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const persistentAuth = localStorage.getItem("eceAuthState")
        if (persistentAuth) {
          const authState = JSON.parse(persistentAuth)
          if (authState.timestamp && Date.now() - authState.timestamp < 24 * 60 * 60 * 1000) {
            setPersistentAuthState(true)
          }
        }
      } catch (e) {
        console.error("Error parsing persistent auth state:", e)
      }
    }
  }, [])

  // Load persistent cart state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCartState = localStorage.getItem("cartState")
      if (storedCartState) {
        try {
          const parsedState = JSON.parse(storedCartState)
          if (parsedState.itemCount !== undefined) {
            setPersistentItemCount(parsedState.itemCount)
          }
        } catch (e) {
          console.error("Error parsing cart state from localStorage:", e)
        }
      }
    }
  }, [])

  // Update persistent state when itemCount changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "cartState",
        JSON.stringify({
          itemCount,
          subtotal,
          lastUpdated: new Date().toISOString(),
        }),
      )
      setPersistentItemCount(itemCount)
    }
  }, [itemCount, subtotal])

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

  // Update cart badge animation when item count changes
  useEffect(() => {
    if (itemCount > 0) {
      const cartBadge = document.querySelector(".cart-badge")
      if (cartBadge) {
        cartBadge.classList.add("pulse")
        setTimeout(() => {
          cartBadge.classList.remove("pulse")
        }, 1000)
      }
    }
  }, [itemCount])

  const handleRemoveItem = (id: number, title: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeItem(id)
    toast({
      title: "Item removed",
      description: `${title} has been removed from your cart`,
    })
  }

  const handleClearCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  const handleRemoveRecentlyViewed = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (removeFromRecentlyViewed) {
      removeFromRecentlyViewed(id)
      toast({
        title: "Item removed",
        description: `${name} has been removed from your recently viewed items`,
      })
    }
  }

  const handleRemoveWishlistItem = (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeWishlistItem(id)
    toast({
      title: "Item removed",
      description: `${name} has been removed from your saved items`,
    })
  }

  const handleAddToCart = (item: any, e: React.MouseEvent) => {
    e.stopPropagation()
    addWishlistItemToCart(item)
    toast({
      title: "Item added to cart",
      description: `${item.title || item.name} has been added to your cart`,
    })
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.trim()) {
      toast({
        title: "Promo code applied",
        description: `Promo code "${promoCode}" has been applied to your order`,
      })
      setPromoCode("")
    }
  }

  const handleQuantityChange = (itemId: number, newQuantity: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity)
    }
  }

  const togglePopout = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  // Filter cart items by search query
  const filteredCartItems =
    items?.filter((item) => searchQuery === "" || item.title.toLowerCase().includes(searchQuery.toLowerCase())) || []

  // Filter recently viewed items by search query
  const filteredRecentItems =
    recentlyViewed?.filter(
      (item) => searchQuery === "" || item.product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  // Filter wishlist items by search query
  const filteredWishlistItems =
    wishlistItems?.filter(
      (item) => searchQuery === "" || (item.title || item.name).toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  // Calculate estimated delivery date (5 business days from now)
  const getEstimatedDelivery = () => {
    const date = new Date()
    let businessDays = 5
    while (businessDays > 0) {
      date.setDate(date.getDate() + 1)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        businessDays--
      }
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 100
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  // Use persistent item count if the actual count is still loading
  const displayItemCount = persistentItemCount || itemCount

  return (
    <div className="relative">
      <Button ref={buttonRef} variant="outline" size="icon" className="relative" onClick={togglePopout}>
        <ShoppingCart className="h-5 w-5" />
        {displayItemCount > 0 && (
          <Badge
            variant="destructive"
            className="cart-badge absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center"
          >
            {displayItemCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div
          ref={popoutRef}
          className="absolute right-0 mt-2 w-96 bg-background rounded-lg border shadow-lg z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-lg">Your Shopping Cart</h3>
            <div className="flex gap-2">
              {items.length > 0 && (
                <Button variant="ghost" size="sm" className="text-muted-foreground h-8" onClick={handleClearCart}>
                  Clear All
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b bg-background z-10 px-4 py-2 flex overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              <button
                className={cn(
                  "text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
                  activeTab === TabType.CART
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab(TabType.CART)}
              >
                Cart {items.length > 0 && <span className="ml-1 text-xs">({items.length})</span>}
              </button>
              <button
                className={cn(
                  "text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
                  activeTab === TabType.SAVED
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab(TabType.SAVED)}
              >
                Saved {wishlistItems.length > 0 && <span className="ml-1 text-xs">({wishlistItems.length})</span>}
              </button>
              <button
                className={cn(
                  "text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
                  activeTab === TabType.RECENTLY_VIEWED
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab(TabType.RECENTLY_VIEWED)}
              >
                Recent {recentlyViewed.length > 0 && <span className="ml-1 text-xs">({recentlyViewed.length})</span>}
              </button>
            </div>
          </div>

          {/* Cart Tab Content */}
          {activeTab === TabType.CART && (
            <>
              {filteredCartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="bg-muted/50 rounded-full p-6 mb-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-blue-950/20 dark:to-indigo-950/20"></div>
                    <ShoppingCart className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>

                  {searchQuery ? (
                    <p className="text-muted-foreground mb-6">
                      No items matching "<span className="font-medium">{searchQuery}</span>" found in your cart.
                    </p>
                  ) : (
                    <p className="text-muted-foreground mb-6">
                      Looks like you haven't added any items to your cart yet.
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs mx-auto my-4">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/app/marketplace" onClick={() => setIsOpen(false)}>
                        Browse Products
                      </Link>
                    </Button>
                    {wishlistItems.length > 0 && (
                      <Button size="sm" className="w-full" onClick={() => setActiveTab(TabType.SAVED)}>
                        View Saved Items
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <ScrollArea className="max-h-[400px]">
                    <div className="p-4 space-y-4">
                      {filteredCartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm font-medium leading-tight truncate">{item.title}</h4>
                              <div className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>

                            <p className="text-xs text-muted-foreground mt-1">
                              Seller: {item.seller.name}
                              {item.seller.verified && (
                                <Badge variant="outline" className="ml-1 py-0 px-1 h-4 text-[10px]">
                                  Verified
                                </Badge>
                              )}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-none rounded-l-md"
                                  onClick={(e) => handleQuantityChange(item.id, item.quantity - 1, e)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-none rounded-r-md"
                                  onClick={(e) => handleQuantityChange(item.id, item.quantity + 1, e)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Add to wishlist functionality would go here
                                    toast({
                                      title: "Item saved",
                                      description: `${item.title} has been saved for later`,
                                    })
                                  }}
                                >
                                  <Heart className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={(e) => handleRemoveItem(item.id, item.title, e)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Free shipping progress */}
                  <div className="px-4 py-3 bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          You've unlocked free shipping!
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Add <span className="font-medium">${amountToFreeShipping.toFixed(2)}</span> more for free
                          shipping
                        </p>
                      )}
                    </div>
                    <Progress value={shippingProgress} className="h-1.5" />
                  </div>

                  {/* Promo code */}
                  <div className="px-4 py-3 border-t">
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Button type="submit" variant="outline" size="sm" disabled={!promoCode.trim()}>
                        Apply
                      </Button>
                    </form>
                  </div>

                  {/* Order summary */}
                  <div className="px-4 py-3 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? "Free" : "$4.99"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${(subtotal * 0.1).toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${(subtotal * 1.1 + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99)).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Estimated delivery by <span className="font-medium">{getEstimatedDelivery()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/app/cart" onClick={() => setIsOpen(false)}>
                          View Cart
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href="/app/checkout" onClick={() => setIsOpen(false)}>
                          Checkout
                        </Link>
                      </Button>
                    </div>
                    <Button variant="link" size="sm" className="w-full mt-2 text-muted-foreground" asChild>
                      <Link href="/app/marketplace" onClick={() => setIsOpen(false)}>
                        Continue Shopping
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Saved Items Tab Content */}
          {activeTab === TabType.SAVED && (
            <>
              {filteredWishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="bg-muted/50 rounded-full p-6 mb-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-pink-950/20 dark:to-red-950/20"></div>
                    <Heart className="h-12 w-12 text-muted-foreground group-hover:text-rose-500 transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">No saved items</h3>

                  {searchQuery ? (
                    <p className="text-muted-foreground mb-6">
                      No saved items matching "<span className="font-medium">{searchQuery}</span>" found.
                    </p>
                  ) : (
                    <p className="text-muted-foreground mb-6">
                      Save items for later by clicking the heart icon on products you like.
                    </p>
                  )}

                  <Button asChild size="sm">
                    <Link href="/app/wishlist" onClick={() => setIsOpen(false)}>
                      Go to Wishlist
                    </Link>
                  </Button>
                </div>
              ) : (
                <ScrollArea className="max-h-[400px]">
                  <div className="p-4 space-y-4">
                    {filteredWishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title || item.name}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-medium leading-tight truncate">{item.title || item.name}</h4>
                            <div className="font-medium text-sm">${item.price.toFixed(2)}</div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={(e) => handleAddToCart(item, e)}
                            >
                              Add to Cart
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={(e) => handleRemoveWishlistItem(item.id, item.title || item.name, e)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="p-4 border-t">
                <Button asChild className="w-full">
                  <Link href="/app/wishlist" onClick={() => setIsOpen(false)}>
                    View All Saved Items
                  </Link>
                </Button>
              </div>
            </>
          )}

          {/* Recently Viewed Tab Content */}
          {activeTab === TabType.RECENTLY_VIEWED && (
            <>
              {filteredRecentItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="bg-muted/50 rounded-full p-6 mb-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-blue-950/20 dark:to-cyan-950/20"></div>
                    <Clock className="h-12 w-12 text-muted-foreground group-hover:text-blue-500 transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">No recently viewed items</h3>

                  {searchQuery ? (
                    <p className="text-muted-foreground mb-6">
                      No recently viewed items matching "<span className="font-medium">{searchQuery}</span>" found.
                    </p>
                  ) : (
                    <p className="text-muted-foreground mb-6">Items you view will appear here for easy access.</p>
                  )}

                  <Button asChild size="sm">
                    <Link href="/app/marketplace" onClick={() => setIsOpen(false)}>
                      Browse Products
                    </Link>
                  </Button>
                </div>
              ) : (
                <ScrollArea className="max-h-[400px]">
                  <div className="p-4 space-y-4">
                    {filteredRecentItems.map((item) => {
                      const viewedDate = new Date(item.viewedAt)
                      const today = new Date()
                      const yesterday = new Date(today)
                      yesterday.setDate(yesterday.getDate() - 1)

                      let timeLabel
                      if (viewedDate.toDateString() === today.toDateString()) {
                        timeLabel = "Today"
                      } else if (viewedDate.toDateString() === yesterday.toDateString()) {
                        timeLabel = "Yesterday"
                      } else {
                        timeLabel = formatDistanceToNow(viewedDate, { addSuffix: true })
                      }

                      return (
                        <div
                          key={item.product.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Link
                            href={`/app/marketplace/${item.product.id}`}
                            className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0"
                            onClick={() => setIsOpen(false)}
                          >
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <Link
                                href={`/app/marketplace/${item.product.id}`}
                                className="hover:underline"
                                onClick={() => setIsOpen(false)}
                              >
                                <h4 className="text-sm font-medium leading-tight truncate">{item.product.name}</h4>
                              </Link>
                              <div className="font-medium text-sm">${item.product.price.toFixed(2)}</div>
                            </div>

                            <p className="text-xs text-muted-foreground mt-1">
                              Viewed: <span className="font-medium">{timeLabel}</span>
                            </p>

                            <div className="flex items-center justify-between mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Add to cart functionality would go here
                                  toast({
                                    title: "Item added to cart",
                                    description: `${item.product.name} has been added to your cart`,
                                  })
                                }}
                              >
                                Add to Cart
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => handleRemoveRecentlyViewed(item.product.id, item.product.name, e)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
