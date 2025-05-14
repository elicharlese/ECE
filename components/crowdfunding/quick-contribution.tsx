"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Zap, Clock, ChevronRight, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

type QuickContributionProps = {
  className?: string
  compact?: boolean
  showTitle?: boolean
}

type Project = {
  id: string
  name: string
  image: string
  progress: number
  goal: number
  raised: number
  daysLeft: number
  trending?: boolean
  hot?: boolean
  endingSoon?: boolean
  category: string
  defaultAmounts: number[]
}

export function QuickContribution({ className, compact = false, showTitle = true }: QuickContributionProps) {
  const { toast } = useToast()
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [contributionAmounts, setContributionAmounts] = useState<Record<string, number>>({})

  // Sample popular projects
  const popularProjects: Project[] = [
    {
      id: "proj1",
      name: "DeFi Protocol",
      image: "/defi-concept.png",
      progress: 68,
      goal: 50000,
      raised: 34000,
      daysLeft: 12,
      trending: true,
      category: "DeFi",
      defaultAmounts: [50, 100, 250, 500],
    },
    {
      id: "proj3",
      name: "Zero-Knowledge Proofs",
      image: "/privacy-concept.png",
      progress: 92,
      goal: 75000,
      raised: 69000,
      daysLeft: 5,
      hot: true,
      category: "Privacy",
      defaultAmounts: [100, 250, 500, 1000],
    },
    {
      id: "proj4",
      name: "Decentralized Storage",
      image: "/organized-storage.png",
      progress: 25,
      goal: 40000,
      raised: 10000,
      daysLeft: 21,
      category: "Infrastructure",
      defaultAmounts: [25, 50, 100, 250],
    },
    {
      id: "proj6",
      name: "Blockchain Bridge",
      image: "/suspension-bridge-fog.png",
      progress: 45,
      goal: 60000,
      raised: 27000,
      daysLeft: 8,
      endingSoon: true,
      category: "Infrastructure",
      defaultAmounts: [50, 100, 250, 500],
    },
  ]

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId === selectedProject ? null : projectId)

    // Initialize contribution amount if not already set
    if (!contributionAmounts[projectId]) {
      const project = popularProjects.find((p) => p.id === projectId)
      if (project) {
        setContributionAmounts({
          ...contributionAmounts,
          [projectId]: project.defaultAmounts[0],
        })
      }
    }
  }

  const handleContribute = (projectId: string) => {
    const project = popularProjects.find((p) => p.id === projectId)
    const amount = contributionAmounts[projectId] || 0

    if (project && amount > 0) {
      // In a real app, this would call an API to process the contribution
      toast({
        title: "Contribution Successful!",
        description: `You've contributed ${amount} ECE to ${project.name}`,
        variant: "success",
      })

      // Reset selection
      setSelectedProject(null)
    }
  }

  const adjustAmount = (projectId: string, increment: boolean) => {
    const project = popularProjects.find((p) => p.id === projectId)
    if (!project) return

    const currentAmount = contributionAmounts[projectId] || project.defaultAmounts[0]
    const defaultAmounts = project.defaultAmounts

    let newIndex = defaultAmounts.indexOf(currentAmount)
    if (newIndex === -1) {
      // If current amount is not in default amounts, find closest
      newIndex = defaultAmounts.findIndex((a) => a > currentAmount) - 1
      if (newIndex < 0) newIndex = 0
    }

    if (increment && newIndex < defaultAmounts.length - 1) {
      newIndex++
    } else if (!increment && newIndex > 0) {
      newIndex--
    }

    setContributionAmounts({
      ...contributionAmounts,
      [projectId]: defaultAmounts[newIndex],
    })
  }

  return (
    <div className={className}>
      {showTitle && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm">Quick Contribute</h3>
          <Link href="/app/crowdfunding" className="text-xs text-primary hover:underline flex items-center">
            View All <ChevronRight className="h-3 w-3 ml-0.5" />
          </Link>
        </div>
      )}

      <div className={cn("space-y-2", compact ? "max-h-[300px] overflow-y-auto pr-1" : "")}>
        {popularProjects.map((project) => (
          <Card
            key={project.id}
            className={cn(
              "overflow-hidden transition-all border-border/50 hover:border-primary/30",
              selectedProject === project.id ? "ring-1 ring-primary" : "",
            )}
          >
            <CardContent className="p-0">
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => handleSelectProject(project.id)}
              >
                <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                  <img src={project.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="font-medium text-sm truncate">{project.name}</h4>
                    <div className="flex gap-1">
                      {project.trending && (
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 py-0 px-1.5 h-4 text-[10px] rounded-sm"
                        >
                          <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                          Trending
                        </Badge>
                      )}
                      {project.hot && (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 py-0 px-1.5 h-4 text-[10px] rounded-sm"
                        >
                          <Zap className="h-2.5 w-2.5 mr-0.5" />
                          Hot
                        </Badge>
                      )}
                      {project.endingSoon && (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 py-0 px-1.5 h-4 text-[10px] rounded-sm"
                        >
                          <Clock className="h-2.5 w-2.5 mr-0.5" />
                          Ending Soon
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-1.5">
                    <span>{project.category}</span>
                    <span>{project.daysLeft} days left</span>
                  </div>

                  <Progress value={project.progress} className="h-1.5 bg-muted" />

                  <div className="flex justify-between text-xs mt-1">
                    <span className="font-medium">{project.progress}%</span>
                    <span>
                      {project.raised.toLocaleString()} / {project.goal.toLocaleString()} ECE
                    </span>
                  </div>
                </div>
              </div>

              {selectedProject === project.id && (
                <div className="p-3 pt-0 border-t border-border/30 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Contribution Amount:</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => adjustAmount(project.id, false)}
                          disabled={contributionAmounts[project.id] === project.defaultAmounts[0]}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease</span>
                        </Button>

                        <span className="text-sm font-medium w-16 text-center">
                          {contributionAmounts[project.id] || project.defaultAmounts[0]} ECE
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => adjustAmount(project.id, true)}
                          disabled={
                            contributionAmounts[project.id] ===
                            project.defaultAmounts[project.defaultAmounts.length - 1]
                          }
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                      {project.defaultAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "text-xs h-7 px-2 flex-1",
                            contributionAmounts[project.id] === amount
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "",
                          )}
                          onClick={() =>
                            setContributionAmounts({
                              ...contributionAmounts,
                              [project.id]: amount,
                            })
                          }
                        >
                          {amount} ECE
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-1">
                      <Button variant="outline" className="flex-1 text-sm h-8" onClick={() => setSelectedProject(null)}>
                        Cancel
                      </Button>
                      <Button className="flex-1 text-sm h-8" onClick={() => handleContribute(project.id)}>
                        Contribute
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
