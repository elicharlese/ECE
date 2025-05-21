"use client"

import { Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(3)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // This would normally come from an API or context
    const storedCount = localStorage.getItem("unreadNotifications")
    if (storedCount) {
      setUnreadCount(Number.parseInt(storedCount, 10))
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
    </div>
  )
}
