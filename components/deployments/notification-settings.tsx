"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  useDeploymentNotifications,
  type NotificationSettings,
  type NotificationChannel,
} from "@/context/deployment-notification-context"
import { BellRing, Mail, MessageSquare, Webhook, Send, RefreshCw, Save } from "lucide-react"

export function NotificationSettings() {
  const { settings, updateSettings, sendTestNotification } = useDeploymentNotifications()
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings)
  const [activeTab, setActiveTab] = useState<NotificationChannel>("in-app")
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    await updateSettings(localSettings)
    setIsSaving(false)
  }

  const handleTestNotification = async () => {
    setIsTesting(true)
    await sendTestNotification(activeTab)
    setIsTesting(false)
  }

  const handleToggleChannel = (channel: NotificationChannel, enabled: boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: {
          ...prev.channels[channel],
          enabled,
        },
      },
    }))
  }

  const handleTogglePreference = (preference: keyof typeof localSettings.preferences, value: boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value,
      },
    }))
  }

  const handleUpdateRecipients = (channel: NotificationChannel, recipients: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: {
          ...prev.channels[channel],
          recipients: recipients
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean),
        },
      },
    }))
  }

  const handleUpdateWebhookUrl = (url: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        webhook: {
          ...prev.channels.webhook,
          webhookUrl: url,
        },
      },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Notification Settings</CardTitle>
        <CardDescription>Configure how you want to be notified about deployment events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          defaultValue="in-app"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as NotificationChannel)}
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="in-app" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              In-App
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="slack" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Slack
            </TabsTrigger>
            <TabsTrigger value="webhook" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              Webhook
            </TabsTrigger>
          </TabsList>

          <TabsContent value="in-app" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications directly in the application</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="in-app-enabled"
                  checked={localSettings.channels["in-app"].enabled}
                  onCheckedChange={(checked) => handleToggleChannel("in-app", checked)}
                />
                <Label htmlFor="in-app-enabled">Enabled</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="email-enabled"
                  checked={localSettings.channels.email.enabled}
                  onCheckedChange={(checked) => handleToggleChannel("email", checked)}
                />
                <Label htmlFor="email-enabled">Enabled</Label>
              </div>
            </div>

            {localSettings.channels.email.enabled && (
              <div className="space-y-2">
                <Label htmlFor="email-recipients">Email Recipients</Label>
                <Input
                  id="email-recipients"
                  placeholder="email1@example.com, email2@example.com"
                  value={localSettings.channels.email.recipients?.join(", ") || ""}
                  onChange={(e) => handleUpdateRecipients("email", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Separate multiple email addresses with commas</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="slack" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Slack Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications in Slack channels</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="slack-enabled"
                  checked={localSettings.channels.slack.enabled}
                  onCheckedChange={(checked) => handleToggleChannel("slack", checked)}
                />
                <Label htmlFor="slack-enabled">Enabled</Label>
              </div>
            </div>

            {localSettings.channels.slack.enabled && (
              <div className="space-y-2">
                <Label htmlFor="slack-channels">Slack Channels</Label>
                <Input
                  id="slack-channels"
                  placeholder="#deployments, #alerts"
                  value={localSettings.channels.slack.recipients?.join(", ") || ""}
                  onChange={(e) => handleUpdateRecipients("slack", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Separate multiple channels with commas</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Webhook Notifications</h3>
                <p className="text-sm text-muted-foreground">Send notifications to a webhook endpoint</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="webhook-enabled"
                  checked={localSettings.channels.webhook.enabled}
                  onCheckedChange={(checked) => handleToggleChannel("webhook", checked)}
                />
                <Label htmlFor="webhook-enabled">Enabled</Label>
              </div>
            </div>

            {localSettings.channels.webhook.enabled && (
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://example.com/webhook"
                  value={localSettings.channels.webhook.webhookUrl || ""}
                  onChange={(e) => handleUpdateWebhookUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We'll send a POST request with the notification payload to this URL
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">Select which events you want to be notified about</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-deployment-success" className="flex items-center gap-2">
                  Deployment Success
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Success
                  </Badge>
                </Label>
                <Switch
                  id="pref-deployment-success"
                  checked={localSettings.preferences.deploymentSuccess}
                  onCheckedChange={(checked) => handleTogglePreference("deploymentSuccess", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-deployment-failure" className="flex items-center gap-2">
                  Deployment Failure
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    Failure
                  </Badge>
                </Label>
                <Switch
                  id="pref-deployment-failure"
                  checked={localSettings.preferences.deploymentFailure}
                  onCheckedChange={(checked) => handleTogglePreference("deploymentFailure", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-deployment-started" className="flex items-center gap-2">
                  Deployment Started
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Info
                  </Badge>
                </Label>
                <Switch
                  id="pref-deployment-started"
                  checked={localSettings.preferences.deploymentStarted}
                  onCheckedChange={(checked) => handleTogglePreference("deploymentStarted", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-rollback-initiated" className="flex items-center gap-2">
                  Rollback Initiated
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    Warning
                  </Badge>
                </Label>
                <Switch
                  id="pref-rollback-initiated"
                  checked={localSettings.preferences.rollbackInitiated}
                  onCheckedChange={(checked) => handleTogglePreference("rollbackInitiated", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-rollback-completed" className="flex items-center gap-2">
                  Rollback Completed
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Success
                  </Badge>
                </Label>
                <Switch
                  id="pref-rollback-completed"
                  checked={localSettings.preferences.rollbackCompleted}
                  onCheckedChange={(checked) => handleTogglePreference("rollbackCompleted", checked)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-canary-created" className="flex items-center gap-2">
                  Canary Deployment Created
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Info
                  </Badge>
                </Label>
                <Switch
                  id="pref-canary-created"
                  checked={localSettings.preferences.canaryDeploymentCreated}
                  onCheckedChange={(checked) => handleTogglePreference("canaryDeploymentCreated", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-canary-promoted" className="flex items-center gap-2">
                  Canary Deployment Promoted
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Success
                  </Badge>
                </Label>
                <Switch
                  id="pref-canary-promoted"
                  checked={localSettings.preferences.canaryDeploymentPromoted}
                  onCheckedChange={(checked) => handleTogglePreference("canaryDeploymentPromoted", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-canary-failed" className="flex items-center gap-2">
                  Canary Deployment Failed
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    Failure
                  </Badge>
                </Label>
                <Switch
                  id="pref-canary-failed"
                  checked={localSettings.preferences.canaryDeploymentFailed}
                  onCheckedChange={(checked) => handleTogglePreference("canaryDeploymentFailed", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pref-performance-alert" className="flex items-center gap-2">
                  Performance Alerts
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    Warning
                  </Badge>
                </Label>
                <Switch
                  id="pref-performance-alert"
                  checked={localSettings.preferences.performanceAlert}
                  onCheckedChange={(checked) => handleTogglePreference("performanceAlert", checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={handleTestNotification}
          disabled={!localSettings.channels[activeTab].enabled || isTesting}
        >
          {isTesting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Test {activeTab} Notification
            </>
          )}
        </Button>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
