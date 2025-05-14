import type React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-slow-pulse rounded-md bg-muted/60 animate-shimmer skeleton-enhanced", className)}
      {...props}
    />
  )
}

export { Skeleton }
