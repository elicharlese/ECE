"use client"

import type { MediaItem } from "@/types/media"
import { MediaCard } from "@/components/media/media-card"
import { cn } from "@/lib/utils"
import { LazyLoad } from "@/components/ui/lazy-load"
import { Skeleton } from "@/components/ui/skeleton"

interface MediaGridProps {
  items: MediaItem[]
  columns?: 2 | 3 | 4
  variant?: "default" | "compact"
  className?: string
}

export function MediaGrid({ items, columns = 3, variant = "default", className }: MediaGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
        <p className="text-muted-foreground">No media items found</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {items.map((item, index) => (
        <LazyLoad
          key={item.id}
          placeholder={<Skeleton className="w-full aspect-video rounded-md" />}
          offset={300}
          rootMargin="200px"
        >
          <MediaCard media={item} variant={variant} />
        </LazyLoad>
      ))}
    </div>
  )
}
