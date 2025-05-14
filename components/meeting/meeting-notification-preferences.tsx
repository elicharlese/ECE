"use client"

import { useState } from "react"
import { useMeetingNotifications, type NotificationPreferences } from "@/lib/meeting-notification-context"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Bell, Volume2, Mail } from "lucide-react"

export function MeetingNotificationPreferences() {
  const { preferences, updatePreferences, isLoading } = useMeetingNotifications()
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences)
  const [hasChanges, setHasChanges] = useState(false)

  // Handle preference changes
  const handleChange = (key: keyof NotificationPreferences, value: any) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasChanges(true)
  }

  // Save changes
  const saveChanges = async () => {
    await updatePreferences(localPreferences)
    setHasChanges(false)
  }

  // Reset changes
  const resetChanges = () => {
    setLocalPreferences(preferences)
    setHasChanges(false)
  }

  // Request browser notification permission
  const requestBrowserPermission = async () => {
    if (typeof Notification === "undefined") return

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        handleChange("browserNotificationsEnabled", true)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Meeting Notifications</h3>
        <p className="text-sm text-muted-foreground">Configure when and how you receive meeting notifications</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Notification Types</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="upcoming-meetings">Upcoming Meetings</Label>
              <p className="text-xs text-muted-foreground">Receive notifications before meetings start</p>
            </div>
            <Switch
              id="upcoming-meetings"
              checked={localPreferences.upcomingMeetings}
              onCheckedChange={(checked) => handleChange("upcomingMeetings", checked)}
            />
          </div>

          {localPreferences.upcomingMeetings && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="upcoming-time">Notification time</Label>
              <Select
                value={localPreferences.upcomingMeetingsTime.toString()}
                onValueChange={(value) => handleChange("upcomingMeetingsTime", Number.parseInt(value))}
              >
                <SelectTrigger id="upcoming-time" className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="10">10 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meeting-changes">Meeting Changes</Label>
              <p className="text-xs text-muted-foreground">Receive notifications when meetings are updated</p>
            </div>
            <Switch
              id="meeting-changes"
              checked={localPreferences.meetingChanges}
              onCheckedChange={(checked) => handleChange("meetingChanges", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meeting-cancellations">Meeting Cancellations</Label>
              <p className="text-xs text-muted-foreground">Receive notifications when meetings are cancelled</p>
            </div>
            <Switch
              id="meeting-cancellations"
              checked={localPreferences.meetingCancellations}
              onCheckedChange={(checked) => handleChange("meetingCancellations", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-invitations">New Invitations</Label>
              <p className="text-xs text-muted-foreground">Receive notifications for new meeting invitations</p>
            </div>
            <Switch
              id="new-invitations"
              checked={localPreferences.newInvitations}
              onCheckedChange={(checked) => handleChange("newInvitations", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="daily-agenda">Daily Agenda</Label>
              <p className="text-xs text-muted-foreground">Receive a daily summary of your meetings</p>
            </div>
            <Switch
              id="daily-agenda"
              checked={localPreferences.dailyAgenda}
              onCheckedChange={(checked) => handleChange("dailyAgenda", checked)}
            />
          </div>

          {localPreferences.dailyAgenda && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="agenda-time">Agenda time</Label>
              <Input
                id="agenda-time"
                type="time"
                value={localPreferences.dailyAgendaTime}
                onChange={(e) => handleChange("dailyAgendaTime", e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Notification Channels</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Label htmlFor="sound-enabled">Sound Notifications</Label>
            </div>
            <Switch
              id="sound-enabled"
              checked={localPreferences.soundEnabled}
              onCheckedChange={(checked) => handleChange("soundEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <Label htmlFor="browser-notifications">Browser Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="browser-notifications"
                checked={localPreferences.browserNotificationsEnabled}
                onCheckedChange={(checked) => {
                  if (checked && Notification.permission !== "granted") {
                    requestBrowserPermission()
                  } else {
                    handleChange("browserNotificationsEnabled", checked)
                  }
                }}
              />
              {Notification.permission !== "granted" && (
                <Button variant="outline" size="sm" onClick={requestBrowserPermission}>
                  Enable
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <Label htmlFor="email-notifications">Email Notifications</Label>
            </div>
            <Switch
              id="email-notifications"
              checked={localPreferences.emailNotificationsEnabled}
              onCheckedChange={(checked) => handleChange("emailNotificationsEnabled", checked)}
            />
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={resetChanges}>
            Cancel
          </Button>
          <Button onClick={saveChanges} disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}
