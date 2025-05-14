"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CpuIcon, Database, HardDrive, LineChart, Wifi } from "lucide-react"

type ResourceUsageProps = {
  appId?: string
  cpu?: number
  memory?: number
  storage?: number
  bandwidth?: number
}

export function AppResourceUsage({
  appId,
  cpu = 45,
  memory = 512,
  storage = 2.5,
  bandwidth = 150,
}: ResourceUsageProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500"
    if (percentage < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  const cpuPercentage = cpu
  const memoryPercentage = (memory / 1024) * 100
  const storagePercentage = (storage / 10) * 100
  const bandwidthPercentage = (bandwidth / 500) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Resource Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CpuIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">CPU</span>
                  </div>
                  <span className="text-sm font-medium">{cpu}%</span>
                </div>
                <Progress value={cpuPercentage} className="h-2" indicatorClassName={getProgressColor(cpuPercentage)} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Memory</span>
                  </div>
                  <span className="text-sm font-medium">{memory} MB / 1024 MB</span>
                </div>
                <Progress
                  value={memoryPercentage}
                  className="h-2"
                  indicatorClassName={getProgressColor(memoryPercentage)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <span className="text-sm font-medium">{storage} GB / 10 GB</span>
                </div>
                <Progress
                  value={storagePercentage}
                  className="h-2"
                  indicatorClassName={getProgressColor(storagePercentage)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Bandwidth</span>
                  </div>
                  <span className="text-sm font-medium">{bandwidth} GB / 500 GB</span>
                </div>
                <Progress
                  value={bandwidthPercentage}
                  className="h-2"
                  indicatorClassName={getProgressColor(bandwidthPercentage)}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="daily">
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed p-4">
              <p className="text-sm text-gray-500">Daily resource usage charts will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="monthly">
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed p-4">
              <p className="text-sm text-gray-500">Monthly resource usage charts will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
