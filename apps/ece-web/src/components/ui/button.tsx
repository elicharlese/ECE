'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children,
  onClick,
  disabled = false,
  type = 'button',
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-soft-lg",
    secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-soft hover:shadow-soft-lg",
    accent: "bg-gradient-ocean text-accent-foreground shadow-soft-color hover:shadow-soft-color-lg hover:scale-105",
    ghost: "bg-transparent hover:bg-muted text-foreground border border-border hover:border-border/80 shadow-soft-subtle",
    outline: "bg-transparent border border-input text-foreground hover:bg-accent hover:text-accent-foreground shadow-soft-subtle hover:shadow-soft"
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  )
})

Button.displayName = "Button"
