"use client"

import type React from "react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface SwipeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export function SwipeContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className,
  ...props
}: SwipeContainerProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Minimum distance required for swipe
  const minSwipeDistance = threshold

  const onTouchStart = (e: React.TouchEvent) => {
    if (!e.targetTouches || !e.targetTouches[0]) return

    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!e.targetTouches || !e.targetTouches[0]) return

    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)

    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) >= minSwipeDistance) {
        if (distanceX > 0 && onSwipeLeft) {
          // Swiped left
          onSwipeLeft()
        } else if (distanceX < 0 && onSwipeRight) {
          // Swiped right
          onSwipeRight()
        }
      }
    } else {
      if (Math.abs(distanceY) >= minSwipeDistance) {
        if (distanceY > 0 && onSwipeUp) {
          // Swiped up
          onSwipeUp()
        } else if (distanceY < 0 && onSwipeDown) {
          // Swiped down
          onSwipeDown()
        }
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <div
      ref={containerRef}
      className={cn("touch-pan-y", className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      {...props}
    >
      {children}
    </div>
  )
}
