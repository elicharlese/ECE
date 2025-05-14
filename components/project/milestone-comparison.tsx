"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import type { ProjectMilestone } from "@/components/project/project-tracker"
import { MilestoneDependencyInfo } from "./milestone-dependency-info"

interface MilestoneComparisonProps {
  milestones: ProjectMilestone[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MilestoneComparison({ milestones, open, onOpenChange }: MilestoneComparisonProps) {
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([])

  const handleMilestoneSelection = (milestoneId: string) => {
    setSelectedMilestones((prev) => {
      if (prev.includes(milestoneId)) {
        return prev.filter((id) => id !== milestoneId)
      } else {
        return [...prev, milestoneId]
      }
    })
  }

  const isMilestoneSelected = (milestoneId: string) => selectedMilestones.includes(milestoneId)

  const milestonesToCompare = milestones.filter((milestone) => selectedMilestones.includes(milestone.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Milestone Comparison</DialogTitle>
          <DialogDescription>Compare milestones side by side to identify key differences</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Milestone Selection */}
          <div className="space-y-2">
            <h4 className="font-medium">Select Milestones</h4>
            <ScrollArea className="h-[300px] pr-2">
              <div className="space-y-1">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center">
                    <Checkbox
                      id={`milestone-${milestone.id}`}
                      checked={isMilestoneSelected(milestone.id)}
                      onCheckedChange={() => handleMilestoneSelection(milestone.id)}
                    />
                    <label htmlFor={`milestone-${milestone.id}`} className="ml-2 text-sm font-medium cursor-pointer">
                      {milestone.title}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Comparison View */}
          <div className="space-y-2">
            <h4 className="font-medium">Comparison</h4>
            {milestonesToCompare.length === 0 ? (
              <p className="text-muted-foreground">Select milestones to compare</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th></th>
                      {selectedMilestones.map((milestoneId) => {
                        const milestone = milestones.find((m) => m.id === milestoneId)
                        return (
                          milestone && (
                            <th key={milestone.id} className="px-4 py-2">
                              {milestone.title}
                            </th>
                          )
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 font-medium">Description</td>
                      {selectedMilestones.map((milestoneId) => {
                        const milestone = milestones.find((m) => m.id === milestoneId)
                        return (
                          milestone && (
                            <td key={`${milestone.id}-description`} className="px-4 py-2">
                              {milestone.description}
                            </td>
                          )
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Due Date</td>
                      {selectedMilestones.map((milestoneId) => {
                        const milestone = milestones.find((m) => m.id === milestoneId)
                        return (
                          milestone && (
                            <td key={`${milestone.id}-dueDate`} className="px-4 py-2">
                              {format(new Date(milestone.dueDate), "MMM d, yyyy")}
                            </td>
                          )
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Status</td>
                      {selectedMilestones.map((milestoneId) => {
                        const milestone = milestones.find((m) => m.id === milestoneId)
                        return (
                          milestone && (
                            <td key={`${milestone.id}-status`} className="px-4 py-2">
                              {milestone.status}
                            </td>
                          )
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Payment</td>
                      {selectedMilestones.map((milestoneId) => {
                        const milestone = milestones.find((m) => m.id === milestoneId)
                        return (
                          milestone && (
                            <td key={`${milestone.id}-payment`} className="px-4 py-2">
                              {milestone.paymentAmount}
                            </td>
                          )
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Dependencies</td>
                      {selectedMilestones.map((milestoneId) => {
                        const milestone = milestones.find((m) => m.id === milestoneId)
                        return (
                          milestone && (
                            <td key={`${milestone.id}-dependencies`} className="px-4 py-2">
                              <MilestoneDependencyInfo milestone={milestone} allMilestones={milestones} />
                            </td>
                          )
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
