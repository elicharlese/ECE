"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"

interface TiltImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function TiltImage({ src, alt, className = "", width = 500, height = 300 }: TiltImageProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    // Calculate position relative to center of element
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setPosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    // Reset position with a slight delay for smooth animation
    setTimeout(() => setPosition({ x: 0, y: 0 }), 100)
  }

  // Calculate transform based on mouse position
  const transform = isHovering
    ? `perspective(1000px) rotateX(${position.y * -10}deg) rotateY(${position.x * 10}deg) scale3d(1.05, 1.05, 1.05)`
    : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"

  // Calculate highlight position
  const highlightOpacity = isHovering ? 0.15 : 0
  const highlightX = 50 + position.x * 100
  const highlightY = 50 + position.y * 100

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        width: width,
        height: height,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform,
          transformStyle: "preserve-3d",
        }}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Highlight overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: highlightOpacity,
            background: `radial-gradient(circle at ${highlightX}% ${highlightY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`,
          }}
        />
      </div>
    </div>
  )
}
