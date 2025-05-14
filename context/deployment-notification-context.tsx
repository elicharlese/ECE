"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "@/lib/demo-context"

export type NotificationChannel = "in-app" | "email" | "slack" | "webhook"

export interface NotificationPreference {
  deploymentSuccess: boolean
  deploymentFailure: boolean
  deploymentStarted: boolean
  rollbackInitiated: boolean
  rollbackCompleted: boolean
  canaryDeploymentCreated: boolean
  canaryDeploymentPromoted: boolean
  canaryDeploymentFailed: boolean
  performanceAlert: boolean
}

export interface ChannelConfig {
  enabled: boolean
  recipients?: string[] // emails or slack channels
  webhookUrl?: string
}

export interface NotificationSettings {
  channels: Record<NotificationChannel, ChannelConfig>
  preferences: NotificationPreference
}

export interface DeploymentNotification {
  id: string
  type: keyof NotificationPreference
  title: string
  message: string
  deploymentId?: string
  version?: string
  environment?: string
  timestamp: string
  read: boolean
  metadata?: Record<string, any>
}

interface DeploymentNotificationContextType {
  notifications: DeploymentNotification[]
  unreadCount: number
  settings: NotificationSettings
  isLoading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearNotifications: () => Promise<void>
  updateSettings: (settings: NotificationSettings) => Promise<void>
  sendTestNotification: (channel: NotificationChannel) => Promise<boolean>
}

const defaultSettings: NotificationSettings = {
  channels: {
    "in-app": { enabled: true },
    email: { enabled: false, recipients: [] },
    slack: { enabled: false, recipients: [] },
    webhook: { enabled: false, webhookUrl: "" },
  },
  preferences: {
    deploymentSuccess: true,
    deploymentFailure: true,
    deploymentStarted: false,
    rollbackInitiated: true,
    rollbackCompleted: true,
    canaryDeploymentCreated: true,
    canaryDeploymentPromoted: true,
    canaryDeploymentFailed: true,
    performanceAlert: true,
  },
}

// Mock notifications for demo mode
const mockNotifications: DeploymentNotification[] = [
  {
    id: "notif_1",
    type: "deploymentSuccess",
    title: "Deployment Successful",
    message: "Version v1.2.5 was successfully deployed to production",
    deploymentId: "dep-001",
    version: "v1.2.5",
    environment: "production",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    read: false,
  },
  {
    id: "notif_2",
    type: "deploymentFailure",
    title: "Deployment Failed",
    message: "Version v1.2.6 failed to deploy to production due to build errors",
    deploymentId: "dep-failed-001",
    version: "v1.2.6",
    environment: "production",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: true,
    metadata: {
      errorMessage: "Module not found: Error: Can't resolve 'missing-dependency'",
      buildLogs: "https://vercel.com/your-team/your-project/deployments/dep-failed-001",
    },
  },
  {
    id: "notif_3",
    type: "rollbackInitiated",
    title: "Rollback Initiated",
    message: "Rollback initiated from v1.2.6 to v1.2.5 in production",
    deploymentId: "dep-001",
    version: "v1.2.5",
    environment: "production",
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
    read: false,
  },
  {
    id: "notif_4",
    type: "canaryDeploymentCreated",
    title: "Canary Deployment Created",
    message: "Canary deployment for v1.3.0 created with 10% traffic allocation",
    deploymentId: "dep-canary-001",
    version: "v1.3.0-canary",
    environment: "production",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: "notif_5",
    type: "performanceAlert",
    title: "Performance Alert",
    message: "Response time increased by 25% after deployment of v1.2.5",
    deploymentId: "dep-001",
    version: "v1.2.5",
    environment: "production",
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    read: false,
    metadata: {
      metric: "responseTime",
      previousValue: "120ms",
      currentValue: "150ms",
      threshold: "20%",
      monitoringUrl: "https://grafana.your-domain.com/dashboard/deployment-metrics",
    },
  },
]

const DeploymentNotificationContext = createContext<DeploymentNotificationContextType | undefined>(undefined)

export function DeploymentNotificationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [notifications, setNotifications] = useState<DeploymentNotification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load notifications and settings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // In a real app, fetch from API or local storage
        if (isDemoMode) {
          // Use mock data for demo mode
          setNotifications(mockNotifications)
          setSettings(defaultSettings)
        } else {
          // In a real app, fetch from API
          // const { data: notifData } = await supabase.from('deployment_notifications').select('*').order('timestamp', { ascending: false })
          // const { data: settingsData } = await supabase.from('notification_settings').select('*').single()

          // For now, use mock data
          setNotifications(mockNotifications)

          // Try to load settings from localStorage
          const savedSettings = localStorage.getItem("deploymentNotificationSettings")
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings))
          } else {
            setSettings(defaultSettings)
          }
        }
      } catch (error) {
        console.error("Error loading notification data:", error)
        // Fallback to mock data
        setNotifications(mockNotifications)
        setSettings(defaultSettings)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isDemoMode])

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  // Save settings to localStorage when they change
  useEffect(() => {
    if (!isDemoMode) {
      localStorage.setItem("deploymentNotificationSettings", JSON.stringify(settings))
    }
  }, [settings, isDemoMode])

  const markAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )

      if (!isDemoMode) {
        // In a real app, update in database
        // await supabase.from('deployment_notifications').update({ read: true }).eq('id', id)
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      // No longer show toast notifications
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))

      if (!isDemoMode) {
        // In a real app, update in database
        // await supabase.from('deployment_notifications').update({ read: true }).eq('read', false)
      }

      // No longer show toast notifications
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      // No longer show toast notifications
    }
  }

  const clearNotifications = async () => {
    try {
      setNotifications([])

      if (!isDemoMode) {
        // In a real app, delete from database
        // await supabase.from('deployment_notifications').delete().not('id', 'is', null)
      }

      // No longer show toast notifications
    } catch (error) {
      console.error("Error clearing notifications:", error)
      // No longer show toast notifications
    }
  }

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      setSettings(newSettings)

      if (!isDemoMode) {
        // In a real app, update in database
        // await supabase.from('notification_settings').upsert(newSettings)
      }

      // No longer show toast notifications
    } catch (error) {
      console.error("Error updating notification settings:", error)
      // No longer show toast notifications
    }
  }

  const sendTestNotification = async (channel: NotificationChannel): Promise<boolean> => {
    try {
      // In a real app, send a test notification via the specified channel
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      // No longer show toast notifications

      // If it's an in-app notification, add it to the list
      if (channel === "in-app") {
        const testNotification: DeploymentNotification = {
          id: `test-${Date.now()}`,
          type: "deploymentSuccess",
          title: "Test Notification",
          message: "This is a test notification to verify your settings",
          timestamp: new Date().toISOString(),
          read: false,
        }

        setNotifications((prev) => [testNotification, ...prev])
      }

      return true
    } catch (error) {
      console.error(`Error sending test notification via ${channel}:`, error)
      return false
    }
  }

  return (
    <DeploymentNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        settings,
        isLoading,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        updateSettings,
        sendTestNotification,
      }}
    >
      {children}
    </DeploymentNotificationContext.Provider>
  )
}

export function useDeploymentNotifications() {
  const context = useContext(DeploymentNotificationContext)
  if (context === undefined) {
    throw new Error("useDeploymentNotifications must be used within a DeploymentNotificationProvider")
  }
  return context
}
