"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { GitHubWebhookSetup } from "./github-webhook-setup"
import { VercelWebhookSetup } from "./vercel-webhook-setup"
import { VercelLogoIcon } from "@radix-ui/react-icons"
import { CheckCircle2, RefreshCw, Save, Github } from "lucide-react"

interface IntegrationSettingsProps {
  onSave?: (settings: {
    github: {
      enabled: boolean
      token: string
      repositories: string[]
      notifications: {
        newCommits: boolean
        newPullRequests: boolean
        newIssues: boolean
        ciFailures: boolean
      }
      webhook: {
        enabled: boolean
        url: string
        secret: string
        events: string[]
      }
    }
    vercel: {
      enabled: boolean
      token: string
      projects: string[]
      notifications: {
        deploymentSuccess: boolean
        deploymentFailure: boolean
        buildStart: boolean
        domainVerification: boolean
      }
      webhook: {
        enabled: boolean
        url: string
        secret: string
        events: string[]
      }
    }
  }) => void
}

export function IntegrationSettings({ onSave }: IntegrationSettingsProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("github")
  const [activeGitHubTab, setActiveGitHubTab] = useState("api")
  const [activeVercelTab, setActiveVercelTab] = useState("api")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [settings, setSettings] = useState({
    github: {
      enabled: false,
      token: "",
      repositories: [],
      notifications: {
        newCommits: true,
        newPullRequests: true,
        newIssues: true,
        ciFailures: true,
      },
      webhook: {
        enabled: false,
        url: "",
        secret: "",
        events: [],
      },
    },
    vercel: {
      enabled: false,
      token: "",
      projects: [],
      notifications: {
        deploymentSuccess: true,
        deploymentFailure: true,
        buildStart: false,
        domainVerification: true,
      },
      webhook: {
        enabled: false,
        url: "",
        secret: "",
        events: [],
      },
    },
  })

  const handleConnect = (platform: "github" | "vercel") => {
    setIsConnecting(true)

    // Simulate API call
    setTimeout(() => {
      setSettings((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          enabled: true,
        },
      }))

      toast({
        title: "Connected Successfully",
        description: `Your ${platform === "github" ? "GitHub" : "Vercel"} account has been connected.`,
      })

      setIsConnecting(false)
    }, 1500)
  }

  const handleDisconnect = (platform: "github" | "vercel") => {
    setSettings((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        enabled: false,
      },
    }))

    toast({
      title: "Disconnected",
      description: `Your ${platform === "github" ? "GitHub" : "Vercel"} account has been disconnected.`,
    })
  }

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      onSave?.(settings)

      toast({
        title: "Settings Saved",
        description: "Your integration settings have been updated.",
      })

      setIsSaving(false)
    }, 1000)
  }

  const handleTokenChange = (platform: "github" | "vercel", value: string) => {
    setSettings((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        token: value,
      },
    }))
  }

  const handleNotificationToggle = (platform: "github" | "vercel", key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        notifications: {
          ...prev[platform].notifications,
          [key]: value,
        },
      },
    }))
  }

  const handleSaveGitHubWebhookSettings = (webhookSettings: {
    webhookUrl: string
    webhookSecret: string
    events: string[]
  }) => {
    setSettings((prev) => ({
      ...prev,
      github: {
        ...prev.github,
        webhook: {
          enabled: true,
          url: webhookSettings.webhookUrl,
          secret: webhookSettings.webhookSecret,
          events: webhookSettings.events,
        },
      },
    }))
  }

  const handleSaveVercelWebhookSettings = (webhookSettings: {
    webhookUrl: string
    webhookSecret: string
    events: string[]
  }) => {
    setSettings((prev) => ({
      ...prev,
      vercel: {
        ...prev.vercel,
        webhook: {
          enabled: true,
          url: webhookSettings.webhookUrl,
          secret: webhookSettings.webhookSecret,
          events: webhookSettings.events,
        },
      },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
        <CardDescription>Configure your GitHub and Vercel integrations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="github" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="vercel" className="flex items-center gap-2">
              <VercelLogoIcon className="h-4 w-4" />
              Vercel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="github" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">GitHub Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your GitHub repositories to monitor code changes
                </p>
              </div>
              <div className="flex items-center gap-2">
                {settings.github.enabled ? (
                  <>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Connected
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect("github")}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleConnect("github")} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect GitHub"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {settings.github.enabled ? (
              <>
                <Tabs defaultValue="api" value={activeGitHubTab} onValueChange={setActiveGitHubTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="api">API Integration</TabsTrigger>
                    <TabsTrigger value="webhook">Webhook Integration</TabsTrigger>
                  </TabsList>

                  <TabsContent value="api" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="github-token">GitHub Personal Access Token</Label>
                      <Input
                        id="github-token"
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        value={settings.github.token}
                        onChange={(e) => handleTokenChange("github", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Requires repo, read:user, and workflow scopes.{" "}
                        <a
                          href="https://github.com/settings/tokens"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Generate token
                        </a>
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Notification Settings</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="github-new-commits" className="cursor-pointer">
                            New commits
                          </Label>
                          <Switch
                            id="github-new-commits"
                            checked={settings.github.notifications.newCommits}
                            onCheckedChange={(value) => handleNotificationToggle("github", "newCommits", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="github-new-prs" className="cursor-pointer">
                            New pull requests
                          </Label>
                          <Switch
                            id="github-new-prs"
                            checked={settings.github.notifications.newPullRequests}
                            onCheckedChange={(value) => handleNotificationToggle("github", "newPullRequests", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="github-new-issues" className="cursor-pointer">
                            New issues
                          </Label>
                          <Switch
                            id="github-new-issues"
                            checked={settings.github.notifications.newIssues}
                            onCheckedChange={(value) => handleNotificationToggle("github", "newIssues", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="github-ci-failures" className="cursor-pointer">
                            CI/CD failures
                          </Label>
                          <Switch
                            id="github-ci-failures"
                            checked={settings.github.notifications.ciFailures}
                            onCheckedChange={(value) => handleNotificationToggle("github", "ciFailures", value)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="webhook" className="space-y-4">
                    <GitHubWebhookSetup onSave={handleSaveGitHubWebhookSettings} />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="bg-muted/50 p-8 rounded-lg flex flex-col items-center justify-center text-center">
                <Github className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Connect your GitHub account</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Monitor your repositories, track issues, pull requests, and get notified about important code changes.
                </p>
                <Button onClick={() => handleConnect("github")} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect GitHub"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="vercel" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Vercel Integration</h3>
                <p className="text-sm text-muted-foreground">Connect your Vercel projects to monitor deployments</p>
              </div>
              <div className="flex items-center gap-2">
                {settings.vercel.enabled ? (
                  <>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Connected
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect("vercel")}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleConnect("vercel")} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect Vercel"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {settings.vercel.enabled ? (
              <>
                <Tabs defaultValue="api" value={activeVercelTab} onValueChange={setActiveVercelTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="api">API Integration</TabsTrigger>
                    <TabsTrigger value="webhook">Webhook Integration</TabsTrigger>
                  </TabsList>

                  <TabsContent value="api" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vercel-token">Vercel API Token</Label>
                      <Input
                        id="vercel-token"
                        type="password"
                        placeholder="vercel_xxxxxxxxxxxxxxxxxxxx"
                        value={settings.vercel.token}
                        onChange={(e) => handleTokenChange("vercel", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Create a token with read and deployments scopes.{" "}
                        <a
                          href="https://vercel.com/account/tokens"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Generate token
                        </a>
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Notification Settings</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vercel-deployment-success" className="cursor-pointer">
                            Deployment success
                          </Label>
                          <Switch
                            id="vercel-deployment-success"
                            checked={settings.vercel.notifications.deploymentSuccess}
                            onCheckedChange={(value) => handleNotificationToggle("vercel", "deploymentSuccess", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vercel-deployment-failure" className="cursor-pointer">
                            Deployment failure
                          </Label>
                          <Switch
                            id="vercel-deployment-failure"
                            checked={settings.vercel.notifications.deploymentFailure}
                            onCheckedChange={(value) => handleNotificationToggle("vercel", "deploymentFailure", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vercel-build-start" className="cursor-pointer">
                            Build start
                          </Label>
                          <Switch
                            id="vercel-build-start"
                            checked={settings.vercel.notifications.buildStart}
                            onCheckedChange={(value) => handleNotificationToggle("vercel", "buildStart", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vercel-domain-verification" className="cursor-pointer">
                            Domain verification
                          </Label>
                          <Switch
                            id="vercel-domain-verification"
                            checked={settings.vercel.notifications.domainVerification}
                            onCheckedChange={(value) => handleNotificationToggle("vercel", "domainVerification", value)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="webhook" className="space-y-4">
                    <VercelWebhookSetup onSave={handleSaveVercelWebhookSettings} />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="bg-muted/50 p-8 rounded-lg flex flex-col items-center justify-center text-center">
                <VercelLogoIcon className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Connect your Vercel account</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Monitor your deployments, get notified about build status, and manage your projects directly from the
                  dashboard.
                </p>
                <Button onClick={() => handleConnect("vercel")} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Vercel"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">Cancel</Button>
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
