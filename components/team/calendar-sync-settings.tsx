"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Check, ExternalLink, RefreshCw, Shield, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "@/lib/demo-context"

// Types for connected calendars
interface ConnectedCalendar {
  id: string
  provider: "google" | "outlook" | "apple" | "caldav"
  name: string
  email?: string
  color: string
  isActive: boolean
  lastSynced: string
  syncDirection: "import" | "export" | "both"
  syncFrequency: "realtime" | "hourly" | "daily"
  syncCategories: string[]
}

// Demo data for connected calendars
const demoConnectedCalendars: ConnectedCalendar[] = [
  {
    id: "cal1",
    provider: "google",
    name: "Work Calendar",
    email: "user@example.com",
    color: "#4285F4",
    isActive: true,
    lastSynced: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    syncDirection: "both",
    syncFrequency: "realtime",
    syncCategories: ["meetings", "deadlines", "team-events"],
  },
  {
    id: "cal2",
    provider: "outlook",
    name: "Personal Calendar",
    email: "personal@example.com",
    color: "#0078D4",
    isActive: true,
    lastSynced: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    syncDirection: "import",
    syncFrequency: "hourly",
    syncCategories: ["personal", "reminders"],
  },
  {
    id: "cal3",
    provider: "apple",
    name: "Family Calendar",
    color: "#FF2D55",
    isActive: false,
    lastSynced: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    syncDirection: "export",
    syncFrequency: "daily",
    syncCategories: ["family", "holidays"],
  },
]

