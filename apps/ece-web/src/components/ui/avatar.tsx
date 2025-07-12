'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  children?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

interface AvatarImageProps {
  src: string
  alt: string
  className?: string
}

interface AvatarFallbackProps {
  children: React.ReactNode
  className?: string
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn('aspect-square h-full w-full object-cover', className)}
        src={src}
        alt={alt}
        {...props}
      />
    )
  }
)

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'
AvatarImage.displayName = 'AvatarImage'
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
