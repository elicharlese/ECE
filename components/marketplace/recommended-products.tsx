"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { demoMarketplaceProducts } from "@/lib/demo-data"
import type { Product } from "@/types"
import Link from "next/link"
import { ArrowRight, Star, TrendingUp, Zap } from "lucide-react"

interface RecommendedProductsProps {
  currentProductId?: string
}

export function RecommendedProducts({ currentProductId }: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // Filter out current product if we're on a product detail page
    const filteredProducts = demoMarketplaceProducts
      .filter((product) => !currentProductId || product.id.toString() !== currentProductId)
      .slice(0, 6)

    setProducts(filteredProducts)
  }, [currentProductId])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <Link href="/app/marketplace" className="flex items-center text-sm text-primary hover:underline">
          <span className="flex items-center">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </Link>
      </div>

      <Tabs defaultValue="trending">
        <TabsList className="mb-4">
          <TabsTrigger value="trending">
            <span className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending
            </span>
          </TabsTrigger>
          <TabsTrigger value="new">
            <span className="flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              New
            </span>
          </TabsTrigger>
          <TabsTrigger value="popular">
            <span className="flex items-center">
              <Star className="mr-2 h-4 w-4" />
              Popular
            </span>
          </TabsTrigger>
        </TabsList>

        {["trending", "new", "popular"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/app/marketplace/${product.id}`}
                  className="block transition-transform hover:scale-[1.02]"
                >
                  <Card className="overflow-hidden h-full border border-border/40 hover:border-primary/20 transition-colors">
                    <div className="relative h-40 overflow-hidden bg-muted">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title || "Product image"}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-2 right-2">
                        {product.price} {product.currency || "USD"}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-1">{product.title || product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center mt-3 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                        <span>{product.rating}</span>
                        <span className="mx-1">•</span>
                        <span>{product.reviews} reviews</span>
                        <span className="mx-1">•</span>
                        <span>{product.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
