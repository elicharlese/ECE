"use client"

import { useState } from "react"
import { useDeployments } from "@/context/deployment-context"
import type { Deployment } from "@/types/deployment"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Loader2 } from "lucide-react"

interface RollbackConfirmDialogProps {
  deployment: Deployment
  onClose: () => void
}

export function RollbackConfirmDialog({ deployment, onClose }: RollbackConfirmDialogProps) {
  const [isRollingBack, setIsRollingBack] = useState(false)
  const { rollbackToDeployment } = useDeployments()

  const handleRollback = async () => {
    setIsRollingBack(true)
    try {
      const response = await rollbackToDeployment(deployment.id)
      if (response.success) {
        onClose()
      }
    } finally {
      setIsRollingBack(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md deployment-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Confirm Rollback
          </DialogTitle>
          <DialogDescription>Are you sure you want to roll back to version {deployment.version}?</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Rollback Warning</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>
                    Rolling back will revert your application to a previous state. This action cannot be undone. All
                    changes made after this deployment will be lost.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium">Deployment Details</h4>
            <dl className="mt-2 divide-y divide-gray-200 dark:divide-gray-700 border-t border-b">
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{deployment.version}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Deployed by</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{deployment.author}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Commit</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{deployment.commitHash}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{deployment.environment}</dd>
              </div>
            </dl>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRollingBack}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRollback} disabled={isRollingBack}>
            {isRollingBack ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rolling back...
              </>
            ) : (
              "Confirm Rollback"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
