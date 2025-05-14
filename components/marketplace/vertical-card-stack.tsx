"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MatcapCard } from "@/components/3d/MatcapCard"
import { ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LazyLoad } from "@/components/ui/lazy-load"
import { LazyImage } from "@/components/ui/lazy-image"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  seller: string
  rating: number
  badge?: string
  tags?: string[]
}

interface VerticalCardStackProps {
  products: Product[]
  title: string
}

export function VerticalCardStack({ products, title }: VerticalCardStackProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [useMatcap, setUseMatcap] = useState(false) // Added declaration for useMatcap

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

  // Determine which shape to use based on product ID for variety
  const getShape = (id: number) => {
    const shapes = ["cube", "rounded", "cylinder", "torus", "sphere"] as const
    return shapes[id % shapes.length]
  }

  return (
    <div className="relative">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>

      {/* Navigation Controls */}
      <div className="absolute right-0 top-0 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToPrevious}
          disabled={activeIndex === 0}
          aria-label="Previous product"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToNext}
          disabled={activeIndex === products.length - 1}
          aria-label="Next product"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Card Stack Container */}
      <div ref={containerRef} className="relative h-[600px] overflow-hidden" aria-live="polite">
        <div
          className="absolute w-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${activeIndex * 100}%)` }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className={cn(
                "w-full h-[600px] p-4 transition-opacity duration-500",
                isScrolling ? "opacity-50" : "opacity-100",
              )}
            >
              <LazyLoad once={true} threshold={0.1} rootMargin="200px">
                <Card className="h-full border overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col h-full">
                    {/* Product Image */}
                    <div className="h-1/2 bg-muted relative">
                      {useMatcap ? (
                        <MatcapCard
                          title={product.name}
                          shape={getShape(product.id)}
                          color="#0e5f59"
                          width="100%"
                          height="100%"
                          rotationSpeed={0.002}
                          fixedScroll={true}
                        />
                      ) : (
                        <LazyImage
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fallbackSrc="/placeholder.svg"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          aspectRatio="aspect-[16/9]"
                        />
                      )}
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <span className="font-medium text-lg">${product.price}</span>
                      </div>

                      <p className="text-muted-foreground mb-4 flex-grow">{product.description}</p>

                      {/* Tags */}
                      {product.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-primary/5 text-primary border-primary/20"
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

                      <Button className="mt-4 w-full" asChild>
                        <Link href={`/app/marketplace/${product.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </LazyLoad>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Indicators */}
      <div className="flex justify-center mt-4 space-x-1">
        {products.map((_, index) => (
          <button
            key={index}
            className={cn("w-2 h-2 rounded-full transition-all", index === activeIndex ? "bg-primary w-6" : "bg-muted")}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
