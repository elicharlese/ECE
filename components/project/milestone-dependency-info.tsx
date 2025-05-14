"use client"

import type { ProjectMilestone } from "./project-tracker"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { CriticalPathIndicator } from "./critical-path-indicator"

// Update the component to include critical path detection
export function MilestoneDependencyInfo({
  milestone,
  allMilestones,
}: {
  milestone: ProjectMilestone
  allMilestones: ProjectMilestone[]
}) {
  const [isOnCriticalPath, setIsOnCriticalPath] = useState(false)

  // Calculate if this milestone is on the critical path
  useEffect(() => {
    // Simple implementation - in a real app, this would use the same algorithm as the graph
    const calculateCriticalPath = () => {
      // For this simplified version, we'll consider a milestone critical if:
      // 1. It has dependencies and is not completed
      // 2. Any of its dependencies are on the critical path
      // 3. It has dependents (other milestones depend on it)

      const hasDependencies = milestone.dependencies && milestone.dependencies.length > 0
      const isNotCompleted = milestone.status !== "completed" && milestone.status !== "approved"

      const hasDependents = allMilestones.some((m) => m.dependencies && m.dependencies.includes(milestone.id))

      // This is a simplified heuristic - a real implementation would use the full critical path algorithm
      setIsOnCriticalPath((hasDependencies && isNotCompleted) || hasDependents)
    }

    calculateCriticalPath()
  }, [milestone, allMilestones])

  if (!milestone.dependencies || milestone.dependencies.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">No dependencies</span>
        {isOnCriticalPath && (
          <CriticalPathIndicator
            milestone={milestone}
            allMilestones={allMilestones}
            isOnCriticalPath={isOnCriticalPath}
          />
        )}
      </div>
    )
  }

  const dependencyMilestones = milestone.dependencies
    .map((depId) => allMilestones.find((m) => m.id === depId))
    .filter(Boolean) as ProjectMilestone[]

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">Depends on {dependencyMilestones.length} milestone(s)</span>
        {isOnCriticalPath && (
          <CriticalPathIndicator
            milestone={milestone}
            allMilestones={allMilestones}
            isOnCriticalPath={isOnCriticalPath}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {dependencyMilestones.map((depMilestone) => (
          <Badge
            key={depMilestone.id}
            variant="outline"
            className={`${
              depMilestone.status === "completed" || depMilestone.status === "approved"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {depMilestone.title}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function getDependencyStatusClass(status: string): string {
  switch (status) {
    case "completed":
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "delayed":
    case "changes-requested":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return ""
  }
}

function getDependencyStatusIcon(status: string) {
  switch (status) {
    case "completed":
    case "approved":
      return <CheckCircle className="h-3 w-3" />
    case "in-progress":
      return <Clock className="h-3 w-3" />
    case "pending":
      return <Clock className="h-3 w-3" />
    case "delayed":
    case "changes-requested":
      return <AlertCircle className="h-3 w-3" />
    default:
      return null
  }
}
