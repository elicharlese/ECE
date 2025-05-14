"use client"

import { useState } from "react"
import { useDeployments } from "@/context/deployment-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { GitCommit, ArrowRight } from "lucide-react"
import type { DeploymentComparison } from "@/types/deployment"
import { DeploymentComparisonDialog } from "./deployment-comparison"

export function DeploymentComparisonSelector() {
  const { deployments, compareDeployments, isComparing } = useDeployments()
  const [isOpen, setIsOpen] = useState(false)
  const [baseId, setBaseId] = useState<string>("")
  const [targetId, setTargetId] = useState<string>("")
  const [comparisonResult, setComparisonResult] = useState<DeploymentComparison | null>(null)

  const handleCompare = async () => {
    if (!baseId || !targetId) return

    try {
      const comparison = await compareDeployments(baseId, targetId)
      setComparisonResult(comparison)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to compare deployments:", error)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Compare Deployments
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compare Deployments</DialogTitle>
            <DialogDescription>Select two deployments to compare their changes and impact.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="base-deployment" className="text-sm font-medium">
                Base Deployment
              </label>
              <Select value={baseId} onValueChange={setBaseId}>
                <SelectTrigger id="base-deployment">
                  <SelectValue placeholder="Select base deployment" />
                </SelectTrigger>
                <SelectContent>
                  {deployments.map((deployment) => (
                    <SelectItem key={`base-${deployment.id}`} value={deployment.id}>
                      <div className="flex items-center gap-2">
                        <span>{deployment.version}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <GitCommit className="h-3 w-3" />
                          {deployment.commitHash.substring(0, 7)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(deployment.timestamp), "MMM d, yyyy")}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="target-deployment" className="text-sm font-medium">
                Target Deployment
              </label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger id="target-deployment">
                  <SelectValue placeholder="Select target deployment" />
                </SelectTrigger>
                <SelectContent>
                  {deployments.map((deployment) => (
                    <SelectItem key={`target-${deployment.id}`} value={deployment.id}>
                      <div className="flex items-center gap-2">
                        <span>{deployment.version}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <GitCommit className="h-3 w-3" />
                          {deployment.commitHash.substring(0, 7)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(deployment.timestamp), "MMM d, yyyy")}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompare} disabled={!baseId || !targetId || isComparing}>
              {isComparing ? "Comparing..." : "Compare"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {comparisonResult && (
        <DeploymentComparisonDialog comparison={comparisonResult} onClose={() => setComparisonResult(null)} />
      )}
    </>
  )
}
