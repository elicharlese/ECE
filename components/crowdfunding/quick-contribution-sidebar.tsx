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

type QuickContributionSidebarProps = {
  className?: string
}

type Project = {
  id: string
  name: string
  progress: number
  raised: number
  trending?: boolean
  hot?: boolean
  endingSoon?: boolean
  defaultAmount: number
}

export function QuickContributionSidebar({ className }: QuickContributionSidebarProps) {
  const { toast } = useToast()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [amounts, setAmounts] = useState<Record<string, number>>({})

  // Sample hot projects
  const hotProjects: Project[] = [
    {
      id: "proj1",
      name: "DeFi Protocol",
      progress: 68,
      raised: 34000,
      trending: true,
      defaultAmount: 100,
    },
    {
      id: "proj3",
      name: "Zero-Knowledge Proofs",
      progress: 92,
      raised: 69000,
      hot: true,
      defaultAmount: 250,
    },
    {
      id: "proj6",
      name: "Blockchain Bridge",
      progress: 45,
      raised: 27000,
      endingSoon: true,
      defaultAmount: 100,
    },
  ]

  const handleExpand = (projectId: string) => {
    if (expandedProject === projectId) {
      setExpandedProject(null)
    } else {
      setExpandedProject(projectId)
      // Initialize amount if not set
      if (!amounts[projectId]) {
        const project = hotProjects.find((p) => p.id === projectId)
        if (project) {
          setAmounts({
            ...amounts,
            [projectId]: project.defaultAmount,
          })
        }
      }
    }
  }

  const handleContribute = (projectId: string) => {
    const project = hotProjects.find((p) => p.id === projectId)
    const amount = amounts[projectId] || 0

    if (project && amount > 0) {
      // In a real app, this would call an API to process the contribution
      toast({
        title: "Quick Contribution",
        description: `You've contributed ${amount} ECE to ${project.name}`,
        variant: "success",
      })

      // Reset
      setExpandedProject(null)
    }
  }

  const adjustAmount = (projectId: string, delta: number) => {
    const currentAmount = amounts[projectId] || 0
    const newAmount = Math.max(10, currentAmount + delta)
    setAmounts({
      ...amounts,
      [projectId]: newAmount,
    })
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm">Hot Projects</h3>
        <Link href="/app/crowdfunding" className="text-xs text-primary hover:underline flex items-center">
          View All <ChevronRight className="h-3 w-3 ml-0.5" />
        </Link>
      </div>

      <div className="space-y-2">
        {hotProjects.map((project) => (
          <Card
            key={project.id}
            className={cn(
              "overflow-hidden transition-all border-border/50 bg-white/70 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-slate-700/30 shadow-sm",
              expandedProject === project.id ? "ring-1 ring-primary" : "",
            )}
          >
            <CardContent className="p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="font-medium text-xs truncate">{project.name}</h4>
                    <div className="flex gap-1">
                      {project.trending && (
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 py-0 px-1 h-3.5 text-[9px] rounded-sm"
                        >
                          <TrendingUp className="h-2 w-2 mr-0.5" />
                          Trending
                        </Badge>
                      )}
                      {project.hot && (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 py-0 px-1 h-3.5 text-[9px] rounded-sm"
                        >
                          <Zap className="h-2 w-2 mr-0.5" />
                          Hot
                        </Badge>
                      )}
                      {project.endingSoon && (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 py-0 px-1 h-3.5 text-[9px] rounded-sm"
                        >
                          <Clock className="h-2 w-2 mr-0.5" />
                          Ending
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Progress value={project.progress} className="h-1.5 bg-muted" />

                  <div className="flex justify-between text-[10px] mt-0.5">
                    <span className="font-medium">{project.progress}%</span>
                    <span>{project.raised.toLocaleString()} ECE</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleExpand(project.id)}>
                  {expandedProject === project.id ? "Cancel" : "Back"}
                </Button>
              </div>

              {expandedProject === project.id && (
                <div className="mt-2 pt-2 border-t border-border/30 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Amount:</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => adjustAmount(project.id, -50)}
                      >
                        <Minus className="h-2.5 w-2.5" />
                        <span className="sr-only">Decrease</span>
                      </Button>

                      <span className="text-xs font-medium w-12 text-center">
                        {amounts[project.id] || project.defaultAmount} ECE
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => adjustAmount(project.id, 50)}
                      >
                        <Plus className="h-2.5 w-2.5" />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                  </div>

                  <Button size="sm" className="w-full text-xs h-7" onClick={() => handleContribute(project.id)}>
                    Contribute Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
