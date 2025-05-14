"use client"

import { useState } from "react"
import { Clock, AlertTriangle, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SLANotificationProps {
  notification: {
    id: string
    type: "reminder" | "warning" | "breach"
    paymentId: string
    paymentTitle: string
    level: number
    approver: {
      name: string
      avatar?: string
    }
    timeRemaining?: string
    createdAt: string
  }
  onDismiss: (id: string) => void
  onViewPayment: (id: string) => void
}

export function SLANotification({ notification, onDismiss, onViewPayment }: SLANotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss(notification.id)
    }, 300)
  }

  if (!isVisible) return null

  let icon
  let title
  let bgColor
  let borderColor

  switch (notification.type) {
    case "reminder":
      icon = <Clock className="h-5 w-5 text-blue-500" />
      title = "SLA Reminder"
      bgColor = "bg-blue-50 dark:bg-blue-950"
      borderColor = "border-blue-200 dark:border-blue-800"
      break
    case "warning":
      icon = <AlertTriangle className="h-5 w-5 text-amber-500" />
      title = "SLA At Risk"
      bgColor = "bg-amber-50 dark:bg-amber-950"
      borderColor = "border-amber-200 dark:border-amber-800"
      break
    case "breach":
      icon = <AlertCircle className="h-5 w-5 text-red-500" />
      title = "SLA Breached"
      bgColor = "bg-red-50 dark:bg-red-950"
      borderColor = "border-red-200 dark:border-red-800"
      break
  }

  return (
    <Card className={`${bgColor} border ${borderColor} transition-all duration-300 ease-in-out`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1">{icon}</div>
            <div>
              <h4 className="text-sm font-medium">{title}</h4>
              <p className="text-sm mt-1">
                {notification.type === "reminder" && "Approval deadline approaching for "}
                {notification.type === "warning" && "Approval is at risk of missing deadline for "}
                {notification.type === "breach" && "Approval deadline has been missed for "}
                <span className="font-medium">{notification.paymentTitle}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={notification.approver.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{notification.approver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs">
                  Level {notification.level} approval: {notification.approver.name}
                </span>
              </div>
              {notification.timeRemaining && (
                <p className="text-xs mt-2">
                  {notification.type === "breach" ? "Overdue by " : "Time remaining: "}
                  <span className="font-medium">{notification.timeRemaining}</span>
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => onViewPayment(notification.paymentId)}>
                  View Request
                </Button>
                {notification.type !== "breach" && <Button size="sm">Send Reminder</Button>}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
