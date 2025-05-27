"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { useDemo } from "./demo-context"
import { supabase } from "./supabase-client"
import { useToast } from "@/hooks/use-toast"

export type MeetingNotificationType =
  | "upcoming"
  | "starting_soon"
  | "change"
  | "cancellation"
  | "new_invitation"
  | "reminder"

export type MeetingNotification = {
  id: string
  userId: string
  meetingId: string
  meetingTitle: string
  type: MeetingNotificationType
  message: string
  time: string
  read: boolean
  dismissed: boolean
  calendarSource?: string
  meetingTime?: string
  meetingDate?: string
  location?: string
  attendees?: string[]
  changes?: {
    field: string
    oldValue: string
    newValue: string
  }[]
}

export type NotificationPreferences = {
  upcomingMeetings: boolean
  upcomingMeetingsTime: number // minutes before meeting
  meetingChanges: boolean
  meetingCancellations: boolean
  newInvitations: boolean
  dailyAgenda: boolean
  dailyAgendaTime: string // time of day for daily agenda
  soundEnabled: boolean
  browserNotificationsEnabled: boolean
  emailNotificationsEnabled: boolean
}

type MeetingNotificationContextType = {
  notifications: MeetingNotification[]
  unreadCount: number
  preferences: NotificationPreferences
  isLoading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  dismissNotification: (id: string) => Promise<void>
  dismissAllNotifications: () => Promise<void>
  updatePreferences: (newPreferences: Partial<NotificationPreferences>) => Promise<void>
  sendTestNotification: () => void
}

const defaultPreferences: NotificationPreferences = {
  upcomingMeetings: true,
  upcomingMeetingsTime: 15, // 15 minutes before meeting
  meetingChanges: true,
  meetingCancellations: true,
  newInvitations: true,
  dailyAgenda: true,
  dailyAgendaTime: "08:00", // 8:00 AM
  soundEnabled: true,
  browserNotificationsEnabled: false,
  emailNotificationsEnabled: false,
}

const MeetingNotificationContext = createContext<MeetingNotificationContextType | undefined>(undefined)

