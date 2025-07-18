'use client'

import { motion } from 'framer-motion'
import { cn } from './utils'
import { forwardRef } from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'light' | 'sidebar' | 'modal'
  animation?: 'wave' | 'breathe' | 'float' | 'slideUp' | 'fadeIn' | 'none'
  asChild?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({ 
  children, 
  className, 
  variant = 'default',
  animation = 'fadeIn',
  asChild = false,
  ...props
}, ref) => {
  const baseClasses = "rounded-xl backdrop-blur-md border shadow-lg"
  
  const variantClasses = {
    default: "bg-white/10 border-white/20 p-6",
    dark: "bg-[#272822]/80 border-white/10 p-6",
    light: "bg-[#F8EFD6]/15 border-white/30 p-6",
    sidebar: "bg-white/5 border-white/10 p-4",
    modal: "bg-white/15 border-white/30 p-8 shadow-2xl"
  }

  const animationProps = {
    wave: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, ease: "easeOut" }
    },
    breathe: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6 },
      whileHover: { scale: 1.02 }
    },
    float: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut" },
      whileHover: { y: -2 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6 }
    },
    none: {}
  }

  if (asChild) {
    return (
      <div 
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (animation === 'none') {
    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  // For motion.div, we need to filter out HTML drag/animation events to avoid conflicts
  const {
    onDrag,
    onDragEnd,
    onDragStart,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onTransitionEnd,
    ...motionSafeProps
  } = props;

  return (
    <motion.div
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...animationProps[animation]}
      {...motionSafeProps}
    >
      {children}
    </motion.div>
  )
})

GlassCard.displayName = "GlassCard"
