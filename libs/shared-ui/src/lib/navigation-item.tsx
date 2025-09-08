'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from './utils'

const navigationItemVariants = cva(
  "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 font-medium",
  {
    variants: {
      variant: {
        default: "text-gray-300 hover:text-white hover:bg-white/10",
        active: "text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg",
        desktop: "text-slate-300 hover:text-white hover:bg-blue-500/10",
        desktopActive: "text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md"
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base", 
        lg: "px-5 py-4 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

export interface NavigationItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navigationItemVariants> {
  icon?: React.ReactNode
  label: string
  active?: boolean
  onHoverX?: number
}

const NavigationItem = forwardRef<HTMLDivElement, NavigationItemProps>(
  ({ className, variant, size, icon, label, active = false, onHoverX = 4, ...props }, ref) => {
    const computedVariant = active ? 
      (variant === 'desktop' ? 'desktopActive' : 'active') : 
      variant

    return (
      <motion.div
        className={cn(navigationItemVariants({ variant: computedVariant, size, className }))}
        ref={ref}
        whileHover={{ x: onHoverX }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{label}</span>
      </motion.div>
    )
  }
)

NavigationItem.displayName = "NavigationItem"

export { NavigationItem, navigationItemVariants }
