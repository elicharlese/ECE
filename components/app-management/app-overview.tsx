"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Clock,
  Code,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Globe,
  History,
  Info,
  MessageSquare,
  Server,
  Shield,
  Tag,
  Users,
} from "lucide-react"
import { AppVersionHistory } from "./app-version-history"
import { AppResourceUsage } from "./app-resource-usage"

interface AppOverviewProps {
  app: any // Using any for simplicity, but should be properly typed
}

export function AppOverview({ app }: AppOverviewProps) {
  const [activeTab, setActiveTab] = useState("summary")

  // Ensure app and its properties exist to prevent errors
  if (!app) {
    return <div className="p-4 text-center">No app data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <GitBranch className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{app.repository?.branch || "main"}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Default
                </Badge>
              </div>
              <div className="flex items-center">
                <GitCommit className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm truncate">{app.repository?.lastCommit || "No commits yet"}</span>
              </div>
              <div className="flex items-center">
                <GitPullRequest className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">{app.repository?.pullRequests || 0} open PRs</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <a href={app.repository?.url || "#"} target="_blank" rel="noopener noreferrer">
                  <Code className="mr-2 h-4 w-4" />
                  View Repository
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deployment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">Production</span>
                </div>
                <Badge variant={app.deployment?.status === "success" ? "default" : "destructive"} className="text-xs">
                  {app.deployment?.status || "Unknown"}
                </Badge>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">
                  {app.lastDeployedAt ? `Deployed ${formatTimeAgo(app.lastDeployedAt)}` : "Not deployed yet"}
                </span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">v{app.version || "0.0.1"}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Activity className="mr-2 h-4 w-4" />
                View Deployment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">CPU Usage</span>
                  <span className="text-xs font-medium">{app.metrics?.cpu || 0}%</span>
                </div>
                <Progress value={app.metrics?.cpu || 0} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Memory Usage</span>
                  <span className="text-xs font-medium">{app.metrics?.memory || 0}%</span>
                </div>
                <Progress value={app.metrics?.memory || 0} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Storage Usage</span>
                  <span className="text-xs font-medium">{app.metrics?.storage || 0}%</span>
                </div>
                <Progress value={app.metrics?.storage || 0} className="h-1.5" />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-1">
                <Server className="mr-2 h-4 w-4" />
                View Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
          <TabsTrigger value="resources">Resource Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">App Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Framework</dt>
                    <dd className="text-sm font-medium">{app.framework || "Unknown"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Runtime</dt>
                    <dd className="text-sm font-medium">{app.runtime || "Node.js"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Region</dt>
                    <dd className="text-sm font-medium">{app.region || "us-east-1"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Environment</dt>
                    <dd className="text-sm font-medium">{app.environment || "Production"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Created</dt>
                    <dd className="text-sm font-medium">{app.createdAt ? formatDate(app.createdAt) : "Unknown"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Last Updated</dt>
                    <dd className="text-sm font-medium">{app.updatedAt ? formatDate(app.updatedAt) : "Unknown"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(app.recentActivity || []).slice(0, 4).map((activity: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5">{getActivityIcon(activity.type || "info")}</div>
                      <div>
                        <p className="text-sm">{activity.message || "Activity logged"}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp ? formatTimeAgo(activity.timestamp) : "Recently"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!app.recentActivity || app.recentActivity.length === 0) && (
                    <div className="text-sm text-muted-foreground text-center py-4">No recent activity</div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">App Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(app.endpoints || []).map((endpoint: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-1 border-b last:border-0">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {endpoint.method || "GET"}
                        </Badge>
                        <span className="text-sm font-mono">{endpoint.path || "/api"}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={endpoint.status === "active" ? "default" : "secondary"} className="text-xs">
                          {endpoint.status || "inactive"}
                        </Badge>
                        <Button variant="ghost" size="sm" className="ml-2 h-7 w-7 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!app.endpoints || app.endpoints.length === 0) && (
                    <div className="text-sm text-muted-foreground text-center py-4">No endpoints configured</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="versions">
          <AppVersionHistory app={app} />
        </TabsContent>

        <TabsContent value="resources">
          <AppResourceUsage app={app} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            <Button variant="ghost" size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">API Requests (24h)</p>
              <p className="text-2xl font-bold">{formatNumber(app.stats?.apiRequests || 0)}</p>
              <p className="text-xs text-green-500">+{app.stats?.apiRequestsChange || 0}% from yesterday</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-bold">{app.stats?.errorRate || 0}%</p>
              <p className="text-xs text-red-500">+{app.stats?.errorRateChange || 0}% from yesterday</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              <p className="text-2xl font-bold">{app.stats?.responseTime || 0}ms</p>
              <p className="text-xs text-green-500">-{app.stats?.responseTimeChange || 0}% from yesterday</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{formatNumber(app.stats?.activeUsers || 0)}</p>
              <p className="text-xs text-green-500">+{app.stats?.activeUsersChange || 0}% from yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>
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

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case "deployment":
      return <Activity className="h-4 w-4 text-blue-500" />
    case "commit":
      return <GitCommit className="h-4 w-4 text-green-500" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />
    case "user":
      return <Users className="h-4 w-4 text-purple-500" />
    case "database":
      return <Database className="h-4 w-4 text-orange-500" />
    case "security":
      return <Shield className="h-4 w-4 text-red-500" />
    case "message":
      return <MessageSquare className="h-4 w-4 text-gray-500" />
    case "history":
      return <History className="h-4 w-4 text-gray-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}
