"use client"

import { useDeploymentNotifications } from "@/context/deployment-notification-context"
import { Button } from "@/components/ui/button"
import { BellRing } from "lucide-react"

export function DeploymentNotificationBadge() {
  const { unreadCount } = useDeploymentNotifications()

  return (
    <Button variant="ghost" size="icon" className="relative">
      <BellRing className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  )
}
