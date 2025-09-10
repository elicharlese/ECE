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
  const baseClasses = "rounded-xl backdrop-blur-md border shadow-lg transition-all duration-300"
  
  const variantClasses = {
    default: "bg-white/10 border-gray-200/30 p-6 hover:bg-white/15 hover:border-gray-200/40 dark:bg-black/10 dark:border-gray-700/30 dark:hover:bg-black/15 dark:hover:border-gray-700/40",
    dark: "bg-monokai-dark/80 border-white/10 p-6 hover:bg-monokai-dark/90 hover:border-white/20",
    light: "bg-white/90 border-gray-200/50 p-6 hover:bg-white/95 hover:border-gray-200/60 text-black dark:bg-monokai-light/15 dark:border-monokai-muted/30 dark:hover:bg-monokai-light/20 dark:hover:border-monokai-muted/40",
    sidebar: "bg-white/5 border-gray-200/20 p-4 hover:bg-white/10 hover:border-gray-200/30 dark:bg-black/5 dark:border-gray-700/20 dark:hover:bg-black/10 dark:hover:border-gray-700/30",
    modal: "bg-white/95 border-gray-200/60 p-8 shadow-2xl hover:bg-white/98 hover:border-gray-200/70 text-black dark:bg-monokai-dark/95 dark:border-monokai-muted/30 dark:hover:bg-monokai-dark/98 dark:hover:border-monokai-muted/40 dark:text-white"
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
