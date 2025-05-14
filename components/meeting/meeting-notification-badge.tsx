"use client"

import { useMeetingNotifications } from "@/lib/meeting-notification-context"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

interface MeetingNotificationBadgeProps {
  className?: string
}

export function MeetingNotificationBadge({ className }: MeetingNotificationBadgeProps) {
  const { unreadCount } = useMeetingNotifications()

  if (unreadCount === 0) return null

  return (
    <Badge variant="destructive" className={className}>
      <Bell className="h-3 w-3 mr-1" />
      {unreadCount}
    </Badge>
  )
}
