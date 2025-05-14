"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  lowResSrc?: string
  fallbackSrc?: string
  aspectRatio?: string
  skeletonClassName?: string
}

export function BlurImage({
  src,
  alt,
  lowResSrc,
  fallbackSrc,
  className,
  aspectRatio = "aspect-video",
  skeletonClassName,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || src)

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true)
    setIsError(false)
    setCurrentSrc(lowResSrc || src)

    if (!lowResSrc) return

    const highResImage = new Image()
    highResImage.src = src

    highResImage.onload = () => {
      setCurrentSrc(src)
      setIsLoading(false)
    }

    highResImage.onerror = () => {
      setIsError(true)
      setIsLoading(false)
    }
  }, [src, lowResSrc])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsError(true)
    if (fallbackSrc) {
      setCurrentSrc(fallbackSrc)
    }
  }

  return (
    <div className={cn("relative overflow-hidden", aspectRatio, className)}>
      {isLoading && <Skeleton className={cn("absolute inset-0 w-full h-full", skeletonClassName)} />}
      <img
        src={currentSrc || "/placeholder.svg"}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoading && lowResSrc ? "image-blur-up" : "",
          !isLoading && "image-blur-up loaded",
        )}
        {...props}
      />
    </div>
  )
}
