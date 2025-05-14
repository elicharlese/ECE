"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { Bell, CheckCircle, Info, Check, Calendar, MessageSquare, ArrowRight, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"

// Type definitions
type NotificationType = "project" | "payment" | "comment" | "meeting" | "deployment" | "all"
type NotificationPriority = "high" | "medium" | "low"

interface NotificationAction {
  label: string
  link: string
}

interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: NotificationType
  priority: NotificationPriority
  avatar?: string
  link?: string
  actions?: NotificationAction[]
}

export function NotificationBadge() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<NotificationType>("all")
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const popoutRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [persistentUnreadCount, setPersistentUnreadCount] = useState(0)
  const [persistentAuthState, setPersistentAuthState] = useState(false)

  // Add this useEffect to check for persistent auth state
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const persistentAuth = localStorage.getItem("eceAuthState")
        if (persistentAuth) {
          const authState = JSON.parse(persistentAuth)
          if (authState.timestamp && Date.now() - authState.timestamp < 24 * 60 * 60 * 1000) {
            setPersistentAuthState(true)
          }
        }
      } catch (e) {
        console.error("Error parsing persistent auth state:", e)
      }
    }
  }, [])

  // Load notifications from localStorage on mount and listen for new notifications
  useEffect(() => {
    setMounted(true)

    // Load existing notifications from localStorage
    const loadNotifications = () => {
      try {
        const storedNotifications = localStorage.getItem("notifications")
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications))
        }

        // Load persistent unread count
        const storedNotificationState = localStorage.getItem("notificationState")
        if (storedNotificationState) {
          const parsedState = JSON.parse(storedNotificationState)
          if (parsedState.unreadCount !== undefined) {
            setPersistentUnreadCount(parsedState.unreadCount)
          }
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }

    loadNotifications()

    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent) => {
      setNotifications((prev) => {
        const newNotification = event.detail
        const exists = prev.some((n) => n.id === newNotification.id)
        if (exists) return prev
        return [newNotification, ...prev]
      })
    }

    window.addEventListener("new-notification", handleNewNotification as EventListener)

    return () => {
      window.removeEventListener("new-notification", handleNewNotification as EventListener)
    }
  }, [])

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (mounted && notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }, [notifications, mounted])

  // Handle click outside to close popout
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popoutRef.current &&
        !popoutRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const unreadCount = notifications.filter((n) => !n.read).length

  // Update persistent unread count
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "notificationState",
        JSON.stringify({
          unreadCount,
          lastUpdated: new Date().toISOString(),
        }),
      )
      setPersistentUnreadCount(unreadCount)
    }
  }, [unreadCount, mounted])

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications
    return notifications.filter((n) => n.type === activeTab)
  }, [notifications, activeTab])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    }
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "project":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "meeting":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "deployment":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const togglePopout = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  // Use persistent unread count if the actual count is still loading
  const displayUnreadCount = persistentUnreadCount || unreadCount

  if (!mounted) return null

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative hover:bg-muted/80 transition-colors"
        aria-label={`Notifications ${displayUnreadCount > 0 ? `(${displayUnreadCount} unread)` : ""}`}
        onClick={togglePopout}
      >
        <Bell className="h-5 w-5" />
        {displayUnreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center animate-pulse"
          >
            {displayUnreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div
          ref={popoutRef}
          className="absolute right-0 mt-2 w-[350px] sm:w-[420px] bg-background rounded-lg border shadow-lg z-50 overflow-hidden flex flex-col"
          style={{ maxHeight: "85vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 border-b sticky top-0 bg-background z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <span className="font-medium">Notifications</span>
              {displayUnreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {displayUnreadCount} unread
                </Badge>
              )}
            </div>
            {displayUnreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="h-8">
                <Check className="h-3.5 w-3.5 mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          <div className="px-4 py-3 border-b sticky top-[57px] bg-background z-10 flex overflow-x-auto scrollbar-hide">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "h-8 px-3 rounded-md text-sm transition-colors",
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted text-foreground",
                )}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("project")}
                className={cn(
                  "h-8 px-3 rounded-md text-sm transition-colors",
                  activeTab === "project" ? "bg-green-500 text-white" : "bg-muted/50 hover:bg-muted text-foreground",
                )}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={cn(
                  "h-8 px-3 rounded-md text-sm transition-colors",
                  activeTab === "payment" ? "bg-green-500 text-white" : "bg-muted/50 hover:bg-muted text-foreground",
                )}
              >
                Payments
              </button>
              <button
                onClick={() => setActiveTab("comment")}
                className={cn(
                  "h-8 px-3 rounded-md text-sm transition-colors",
                  activeTab === "comment" ? "bg-blue-500 text-white" : "bg-muted/50 hover:bg-muted text-foreground",
                )}
              >
                Comments
              </button>
              <button
                onClick={() => setActiveTab("meeting")}
                className={cn(
                  "h-8 px-3 rounded-md text-sm transition-colors",
                  activeTab === "meeting" ? "bg-purple-500 text-white" : "bg-muted/50 hover:bg-muted text-foreground",
                )}
              >
                Meetings
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(85vh - 180px)" }}>
            <div className="p-4 space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl opacity-70 animate-pulse"></div>
                    <div className="relative bg-muted rounded-full p-5 border border-border/30">
                      <Bell className="h-10 w-10 text-muted-foreground opacity-80" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No {activeTab !== "all" ? activeTab : ""} notifications</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-6">
                    {activeTab === "all"
                      ? "Your notification center is empty. When you receive notifications, they'll appear here."
                      : `You don't have any ${activeTab} notifications yet. They'll appear here when you receive them.`}
                  </p>

                  {activeTab === "all" && (
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                      <div className="bg-background border rounded-lg p-3 text-center hover:bg-muted/50 transition-colors">
                        <Calendar className="h-5 w-5 mx-auto mb-2 text-purple-500" />
                        <p className="text-xs font-medium">Check Calendar</p>
                      </div>
                      <div className="bg-background border rounded-lg p-3 text-center hover:bg-muted/50 transition-colors">
                        <MessageSquare className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                        <p className="text-xs font-medium">View Messages</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "project" && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Link href="/app/crowdfunding">Browse Projects</Link>
                    </Button>
                  )}

                  {activeTab === "payment" && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Link href="/app/payments">View Payment History</Link>
                    </Button>
                  )}

                  {activeTab === "comment" && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Link href="/app/chat">Go to Messages</Link>
                    </Button>
                  )}

                  {activeTab === "meeting" && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Link href="/app/team-calendar">View Calendar</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "relative rounded-lg transition-all duration-200 group",
                        !notification.read ? "bg-primary/5 dark:bg-primary/10" : "bg-background hover:bg-muted/50",
                        isHovering === notification.id ? "ring-1 ring-primary/20" : "",
                      )}
                      onMouseEnter={() => setIsHovering(notification.id)}
                      onMouseLeave={() => setIsHovering(null)}
                    >
                      {!notification.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-primary" />
                      )}
                      <div className="p-3 pl-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            <Avatar className="h-10 w-10 rounded-md border">
                              {notification.avatar ? (
                                <img src={notification.avatar || "/placeholder.svg"} alt="" className="object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              )}
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                                <div className={cn("h-2 w-2 rounded-full", getPriorityColor(notification.priority))} />
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(notification.date)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>

                            <div
                              className={cn(
                                "mt-2 flex flex-wrap gap-2 transition-all duration-200",
                                isHovering === notification.id ? "opacity-100" : "opacity-0",
                              )}
                            >
                              {notification.actions?.map((action, idx) => (
                                <Link href={action.link} key={idx}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => {
                                      markAsRead(notification.id)
                                      setIsOpen(false)
                                    }}
                                  >
                                    {action.label}
                                  </Button>
                                </Link>
                              ))}
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs ml-auto"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="px-4 py-3 border-t sticky bottom-0 bg-background flex justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/notifications" className="flex items-center">
                All Notifications
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
