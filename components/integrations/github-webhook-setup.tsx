"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Copy, Info, RefreshCw, Save } from "lucide-react"

interface GitHubWebhookSetupProps {
  onSave?: (settings: {
    webhookUrl: string
    webhookSecret: string
    events: string[]
  }) => void
}

export function GitHubWebhookSetup({ onSave }: GitHubWebhookSetupProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingSecret, setIsGeneratingSecret] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [webhookSecret, setWebhookSecret] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["push", "pull_request", "issues", "workflow_run"])

  // Available GitHub webhook events
  const availableEvents = [
    { id: "push", label: "Push events" },
    { id: "pull_request", label: "Pull request events" },
    { id: "issues", label: "Issue events" },
    { id: "workflow_run", label: "Workflow run events" },
    { id: "create", label: "Branch or tag creation" },
    { id: "delete", label: "Branch or tag deletion" },
    { id: "release", label: "Release events" },
    { id: "star", label: "Repository stars" },
    { id: "fork", label: "Repository forks" },
    { id: "watch", label: "Repository watches" },
  ]

  const handleGenerateSecret = () => {
    setIsGeneratingSecret(true)

    // Generate a random string for the webhook secret
    const randomBytes = new Uint8Array(32)
    window.crypto.getRandomValues(randomBytes)
    const secret = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    setTimeout(() => {
      setWebhookSecret(secret)
      setIsGeneratingSecret(false)

      toast({
        title: "Secret Generated",
        description: "A new webhook secret has been generated.",
      })
    }, 500)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl || window.location.origin + "/api/webhooks/github")
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
    setIsSaving(true)

    // Validate inputs
    if (!webhookSecret) {
      toast({
        title: "Missing Secret",
        description: "Please generate a webhook secret.",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    if (selectedEvents.length === 0) {
      toast({
        title: "No Events Selected",
        description: "Please select at least one event type.",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    // In a real app, you would save these settings to your backend
    setTimeout(() => {
      onSave?.({
        webhookUrl: webhookUrl || window.location.origin + "/api/webhooks/github",
        webhookSecret,
        events: selectedEvents,
      })

      toast({
        title: "Settings Saved",
        description: "Your webhook settings have been saved.",
      })

      setIsSaving(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Webhook Setup</CardTitle>
        <CardDescription>Configure webhooks to receive real-time GitHub events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to set up GitHub webhooks</AlertTitle>
          <AlertDescription>
            <ol className="list-decimal pl-4 space-y-2 mt-2">
              <li>Go to your GitHub repository settings and select "Webhooks"</li>
              <li>Click "Add webhook"</li>
              <li>Enter the webhook URL shown below</li>
              <li>Enter the generated secret in the "Secret" field</li>
              <li>Select "Content type" as "application/json"</li>
              <li>Choose which events you want to receive</li>
              <li>Click "Add webhook" to save</li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                placeholder={window.location.origin + "/api/webhooks/github"}
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
              This is the URL you'll provide to GitHub when setting up the webhook.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-secret">Webhook Secret</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-secret"
                type="password"
                placeholder="••••••••••••••••••••••••••••••••"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="flex-1"
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
              This secret is used to verify that webhook events are coming from GitHub.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Events to Receive</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              {availableEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`event-${event.id}`}
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEvents([...selectedEvents, event.id])
                      } else {
                        setSelectedEvents(selectedEvents.filter((e) => e !== event.id))
                      }
                    }}
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
      <CardFooter className="flex justify-end border-t pt-4">
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
      </CardFooter>
    </Card>
  )
}
