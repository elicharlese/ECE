"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MatcapCard } from "@/components/3d/MatcapCard"
import { ChevronUp, ChevronDown, Filter, SlidersHorizontal, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Sample product data
const products = [
  {
    id: 1,
    name: "Blockchain Security Scanner",
    description: "A comprehensive security scanner for smart contracts with automated vulnerability detection.",
    price: 12999,
    image: "/images/products/security-scanner.png",
    seller: "4-6 weeks",
    rating: 4.8,
    badge: "Popular",
    tags: ["Security", "Smart Contracts", "Auditing"],
  },
  {
    id: 2,
    name: "Cross-Chain Bridge",
    description: "Secure bridge application for transferring assets between different blockchain networks.",
    price: 15999,
    image: "/images/products/blockchain-bridge.png",
    seller: "6-8 weeks",
    rating: 4.7,
    badge: "New",
    tags: ["Cross-Chain", "Interoperability", "Asset Transfer"],
  },
  {
    id: 3,
    name: "DeFi Yield Aggregator",
    description: "Platform that automatically finds and allocates assets to the highest yielding DeFi protocols.",
    price: 18999,
    image: "/images/products/defi-protocol.png",
    seller: "8-10 weeks",
    rating: 4.5,
    tags: ["DeFi", "Yield Farming", "Aggregator"],
  },
  {
    id: 4,
    name: "NFT Gaming Platform",
    description: "Complete platform for creating and monetizing blockchain games with NFT assets.",
    price: 24999,
    image: "/images/products/nft-gaming.png",
    seller: "10-12 weeks",
    rating: 4.9,
    badge: "Complex",
    tags: ["NFT", "Gaming", "Marketplace"],
  },
  {
    id: 5,
    name: "Zero Knowledge Proofs",
    description: "Privacy-focused application using zero-knowledge proofs for secure and private transactions.",
    price: 19999,
    image: "/images/products/zero-knowledge-proofs.png",
    seller: "8-10 weeks",
    rating: 4.6,
    tags: ["Privacy", "Zero Knowledge", "Cryptography"],
  },
  {
    id: 6,
    name: "Decentralized Storage",
    description: "Distributed storage solution for securely storing and retrieving data across the blockchain.",
    price: 14999,
    image: "/images/products/decentralized-storage.png",
    seller: "6-8 weeks",
    rating: 4.4,
    tags: ["Storage", "Decentralized", "IPFS"],
  },
  {
    id: 7,
    name: "Analytics Dashboard",
    description: "Comprehensive analytics dashboard for monitoring blockchain metrics and performance.",
    price: 9999,
    image: "/images/products/analytics-dashboard.png",
    seller: "4-6 weeks",
    rating: 4.3,
    tags: ["Analytics", "Dashboard", "Metrics"],
  },
  {
    id: 8,
    name: "DeFi Portfolio Manager",
    description: "Portfolio management tool for tracking and optimizing DeFi investments across protocols.",
    price: 16999,
    image: "/images/products/defi-portfolio.png",
    seller: "6-8 weeks",
    rating: 4.7,
    tags: ["DeFi", "Portfolio", "Management"],
  },
]

// Helper function to get different shapes for different products
function getShapeForProduct(id: number) {
  const shapes = ["cube", "rounded", "cylinder", "torus", "sphere"] as const
  return shapes[id % shapes.length]
}

export default function VerticalFeedPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const scrollToNext = () => {
    if (activeIndex < products.length - 1) {
      setIsScrolling(true)
      setActiveIndex(activeIndex + 1)
    }
  }

  const scrollToPrevious = () => {
    if (activeIndex > 0) {
      setIsScrolling(true)
      setActiveIndex(activeIndex - 1)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScrolling(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [activeIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        scrollToNext()
      } else if (e.key === "ArrowUp") {
        scrollToPrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/app/marketplace">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Vertical Marketplace</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </div>
      </div>

      <div className="relative card-stack-container">
        {/* Navigation Controls */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-20">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToPrevious}
            disabled={activeIndex === 0}
            className="nav-control rounded-full shadow-md"
            aria-label="Previous product"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <span className="text-xs bg-muted px-2 py-1 rounded-full text-center">
            {activeIndex + 1}/{products.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToNext}
            disabled={activeIndex === products.length - 1}
            className="nav-control rounded-full shadow-md"
            aria-label="Next product"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Card Stack */}
        <div className="h-[calc(100vh-200px)] overflow-hidden">
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${activeIndex * 100}%)` }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className={cn("h-[calc(100vh-200px)] p-4 card-stack-item", isScrolling ? "opacity-50" : "opacity-100")}
              >
                <Card className="h-full border overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col h-full">
                    {/* Product Image */}
                    <div className="h-1/2 bg-muted relative">
                      <MatcapCard
                        title={product.name}
                        shape={getShapeForProduct(product.id)}
                        color="#0e5f59"
                        width="100%"
                        height="100%"
                        rotationSpeed={0.002}
                        fixedScroll={true}
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-6 flex flex-col flex-grow card-content">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-semibold">{product.name}</h3>
                        <span className="font-medium text-xl">${(product.price / 100).toFixed(2)}</span>
                      </div>

                      <p className="text-muted-foreground mb-6 text-lg">{product.description}</p>

                      {/* Tags */}
                      {product.tags && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {product.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-primary/5 text-primary border-primary/20 px-3 py-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-sm text-muted-foreground">Development time: {product.seller}</span>
                        <span className="text-sm text-muted-foreground">★ {product.rating}</span>
                      </div>

                      <Button className="mt-6 w-full" size="lg" asChild>
                        <Link href={`/app/marketplace/${product.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col space-y-1 z-20">
          {products.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === activeIndex ? "bg-primary h-8" : "bg-muted",
              )}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
