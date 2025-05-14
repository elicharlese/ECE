"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface LazyLoadProps {
  children: ReactNode
  className?: string
  placeholder?: ReactNode
  threshold?: number
  rootMargin?: string
  once?: boolean
  offset?: number
}

export function LazyLoad({
  children,
  className,
  placeholder,
  threshold = 0.1,
  rootMargin = "0px",
  once = true,
  offset = 200,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Check if the element is visible
        const visible = entry.isIntersecting

        if (visible) {
          setIsVisible(true)
          if (once) {
            setHasBeenVisible(true)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        root: null,
        rootMargin: `${offset}px`,
        threshold,
      },
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, once, offset])

  // If the component has been visible before and once is true, always render children
  if (once && hasBeenVisible) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={cn("min-h-[10px]", className)}>
      {isVisible ? children : placeholder || <div className="h-full w-full" />}
    </div>
  )
}
