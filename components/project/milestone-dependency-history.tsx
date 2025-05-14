"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { History, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import type { ProjectMilestone } from "./project-tracker"

interface DependencyChange {
  id: string
  date: string
  user: {
    name: string
    avatar?: string
  }
  added: string[]
  removed: string[]
}

interface MilestoneDependencyHistoryProps {
  milestone: ProjectMilestone
  allMilestones: ProjectMilestone[]
  dependencyChanges: DependencyChange[] // In a real app, this would come from your API
}

export function MilestoneDependencyHistory({
  milestone,
  allMilestones,
  dependencyChanges,
}: MilestoneDependencyHistoryProps) {
  const [open, setOpen] = useState(false)

  // Helper function to get milestone title by ID
  const getMilestoneTitle = (id: string) => {
    const found = allMilestones.find((m) => m.id === id)
    return found ? found.title : "Unknown Milestone"
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <History className="h-4 w-4 mr-2" />
        Dependency History
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dependency History for {milestone.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            {dependencyChanges.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No dependency changes recorded.</p>
            ) : (
              <div className="space-y-6">
                {dependencyChanges.map((change) => (
                  <div key={change.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{change.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(change.date), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>

                    {change.added.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                          Added Dependencies:
                        </div>
                        <ul className="text-sm pl-5 space-y-1">
                          {change.added.map((id) => (
                            <li key={`added-${id}`} className="flex items-center">
                              <ArrowRight className="h-3 w-3 mr-1 text-green-500" />
                              {getMilestoneTitle(id)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {change.removed.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-red-600 dark:text-red-400">Removed Dependencies:</div>
                        <ul className="text-sm pl-5 space-y-1">
                          {change.removed.map((id) => (
                            <li key={`removed-${id}`} className="flex items-center">
                              <ArrowRight className="h-3 w-3 mr-1 text-red-500" />
                              {getMilestoneTitle(id)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
