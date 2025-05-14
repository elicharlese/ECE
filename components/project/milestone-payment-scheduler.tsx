"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Info, Trash2 } from "lucide-react"
import { format, addDays } from "date-fns"

interface Milestone {
  id: string
  name: string
  description: string
  date: Date
  amount: string
  isInitial?: boolean
}

interface MilestonePaymentSchedulerProps {
  onSchedule: (milestones: Milestone[]) => void
  onCancel: () => void
  initialMilestones?: Milestone[]
}

export function MilestonePaymentScheduler({ onSchedule, onCancel, initialMilestones }: MilestonePaymentSchedulerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(
    initialMilestones || [
      {
        id: "1",
        name: "Initial Payment",
        description: "Payment due upon project start",
        date: new Date(),
        amount: "0",
        isInitial: true,
      },
      {
        id: "2",
        name: "Final Delivery",
        description: "Payment due upon project completion",
        date: addDays(new Date(), 14),
        amount: "0",
      },
    ],
  )
  const [enableReminder, setEnableReminder] = useState(true)
  const [reminderDays, setReminderDays] = useState("3")

  const addMilestone = () => {
    const newId = (milestones.length + 1).toString()
    const lastMilestoneDate = milestones[milestones.length - 1].date

    const newMilestone: Milestone = {
      id: newId,
      name: "",
      description: "",
      date: new Date(lastMilestoneDate.getTime() + 86400000), // Next day
      amount: "0",
    }

    setMilestones([...milestones, newMilestone])
  }

  const removeMilestone = (id: string) => {
    if (milestones.length <= 2) return // Keep at least 2 milestones
    setMilestones(milestones.filter((milestone) => milestone.id !== id))
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    setMilestones(milestones.map((milestone) => (milestone.id === id ? { ...milestone, [field]: value } : milestone)))
  }

  const handleSchedule = () => {
    onSchedule(milestones)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Milestone Payments</h3>
          <div className="flex items-center space-x-2">
            <Switch id="enable-reminder" checked={enableReminder} onCheckedChange={setEnableReminder} />
            <Label htmlFor="enable-reminder">Send payment reminders</Label>
          </div>
        </div>

        {enableReminder && (
          <div className="flex items-center space-x-4">
            <Label htmlFor="reminder-days" className="whitespace-nowrap">
              Remind me
            </Label>
            <Select value={reminderDays} onValueChange={setReminderDays}>
              <SelectTrigger id="reminder-days" className="w-full max-w-[200px]">
                <SelectValue placeholder="Select days before" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day before</SelectItem>
                <SelectItem value="2">2 days before</SelectItem>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="5">5 days before</SelectItem>
                <SelectItem value="7">1 week before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Milestone List */}
      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="border border-input rounded-md p-4 relative">
            <div className="absolute left-4 top-4 flex flex-col items-center">
              <div className="flex items-center justify-center h-6 w-6 text-muted-foreground">
                <span>::</span>
              </div>
            </div>

            <div className="ml-8 space-y-4">
              <div className="flex justify-between items-center">
                <Input
                  placeholder="Name this milestone"
                  value={milestone.name}
                  onChange={(e) => updateMilestone(milestone.id, "name", e.target.value)}
                  className="border-none text-base font-medium p-0 h-auto focus-visible:ring-0"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMilestone(milestone.id)}
                  disabled={milestones.length <= 2 || milestone.isInitial}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              <Textarea
                placeholder="Include specific deliverables and other notes here"
                value={milestone.description}
                onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                className="min-h-[80px] resize-none"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {milestone.date ? format(milestone.date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={milestone.date}
                        onSelect={(date) => date && updateMilestone(milestone.id, "date", date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center">
                  {milestone.isInitial && (
                    <div className="mr-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <p className="text-sm">
                            This is the initial payment that will be charged when the client accepts the proposal.
                          </p>
                        </PopoverContent>
                      </Popover>
                      <span className="text-xs text-muted-foreground ml-1">Initial payment</span>
                    </div>
                  )}
                  <div className="flex items-center flex-1">
                    <span className="mr-2">$</span>
                    <Input
                      value={milestone.amount}
                      onChange={(e) => updateMilestone(milestone.id, "amount", e.target.value)}
                      placeholder="0.00"
                      className="flex-1"
                    />
                    <span className="ml-2">USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addMilestone} className="w-full flex items-center justify-center">
          <span className="mr-2">+</span> Add another milestone
        </Button>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSchedule}>Schedule Payments</Button>
      </div>
    </div>
  )
}
