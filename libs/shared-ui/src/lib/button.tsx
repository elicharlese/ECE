'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from './utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  disabled?: boolean
  asChild?: boolean
  style?: React.CSSProperties
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children,
  disabled = false,
  type = 'button',
  asChild = false,
  style,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  
  const variants = {
    primary: "bg-[#819AFF] hover:bg-[#819AFF]/90 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-[#E6DB74] hover:bg-[#E6DB74]/90 text-[#272822] shadow-lg hover:shadow-xl",
    accent: "bg-gradient-to-r from-[#F92672] to-[#FD5C63] text-white shadow-lg hover:shadow-xl hover:scale-105",
    ghost: "bg-transparent hover:bg-white/10 text-[#F8EFD6] border border-white/20 hover:border-white/30",
    outline: "bg-transparent border border-[#66D9EF]/30 text-[#66D9EF] hover:bg-[#66D9EF]/10 hover:text-[#66D9EF]",
    destructive: "bg-[#F92672] hover:bg-[#F92672]/90 text-white shadow-lg hover:shadow-xl"
  }

  const sizes = {
    sm: "px-4 py-2 text-sm h-9",
    md: "px-6 py-3 text-base h-11",
    lg: "px-8 py-4 text-lg h-14"
  }

  if (asChild) {
    return (
      <motion.span
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        style={style}
      >
        {children}
      </motion.span>
    )
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled}
      type={type}
      style={style}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
})

Button.displayName = "Button"

Button.displayName = 'Button'
