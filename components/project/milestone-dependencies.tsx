"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ProjectMilestone } from "./project-tracker"

interface MilestoneDependenciesProps {
  milestone: ProjectMilestone | null
  allMilestones: ProjectMilestone[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (milestoneId: string, dependencies: string[]) => void
}

export function MilestoneDependencies({
  milestone,
  allMilestones,
  open,
  onOpenChange,
  onSave,
}: MilestoneDependenciesProps) {
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([])
  const [dependencyError, setDependencyError] = useState<string | null>(null)

  // Initialize selected dependencies when the dialog opens
  useEffect(() => {
    if (milestone && open) {
      setSelectedDependencies(milestone.dependencies || [])
      setDependencyError(null)
    }
  }, [milestone, open])

  if (!milestone) return null

  // Filter out the current milestone and any milestones that would create circular dependencies
  const availableMilestones = allMilestones.filter((m) => {
    // Skip the current milestone
    if (m.id === milestone.id) return false

    // Skip milestones that depend on the current milestone (to avoid circular dependencies)
    if (hasDependencyPath(allMilestones, m.id, milestone.id)) return false

    return true
  })

  const handleToggleDependency = (milestoneId: string) => {
    setSelectedDependencies((prev) =>
      prev.includes(milestoneId) ? prev.filter((id) => id !== milestoneId) : [...prev, milestoneId],
    )
    setDependencyError(null)
  }

  const handleSave = () => {
    // Validate that we're not creating impossible dependencies
    // (e.g., depending on milestones that are scheduled after this one)
    const currentDueDate = new Date(milestone.dueDate)
    const invalidDependencies = selectedDependencies
      .map((depId) => allMilestones.find((m) => m.id === depId))
      .filter((depMilestone) => {
        if (!depMilestone) return false
        const depDueDate = new Date(depMilestone.dueDate)
        return depDueDate >= currentDueDate
      })

    if (invalidDependencies.length > 0) {
      setDependencyError(
        `Warning: Some dependencies are due after this milestone. This may create scheduling conflicts.`,
      )
      return
    }

    onSave(milestone.id, selectedDependencies)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Dependencies for {milestone.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select milestones that must be completed before this milestone can start.
          </p>

          {dependencyError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{dependencyError}</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {availableMilestones.length === 0 ? (
                <p className="text-sm text-muted-foreground">No available milestones to set as dependencies.</p>
              ) : (
                availableMilestones.map((m) => (
                  <div key={m.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`dependency-${m.id}`}
                      checked={selectedDependencies.includes(m.id)}
                      onCheckedChange={() => handleToggleDependency(m.id)}
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor={`dependency-${m.id}`} className="font-medium">
                        {m.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Due: {new Date(m.dueDate).toLocaleDateString()}
                        </Badge>
                        <Badge variant="outline" className={getStatusBadgeClass(m.status)}>
                          {m.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Dependencies</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to check if there's a dependency path between two milestones
function hasDependencyPath(
  allMilestones: ProjectMilestone[],
  startId: string,
  targetId: string,
  visited: Set<string> = new Set(),
): boolean {
  // If we've already visited this milestone, skip to avoid infinite loops
  if (visited.has(startId)) return false

  // Mark this milestone as visited
  visited.add(startId)

  // Get the milestone by ID
  const milestone = allMilestones.find((m) => m.id === startId)
  if (!milestone) return false

  // Check if this milestone directly depends on the target
  if (milestone.dependencies?.includes(targetId)) return true

  // Check if any of this milestone's dependencies lead to the target
  return (milestone.dependencies || []).some((depId) => hasDependencyPath(allMilestones, depId, targetId, visited))
}

// Helper function to get the appropriate badge class based on status
function getStatusBadgeClass(status: string): string {
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
