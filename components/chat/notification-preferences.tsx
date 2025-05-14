"use client"

import { useState, useEffect } from "react"
import { Bell, Volume2, VolumeX, Monitor } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useChatNotifications } from "@/lib/chat-notification-context"

export function NotificationPreferences() {
  const {
    browserNotificationsEnabled,
    soundNotificationsEnabled,
    notificationVolume,
    setBrowserNotificationsEnabled,
    setSoundNotificationsEnabled,
    setNotificationVolume,
    requestBrowserNotificationPermission,
  } = useChatNotifications()

  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | "unknown">("unknown")

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setBrowserPermission(Notification.permission)
    }
  }, [browserNotificationsEnabled])

  const handleTestSound = () => {
    const audio = new Audio("/sounds/notification.mp3")
    audio.volume = notificationVolume / 100
    audio.play()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">Configure how you want to be notified about new messages</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <Label htmlFor="browser-notifications" className="text-sm font-medium">
              Browser Notifications
            </Label>
          </div>
          <Switch
            id="browser-notifications"
            checked={browserNotificationsEnabled}
            onCheckedChange={(checked) => {
              if (checked && browserPermission !== "granted") {
                requestBrowserNotificationPermission()
              } else {
                setBrowserNotificationsEnabled(checked)
              }
            }}
          />
        </div>

        {browserPermission === "denied" && (
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-3 text-sm text-yellow-800 dark:text-yellow-200">
            <p>
              Browser notifications are blocked. Please update your browser settings to enable notifications for this
              site.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <Label htmlFor="sound-notifications" className="text-sm font-medium">
              Sound Notifications
            </Label>
          </div>
          <Switch
            id="sound-notifications"
            checked={soundNotificationsEnabled}
            onCheckedChange={setSoundNotificationsEnabled}
          />
        </div>

        {soundNotificationsEnabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume" className="text-sm font-medium">
                Notification Volume
              </Label>
              <span className="text-sm text-muted-foreground">{notificationVolume}%</span>
            </div>
            <div className="flex items-center gap-2">
              <VolumeX className="h-4 w-4 text-muted-foreground" />
              <Slider
                id="volume"
                min={0}
                max={100}
                step={5}
                value={[notificationVolume]}
                onValueChange={(value) => setNotificationVolume(value[0])}
                className="flex-1"
              />
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="outline" size="sm" onClick={handleTestSound} className="mt-2">
              Test Sound
            </Button>
          </div>
        )}

        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span>You will always receive in-app notifications for mentions and direct messages.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
