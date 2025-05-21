"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NotificationSettings } from "@/components/deployments/notification-settings"
import { useDeploymentNotifications, type DeploymentNotification } from "@/context/deployment-notification-context"
import { CheckCircle, XCircle, AlertTriangle, Info, Clock, Check, Trash2 } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, isLoading } = useDeploymentNotifications()
  const [activeTab, setActiveTab] = useState("all")

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleClearAll = async () => {
    await clearNotifications()
  }

  const getFilteredNotifications = () => {
    if (activeTab === "all") return notifications

    if (activeTab === "unread") {
      return notifications.filter((n) => !n.read)
    }

    // Filter by type
    return notifications.filter((n) => {
      switch (activeTab) {
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
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "deploymentFailure":
      case "canaryDeploymentFailed":
        return <XCircle className="h-6 w-6 text-red-500" />
      case "rollbackInitiated":
      case "performanceAlert":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />
      case "deploymentStarted":
      case "canaryDeploymentCreated":
        return <Info className="h-6 w-6 text-blue-500" />
      default:
        return <Info className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={notifications.filter((n) => !n.read).length === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
          <Button variant="outline" onClick={handleClearAll} disabled={notifications.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="w-full">
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
            <TabsTrigger value="info" className="text-blue-600">
              Info
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="settings">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value={activeTab} className="mt-0">
          {activeTab !== "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Deployment Notifications</CardTitle>
                <CardDescription>
                  {activeTab === "all"
                    ? "All notifications related to your deployments"
                    : activeTab === "unread"
                      ? "Unread notifications"
                      : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} notifications`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : getFilteredNotifications().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted rounded-full p-3 mb-4">
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No notifications</h3>
                    <p className="text-muted-foreground max-w-sm">
                      {activeTab === "unread"
                        ? "You've read all your notifications. Great job staying on top of things!"
                        : "You don't have any notifications yet. They'll appear here when deployment events occur."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredNotifications().map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${!notification.read ? "bg-muted/20 border-primary/20" : ""}`}
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification)}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{notification.title}</h3>
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                </span>
                                {!notification.read && (
                                  <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                                    <Check className="h-4 w-4 mr-1" />
                                    Mark as read
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-1">
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
                              <Badge variant="outline" className="text-xs">
                                {format(new Date(notification.timestamp), "MMM d, yyyy h:mm a")}
                              </Badge>
                            </div>

                            {notification.metadata && notification.type === "performanceAlert" && (
                              <div className="mt-2 text-sm bg-muted p-3 rounded">
                                <h4 className="font-medium mb-2">Performance Impact</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-muted-foreground">Previous:</span>
                                    <span className="float-right">{notification.metadata.previousValue}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Current:</span>
                                    <span className="float-right">{notification.metadata.currentValue}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Threshold:</span>
                                    <span className="float-right">{notification.metadata.threshold}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Monitoring:</span>
                                    <a
                                      href={notification.metadata.monitoringUrl}
                                      className="float-right text-primary hover:underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View metrics
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}

                            {notification.metadata && notification.type === "deploymentFailure" && (
                              <div className="mt-2 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-800">
                                <h4 className="font-medium mb-2 text-red-700 dark:text-red-400">Error Details</h4>
                                <div className="text-red-600 dark:text-red-400 font-mono text-xs p-2 bg-red-100 dark:bg-red-900/20 rounded mb-2 overflow-x-auto">
                                  {notification.metadata.errorMessage}
                                </div>
                                <a
                                  href={notification.metadata.buildLogs}
                                  className="text-primary hover:underline text-xs"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View complete build logs
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
