"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useDeployments } from "@/context/deployment-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  GitCommit,
  Plus,
  RefreshCw,
  XCircle,
  ArrowUpRight,
  BarChart3,
} from "lucide-react"
import type { Deployment } from "@/types/deployment"

export function CanaryDeployments() {
  const {
    canaryDeployments,
    isLoading,
    error,
    refreshDeployments,
    createCanaryDeployment,
    promoteCanaryDeployment,
    updateCanaryPercentage,
    canaryConfig,
  } = useDeployments()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isMetricsDialogOpen, setIsMetricsDialogOpen] = useState(false)
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  const [newVersion, setNewVersion] = useState("")
  const [initialPercentage, setInitialPercentage] = useState(10)
  const [newPercentage, setNewPercentage] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateCanary = async () => {
    if (!newVersion) return

    setIsSubmitting(true)
    await createCanaryDeployment(newVersion, initialPercentage)
    setIsSubmitting(false)
    setIsCreateDialogOpen(false)
    setNewVersion("")
    setInitialPercentage(10)
  }

  const handlePromoteCanary = async () => {
    if (!selectedDeployment) return

    setIsSubmitting(true)
    await promoteCanaryDeployment(selectedDeployment.id)
    setIsSubmitting(false)
    setIsPromoteDialogOpen(false)
    setSelectedDeployment(null)
  }

  const handleUpdatePercentage = async () => {
    if (!selectedDeployment) return

    setIsSubmitting(true)
    await updateCanaryPercentage(selectedDeployment.id, newPercentage)
    setIsSubmitting(false)
    setIsUpdateDialogOpen(false)
    setSelectedDeployment(null)
    setNewPercentage(0)
  }

  const openPromoteDialog = (deployment: Deployment) => {
    setSelectedDeployment(deployment)
    setIsPromoteDialogOpen(true)
  }

  const openUpdateDialog = (deployment: Deployment) => {
    setSelectedDeployment(deployment)
    setNewPercentage(deployment.canaryPercentage || 10)
    setIsUpdateDialogOpen(true)
  }

  const openMetricsDialog = (deployment: Deployment) => {
    setSelectedDeployment(deployment)
    setIsMetricsDialogOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "monitoring":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "degraded":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "monitoring":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Canary Deployments</CardTitle>
            <CardDescription>Gradually roll out new versions to reduce risk</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refreshDeployments()}
              disabled={isLoading}
              className="refresh-button"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)} disabled={!canaryConfig?.enabled}>
              <Plus className="mr-2 h-4 w-4" />
              New Canary
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!canaryConfig?.enabled ? (
          <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Canary Deployments Disabled</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>Canary deployments are currently disabled. Enable them in the settings to use this feature.</p>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading canary deployments</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : canaryDeployments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No canary deployments found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Create a new canary deployment to gradually roll out changes
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {canaryDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className="flex flex-col space-y-4 p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors deployment-card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{deployment.version}</span>
                      <Badge
                        className={`${getStatusColor(deployment.canaryMetrics?.status || "monitoring")} status-badge`}
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(deployment.canaryMetrics?.status || "monitoring")}
                          {deployment.canaryMetrics?.status
                            ? deployment.canaryMetrics.status.charAt(0).toUpperCase() +
                              deployment.canaryMetrics.status.slice(1)
                            : "Monitoring"}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="ml-2">
                        {deployment.canaryPercentage}% Traffic
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{format(new Date(deployment.timestamp), "MMM d, yyyy h:mm a")}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <GitCommit className="h-3 w-3" />
                        {deployment.commitHash}
                      </span>
                      <span>•</span>
                      <span>{deployment.author}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">Error Rate</span>
                    <span
                      className={
                        deployment.canaryMetrics?.errorRate &&
                        deployment.canaryMetrics.errorRate > (canaryConfig?.metrics.errorRateThreshold || 1)
                          ? "text-red-600 dark:text-red-400 font-medium"
                          : "font-medium"
                      }
                    >
                      {deployment.canaryMetrics?.errorRate || 0}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">Latency</span>
                    <span
                      className={
                        deployment.canaryMetrics?.latency &&
                        deployment.canaryMetrics.latency > (canaryConfig?.metrics.latencyThreshold || 200)
                          ? "text-red-600 dark:text-red-400 font-medium"
                          : "font-medium"
                      }
                    >
                      {deployment.canaryMetrics?.latency || 0} ms
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">Started</span>
                    <span className="font-medium">
                      {deployment.canaryMetrics?.startTime
                        ? format(new Date(deployment.canaryMetrics.startTime), "MMM d, h:mm a")
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end mt-2">
                  <Button variant="outline" size="sm" onClick={() => openMetricsDialog(deployment)}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Metrics
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openUpdateDialog(deployment)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Traffic
                  </Button>
                  <Button variant="default" size="sm" onClick={() => openPromoteDialog(deployment)}>
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Promote
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Create Canary Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Canary Deployment</DialogTitle>
            <DialogDescription>
              Deploy a new version to a small percentage of users to test its stability
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCreateCanary()
            }}
          >
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="e.g., v1.3.0-canary"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initial-percentage">Initial Traffic Percentage</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="initial-percentage"
                    value={[initialPercentage]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(value) => setInitialPercentage(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{initialPercentage}%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Percentage of traffic that will be directed to this canary deployment
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !newVersion}>
                {isSubmitting ? "Creating..." : "Create Canary"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Promote Canary Dialog */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Promote Canary Deployment</DialogTitle>
            <DialogDescription>Promote this canary deployment to a full production deployment</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to promote <strong>{selectedDeployment?.version}</strong> to a full production
              deployment?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This will direct 100% of traffic to this version and make it the new production deployment.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePromoteCanary} disabled={isSubmitting}>
              {isSubmitting ? "Promoting..." : "Promote to Production"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Traffic Percentage Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Traffic Percentage</DialogTitle>
            <DialogDescription>Change the percentage of traffic directed to this canary deployment</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUpdatePercentage()
            }}
          >
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="traffic-percentage">Traffic Percentage</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="traffic-percentage"
                    value={[newPercentage]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setNewPercentage(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{newPercentage}%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current: {selectedDeployment?.canaryPercentage || 0}% → New: {newPercentage}%
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Traffic"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Metrics Dialog */}
      <Dialog open={isMetricsDialogOpen} onOpenChange={setIsMetricsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Canary Metrics</DialogTitle>
            <DialogDescription>Detailed metrics for {selectedDeployment?.version}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedDeployment?.canaryMetrics ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status</span>
                  <Badge className={getStatusColor(selectedDeployment.canaryMetrics.status || "monitoring")}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedDeployment.canaryMetrics.status || "monitoring")}
                      {selectedDeployment.canaryMetrics.status
                        ? selectedDeployment.canaryMetrics.status.charAt(0).toUpperCase() +
                          selectedDeployment.canaryMetrics.status.slice(1)
                        : "Monitoring"}
                    </span>
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Error Rate</h4>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          selectedDeployment.canaryMetrics.errorRate > (canaryConfig?.metrics.errorRateThreshold || 1)
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(selectedDeployment.canaryMetrics.errorRate * 10, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span>{selectedDeployment.canaryMetrics.errorRate}%</span>
                      <span className="text-gray-500">Threshold: {canaryConfig?.metrics.errorRateThreshold || 1}%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Latency</h4>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          selectedDeployment.canaryMetrics.latency > (canaryConfig?.metrics.latencyThreshold || 200)
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min((selectedDeployment.canaryMetrics.latency / (canaryConfig?.metrics.latencyThreshold || 200)) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span>{selectedDeployment.canaryMetrics.latency} ms</span>
                      <span className="text-gray-500">
                        Threshold: {canaryConfig?.metrics.latencyThreshold || 200} ms
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Traffic</h4>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${selectedDeployment.canaryMetrics.trafficPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span>{selectedDeployment.canaryMetrics.trafficPercentage}% of users</span>
                      <span className="text-gray-500">
                        Started: {format(new Date(selectedDeployment.canaryMetrics.startTime), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedDeployment.canaryMetrics.autoPromoteThreshold && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Auto-Promotion</h4>
                    <p className="text-sm">
                      This canary will be automatically promoted when health metrics exceed{" "}
                      {selectedDeployment.canaryMetrics.autoPromoteThreshold}% threshold for a sustained period.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">No metrics available for this deployment</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsMetricsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
