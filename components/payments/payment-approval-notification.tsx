"use client"

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { format } from "date-fns"

interface PaymentApprovalNotificationProps {
  payment: any
  onView: () => void
}

export function PaymentApprovalNotification({ payment, onView }: PaymentApprovalNotificationProps) {
  // Find the current approval level that is pending
  const currentApprovalLevel = payment.approvalFlow.find((approval: any) => approval.status === "pending")

  if (!currentApprovalLevel) return null

  return (
    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 border rounded-md">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-full">
          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
        </div>
        <div>
          <p className="text-sm font-medium">Payment request "{payment.title}" requires your approval</p>
          <p className="text-xs text-muted-foreground">
            {payment.amount} {payment.currency} • Due by {format(new Date(payment.dueDate), "MMM d, yyyy")}
          </p>
        </div>
      </div>
      <Button size="sm" onClick={onView}>
        Review
      </Button>
    </div>
  )
}
