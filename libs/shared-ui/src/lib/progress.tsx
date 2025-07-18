'use client'

import { cn } from './utils'
import { forwardRef } from 'react'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  className?: string
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'destructive'
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
  className,
  value = 0,
  max = 100,
  variant = 'default',
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const variants = {
    default: "bg-[#819AFF]",
    accent: "bg-gradient-to-r from-[#F92672] to-[#FD5C63]",
    success: "bg-[#A6E22E]",
    warning: "bg-[#E6DB74]",
    destructive: "bg-[#F92672]"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[#75715E]/20",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300 ease-out", variants[variant])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
})

Progress.displayName = "Progress"
