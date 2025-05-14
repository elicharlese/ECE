"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackSrc?: string
  aspectRatio?: string
  skeletonClassName?: string
}

export function LazyImage({
  src,
  alt,
  fallbackSrc,
  className,
  aspectRatio = "aspect-video",
  skeletonClassName,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Reset states when src changes
    setLoaded(false)
    setError(false)
  }, [src])

  // Check if the image is already cached
  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true)
    }
  }, [])

  const handleLoad = () => {
    setLoaded(true)
  }

  const handleError = () => {
    setError(true)
  }

  return (
    <div className={cn("relative overflow-hidden", aspectRatio, className)}>
      {!loaded && !error && <Skeleton className={cn("absolute inset-0 w-full h-full", skeletonClassName)} />}
      <img
        ref={imgRef}
        src={error && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
        {...props}
      />
    </div>
  )
}
