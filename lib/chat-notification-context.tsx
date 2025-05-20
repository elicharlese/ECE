"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useChat } from "@/lib/chat-context"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase-client"
import type { Message } from "@/types/chat"

interface ChatNotificationContextProps {
  browserNotificationsEnabled: boolean
  soundNotificationsEnabled: boolean
  notificationVolume: number
  setBrowserNotificationsEnabled: (enabled: boolean) => void
  setSoundNotificationsEnabled: (enabled: boolean) => void
  setNotificationVolume: (volume: number) => void
  requestBrowserNotificationPermission: () => Promise<void>
  notifyNewMessage: (message: Message) => void
  markAllAsRead: () => Promise<void>
}

const ChatNotificationContext = createContext<ChatNotificationContextProps | undefined>(undefined)

export function ChatNotificationProvider({ children }: { children: React.ReactNode }) {
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false)
  const [soundNotificationsEnabled, setSoundNotificationsEnabled] = useState(true)
  const [notificationVolume, setNotificationVolume] = useState(50)
  const [notificationAudio, setNotificationAudio] = useState<HTMLAudioElement | null>(null)
  const { user } = useAuth()

  // Initialize chatContext outside the try-catch to avoid hook call in a conditional block
  const chatContext = useChat()

  const { currentChannel, channels, markChannelAsRead } = chatContext || {
    currentChannel: null,
    channels: [],
    markChannelAsRead: async () => {},
  }

  // Initialize audio on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/notification.mp3")
      setNotificationAudio(audio)

      // Load notification preferences from localStorage
      const storedBrowserNotifications = localStorage.getItem("browserNotificationsEnabled")
      const storedSoundNotifications = localStorage.getItem("soundNotificationsEnabled")
      const storedVolume = localStorage.getItem("notificationVolume")

      if (storedBrowserNotifications !== null) {
        setBrowserNotificationsEnabled(storedBrowserNotifications === "true")
      }

      if (storedSoundNotifications !== null) {
        setSoundNotificationsEnabled(storedSoundNotifications === "true")
      }

      if (storedVolume !== null) {
        setNotificationVolume(Number.parseInt(storedVolume, 10))
      }
    }
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("browserNotificationsEnabled", browserNotificationsEnabled.toString())
      localStorage.setItem("soundNotificationsEnabled", soundNotificationsEnabled.toString())
      localStorage.setItem("notificationVolume", notificationVolume.toString())
    }
  }, [browserNotificationsEnabled, soundNotificationsEnabled, notificationVolume])

  const notifyNewMessage = useCallback(
    (message: Message & { channel_name?: string }) => {
      // Play sound notification only
      if (soundNotificationsEnabled && notificationAudio) {
        notificationAudio.volume = notificationVolume / 100
        notificationAudio.play().catch((error) => {
          console.error("Error playing notification sound:", error)
        })
      }

      // No longer show popup notifications
    },
    [soundNotificationsEnabled, notificationAudio, notificationVolume],
  )

  // Subscribe to new messages for notifications
  useEffect(() => {
    if (!user) return

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          // Don't notify for own messages
          if (payload.new.user_id === user.id) return

          // Don't notify for messages in the current channel (user is already looking at them)
          if (payload.new.channel_id === currentChannel?.id) return

          // Fetch user details for the message
          const { data: userData } = await supabase
            .from("users")
            .select("name, avatar_url")
            .eq("id", payload.new.user_id)
            .single()

          // Fetch channel details
          const { data: channelData } = await supabase
            .from("channels")
            .select("name")
            .eq("id", payload.new.channel_id)
            .single()

          const message = {
            ...payload.new,
            user: {
              id: payload.new.user_id,
              name: userData?.name || "Unknown User",
              avatar_url: userData?.avatar_url || "",
            },
            channel_name: channelData?.name || "Unknown Channel",
          } as Message & { channel_name: string }

          notifyNewMessage(message)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, currentChannel, chatContext, notifyNewMessage])

  const requestBrowserNotificationPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      setBrowserNotificationsEnabled(permission === "granted")
    } else if (Notification.permission === "granted") {
      setBrowserNotificationsEnabled(true)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    if (!user) return

    // Mark all channels as read
    for (const channel of channels) {
      await markChannelAsRead(channel.id)
    }
  }, [user, channels, markChannelAsRead])

  return (
    <ChatNotificationContext.Provider
      value={{
        browserNotificationsEnabled,
        soundNotificationsEnabled,
        notificationVolume,
        setBrowserNotificationsEnabled,
        setSoundNotificationsEnabled,
        setNotificationVolume,
        requestBrowserNotificationPermission,
        notifyNewMessage,
        markAllAsRead,
      }}
    >
      {children}
    </ChatNotificationContext.Provider>
  )
}

export function useChatNotifications() {
  const context = useContext(ChatNotificationContext)
  if (context === undefined) {
    throw new Error("useChatNotifications must be used within a ChatNotificationProvider")
  }
  return context
}