export function MeetingNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<MeetingNotification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { isDemoMode } = useDemo()
  const { toast } = useToast()
  const [notificationSound, setNotificationSound] = useState<HTMLAudioElement | null>(null)

  // Initialize notification sound on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/notification.mp3")
      setNotificationSound(audio)
    }
  }, [])

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  // Load notifications and preferences
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      let prefsError: any = null
      let notifError: any = null

      try {
        if (isDemoMode) {
          // Load demo data
          setNotifications(getDemoNotifications())
          setPreferences(defaultPreferences)
        } else if (user) {
          // Load real data from Supabase
          const { data: prefsData, error: prefsErr } = await supabase
            .from("meeting_notification_preferences")
            .select("*")
            .eq("user_id", user.id)
            .single()

          prefsError = prefsErr

          if (prefsError) {
            // Log the error but don't throw it
            console.error("Error loading notification preferences:", prefsError)

            // If the table doesn't exist or there's any other error, use default preferences
            console.log("Using default notification preferences")
            setPreferences(defaultPreferences)
          } else if (prefsData) {
            setPreferences({
              upcomingMeetings: prefsData.upcoming_meetings,
              upcomingMeetingsTime: prefsData.upcoming_meetings_time,
              meetingChanges: prefsData.meeting_changes,
              meetingCancellations: prefsData.meeting_cancellations,
              newInvitations: prefsData.new_invitations,
              dailyAgenda: prefsData.daily_agenda,
              dailyAgendaTime: prefsData.daily_agenda_time,
              soundEnabled: prefsData.sound_enabled,
              browserNotificationsEnabled: prefsData.browser_notifications_enabled,
              emailNotificationsEnabled: prefsData.email_notifications_enabled,
            })
          } else {
            // Create default preferences if none exist
            await supabase.from("meeting_notification_preferences").insert([
              {
                user_id: user.id,
                upcoming_meetings: defaultPreferences.upcomingMeetings,
                upcoming_meetings_time: defaultPreferences.upcomingMeetingsTime,
                meeting_changes: defaultPreferences.meetingChanges,
                meeting_cancellations: defaultPreferences.meetingCancellations,
                new_invitations: defaultPreferences.newInvitations,
                daily_agenda: defaultPreferences.dailyAgenda,
                daily_agenda_time: defaultPreferences.dailyAgendaTime,
                sound_enabled: defaultPreferences.soundEnabled,
                browser_notifications_enabled: defaultPreferences.browserNotificationsEnabled,
                email_notifications_enabled: defaultPreferences.emailNotificationsEnabled,
              },
            ])

            setPreferences(defaultPreferences)
          }

          // Load notifications
          const { data: notifData, error: notifErr } = await supabase
            .from("meeting_notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("time", { ascending: false })

          notifError = notifErr

          if (notifError) {
            // Log the error but don't throw it
            console.error("Error loading notifications:", notifError)

            // If the table doesn't exist or there's any other error, use empty notifications array
            console.log("Using empty notifications array")
            setNotifications([])
          } else if (notifData) {
            setNotifications(
              notifData.map((n) => ({
                id: n.id,
                userId: n.user_id,
                meetingId: n.meeting_id,
                meetingTitle: n.meeting_title,
                type: n.type,
                message: n.message,
                time: n.time,
                read: n.read,
                dismissed: n.dismissed,
                calendarSource: n.calendar_source,
                meetingTime: n.meeting_time,
                meetingDate: n.meeting_date,
                location: n.location,
                attendees: n.attendees,
                changes: n.changes,
              })),
            )
          }
        }
      } catch (error) {
        console.error("Error in loadData:", error)
      } finally {
        setIsLoading(false)
      }

      // If we encountered database errors, force demo mode for this component
      if (prefsError || notifError) {
        console.log("Database tables missing, using demo mode for notifications")
        setNotifications(getDemoNotifications())
        setPreferences(defaultPreferences)
      }
    }

    loadData()
  }, [user, isDemoMode])

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return

    const subscription = supabase
      .channel("meeting_notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "meeting_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = {
            id: payload.new.id,
            userId: payload.new.user_id,
            meetingId: payload.new.meeting_id,
            meetingTitle: payload.new.meeting_title,
            type: payload.new.type,
            message: payload.new.message,
            time: payload.new.time,
            read: payload.new.read,
            dismissed: payload.new.dismissed,
            calendarSource: payload.new.calendar_source,
            meetingTime: payload.new.meeting_time,
            meetingDate: payload.new.meeting_date,
            location: payload.new.location,
            attendees: payload.new.attendees,
            changes: payload.new.changes,
          }

          setNotifications((prev) => [newNotification, ...prev])

          // Play sound if enabled
          if (preferences.soundEnabled && notificationSound) {
            notificationSound.play().catch((err) => console.error("Error playing notification sound:", err))
          }

          // Show browser notification if enabled
          if (
            preferences.browserNotificationsEnabled &&
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            const notification = new Notification(`Meeting: ${newNotification.meetingTitle}`, {
              body: newNotification.message,
              icon: "/favicon.ico",
            })

            // Auto close after 5 seconds
            setTimeout(() => notification.close(), 5000)
          }

          // No longer show toast notifications
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, preferences.soundEnabled, preferences.browserNotificationsEnabled, notificationSound, toast])

  // Check for upcoming meetings and generate notifications
  useEffect(() => {
    if (!user && !isDemoMode) return

    const checkUpcomingMeetings = async () => {
      // In a real implementation, this would query the database for upcoming meetings
      // and generate notifications based on user preferences

      // For demo purposes, we'll just use the demo data
      if (isDemoMode) {
        // This would be replaced with actual logic in a real implementation
        console.log("Checking for upcoming meetings in demo mode")
      }
    }

    // Check immediately
    checkUpcomingMeetings()

    // Then check every minute
    const interval = setInterval(checkUpcomingMeetings, 60000)

    return () => clearInterval(interval)
  }, [user, isDemoMode, preferences.upcomingMeetings, preferences.upcomingMeetingsTime])

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      if (isDemoMode) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      } else if (user) {
        const { error } = await supabase
          .from("meeting_notifications")
          .update({ read: true })
          .eq("id", id)
          .eq("user_id", user.id)

        if (error) throw error

        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      // No longer show toast notifications
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      if (isDemoMode) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      } else if (user) {
        const { error } = await supabase
          .from("meeting_notifications")
          .update({ read: true })
          .eq("user_id", user.id)
          .eq("read", false)

        if (error) throw error

        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      }

      // No longer show toast notifications
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      // No longer show toast notifications
    }
  }

  // Dismiss notification
  const dismissNotification = async (id: string) => {
    try {
      if (isDemoMode) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n)))
      } else if (user) {
        const { error } = await supabase
          .from("meeting_notifications")
          .update({ dismissed: true })
          .eq("id", id)
          .eq("user_id", user.id)

        if (error) throw error

        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n)))
      }
    } catch (error) {
      console.error("Error dismissing notification:", error)
      // No longer show toast notifications
    }
  }

  // Dismiss all notifications
  const dismissAllNotifications = async () => {
    try {
      if (isDemoMode) {
        setNotifications((prev) => prev.map((n) => ({ ...n, dismissed: true })))
      } else if (user) {
        const { error } = await supabase
          .from("meeting_notifications")
          .update({ dismissed: true })
          .eq("user_id", user.id)
          .eq("dismissed", false)

        if (error) throw error

        setNotifications((prev) => prev.map((n) => ({ ...n, dismissed: true })))
      }

      // No longer show toast notifications
    } catch (error) {
      console.error("Error dismissing all notifications:", error)
      // No longer show toast notifications
    }
  }

  // Update notification preferences
  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences }

      if (isDemoMode) {
        setPreferences(updatedPreferences)
      } else if (user) {
        const { error } = await supabase
          .from("meeting_notification_preferences")
          .update({
            upcoming_meetings: updatedPreferences.upcomingMeetings,
            upcoming_meetings_time: updatedPreferences.upcomingMeetingsTime,
            meeting_changes: updatedPreferences.meetingChanges,
            meeting_cancellations: updatedPreferences.meetingCancellations,
            new_invitations: updatedPreferences.newInvitations,
            daily_agenda: updatedPreferences.dailyAgenda,
            daily_agenda_time: updatedPreferences.dailyAgendaTime,
            sound_enabled: updatedPreferences.soundEnabled,
            browserNotificationsEnabled: updatedPreferences.browserNotificationsEnabled,
            emailNotificationsEnabled: updatedPreferences.emailNotificationsEnabled,
          })
          .eq("user_id", user.id)

        if (error) throw error

        setPreferences(updatedPreferences)
      }

      // No longer show toast notifications

      // Request browser notification permission if enabled
      if (
        newPreferences.browserNotificationsEnabled &&
        typeof Notification !== "undefined" &&
        Notification.permission !== "granted"
      ) {
        Notification.requestPermission()
      }
    } catch (error) {
      console.error("Error updating notification preferences:", error)
      // No longer show toast notifications
    }
  }

  // Send a test notification (for demo purposes)
  const sendTestNotification = () => {
    const testNotification: MeetingNotification = {
      id: `test-${Date.now()}`,
      userId: user?.id || "demo-user",
      meetingId: "test-meeting",
      meetingTitle: "Test Meeting",
      type: "upcoming",
      message: "This is a test notification for an upcoming meeting",
      time: new Date().toISOString(),
      read: false,
      dismissed: false,
      calendarSource: "Team Calendar",
      meetingTime: "14:00",
      meetingDate: new Date(Date.now() + 15 * 60 * 1000).toISOString().split("T")[0],
      location: "Conference Room A",
      attendees: ["You", "John Doe", "Jane Smith"],
    }

    setNotifications((prev) => [testNotification, ...prev])

    // Play sound if enabled
    if (preferences.soundEnabled && notificationSound) {
      notificationSound.play().catch((err) => console.error("Error playing notification sound:", err))
    }

    // No longer show toast notifications
  }

  return (
    <MeetingNotificationContext.Provider
      value={{
        notifications: notifications.filter((n) => !n.dismissed),
        unreadCount,
        preferences,
        isLoading,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        dismissAllNotifications,
        updatePreferences,
        sendTestNotification,
      }}
    >
      {children}
    </MeetingNotificationContext.Provider>
  )
}

