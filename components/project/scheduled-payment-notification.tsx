"use client"

// This component is now deprecated as we've moved scheduled payment reminders to the notification system
// Keeping this file for reference but it's no longer used in the application

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CalendarClock, X } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface ScheduledPaymentNotificationProps {
  projectName: string
  milestoneName: string
  amount: number
  currency: string
  scheduledDate: string
  onDismiss: () => void
}

export function ScheduledPaymentNotification({
  projectName,
  milestoneName,
  amount,
  currency,
  scheduledDate,
  onDismiss,
}: ScheduledPaymentNotificationProps) {
  return (
    <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <CalendarClock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-300 flex items-center justify-between">
        <span>Scheduled Payment Reminder</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full p-0 text-blue-600 dark:text-blue-400"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="text-blue-700 dark:text-blue-300">
        <div className="mt-1 mb-2">
          Payment for milestone <span className="font-medium">{milestoneName}</span> in project{" "}
          <span className="font-medium">{projectName}</span> is scheduled for{" "}
          <span className="font-medium">{format(new Date(scheduledDate), "MMMM d, yyyy")}</span>.
          <div className="mt-1">
            Amount:{" "}
            <span className="font-medium">
              {amount} {currency}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button size="sm" variant="outline" asChild>
            <Link href="/app/scheduled-payments">View Details</Link>
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            Process Now
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
