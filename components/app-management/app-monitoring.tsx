"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, BarChart3, Clock, Download, LineChart, RefreshCw, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AppMonitoringProps {
  app: any // Using any for simplicity, but should be properly typed
}

export function AppMonitoring({ app }: AppMonitoringProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("performance")
  const [timeRange, setTimeRange] = useState("24h")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Metrics refreshed",
        description: "Monitoring data has been updated.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Monitoring</h2>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{app.metrics.cpu}%</div>
              <Badge
                variant={app.metrics.cpu > 80 ? "destructive" : app.metrics.cpu > 60 ? "secondary" : "default"}
                className="text-xs"
              >
                {app.metrics.cpu > 80 ? "High" : app.metrics.cpu > 60 ? "Medium" : "Normal"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {app.metrics.cpuTrend > 0
                ? `+${app.metrics.cpuTrend}% from previous period`
                : `${app.metrics.cpuTrend}% from previous period`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{app.metrics.memory}%</div>
              <Badge
                variant={app.metrics.memory > 80 ? "destructive" : app.metrics.memory > 60 ? "secondary" : "default"}
                className="text-xs"
              >
                {app.metrics.memory > 80 ? "High" : app.metrics.memory > 60 ? "Medium" : "Normal"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {app.metrics.memoryTrend > 0
                ? `+${app.metrics.memoryTrend}% from previous period`
                : `${app.metrics.memoryTrend}% from previous period`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{app.stats.responseTime}ms</div>
              <Badge
                variant={
                  app.stats.responseTime > 300 ? "destructive" : app.stats.responseTime > 150 ? "secondary" : "default"
                }
                className="text-xs"
              >
                {app.stats.responseTime > 300 ? "Slow" : app.stats.responseTime > 150 ? "Average" : "Fast"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {app.stats.responseTimeChange > 0
                ? `+${app.stats.responseTimeChange}% from previous period`
                : `${app.stats.responseTimeChange}% from previous period`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{app.stats.errorRate}%</div>
              <Badge
                variant={app.stats.errorRate > 5 ? "destructive" : app.stats.errorRate > 1 ? "secondary" : "default"}
                className="text-xs"
              >
                {app.stats.errorRate > 5 ? "High" : app.stats.errorRate > 1 ? "Medium" : "Low"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {app.stats.errorRateChange > 0
                ? `+${app.stats.errorRateChange}% from previous period`
                : `${app.stats.errorRateChange}% from previous period`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Monitor your application's performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
                <div className="text-center">
                  <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Performance chart would render here</p>
                  <p className="text-xs text-muted-foreground mt-1">Showing data for the last {timeRange}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                  <p className="text-2xl font-bold">{app.stats.responseTime}ms</p>
                  <p className="text-xs text-green-500">-{app.stats.responseTimeChange}% from previous period</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Requests/Second</p>
                  <p className="text-2xl font-bold">{app.stats.requestsPerSecond}</p>
                  <p className="text-xs text-green-500">+{app.stats.requestsPerSecondChange}% from previous period</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">P95 Response Time</p>
                  <p className="text-2xl font-bold">{app.stats.p95ResponseTime}ms</p>
                  <p className="text-xs text-red-500">+{app.stats.p95ResponseTimeChange}% from previous period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Error Tracking</CardTitle>
              <CardDescription>Monitor and analyze application errors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {app.errors.map((error: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{error.message}</h3>
                          <Badge variant="outline" className="text-xs">
                            {error.count} occurrences
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          First seen: {formatDate(error.firstSeen)} • Last seen: {formatDate(error.lastSeen)}
                        </p>
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <pre className="text-xs overflow-x-auto">{error.stack}</pre>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Request Analytics</CardTitle>
              <CardDescription>Analyze API requests and endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20 mb-6">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Request volume chart would render here</p>
                  <p className="text-xs text-muted-foreground mt-1">Showing data for the last {timeRange}</p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Top Endpoints</h3>
              <div className="space-y-2">
                {app.topEndpoints.map((endpoint: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 text-xs">
                        {endpoint.method}
                      </Badge>
                      <span className="text-sm font-mono">{endpoint.path}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground mr-1">Avg:</span>
                        <span>{endpoint.avgResponseTime}ms</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground mr-1">Calls:</span>
                        <span>{formatNumber(endpoint.calls)}</span>
                      </div>
                      <Badge
                        variant={
                          endpoint.errorRate > 5 ? "destructive" : endpoint.errorRate > 1 ? "secondary" : "default"
                        }
                        className="text-xs"
                      >
                        {endpoint.errorRate}% errors
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>Configure alerts for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <div>
                        <h3 className="font-medium">High CPU Usage</h3>
                        <p className="text-sm text-muted-foreground">Alert when CPU usage exceeds 80% for 5 minutes</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex justify-end mt-2 gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-red-500" />
                      <div>
                        <h3 className="font-medium">High Response Time</h3>
                        <p className="text-sm text-muted-foreground">
                          Alert when average response time exceeds 500ms for 10 minutes
                        </p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex justify-end mt-2 gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <h3 className="font-medium">High Error Rate</h3>
                        <p className="text-sm text-muted-foreground">Alert when error rate exceeds 5% for 5 minutes</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex justify-end mt-2 gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>

                <Button className="w-full">Add Alert</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
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
