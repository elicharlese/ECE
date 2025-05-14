"use client"

import { useState, useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Bell,
  Check,
  Trash2,
  AlertCircle,
  Calendar,
  ArrowDown,
  BarChart4,
  X,
  Clock,
  ChevronDown,
  AlarmClock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useWallet, type WalletNotification, type SnoozeOption } from "@/lib/wallet-context"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { useMediaQuery } from "@/hooks/use-media-query"

export function WalletNotifications() {
  const {
    walletNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
    snoozeNotification,
    cancelSnooze,
    notificationSettings,
    updateNotificationSettings,
  } = useWallet()

  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallMobile = useMediaQuery("(max-width: 480px)")

  const [toast, setToast] = useState<{
    visible: boolean
    title: string
    description: string
    variant: "default" | "destructive" | "success"
  }>({
    visible: false,
    title: "",
    description: "",
    variant: "default",
  })

  const unreadCount = walletNotifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: WalletNotification["type"]) => {
    switch (type) {
      case "deposit_reminder":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "deposit_executed":
        return <Check className="h-5 w-5 text-green-500" />
      case "low_balance":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "large_transaction":
        return <ArrowDown className="h-5 w-5 text-purple-500" />
      case "activity_summary":
        return <BarChart4 className="h-5 w-5 text-indigo-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatSnoozeTime = (date: string) => {
    const snoozeDate = new Date(date)
    const now = new Date()

    // If it's today
    if (snoozeDate.toDateString() === now.toDateString()) {
      return `at ${snoozeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }

    // If it's tomorrow
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (snoozeDate.toDateString() === tomorrow.toDateString()) {
      return `tomorrow at ${snoozeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }

    // Otherwise show the full date
    return `on ${snoozeDate.toLocaleDateString()} at ${snoozeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  const handleSnooze = (id: string, duration: SnoozeOption) => {
    snoozeNotification(id, duration)
    if (isMobile) {
      // On mobile, close the sheet after snoozing
      setTimeout(() => setIsOpen(false), 300)
    }
  }

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  const filteredNotifications = useMemo(() => {
    // First filter by read status
    let filtered = walletNotifications.filter(
      (notification) =>
        filter === "all" || (filter === "unread" && !notification.read) || (filter === "read" && notification.read),
    )

    // Then filter out snoozed notifications
    filtered = filtered.filter(
      (notification) => !notification.snoozedUntil || new Date(notification.snoozedUntil) <= new Date(),
    )

    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
  }, [walletNotifications, filter, sortOrder])

  const snoozedNotifications = useMemo(() => {
    return walletNotifications
      .filter((notification) => notification.snoozedUntil && new Date(notification.snoozedUntil) > new Date())
      .sort((a, b) => {
        const dateA = new Date(a.snoozedUntil!).getTime()
        const dateB = new Date(b.snoozedUntil!).getTime()
        return dateA - dateB // Always sort snoozed by when they'll reappear
      })
  }, [walletNotifications])

  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" | "success" = "default",
  ) => {
    setToast({
      visible: true,
      title,
      description,
      variant,
    })

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead()
    showToast("Notifications Cleared", "All notifications have been marked as read.", "success")
  }

  const handleDeleteAll = async () => {
    await deleteAllNotifications()
    showToast("Notifications Deleted", "All notifications have been deleted.", "success")
  }

  // Toast notification
  const renderToast = () => {
    if (!toast.visible) return null

    return (
      <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
        <Toast variant={toast.variant}>
          <div className="flex items-start gap-2">
            {toast.variant === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {toast.variant === "destructive" && <AlertTriangle className="h-5 w-5" />}
            <div>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </div>
          </div>
        </Toast>
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {renderToast()}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={`w-full ${isMobile ? "p-0" : "sm:max-w-md"}`}>
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex justify-between items-center">
            <span>Wallet Notifications</span>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                  <Check className="h-4 w-4 mr-1" />
                  {!isSmallMobile && "Mark all read"}
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="notifications" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-4 mb-2">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex space-x-1">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                className="text-xs h-7"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                className="text-xs h-7"
                onClick={() => setFilter("unread")}
              >
                Unread
              </Button>
              <Button
                variant={filter === "read" ? "default" : "outline"}
                size="sm"
                className="text-xs h-7"
                onClick={() => setFilter("read")}
              >
                Read
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            >
              {sortOrder === "newest" ? (
                <>
                  Newest <ChevronDown className="ml-1 h-3 w-3" />
                </>
              ) : (
                <>
                  Oldest <ChevronDown className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          </div>

          <TabsContent value="notifications" className="flex-1 p-0">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 p-4">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                    <Bell className="h-8 w-8 text-muted-foreground mb-4" />
                    <h3 className="text-sm font-medium mb-2">No notifications</h3>
                    <p className="text-xs text-muted-foreground">
                      {filter === "all"
                        ? "You don't have any notifications yet."
                        : filter === "unread"
                          ? "You don't have any unread notifications."
                          : "You don't have any read notifications."}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`relative ${!notification.read ? "bg-muted/50 dark:bg-slate-700" : "dark:bg-slate-800"} hover:shadow-md transition-shadow`}
                    >
                      <CardHeader className="p-3 sm:p-4 pb-2 flex flex-row items-start gap-2 sm:gap-3 space-y-0">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-medium truncate">{notification.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 -mt-1"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-0 pl-[40px] sm:pl-[52px]">
                        <p className="text-xs sm:text-sm">{notification.message}</p>
                      </CardContent>
                      {!notification.read && (
                        <div className="absolute top-0 right-0 h-full">
                          <div className="h-full w-1 bg-primary rounded-tr-md rounded-br-md" />
                        </div>
                      )}
                      <CardFooter className="p-3 sm:p-4 pt-0 pl-[40px] sm:pl-[52px] mt-2 flex justify-end gap-2 flex-wrap">
                        {!notification.read ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as read
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              // This would require adding a markAsUnread function to the context
                              // For now, we'll just show this as a UI element
                            }}
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Mark as unread
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Snooze
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[150px]">
                            <DropdownMenuItem onClick={() => handleSnooze(notification.id, "30min")}>
                              30 minutes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSnooze(notification.id, "1hour")}>
                              1 hour
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSnooze(notification.id, "3hours")}>
                              3 hours
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSnooze(notification.id, "tomorrow")}>
                              Tomorrow
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSnooze(notification.id, "nextweek")}>
                              Next week
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  ))
                )}

                {/* Snoozed notifications section */}
                {snoozedNotifications.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium px-2 py-1 flex items-center mb-3">
                      <AlarmClock className="h-4 w-4 mr-2" />
                      Snoozed Notifications
                    </h3>
                    <div className="space-y-3">
                      {snoozedNotifications.map((notification) => (
                        <Card
                          key={notification.id}
                          className="relative bg-muted/20 border-dashed hover:bg-muted/30 transition-colors dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                        >
                          <CardHeader className="p-3 sm:p-4 pb-2 flex flex-row items-start gap-2 sm:gap-3 space-y-0">
                            <div className="mt-1">
                              <AlarmClock className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm font-medium truncate">{notification.title}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                Snoozed until {formatSnoozeTime(notification.snoozedUntil!)}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 -mt-1"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent className="p-3 sm:p-4 pt-0 pl-[40px] sm:pl-[52px]">
                            <p className="text-xs sm:text-sm text-muted-foreground">{notification.message}</p>
                          </CardContent>
                          <CardFooter className="p-3 sm:p-4 pt-0 pl-[40px] sm:pl-[52px] mt-2 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => cancelSnooze(notification.id)}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Cancel snooze
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t mt-2">
              <Button variant="outline" className="w-full" onClick={handleDeleteAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all notifications
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4">
            <h3 className="text-lg font-medium mb-6">Notification Preferences</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="font-medium">Deposit Reminders</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Get notified before scheduled deposits</div>
                </div>
                <Switch
                  checked={notificationSettings.depositReminders}
                  onCheckedChange={(checked) => updateNotificationSettings({ depositReminders: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="font-medium">Deposit Executions</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Get notified when deposits are executed
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.depositExecutions}
                  onCheckedChange={(checked) => updateNotificationSettings({ depositExecutions: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="font-medium">Low Balance Alerts</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Get notified when your balance is low</div>
                </div>
                <Switch
                  checked={notificationSettings.lowBalanceAlerts}
                  onCheckedChange={(checked) => updateNotificationSettings({ lowBalanceAlerts: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="font-medium">Large Transactions</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Get notified about large deposits or withdrawals
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.largeTransactions}
                  onCheckedChange={(checked) => updateNotificationSettings({ largeTransactions: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="font-medium">Activity Summaries</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Get weekly summaries of your wallet activity
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.activitySummaries}
                  onCheckedChange={(checked) => updateNotificationSettings({ activitySummaries: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
