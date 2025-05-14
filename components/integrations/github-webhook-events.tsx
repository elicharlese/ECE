"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  GitlabIcon as GitHubLogoIcon,
  PlayCircle,
  Eye,
  EyeOff,
} from "lucide-react"
import { useGitHubWebhook, type GitHubWebhookEvent } from "@/lib/github-webhook-context"

export function GitHubWebhookEvents() {
  const { events, unreadCount, isLoading, markAsRead, markAllAsRead, clearEvents, refreshEvents } = useGitHubWebhook()
  const [activeTab, setActiveTab] = useState("all")

  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !event.read
    return event.event_type === activeTab
  })

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
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

  const handleMarkAsRead = (event: GitHubWebhookEvent) => {
    if (!event.read) {
      markAsRead(event.id)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <GitHubLogoIcon className="h-5 w-5" />
              GitHub Webhook Events
            </CardTitle>
            <CardDescription className="mt-1">Real-time events from your GitHub repositories</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshEvents} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="relative">
              All
              {unreadCount > 0 && <Badge className="ml-2 bg-primary text-primary-foreground">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="push">Pushes</TabsTrigger>
            <TabsTrigger value="pull_request">Pull Requests</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="workflow_run">Workflows</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <GitHubLogoIcon className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  {isLoading
                    ? "Loading events..."
                    : activeTab === "unread"
                      ? "You've read all events. Good job!"
                      : "No GitHub webhook events have been received yet."}
                </p>
                {!isLoading && activeTab !== "unread" && (
                  <Button variant="outline" onClick={refreshEvents}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 border rounded-lg transition-colors ${
                      event.read ? "bg-background" : "bg-muted/30"
                    }`}
                    onClick={() => handleMarkAsRead(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getEventIcon(event.event_type)}</div>
                        <div>
                          <div className="font-medium">{event.summary}</div>
                          <div className="text-sm text-muted-foreground mt-1">{event.details}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getEventTypeLabel(event.event_type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                            </span>
                            {event.repository && (
                              <span className="text-xs text-muted-foreground">{event.repository}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!event.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(event.id)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {event.url && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <a href={event.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <EyeOff className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
        <Button variant="outline" size="sm" onClick={clearEvents} disabled={events.length === 0}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All Events
        </Button>
      </CardFooter>
    </Card>
  )
}
