"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "./demo-context"

export interface GitHubWebhookEvent {
  id: string
  event_type: string
  repository: string
  summary: string
  details: string
  timestamp: string
  url?: string
  read: boolean
}

interface GitHubWebhookContextType {
  events: GitHubWebhookEvent[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearEvents: () => Promise<void>
  refreshEvents: () => Promise<void>
}

const GitHubWebhookContext = createContext<GitHubWebhookContextType>({
  events: [],
  unreadCount: 0,
  isLoading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  clearEvents: async () => {},
  refreshEvents: async () => {},
})

// Mock data for demo mode
const mockEvents: GitHubWebhookEvent[] = [
  {
    id: "evt_1",
    event_type: "push",
    repository: "yourusername/ece-app",
    summary: "3 new commits pushed to main",
    details: "Jane Developer pushed 3 commits to main",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    url: "https://github.com/yourusername/ece-app/commit/a1b2c3d4e5f6g7h8i9j0",
    read: false,
  },
  {
    id: "evt_2",
    event_type: "pull_request",
    repository: "yourusername/ece-app",
    summary: "Pull request #16 opened",
    details: "John Coder opened PR #16: Add marketplace search functionality",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    url: "https://github.com/yourusername/ece-app/pull/16",
    read: true,
  },
  {
    id: "evt_3",
    event_type: "issues",
    repository: "yourusername/ece-app",
    summary: "Issue #23 opened",
    details: "QA Tester opened issue #23: Mobile navigation menu not working on iOS",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    url: "https://github.com/yourusername/ece-app/issues/23",
    read: false,
  },
  {
    id: "evt_4",
    event_type: "workflow_run",
    repository: "yourusername/ece-app",
    summary: "CI workflow failed",
    details: "The 'Build and Test' workflow failed on branch feature/marketplace",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    url: "https://github.com/yourusername/ece-app/actions/runs/1234567890",
    read: false,
  },
]

export function GitHubWebhookProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [events, setEvents] = useState<GitHubWebhookEvent[]>([])
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
          .from("github_webhook_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) {
          throw error
        }

        if (data) {
          // Transform the data to match our interface
          const transformedEvents: GitHubWebhookEvent[] = data.map((event) => {
            // Extract relevant information based on event type
            let summary = ""
            let details = ""
            let repository = ""
            let url = ""

            const payload = event.payload

            if (payload.repository) {
              repository = payload.repository.full_name
            }

            switch (event.event_type) {
              case "push":
                const commits = payload.commits || []
                summary = `${commits.length} new commit${commits.length === 1 ? "" : "s"} pushed to ${payload.ref.replace("refs/heads/", "")}`
                details = `${payload.sender?.login || "Someone"} pushed ${commits.length} commit${commits.length === 1 ? "" : "s"} to ${payload.ref.replace("refs/heads/", "")}`
                url = payload.compare
                break
              case "pull_request":
                summary = `Pull request #${payload.pull_request.number} ${payload.action}`
                details = `${payload.sender?.login || "Someone"} ${payload.action} PR #${payload.pull_request.number}: ${payload.pull_request.title}`
                url = payload.pull_request.html_url
                break
              case "issues":
                summary = `Issue #${payload.issue.number} ${payload.action}`
                details = `${payload.sender?.login || "Someone"} ${payload.action} issue #${payload.issue.number}: ${payload.issue.title}`
                url = payload.issue.html_url
                break
              case "workflow_run":
                summary = `Workflow ${payload.workflow_run.conclusion || payload.workflow_run.status}`
                details = `The '${payload.workflow_run.name}' workflow ${payload.workflow_run.conclusion || payload.workflow_run.status} on branch ${payload.workflow_run.head_branch}`
                url = payload.workflow_run.html_url
                break
              default:
                summary = `${event.event_type} event received`
                details = `A ${event.event_type} event was received from GitHub`
            }

            return {
              id: event.id,
              event_type: event.event_type,
              repository,
              summary,
              details,
              timestamp: event.created_at,
              url,
              read: event.read || false,
            }
          })

          setEvents(transformedEvents)
        }
      }
      */
    } catch (error) {
      console.error("Error fetching GitHub webhook events:", error)

      // Fallback to mock data in case of error
      setEvents(mockEvents)

      // Only show toast if not in demo mode
      if (!isDemoMode) {
        toast({
          title: "Notice",
          description: "Using demo data for GitHub webhook events",
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
        const { error } = await supabase.from("github_webhook_events").update({ read: true }).eq("id", id)

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
        const { error } = await supabase.from("github_webhook_events").update({ read: true }).eq("read", false)

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
        const { error } = await supabase.from("github_webhook_events").delete().not("id", "is", null)

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
    <GitHubWebhookContext.Provider
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
    </GitHubWebhookContext.Provider>
  )
}

export const useGitHubWebhook = () => useContext(GitHubWebhookContext)