export function CalendarSyncSettings() {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [connectedCalendars, setConnectedCalendars] = useState<ConnectedCalendar[]>(demoConnectedCalendars)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState("connected")

  // Function to format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "just now"
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`
    return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`
  }

  // Function to toggle calendar active state
  const toggleCalendarActive = (id: string) => {
    setConnectedCalendars(connectedCalendars.map((cal) => (cal.id === id ? { ...cal, isActive: !cal.isActive } : cal)))

    toast({
      title: "Calendar status updated",
      description: `Calendar sync has been ${connectedCalendars.find((c) => c.id === id)?.isActive ? "paused" : "resumed"}.`,
    })
  }

  // Function to remove a connected calendar
  const removeCalendar = (id: string) => {
    const calendarToRemove = connectedCalendars.find((cal) => cal.id === id)
    if (!calendarToRemove) return

    setConnectedCalendars(connectedCalendars.filter((cal) => cal.id !== id))

    toast({
      title: "Calendar removed",
      description: `"${calendarToRemove.name}" has been disconnected.`,
    })
  }

  // Function to sync a calendar manually
  const syncCalendar = (id: string) => {
    setIsSyncing(true)

    // Simulate API call
    setTimeout(() => {
      setConnectedCalendars(
        connectedCalendars.map((cal) => (cal.id === id ? { ...cal, lastSynced: new Date().toISOString() } : cal)),
      )

      setIsSyncing(false)

      toast({
        title: "Calendar synced",
        description: "Your calendar has been synced successfully.",
      })
    }, 1500)
  }

  // Function to connect a new calendar
  const connectCalendar = (provider: "google" | "outlook" | "apple" | "caldav") => {
    setIsConnecting(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would redirect to OAuth flow
      // For demo, we'll just add a new calendar
      if (isDemoMode) {
        const newCalendar: ConnectedCalendar = {
          id: `cal${Date.now()}`,
          provider,
          name: `New ${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar`,
          email: provider !== "caldav" ? "user@example.com" : undefined,
          color:
            provider === "google"
              ? "#4285F4"
              : provider === "outlook"
                ? "#0078D4"
                : provider === "apple"
                  ? "#FF2D55"
                  : "#6B7280",
          isActive: true,
          lastSynced: new Date().toISOString(),
          syncDirection: "both",
          syncFrequency: "realtime",
          syncCategories: ["meetings"],
        }

        setConnectedCalendars([...connectedCalendars, newCalendar])
        setActiveTab("connected")
      }

      setIsConnecting(false)

      toast({
        title: "Calendar connected",
        description: `Your ${provider} calendar has been connected successfully.`,
      })
    }, 1500)
  }

  // Function to update calendar settings
  const updateCalendarSettings = (id: string, settings: Partial<ConnectedCalendar>) => {
    setConnectedCalendars(connectedCalendars.map((cal) => (cal.id === id ? { ...cal, ...settings } : cal)))

    toast({
      title: "Settings updated",
      description: "Your calendar sync settings have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connected">Connected Calendars</TabsTrigger>
          <TabsTrigger value="connect">Connect New Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {connectedCalendars.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No calendars connected</h3>
              <p className="mt-1 text-sm text-muted-foreground">Connect your external calendars to sync events</p>
              <Button className="mt-4" onClick={() => setActiveTab("connect")}>
                Connect Calendar
              </Button>
            </div>
          ) : (
            <>
              {connectedCalendars.map((calendar) => (
                <Card key={calendar.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: calendar.color }} />
                          {calendar.name}
                          {!calendar.isActive && (
                            <Badge variant="outline" className="ml-2">
                              Paused
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {calendar.provider.charAt(0).toUpperCase() + calendar.provider.slice(1)}
                          {calendar.email && ` • ${calendar.email}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isSyncing}
                          onClick={() => syncCalendar(calendar.id)}
                        >
                          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeCalendar(calendar.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      Last synced: {formatRelativeTime(calendar.lastSynced)}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`active-${calendar.id}`} className="flex items-center">
                          Active
                        </Label>
                        <Switch
                          id={`active-${calendar.id}`}
                          checked={calendar.isActive}
                          onCheckedChange={() => toggleCalendarActive(calendar.id)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`direction-${calendar.id}`}>Sync Direction</Label>
                        <Select
                          value={calendar.syncDirection}
                          onValueChange={(value) =>
                            updateCalendarSettings(calendar.id, {
                              syncDirection: value as "import" | "export" | "both",
                            })
                          }
                        >
                          <SelectTrigger id={`direction-${calendar.id}`}>
                            <SelectValue placeholder="Select direction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="import">Import only (Read only)</SelectItem>
                            <SelectItem value="export">Export only (Write only)</SelectItem>
                            <SelectItem value="both">Two-way sync (Read & Write)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`frequency-${calendar.id}`}>Sync Frequency</Label>
                        <Select
                          value={calendar.syncFrequency}
                          onValueChange={(value) =>
                            updateCalendarSettings(calendar.id, {
                              syncFrequency: value as "realtime" | "hourly" | "daily",
                            })
                          }
                        >
                          <SelectTrigger id={`frequency-${calendar.id}`}>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Event Categories to Sync</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["meetings", "deadlines", "team-events", "personal", "reminders", "holidays"].map(
                            (category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${category}-${calendar.id}`}
                                  checked={calendar.syncCategories.includes(category)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      updateCalendarSettings(calendar.id, {
                                        syncCategories: [...calendar.syncCategories, category],
                                      })
                                    } else {
                                      updateCalendarSettings(calendar.id, {
                                        syncCategories: calendar.syncCategories.filter((c) => c !== category),
                                      })
                                    }
                                  }}
                                />
                                <Label htmlFor={`${category}-${calendar.id}`} className="text-sm capitalize">
                                  {category.replace("-", " ")}
                                </Label>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        window.open(
                          calendar.provider === "google"
                            ? "https://calendar.google.com"
                            : calendar.provider === "outlook"
                              ? "https://outlook.office.com/calendar"
                              : "https://www.icloud.com/calendar",
                          "_blank",
                        )
                      }}
                    >
                      Open in {calendar.provider.charAt(0).toUpperCase() + calendar.provider.slice(1)}
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sync Conflicts</AlertTitle>
                <AlertDescription>
                  When events conflict between calendars, the most recently updated event will take precedence. You can
                  change this behavior in the advanced settings.
                </AlertDescription>
              </Alert>
            </>
          )}
        </TabsContent>

        <TabsContent value="connect" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-[#4285F4]/10">
                <CardTitle className="flex items-center text-[#4285F4]">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.56 10.738c0-.655-.06-1.29-.173-1.9H12v3.596h5.382a4.6 4.6 0 0 1-1.996 3.025v2.513h3.232c1.89-1.742 2.978-4.305 2.978-7.234Z" />
                    <path d="M12 22c2.697 0 4.97-.89 6.624-2.416l-3.232-2.509c-.896.602-2.046.956-3.392.956-2.607 0-4.815-1.76-5.604-4.126H3.08v2.59A9.996 9.996 0 0 0 12 22Z" />
                    <path d="M6.39 13.905c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V7.515H3.08A9.996 9.996 0 0 0 2 12.004c0 1.614.387 3.142 1.073 4.49l3.318-2.59Z" />
                    <path d="M12 5.977c1.47 0 2.786.505 3.823 1.496l2.864-2.864C16.954 2.99 14.682 2 12 2 8.133 2 4.742 4.114 3.08 7.515l3.31 2.59C7.184 7.736 9.4 5.977 12 5.977Z" />
                  </svg>
                  Google Calendar
                </CardTitle>
                <CardDescription>Connect your Google Calendar to sync events</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-4">Sync your Google Calendar events with our app. This allows you to:</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    View Google Calendar events in the app
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Create events that sync to Google Calendar
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Receive notifications for upcoming events
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button className="w-full" onClick={() => connectCalendar("google")} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect Google Calendar"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-[#0078D4]/10">
                <CardTitle className="flex items-center text-[#0078D4]">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.18 5.01L12 11.25 2.82 5.01h18.36zm.82 1.47v11.2c0 1.29-1.04 2.32-2.32 2.32H4.32C3.04 20 2 18.96 2 17.68V6.48l10 6.51 10-6.51z" />
                  </svg>
                  Microsoft Outlook
                </CardTitle>
                <CardDescription>Connect your Outlook Calendar to sync events</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-4">
                  Sync your Microsoft Outlook Calendar events with our app. This allows you to:
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    View Outlook Calendar events in the app
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Create events that sync to Outlook Calendar
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Manage meeting invitations
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button className="w-full" onClick={() => connectCalendar("outlook")} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect Outlook Calendar"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-[#FF2D55]/10">
                <CardTitle className="flex items-center text-[#FF2D55]">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Apple Calendar
                </CardTitle>
                <CardDescription>Connect your Apple Calendar to sync events</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-4">Sync your Apple Calendar events with our app. This allows you to:</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    View Apple Calendar events in the app
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Create events that sync to Apple Calendar
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Sync across all your Apple devices
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button className="w-full" onClick={() => connectCalendar("apple")} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect Apple Calendar"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-muted">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  CalDAV Server
                </CardTitle>
                <CardDescription>Connect to any CalDAV-compatible calendar</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-4">Connect to any calendar that supports the CalDAV protocol, such as:</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Nextcloud Calendar
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Fastmail Calendar
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Zoho Calendar
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Other CalDAV-compatible calendars
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button className="w-full" onClick={() => connectCalendar("caldav")} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect CalDAV Calendar"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Alert variant="outline" className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle>Privacy Information</AlertTitle>
            <AlertDescription>
              We only access the calendar data you explicitly choose to sync. Your credentials are securely stored and
              you can revoke access at any time.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
