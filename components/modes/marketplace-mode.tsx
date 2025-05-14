"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDemo } from "@/lib/demo-context"
import { demoMarketplaceProducts, demoMarketplaceCategories } from "@/lib/demo-data"
import { ProductSkeleton } from "@/components/skeletons/product-skeleton"
import { useLoadingState } from "@/hooks/use-loading-state"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { ShoppingCart, Eye, Plus, Heart, Search, Package, AlertCircle, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function MarketplaceMode() {
  const router = useRouter()
  const { isDemoMode } = useDemo()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoading] = useLoadingState(true)
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({})
  const { toast } = useToast()

  // In a real app, you would fetch this data from your API
  const products = isDemoMode ? demoMarketplaceProducts : []
  const categories = isDemoMode ? demoMarketplaceCategories : []

  // Filter products based on search query and active category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || product.category.toLowerCase() === activeCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const handleViewProduct = useCallback(
    (productId: number) => {
      router.push(`/app/marketplace/${productId}`)
    },
    [router],
  )

  const handleAddToCart = useCallback(
    (event: React.MouseEvent, product: any) => {
      event.stopPropagation()

      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        currency: product.currency,
        image: product.image || "/placeholder.svg",
        seller: product.seller,
      })

      // Show visual feedback
      setAddedItems((prev) => ({ ...prev, [product.id]: true }))

      // Show toast notification
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
        duration: 3000,
      })

      // Reset visual feedback after 2 seconds
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [product.id]: false }))
      }, 2000)
    },
    [addItem, toast],
  )

  const handleToggleWishlist = useCallback(
    (event: React.MouseEvent, product: any) => {
      event.stopPropagation()

      toggleWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        currency: product.currency,
        image: product.image || "/placeholder.svg",
        seller: product.seller,
      })

      // Show toast notification
      toast({
        title: isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist",
        description: `${product.title} has been ${isInWishlist(product.id) ? "removed from" : "added to"} your wishlist.`,
        duration: 3000,
      })
    },
    [toggleWishlist, isInWishlist, toast],
  )

  const handleSearch = useCallback(() => {
    // Log search analytics
    console.log("Search query:", searchQuery)

    // In a real app, you might want to update the URL or perform an API call
    // router.push(`/app/marketplace?search=${encodeURIComponent(searchQuery)}`)

    // Show toast notification
    toast({
      title: "Search results",
      description: `Showing results for "${searchQuery}"`,
      duration: 3000,
    })
  }, [searchQuery, toast])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    },
    [handleSearch],
  )

  // Render null state for real users when no products are available
  const renderNullState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">No products available yet</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          We're currently building our marketplace. Soon, you'll be able to browse and purchase blockchain applications
          and tools here.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/app/chat")}>
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Contact Support
            </span>
          </Button>
          <Button className="flex items-center gap-2" onClick={() => router.push("/app/profile")}>
            <span className="flex items-center gap-2">
              Get Notified When Products Launch
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h2 className="text-2xl font-bold">Marketplace</h2>
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search products..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <span className="sr-only">Clear</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <Button
              className="bg-[#0e5f59] hover:bg-[#0e5f59]/90 dark:bg-[#14a89d] dark:hover:bg-[#14a89d]/90"
              onClick={handleSearch}
              aria-label="Search"
              data-testid="search-button"
            >
              <span className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search
              </span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 overflow-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            {isDemoMode ? (
              isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden bg-card border shadow-sm card-hover-glow cursor-pointer group relative"
                        onClick={() => handleViewProduct(product.id)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleViewProduct(product.id)
                          }
                        }}
                        role="button"
                        aria-label={`View ${product.title}`}
                      >
                        {/* Quick action buttons */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewProduct(product.id)
                                }}
                                aria-label={`View details for ${product.title}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View details</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant={isInWishlist(product.id) ? "default" : "secondary"}
                                className={`h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-all ${
                                  isInWishlist(product.id) ? "bg-primary text-primary-foreground" : ""
                                }`}
                                onClick={(e) => handleToggleWishlist(e, product)}
                                aria-label={`${isInWishlist(product.id) ? "Remove from" : "Add to"} wishlist`}
                                aria-pressed={isInWishlist(product.id)}
                              >
                                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant={addedItems[product.id] ? "default" : "secondary"}
                                className={`h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-all ${
                                  addedItems[product.id] ? "bg-primary text-primary-foreground" : ""
                                }`}
                                onClick={(e) => handleAddToCart(e, product)}
                                aria-label="Add to cart"
                              >
                                {addedItems[product.id] ? (
                                  <ShoppingCart className="h-4 w-4 animate-in zoom-in-50 duration-300" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add to cart</TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Product image */}
                        <div className="h-40 bg-[#0e5f59]/10 dark:bg-[#14a89d]/10 flex items-center justify-center relative">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                          {product.isNew && (
                            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">New</Badge>
                          )}
                          {isInWishlist(product.id) && (
                            <div className="absolute top-2 left-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                              <Heart className="h-4 w-4 text-primary fill-primary" />
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold">{product.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">{product.category}</span>
                            <span className="font-medium">
                              {product.price} {product.currency}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">
                              ★ {product.rating} ({product.reviews} reviews)
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {product.seller.verified ? "✓ Verified" : ""}
                            </span>
                          </div>

                          {/* Action buttons (visible on mobile) */}
                          <div className="flex gap-2 mt-3 md:hidden">
                            <Button
                              className="flex-1"
                              size="sm"
                              variant={addedItems[product.id] ? "default" : "outline"}
                              onClick={(e) => handleAddToCart(e, product)}
                              aria-label={`Add ${product.title} to cart`}
                            >
                              {addedItems[product.id] ? (
                                <span>Added</span>
                              ) : (
                                <span className="flex items-center">
                                  <ShoppingCart className="h-4 w-4 mr-1" /> Cart
                                </span>
                              )}
                            </Button>
                            <Button
                              className="flex-1"
                              size="sm"
                              variant={isInWishlist(product.id) ? "default" : "outline"}
                              onClick={(e) => handleToggleWishlist(e, product)}
                              aria-label={`${isInWishlist(product.id) ? "Remove from" : "Add to"} wishlist`}
                              aria-pressed={isInWishlist(product.id)}
                            >
                              <span className="flex items-center">
                                <Heart className={`h-4 w-4 mr-1 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                                {isInWishlist(product.id) ? "Saved" : "Save"}
                              </span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No products found</h3>
                      <p className="text-muted-foreground mb-4">
                        We couldn't find any products matching your search criteria.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setActiveCategory("all")
                        }}
                      >
                        <span>Clear filters</span>
                      </Button>
                    </div>
                  )}
                </div>
              )
            ) : (
              renderNullState()
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
