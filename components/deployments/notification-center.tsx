"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useDeploymentNotifications, type DeploymentNotification } from "@/context/deployment-notification-context"
import { BellRing, CheckCircle, XCircle, AlertTriangle, Info, Check, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useDeploymentNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleClearAll = async () => {
    await clearNotifications()
    setIsOpen(false)
  }

  const getFilteredNotifications = () => {
    if (activeFilter === "all") return notifications

    if (activeFilter === "unread") {
      return notifications.filter((n) => !n.read)
    }

    // Filter by type
    return notifications.filter((n) => {
      switch (activeFilter) {
        case "success":
          return ["deploymentSuccess", "rollbackCompleted", "canaryDeploymentPromoted"].includes(n.type)
        case "failure":
          return ["deploymentFailure", "canaryDeploymentFailed"].includes(n.type)
        case "warning":
          return ["rollbackInitiated", "performanceAlert"].includes(n.type)
        case "info":
          return ["deploymentStarted", "canaryDeploymentCreated"].includes(n.type)
        default:
          return true
      }
    })
  }

  const getNotificationIcon = (notification: DeploymentNotification) => {
    switch (notification.type) {
      case "deploymentSuccess":
      case "rollbackCompleted":
      case "canaryDeploymentPromoted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "deploymentFailure":
      case "canaryDeploymentFailed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "rollbackInitiated":
      case "performanceAlert":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "deploymentStarted":
      case "canaryDeploymentCreated":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BellRing className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Deployment Notifications</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              title="Mark all as read"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              title="Clear all notifications"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="grid grid-cols-5 p-1 m-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="success" className="text-green-600">
              Success
            </TabsTrigger>
            <TabsTrigger value="failure" className="text-red-600">
              Failure
            </TabsTrigger>
            <TabsTrigger value="warning" className="text-amber-600">
              Warning
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeFilter} className="mt-0">
            <ScrollArea className="h-[300px]">
              {getFilteredNotifications().length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                  <BellRing className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No notifications to display</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {getFilteredNotifications().map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-muted/20" : ""}`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>

                          {notification.version && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {notification.version && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.version}
                                </Badge>
                              )}
                              {notification.environment && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.environment}
                                </Badge>
                              )}
                            </div>
                          )}

                          {notification.metadata && notification.type === "performanceAlert" && (
                            <div className="mt-2 text-xs bg-muted p-2 rounded">
                              <div className="flex justify-between">
                                <span>Previous:</span>
                                <span>{notification.metadata.previousValue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Current:</span>
                                <span>{notification.metadata.currentValue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Threshold:</span>
                                <span>{notification.metadata.threshold}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
