"use client"

import { useState } from "react"
import { format, addDays, addWeeks, addMonths, addYears } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Edit, MapPin, MoreHorizontal, Repeat, Trash, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useTimezone } from "@/lib/timezone-context"

// Types
interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
}

interface RecurrencePattern {
  type: "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
  interval: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  monthOfYear?: number
  endType: "never" | "after" | "on"
  endAfterOccurrences?: number
  endDate?: string
}

interface RecurringMeeting {
  id: string
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  timezone: string
  startDate: string
  recurrencePattern: RecurrencePattern
  attendees: string[]
  organizer: string
  createdAt: string
}

interface RecurringMeetingListProps {
  meetings: RecurringMeeting[]
  teamMembers: TeamMember[]
  onEdit: (meeting: RecurringMeeting) => void
  onDelete: (meetingId: string, deleteOption: "single" | "future" | "all") => Promise<void>
}

export function RecurringMeetingList({ meetings, teamMembers, onEdit, onDelete }: RecurringMeetingListProps) {
  const { toast } = useToast()
  const { preferences, formatTimeWithTimezone } = useTimezone()
  const [selectedMeeting, setSelectedMeeting] = useState<RecurringMeeting | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteOption, setDeleteOption] = useState<"single" | "future" | "all">("single")
  const [isLoading, setIsLoading] = useState(false)

  // Get team member by ID
  const getTeamMember = (id: string) => {
    return teamMembers.find((member) => member.id === id)
  }

  // Format recurrence pattern as text
  const formatRecurrencePattern = (pattern: RecurrencePattern) => {
    let text = ""

    switch (pattern.type) {
      case "daily":
        text = pattern.interval === 1 ? "Daily" : `Every ${pattern.interval} days`
        break
      case "weekly":
        text = pattern.interval === 1 ? "Weekly" : `Every ${pattern.interval} weeks`
        break
      case "biweekly":
        text = "Every 2 weeks"
        break
      case "monthly":
        text = pattern.interval === 1 ? "Monthly" : `Every ${pattern.interval} months`
        break
      case "yearly":
        text = pattern.interval === 1 ? "Yearly" : `Every ${pattern.interval} years`
        break
    }

    if (pattern.endType === "after" && pattern.endAfterOccurrences) {
      text += `, ${pattern.endAfterOccurrences} times`
    } else if (pattern.endType === "on" && pattern.endDate) {
      text += `, until ${format(new Date(pattern.endDate), "MMM d, yyyy")}`
    }

    return text
  }

  // Generate the next few occurrences of a recurring meeting
  const getNextOccurrences = (meeting: RecurringMeeting, count = 5) => {
    const occurrences = []
    const startDate = new Date(meeting.startDate)
    const pattern = meeting.recurrencePattern
    let currentDate = new Date(startDate)
    let occurrenceCount = 0

    // Check if we've reached the end date or max occurrences
    const hasReachedEnd = () => {
      if (pattern.endType === "after" && pattern.endAfterOccurrences) {
        return occurrenceCount >= pattern.endAfterOccurrences
      } else if (pattern.endType === "on" && pattern.endDate) {
        return currentDate > new Date(pattern.endDate)
      }
      return false
    }

    // Add the first occurrence
    occurrences.push(new Date(startDate))
    occurrenceCount++

    // Generate subsequent occurrences
    while (occurrences.length < count && !hasReachedEnd()) {
      let nextDate: Date

      switch (pattern.type) {
        case "daily":
          nextDate = addDays(currentDate, pattern.interval)
          break
        case "weekly":
          nextDate = addDays(currentDate, 7 * pattern.interval)
          break
        case "biweekly":
          nextDate = addWeeks(currentDate, 2 * pattern.interval)
          break
        case "monthly":
          nextDate = addMonths(currentDate, pattern.interval)
          break
        case "yearly":
          nextDate = addYears(currentDate, pattern.interval)
          break
        default:
          nextDate = addDays(currentDate, 1)
      }

      currentDate = nextDate
      occurrences.push(new Date(currentDate))
      occurrenceCount++
    }

    return occurrences
  }

  // Handle delete meeting
  const handleDelete = async () => {
    if (!selectedMeeting) return

    setIsLoading(true)
    try {
      await onDelete(selectedMeeting.id, deleteOption)
      setIsDeleteDialogOpen(false)
      setSelectedMeeting(null)

      let message = ""
      switch (deleteOption) {
        case "single":
          message = "This occurrence of the meeting has been deleted."
          break
        case "future":
          message = "This and all future occurrences of the meeting have been deleted."
          break
        case "all":
          message = "All occurrences of the meeting have been deleted."
          break
      }

      toast({
        title: "Meeting deleted",
        description: message,
      })
    } catch (error) {
      console.error("Error deleting meeting:", error)
      toast({
        title: "Error",
        description: "Failed to delete the meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {meetings.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Repeat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No recurring meetings</h3>
          <p className="text-sm text-muted-foreground mt-1">Schedule a recurring meeting to see it listed here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate">{meeting.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMeeting(meeting)
                          setIsDetailsOpen(true)
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(meeting)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Meeting
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMeeting(meeting)
                          setDeleteOption("single")
                          setIsDeleteDialogOpen(true)
                        }}
                        className="text-destructive"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete This Occurrence
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMeeting(meeting)
                          setDeleteOption("future")
                          setIsDeleteDialogOpen(true)
                        }}
                        className="text-destructive"
                      >
                        Delete This & Future Occurrences
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMeeting(meeting)
                          setDeleteOption("all")
                          setIsDeleteDialogOpen(true)
                        }}
                        className="text-destructive"
                      >
                        Delete All Occurrences
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="flex items-center mt-1">
                  <Repeat className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{formatRecurrencePattern(meeting.recurrencePattern)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-2" />
                    <span>
                      {formatTimeWithTimezone(meeting.startTime, meeting.timezone)} -
                      {formatTimeWithTimezone(meeting.endTime, meeting.timezone)}
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mr-2" />
                    <span className="truncate">{meeting.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <div className="flex -space-x-2 mr-2">
                      {meeting.attendees.slice(0, 3).map((attendeeId) => {
                        const attendee = getTeamMember(attendeeId)
                        return attendee ? (
                          <Avatar key={attendeeId} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                            <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : null
                      })}
                      {meeting.attendees.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{meeting.attendees.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full">
                  <p className="text-xs font-medium mb-1">Next occurrences:</p>
                  <div className="space-y-1">
                    {getNextOccurrences(meeting, 3).map((date, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{format(date, "EEE, MMM d, yyyy")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Meeting Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedMeeting && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedMeeting.title}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="occurrences">Occurrences</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedMeeting.description || "No description provided."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Time</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatTimeWithTimezone(selectedMeeting.startTime, selectedMeeting.timezone)} -
                      {formatTimeWithTimezone(selectedMeeting.endTime, selectedMeeting.timezone)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Location</h4>
                    <p className="text-sm text-muted-foreground">{selectedMeeting.location}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Recurrence</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatRecurrencePattern(selectedMeeting.recurrencePattern)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Starting from {format(new Date(selectedMeeting.startDate), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Attendees ({selectedMeeting.attendees.length})</h4>
                  <div className="mt-2 space-y-2">
                    {selectedMeeting.attendees.map((attendeeId) => {
                      const attendee = getTeamMember(attendeeId)
                      return attendee ? (
                        <div key={attendeeId} className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                            <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {attendee.name}
                            {attendeeId === selectedMeeting.organizer && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Organizer
                              </Badge>
                            )}
                          </span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="occurrences" className="pt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Upcoming Occurrences</h4>
                  <div className="border rounded-md divide-y">
                    {getNextOccurrences(selectedMeeting, 10).map((date, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTimeWithTimezone(selectedMeeting.startTime, selectedMeeting.timezone)} -
                            {formatTimeWithTimezone(selectedMeeting.endTime, selectedMeeting.timezone)}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit This Occurrence</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Cancel This Occurrence</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsDetailsOpen(false)
                  onEdit(selectedMeeting)
                }}
              >
                Edit Meeting
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recurring Meeting</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteOption === "single" && "This will delete only this occurrence of the meeting."}
              {deleteOption === "future" && "This will delete this and all future occurrences of the meeting."}
              {deleteOption === "all" && "This will delete all occurrences of the meeting."}
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
