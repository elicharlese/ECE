"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { DeploymentComparison } from "@/types/deployment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { GitCommit, Plus, Minus, FileText, AlertTriangle, Zap } from "lucide-react"

interface DeploymentComparisonDialogProps {
  comparison: DeploymentComparison
  onClose: () => void
}

export function DeploymentComparisonDialog({ comparison, onClose }: DeploymentComparisonDialogProps) {
  const [activeTab, setActiveTab] = useState("changes")

  const { baseDeployment, targetDeployment, changes, addedFiles, modifiedFiles, removedFiles, performanceImpact } =
    comparison

  const totalAdditions = changes.reduce((sum, change) => sum + (change.additions || 0), 0)
  const totalDeletions = changes.reduce((sum, change) => sum + (change.deletions || 0), 0)

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "added":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "modified":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "removed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPerformanceImpactColor = (value: number) => {
    if (value === 0) return "text-gray-500"
    return value < 0 ? "text-green-500" : "text-amber-500"
  }

  const formatPerformanceChange = (value: number, unit: string) => {
    const prefix = value > 0 ? "+" : ""
    return `${prefix}${value}${unit}`
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Deployment Comparison</DialogTitle>
          <DialogDescription>
            Comparing {baseDeployment.version} ({baseDeployment.commitHash.substring(0, 7)}) with{" "}
            {targetDeployment.version} ({targetDeployment.commitHash.substring(0, 7)})
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border rounded-md p-3">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Base</div>
              <div className="font-medium">{baseDeployment.version}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <GitCommit className="h-3 w-3" />
                {baseDeployment.commitHash.substring(0, 7)}
                <span className="mx-1">•</span>
                {format(new Date(baseDeployment.timestamp), "MMM d, yyyy")}
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Target</div>
              <div className="font-medium">{targetDeployment.version}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <GitCommit className="h-3 w-3" />
                {targetDeployment.commitHash.substring(0, 7)}
                <span className="mx-1">•</span>
                {format(new Date(targetDeployment.timestamp), "MMM d, yyyy")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Plus className="h-4 w-4 text-green-500" />
              <span className="text-sm">{totalAdditions} additions</span>
            </div>
            <div className="flex items-center gap-1">
              <Minus className="h-4 w-4 text-red-500" />
              <span className="text-sm">{totalDeletions} deletions</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{changes.length} files changed</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="changes">Changes</TabsTrigger>
              <TabsTrigger value="performance">Performance Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="changes" className="flex-1 overflow-auto">
              <div className="space-y-4">
                {changes.map((change, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getChangeTypeColor(change.type)}>
                          {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                        </Badge>
                        <span className="font-medium">{change.path}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {change.additions !== undefined && change.additions > 0 && (
                          <span className="text-xs text-green-500">+{change.additions}</span>
                        )}
                        {change.deletions !== undefined && change.deletions > 0 && (
                          <span className="text-xs text-red-500">-{change.deletions}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {change.type === "added" && "New file added to the codebase"}
                      {change.type === "modified" && "File was modified with changes"}
                      {change.type === "removed" && "File was removed from the codebase"}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="flex-1 overflow-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Load Time</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${getPerformanceImpactColor(performanceImpact.loadTimeChange)}`}
                      >
                        {formatPerformanceChange(performanceImpact.loadTimeChange, "ms")}
                      </span>
                      {performanceImpact.loadTimeChange < 0 ? (
                        <span className="text-sm text-green-500">Faster</span>
                      ) : performanceImpact.loadTimeChange > 0 ? (
                        <span className="text-sm text-amber-500">Slower</span>
                      ) : (
                        <span className="text-sm text-gray-500">No change</span>
                      )}
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Memory Usage</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${getPerformanceImpactColor(
                          performanceImpact.memoryUsageChange,
                        )}`}
                      >
                        {formatPerformanceChange(performanceImpact.memoryUsageChange, "MB")}
                      </span>
                      {performanceImpact.memoryUsageChange < 0 ? (
                        <span className="text-sm text-green-500">Less</span>
                      ) : performanceImpact.memoryUsageChange > 0 ? (
                        <span className="text-sm text-amber-500">More</span>
                      ) : (
                        <span className="text-sm text-gray-500">No change</span>
                      )}
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">CPU Usage</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${getPerformanceImpactColor(performanceImpact.cpuUsageChange)}`}
                      >
                        {formatPerformanceChange(performanceImpact.cpuUsageChange, "%")}
                      </span>
                      {performanceImpact.cpuUsageChange < 0 ? (
                        <span className="text-sm text-green-500">Less</span>
                      ) : performanceImpact.cpuUsageChange > 0 ? (
                        <span className="text-sm text-amber-500">More</span>
                      ) : (
                        <span className="text-sm text-gray-500">No change</span>
                      )}
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Network Requests</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${getPerformanceImpactColor(
                          performanceImpact.networkRequestsChange,
                        )}`}
                      >
                        {formatPerformanceChange(performanceImpact.networkRequestsChange, "")}
                      </span>
                      {performanceImpact.networkRequestsChange < 0 ? (
                        <span className="text-sm text-green-500">Less</span>
                      ) : performanceImpact.networkRequestsChange > 0 ? (
                        <span className="text-sm text-amber-500">More</span>
                      ) : (
                        <span className="text-sm text-gray-500">No change</span>
                      )}
                    </div>
                  </div>
                </div>

                {(performanceImpact.loadTimeChange > 50 ||
                  performanceImpact.memoryUsageChange > 10 ||
                  performanceImpact.cpuUsageChange > 5) && (
                  <div className="flex items-start gap-2 p-4 border rounded-md bg-amber-50 dark:bg-amber-900/20">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-300">Performance Warning</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        This deployment shows significant performance changes that may impact user experience. Consider
                        optimizing the code or monitoring closely after deployment.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
