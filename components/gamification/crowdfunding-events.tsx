"use client"

import { useCrowdfundingGamification } from "@/context/crowdfunding-gamification-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarDays, Clock, Gift, Users, Award, Info, CalendarClock } from "lucide-react"

export function CrowdfundingEvents() {
  const { events, participateInEvent, isLoading } = useCrowdfundingGamification()

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No Events Available</AlertTitle>
        <AlertDescription>
          There are no special events currently active. Check back later for new opportunities!
        </AlertDescription>
      </Alert>
    )
  }

  // Filter active events
  const activeEvents = events.filter((event) => {
    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)
    return startDate <= now && endDate >= now
  })

  // Filter upcoming events
  const upcomingEvents = events.filter((event) => {
    const now = new Date()
    const startDate = new Date(event.startDate)
    return startDate > now
  })

  return (
    <div className="space-y-6">
      {/* Active Events */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Active Events</h2>
        {activeEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden border-primary/20">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle>{event.name}</CardTitle>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Active
                    </Badge>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Ends in {formatTimeRemaining(event.endDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{event.participants} participants</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Requirements:</h4>
                      <ul className="text-sm space-y-1">
                        {event.requirements.map((req, i) => (
                          <li key={i} className="flex items-start">
                            <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 mr-2 flex-shrink-0">
                              <span className="text-xs text-primary">{i + 1}</span>
                            </div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-md">
                      <h4 className="text-sm font-medium flex items-center">
                        <Gift className="h-4 w-4 mr-1 text-primary" />
                        Rewards
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {event.rewards.points && (
                          <Badge className="bg-primary/10 text-primary border-primary/10">
                            +{event.rewards.points} XP
                          </Badge>
                        )}
                        {event.rewards.badges &&
                          event.rewards.badges.map((badge, i) => (
                            <Badge key={i} variant="outline">
                              <Award className="h-3 w-3 mr-1" />
                              {formatBadgeName(badge)}
                            </Badge>
                          ))}
                        {event.rewards.specialRewards &&
                          event.rewards.specialRewards.map((reward, i) => (
                            <Badge key={i} variant="secondary">
                              {reward}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 flex justify-between">
                  <Button variant="outline" size="sm" className="w-1/2">
                    Details
                  </Button>
                  <Button size="sm" className="w-1/2" onClick={() => participateInEvent(event.id)}>
                    Participate
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground opacity-40 mb-4" />
            <h3 className="text-lg font-medium">No Active Events</h3>
            <p className="text-muted-foreground mt-2">
              There are no special events currently active. Check back later or explore the upcoming events!
            </p>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <CalendarClock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>Starts {formatDate(event.startDate)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.rewards.points && <Badge variant="outline">+{event.rewards.points} XP</Badge>}
                    {event.rewards.badges && (
                      <Badge variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        {event.rewards.badges.length} Badge{event.rewards.badges.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Set Reminder
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function formatTimeRemaining(endDateString: string): string {
  const endDate = new Date(endDateString)
  const now = new Date()

  const diffInMs = endDate.getTime() - now.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays > 1) {
    return `${diffInDays} days`
  } else if (diffInDays === 1) {
    return "1 day"
  }

  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

  if (diffInHours > 1) {
    return `${diffInHours} hours`
  } else if (diffInHours === 1) {
    return "1 hour"
  }

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  return `${diffInMinutes} minutes`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

function formatBadgeName(badgeId: string): string {
  // Convert badge IDs to readable names
  // Example: "defi-enthusiast" -> "DeFi Enthusiast"
  return badgeId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
