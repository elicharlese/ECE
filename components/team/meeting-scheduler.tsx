"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { TimezoneSelector } from "@/components/team/timezone-selector"
import { useTimezone } from "@/lib/timezone-context"
import { RecurrencePatternSelector, type RecurrencePattern } from "@/components/meeting/recurrence-pattern-selector"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DialogFooter } from "@/components/ui/dialog"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  availability?: Array<{
    day: Date
    startTime: string
    endTime: string
    status: string
  }>
}

interface MeetingSchedulerProps {
  teamMembers: TeamMember[]
  onSchedule: () => void
  onCancel: () => void
}

export function MeetingScheduler({ teamMembers, onSchedule, onCancel }: MeetingSchedulerProps) {
  const { toast } = useToast()
  const { preferences, convertTime } = useTimezone()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [location, setLocation] = useState("Virtual Meeting")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])
  const [isRecurring, setIsRecurring] = useState(false)
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false)
  const [timezone, setTimezone] = useState(preferences.userTimezone)
  const [isLoading, setIsLoading] = useState(false)
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>({
    type: "weekly",
    interval: 1,
    daysOfWeek: date ? [date.getDay()] : [1], // Default to the day of the selected date, or Monday
    endType: "never",
  })

  // Generate time options
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        options.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  // Toggle attendee selection
  const toggleAttendee = (id: string) => {
    if (selectedAttendees.includes(id)) {
      setSelectedAttendees(selectedAttendees.filter((attendeeId) => attendeeId !== id))
    } else {
      setSelectedAttendees([...selectedAttendees, id])
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !date || !startTime || !endTime || selectedAttendees.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select at least one attendee.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would send the meeting data to the server
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const meetingData = {
        title,
        description,
        date: format(date, "yyyy-MM-dd"),
        startTime,
        endTime,
        location,
        timezone,
        attendees: selectedAttendees,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : undefined,
      }

      console.log("Scheduling meeting:", meetingData)

      toast({
        title: "Meeting scheduled",
        description: `${title} has been scheduled for ${format(date, "MMMM d, yyyy")} at ${startTime}.`,
      })

      onSchedule()
    } catch (error) {
      console.error("Error scheduling meeting:", error)
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Convert time to user's timezone for display
  const displayTime = (time: string) => {
    if (!date) return time

    const dateStr = format(date, "yyyy-MM-dd")
    return convertTime(time, dateStr, timezone, preferences.userTimezone)
  }

  // Get recurrence summary
  const getRecurrenceSummary = () => {
    if (!isRecurring) return "One-time meeting"

    try {
      let summary = ""

      switch (recurrencePattern.type) {
        case "daily":
          summary = recurrencePattern.interval === 1 ? "Daily" : `Every ${recurrencePattern.interval} days`
          break
        case "weekly":
          summary = recurrencePattern.interval === 1 ? "Weekly" : `Every ${recurrencePattern.interval} weeks`
          break
        case "biweekly":
          summary = "Every 2 weeks"
          break
        case "monthly":
          summary = recurrencePattern.interval === 1 ? "Monthly" : `Every ${recurrencePattern.interval} months`
          break
        case "yearly":
          summary = recurrencePattern.interval === 1 ? "Yearly" : `Every ${recurrencePattern.interval} years`
          break
        default:
          return "Unknown pattern"
      }

      // Add end condition
      if (recurrencePattern.endType === "never") {
        // Don't add anything for "never ends"
      } else if (recurrencePattern.endType === "after" && recurrencePattern.endAfterOccurrences) {
        summary += `, ${recurrencePattern.endAfterOccurrences} times`
      } else if (recurrencePattern.endType === "on" && recurrencePattern.endDate) {
        summary += `, until ${format(recurrencePattern.endDate, "MMM d, yyyy")}`
      }

      return summary
    } catch (error) {
      console.error("Error generating recurrence summary:", error)
      return "Error generating recurrence summary"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Meeting Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter meeting title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter meeting description"
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <TimezoneSelector value={timezone} onValueChange={setTimezone} showLabel={false} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger id="startTime" className="w-full">
              <SelectValue placeholder="Select start time">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{displayTime(startTime)}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {displayTime(time)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger id="endTime" className="w-full">
              <SelectValue placeholder="Select end time">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{displayTime(endTime)}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeOptions
                .filter((time) => time > startTime)
                .map((time) => (
                  <SelectItem key={time} value={time}>
                    {displayTime(time)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter meeting location"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="isRecurring" checked={isRecurring} onCheckedChange={(checked) => setIsRecurring(!!checked)} />
            <Label htmlFor="isRecurring" className="cursor-pointer">
              Recurring Meeting
            </Label>
          </div>
          {isRecurring && (
            <Dialog open={showRecurrenceDialog} onOpenChange={setShowRecurrenceDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Edit Recurrence
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Recurrence Pattern</DialogTitle>
                  <DialogDescription>Set how often this meeting should repeat</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <RecurrencePatternSelector
                    startDate={date || new Date()}
                    value={recurrencePattern}
                    onChange={setRecurrencePattern}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={() => setShowRecurrenceDialog(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {isRecurring && <div className="text-sm text-muted-foreground pl-6 pt-1">{getRecurrenceSummary()}</div>}
      </div>

      <div className="space-y-2">
        <Label>Attendees</Label>
        <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
          {teamMembers.length > 0 ? (
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`attendee-${member.id}`}
                    checked={selectedAttendees.includes(member.id)}
                    onCheckedChange={() => toggleAttendee(member.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Label htmlFor={`attendee-${member.id}`} className="flex-1 cursor-pointer">
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No team members available</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Scheduling..." : "Schedule Meeting"}
        </Button>
      </div>
    </form>
  )
}
