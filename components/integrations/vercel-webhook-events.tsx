"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useVercelWebhook } from "@/lib/vercel-webhook-context"
import { formatDistanceToNow } from "date-fns"
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Rocket,
  AlertTriangle,
  CheckCheck,
  Filter,
} from "lucide-react"

export function VercelWebhookEvents() {
  const { events, unreadCount, isLoading, markAsRead, markAllAsRead, clearEvents, refreshEvents } = useVercelWebhook()
  const [activeTab, setActiveTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshEvents()
    setIsRefreshing(false)
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ready":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Ready
          </Badge>
        )
      case "building":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Clock className="h-3.5 w-3.5 mr-1 animate-spin" />
            Building
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Error
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Canceled
          </Badge>
        )
      default:
        return null
    }
  }

  const getEventTypeBadge = (eventType: string) => {
    switch (eventType) {
      case "deployment.created":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Rocket className="h-3.5 w-3.5 mr-1" />
            Deployment Started
          </Badge>
        )
      case "deployment.ready":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Deployment Successful
          </Badge>
        )
      case "deployment.error":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Deployment Failed
          </Badge>
        )
      case "deployment.canceled":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Deployment Canceled
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {eventType
              .split(".")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Badge>
        )
    }
  }

  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !event.read
    if (activeTab === "building") return event.status === "building"
    if (activeTab === "ready") return event.status === "ready"
    if (activeTab === "error") return event.status === "error"
    if (activeTab === "canceled") return event.status === "canceled"
    return true
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Vercel Webhook Events
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Real-time events from your Vercel projects</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
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
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={clearEvents}>
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="building">Building</TabsTrigger>
              <TabsTrigger value="ready">Ready</TabsTrigger>
              <TabsTrigger value="error">Error</TabsTrigger>
              <TabsTrigger value="canceled">Canceled</TabsTrigger>
            </TabsList>
            <div className="flex items-center text-sm text-muted-foreground">
              <Filter className="h-4 w-4 mr-1" />
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Rocket className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-sm max-w-md mx-auto">
                  {events.length === 0
                    ? "You haven't received any Vercel webhook events yet."
                    : "No events match the current filter."}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 border rounded-lg ${
                        !event.read ? "bg-muted/40 dark:bg-muted/20" : ""
                      } transition-colors`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{event.summary}</h4>
                            {getEventTypeBadge(event.event_type)}
                            {getStatusBadge(event.status)}
                            {!event.read && (
                              <Badge variant="default" className="ml-2">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{event.details}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={event.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                          {!event.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(event.id)}>
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div>
                          Project: <span className="font-medium">{event.project_name}</span>
                        </div>
                        <div>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          Webhook events are stored for 30 days. Configure webhooks in the settings.
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://vercel.com/docs/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Vercel Webhook Docs
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
