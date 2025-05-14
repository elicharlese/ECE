"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductDetailsSkeleton } from "@/components/skeletons/product-details-skeleton"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useRecentlyViewed } from "@/lib/recently-viewed-context"
import { RepositoryInfo } from "@/components/marketplace/repository-info"
import { DeploymentInfo } from "@/components/marketplace/deployment-info"
import { ProductUsePolicy } from "@/components/marketplace/product-use-policy"
import { ProductPricingTiers } from "@/components/marketplace/product-pricing-tiers"
import { BiddingPlatform } from "@/components/marketplace/bidding-platform"
import { MarketplaceFeed } from "@/components/marketplace/marketplace-feed"
import type { Product } from "@/types"
import { ShoppingCart, Heart, HeartOff, Star, ArrowLeft, Gavel } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RecommendedProducts } from "@/components/marketplace/recommended-products"

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [isAuction, setIsAuction] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const { toast } = useToast()
  const productAddedRef = useRef(false)

  useEffect(() => {
    // Simulate API call to fetch product details
    const fetchProduct = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Randomly determine if this is an auction (for demo purposes)
        const mockIsAuction = Math.random() > 0.5

        const mockProduct: Product = {
          id: id as string,
          name: `Blockchain Product ${id}`,
          description: "This is a cutting-edge blockchain product that will revolutionize your digital experience.",
          price: Math.floor(Math.random() * 1000) + 100,
          image: `/placeholder.svg?height=400&width=400&query=blockchain%20product%20${id}`,
          category: "blockchain",
          rating: 4.5,
          reviews: 120,
          inStock: true,
        }

        setProduct(mockProduct)
        setIsAuction(mockIsAuction)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }

    // Reset the ref when the component mounts or id changes
    productAddedRef.current = false
  }, [id, toast])

  // Add to recently viewed only once after product is loaded
  useEffect(() => {
    if (product && !productAddedRef.current) {
      addToRecentlyViewed(product)
      productAddedRef.current = true
    }
  }, [product, addToRecentlyViewed])

  const handleAddToCart = () => {
    if (product) {
      // If a tier is selected, use that price, otherwise use the base product price
      const priceToUse = selectedPrice !== null ? selectedPrice : product.price

      const productWithTier = {
        ...product,
        price: priceToUse,
        tier: selectedTier || "standard",
      }

      addToCart(productWithTier)
      toast({
        title: "Added to cart",
        description: `${product.name}${selectedTier ? ` (${selectedTier} tier)` : ""} has been added to your cart`,
      })
    }
  }

  const handleToggleWishlist = () => {
    if (!product) return

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

  const handleSelectTier = (tier: string, price: number) => {
    setSelectedTier(tier)
    setSelectedPrice(price)

    toast({
      title: "License tier selected",
      description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} tier selected at $${price.toFixed(2)}`,
    })
  }

  if (loading) {
    return <ProductDetailsSkeleton />
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
              <p className="text-muted-foreground">
                The product you are looking for does not exist or has been removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-4 flex items-center" onClick={() => router.back()}>
        <span className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </span>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                  <div className="relative w-full max-w-md aspect-square">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-md"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                        <Badge variant="destructive" className="text-lg py-2 px-4">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <Badge variant="outline" className="text-sm">
                      {product.category}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">({product.reviews} reviews)</span>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

                  <p className="text-muted-foreground mb-6">{product.description}</p>

                  {isAuction ? (
                    <div className="mb-4">
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 mb-2">
                        <Gavel className="mr-1 h-4 w-4" />
                        Auction
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        This item is available through auction. Place your bid below.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold mb-2">
                        ${selectedPrice !== null ? selectedPrice.toFixed(2) : product.price.toFixed(2)}
                      </div>

                      {selectedTier && (
                        <div className="mb-6">
                          <Badge variant="outline" className="text-sm">
                            {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} License
                          </Badge>
                        </div>
                      )}

                      {!selectedTier && (
                        <p className="text-sm text-muted-foreground mb-6">
                          Base price. Select a license tier below for additional features.
                        </p>
                      )}
                    </>
                  )}

                  <Separator className="mb-6" />

                  {!isAuction && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                      <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
                        <span className="flex items-center">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </span>
                      </Button>

                      <Button size="lg" variant="outline" className="flex-1" onClick={handleToggleWishlist}>
                        <span className="flex items-center">
                          {isInWishlist(product.id) ? (
                            <>
                              <HeartOff className="mr-2 h-5 w-5" />
                              Remove from Wishlist
                            </>
                          ) : (
                            <>
                              <Heart className="mr-2 h-5 w-5" />
                              Add to Wishlist
                            </>
                          )}
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Tabs defaultValue={isAuction ? "auction" : "overview"} className="w-full">
              <TabsList className="w-full grid grid-cols-6">
                {isAuction && (
                  <TabsTrigger value="auction">
                    <span className="flex items-center gap-2">
                      <Gavel className="h-4 w-4" />
                      <span className="hidden sm:inline">Auction</span>
                    </span>
                  </TabsTrigger>
                )}
                <TabsTrigger value="overview">
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="pricing">
                  <span>Pricing</span>
                </TabsTrigger>
                <TabsTrigger value="repository">
                  <span>Repository</span>
                </TabsTrigger>
                <TabsTrigger value="deployment">
                  <span>Deployment</span>
                </TabsTrigger>
                <TabsTrigger value="policy">
                  <span>Use Policy</span>
                </TabsTrigger>
              </TabsList>
              <div className="mt-6">
                {isAuction && (
                  <TabsContent value="auction" className="space-y-6">
                    <BiddingPlatform
                      productId={product.id}
                      productName={product.name}
                      startingPrice={product.price}
                      currentPrice={product.price * 1.1}
                    />
                  </TabsContent>
                )}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Product Overview</h2>
                      <p className="mb-4">
                        {product.name} is a comprehensive blockchain solution designed for enterprise use. It provides
                        secure, scalable, and efficient blockchain infrastructure that can be customized to meet your
                        specific business needs.
                      </p>
                      <h3 className="text-xl font-semibold mb-2">Key Features</h3>
                      <ul className="list-disc pl-5 space-y-1 mb-4">
                        <li>Enterprise-grade security with multi-layer protection</li>
                        <li>Scalable architecture supporting thousands of transactions per second</li>
                        <li>Interoperability with major blockchain networks</li>
                        <li>Customizable smart contract templates</li>
                        <li>Comprehensive analytics and reporting dashboard</li>
                        <li>24/7 technical support and maintenance</li>
                      </ul>
                      <h3 className="text-xl font-semibold mb-2">Technical Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">System Requirements</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Linux, Windows, or macOS</li>
                            <li>8GB RAM minimum (16GB recommended)</li>
                            <li>100GB storage space</li>
                            <li>Broadband internet connection</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Supported Protocols</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Ethereum</li>
                            <li>Hyperledger Fabric</li>
                            <li>Polkadot</li>
                            <li>Solana</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="pricing" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <ProductPricingTiers
                        productId={product.id}
                        productName={product.name}
                        basePrice={product.price}
                        onSelectTier={handleSelectTier}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="repository">
                  <RepositoryInfo productId={product.id} />
                </TabsContent>
                <TabsContent value="deployment">
                  <DeploymentInfo productId={product.id} />
                </TabsContent>
                <TabsContent value="policy">
                  <ProductUsePolicy productId={product.id} productName={product.name} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <MarketplaceFeed />

          {isAuction && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1" onClick={handleToggleWishlist}>
                <span className="flex items-center">
                  {isInWishlist(product.id) ? (
                    <>
                      <HeartOff className="mr-2 h-5 w-5" />
                      Remove from Watchlist
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-5 w-5" />
                      Add to Watchlist
                    </>
                  )}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <RecommendedProducts currentProductId={id as string} />
      </div>
    </div>
  )
}
