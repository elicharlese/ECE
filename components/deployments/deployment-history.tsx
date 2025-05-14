"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useDeployments } from "@/context/deployment-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, Clock, GitCommit, RefreshCw, RotateCcw, XCircle } from "lucide-react"
import { RollbackConfirmDialog } from "./rollback-confirm-dialog"
import { DeploymentDetailDialog } from "./deployment-detail-dialog"
import type { Deployment } from "@/types/deployment"
import { DeploymentComparisonDialog } from "./deployment-comparison"
import type { DeploymentComparison } from "@/types/deployment"
import { DeploymentComparisonSelector } from "./deployment-comparison-selector"

export function DeploymentHistory() {
  const { deployments, isLoading, error, stats, selectedEnvironment, setSelectedEnvironment, refreshDeployments } =
    useDeployments()

  const [deploymentToRollback, setDeploymentToRollback] = useState<Deployment | null>(null)
  const [deploymentToView, setDeploymentToView] = useState<Deployment | null>(null)
  const [selectedDeployments, setSelectedDeployments] = useState<string[]>([])
  const [comparisonResult, setComparisonResult] = useState<DeploymentComparison | null>(null)
  const [isComparing, setIsComparing] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "rolled-back":
        return <RotateCcw className="h-4 w-4 text-amber-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "rolled-back":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const handleCompare = async () => {
    if (selectedDeployments.length !== 2) return

    setIsComparing(true)
    try {
      const comparison = await compareDeployments(selectedDeployments[0], selectedDeployments[1])
      setComparisonResult(comparison)
    } catch (error) {
      console.error("Failed to compare deployments:", error)
    } finally {
      setIsComparing(false)
    }
  }

  const toggleDeploymentSelection = (deploymentId: string) => {
    setSelectedDeployments((current) => {
      if (current.includes(deploymentId)) {
        return current.filter((id) => id !== deploymentId)
      } else {
        // Only allow selecting 2 deployments at a time
        const newSelection = [...current, deploymentId]
        return newSelection.slice(-2)
      }
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Deployment History</CardTitle>
            <CardDescription>View and manage your deployment history</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
            <DeploymentComparisonSelector />
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
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompare}
            disabled={selectedDeployments.length !== 2 || isComparing}
            className="compare-button"
          >
            {isComparing ? "Comparing..." : "Compare Selected"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deployments">
          <TabsList className="mb-4">
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="deployments">
            {error ? (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading deployments</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
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
            ) : deployments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No deployments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deployments.map((deployment) => (
                  <div
                    key={deployment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors deployment-card"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDeployments.includes(deployment.id)}
                        onChange={() => toggleDeploymentSelection(deployment.id)}
                        className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{deployment.version}</span>
                        <Badge className={`${getStatusColor(deployment.status)} status-badge`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(deployment.status)}
                            {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
                          </span>
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
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                      <Button variant="outline" size="sm" onClick={() => setDeploymentToView(deployment)}>
                        Details
                      </Button>
                      {deployment.rollbackAvailable && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeploymentToRollback(deployment)}
                          className="rollback-button"
                        >
                          Rollback
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="stats-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Deployments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalDeployments}</div>
                  </CardContent>
                </Card>
                <Card className="stats-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalDeployments > 0
                        ? `${Math.round((stats.successfulDeployments / stats.totalDeployments) * 100)}%`
                        : "N/A"}
                    </div>
                  </CardContent>
                </Card>
                <Card className="stats-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Rollback Count
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.rollbackCount}</div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {deploymentToRollback && (
        <RollbackConfirmDialog deployment={deploymentToRollback} onClose={() => setDeploymentToRollback(null)} />
      )}

      {deploymentToView && (
        <DeploymentDetailDialog deployment={deploymentToView} onClose={() => setDeploymentToView(null)} />
      )}
      {comparisonResult && (
        <DeploymentComparisonDialog comparison={comparisonResult} onClose={() => setComparisonResult(null)} />
      )}
    </Card>
  )
}

// Mock function for comparing deployments
async function compareDeployments(deploymentId1: string, deploymentId2: string): Promise<any> {
  // Simulate an API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock comparison data
  return {
    deployment1: { id: deploymentId1, version: "v1.0", changes: ["feat: added new feature"] },
    deployment2: { id: deploymentId2, version: "v1.1", changes: ["fix: fixed a bug", "refactor: code improvements"] },
  }
}
