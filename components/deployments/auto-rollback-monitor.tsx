"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useDeployments } from "@/context/deployment-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, AlertTriangle, CheckCircle, RefreshCw, RotateCcw, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { DeploymentMonitoringData } from "@/types/deployment"

export function AutoRollbackMonitor() {
  const { activeDeployments, monitoringData, isLoading, error, refreshMonitoringData, cancelAutoRollback } =
    useDeployments()
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null)
  const { toast } = useToast()

  // Set the first deployment as selected when data loads
  useEffect(() => {
    if (activeDeployments.length > 0 && !selectedDeployment) {
      setSelectedDeployment(activeDeployments[0].id)
    }
  }, [activeDeployments, selectedDeployment])

  const handleCancelRollback = async (deploymentId: string) => {
    try {
      const result = await cancelAutoRollback(deploymentId)
      if (result.success) {
        toast({
          title: "Rollback Cancelled",
          description: "Automatic rollback has been cancelled",
        })
      } else {
        toast({
          title: "Cancellation Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel automatic rollback",
        variant: "destructive",
      })
    }
  }

  const getSelectedDeploymentData = () => {
    if (!selectedDeployment) return null
    return monitoringData.find((data) => data.deploymentId === selectedDeployment) || null
  }

  const getMetricStatus = (value: number, threshold: number) => {
    const percentage = (value / threshold) * 100
    if (percentage >= 100) return "critical"
    if (percentage >= 80) return "warning"
    return "normal"
  }

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-500"
      case "warning":
        return "text-amber-500"
      default:
        return "text-green-500"
    }
  }

  const getProgressColor = (value: number, threshold: number) => {
    const percentage = (value / threshold) * 100
    if (percentage >= 100) return "bg-red-500"
    if (percentage >= 80) return "bg-amber-500"
    return "bg-green-500"
  }

  const getStatusBadge = (data: DeploymentMonitoringData) => {
    if (data.pendingRollback) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <span className="flex items-center gap-1">
            <RotateCcw className="h-3 w-3 animate-spin" />
            Rollback Pending
          </span>
        </Badge>
      )
    }

    if (data.warningThresholdBreached) {
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </span>
        </Badge>
      )
    }

    if (data.criticalThresholdBreached) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <span className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Critical
          </span>
        </Badge>
      )
    }

    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Healthy
        </span>
      </Badge>
    )
  }

  const selectedData = getSelectedDeploymentData()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Deployment Monitoring</CardTitle>
            <CardDescription>Real-time monitoring of active deployments</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refreshMonitoringData()}
            disabled={isLoading}
            className="refresh-button"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading monitoring data</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        ) : activeDeployments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No active deployments to monitor</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Active deployments will appear here when they are deployed
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {activeDeployments.map((deployment) => (
                <Button
                  key={deployment.id}
                  variant={selectedDeployment === deployment.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDeployment(deployment.id)}
                  className="deployment-selector"
                >
                  {deployment.version}
                </Button>
              ))}
            </div>

            {selectedData ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {activeDeployments.find((d) => d.id === selectedDeployment)?.version}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Deployed {format(new Date(selectedData.deploymentTime), "MMM d, h:mm a")}
                      </span>
                      <span>•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Monitoring for {Math.floor(selectedData.monitoringDuration / 60)}m{" "}
                        {selectedData.monitoringDuration % 60}s
                      </span>
                      <span>•</span>
                      {getStatusBadge(selectedData)}
                    </div>
                  </div>

                  {selectedData.pendingRollback && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelRollback(selectedData.deploymentId)}
                      className="mt-2 sm:mt-0"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Rollback
                    </Button>
                  )}
                </div>

                <Tabs defaultValue="metrics">
                  <TabsList className="mb-4">
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                  </TabsList>

                  <TabsContent value="metrics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <h4 className="text-sm font-medium">Error Rate</h4>
                            <span
                              className={getMetricStatusColor(
                                getMetricStatus(selectedData.metrics.errorRate, selectedData.thresholds.errorRate),
                              )}
                            >
                              {selectedData.metrics.errorRate}% / {selectedData.thresholds.errorRate}%
                            </span>
                          </div>
                          <Progress
                            value={(selectedData.metrics.errorRate / selectedData.thresholds.errorRate) * 100}
                            className="h-2"
                            indicatorClassName={getProgressColor(
                              selectedData.metrics.errorRate,
                              selectedData.thresholds.errorRate,
                            )}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <h4 className="text-sm font-medium">Latency</h4>
                            <span
                              className={getMetricStatusColor(
                                getMetricStatus(selectedData.metrics.latency, selectedData.thresholds.latency),
                              )}
                            >
                              {selectedData.metrics.latency}ms / {selectedData.thresholds.latency}ms
                            </span>
                          </div>
                          <Progress
                            value={(selectedData.metrics.latency / selectedData.thresholds.latency) * 100}
                            className="h-2"
                            indicatorClassName={getProgressColor(
                              selectedData.metrics.latency,
                              selectedData.thresholds.latency,
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <h4 className="text-sm font-medium">CPU Usage</h4>
                            <span
                              className={getMetricStatusColor(
                                getMetricStatus(selectedData.metrics.cpuUsage, selectedData.thresholds.cpuUsage),
                              )}
                            >
                              {selectedData.metrics.cpuUsage}% / {selectedData.thresholds.cpuUsage}%
                            </span>
                          </div>
                          <Progress
                            value={(selectedData.metrics.cpuUsage / selectedData.thresholds.cpuUsage) * 100}
                            className="h-2"
                            indicatorClassName={getProgressColor(
                              selectedData.metrics.cpuUsage,
                              selectedData.thresholds.cpuUsage,
                            )}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <h4 className="text-sm font-medium">Memory Usage</h4>
                            <span
                              className={getMetricStatusColor(
                                getMetricStatus(selectedData.metrics.memoryUsage, selectedData.thresholds.memoryUsage),
                              )}
                            >
                              {selectedData.metrics.memoryUsage}% / {selectedData.thresholds.memoryUsage}%
                            </span>
                          </div>
                          <Progress
                            value={(selectedData.metrics.memoryUsage / selectedData.thresholds.memoryUsage) * 100}
                            className="h-2"
                            indicatorClassName={getProgressColor(
                              selectedData.metrics.memoryUsage,
                              selectedData.thresholds.memoryUsage,
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {selectedData.pendingRollback && (
                      <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                              Automatic Rollback Pending
                            </h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                              <p>
                                This deployment will be automatically rolled back in {selectedData.rollbackCountdown}{" "}
                                seconds due to{" "}
                                {selectedData.rollbackReason
                                  .split("-")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                                . Click "Cancel Rollback" to prevent this action.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="events">
                    <div className="border rounded-md">
                      <div className="max-h-64 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Time
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Event
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Details
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {selectedData.events.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                  No events recorded yet
                                </td>
                              </tr>
                            ) : (
                              selectedData.events.map((event, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {format(new Date(event.timestamp), "HH:mm:ss")}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Badge
                                      className={
                                        event.type === "error"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                          : event.type === "warning"
                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                      }
                                    >
                                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                    {event.message}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Select a deployment to view monitoring data</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
