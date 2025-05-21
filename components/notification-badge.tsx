"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import Link from "next/link"

interface NotificationBadgeProps {
  showLabel?: boolean
}

export function NotificationBadge({ showLabel = false }: NotificationBadgeProps) {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate notifications for demo purposes
    setCount(Math.floor(Math.random() * 5))
  }, [])

  if (!mounted) return null

  return (
    <Link href="/app/notifications" className="relative">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        {showLabel && <span className="hidden sm:inline">Notifications</span>}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>
    </Link>
  )
}
