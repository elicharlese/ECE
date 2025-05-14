import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export type FundingMilestone = {
  percentage: number
  title: string
  description: string
}

interface FundingMilestonesProps {
  milestones: FundingMilestone[]
  currentProgress: number
  className?: string
}

export function FundingMilestones({ milestones, currentProgress, className }: FundingMilestonesProps) {
  // Sort milestones by percentage
  const sortedMilestones = [...milestones].sort((a, b) => a.percentage - b.percentage)

  return (
    <div className={cn("space-y-6", className)}>
      <div className="relative">
        <Progress value={currentProgress} className="h-2 bg-muted" />

        <div className="absolute top-0 left-0 w-full flex items-center justify-between transform -translate-y-1/2">
          {sortedMilestones.map((milestone, index) => {
            const isCompleted = currentProgress >= milestone.percentage
            const position = `${milestone.percentage}%`

            return (
              <div key={index} className="absolute transform -translate-x-1/2" style={{ left: position }}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center border-2",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-muted-foreground/30",
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        {sortedMilestones.map((milestone, index) => {
          const isCompleted = currentProgress >= milestone.percentage

          return (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg border transition-colors",
                isCompleted ? "bg-primary/5 border-primary/20" : "bg-card border-border",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{milestone.title}</h4>
                    <Badge
                      variant={isCompleted ? "default" : "outline"}
                      className={cn(
                        "text-xs",
                        isCompleted ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground",
                      )}
                    >
                      {milestone.percentage}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
