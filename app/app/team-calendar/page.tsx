"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Filter, Plus, Search, Users } from "lucide-react"
import { TeamMemberSchedule } from "@/components/team/team-member-schedule"
import { MeetingScheduler } from "@/components/team/meeting-scheduler"
import { SyncedCalendarsList } from "@/components/team/synced-calendars-list"
import { Badge } from "@/components/ui/badge"
import { MeetingNotificationCenter } from "@/components/meeting/meeting-notification-center"
import { MeetingNotificationToastManager } from "@/components/meeting/meeting-notification-toast"
import { DailyAgenda } from "@/components/meeting/daily-agenda"
import { MeetingNotificationProvider } from "@/lib/meeting-notification-context"

// Demo team members data
const teamMembers = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Lead Developer",
    avatar: "/diverse-user-avatars.png",
    availability: [
      { day: new Date(), startTime: "09:00", endTime: "12:00", status: "available" },
      { day: new Date(), startTime: "13:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 1), startTime: "09:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 2), startTime: "09:00", endTime: "11:00", status: "available" },
      { day: addDays(new Date(), 2), startTime: "14:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 3), startTime: "09:00", endTime: "17:00", status: "busy" },
      { day: addDays(new Date(), 4), startTime: "09:00", endTime: "17:00", status: "available" },
    ],
  },
  {
    id: "2",
    name: "Samantha Lee",
    role: "UX Designer",
    avatar: "/diverse-user-avatars.png",
    availability: [
      { day: new Date(), startTime: "10:00", endTime: "16:00", status: "available" },
      { day: addDays(new Date(), 1), startTime: "09:00", endTime: "12:00", status: "available" },
      { day: addDays(new Date(), 1), startTime: "13:00", endTime: "15:00", status: "busy" },
      { day: addDays(new Date(), 2), startTime: "09:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 3), startTime: "09:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 4), startTime: "09:00", endTime: "12:00", status: "available" },
    ],
  },
  {
    id: "3",
    name: "Marcus Chen",
    role: "Backend Developer",
    avatar: "/diverse-user-avatars.png",
    availability: [
      { day: new Date(), startTime: "09:00", endTime: "17:00", status: "busy" },
      { day: addDays(new Date(), 1), startTime: "09:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 2), startTime: "09:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 3), startTime: "09:00", endTime: "12:00", status: "available" },
      { day: addDays(new Date(), 4), startTime: "09:00", endTime: "17:00", status: "busy" },
    ],
  },
  {
    id: "4",
    name: "Priya Patel",
    role: "Project Manager",
    avatar: "/diverse-user-avatars.png",
    availability: [
      { day: new Date(), startTime: "09:00", endTime: "11:00", status: "available" },
      { day: new Date(), startTime: "13:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 1), startTime: "09:00", endTime: "17:00", status: "busy" },
      { day: addDays(new Date(), 2), startTime: "09:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 3), startTime: "09:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 4), startTime: "09:00", endTime: "12:00", status: "available" },
    ],
  },
  {
    id: "5",
    name: "David Kim",
    role: "DevOps Engineer",
    avatar: "/diverse-user-avatars.png",
    availability: [
      { day: new Date(), startTime: "09:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 1), startTime: "09:00", endTime: "17:00", status: "available" },
      { day: addDays(new Date(), 2), startTime: "09:00", endTime: "17:00", status: "busy" },
      { day: addDays(new Date(), 3), startTime: "09:00", endTime: "12:00", status: "available" },
      { day: addDays(new Date(), 4), startTime: "09:00", endTime: "17:00", status: "available" },
    ],
  },
]

// Demo meetings data
const meetings = [
  {
    id: "1",
    title: "Sprint Planning",
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    attendees: ["1", "2", "4"],
    location: "Main Conference Room",
    source: "Team Calendar",
  },
  {
    id: "2",
    title: "Design Review",
    date: addDays(new Date(), 1),
    startTime: "14:00",
    endTime: "15:00",
    attendees: ["2", "4"],
    location: "Virtual Meeting",
    source: "Team Calendar",
  },
  {
    id: "3",
    title: "Backend Architecture",
    date: addDays(new Date(), 2),
    startTime: "11:00",
    endTime: "12:00",
    attendees: ["1", "3", "5"],
    location: "Virtual Meeting",
    source: "Team Calendar",
  },
  // Synced events from external calendars
  {
    id: "4",
    title: "Client Meeting",
    date: addDays(new Date(), 1),
    startTime: "09:00",
    endTime: "10:00",
    attendees: ["4"],
    location: "Client Office",
    source: "Google Calendar",
  },
  {
    id: "5",
    title: "Team Lunch",
    date: addDays(new Date(), 2),
    startTime: "12:30",
    endTime: "13:30",
    attendees: ["1", "2", "3", "4", "5"],
    location: "Cafeteria",
    source: "Outlook Calendar",
  },
  {
    id: "6",
    title: "Product Demo",
    date: addDays(new Date(), 3),
    startTime: "15:00",
    endTime: "16:00",
    attendees: ["1", "2", "4"],
    location: "Demo Room",
    source: "Google Calendar",
  },
]

