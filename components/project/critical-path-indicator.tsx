import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle } from "lucide-react"
import type { ProjectMilestone } from "./project-tracker"

interface CriticalPathIndicatorProps {
  milestone: ProjectMilestone
  allMilestones: ProjectMilestone[]
  isOnCriticalPath: boolean
}

export function CriticalPathIndicator({ milestone, allMilestones, isOnCriticalPath }: CriticalPathIndicatorProps) {
  if (!isOnCriticalPath) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            Critical Path
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>This milestone is on the critical path. Any delay will impact the overall project timeline.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
