"use client"

import { useState } from "react"
import { format, isSameDay } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock, Plus } from "lucide-react"
import { TeamAvailabilityEditor } from "./team-availability-editor"

interface TeamMemberScheduleProps {
  member: {
    id: string
    name: string
    role: string
    avatar: string
    availability: Array<{
      day: Date
      startTime: string
      endTime: string
      status: string
    }>
  }
  date: Date
  meetings: Array<{
    id: string
    title: string
    date: Date
    startTime: string
    endTime: string
    attendees: string[]
    location: string
  }>
}

export function TeamMemberSchedule({ member, date, meetings }: TeamMemberScheduleProps) {
  const [showAvailabilityEditor, setShowAvailabilityEditor] = useState(false)

  // Filter availability for the selected date
  const dayAvailability = member.availability.filter((slot) => isSameDay(slot.day, date))

  // Handle saving new availability
  const handleSaveAvailability = (availability: {
    day: Date
    startTime: string
    endTime: string
    status: string
  }) => {
    // In a real app, this would update the database
    console.log("Saving availability:", availability)
    setShowAvailabilityEditor(false)
  }

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <Dialog open={showAvailabilityEditor} onOpenChange={setShowAvailabilityEditor}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Availability for {member.name}</DialogTitle>
            </DialogHeader>
            <TeamAvailabilityEditor
              onSave={handleSaveAvailability}
              onCancel={() => setShowAvailabilityEditor(false)}
              initialValues={{
                day: date,
                startTime: "09:00",
                endTime: "17:00",
                status: "available",
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Availability for {format(date, "MMMM d, yyyy")}</h4>

        {dayAvailability.length > 0 ? (
          <div className="space-y-2">
            {dayAvailability.map((slot, idx) => (
              <div
                key={idx}
                className={`p-2 rounded flex items-center ${
                  slot.status === "available"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {slot.startTime} - {slot.endTime} ({slot.status})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-muted-foreground border border-dashed rounded-md">
            No availability set for this day
          </div>
        )}

        {meetings.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Meetings</h4>
            <div className="space-y-2">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-2 border rounded-md bg-primary/10">
                  <p className="font-medium">{meeting.title}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {meeting.startTime} - {meeting.endTime} • {meeting.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
