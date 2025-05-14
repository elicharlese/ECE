"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { MediaItem } from "@/types/media"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2, Play, FileText, Music, ImageIcon, Video, Lock } from "lucide-react"
import { useMedia } from "@/context/media-context"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MediaCardProps {
  media: MediaItem
  variant?: "default" | "compact" | "featured"
  className?: string
}

export function MediaCard({ media, variant = "default", className }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { likeMedia, shareMedia } = useMedia()

  // Format the creation date
  const formattedDate = formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })

  // Format the duration (if applicable)
  const formatDuration = (seconds?: number) => {
    if (!seconds) return ""
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Get the appropriate icon based on media type
  const getMediaTypeIcon = () => {
    switch (media.type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    const kb = bytes / 1024
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`
    }
    const mb = kb / 1024
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`
    }
    const gb = mb / 1024
    return `${gb.toFixed(1)} GB`
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    likeMedia(media.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    shareMedia(media.id)
  }

  return (
    <Link href={`/app/media/${media.id}`}>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 h-full",
          isHovered && "shadow-md transform translate-y-[-4px]",
          variant === "featured" && "border-primary/20",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {/* Media thumbnail */}
          <div
            className={cn(
              "relative overflow-hidden bg-muted",
              variant === "compact" ? "h-32" : "h-48",
              variant === "featured" && "h-64",
            )}
          >
            <img
              src={media.thumbnailUrl || media.url}
              alt={media.title}
              className={cn("w-full h-full object-cover transition-transform duration-300", isHovered && "scale-105")}
            />

            {/* Duration badge for video/audio */}
            {media.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatDuration(media.duration)}
              </div>
            )}

            {/* Play button overlay for video/audio */}
            {(media.type === "video" || media.type === "audio") && (
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 bg-black/30",
                  isHovered && "opacity-100",
                )}
              >
                <div className="bg-white/90 rounded-full p-3">
                  <Play className="h-6 w-6 text-primary" fill="currentColor" />
                </div>
              </div>
            )}

            {/* Premium content indicator */}
            {media.isExclusive && (
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                Premium
              </div>
            )}

            {/* Featured badge */}
            {variant === "featured" && <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>}
          </div>

          {/* Media info */}
          <CardContent className={cn("p-4", variant === "compact" && "p-3")}>
            <div className="flex items-start gap-3">
              {variant !== "compact" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={media.creatorAvatar || "/placeholder.svg"} alt={media.creatorName} />
                  <AvatarFallback>{media.creatorName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}

              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-medium line-clamp-1",
                    variant === "compact" ? "text-sm" : "text-base",
                    variant === "featured" && "text-lg",
                  )}
                >
                  {media.title}
                </h3>

                {variant !== "compact" && (
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{media.description}</p>
                )}

                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <span className="flex items-center">
                    {getMediaTypeIcon()}
                    <span className="ml-1">{media.category}</span>
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formattedDate}</span>
                  {media.fileSize && variant !== "compact" && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{formatFileSize(media.fileSize)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          {/* Engagement stats */}
          <CardFooter className={cn("p-4 pt-0 flex justify-between", variant === "compact" && "p-3 pt-0")}>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-primary"
                onClick={handleLike}
              >
                <Heart className={cn("h-4 w-4 mr-1", media.likes > 0 && "fill-primary text-primary")} />
                <span className="text-xs">{media.likes}</span>
              </Button>

              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">{media.comments}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-primary"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span className="text-xs">{media.shares}</span>
              </Button>
            </div>

            {variant !== "compact" && (
              <div className="text-xs text-muted-foreground">{media.views.toLocaleString()} views</div>
            )}
          </CardFooter>
        </div>
      </Card>
    </Link>
  )
}
