"use client"

import { format } from "date-fns"
import type { Deployment } from "@/types/deployment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle, Clock, GitCommit, RotateCcw, XCircle } from "lucide-react"

interface DeploymentDetailDialogProps {
  deployment: Deployment
  onClose: () => void
}

export function DeploymentDetailDialog({ deployment, onClose }: DeploymentDetailDialogProps) {
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md deployment-dialog">
        <DialogHeader>
          <DialogTitle>Deployment Details</DialogTitle>
          <DialogDescription>
            Viewing details for deployment {deployment.version} ({deployment.commitHash})
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-medium">{deployment.version}</span>
            <Badge className={getStatusColor(deployment.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(deployment.status)}
                {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
              </span>
            </Badge>
          </div>

          <dl className="divide-y divide-gray-200 dark:divide-gray-700 border-t border-b">
            <div className="flex justify-between py-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">
                {format(new Date(deployment.timestamp), "MMM d, yyyy h:mm a")}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Author</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{deployment.author}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Commit</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1">
                <GitCommit className="h-3 w-3" />
                {deployment.commitHash}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{deployment.environment}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Rollback Available</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">
                {deployment.rollbackAvailable ? "Yes" : "No"}
              </dd>
            </div>
          </dl>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Changes</h4>
            <ul className="list-disc pl-5 space-y-1">
              {deployment.changes.map((change, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                  {change}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
