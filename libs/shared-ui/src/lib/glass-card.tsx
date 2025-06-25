'use client'

import { motion } from 'framer-motion'
import { cn } from './utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'light'
  animation?: 'wave' | 'breathe' | 'float' | 'none'
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  animation = 'none'
}: GlassCardProps) {
  const baseClasses = "rounded-xl backdrop-blur-md border"
  
  const variantClasses = {
    default: "bg-white/10 border-white/20",
    dark: "bg-slate-900/80 border-white/10",
    light: "bg-slate-100/15 border-white/30"
  }

  const animationClasses = {
    wave: "animate-wave",
    breathe: "animate-pulse-slow", 
    float: "animate-float",
    none: ""
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    >
      {children}
    </motion.div>
  )
}
