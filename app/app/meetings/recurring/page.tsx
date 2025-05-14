"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { RecurringMeetingList } from "@/components/meeting/recurring-meeting-list"
import { MeetingScheduler } from "@/components/team/meeting-scheduler"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "@/lib/demo-context"
import { Plus, Search } from "lucide-react"

// Mock data for demo mode
const mockTeamMembers = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Lead Developer",
    avatar: "/diverse-user-avatars.png",
  },
  {
    id: "2",
    name: "Samantha Lee",
    role: "UX Designer",
    avatar: "/diverse-user-avatars.png",
  },
  {
    id: "3",
    name: "Marcus Chen",
    role: "Backend Developer",
    avatar: "/diverse-user-avatars.png",
  },
  {
    id: "4",
    name: "Priya Patel",
    role: "Project Manager",
    avatar: "/diverse-user-avatars.png",
  },
  {
    id: "5",
    name: "David Kim",
    role: "DevOps Engineer",
    avatar: "/diverse-user-avatars.png",
  },
]

const mockRecurringMeetings = [
  {
    id: "rm1",
    title: "Sprint Planning",
    description: "Weekly team sprint planning session to discuss tasks and priorities for the upcoming sprint.",
    location: "Main Conference Room",
    startTime: "10:00",
    endTime: "11:00",
    timezone: "America/New_York",
    startDate: "2023-06-05",
    recurrencePattern: {
      type: "weekly",
      interval: 1,
      daysOfWeek: [1], // Monday
      endType: "never",
    },
    attendees: ["1", "2", "3", "4", "5"],
    organizer: "4",
    createdAt: "2023-06-01T12:00:00Z",
  },
  {
    id: "rm2",
    title: "Design Review",
    description: "Biweekly design review meeting to discuss and approve new designs.",
    location: "Design Studio",
    startTime: "14:00",
    endTime: "15:30",
    timezone: "America/New_York",
    startDate: "2023-06-07",
    recurrencePattern: {
      type: "biweekly",
      interval: 1,
      daysOfWeek: [3], // Wednesday
      endType: "never",
    },
    attendees: ["2", "4"],
    organizer: "2",
    createdAt: "2023-06-02T09:30:00Z",
  },
  {
    id: "rm3",
    title: "Monthly All-Hands",
    description: "Monthly company-wide meeting to discuss updates, achievements, and upcoming plans.",
    location: "Virtual Meeting",
    startTime: "09:00",
    endTime: "10:00",
    timezone: "America/New_York",
    startDate: "2023-06-15",
    recurrencePattern: {
      type: "monthly",
      interval: 1,
      dayOfMonth: 15,
      endType: "never",
    },
    attendees: ["1", "2", "3", "4", "5"],
    organizer: "4",
    createdAt: "2023-06-01T15:45:00Z",
  },
  {
    id: "rm4",
    title: "Weekly 1:1",
    description: "Weekly one-on-one meeting with team members to discuss progress and challenges.",
    location: "Manager's Office",
    startTime: "13:00",
    endTime: "13:30",
    timezone: "America/New_York",
    startDate: "2023-06-06",
    recurrencePattern: {
      type: "weekly",
      interval: 1,
      daysOfWeek: [2], // Tuesday
      endType: "never",
    },
    attendees: ["1", "4"],
    organizer: "4",
    createdAt: "2023-06-01T16:20:00Z",
  },
  {
    id: "rm5",
    title: "Quarterly Planning",
    description: "Quarterly planning session to set goals and priorities for the upcoming quarter.",
    location: "Executive Boardroom",
    startTime: "09:00",
    endTime: "16:00",
    timezone: "America/New_York",
    startDate: "2023-07-03",
    recurrencePattern: {
      type: "monthly",
      interval: 3,
      dayOfMonth: 3,
      endType: "after",
      endAfterOccurrences: 4,
    },
    attendees: ["1", "2", "3", "4", "5"],
    organizer: "4",
    createdAt: "2023-06-15T11:10:00Z",
  },
]

