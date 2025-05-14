"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"
import type { ProjectMilestone } from "./project-tracker"

interface RiskMetricsProps {
  milestones: ProjectMilestone[]
}

export function RiskMetrics({ milestones }: RiskMetricsProps) {
  // Calculate the critical path
  const criticalPath = calculateCriticalPath(milestones)

  // Get milestones on the critical path
  const criticalMilestones = milestones.filter((m) => criticalPath.has(m.id))

  // Calculate risk metrics
  const totalMilestones = criticalMilestones.length
  const completedMilestones = criticalMilestones.filter(
    (m) => m.status === "completed" || m.status === "approved",
  ).length

  const delayedMilestones = criticalMilestones.filter((m) => m.status === "delayed").length
  const atRiskMilestones = criticalMilestones.filter((m) => {
    if (m.status === "delayed") return true
    if (m.status === "completed" || m.status === "approved") return false

    // Check if milestone is behind schedule
    const now = new Date()
    const dueDate = new Date(m.dueDate)
    const totalDuration = 100 // Assuming 100 days for simplicity
    const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const timeElapsedPercent = ((totalDuration - daysRemaining) / totalDuration) * 100
    const expectedProgress = Math.min(Math.round(timeElapsedPercent), 100)

    return m.progress < expectedProgress - 15
  }).length

  const onTrackMilestones = totalMilestones - completedMilestones - delayedMilestones - atRiskMilestones

  // Calculate overall project risk
  let projectRisk = "low"
  const riskPercentage = ((delayedMilestones * 1.5 + atRiskMilestones * 0.5) / totalMilestones) * 100

  if (riskPercentage >= 30) {
    projectRisk = "high"
  } else if (riskPercentage >= 15) {
    projectRisk = "medium"
  }

  // Calculate completion percentage
  const completionPercentage = (completedMilestones / totalMilestones) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Critical Path Risk Metrics</CardTitle>
            <CardDescription>Key risk indicators for your critical path milestones</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              projectRisk === "high"
                ? "bg-red-100 text-red-800"
                : projectRisk === "medium"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800"
            }
          >
            {projectRisk === "high" ? (
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
            ) : projectRisk === "medium" ? (
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            )}
            <span className="capitalize">{projectRisk} Risk</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Completion</div>
            <div className="text-2xl font-bold">{Math.round(completionPercentage)}%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
              <span>
                {completedMilestones} of {totalMilestones} milestones
              </span>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Delayed</div>
            <div className="text-2xl font-bold">{delayedMilestones}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <AlertCircle className="h-3.5 w-3.5 mr-1 text-red-500" />
              <span>{Math.round((delayedMilestones / totalMilestones) * 100)}% of milestones</span>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">At Risk</div>
            <div className="text-2xl font-bold">{atRiskMilestones}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <AlertTriangle className="h-3.5 w-3.5 mr-1 text-orange-500" />
              <span>{Math.round((atRiskMilestones / totalMilestones) * 100)}% of milestones</span>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">On Track</div>
            <div className="text-2xl font-bold">{onTrackMilestones}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
              <span>{Math.round((onTrackMilestones / totalMilestones) * 100)}% of milestones</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Project Completion</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Project Risk Level</span>
              <span>{Math.round(riskPercentage)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  projectRisk === "high" ? "bg-red-500" : projectRisk === "medium" ? "bg-orange-500" : "bg-green-500"
                }`}
                style={{ width: `${riskPercentage}%` }}
              />
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
