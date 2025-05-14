"use client"

import { useRef, useEffect } from "react"
import type { ProjectMilestone } from "./project-tracker"

// Update the DependencyGraphProps interface to include a showCriticalPath prop
interface DependencyGraphProps {
  milestones: ProjectMilestone[]
  showCriticalPath?: boolean
}

// Update the function signature to include the new prop with a default value
export function DependencyGraph({ milestones, showCriticalPath = true }: DependencyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Add this function to calculate the critical path
  const calculateCriticalPath = (milestones: ProjectMilestone[]): Set<string> => {
    // Create a map of milestone durations (estimated from progress and due dates)
    const milestoneDurations = new Map<string, number>()
    const earliestStart = new Map<string, number>()
    const earliestFinish = new Map<string, number>()
    const latestStart = new Map<string, number>()
    const latestFinish = new Map<string, number>()

    // Initialize with estimated durations (in days)
    milestones.forEach((milestone) => {
      const dueDate = new Date(milestone.dueDate).getTime()
      const startDate = milestone.completedDate
        ? new Date(milestone.completedDate).getTime() - (milestone.progress / 100) * 30 * 24 * 60 * 60 * 1000
        : dueDate - 30 * 24 * 60 * 60 * 1000 // Assume 30 days if no completion data

      const duration = (dueDate - startDate) / (24 * 60 * 60 * 1000)
      milestoneDurations.set(milestone.id, duration)
      earliestStart.set(milestone.id, 0)
      earliestFinish.set(milestone.id, duration)
    })

    // Forward pass - calculate earliest start and finish times
    let changed = true
    while (changed) {
      changed = false

      milestones.forEach((milestone) => {
        if (milestone.dependencies && milestone.dependencies.length > 0) {
          const maxDependencyFinish = Math.max(...milestone.dependencies.map((depId) => earliestFinish.get(depId) || 0))

          const newEarliestStart = maxDependencyFinish
          if (newEarliestStart > (earliestStart.get(milestone.id) || 0)) {
            earliestStart.set(milestone.id, newEarliestStart)
            earliestFinish.set(milestone.id, newEarliestStart + (milestoneDurations.get(milestone.id) || 0))
            changed = true
          }
        }
      })
    }

    // Find the project end time (maximum earliest finish)
    const projectEndTime = Math.max(...Array.from(earliestFinish.values()))

    // Initialize latest finish times to project end time
    milestones.forEach((milestone) => {
      latestFinish.set(milestone.id, projectEndTime)
      latestStart.set(milestone.id, projectEndTime - (milestoneDurations.get(milestone.id) || 0))
    })

    // Backward pass - calculate latest start and finish times
    changed = true
    while (changed) {
      changed = false

      // Process milestones in reverse order (from end to start)
      ;[...milestones].reverse().forEach((milestone) => {
        // Find all milestones that depend on this one
        const dependents = milestones.filter((m) => m.dependencies && m.dependencies.includes(milestone.id))

        if (dependents.length > 0) {
          const minDependentStart = Math.min(...dependents.map((dep) => latestStart.get(dep.id) || projectEndTime))

          const newLatestFinish = minDependentStart
          if (newLatestFinish < (latestFinish.get(milestone.id) || projectEndTime)) {
            latestFinish.set(milestone.id, newLatestFinish)
            latestStart.set(milestone.id, newLatestFinish - (milestoneDurations.get(milestone.id) || 0))
            changed = true
          }
        }
      })
    }

    // Calculate slack time and identify critical path (zero slack)
    const criticalPath = new Set<string>()
    milestones.forEach((milestone) => {
      const slack = (latestStart.get(milestone.id) || 0) - (earliestStart.get(milestone.id) || 0)
      if (slack <= 0.01) {
        // Use a small epsilon for floating point comparison
        criticalPath.add(milestone.id)
      }
    })

    return criticalPath
  }

  // Helper function to calculate milestone levels based on dependencies
  const calculateMilestoneLevels = (milestones: ProjectMilestone[]): Map<string, number> => {
    const levels = new Map<string, number>()
    const visited = new Set<string>()

    function calculateLevel(milestone: ProjectMilestone): number {
      if (visited.has(milestone.id)) {
        return levels.get(milestone.id) || 0
      }

      visited.add(milestone.id)

      if (!milestone.dependencies || milestone.dependencies.length === 0) {
        levels.set(milestone.id, 0)
        return 0
      }

      const dependencyLevels = milestone.dependencies.map((depId) => {
        const dependency = milestones.find((m) => m.id === depId)
        if (!dependency) return 0
        return calculateLevel(dependency) + 1
      })

      const maxLevel = Math.max(...dependencyLevels)
      levels.set(milestone.id, maxLevel)
      return maxLevel
    }

    milestones.forEach((milestone) => {
      if (!levels.has(milestone.id)) {
        calculateLevel(milestone)
      }
    })

    return levels
  }

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."
    }
    return text
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = Math.max(500, milestones.length * 80)
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate critical path if enabled
    const criticalPath = showCriticalPath ? calculateCriticalPath(milestones) : new Set<string>()

    // Create a map of milestone positions
    const milestonePositions = new Map<string, { x: number; y: number; width: number; height: number }>()

    // Draw milestones
    const milestoneHeight = 60
    const milestoneWidth = 200
    const horizontalSpacing = 250
    const verticalSpacing = 100

    // Group milestones by their dependency level (0 = no dependencies, 1 = depends on level 0, etc.)
    const milestoneLevels = calculateMilestoneLevels(milestones)
    const maxLevel = Math.max(...Array.from(milestoneLevels.values()))

    // Draw milestones by level
    for (let level = 0; level <= maxLevel; level++) {
      const levelMilestones = milestones.filter((m) => milestoneLevels.get(m.id) === level)

      levelMilestones.forEach((milestone, index) => {
        const x = 50 + level * horizontalSpacing
        const y = 50 + index * verticalSpacing

        // Store position for drawing connections later
        milestonePositions.set(milestone.id, {
          x,
          y,
          width: milestoneWidth,
          height: milestoneHeight,
        })

        // Draw milestone box
        const isOnCriticalPath = criticalPath.has(milestone.id)

        // Add a highlight effect for critical path milestones
        if (isOnCriticalPath) {
          // Draw a glow effect
          ctx.shadowColor = "rgba(234, 88, 12, 0.5)"
          ctx.shadowBlur = 15

          // Draw a slightly larger background for the highlight
          ctx.fillStyle = "rgba(234, 88, 12, 0.1)"
          ctx.beginPath()
          ctx.roundRect(x - 5, y - 5, milestoneWidth + 10, milestoneHeight + 10, 10)
          ctx.fill()

          // Reset shadow
          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
        }

        ctx.fillStyle = getMilestoneColor(milestone.status, isOnCriticalPath)
        ctx.strokeStyle = isOnCriticalPath ? "#ea580c" : "#000"
        ctx.lineWidth = isOnCriticalPath ? 2 : 1
        ctx.beginPath()
        ctx.roundRect(x, y, milestoneWidth, milestoneHeight, 8)
        ctx.fill()
        ctx.stroke()

        // Draw milestone title
        ctx.fillStyle = "#000"
        ctx.font = isOnCriticalPath ? "bold 14px Arial" : "bold 14px Arial"
        ctx.fillText(truncateText(milestone.title, 20), x + 10, y + 20)

        // Draw milestone status
        ctx.font = "12px Arial"
        ctx.fillText(`Status: ${milestone.status}`, x + 10, y + 40)

        // Draw progress
        ctx.fillText(`Progress: ${milestone.progress}%`, x + 10, y + 55)
      })
    }

    // Draw dependency connections
    ctx.lineWidth = 2

    milestones.forEach((milestone) => {
      if (!milestone.dependencies || milestone.dependencies.length === 0) return

      const targetPos = milestonePositions.get(milestone.id)
      if (!targetPos) return

      milestone.dependencies.forEach((depId) => {
        const sourcePos = milestonePositions.get(depId)
        if (!sourcePos) return

        // Check if both milestones are on the critical path
        const isOnCriticalPath = criticalPath.has(milestone.id) && criticalPath.has(depId)

        // Set line style based on critical path
        ctx.strokeStyle = isOnCriticalPath ? "#ea580c" : "#666"
        ctx.lineWidth = isOnCriticalPath ? 3 : 2

        // Draw arrow from source to target
        ctx.beginPath()
        ctx.moveTo(sourcePos.x + sourcePos.width, sourcePos.y + sourcePos.height / 2)

        // Create a curved line
        const controlX = (sourcePos.x + sourcePos.width + targetPos.x) / 2
        ctx.bezierCurveTo(
          controlX,
          sourcePos.y + sourcePos.height / 2,
          controlX,
          targetPos.y + targetPos.height / 2,
          targetPos.x,
          targetPos.y + targetPos.height / 2,
        )

        ctx.stroke()

        // Draw arrowhead
        const arrowSize = 8
        const angle = Math.atan2(
          targetPos.y + targetPos.height / 2 - (sourcePos.y + sourcePos.height / 2),
          targetPos.x - (sourcePos.x + sourcePos.width),
        )

        ctx.beginPath()
        ctx.moveTo(targetPos.x, targetPos.y + targetPos.height / 2)
        ctx.lineTo(
          targetPos.x - arrowSize * Math.cos(angle - Math.PI / 6),
          targetPos.y + targetPos.height / 2 - arrowSize * Math.sin(angle - Math.PI / 6),
        )
        ctx.lineTo(
          targetPos.x - arrowSize * Math.cos(angle + Math.PI / 6),
          targetPos.y + targetPos.height / 2 - arrowSize * Math.sin(angle + Math.PI / 6),
        )
        ctx.closePath()
        ctx.fillStyle = isOnCriticalPath ? "#ea580c" : "#666"
        ctx.fill()
      })
    })

    // Draw legend for critical path
    if (showCriticalPath) {
      const legendX = canvas.width - 220
      const legendY = 20

      // Draw legend box
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.strokeStyle = "#666"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(legendX, legendY, 200, 60, 8)
      ctx.fill()
      ctx.stroke()

      // Draw legend title
      ctx.fillStyle = "#000"
      ctx.font = "bold 14px Arial"
      ctx.fillText("Legend", legendX + 10, legendY + 20)

      // Draw critical path indicator
      ctx.strokeStyle = "#ea580c"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(legendX + 10, legendY + 40)
      ctx.lineTo(legendX + 40, legendY + 40)
      ctx.stroke()

      // Draw critical path label
      ctx.fillStyle = "#000"
      ctx.font = "12px Arial"
      ctx.fillText("Critical Path", legendX + 50, legendY + 44)
    }
  }, [milestones, showCriticalPath])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          The critical path shows the sequence of milestones that directly affect the project completion date. Any delay
          in these milestones will delay the entire project.
        </div>
      </div>
      <div className="w-full overflow-auto">
        <canvas ref={canvasRef} className="min-w-full" style={{ minHeight: "500px" }} />
      </div>
    </div>
  )
}

// Update the getMilestoneColor function to account for critical path
function getMilestoneColor(status: string, isOnCriticalPath: boolean): string {
  // Base colors
  let baseColor: string

  switch (status) {
    case "completed":
    case "approved":
      baseColor = isOnCriticalPath ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.2)"
      break
    case "in-progress":
      baseColor = isOnCriticalPath ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"
      break
    case "pending":
      baseColor = isOnCriticalPath ? "rgba(234, 179, 8, 0.3)" : "rgba(234, 179, 8, 0.2)"
      break
    case "delayed":
    case "changes-requested":
      baseColor = isOnCriticalPath ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)"
      break
    default:
      baseColor = isOnCriticalPath ? "rgba(209, 213, 219, 0.3)" : "rgba(209, 213, 219, 0.2)"
  }

  return baseColor
}