// Dummy components to resolve the errors
const CalendarSyncSettings = () => {
  return <div>Calendar Sync Settings Content</div>
}

const CalendarConflictResolver = () => {
  return <div>Calendar Conflict Resolver Content</div>
}

export default function TeamCalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>(teamMembers.map((member) => member.id))
  const [searchQuery, setSearchQuery] = useState("")
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false)
  const [showSyncSettings, setShowSyncSettings] = useState(false)

  // Filter team members based on search query
  const filteredTeamMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get the current week's days
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Toggle team member selection
  const toggleTeamMember = (id: string) => {
    if (selectedTeamMembers.includes(id)) {
      setSelectedTeamMembers(selectedTeamMembers.filter((memberId) => memberId !== id))
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, id])
    }
  }

  // Select all team members
  const selectAllTeamMembers = () => {
    setSelectedTeamMembers(teamMembers.map((member) => member.id))
  }

  // Deselect all team members
  const deselectAllTeamMembers = () => {
    setSelectedTeamMembers([])
  }

  // Navigate to previous period
  const navigatePrevious = () => {
    if (view === "day") {
      setDate(addDays(date, -1))
    } else if (view === "week") {
      setDate(addDays(date, -7))
    } else {
      // Month view
      const newDate = new Date(date)
      newDate.setMonth(date.getMonth() - 1)
      setDate(newDate)
    }
  }

  // Navigate to next period
  const navigateNext = () => {
    if (view === "day") {
      setDate(addDays(date, 1))
    } else if (view === "week") {
      setDate(addDays(date, 7))
    } else {
      // Month view
      const newDate = new Date(date)
      newDate.setMonth(date.getMonth() + 1)
      setDate(newDate)
    }
  }

  // Get meetings for a specific day
  const getMeetingsForDay = (day: Date) => {
    return meetings.filter((meeting) => isSameDay(meeting.date, day))
  }

  // Get calendar source badge color
  const getSourceColor = (source: string) => {
    switch (source) {
      case "Google Calendar":
        return "bg-[#4285F4] text-white"
      case "Outlook Calendar":
        return "bg-[#0078D4] text-white"
      case "Apple Calendar":
        return "bg-[#FF2D55] text-white"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  return (
    <MeetingNotificationProvider>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Team Calendar</h1>
              <p className="text-muted-foreground">View and manage team availability and schedule meetings</p>
            </div>
            <div className="flex items-center gap-2">
              <MeetingNotificationCenter />

              <Dialog open={showSyncSettings} onOpenChange={setShowSyncSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Calendar Sync
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Calendar Sync Settings</DialogTitle>
                    <DialogDescription>Connect and manage your external calendars</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Tabs defaultValue="settings">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                        <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
                      </TabsList>
                      <TabsContent value="settings" className="pt-4">
                        <CalendarSyncSettings />
                      </TabsContent>
                      <TabsContent value="conflicts" className="pt-4">
                        <CalendarConflictResolver />
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showMeetingScheduler} onOpenChange={setShowMeetingScheduler}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Schedule a Meeting</DialogTitle>
                    <DialogDescription>Create a new meeting and invite team members.</DialogDescription>
                  </DialogHeader>
                  <MeetingScheduler
                    teamMembers={teamMembers}
                    onSchedule={() => setShowMeetingScheduler(false)}
                    onCancel={() => setShowMeetingScheduler(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Team Members Panel */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Team Members</CardTitle>
                  <CardDescription>Select team members to view their availability</CardDescription>
                  <div className="relative mt-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search team members..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={selectAllTeamMembers}>
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={deselectAllTeamMembers}>
                        Clear
                      </Button>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">Filter by Role</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="developer" />
                              <Label htmlFor="developer">Developers</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="designer" />
                              <Label htmlFor="designer">Designers</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="manager" />
                              <Label htmlFor="manager">Managers</Label>
                            </div>
                          </div>
                          <h4 className="font-medium">Filter by Availability</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="available" />
                              <Label htmlFor="available">Available</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="busy" />
                              <Label htmlFor="busy">Busy</Label>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button size="sm">Apply Filters</Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {filteredTeamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => toggleTeamMember(member.id)}
                        >
                          <Checkbox
                            checked={selectedTeamMembers.includes(member.id)}
                            onCheckedChange={() => toggleTeamMember(member.id)}
                          />
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Synced Calendars */}
              <SyncedCalendarsList />
            </div>

            {/* Calendar Panel */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={navigatePrevious}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium">
                        {view === "day" && format(date, "MMMM d, yyyy")}
                        {view === "week" && `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`}
                        {view === "month" && format(date, "MMMM yyyy")}
                      </h2>
                    </div>
                    <Button variant="outline" size="icon" onClick={navigateNext}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
                    <TabsList>
                      <TabsTrigger value="day">Day</TabsTrigger>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="day" className="mt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {selectedTeamMembers.length > 0 ? (
                        teamMembers
                          .filter((member) => selectedTeamMembers.includes(member.id))
                          .map((member) => (
                            <TeamMemberSchedule
                              key={member.id}
                              member={member}
                              date={date}
                              meetings={meetings.filter(
                                (meeting) => meeting.attendees.includes(member.id) && isSameDay(meeting.date, date),
                              )}
                            />
                          ))
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Users className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No team members selected</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Select one or more team members to view their availability
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="week" className="mt-0">
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      {/* Week header */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map((day) => (
                          <div key={day.toString()} className="text-center p-2">
                            <div className="font-medium">{format(day, "EEE")}</div>
                            <div
                              className={`text-sm rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                                isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : ""
                              }`}
                            >
                              {format(day, "d")}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Team members schedules */}
                      {selectedTeamMembers.length > 0 ? (
                        <div className="space-y-6">
                          {teamMembers
                            .filter((member) => selectedTeamMembers.includes(member.id))
                            .map((member) => (
                              <div key={member.id} className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{member.name}</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                  {weekDays.map((day) => {
                                    const dayAvailability = member.availability.filter((a) => isSameDay(a.day, day))
                                    const dayMeetings = meetings.filter(
                                      (m) => isSameDay(m.date, day) && m.attendees.includes(member.id),
                                    )

                                    return (
                                      <div key={day.toString()} className="min-h-[100px] border rounded-md p-1 text-xs">
                                        {dayAvailability.length === 0 ? (
                                          <div className="h-full flex items-center justify-center text-muted-foreground">
                                            No data
                                          </div>
                                        ) : (
                                          <div className="space-y-1">
                                            {dayAvailability.map((slot, idx) => (
                                              <div
                                                key={idx}
                                                className={`p-1 rounded text-xs ${
                                                  slot.status === "available"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                }`}
                                              >
                                                <div className="flex items-center">
                                                  <Clock className="h-3 w-3 mr-1" />
                                                  {slot.startTime} - {slot.endTime}
                                                </div>
                                              </div>
                                            ))}

                                            {dayMeetings.map((meeting) => (
                                              <div
                                                key={meeting.id}
                                                className="border p-1 rounded mt-1 flex flex-col"
                                                style={{
                                                  borderColor:
                                                    meeting.source === "Team Calendar"
                                                      ? "#7C3AED"
                                                      : meeting.source === "Google Calendar"
                                                        ? "#4285F4"
                                                        : meeting.source === "Outlook Calendar"
                                                          ? "#0078D4"
                                                          : meeting.source === "Apple Calendar"
                                                            ? "#FF2D55"
                                                            : "#6B7280",
                                                }}
                                              >
                                                <span>
                                                  {meeting.title} ({meeting.startTime})
                                                </span>
                                                <Badge
                                                  variant="secondary"
                                                  className={`text-[10px] mt-1 ${getSourceColor(meeting.source)}`}
                                                >
                                                  {meeting.source}
                                                </Badge>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Users className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No team members selected</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Select one or more team members to view their availability
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="month" className="mt-0">
                  <div className="space-y-4">
                    <Calendar
                      mode="multiple"
                      selected={meetings.map((meeting) => meeting.date)}
                      className="rounded-md border"
                    />

                    <div className="space-y-2">
                      <h3 className="font-medium">Meetings this month</h3>
                      {meetings.length > 0 ? (
                        <div className="space-y-2">
                          {meetings.map((meeting) => (
                            <div key={meeting.id} className="flex items-center justify-between p-2 border rounded-md">
                              <div>
                                <p className="font-medium">{meeting.title}</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  {format(meeting.date, "MMM d")} • {meeting.startTime} - {meeting.endTime}
                                </div>
                                <Badge variant="secondary" className={`text-xs mt-1 ${getSourceColor(meeting.source)}`}>
                                  {meeting.source}
                                </Badge>
                              </div>
                              <div className="flex -space-x-2">
                                {meeting.attendees.map((attendeeId) => {
                                  const attendee = teamMembers.find((m) => m.id === attendeeId)
                                  return attendee ? (
                                    <Avatar key={attendeeId} className="h-6 w-6 border-2 border-background">
                                      <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  ) : null
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">No meetings scheduled this month</div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Toast notifications for meetings */}
        <MeetingNotificationToastManager />

        {/* Daily agenda popup */}
        <DailyAgenda />
      </div>
    </MeetingNotificationProvider>
  )
}
