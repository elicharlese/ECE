"use client"

import { useState, useEffect } from "react"
import { useGitHubWebhook } from "@/lib/github-webhook-context"
import { GitHubWebhookNotification } from "./github-webhook-notification"

export function GitHubWebhookNotificationCenter() {
  const { events, unreadCount } = useGitHubWebhook()
  const [activeNotifications, setActiveNotifications] = useState<string[]>([])
  const [lastEventCount, setLastEventCount] = useState(0)

  // Check for new events
  useEffect(() => {
    if (events.length > lastEventCount) {
      // Get new unread events
      const newEvents = events.filter((event) => !event.read && !activeNotifications.includes(event.id)).slice(0, 3) // Show at most 3 new notifications at once

      if (newEvents.length > 0) {
        setActiveNotifications((prev) => [...prev, ...newEvents.map((event) => event.id)])
      }
    }

    setLastEventCount(events.length)
  }, [events, lastEventCount, activeNotifications])

  const handleDismiss = (id: string) => {
    setActiveNotifications((prev) => prev.filter((notificationId) => notificationId !== id))
  }

  if (activeNotifications.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      {activeNotifications.map((id) => {
        const event = events.find((e) => e.id === id)
        if (!event) return null

        return <GitHubWebhookNotification key={id} event={event} onDismiss={() => handleDismiss(id)} />
      })}
    </div>
  )
}
