"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Copy, RefreshCw, Save, AlertTriangle } from "lucide-react"
import crypto from "crypto"

interface VercelWebhookSetupProps {
  onSave: (settings: {
    webhookUrl: string
    webhookSecret: string
    events: string[]
  }) => void
}

export function VercelWebhookSetup({ onSave }: VercelWebhookSetupProps) {
  const { toast } = useToast()
  const [webhookUrl, setWebhookUrl] = useState(`${window.location.origin}/api/webhooks/vercel`)
  const [webhookSecret, setWebhookSecret] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "deployment.created",
    "deployment.ready",
    "deployment.error",
  ])
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingSecret, setIsGeneratingSecret] = useState(false)

  const availableEvents = [
    { id: "deployment.created", label: "Deployment Started" },
    { id: "deployment.ready", label: "Deployment Successful" },
    { id: "deployment.error", label: "Deployment Failed" },
    { id: "deployment.canceled", label: "Deployment Canceled" },
    { id: "domain.created", label: "Domain Added" },
    { id: "domain.deleted", label: "Domain Removed" },
    { id: "domain.purchased", label: "Domain Purchased" },
    { id: "domain.tls-enabled", label: "HTTPS Enabled" },
  ]

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  const handleGenerateSecret = () => {
    setIsGeneratingSecret(true)

    // Simulate API delay
    setTimeout(() => {
      // Generate a random string for the webhook secret
      const secret = crypto.randomBytes(32).toString("hex")
      setWebhookSecret(secret)
      setIsGeneratingSecret(false)

      toast({
        title: "Secret Generated",
        description: "A new webhook secret has been generated.",
      })
    }, 500)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    toast({
      title: "URL Copied",
      description: "Webhook URL copied to clipboard.",
    })
  }

  const handleCopySecret = () => {
    navigator.clipboard.writeText(webhookSecret)
    toast({
      title: "Secret Copied",
      description: "Webhook secret copied to clipboard.",
    })
  }

  const handleSave = () => {
    if (!webhookSecret) {
      toast({
        title: "Missing Secret",
        description: "Please generate a webhook secret before saving.",
        variant: "destructive",
      })
      return
    }

    if (selectedEvents.length === 0) {
      toast({
        title: "No Events Selected",
        description: "Please select at least one event to receive.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // Simulate API delay
    setTimeout(() => {
      onSave({
        webhookUrl,
        webhookSecret,
        events: selectedEvents,
      })

      setIsSaving(false)

      toast({
        title: "Webhook Settings Saved",
        description: "Your Vercel webhook settings have been saved.",
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vercel Webhook Setup</CardTitle>
        <CardDescription>Configure webhooks to receive real-time events from Vercel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You'll need to add this webhook in your Vercel project settings to start receiving events.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleCopyUrl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This is the URL you'll provide to Vercel when setting up the webhook.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-secret">Webhook Secret</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-secret"
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="flex-1"
                placeholder="••••••••••••••••••••••••••••••••"
              />
              <Button variant="outline" onClick={handleCopySecret} disabled={!webhookSecret}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" onClick={handleGenerateSecret} disabled={isGeneratingSecret}>
                {isGeneratingSecret ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This secret is used to verify that webhook requests are coming from Vercel.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Events to Receive</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`event-${event.id}`}
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={() => handleEventToggle(event.id)}
                  />
                  <Label htmlFor={`event-${event.id}`} className="cursor-pointer">
                    {event.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="space-y-4 w-full">
          <Separator />
          <h3 className="font-medium">How to set up a Vercel webhook:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Copy the webhook URL and secret from above</li>
            <li>Go to your Vercel project settings and select the "Webhooks" tab</li>
            <li>Click "Create Webhook" and paste the URL and secret</li>
            <li>Select the events you want to receive</li>
            <li>Click "Create" to save the webhook</li>
          </ol>
        </div>
        <div className="flex justify-end w-full pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Webhook Settings
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