export default function RecurringMeetingsPage() {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [meetings, setMeetings] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // Load meetings and team members
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        if (isDemoMode) {
          // Load mock data for demo mode
          setMeetings(mockRecurringMeetings)
          setTeamMembers(mockTeamMembers)
        } else {
          // In a real app, you would fetch from your API
          // const response = await fetch('/api/meetings/recurring')
          // const data = await response.json()
          // setMeetings(data)

          // For now, use mock data for non-demo mode too
          setMeetings(mockRecurringMeetings)
          setTeamMembers(mockTeamMembers)
        }
      } catch (error) {
        console.error("Error loading recurring meetings:", error)
        toast({
          title: "Error",
          description: "Failed to load recurring meetings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isDemoMode, toast])

  // Filter meetings based on search query
  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle creating a new meeting
  const handleCreateMeeting = () => {
    setSelectedMeeting(null)
    setIsEditing(false)
    setShowScheduleDialog(true)
  }

  // Handle editing a meeting
  const handleEditMeeting = (meeting) => {
    setSelectedMeeting(meeting)
    setIsEditing(true)
    setShowScheduleDialog(true)
  }

  // Handle deleting a meeting
  const handleDeleteMeeting = async (meetingId, deleteOption) => {
    try {
      if (isDemoMode) {
        // Delete the meeting from mock data
        if (deleteOption === "all") {
          setMeetings(meetings.filter((meeting) => meeting.id !== meetingId))
        } else {
          // For demo purposes, just delete the entire meeting for any option
          setMeetings(meetings.filter((meeting) => meeting.id !== meetingId))
        }
      } else {
        // In a real app, you would send to your API
        // await fetch(`/api/meetings/recurring/${meetingId}`, {
        //   method: 'DELETE',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ deleteOption }),
        // })

        // For now, simulate API response
        setMeetings(meetings.filter((meeting) => meeting.id !== meetingId))
      }

      return true
    } catch (error) {
      console.error("Error deleting meeting:", error)
      throw error
    }
  }

  // Handle scheduling a meeting
  const handleScheduleMeeting = () => {
    // In a real app, this would save the meeting to the database
    // For demo purposes, we'll just close the dialog
    setShowScheduleDialog(false)

    // Refresh the meetings list
    if (isEditing) {
      toast({
        title: "Meeting updated",
        description: "The recurring meeting has been updated successfully.",
      })
    } else {
      toast({
        title: "Meeting scheduled",
        description: "The recurring meeting has been scheduled successfully.",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recurring Meetings</h1>
            <p className="text-muted-foreground mt-1">Manage your recurring meetings and schedules</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateMeeting}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Meetings</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="mine">My Meetings</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading meetings...</div>
            ) : (
              <RecurringMeetingList
                meetings={filteredMeetings}
                teamMembers={teamMembers}
                onEdit={handleEditMeeting}
                onDelete={handleDeleteMeeting}
              />
            )}
          </TabsContent>
          <TabsContent value="upcoming" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading meetings...</div>
            ) : (
              <RecurringMeetingList
                meetings={filteredMeetings.filter((meeting) => {
                  const startDate = new Date(meeting.startDate)
                  return startDate >= new Date()
                })}
                teamMembers={teamMembers}
                onEdit={handleEditMeeting}
                onDelete={handleDeleteMeeting}
              />
            )}
          </TabsContent>
          <TabsContent value="mine" className="mt-6">
            {isLoading ? (
              <div className="text-center p-8">Loading meetings...</div>
            ) : (
              <RecurringMeetingList
                meetings={filteredMeetings.filter((meeting) => meeting.organizer === "4")} // Assuming user ID is "4" for demo
                teamMembers={teamMembers}
                onEdit={handleEditMeeting}
                onDelete={handleDeleteMeeting}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Meeting Scheduler Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Recurring Meeting" : "Schedule Recurring Meeting"}</DialogTitle>
          </DialogHeader>
          <MeetingScheduler
            teamMembers={teamMembers}
            onSchedule={handleScheduleMeeting}
            onCancel={() => setShowScheduleDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
