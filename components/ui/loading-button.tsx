"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, children, isLoading, loadingText, disabled, ...props }, ref) => {
    return (
      <Button className={cn(className)} disabled={isLoading || disabled} ref={ref} {...props}>
        {isLoading ? (
          <div className="flex items-center">
            <div className="loading-spinner mr-2" />
            {loadingText || children}
          </div>
        ) : (
          children
        )}
      </Button>
    )
  },
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
