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
  PlayCircle,
  GitlabIcon as GitHubLogoIcon,
  X,
  ExternalLink,
} from "lucide-react"
import { useGitHubWebhook, type GitHubWebhookEvent } from "@/lib/github-webhook-context"

interface GitHubWebhookNotificationProps {
  event: GitHubWebhookEvent
  onDismiss: () => void
}

export function GitHubWebhookNotification({ event, onDismiss }: GitHubWebhookNotificationProps) {
  const { markAsRead } = useGitHubWebhook()
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
      markAsRead(event.id)
      onDismiss()
    }, 300)
  }

  const getIcon = () => {
    switch (event.event_type) {
      case "push":
        return <GitCommit className="h-4 w-4 text-blue-500" />
      case "pull_request":
        return <GitPullRequest className="h-4 w-4 text-purple-500" />
      case "issues":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "workflow_run":
        return <PlayCircle className="h-4 w-4 text-green-500" />
      default:
        return <GitHubLogoIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case "push":
        return "Push"
      case "pull_request":
        return "Pull Request"
      case "issues":
        return "Issue"
      case "workflow_run":
        return "Workflow"
      default:
        return eventType.replace("_", " ")
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
            <div className="mt-0.5">{getIcon()}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{event.summary}</h4>
                <Badge variant="outline">{getEventTypeLabel(event.event_type)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{event.details}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </span>
                {event.repository && <span className="text-xs text-muted-foreground">{event.repository}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {event.url && (
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <a href={event.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
