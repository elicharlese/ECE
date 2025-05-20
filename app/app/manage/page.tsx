"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronRight,
  Code,
  Database,
  GitBranch,
  Globe,
  Layers,
  Rocket,
  Server,
  Settings,
  Shield,
  Terminal,
} from "lucide-react"
import { AppOverview } from "@/components/app-management/app-overview"
import { AppDeployments } from "@/components/app-management/app-deployments"
import { AppMonitoring } from "@/components/app-management/app-monitoring"
import { AppSettings } from "@/components/app-management/app-settings"
import { AppUsers } from "@/components/app-management/app-users"
import { AppLogs } from "@/components/app-management/app-logs"
import { AppBackups } from "@/components/app-management/app-backups"
import { AppIntegrations } from "@/components/app-management/app-integrations"
import { AppSelector } from "@/components/app-management/app-selector"
import { AppNotFound } from "@/components/app-management/app-not-found"

// Mock data for demonstration
import { mockApps } from "@/lib/mock-app-data"

export default function AppManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAppId, setSelectedAppId] = useState<string | null>(mockApps[0]?.id || null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  // Get the selected app
  const selectedApp = selectedAppId ? mockApps.find((app) => app.id === selectedAppId) : null

  const handleAppChange = (appId: string) => {
    setIsLoading(true)
    setSelectedAppId(appId)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      setActiveTab("overview")
    }, 500)
  }

  const handleRefresh = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "App refreshed",
        description: "App information has been updated.",
      })
    }, 1000)
  }

  if (!selectedApp) {
    return <AppNotFound onCreateNew={() => router.push("/app/order")} />
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">App Management</h1>
          <p className="text-muted-foreground">Monitor and manage your applications</p>
        </div>
        <div className="flex items-center gap-2">
          <AppSelector apps={mockApps} selectedAppId={selectedAppId} onAppChange={handleAppChange} />
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    {getAppTypeIcon(selectedApp?.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedApp?.name || "App"}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStatusVariant(selectedApp?.status)}>{selectedApp?.status || "Unknown"}</Badge>
                      <span className="text-sm text-muted-foreground">ID: {selectedApp?.id || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedApp?.url || "#"} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Visit App
                    </a>
                  </Button>
                  <Button size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-1">
              <p className="text-sm text-muted-foreground">{selectedApp.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {selectedApp?.createdAt ? formatDate(selectedApp.createdAt) : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Deployed</p>
                  <p className="text-sm font-medium">
                    {selectedApp?.lastDeployedAt ? formatDate(selectedApp.lastDeployedAt) : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Version</p>
                  <p className="text-sm font-medium">{selectedApp?.version || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Framework</p>
                  <p className="text-sm font-medium">{selectedApp?.framework || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-9 px-2"
                    onClick={() => {
                      toast({
                        title: action.label,
                        description: `${action.label} action triggered.`,
                      })
                    }}
                  >
                    {action.icon}
                    <span className="ml-2 text-sm">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">App Health</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">CPU Usage</span>
                    <span className="text-xs font-medium">{selectedApp?.metrics?.cpu || 0}%</span>
                  </div>
                  <Progress value={selectedApp?.metrics?.cpu || 0} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Memory Usage</span>
                    <span className="text-xs font-medium">{selectedApp?.metrics?.memory || 0}%</span>
                  </div>
                  <Progress value={selectedApp?.metrics?.memory || 0} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Storage Usage</span>
                    <span className="text-xs font-medium">{selectedApp?.metrics?.storage || 0}%</span>
                  </div>
                  <Progress value={selectedApp?.metrics?.storage || 0} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Uptime</span>
                    <span className="text-xs font-medium">{selectedApp?.metrics?.uptime || 0}%</span>
                  </div>
                  <Progress value={selectedApp?.metrics?.uptime || 0} className="h-1.5" />
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => setActiveTab("monitoring")}>
                View Detailed Metrics
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="backups">Backups</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <AppOverview app={selectedApp} />
            </TabsContent>

            <TabsContent value="deployments">
              <AppDeployments app={selectedApp} />
            </TabsContent>

            <TabsContent value="monitoring">
              <AppMonitoring app={selectedApp} />
            </TabsContent>

            <TabsContent value="settings">
              <AppSettings app={selectedApp} />
            </TabsContent>

            <TabsContent value="users">
              <AppUsers app={selectedApp} />
            </TabsContent>

            <TabsContent value="logs">
              <AppLogs app={selectedApp} />
            </TabsContent>

            <TabsContent value="backups">
              <AppBackups app={selectedApp} />
            </TabsContent>

            <TabsContent value="integrations">
              <AppIntegrations app={selectedApp} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function getStatusVariant(status: string | undefined): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return "outline"

  switch (status.toLowerCase()) {
    case "running":
      return "default"
    case "deploying":
      return "secondary"
    case "stopped":
      return "destructive"
    default:
      return "outline"
  }
}

function getAppTypeIcon(type: string | undefined) {
  if (!type) return <Layers className="h-6 w-6 text-primary" />

  switch (type.toLowerCase()) {
    case "web":
      return <Globe className="h-6 w-6 text-primary" />
    case "mobile":
      return <Smartphone className="h-6 w-6 text-primary" />
    case "api":
      return <Code className="h-6 w-6 text-primary" />
    case "backend":
      return <Server className="h-6 w-6 text-primary" />
    default:
      return <Layers className="h-6 w-6 text-primary" />
  }
}

// Quick actions data
const quickActions = [
  { icon: <Rocket className="h-4 w-4" />, label: "Deploy" },
  { icon: <GitBranch className="h-4 w-4" />, label: "View Repository" },
  { icon: <Terminal className="h-4 w-4" />, label: "Console" },
  { icon: <Database className="h-4 w-4" />, label: "Database" },
  { icon: <Shield className="h-4 w-4" />, label: "Security" },
]

// Add missing Smartphone icon
function Smartphone({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}
