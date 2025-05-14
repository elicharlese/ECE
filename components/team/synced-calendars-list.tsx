"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar, Eye, EyeOff, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface SyncedCalendar {
  id: string
  provider: "google" | "outlook" | "apple" | "caldav"
  name: string
  color: string
  isActive: boolean
  isVisible: boolean
  eventCount: number
  lastSynced: string
}

// Demo data for synced calendars
const demoSyncedCalendars: SyncedCalendar[] = [
  {
    id: "cal1",
    provider: "google",
    name: "Work Calendar",
    color: "#4285F4",
    isActive: true,
    isVisible: true,
    eventCount: 12,
    lastSynced: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  },
  {
    id: "cal2",
    provider: "outlook",
    name: "Personal Calendar",
    color: "#0078D4",
    isActive: true,
    isVisible: true,
    eventCount: 8,
    lastSynced: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "cal3",
    provider: "apple",
    name: "Family Calendar",
    color: "#FF2D55",
    isActive: true,
    isVisible: false,
    eventCount: 5,
    lastSynced: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "cal4",
    provider: "caldav",
    name: "Project Deadlines",
    color: "#6B7280",
    isActive: true,
    isVisible: true,
    eventCount: 3,
    lastSynced: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
]

export function SyncedCalendarsList() {
  const { toast } = useToast()
  const [syncedCalendars, setSyncedCalendars] = useState<SyncedCalendar[]>(demoSyncedCalendars)
  const [isSyncing, setIsSyncing] = useState(false)

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
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHour < 24) return `${diffHour}h ago`
    return `${diffDay}d ago`
  }

  // Function to toggle calendar visibility
  const toggleCalendarVisibility = (id: string) => {
    setSyncedCalendars(syncedCalendars.map((cal) => (cal.id === id ? { ...cal, isVisible: !cal.isVisible } : cal)))

    const calendar = syncedCalendars.find((cal) => cal.id === id)
    if (calendar) {
      toast({
        title: calendar.isVisible ? "Calendar hidden" : "Calendar visible",
        description: `Events from "${calendar.name}" are now ${calendar.isVisible ? "hidden" : "visible"} on the calendar.`,
      })
    }
  }

  // Function to sync all calendars
  const syncAllCalendars = () => {
    setIsSyncing(true)

    // Simulate API call
    setTimeout(() => {
      setSyncedCalendars(syncedCalendars.map((cal) => ({ ...cal, lastSynced: new Date().toISOString() })))

      setIsSyncing(false)

      toast({
        title: "Calendars synced",
        description: "All calendars have been synced successfully.",
      })
    }, 1500)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Synced Calendars</CardTitle>
            <CardDescription>Manage your connected calendars</CardDescription>
          </div>
          <Button variant="outline" size="sm" disabled={isSyncing} onClick={syncAllCalendars}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            Sync All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {syncedCalendars.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No calendars connected</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                // Navigate to calendar settings
                window.location.href = "/app/settings/calendar"
              }}
            >
              Connect Calendar
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {syncedCalendars.map((calendar) => (
                <div key={calendar.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: calendar.color }} />
                    <div>
                      <div className="font-medium flex items-center">
                        {calendar.name}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {calendar.eventCount} events
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <span className="capitalize">{calendar.provider}</span>
                        <span className="mx-1">•</span>
                        <span>Synced {formatRelativeTime(calendar.lastSynced)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleCalendarVisibility(calendar.id)}
                      title={calendar.isVisible ? "Hide calendar" : "Show calendar"}
                    >
                      {calendar.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`calendar-${calendar.id}`}
                        checked={calendar.isVisible}
                        onCheckedChange={() => toggleCalendarVisibility(calendar.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
