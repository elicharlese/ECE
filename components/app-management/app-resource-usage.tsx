"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Clock, Download, HardDrive, LineChart, MemoryStick, Cpu, RefreshCw, Calendar } from "lucide-react"

interface AppResourceUsageProps {
  app: any
}

export function AppResourceUsage({ app }: AppResourceUsageProps) {
  // Ensure app and its properties exist to prevent errors
  if (!app) {
    return <div className="p-4 text-center">No app data available</div>
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Resource Usage</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 7 Days
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-2xl font-bold">{app.metrics?.cpu || 0}%</p>
                  <p className="text-xs text-muted-foreground">of allocated CPU</p>
                </div>
              </div>
              <div className="h-14 w-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {app.metrics?.cpuCores || 1} Core{app.metrics?.cpuCores !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Progress value={app.metrics?.cpu || 0} className="h-2 mt-4" />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">0%</p>
              <p className="text-xs text-muted-foreground">100%</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs">
                <p className="text-muted-foreground">Average</p>
                <p>{app.metrics?.cpuAverage || 0}%</p>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <p className="text-muted-foreground">Peak</p>
                <p>{app.metrics?.cpuPeak || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MemoryStick className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-2xl font-bold">{app.metrics?.memory || 0}%</p>
                  <p className="text-xs text-muted-foreground">of allocated memory</p>
                </div>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {app.metrics?.memorySize || 512} MB
                </p>
              </div>
            </div>
            <Progress value={app.metrics?.memory || 0} className="h-2 mt-4" />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">0%</p>
              <p className="text-xs text-muted-foreground">100%</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs">
                <p className="text-muted-foreground">Average</p>
                <p>{app.metrics?.memoryAverage || 0}%</p>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <p className="text-muted-foreground">Peak</p>
                <p>{app.metrics?.memoryPeak || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HardDrive className="h-5 w-5 text-purple-500 mr-2" />
                <div>
                  <p className="text-2xl font-bold">{app.metrics?.storage || 0}%</p>
                  <p className="text-xs text-muted-foreground">of allocated storage</p>
                </div>
              </div>
              <div className="h-14 w-14 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {app.metrics?.storageSize || 1} GB
                </p>
              </div>
            </div>
            <Progress value={app.metrics?.storage || 0} className="h-2 mt-4" />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">0%</p>
              <p className="text-xs text-muted-foreground">100%</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs">
                <p className="text-muted-foreground">Used</p>
                <p>{app.metrics?.storageUsed || 0} MB</p>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <p className="text-muted-foreground">Available</p>
                <p>{app.metrics?.storageAvailable || 1024} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cpu">
        <TabsList>
          <TabsTrigger value="cpu">CPU</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="cpu" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">CPU Usage Over Time</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <LineChart className="mr-2 h-4 w-4" />
                    Line
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Bar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="mr-2 h-4 w-4" />
                    Real-time
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">CPU usage chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Memory Usage Over Time</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <LineChart className="mr-2 h-4 w-4" />
                    Line
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Bar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="mr-2 h-4 w-4" />
                    Real-time
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Memory usage chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Storage Usage Over Time</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <LineChart className="mr-2 h-4 w-4" />
                    Line
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Bar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="mr-2 h-4 w-4" />
                    Real-time
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Storage usage chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Network Usage Over Time</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <LineChart className="mr-2 h-4 w-4" />
                    Line
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Bar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="mr-2 h-4 w-4" />
                    Real-time
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Network usage chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
