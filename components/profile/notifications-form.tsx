"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { LoadingButton } from "@/components/ui/loading-button"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { updateUserSettings, useUserSettings } from "@/lib/user-profile"
import { useAutosave } from "@/hooks/use-autosave"
import { AutosaveIndicator } from "@/components/ui/autosave-indicator"

export function NotificationsForm() {
  const { user } = useAuth()
  const { isDemoMode } = useDemo()
  const { toast } = useToast()
  const userSettings = useUserSettings()
  const [isLoading, setIsLoading] = useState(false)

  // Email notifications
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [emailSecurity, setEmailSecurity] = useState(true)
  const [emailMarketing, setEmailMarketing] = useState(false)

  // Push notifications
  const [pushNotifications, setPushNotifications] = useState(true)
  const [pushMessages, setPushMessages] = useState(true)
  const [pushUpdates, setPushUpdates] = useState(true)
  const [pushSecurity, setPushSecurity] = useState(true)

  // App notifications
  const [marketplaceUpdates, setMarketplaceUpdates] = useState(true)
  const [projectUpdates, setProjectUpdates] = useState(true)
  const [transactionAlerts, setTransactionAlerts] = useState(true)

  // Load user settings
  useEffect(() => {
    if (userSettings) {
      setEmailNotifications(userSettings.emailNotifications ?? true)
      setEmailUpdates(userSettings.emailUpdates ?? true)
      setEmailSecurity(userSettings.emailSecurity ?? true)
      setEmailMarketing(userSettings.emailMarketing ?? false)

      setPushNotifications(userSettings.pushNotifications ?? true)
      setPushMessages(userSettings.pushMessages ?? true)
      setPushUpdates(userSettings.pushUpdates ?? true)
      setPushSecurity(userSettings.pushSecurity ?? true)

      setMarketplaceUpdates(userSettings.marketplaceUpdates ?? true)
      setProjectUpdates(userSettings.projectUpdates ?? true)
      setTransactionAlerts(userSettings.transactionAlerts ?? true)
    }
  }, [userSettings])

  const notificationSettings = {
    emailNotifications,
    emailUpdates,
    emailSecurity,
    emailMarketing,
    pushNotifications,
    pushMessages,
    pushUpdates,
    pushSecurity,
    marketplaceUpdates,
    projectUpdates,
    transactionAlerts,
  }

  const saveNotifications = async (data: typeof notificationSettings) => {
    if (isDemoMode) {
      // Simulate API call for demo mode
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return
    }

    if (user) {
      // Actually update the user settings
      await updateUserSettings(user.id, data)
    }
  }

  const { status: autosaveStatus, forceSave } = useAutosave({
    data: notificationSettings,
    onSave: saveNotifications,
    debounceMs: 1000,
  })

  const handleSaveNotifications = async () => {
    setIsLoading(true)

    try {
      await forceSave()

      toast({
        title: "Notification preferences saved",
        description: "Your notification settings have been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Notification settings update error:", error)
      toast({
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <AutosaveIndicator status={autosaveStatus} />
      </div>

      <div>
        <h3 className="text-lg font-medium">Email Notifications</h3>
        <p className="text-sm text-muted-foreground mb-4">Configure how you receive email notifications.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">All email notifications</p>
              <p className="text-sm text-muted-foreground">Enable or disable all email notifications.</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Project updates</p>
              <p className="text-sm text-muted-foreground">Receive updates about projects you're involved with.</p>
            </div>
            <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} disabled={!emailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Security alerts</p>
              <p className="text-sm text-muted-foreground">Get notified about security events like password changes.</p>
            </div>
            <Switch checked={emailSecurity} onCheckedChange={setEmailSecurity} disabled={!emailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Marketing emails</p>
              <p className="text-sm text-muted-foreground">Receive promotional emails and special offers.</p>
            </div>
            <Switch checked={emailMarketing} onCheckedChange={setEmailMarketing} disabled={!emailNotifications} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Push Notifications</h3>
        <p className="text-sm text-muted-foreground mb-4">Configure how you receive push notifications.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">All push notifications</p>
              <p className="text-sm text-muted-foreground">Enable or disable all push notifications.</p>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Messages</p>
              <p className="text-sm text-muted-foreground">Get notified when you receive a message.</p>
            </div>
            <Switch checked={pushMessages} onCheckedChange={setPushMessages} disabled={!pushNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Project updates</p>
              <p className="text-sm text-muted-foreground">Receive updates about projects you're involved with.</p>
            </div>
            <Switch checked={pushUpdates} onCheckedChange={setPushUpdates} disabled={!pushNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Security alerts</p>
              <p className="text-sm text-muted-foreground">Get notified about security events.</p>
            </div>
            <Switch checked={pushSecurity} onCheckedChange={setPushSecurity} disabled={!pushNotifications} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Application Notifications</h3>
        <p className="text-sm text-muted-foreground mb-4">Configure in-app notification preferences.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Marketplace updates</p>
              <p className="text-sm text-muted-foreground">Get notified about new products and updates.</p>
            </div>
            <Switch checked={marketplaceUpdates} onCheckedChange={setMarketplaceUpdates} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Project updates</p>
              <p className="text-sm text-muted-foreground">Receive updates on projects you've backed.</p>
            </div>
            <Switch checked={projectUpdates} onCheckedChange={setProjectUpdates} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Transaction alerts</p>
              <p className="text-sm text-muted-foreground">Get notified about transactions in your account.</p>
            </div>
            <Switch checked={transactionAlerts} onCheckedChange={setTransactionAlerts} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <LoadingButton
          onClick={handleSaveNotifications}
          isLoading={isLoading}
          loadingText="Saving..."
          className="bg-primary hover:bg-primary/90"
        >
          Save Preferences
        </LoadingButton>
      </div>
    </div>
  )
}
