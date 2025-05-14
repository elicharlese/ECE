"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "./demo-context"

export interface VercelWebhookEvent {
  id: string
  event_type: string
  project_name: string
  summary: string
  details: string
  timestamp: string
  url?: string
  read: boolean
  status?: "building" | "ready" | "error" | "canceled"
}

interface VercelWebhookContextType {
  events: VercelWebhookEvent[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearEvents: () => Promise<void>
  refreshEvents: () => Promise<void>
}

const VercelWebhookContext = createContext<VercelWebhookContextType>({
  events: [],
  unreadCount: 0,
  isLoading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  clearEvents: async () => {},
  refreshEvents: async () => {},
})

// Mock data for demo mode
const mockEvents: VercelWebhookEvent[] = [
  {
    id: "evt_v1",
    event_type: "deployment.created",
    project_name: "ece-app",
    summary: "Deployment started for ece-app",
    details: "A new deployment was started for the main branch",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    url: "https://vercel.com/yourusername/ece-app/deployments",
    read: false,
    status: "building",
  },
  {
    id: "evt_v2",
    event_type: "deployment.ready",
    project_name: "ece-app",
    summary: "Deployment successful for ece-app",
    details: "The deployment to production was successful",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    url: "https://ece-app.vercel.app",
    read: true,
    status: "ready",
  },
  {
    id: "evt_v3",
    event_type: "deployment.error",
    project_name: "api-service",
    summary: "Deployment failed for api-service",
    details: "The deployment failed due to a build error: Module not found",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    url: "https://vercel.com/yourusername/api-service/deployments",
    read: false,
    status: "error",
  },
  {
    id: "evt_v4",
    event_type: "deployment.canceled",
    project_name: "marketing-site",
    summary: "Deployment canceled for marketing-site",
    details: "The deployment was manually canceled",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    url: "https://vercel.com/yourusername/marketing-site/deployments",
    read: false,
    status: "canceled",
  },
]

export function VercelWebhookProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [events, setEvents] = useState<VercelWebhookEvent[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load events on mount
  useEffect(() => {
    refreshEvents()
  }, [])

  // Calculate unread count whenever events change
  useEffect(() => {
    setUnreadCount(events.filter((event) => !event.read).length)
  }, [events])

  const refreshEvents = async () => {
    setIsLoading(true)

    try {
      // Always use mock data for now to prevent fetch errors
      // In a real app, you would check isDemoMode here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEvents(mockEvents)

      /* 
      // This code is commented out to prevent fetch errors
      // Uncomment and modify once your database is set up
      if (!isDemoMode && supabase) {
        const { data, error } = await supabase
          .from("vercel_webhook_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) {
          throw error
        }

        if (data) {
          // Transform the data to match our interface
          const transformedEvents: VercelWebhookEvent[] = data.map((event) => {
            // Extract relevant information based on event type
            let summary = ""
            let details = ""
            let projectName = ""
            let url = ""
            let status: "building" | "ready" | "error" | "canceled" | undefined

            const payload = event.payload

            if (payload.project) {
              projectName = payload.project.name
            }

            switch (event.event_type) {
              case "deployment.created":
                summary = `Deployment started for ${projectName}`
                details = `A new deployment was started for the ${payload.meta?.branch || "unknown"} branch`
                url = `https://vercel.com/${payload.team?.slug || ""}/${projectName}/deployments`
                status = "building"
                break
              case "deployment.ready":
                summary = `Deployment successful for ${projectName}`
                details = `The deployment to ${payload.target || "production"} was successful`
                url = payload.url
                status = "ready"
                break
              case "deployment.error":
                summary = `Deployment failed for ${projectName}`
                details = `The deployment failed due to a build error: ${payload.error?.message || "Unknown error"}`
                url = `https://vercel.com/${payload.team?.slug || ""}/${projectName}/deployments`
                status = "error"
                break
              case "deployment.canceled":
                summary = `Deployment canceled for ${projectName}`
                details = `The deployment was manually canceled`
                url = `https://vercel.com/${payload.team?.slug || ""}/${projectName}/deployments`
                status = "canceled"
                break
              default:
                summary = `${event.event_type} event received`
                details = `A ${event.event_type} event was received from Vercel`
            }

            return {
              id: event.id,
              event_type: event.event_type,
              project_name: projectName,
              summary,
              details,
              timestamp: event.created_at,
              url,
              read: event.read || false,
              status,
            }
          })

          setEvents(transformedEvents)
        }
      }
      */
    } catch (error) {
      console.error("Error fetching Vercel webhook events:", error)

      // Fallback to mock data in case of error
      setEvents(mockEvents)

      // Only show toast if not in demo mode
      if (!isDemoMode) {
        toast({
          title: "Notice",
          description: "Using demo data for Vercel webhook events",
          variant: "default",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, read: true } : event)))

      /* 
      // This code is commented out to prevent fetch errors
      if (!isDemoMode && supabase) {
        const { error } = await supabase.from("vercel_webhook_events").update({ read: true }).eq("id", id)

        if (error) {
          throw error
        }
      }
      */
    } catch (error) {
      console.error("Error marking event as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark event as read",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      setEvents((prev) => prev.map((event) => ({ ...event, read: true })))

      /* 
      // This code is commented out to prevent fetch errors
      if (!isDemoMode && supabase) {
        const { error } = await supabase.from("vercel_webhook_events").update({ read: true }).eq("read", false)

        if (error) {
          throw error
        }
      }
      */

      toast({
        title: "Success",
        description: "All events marked as read",
      })
    } catch (error) {
      console.error("Error marking all events as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all events as read",
        variant: "destructive",
      })
    }
  }

  const clearEvents = async () => {
    try {
      setEvents([])

      /* 
      // This code is commented out to prevent fetch errors
      if (!isDemoMode && supabase) {
        const { error } = await supabase.from("vercel_webhook_events").delete().not("id", "is", null)

        if (error) {
          throw error
        }
      }
      */

      toast({
        title: "Success",
        description: "All events cleared",
      })
    } catch (error) {
      console.error("Error clearing events:", error)
      toast({
        title: "Error",
        description: "Failed to clear events",
        variant: "destructive",
      })
    }
  }

  return (
    <VercelWebhookContext.Provider
      value={{
        events,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        clearEvents,
        refreshEvents,
      }}
    >
      {children}
    </VercelWebhookContext.Provider>
  )
}

export const useVercelWebhook = () => useContext(VercelWebhookContext)
