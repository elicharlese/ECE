"use client"

import { cn } from "@/lib/utils"

interface NotificationBadgeProps {
  count: number
  className?: string
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count <= 0) return null

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white",
        count > 99 ? "min-w-[1.75rem]" : "min-w-[1.25rem]",
        className,
      )}
      aria-label={`${count} unread messages`}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}
