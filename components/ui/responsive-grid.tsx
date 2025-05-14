import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: {
    sm?: number
    md?: number
    lg?: number
  }
}

export function ResponsiveGrid({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = { sm: 4, md: 6, lg: 8 },
  className,
  ...props
}: ResponsiveGridProps) {
  // Create class names manually instead of using template literals
  const gridClasses = [
    "grid w-full",
    `grid-cols-${columns.sm || 1}`,
    `sm:grid-cols-${columns.sm || 1}`,
    `md:grid-cols-${columns.md || 2}`,
    `lg:grid-cols-${columns.lg || 3}`,
    `xl:grid-cols-${columns.xl || 4}`,
    `gap-${gap.sm || 4}`,
    `md:gap-${gap.md || 6}`,
    `lg:gap-${gap.lg || 8}`,
  ].join(" ")

  return (
    <div className={cn(gridClasses, className)} {...props}>
      {children}
    </div>
  )
}
