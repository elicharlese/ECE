'use client'

import { cn } from './utils'
import { forwardRef } from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(({
  className,
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center rounded-full border font-medium transition-colors"
  
  const variants = {
    default: "border-transparent bg-[#819AFF]/20 text-[#819AFF] hover:bg-[#819AFF]/30",
    secondary: "border-transparent bg-[#E6DB74]/20 text-[#E6DB74] hover:bg-[#E6DB74]/30",
    destructive: "border-transparent bg-[#F92672]/20 text-[#F92672] hover:bg-[#F92672]/30",
    outline: "border-[#66D9EF]/30 text-[#66D9EF] hover:bg-[#66D9EF]/10",
    accent: "border-transparent bg-[#A6E22E]/20 text-[#A6E22E] hover:bg-[#A6E22E]/30"
  }

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm", 
    lg: "px-3 py-2 text-base"
  }

  return (
    <div
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    />
  )
})

Badge.displayName = "Badge"
