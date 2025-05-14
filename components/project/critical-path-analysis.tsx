"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import type { ProjectMilestone } from "./project-tracker"

interface CriticalPathAnalysisProps {
  milestones: ProjectMilestone[]
}

export function CriticalPathAnalysis({ milestones }: CriticalPathAnalysisProps) {
  // Calculate the critical path
  const criticalPath = calculateCriticalPath(milestones)

  // Get milestones on the critical path
  const criticalMilestones = milestones
    .filter((m) => criticalPath.has(m.id))
    .sort((a, b) => {
      // Sort by dependency relationship
      if (a.dependencies?.includes(b.id)) return 1
      if (b.dependencies?.includes(a.id)) return -1

      // If no direct dependency, sort by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  // Calculate the total duration of the critical path
  const totalDuration = calculateTotalDuration(criticalMilestones)

  // Calculate the completion percentage of the critical path
  const completionPercentage = calculateCompletionPercentage(criticalMilestones)

  // Find the next milestone on the critical path that needs attention
  const nextCriticalMilestone = criticalMilestones.find((m) => m.status !== "completed" && m.status !== "approved")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Critical Path Analysis
              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                {criticalMilestones.length} Milestones
              </Badge>
            </CardTitle>
            <CardDescription>The critical path determines your project's minimum completion time</CardDescription>
          </div>
          <div className="text-2xl font-bold">{completionPercentage}% Complete</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Total Duration</div>
              <div className="text-2xl font-bold">{totalDuration} days</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Earliest Completion</div>
              <div className="text-2xl font-bold">
                {criticalMilestones.length > 0
                  ? format(new Date(criticalMilestones[criticalMilestones.length - 1].dueDate), "MMM d, yyyy")
                  : "N/A"}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Next Critical Milestone</div>
              <div className="text-lg font-bold truncate">
                {nextCriticalMilestone ? nextCriticalMilestone.title : "All critical milestones complete"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Critical Path Sequence</h3>
            <div className="space-y-2">
              {criticalMilestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center gap-2 p-2 border rounded-md">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-800 rounded-full">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{milestone.title}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Due: {format(new Date(milestone.dueDate), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <div>
                    {milestone.status === "completed" || milestone.status === "approved" ? (
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Complete
                      </Badge>
                    ) : milestone.status === "delayed" ? (
                      <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Delayed
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">{milestone.status}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800">Critical Path Impact</h4>
                <p className="text-sm text-orange-700">
                  Any delay in these milestones will directly delay your project completion date. Focus your resources
                  on keeping these milestones on schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to calculate the critical path
function calculateCriticalPath(milestones: ProjectMilestone[]): Set<string> {
  const criticalPath = new Set<string>()

  // This is a simplified implementation - in a real app, this would use the same algorithm as the graph
  // For this demo, we'll identify milestones that form the longest path through the dependency graph

  // Find milestones with no dependencies (starting points)
  const startMilestones = milestones.filter((m) => !m.dependencies || m.dependencies.length === 0)

  // Find milestones with no dependents (end points)
  const endMilestones = milestones.filter((m) => {
    return !milestones.some((other) => other.dependencies?.includes(m.id))
  })

  // For each possible path from start to end, calculate the total duration
  let longestPathLength = 0
  let longestPath: string[] = []

  // Helper function to find all paths
  const findPaths = (currentId: string, path: string[], visited: Set<string>) => {
    // Add current milestone to path and visited set
    path.push(currentId)
    visited.add(currentId)

    // Check if we've reached an end milestone
    const isEndMilestone = endMilestones.some((m) => m.id === currentId)
    if (isEndMilestone) {
      // Check if this is the longest path so far
      if (path.length > longestPathLength) {
        longestPathLength = path.length
        longestPath = [...path]
      }
    }

    // Find all milestones that depend on the current one
    const dependents = milestones.filter((m) => m.dependencies?.includes(currentId) && !visited.has(m.id))

    // Recursively explore all dependents
    for (const dependent of dependents) {
      findPaths(dependent.id, [...path], new Set(visited))
    }
  }

  // Start path finding from each start milestone
  for (const start of startMilestones) {
    findPaths(start.id, [], new Set())
  }

  // Add all milestones in the longest path to the critical path set
  longestPath.forEach((id) => criticalPath.add(id))

  return criticalPath
}

// Helper function to calculate the total duration of the critical path
function calculateTotalDuration(criticalMilestones: ProjectMilestone[]): number {
  if (criticalMilestones.length === 0) return 0

  // Calculate the difference between the earliest start date and the latest end date
  const startDate = new Date(criticalMilestones[0].dueDate)
  const endDate = new Date(criticalMilestones[criticalMilestones.length - 1].dueDate)

  // Calculate the difference in days
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

// Helper function to calculate the completion percentage of the critical path
function calculateCompletionPercentage(criticalMilestones: ProjectMilestone[]): number {
  if (criticalMilestones.length === 0) return 0

  // Count completed milestones
  const completedCount = criticalMilestones.filter((m) => m.status === "completed" || m.status === "approved").length

  // Calculate percentage
  return Math.round((completedCount / criticalMilestones.length) * 100)
}
