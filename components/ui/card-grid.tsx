import type React from "react"
import { cn } from "@/lib/utils"

interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  compact?: boolean
}

export function CardGrid({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 },
  gap = 6,
  compact = false,
  className,
  ...props
}: CardGridProps) {
  return (
    <div
      className={cn(
        "grid w-full",
        `grid-cols-${columns.xs || 1}`,
        `sm:grid-cols-${columns.sm || 2}`,
        `md:grid-cols-${columns.md || 3}`,
        `lg:grid-cols-${columns.lg || 3}`,
        `xl:grid-cols-${columns.xl || 4}`,
        `gap-${compact ? Math.max(2, gap - 2) : gap}`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
