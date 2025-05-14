"use client"

import { useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import {
  Bell,
  Calendar,
  Check,
  Clock,
  MapPin,
  Trash2,
  Users,
  X,
  AlertTriangle,
  CalendarPlus,
  CalendarX,
  CalendarClock,
  CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  useMeetingNotifications,
  type MeetingNotification,
  type MeetingNotificationType,
} from "@/lib/meeting-notification-context"
import { MeetingNotificationPreferences } from "./meeting-notification-preferences"

export function MeetingNotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    dismissAllNotifications,
    sendTestNotification,
  } = useMeetingNotifications()

  const [isOpen, setIsOpen] = useState(false)

  // Get notification icon based on type
  const getNotificationIcon = (type: MeetingNotificationType) => {
    switch (type) {
      case "upcoming":
        return <CalendarClock className="h-5 w-5 text-blue-500" />
      case "starting_soon":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "change":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "cancellation":
        return <CalendarX className="h-5 w-5 text-red-500" />
      case "new_invitation":
        return <CalendarPlus className="h-5 w-5 text-green-500" />
      case "reminder":
        return <CalendarDays className="h-5 w-5 text-purple-500" />
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />
    }
  }

  // Get calendar source badge color
  const getSourceColor = (source = "Team Calendar") => {
    switch (source) {
      case "Google Calendar":
        return "bg-[#4285F4] text-white"
      case "Outlook Calendar":
        return "bg-[#0078D4] text-white"
      case "Apple Calendar":
        return "bg-[#FF2D55] text-white"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Meeting Notifications</SheetTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="notifications" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  You don't have any meeting notifications at the moment.
                </p>
                <Button variant="outline" className="mt-4" onClick={sendTestNotification}>
                  Send Test Notification
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDismiss={dismissNotification}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}

            {notifications.length > 0 && (
              <SheetFooter className="mt-4 flex-row gap-2 sm:justify-start">
                <Button variant="outline" onClick={dismissAllNotifications}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button variant="outline" onClick={sendTestNotification}>
                  Send Test Notification
                </Button>
              </SheetFooter>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <MeetingNotificationPreferences />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

interface NotificationCardProps {
  notification: MeetingNotification
  onMarkAsRead: (id: string) => Promise<void>
  onDismiss: (id: string) => Promise<void>
}

function NotificationCard({ notification, onMarkAsRead, onDismiss }: NotificationCardProps) {
  const getNotificationIcon = (type: MeetingNotificationType) => {
    switch (type) {
      case "upcoming":
        return <CalendarClock className="h-5 w-5 text-blue-500" />
      case "starting_soon":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "change":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "cancellation":
        return <CalendarX className="h-5 w-5 text-red-500" />
      case "new_invitation":
        return <CalendarPlus className="h-5 w-5 text-green-500" />
      case "reminder":
        return <CalendarDays className="h-5 w-5 text-purple-500" />
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />
    }
  }

  // Get calendar source badge color
  const getSourceColor = (source = "Team Calendar") => {
    switch (source) {
      case "Google Calendar":
        return "bg-[#4285F4] text-white"
      case "Outlook Calendar":
        return "bg-[#0078D4] text-white"
      case "Apple Calendar":
        return "bg-[#FF2D55] text-white"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  return (
    <Card className={`relative ${!notification.read ? "bg-muted/50" : ""}`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start gap-3">
        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">{notification.meetingTitle}</CardTitle>
          <CardDescription className="text-xs mt-1">
            {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDismiss(notification.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm">{notification.message}</p>

        {notification.meetingDate && notification.meetingTime && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {format(new Date(notification.meetingDate), "MMM d, yyyy")} at {notification.meetingTime}
            </span>
          </div>
        )}

        {notification.location && (
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{notification.location}</span>
          </div>
        )}

        {notification.attendees && notification.attendees.length > 0 && (
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            <span>{notification.attendees.join(", ")}</span>
          </div>
        )}

        {notification.calendarSource && (
          <Badge variant="secondary" className={`text-xs mt-2 ${getSourceColor(notification.calendarSource)}`}>
            {notification.calendarSource}
          </Badge>
        )}

        {notification.changes && notification.changes.length > 0 && (
          <div className="mt-2 border rounded-md p-2 text-xs">
            <p className="font-medium mb-1">Changes:</p>
            {notification.changes.map((change, index) => (
              <div key={index} className="flex flex-col">
                <span className="font-medium">{change.field}:</span>
                <div className="flex items-center">
                  <span className="line-through text-muted-foreground">{change.oldValue}</span>
                  <span className="mx-2">→</span>
                  <span>{change.newValue}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        {!notification.read && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onMarkAsRead(notification.id)}>
            <Check className="h-3 w-3 mr-1" />
            Mark as read
          </Button>
        )}
      </CardFooter>

      {!notification.read && (
        <div className="absolute top-0 right-0 h-full">
          <div className="h-full w-1 bg-primary rounded-tr-md rounded-br-md" />
        </div>
      )}
    </Card>
  )
}
