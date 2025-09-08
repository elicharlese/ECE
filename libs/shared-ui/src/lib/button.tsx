'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from './utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#F92672] text-white shadow-lg hover:shadow-xl hover:bg-[#F92672]/90 active:shadow-md",
        destructive: "bg-destructive text-destructive-foreground shadow-lg hover:shadow-xl",
        outline: "border border-[#75715E] bg-transparent text-[#F8EFD6] hover:bg-[#F92672]/10 hover:text-[#F92672] hover:border-[#F92672] shadow-sm hover:shadow-md",
        secondary: "bg-[#A6E22E] text-[#272822] shadow-lg hover:shadow-xl hover:bg-[#A6E22E]/90 active:shadow-md",
        ghost: "bg-transparent text-[#F8EFD6] hover:bg-[#F92672]/10 hover:text-[#F92672] shadow-none hover:shadow-sm",
        link: "text-[#66D9EF] underline-offset-4 hover:underline shadow-none",
        ocean: "bg-gradient-to-r from-[#008B8B] to-[#20B2AA] text-white shadow-lg hover:shadow-xl hover:from-[#008B8B]/90 hover:to-[#20B2AA]/90",
        glass: "bg-white/10 backdrop-blur-md text-[#F8EFD6] border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/20 hover:border-white/30",
        gradient: "bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white shadow-lg hover:shadow-xl hover:from-[#F92672]/90 hover:to-[#66D9EF]/90",
        floating: "bg-[#66D9EF] text-[#272822] shadow-lg hover:shadow-xl hover:bg-[#66D9EF]/90 hover:-translate-y-1"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        md: "h-11 px-6 py-3",
        lg: "h-12 rounded-lg px-8 py-4 text-lg",
        xl: "h-14 rounded-lg px-10 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }
    
    // Filter out HTML events that conflict with motion
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
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...motionSafeProps}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
