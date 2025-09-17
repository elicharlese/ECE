'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value?: number
  max?: number
  className?: string
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-[#75715E]/30',
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-gradient-to-r from-[#F92672] to-[#66D9EF] transition-all duration-300 ease-out"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    )
  }
)

Progress.displayName = 'Progress'

export { Progress }
