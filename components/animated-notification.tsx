"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnimatedNotificationProps {
  title: string
  message: string
  type: "success" | "info" | "warning" | "error"
  duration?: number
  onClose: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export function AnimatedNotification({
  title,
  message,
  type,
  duration = 5000,
  onClose,
  action,
}: AnimatedNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for fade-out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  let bgColor
  let textColor
  let borderColor

  switch (type) {
    case "success":
      bgColor = "bg-green-50 dark:bg-green-900/20"
      textColor = "text-green-800 dark:text-green-300"
      borderColor = "border-green-200 dark:border-green-800"
      break
    case "info":
      bgColor = "bg-blue-50 dark:bg-blue-900/20"
      textColor = "text-blue-800 dark:text-blue-300"
      borderColor = "border-blue-200 dark:border-blue-800"
      break
    case "warning":
      bgColor = "bg-amber-50 dark:bg-amber-900/20"
      textColor = "text-amber-800 dark:text-amber-300"
      borderColor = "border-amber-200 dark:border-amber-800"
      break
    case "error":
      bgColor = "bg-red-50 dark:bg-red-900/20"
      textColor = "text-red-800 dark:text-red-300"
      borderColor = "border-red-200 dark:border-red-800"
      break
    default:
      bgColor = "bg-muted"
      textColor = "text-muted-foreground"
      borderColor = "border-border"
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-md w-full p-4 rounded-md border shadow-lg",
        bgColor,
        textColor,
        borderColor,
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      {action && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}
