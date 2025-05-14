"use client"

import type { MeetingNotification } from "@/lib/meeting-notification-context"

interface MeetingNotificationToastProps {
  notification: MeetingNotification
  onClose: () => void
}

export function MeetingNotificationToast({ notification, onClose }: MeetingNotificationToastProps) {
  // This component no longer shows popup notifications
  return null
}

export function MeetingNotificationToastManager() {
  // This component no longer shows popup notifications
  return null
}
