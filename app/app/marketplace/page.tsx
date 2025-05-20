"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ProductSkeleton } from "@/components/skeletons/product-skeleton"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import {
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronUp,
  Gavel,
  Tag,
  Shield,
  DollarSign,
  ImageIcon,
  Server,
  BarChart2,
  Star,
  Share2,
  Eye,
  Info,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"
import Link from "next/link"
import { SwipeContainer } from "@/components/ui/swipe-container"

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAuctionsOnly, setShowAuctionsOnly] = useState(false)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const productFeedRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  // Add these state variables after the existing state declarations
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])

  // Replace the existing fetchProducts function with this paginated version
  const fetchProducts = async (pageNumber = 1, append = false) => {
    if (pageNumber === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      // In a real app, this would be an API call with pagination
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const categories = ["security", "defi", "nft", "infrastructure", "analytics"]
      const productNames = {
        security: [
          "Blockchain Security Scanner",
          "Smart Contract Auditor",
          "Crypto Wallet Defender",
          "Zero-Day Vulnerability Shield",
        ],
        defi: [
          "DeFi Yield Aggregator",
          "Liquidity Pool Optimizer",
          "Cross-Chain Swap Protocol",
          "Staking Rewards Maximizer",
        ],
        nft: [
          "NFT Gaming Platform",
          "Digital Art Marketplace",
          "Collectible Token Generator",
          "Metaverse Asset Manager",
        ],
        infrastructure: [
          "Cross-Chain Bridge",
          "Decentralized Storage Solution",
          "Layer 2 Scaling Protocol",
          "Blockchain Indexer",
        ],
        analytics: [
          "Analytics Dashboard",
          "On-Chain Data Visualizer",
          "Trading Pattern Analyzer",
          "Portfolio Performance Tracker",
        ],
      }

      const descriptions = {
        security: [
          "Automatically scans smart contracts for vulnerabilities and security flaws before deployment.",
          "Comprehensive security suite for blockchain applications with real-time threat monitoring.",
          "Enterprise-grade security solution for protecting digital assets and smart contracts.",
          "Advanced protection against common attack vectors in blockchain applications.",
        ],
        defi: [
          "Maximize your yield farming returns across multiple protocols automatically.",
          "Intelligent routing of transactions to find the best rates across DEXs.",
          "Seamlessly move assets between different blockchain networks with minimal fees.",
          "Optimize your staking strategy across multiple chains and protocols.",
        ],
        nft: [
          "Create, trade, and earn from blockchain gaming assets with built-in marketplace.",
          "Mint and sell digital art with customizable royalty structures and creator tools.",
          "Generate unique collectible tokens with verifiable rarity and provenance.",
          "Manage and monetize your virtual assets across multiple metaverse platforms.",
        ],
        infrastructure: [
          "Secure bridge for transferring assets between different blockchain networks.",
          "Distributed storage solution with blockchain-based verification and incentives.",
          "Scaling solution that increases transaction throughput while maintaining security.",
          "High-performance indexing service for blockchain data with advanced query capabilities.",
        ],
        analytics: [
          "Real-time analytics dashboard for monitoring blockchain metrics and performance.",
          "Visualize complex on-chain data with customizable charts and reports.",
          "Identify trading patterns and market trends with AI-powered analysis.",
          "Track your portfolio performance across multiple wallets and exchanges.",
        ],
      }

      // Generate 10 products per page
      const itemsPerPage = 10
      const startIndex = (pageNumber - 1) * itemsPerPage

      // Simulate a limited dataset (50 products total)
      const maxProducts = 50
      const remainingProducts = maxProducts - startIndex

      // If no more products, set hasMore to false
      if (remainingProducts <= 0) {
        setHasMore(false)
        if (pageNumber === 1) {
          setProducts([])
          setAllProducts([])
        }
        return
      }

      // Generate only the products for this page
      const productsToGenerate = Math.min(itemsPerPage, remainingProducts)

      const mockProducts: Product[] = Array.from({ length: productsToGenerate }, (_, i) => {
        const globalIndex = startIndex + i
        const id = (globalIndex + 1).toString()
        const categoryIndex = Math.floor(globalIndex / 4) % categories.length
        const category = categories[categoryIndex]
        const nameIndex = globalIndex % 4
        const descIndex = globalIndex % 4
        const isAuction = Math.random() > 0.7 // 30% chance of being an auction
        const rating = (Math.random() * 2 + 3).toFixed(1)
        const reviews = Math.floor(Math.random() * 100) + 10
        const price = Math.floor(Math.random() * 20000) + 5000
        const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0 // 30% chance of discount
        const tags = [category, isAuction ? "auction" : "fixed-price", Math.random() > 0.5 ? "trending" : "new"]

        return {
          id,
          name: productNames[category as keyof typeof productNames][nameIndex],
          description: descriptions[category as keyof typeof descriptions][descIndex],
          price,
          originalPrice: discount > 0 ? Math.floor(price * (100 / (100 - discount))) : undefined,
          discount,
          image: `/images/products/${category}-${Math.floor(Math.random() * 3) + 1}.png`,
          category,
          rating,
          reviews,
          inStock: Math.random() > 0.1,
          isAuction,
          tags,
          features: [
            "Cross-platform compatibility",
            "Regular security updates",
            "Developer API access",
            "24/7 technical support",
          ],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        }
      })

      if (append) {
        setProducts((prev) => [...prev, ...mockProducts])
        setAllProducts((prev) => [...prev, ...mockProducts])
      } else {
        setProducts(mockProducts)
        setAllProducts(mockProducts)
      }

      setPage(pageNumber)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load marketplace products",
        variant: "destructive",
      })
    } finally {
      if (pageNumber === 1) {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
  }

  // Replace the existing useEffect that calls fetchProducts
  useEffect(() => {
    // Reset pagination when filters change
    setPage(1)
    setHasMore(true)
    fetchProducts(1, false)
  }, [toast])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      })
    }
  }

  // Replace the existing filteredProducts calculation
  const filteredProducts = allProducts.filter((product) => {
    // Filter by search query
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by category
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true

    // Filter by auction status
    const matchesAuctionStatus = showAuctionsOnly ? product.isAuction : true

    return matchesSearch && matchesCategory && matchesAuctionStatus
  })

  const scrollToNextProduct = () => {
    if (currentProductIndex < filteredProducts.length - 1) {
      setIsScrolling(true)
      setCurrentProductIndex(currentProductIndex + 1)
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  const scrollToPreviousProduct = () => {
    if (currentProductIndex > 0) {
      setIsScrolling(true)
      setCurrentProductIndex(currentProductIndex - 1)
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  // Add this function after the scrollToPreviousProduct function
  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(page + 1, true)
    }
  }

  // Reset current product index when filters change
  // Replace the existing useEffect that resets currentProductIndex
  useEffect(() => {
    setCurrentProductIndex(0)

    // Reset and reload products when filters change
    if (searchQuery || selectedCategory !== null || showAuctionsOnly) {
      // Apply filters to existing products
      const filtered = allProducts.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true
        const matchesAuctionStatus = showAuctionsOnly ? product.isAuction : true
        return matchesSearch && matchesCategory && matchesAuctionStatus
      })

      // If we have very few results after filtering, try to load more
      if (filtered.length < 5 && hasMore && !loadingMore) {
        loadMoreProducts()
      }
    }
  }, [searchQuery, selectedCategory, showAuctionsOnly]) // eslint-disable-line react-hooks/exhaustive-deps

  const categories = [
    { id: "security", name: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "defi", name: "DeFi", icon: <DollarSign className="h-4 w-4" /> },
    { id: "nft", name: "NFT", icon: <ImageIcon className="h-4 w-4" /> },
    { id: "infrastructure", name: "Infrastructure", icon: <Server className="h-4 w-4" /> },
    { id: "analytics", name: "Analytics", icon: <BarChart2 className="h-4 w-4" /> },
  ]

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        scrollToPreviousProduct()
      } else if (e.key === "ArrowDown") {
        scrollToNextProduct()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentProductIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Add this useEffect after the keyboard navigation useEffect
  useEffect(() => {
    // Check if we need to load more products when approaching the end
    if (filteredProducts.length > 0 && currentProductIndex >= filteredProducts.length - 3 && hasMore && !loadingMore) {
      loadMoreProducts()
    }
  }, [currentProductIndex, filteredProducts.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Replace the existing useEffect that shows the navigation tip toast
  useEffect(() => {
    if (!loading && filteredProducts.length > 1) {
      toast({
        title: "Navigation tip",
        description:
          "Swipe up/down or use arrow keys to navigate. More products will load automatically as you scroll.",
        duration: 5000,
      })
    }
  }, [loading, filteredProducts.length, toast])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-1">
                    <Button
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span className="flex items-center">
                          {category.icon}
                          <span className="ml-2">{category.name}</span>
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Listing Type</h3>
                  <div className="space-y-1">
                    <Button
                      variant={!showAuctionsOnly ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowAuctionsOnly(false)}
                    >
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        All Listings
                      </span>
                    </Button>
                    <Button
                      variant={showAuctionsOnly ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowAuctionsOnly(true)}
                    >
                      <span className="flex items-center">
                        <Gavel className="h-4 w-4 mr-2" />
                        Auctions Only
                      </span>
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="flex items-center space-x-2">
                    <Input type="number" placeholder="Min" className="w-full" />
                    <span>-</span>
                    <Input type="number" placeholder="Max" className="w-full" />
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* Product Feed */}
          <div className="relative">
            {/* Navigation Controls */}
            <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToPreviousProduct}
                disabled={currentProductIndex === 0 || loading}
                className="h-8 w-8 p-0 rounded-full shadow-sm"
                aria-label="Previous product"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              {!loading && filteredProducts.length > 0 && (
                <span className="text-xs bg-muted px-2 py-1 rounded-full text-center">
                  {currentProductIndex + 1} / {filteredProducts.length}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToNextProduct}
                disabled={currentProductIndex === filteredProducts.length - 1 || loading}
                className="h-8 w-8 p-0 rounded-full shadow-sm"
                aria-label="Next product"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {loading ? (
              <div className="h-[700px] flex items-center justify-center">
                <ProductSkeleton className="w-full max-w-3xl mx-auto h-full" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <SwipeContainer
                ref={productFeedRef}
                className="h-[700px] overflow-hidden"
                onSwipeUp={scrollToNextProduct}
                onSwipeDown={scrollToPreviousProduct}
                threshold={30}
              >
                <div
                  className="flex flex-col transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateY(-${currentProductIndex * 100}%)` }}
                >
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={cn(
                        "h-full min-h-[700px] shrink-0",
                        index === currentProductIndex ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden={index !== currentProductIndex}
                    >
                      <Card className="h-full overflow-hidden flex flex-col">
                        <div className="relative h-[350px] bg-muted">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                          {product.discount && product.discount > 0 && (
                            <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                              {product.discount}% OFF
                            </Badge>
                          )}
                          {product.isAuction && (
                            <Badge className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600">Auction</Badge>
                          )}
                          <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full h-8 w-8"
                              onClick={() => handleToggleWishlist(product)}
                            >
                              <Heart
                                className={cn("h-4 w-4", isInWishlist(product.id) ? "fill-red-500 text-red-500" : "")}
                              />
                              <span className="sr-only">Add to wishlist</span>
                            </Button>
                            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
                              <Share2 className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                          </div>
                        </div>
                        <CardContent className="flex-1 p-6 flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h2 className="text-2xl font-bold">{product.name}</h2>
                              <div className="flex items-center mt-1 space-x-2">
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "h-4 w-4",
                                        i < Math.floor(Number(product.rating))
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300",
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {product.rating} ({product.reviews} reviews)
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              {product.originalPrice ? (
                                <>
                                  <p className="text-sm line-through text-muted-foreground">
                                    ${product.originalPrice.toLocaleString()}
                                  </p>
                                  <p className="text-2xl font-bold text-red-600">${product.price.toLocaleString()}</p>
                                </>
                              ) : (
                                <p className="text-2xl font-bold">${product.price.toLocaleString()}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.tags?.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="capitalize">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <p className="text-muted-foreground mb-6">{product.description}</p>

                          <div className="mb-6">
                            <h3 className="font-medium mb-2">Key Features</h3>
                            <ul className="space-y-1">
                              {product.features?.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <ArrowRight className="h-4 w-4 mr-2 mt-1 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-auto">
                            <div className="flex flex-wrap gap-3">
                              <Button size="lg" className="flex-1" onClick={() => handleAddToCart(product)}>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                              </Button>
                              <Button size="lg" variant="outline" className="flex-1" asChild>
                                <Link href={`/app/marketplace/${product.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t p-4 bg-muted/30">
                          <div className="flex items-center justify-between w-full text-sm">
                            <div className="flex items-center">
                              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {product.inStock ? "In stock" : "Out of stock"}
                              </span>
                            </div>
                            <span className="text-muted-foreground">Added {formatDate(product.createdAt)}</span>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                  {loadingMore && (
                    <div className="h-full min-h-[700px] shrink-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Loading more products...</p>
                      </div>
                    </div>
                  )}
                  {!loadingMore && hasMore && filteredProducts.length > 0 && (
                    <div className="h-full min-h-[700px] shrink-0 flex items-center justify-center">
                      <Button onClick={loadMoreProducts} className="gap-2">
                        <ChevronDown className="h-4 w-4" />
                        Load More Products
                      </Button>
                    </div>
                  )}
                </div>
              </SwipeContainer>
            ) : (
              <div className="h-[700px] flex items-center justify-center">
                <div className="text-center max-w-md">
                  <h2 className="text-xl font-bold mb-2">No products found</h2>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory(null)
                      setShowAuctionsOnly(false)
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format dates
function formatDate(date: Date | undefined): string {
  if (!date) return "Recently"

  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`

  return date.toLocaleDateString()
}
