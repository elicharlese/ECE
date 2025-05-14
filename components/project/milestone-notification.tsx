"use client"

import { CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface MilestoneNotificationProps {
  type: "approved" | "changes-requested"
  milestoneTitle: string
  timestamp: string
  onDismiss: () => void
}

export function MilestoneNotification({ type, milestoneTitle, timestamp, onDismiss }: MilestoneNotificationProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300) // Allow time for fade-out animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <Alert
      className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"} ${
        type === "approved"
          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
          : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
      }`}
    >
      {type === "approved" ? (
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      ) : (
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      )}
      <AlertTitle
        className={type === "approved" ? "text-green-800 dark:text-green-300" : "text-amber-800 dark:text-amber-300"}
      >
        {type === "approved" ? "Milestone Approved" : "Changes Requested"}
      </AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground flex items-center justify-between">
        <span>
          {type === "approved"
            ? `The milestone "${milestoneTitle}" has been approved.`
            : `Changes have been requested for milestone "${milestoneTitle}".`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setVisible(false)
            setTimeout(onDismiss, 300)
          }}
        >
          Dismiss
        </Button>
      </AlertDescription>
    </Alert>
  )
}
