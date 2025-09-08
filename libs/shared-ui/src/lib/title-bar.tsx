'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { Minus, Square, X } from 'lucide-react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from './utils'

const titleBarVariants = cva(
  "flex items-center justify-between px-4 py-2 border-b",
  {
    variants: {
      variant: {
        default: "bg-slate-900/95 border-blue-500/20",
        dark: "bg-slate-900/95 border-slate-700/50",
        glass: "bg-white/5 backdrop-blur-md border-white/10"
      },
      size: {
        sm: "h-8 px-3 py-1",
        md: "h-10 px-4 py-2", 
        lg: "h-12 px-6 py-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const windowControlVariants = cva(
  "flex items-center justify-center rounded cursor-pointer transition-all duration-200",
  {
    variants: {
      type: {
        minimize: "w-7 h-5 hover:bg-white/10 text-slate-400 hover:text-white",
        maximize: "w-7 h-5 hover:bg-white/10 text-slate-400 hover:text-white", 
        close: "w-7 h-5 hover:bg-red-500 text-slate-400 hover:text-white"
      }
    },
    defaultVariants: {
      type: "minimize"
    }
  }
)

export interface TitleBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof titleBarVariants> {
  title: string
  showControls?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  dragRegion?: boolean
}

const TitleBar = forwardRef<HTMLDivElement, TitleBarProps>(
  ({ 
    className, 
    variant, 
    size, 
    title, 
    showControls = true,
    onMinimize,
    onMaximize, 
    onClose,
    dragRegion = true,
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(titleBarVariants({ variant, size, className }))}
        ref={ref}
        style={{ WebkitAppRegion: dragRegion ? 'drag' : 'no-drag' } as React.CSSProperties}
        {...props}
      >
        <div className="flex items-center justify-center flex-1">
          <h1 className="text-sm font-semibold text-slate-100 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        
        {showControls && process.platform !== 'darwin' && (
          <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            {onMinimize && (
              <motion.button
                className={cn(windowControlVariants({ type: 'minimize' }))}
                onClick={onMinimize}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus size={14} />
              </motion.button>
            )}
            
            {onMaximize && (
              <motion.button
                className={cn(windowControlVariants({ type: 'maximize' }))}
                onClick={onMaximize}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.9 }}
              >
                <Square size={14} />
              </motion.button>
            )}
            
            {onClose && (
              <motion.button
                className={cn(windowControlVariants({ type: 'close' }))}
                onClick={onClose}
                whileHover={{ backgroundColor: '#ef4444' }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            )}
          </div>
        )}
      </div>
    )
  }
)

TitleBar.displayName = "TitleBar"

export { TitleBar, titleBarVariants }
