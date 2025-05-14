"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CreditCard, X, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface MilestonePaymentNotificationProps {
  projectName: string
  milestoneName: string
  amount: number
  currency: string
  dueDate?: string
  onDismiss: () => void
  onPay?: () => void
}

export function MilestonePaymentNotification({
  projectName,
  milestoneName,
  amount,
  currency,
  dueDate,
  onDismiss,
  onPay,
}: MilestonePaymentNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    if (dueDate) {
      const due = new Date(dueDate)
      const now = new Date()
      const diffTime = due.getTime() - now.getTime()

      if (diffTime <= 0) {
        setTimeLeft("Overdue")
        return
      }

      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 0) {
        setTimeLeft(`${diffDays} day${diffDays > 1 ? "s" : ""} left`)
      } else {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
        setTimeLeft(`${diffHours} hour${diffHours > 1 ? "s" : ""} left`)
      }
    }
  }, [dueDate])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss()
    }, 300)
  }

  if (!isVisible) return null

  return (
    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 transition-all duration-300">
      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-300">Payment Due</AlertTitle>
      <AlertDescription className="text-blue-700 dark:text-blue-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p>
              A payment of{" "}
              <span className="font-medium">
                {amount} {currency}
              </span>{" "}
              is due for milestone <span className="font-medium">"{milestoneName}"</span> in project{" "}
              <span className="font-medium">{projectName}</span>.
            </p>
            {timeLeft && (
              <p className="text-sm mt-1">
                {timeLeft === "Overdue" ? (
                  <span className="text-red-600 dark:text-red-400 font-medium">{timeLeft}</span>
                ) : (
                  <span>{timeLeft}</span>
                )}
                {dueDate && ` (Due: ${format(new Date(dueDate), "MMM d, yyyy")})`}
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            {onPay && (
              <Button size="sm" className="h-8 gap-1" onClick={onPay}>
                <CreditCard className="h-3.5 w-3.5" />
                Pay Now
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-8" onClick={handleDismiss}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
