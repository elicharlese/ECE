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
        default: "bg-black text-white shadow-lg hover:shadow-xl hover:bg-black/90 active:shadow-md dark:bg-white dark:text-black dark:hover:bg-white/90",
        destructive: "bg-monokai-error text-white shadow-lg hover:shadow-xl hover:bg-monokai-error/90",
        outline: "border border-gray-300 bg-transparent text-black hover:bg-monokai-accent/10 hover:text-monokai-accent hover:border-monokai-accent shadow-sm hover:shadow-md dark:border-gray-600 dark:text-white dark:hover:text-monokai-accent",
        secondary: "bg-monokai-success text-black shadow-lg hover:shadow-xl hover:bg-monokai-success/90 active:shadow-md",
        ghost: "bg-transparent text-black hover:bg-monokai-accent/10 hover:text-monokai-accent shadow-none hover:shadow-sm dark:text-white dark:hover:text-monokai-accent",
        link: "text-monokai-info underline-offset-4 hover:underline shadow-none",
        accent: "bg-monokai-accent text-white shadow-lg hover:shadow-xl hover:bg-monokai-accent/90",
        glass: "bg-white/10 backdrop-blur-md text-black border border-black/20 shadow-lg hover:shadow-xl hover:bg-white/20 hover:border-black/30 dark:text-white dark:border-white/20 dark:hover:border-white/30",
        gradient: "bg-gradient-sunset text-white shadow-lg hover:shadow-xl",
        floating: "bg-monokai-info text-black shadow-lg hover:shadow-xl hover:bg-monokai-info/90 hover:-translate-y-1"
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
