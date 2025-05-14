"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Zap, Clock, X, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type FloatingQuickContributionProps = {
  className?: string
  onClose: () => void
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
  quickAmounts: number[]
}

export function FloatingQuickContribution({ className, onClose }: FloatingQuickContributionProps) {
  const { toast } = useToast()
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  // Sample trending projects
  const trendingProjects: Project[] = [
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
      quickAmounts: [50, 100, 250, 500],
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
      quickAmounts: [100, 250, 500, 1000],
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
      quickAmounts: [25, 50, 100, 250],
    },
  ]

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId)
    setSelectedAmount(null)
  }

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount)
  }

  const handleContribute = () => {
    if (!selectedProject || !selectedAmount) return

    const project = trendingProjects.find((p) => p.id === selectedProject)
    if (!project) return

    // In a real app, this would call an API to process the contribution
    toast({
      title: "Quick Contribution",
      description: `You've contributed ${selectedAmount} ECE to ${project.name}`,
      variant: "success",
    })

    // Reset and close
    setSelectedProject(null)
    setSelectedAmount(null)
    onClose()
  }

  return (
    <Card
      className={cn(
        "w-[320px] shadow-lg bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border-white/20 dark:border-slate-700/30",
        className,
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-3 border-b border-border/30">
          <h3 className="font-medium text-sm flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-primary" />
            Quick Contribute
          </h3>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {!selectedProject ? (
          <div className="p-3">
            <p className="text-xs text-muted-foreground mb-3">Select a trending project to back:</p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {trendingProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden border-border/50 hover:border-primary/30 cursor-pointer transition-all bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border-white/20 dark:border-slate-700/30"
                  onClick={() => handleSelectProject(project.id)}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                        <img src={project.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
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
                          <span>
                            {project.raised.toLocaleString()} / {project.goal.toLocaleString()} ECE
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : !selectedAmount ? (
          <div className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedProject(null)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Back</span>
              </Button>
              <p className="text-xs text-muted-foreground">Select contribution amount:</p>
            </div>

            {(() => {
              const project = trendingProjects.find((p) => p.id === selectedProject)
              if (!project) return null

              return (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                      <img src={project.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {project.category} • {project.daysLeft} days left
                      </p>
                    </div>
                  </div>

                  <Progress value={project.progress} className="h-2 bg-muted mb-2" />

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {project.quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        className={cn(
                          "text-sm h-9",
                          selectedAmount === amount ? "bg-primary/10 border-primary/30 text-primary" : "",
                        )}
                        onClick={() => handleSelectAmount(amount)}
                      >
                        {amount} ECE
                      </Button>
                    ))}
                  </div>

                  <Button className="w-full" disabled={selectedAmount === null} onClick={handleContribute}>
                    Contribute
                  </Button>
                </div>
              )
            })()}
          </div>
        ) : (
          <div className="p-3">
            <p className="text-center text-sm mb-2">Processing contribution...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