export function useMeetingNotifications() {
  const context = useContext(MeetingNotificationContext)
  if (context === undefined) {
    throw new Error("useMeetingNotifications must be used within a MeetingNotificationProvider")
  }
  return context
}

// Helper function to generate demo notifications
function getDemoNotifications(): MeetingNotification[] {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return [
    {
      id: "1",
      userId: "demo-user",
      meetingId: "meeting-1",
      meetingTitle: "Sprint Planning",
      type: "upcoming",
      message: "Sprint Planning meeting starts in 15 minutes",
      time: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      read: false,
      dismissed: false,
      calendarSource: "Team Calendar",
      meetingTime: "10:00",
      meetingDate: now.toISOString().split("T")[0],
      location: "Main Conference Room",
      attendees: ["You", "Alex Johnson", "Samantha Lee", "Priya Patel"],
    },
    {
      id: "2",
      userId: "demo-user",
      meetingId: "meeting-2",
      meetingTitle: "Design Review",
      type: "change",
      message: "Design Review meeting has been moved to Conference Room B",
      time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      dismissed: false,
      calendarSource: "Google Calendar",
      meetingTime: "14:00",
      meetingDate: tomorrow.toISOString().split("T")[0],
      location: "Conference Room B",
      attendees: ["You", "Samantha Lee", "Priya Patel"],
      changes: [
        {
          field: "location",
          oldValue: "Conference Room A",
          newValue: "Conference Room B",
        },
      ],
    },
    {
      id: "3",
      userId: "demo-user",
      meetingId: "meeting-3",
      meetingTitle: "Client Meeting",
      type: "new_invitation",
      message: "You have been invited to a Client Meeting",
      time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      dismissed: false,
      calendarSource: "Outlook Calendar",
      meetingTime: "09:00",
      meetingDate: tomorrow.toISOString().split("T")[0],
      location: "Client Office",
      attendees: ["You", "Priya Patel", "Client A", "Client B"],
    },
    {
      id: "4",
      userId: "demo-user",
      meetingId: "meeting-4",
      meetingTitle: "Team Lunch",
      type: "reminder",
      message: "Daily reminder: Team Lunch at 12:30 today",
      time: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      read: true,
      dismissed: false,
      calendarSource: "Team Calendar",
      meetingTime: "12:30",
      meetingDate: now.toISOString().split("T")[0],
      location: "Cafeteria",
      attendees: ["You", "Alex Johnson", "Samantha Lee", "Marcus Chen", "Priya Patel", "David Kim"],
    },
    {
      id: "5",
      userId: "demo-user",
      meetingId: "meeting-5",
      meetingTitle: "Product Demo",
      type: "cancellation",
      message: "Product Demo meeting has been cancelled",
      time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      dismissed: false,
      calendarSource: "Google Calendar",
      meetingTime: "15:00",
      meetingDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      location: "Demo Room",
      attendees: ["You", "Alex Johnson", "Samantha Lee", "Priya Patel"],
    },
  ]
}
