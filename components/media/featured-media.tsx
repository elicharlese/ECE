"use client"

import { useMedia } from "@/context/media-context"
import { MediaCard } from "@/components/media/media-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FeaturedMedia() {
  const { featuredMedia } = useMedia()

  // Get the top 5 featured items
  const topFeatured = featuredMedia.slice(0, 5)

  if (topFeatured.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Content</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/media/featured">
            <span className="flex items-center">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main featured item */}
        <div className="lg:col-span-2">{topFeatured[0] && <MediaCard media={topFeatured[0]} variant="featured" />}</div>

        {/* Secondary featured items */}
        <div className="grid grid-cols-1 gap-4">
          {topFeatured.slice(1, 3).map((item) => (
            <MediaCard key={item.id} media={item} variant="compact" />
          ))}
        </div>
      </div>

      {/* Additional featured items */}
      {topFeatured.length > 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topFeatured.slice(3, 5).map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      )}
    </div>
  )
}
