"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useDeployments } from "@/context/deployment-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, AlertTriangle, CheckCircle, Clock, FileText, RefreshCw, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AutoRollback } from "@/types/deployment"

export function AutoRollbackHistory() {
  const { autoRollbackHistory, isLoading, error, refreshAutoRollbackHistory } = useDeployments()
  const [selectedRollback, setSelectedRollback] = useState<AutoRollback | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-amber-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "error-rate":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "latency":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "cpu-usage":
        return <AlertCircle className="h-4 w-4 text-purple-500" />
      case "memory-usage":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "manual-override":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case "error-rate":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "latency":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "cpu-usage":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "memory-usage":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "manual-override":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Automatic Rollback History</CardTitle>
            <CardDescription>View history of automatic rollbacks</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refreshAutoRollbackHistory()}
            disabled={isLoading}
            className="refresh-button"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          {error ? (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading rollback history</h3>
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
                  </div>
                </div>
              ))}
            </div>
          ) : autoRollbackHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No automatic rollbacks found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Automatic rollbacks will appear here when they occur
              </p>
            </div>
          ) : (
            <TabsContent value="all">
              <div className="space-y-4">
                {autoRollbackHistory.map((rollback) => (
                  <div
                    key={rollback.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rollback-card"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {rollback.deploymentVersion} → {rollback.targetVersion}
                        </span>
                        <Badge className={`${getStatusColor(rollback.status)} status-badge`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(rollback.status)}
                            {rollback.status.charAt(0).toUpperCase() + rollback.status.slice(1)}
                          </span>
                        </Badge>
                        <Badge className={`${getTriggerColor(rollback.trigger)} trigger-badge`}>
                          <span className="flex items-center gap-1">
                            {getTriggerIcon(rollback.trigger)}
                            {rollback.trigger
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{format(new Date(rollback.timestamp), "MMM d, yyyy h:mm a")}</span>
                        <span>•</span>
                        <span>{rollback.environment}</span>
                        {rollback.duration && (
                          <>
                            <span>•</span>
                            <span>{rollback.duration}s</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                      <Button variant="outline" size="sm" onClick={() => setSelectedRollback(rollback)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="completed">
            <div className="space-y-4">
              {autoRollbackHistory
                .filter((rollback) => rollback.status === "completed")
                .map((rollback) => (
                  <div
                    key={rollback.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rollback-card"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {rollback.deploymentVersion} → {rollback.targetVersion}
                        </span>
                        <Badge className={`${getStatusColor(rollback.status)} status-badge`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(rollback.status)}
                            {rollback.status.charAt(0).toUpperCase() + rollback.status.slice(1)}
                          </span>
                        </Badge>
                        <Badge className={`${getTriggerColor(rollback.trigger)} trigger-badge`}>
                          <span className="flex items-center gap-1">
                            {getTriggerIcon(rollback.trigger)}
                            {rollback.trigger
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{format(new Date(rollback.timestamp), "MMM d, yyyy h:mm a")}</span>
                        <span>•</span>
                        <span>{rollback.environment}</span>
                        {rollback.duration && (
                          <>
                            <span>•</span>
                            <span>{rollback.duration}s</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                      <Button variant="outline" size="sm" onClick={() => setSelectedRollback(rollback)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="failed">
            <div className="space-y-4">
              {autoRollbackHistory
                .filter((rollback) => rollback.status === "failed")
                .map((rollback) => (
                  <div
                    key={rollback.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rollback-card"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {rollback.deploymentVersion} → {rollback.targetVersion}
                        </span>
                        <Badge className={`${getStatusColor(rollback.status)} status-badge`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(rollback.status)}
                            {rollback.status.charAt(0).toUpperCase() + rollback.status.slice(1)}
                          </span>
                        </Badge>
                        <Badge className={`${getTriggerColor(rollback.trigger)} trigger-badge`}>
                          <span className="flex items-center gap-1">
                            {getTriggerIcon(rollback.trigger)}
                            {rollback.trigger
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{format(new Date(rollback.timestamp), "MMM d, yyyy h:mm a")}</span>
                        <span>•</span>
                        <span>{rollback.environment}</span>
                        {rollback.duration && (
                          <>
                            <span>•</span>
                            <span>{rollback.duration}s</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                      <Button variant="outline" size="sm" onClick={() => setSelectedRollback(rollback)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Rollback Details Dialog */}
      {selectedRollback && (
        <Dialog open={!!selectedRollback} onOpenChange={() => setSelectedRollback(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Automatic Rollback Details</DialogTitle>
              <DialogDescription>
                Details for rollback from {selectedRollback.deploymentVersion} to {selectedRollback.targetVersion}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                  <Badge className={`${getStatusColor(selectedRollback.status)} mt-1`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedRollback.status)}
                      {selectedRollback.status.charAt(0).toUpperCase() + selectedRollback.status.slice(1)}
                    </span>
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Trigger</h4>
                  <Badge className={`${getTriggerColor(selectedRollback.trigger)} mt-1`}>
                    <span className="flex items-center gap-1">
                      {getTriggerIcon(selectedRollback.trigger)}
                      {selectedRollback.trigger
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</h4>
                <p className="mt-1">{format(new Date(selectedRollback.timestamp), "MMM d, yyyy h:mm:ss a")}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment</h4>
                <p className="mt-1">{selectedRollback.environment}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Metrics at Trigger Time</h4>
                <div className="mt-2 space-y-2">
                  {selectedRollback.metrics.errorRate !== undefined && (
                    <div className="flex justify-between">
                      <span>Error Rate:</span>
                      <span
                        className={
                          selectedRollback.metrics.errorRate > selectedRollback.thresholds.errorRate
                            ? "text-red-500 font-medium"
                            : ""
                        }
                      >
                        {selectedRollback.metrics.errorRate}% (Threshold: {selectedRollback.thresholds.errorRate}%)
                      </span>
                    </div>
                  )}
                  {selectedRollback.metrics.latency !== undefined && (
                    <div className="flex justify-between">
                      <span>Latency:</span>
                      <span
                        className={
                          selectedRollback.metrics.latency > selectedRollback.thresholds.latency
                            ? "text-red-500 font-medium"
                            : ""
                        }
                      >
                        {selectedRollback.metrics.latency}ms (Threshold: {selectedRollback.thresholds.latency}ms)
                      </span>
                    </div>
                  )}
                  {selectedRollback.metrics.cpuUsage !== undefined && (
                    <div className="flex justify-between">
                      <span>CPU Usage:</span>
                      <span
                        className={
                          selectedRollback.metrics.cpuUsage > selectedRollback.thresholds.cpuUsage
                            ? "text-red-500 font-medium"
                            : ""
                        }
                      >
                        {selectedRollback.metrics.cpuUsage}% (Threshold: {selectedRollback.thresholds.cpuUsage}%)
                      </span>
                    </div>
                  )}
                  {selectedRollback.metrics.memoryUsage !== undefined && (
                    <div className="flex justify-between">
                      <span>Memory Usage:</span>
                      <span
                        className={
                          selectedRollback.metrics.memoryUsage > selectedRollback.thresholds.memoryUsage
                            ? "text-red-500 font-medium"
                            : ""
                        }
                      >
                        {selectedRollback.metrics.memoryUsage}% (Threshold: {selectedRollback.thresholds.memoryUsage}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {selectedRollback.logs && selectedRollback.logs.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Logs</h4>
                  <ScrollArea className="h-32 mt-1 border rounded-md p-2">
                    <div className="space-y-1">
                      {selectedRollback.logs.map((log, index) => (
                        <div key={index} className="text-xs font-mono">
                          <span className="text-gray-500">[{format(new Date(log.timestamp), "HH:mm:ss")}]</span>{" "}
                          <span
                            className={
                              log.level === "error"
                                ? "text-red-500"
                                : log.level === "warning"
                                  ? "text-amber-500"
                                  : "text-gray-700 dark:text-gray-300"
                            }
                          >
                            {log.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {selectedRollback.status === "failed" && selectedRollback.failureReason && (
                <div>
                  <h4 className="text-sm font-medium text-red-500">Failure Reason</h4>
                  <p className="mt-1 text-red-500">{selectedRollback.failureReason}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedRollback(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
