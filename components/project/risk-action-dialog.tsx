"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { CalendarIcon, Users, Clock, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProjectMilestone } from "./project-tracker"

interface RiskActionDialogProps {
  milestone: ProjectMilestone | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction: (
    milestoneId: string,
    action: "extend" | "allocate" | "prioritize",
    data: { [key: string]: any },
  ) => Promise<void>
}

export function RiskActionDialog({ milestone, open, onOpenChange, onAction }: RiskActionDialogProps) {
  const [activeTab, setActiveTab] = useState("extend")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date | undefined>(milestone ? addDays(new Date(milestone.dueDate), 7) : undefined)
  const [resources, setResources] = useState(2)
  const [priority, setPriority] = useState("high")
  const [justification, setJustification] = useState("")

  if (!milestone) return null

  const handleAction = async () => {
    if (!milestone) return

    setIsSubmitting(true)

    try {
      let actionData = {}

      switch (activeTab) {
        case "extend":
          actionData = { newDueDate: date, justification }
          break
        case "allocate":
          actionData = { additionalResources: resources, justification }
          break
        case "prioritize":
          actionData = { newPriority: priority, justification }
          break
      }

      await onAction(milestone.id, activeTab as any, actionData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error taking action:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Take Action on At-Risk Milestone</DialogTitle>
          <DialogDescription>
            Address the risk for milestone: <span className="font-medium">{milestone.title}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="extend" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="extend">
              <Clock className="h-4 w-4 mr-2" />
              Extend Deadline
            </TabsTrigger>
            <TabsTrigger value="allocate">
              <Users className="h-4 w-4 mr-2" />
              Add Resources
            </TabsTrigger>
            <TabsTrigger value="prioritize">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Prioritize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="extend" className="space-y-4">
            <div className="space-y-2">
              <Label>Current Due Date</Label>
              <div className="p-2 border rounded-md bg-muted/50">
                {format(new Date(milestone.dueDate), "MMMM d, yyyy")}
              </div>
            </div>

            <div className="space-y-2">
              <Label>New Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extend-justification">Justification</Label>
              <Input
                id="extend-justification"
                placeholder="Explain why the deadline needs to be extended"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="allocate" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resources">Additional Resources Needed</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="resources"
                  type="number"
                  min={1}
                  max={10}
                  value={resources}
                  onChange={(e) => setResources(Number.parseInt(e.target.value))}
                />
                <span>team members</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allocate-justification">Justification</Label>
              <Input
                id="allocate-justification"
                placeholder="Explain why additional resources are needed"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="prioritize" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="priority">New Priority Level</Label>
              <select
                id="priority"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="critical">Critical - Highest Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioritize-justification">Justification</Label>
              <Input
                id="prioritize-justification"
                placeholder="Explain why this milestone needs to be prioritized"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAction} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Action"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
