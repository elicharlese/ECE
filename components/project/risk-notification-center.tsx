"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, AlertTriangle, Clock, CheckCircle2, X, AlertCircle } from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import type { ProjectMilestone } from "./project-tracker"

interface RiskNotification {
  id: string
  milestoneId: string
  milestoneTitle: string
  type: "high_risk" | "medium_risk" | "deadline_approaching" | "dependency_delayed" | "back_on_track"
  message: string
  timestamp: string
  read: boolean
}

interface RiskNotificationCenterProps {
  milestones: ProjectMilestone[]
  onViewMilestone: (milestoneId: string) => void
}

export function RiskNotificationCenter({ milestones, onViewMilestone }: RiskNotificationCenterProps) {
  const [notifications, setNotifications] = useState<RiskNotification[]>([])
  const [open, setOpen] = useState(false)

  // Generate notifications based on milestone risks
  useEffect(() => {
    // This would typically come from an API or be stored in a database
    // For this demo, we'll generate them based on the current milestones
    const criticalPath = calculateCriticalPath(milestones)
    const criticalMilestones = milestones.filter((m) => criticalPath.has(m.id))

    const generatedNotifications: RiskNotification[] = []

    // Add notifications for high-risk milestones
    criticalMilestones.forEach((milestone) => {
      const now = new Date()
      const dueDate = new Date(milestone.dueDate)
      const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      // High risk notification for delayed milestones
      if (milestone.status === "delayed") {
        generatedNotifications.push({
          id: `high_risk_${milestone.id}`,
          milestoneId: milestone.id,
          milestoneTitle: milestone.title,
          type: "high_risk",
          message: `Critical path milestone "${milestone.title}" is delayed and at high risk.`,
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: false,
        })
      }

      // Deadline approaching notification
      if (daysRemaining > 0 && daysRemaining <= 3 && milestone.progress < 90) {
        generatedNotifications.push({
          id: `deadline_${milestone.id}`,
          milestoneId: milestone.id,
          milestoneTitle: milestone.title,
          type: "deadline_approaching",
          message: `Critical path milestone "${milestone.title}" is due in ${daysRemaining} days but is only ${milestone.progress}% complete.`,
          timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          read: false,
        })
      }

      // Dependency delayed notification
      if (milestone.dependencies && milestone.dependencies.length > 0) {
        const delayedDependencies = milestones.filter(
          (m) => milestone.dependencies?.includes(m.id) && m.status === "delayed",
        )

        if (delayedDependencies.length > 0) {
          generatedNotifications.push({
            id: `dependency_${milestone.id}`,
            milestoneId: milestone.id,
            milestoneTitle: milestone.title,
            type: "dependency_delayed",
            message: `${delayedDependencies.length} dependencies for critical path milestone "${milestone.title}" are delayed.`,
            timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            read: false,
          })
        }
      }

      // Medium risk notification for milestones behind schedule
      const expectedProgress = milestone.progress + 20
      if (milestone.progress < expectedProgress && milestone.status !== "delayed") {
        generatedNotifications.push({
          id: `medium_risk_${milestone.id}`,
          milestoneId: milestone.id,
          milestoneTitle: milestone.title,
          type: "medium_risk",
          message: `Critical path milestone "${milestone.title}" is behind schedule and at medium risk.`,
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          read: false,
        })
      }

      // Back on track notification
      if (milestone.status === "in-progress" && milestone.progress >= 90) {
        generatedNotifications.push({
          id: `back_on_track_${milestone.id}`,
          milestoneId: milestone.id,
          milestoneTitle: milestone.title,
          type: "back_on_track",
          message: `Critical path milestone "${milestone.title}" is back on track and nearly complete.`,
          timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          read: true,
        })
      }
    })

    setNotifications(generatedNotifications)
  }, [milestones])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const getNotificationIcon = (type: RiskNotification["type"]) => {
    switch (type) {
      case "high_risk":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "medium_risk":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "deadline_approaching":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "dependency_delayed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "back_on_track":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`
    } else {
      return format(date, "MMM d, h:mm a")
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Risk Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
          <SheetDescription>Stay informed about risks to your critical path milestones</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No notifications at this time</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${notification.read ? "bg-background" : "bg-muted/30"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{notification.milestoneTitle}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-sm mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => {
                            markAsRead(notification.id)
                            onViewMilestone(notification.milestoneId)
                            setOpen(false)
                          }}
                        >
                          View Milestone
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// Helper function to calculate the critical path
function calculateCriticalPath(milestones: ProjectMilestone[]): Set<string> {
  const criticalPath = new Set<string>()

  // This is a simplified implementation - in a real app, this would use the same algorithm as the graph
  // For this demo, we'll identify milestones that form the longest path through the dependency graph

  // Find milestones with no dependencies (starting points)
  const startMilestones = milestones.filter((m) => !m.dependencies || m.dependencies.length === 0)

  // Find milestones with no dependents (end points)
  const endMilestones = milestones.filter((m) => {
    return !milestones.some((other) => other.dependencies?.includes(m.id))
  })

  // For each possible path from start to end, calculate the total duration
  let longestPathLength = 0
  let longestPath: string[] = []

  // Helper function to find all paths
  const findPaths = (currentId: string, path: string[], visited: Set<string>) => {
    // Add current milestone to path and visited set
    path.push(currentId)
    visited.add(currentId)

    // Check if we've reached an end milestone
    const isEndMilestone = endMilestones.some((m) => m.id === currentId)
    if (isEndMilestone) {
      // Check if this is the longest path so far
      if (path.length > longestPathLength) {
        longestPathLength = path.length
        longestPath = [...path]
      }
    }

    // Find all milestones that depend on the current one
    const dependents = milestones.filter((m) => m.dependencies?.includes(currentId) && !visited.has(m.id))

    // Recursively explore all dependents
    for (const dependent of dependents) {
      findPaths(dependent.id, [...path], new Set(visited))
    }
  }

  // Start path finding from each start milestone
  for (const start of startMilestones) {
    findPaths(start.id, [], new Set())
  }

  // Add all milestones in the longest path to the critical path set
  longestPath.forEach((id) => criticalPath.add(id))

  return criticalPath
}
