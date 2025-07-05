'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'sidebar' | 'modal'
  animation?: 'none' | 'fadeIn' | 'slideUp'
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({
  children,
  className,
  variant = 'default',
  animation = 'fadeIn',
  ...props
}, ref) => {
  const baseClasses = "backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg"
  
  const variants = {
    default: "p-6",
    sidebar: "p-4 bg-white/5",
    modal: "p-8 bg-white/15 shadow-2xl"
  }

  const animations = {
    none: {},
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 }
    }
  }

  const Component = animation === 'none' ? 'div' : motion.div

  return (
    <Component
      ref={ref}
      className={cn(baseClasses, variants[variant], className)}
      {...(animation !== 'none' ? animations[animation] : {})}
      {...props}
    >
      {children}
    </Component>
  )
})

GlassCard.displayName = "GlassCard"
