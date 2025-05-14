"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, ChevronDown, ChevronUp, MapPin, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMeetingNotifications } from "@/lib/meeting-notification-context"

// Demo team members data
const teamMembers = [
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

// Demo meetings data
const todayMeetings = [
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
    title: "Team Lunch",
    date: new Date(),
    startTime: "12:30",
    endTime: "13:30",
    attendees: ["1", "2", "3", "4", "5"],
    location: "Cafeteria",
    source: "Outlook Calendar",
  },
  {
    id: "3",
    title: "Design Review",
    date: new Date(),
    startTime: "14:00",
    endTime: "15:00",
    attendees: ["2", "4"],
    location: "Virtual Meeting",
    source: "Team Calendar",
  },
  {
    id: "4",
    title: "Product Demo",
    date: new Date(),
    startTime: "15:30",
    endTime: "16:30",
    attendees: ["1", "2", "4"],
    location: "Demo Room",
    source: "Google Calendar",
  },
]

export function DailyAgenda() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { preferences } = useMeetingNotifications()

  // Show daily agenda at the configured time
  useEffect(() => {
    if (!preferences.dailyAgenda) return

    const checkTime = () => {
      const now = new Date()
      const [hours, minutes] = preferences.dailyAgendaTime.split(":").map(Number)

      if (
        now.getHours() === hours &&
        now.getMinutes() >= minutes &&
        now.getMinutes() < minutes + 5 // Show for 5 minutes
      ) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Check immediately
    checkTime()

    // Then check every minute
    const interval = setInterval(checkTime, 60000)

    return () => clearInterval(interval)
  }, [preferences.dailyAgenda, preferences.dailyAgendaTime])

  // For demo purposes, show the agenda when the component mounts
  useEffect(() => {
    setIsVisible(true)
  }, [])

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

  if (!isVisible) return null

  return (
    <Card className="fixed bottom-4 right-4 w-96 shadow-lg z-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-lg">Daily Agenda</CardTitle>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>{format(new Date(), "EEEE, MMMM d, yyyy")}</CardDescription>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent className="pb-2">
            {todayMeetings.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No meetings scheduled for today</div>
            ) : (
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-3">
                  {todayMeetings.map((meeting, index) => (
                    <div key={meeting.id}>
                      <div className="flex items-start gap-3">
                        <div className="bg-muted rounded-md p-2 text-center min-w-[50px]">
                          <div className="text-sm font-medium">{meeting.startTime}</div>
                          <div className="text-xs text-muted-foreground">{meeting.endTime}</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{meeting.title}</div>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{meeting.location}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="flex -space-x-2 mr-2">
                              {meeting.attendees.slice(0, 3).map((attendeeId) => {
                                const attendee = teamMembers.find((m) => m.id === attendeeId)
                                return attendee ? (
                                  <Avatar key={attendeeId} className="h-5 w-5 border-2 border-background">
                                    <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ) : null
                              })}
                              {meeting.attendees.length > 3 && (
                                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                  +{meeting.attendees.length - 3}
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary" className={`text-xs ${getSourceColor(meeting.source)}`}>
                              {meeting.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {index < todayMeetings.length - 1 && <Separator className="my-3" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href="/app/team-calendar">View Full Calendar</a>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
