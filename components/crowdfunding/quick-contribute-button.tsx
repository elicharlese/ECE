"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import { FloatingQuickContribution } from "./floating-quick-contribution"
import { cn } from "@/lib/utils"

type QuickContributeButtonProps = {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showLabel?: boolean
}

export function QuickContributeButton({
  className,
  variant = "default",
  size = "default",
  showLabel = true,
}: QuickContributeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} className={cn("relative", className)} onClick={() => setIsOpen(true)}>
        <DollarSign className={cn("h-4 w-4", showLabel ? "mr-2" : "")} />
        {showLabel && <span>Quick Contribute</span>}

        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <FloatingQuickContribution className="relative z-10" onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  )
}
