'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from './utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost'
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
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-lg hover:shadow-xl",
    accent: "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
    ghost: "bg-transparent hover:bg-slate-700/20 text-current border border-slate-600 hover:border-slate-500"
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

Button.displayName = 'Button'
