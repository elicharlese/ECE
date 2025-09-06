'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        
        // ECE-specific variants
        monokai: "border-transparent bg-[#F92672] text-white hover:bg-[#F92672]/80",
        success: "border-transparent bg-[#A6E22E] text-[#272822] hover:bg-[#A6E22E]/80",
        info: "border-transparent bg-[#66D9EF] text-[#272822] hover:bg-[#66D9EF]/80",
        warning: "border-transparent bg-[#E6DB74] text-[#272822] hover:bg-[#E6DB74]/80",
        
        // Rarity variants
        common: "border-transparent bg-slate-500/20 text-slate-400 border-slate-400/30",
        rare: "border-transparent bg-blue-500/20 text-blue-400 border-blue-400/30",
        epic: "border-transparent bg-purple-500/20 text-purple-400 border-purple-400/30",
        legendary: "border-transparent bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
        mythic: "border-transparent bg-red-500/20 text-red-400 border-red-400/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }