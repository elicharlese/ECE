"use client"
import type { Message } from "@/types/chat"

interface NotificationToastProps {
  message: Message & { channel_name?: string }
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export function NotificationToast({ message, onClose }: NotificationToastProps) {
  // This component no longer shows popup notifications
  return null
}
