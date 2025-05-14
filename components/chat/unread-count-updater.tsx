"use client"

import { useEffect } from "react"
import { useChat } from "@/lib/chat-context"

export function UnreadCountUpdater() {
  const { getTotalUnreadCount } = useChat()

  useEffect(() => {
    // Dispatch the initial count
    const count = getTotalUnreadCount()
    window.dispatchEvent(
      new CustomEvent("chat-unread-update", {
        detail: { count },
      }),
    )

    // Set up an interval to update the count periodically
    const interval = setInterval(() => {
      const updatedCount = getTotalUnreadCount()
      window.dispatchEvent(
        new CustomEvent("chat-unread-update", {
          detail: { count: updatedCount },
        }),
      )
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [getTotalUnreadCount])

  // This component doesn't render anything
  return null
}
