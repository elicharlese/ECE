"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Rocket,
  GitlabIcon as GitHubLogoIcon,
  CodeIcon as VercelLogoIcon,
  X,
} from "lucide-react"

export interface IntegrationEvent {
  id: string
  type: "github" | "vercel"
  eventType: "commit" | "pull_request" | "issue" | "deployment_success" | "deployment_failure" | "build_start"
  title: string
  description: string
  timestamp: string
  url?: string
  repository?: string
  project?: string
}

interface IntegrationNotificationProps {
  event: IntegrationEvent
  onDismiss: (id: string) => void
}

export function IntegrationNotification({ event, onDismiss }: IntegrationNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      handleDismiss()
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)

    // Wait for the animation to complete before removing from DOM
    setTimeout(() => {
      onDismiss(event.id)
    }, 300)
  }

  const getIcon = () => {
    switch (event.eventType) {
      case "commit":
        return <GitCommit className="h-4 w-4 text-blue-500" />
      case "pull_request":
        return <GitPullRequest className="h-4 w-4 text-purple-500" />
      case "issue":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "deployment_success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "deployment_failure":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "build_start":
        return <Rocket className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getPlatformIcon = () => {
    return event.type === "github" ? <GitHubLogoIcon className="h-4 w-4" /> : <VercelLogoIcon className="h-4 w-4" />
  }

  const getBadgeColor = () => {
    switch (event.eventType) {
      case "deployment_success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "deployment_failure":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pull_request":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "issue":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "commit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "build_start":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return ""
    }
  }

  return (
    <Card
      className={`shadow-md transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getPlatformIcon()}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{event.title}</h4>
                <Badge variant="outline" className={getBadgeColor()}>
                  {getIcon()}
                  <span className="ml-1">{event.eventType.replace("_", " ")}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </span>
                {event.repository && (
                  <span className="text-xs text-muted-foreground">• Repository: {event.repository}</span>
                )}
                {event.project && <span className="text-xs text-muted-foreground">• Project: {event.project}</span>}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
