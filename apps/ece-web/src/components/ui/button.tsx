'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { componentShadows, shadowAnimations } from '@/lib/shadows'
import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: cn(
          "bg-[#F92672] text-white",
          "shadow-soft-md hover:shadow-primary-glow",
          "hover:bg-[#F92672]/90 active:shadow-soft-sm",
          shadowAnimations.hover
        ),
        destructive: cn(
          "bg-destructive text-destructive-foreground",
          "shadow-soft-md hover:shadow-rarity-epic",
          shadowAnimations.hover
        ),
        outline: cn(
          "border border-[#75715E] bg-transparent text-[#F8EFD6]",
          "hover:bg-[#F92672]/10 hover:text-[#F92672] hover:border-[#F92672]",
          "shadow-soft-sm hover:shadow-soft-md",
          shadowAnimations.smooth
        ),
        secondary: cn(
          "bg-[#A6E22E] text-[#272822]",
          "shadow-soft-md hover:shadow-secondary-glow",
          "hover:bg-[#A6E22E]/90 active:shadow-soft-sm",
          shadowAnimations.hover
        ),
        ghost: cn(
          "bg-transparent text-[#F8EFD6]",
          "hover:bg-[#F92672]/10 hover:text-[#F92672]",
          "shadow-none hover:shadow-soft-sm",
          shadowAnimations.smooth
        ),
        link: "text-[#66D9EF] underline-offset-4 hover:underline shadow-none",
        
        // Enhanced ECE variants (Batch 2)
        ocean: cn(
          "bg-gradient-to-r from-[#008B8B] to-[#20B2AA] text-white",
          "shadow-gradient-wave hover:shadow-ocean-glow",
          "hover:from-[#008B8B]/90 hover:to-[#20B2AA]/90",
          shadowAnimations.hover
        ),
        glass: cn(
          "bg-white/10 backdrop-blur-md text-[#F8EFD6] border border-white/20",
          "shadow-glass-light hover:shadow-glass-dark",
          "hover:bg-white/20 hover:border-white/30",
          shadowAnimations.smooth
        ),
        gradient: cn(
          "bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white",
          "shadow-gradient-sunset hover:shadow-primary-glow",
          "hover:from-[#F92672]/90 hover:to-[#66D9EF]/90",
          shadowAnimations.hover
        ),
        floating: cn(
          "bg-[#66D9EF] text-[#272822]",
          "shadow-floating hover:shadow-elevated",
          "hover:bg-[#66D9EF]/90 hover:-translate-y-1",
          shadowAnimations.bounce
        )
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
      rarity: {
        none: "",
        common: "shadow-rarity-common hover:shadow-rarity-common",
        rare: "shadow-rarity-rare hover:shadow-rarity-rare", 
        epic: "shadow-rarity-epic hover:shadow-rarity-epic",
        legendary: cn(
          "shadow-rarity-legendary hover:shadow-rarity-legendary",
          "animate-pulse"
        )
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rarity: "none"
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rarity, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rarity, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
