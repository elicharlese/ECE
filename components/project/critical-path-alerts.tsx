"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bell, Clock, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import type { ProjectMilestone } from "./project-tracker"
import { AnimatedNotification } from "@/components/animated-notification"

interface CriticalPathAlertsProps {
  milestones: ProjectMilestone[]
  onTakeAction: (milestoneId: string, action: "extend" | "allocate" | "prioritize") => void
}

type RiskLevel = "high" | "medium" | "low" | "on-track"
type RiskFactor = "progress" | "deadline" | "dependencies" | "resources"

interface MilestoneRisk {
  milestoneId: string
  milestoneTitle: string
  riskLevel: RiskLevel
  riskFactors: {
    type: RiskFactor
    description: string
    severity: number // 1-10
  }[]
  dueDate: string
  progress: number
  expectedProgress: number
  daysRemaining: number
  isAcknowledged: boolean
}

export function CriticalPathAlerts({ milestones, onTakeAction }: CriticalPathAlertsProps) {
  const [showNotifications, setShowNotifications] = useState(true)
  const [riskThreshold, setRiskThreshold] = useState(5) // 1-10 scale
  const [activeTab, setActiveTab] = useState("all")
  const [acknowledgedRisks, setAcknowledgedRisks] = useState<string[]>([])
  const [alertVisible, setAlertVisible] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<MilestoneRisk | null>(null)

  // Calculate the critical path
  const criticalPath = calculateCriticalPath(milestones)

  // Get milestones on the critical path
  const criticalMilestones = milestones.filter((m) => criticalPath.has(m.id))

  // Assess risks for critical path milestones
  const milestoneRisks = assessRisks(criticalMilestones)

  // Filter risks based on the active tab
  const filteredRisks = milestoneRisks.filter((risk) => {
    if (activeTab === "all") return true
    if (activeTab === "high") return risk.riskLevel === "high"
    if (activeTab === "medium") return risk.riskLevel === "medium"
    if (activeTab === "low") return risk.riskLevel === "low"
    if (activeTab === "on-track") return risk.riskLevel === "on-track"
    return true
  })

  // Show a notification for high-risk milestones
  const showRiskNotification = (risk: MilestoneRisk) => {
    setCurrentAlert(risk)
    setAlertVisible(true)
  }

  // Acknowledge a risk
  const acknowledgeRisk = (riskId: string) => {
    setAcknowledgedRisks((prev) => [...prev, riskId])
  }

  // Get the risk badge color
  const getRiskBadgeColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
      case "low":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
      case "on-track":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
    }
  }

  // Get the risk icon
  const getRiskIcon = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "low":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "on-track":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="space-y-4">
      {alertVisible && currentAlert && (
        <AnimatedNotification
          title={`Risk Alert: ${currentAlert.milestoneTitle}`}
          message={`This critical path milestone is at ${currentAlert.riskLevel} risk due to ${
            currentAlert.riskFactors[0]?.description
          }`}
          type={currentAlert.riskLevel === "high" ? "error" : currentAlert.riskLevel === "medium" ? "warning" : "info"}
          duration={8000}
          onClose={() => setAlertVisible(false)}
          action={{
            label: "View Details",
            onClick: () => {
              setAlertVisible(false)
              setActiveTab(currentAlert.riskLevel)
            },
          }}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                Critical Path Risk Monitoring
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  {milestoneRisks.filter((r) => r.riskLevel === "high").length} High Risk
                </Badge>
              </CardTitle>
              <CardDescription>Monitor and manage risks to your critical path milestones</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Notifications</span>
                <Switch
                  checked={showNotifications}
                  onCheckedChange={setShowNotifications}
                  aria-label="Toggle notifications"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Risk Threshold</span>
                <Slider
                  value={[riskThreshold]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setRiskThreshold(value[0])}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Risks</TabsTrigger>
              <TabsTrigger value="high">High Risk</TabsTrigger>
              <TabsTrigger value="medium">Medium Risk</TabsTrigger>
              <TabsTrigger value="low">Low Risk</TabsTrigger>
              <TabsTrigger value="on-track">On Track</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {filteredRisks.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No {activeTab !== "all" ? activeTab : ""} risk milestones found.
                  </div>
                ) : (
                  filteredRisks.map((risk) => (
                    <Card key={risk.milestoneId} className="overflow-hidden">
                      <div
                        className={`h-1 ${
                          risk.riskLevel === "high"
                            ? "bg-red-500"
                            : risk.riskLevel === "medium"
                              ? "bg-orange-500"
                              : risk.riskLevel === "low"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                        }`}
                      />
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{risk.milestoneTitle}</h3>
                              <Badge variant="outline" className={getRiskBadgeColor(risk.riskLevel)}>
                                <div className="flex items-center gap-1">
                                  {getRiskIcon(risk.riskLevel)}
                                  <span className="capitalize">{risk.riskLevel} Risk</span>
                                </div>
                              </Badge>
                              {risk.isAcknowledged && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  Acknowledged
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress: {risk.progress}%</span>
                                <span>Expected: {risk.expectedProgress}%</span>
                              </div>
                              <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${risk.progress}%` }}
                                />
                                <div
                                  className="absolute top-0 h-full border-r-2 border-dashed border-primary/70"
                                  style={{ left: `${risk.expectedProgress}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                              {risk.riskFactors.map((factor, index) => (
                                <Badge key={index} variant="outline" className="bg-background text-foreground border">
                                  {factor.description}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                              <Clock className="inline-block h-3.5 w-3.5 mr-1" />
                              Due: {format(new Date(risk.dueDate), "MMM d")} ({risk.daysRemaining} days left)
                            </div>
                            <div className="flex gap-2">
                              {risk.riskLevel !== "on-track" && !risk.isAcknowledged && (
                                <Button variant="outline" size="sm" onClick={() => acknowledgeRisk(risk.milestoneId)}>
                                  <Bell className="h-3.5 w-3.5 mr-1" />
                                  Acknowledge
                                </Button>
                              )}
                              <Button
                                variant={risk.riskLevel === "high" ? "default" : "outline"}
                                size="sm"
                                onClick={() => onTakeAction(risk.milestoneId, "prioritize")}
                              >
                                <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                Take Action
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
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

// Helper function to assess risks for milestones
function assessRisks(milestones: ProjectMilestone[]): MilestoneRisk[] {
  const now = new Date()

  return milestones.map((milestone) => {
    const dueDate = new Date(milestone.dueDate)
    const daysRemaining = differenceInDays(dueDate, now)

    // Calculate expected progress based on time elapsed
    const totalDuration = differenceInDays(dueDate, new Date(milestone.dueDate))
    const timeElapsedPercent = totalDuration > 0 ? ((totalDuration - daysRemaining) / totalDuration) * 100 : 100
    const expectedProgress = Math.min(Math.round(timeElapsedPercent), 100)

    // Identify risk factors
    const riskFactors: MilestoneRisk["riskFactors"] = []

    // Progress risk
    if (milestone.progress < expectedProgress - 20) {
      riskFactors.push({
        type: "progress",
        description: "Behind schedule",
        severity: 8,
      })
    } else if (milestone.progress < expectedProgress - 10) {
      riskFactors.push({
        type: "progress",
        description: "Slightly behind schedule",
        severity: 5,
      })
    }

    // Deadline risk
    if (daysRemaining < 0) {
      riskFactors.push({
        type: "deadline",
        description: "Overdue",
        severity: 10,
      })
    } else if (daysRemaining < 3) {
      riskFactors.push({
        type: "deadline",
        description: "Due very soon",
        severity: 7,
      })
    } else if (daysRemaining < 7) {
      riskFactors.push({
        type: "deadline",
        description: "Due this week",
        severity: 4,
      })
    }

    // Dependency risk
    if (milestone.dependencies && milestone.dependencies.length > 0) {
      const dependencyDelayed = milestones.some((m) => milestone.dependencies?.includes(m.id) && m.status === "delayed")

      if (dependencyDelayed) {
        riskFactors.push({
          type: "dependencies",
          description: "Blocked by delayed dependency",
          severity: 9,
        })
      }
    }

    // Determine overall risk level
    let riskLevel: RiskLevel = "on-track"
    const maxSeverity = riskFactors.length > 0 ? Math.max(...riskFactors.map((f) => f.severity)) : 0

    if (maxSeverity >= 8) {
      riskLevel = "high"
    } else if (maxSeverity >= 5) {
      riskLevel = "medium"
    } else if (maxSeverity > 0) {
      riskLevel = "low"
    }

    return {
      milestoneId: milestone.id,
      milestoneTitle: milestone.title,
      riskLevel,
      riskFactors,
      dueDate: milestone.dueDate,
      progress: milestone.progress,
      expectedProgress,
      daysRemaining,
      isAcknowledged: false,
    }
  })
}
