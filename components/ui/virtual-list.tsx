"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface VirtualListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  className?: string
  overscan?: number
  onEndReached?: () => void
  endReachedThreshold?: number
  scrollToIndex?: number
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  className,
  overscan = 3,
  onEndReached,
  endReachedThreshold = 0.8,
  scrollToIndex,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })
  const [totalHeight, setTotalHeight] = useState(items.length * itemHeight)
  const lastScrollTop = useRef(0)
  const hasEndReachedCalled = useRef(false)

  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, clientHeight } = containerRef.current
    const start = Math.floor(scrollTop / itemHeight) - overscan
    const end = Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan

    setVisibleRange({
      start: Math.max(0, start),
      end: Math.min(items.length, end),
    })

    // Check if we've reached the end for infinite loading
    if (onEndReached && !hasEndReachedCalled.current) {
      const scrollPosition = scrollTop + clientHeight
      const threshold = totalHeight * endReachedThreshold

      if (scrollPosition >= threshold) {
        hasEndReachedCalled.current = true
        onEndReached()
      }
    }

    lastScrollTop.current = scrollTop
  }, [itemHeight, items.length, overscan, onEndReached, totalHeight, endReachedThreshold])

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      calculateVisibleRange()
    }

    container.addEventListener("scroll", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [calculateVisibleRange])

  // Update when items change
  useEffect(() => {
    setTotalHeight(items.length * itemHeight)
    calculateVisibleRange()
    hasEndReachedCalled.current = false
  }, [items, itemHeight, calculateVisibleRange])

  // Handle scrollToIndex prop
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      containerRef.current.scrollTop = scrollToIndex * itemHeight
    }
  }, [scrollToIndex, itemHeight])

  // Initial calculation
  useEffect(() => {
    calculateVisibleRange()
  }, [calculateVisibleRange])

  const visibleItems = items.slice(visibleRange.start, visibleRange.end)

  return (
    <div
      ref={containerRef}
      className={cn("overflow-y-auto", className)}
      style={{ height: "100%", position: "relative" }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, index) => {
          const actualIndex = visibleRange.start + index
          return (
            <div
              key={actualIndex}
              style={{
                position: "absolute",
                top: actualIndex * itemHeight,
                height: itemHeight,
                width: "100%",
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
