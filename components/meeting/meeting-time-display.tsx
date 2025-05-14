"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTimezone } from "@/lib/timezone-context"
import { Clock, Globe } from "lucide-react"

interface MeetingTimeDisplayProps {
  startTime: string
  endTime: string
  date: string
  timezone?: string
  showMultipleTimezones?: boolean
  className?: string
}

export function MeetingTimeDisplay({
  startTime,
  endTime,
  date,
  timezone,
  showMultipleTimezones,
  className,
}: MeetingTimeDisplayProps) {
  const { preferences, convertTime, formatTimeWithTimezone, getTimezoneAbbreviation } = useTimezone()
  const [isOpen, setIsOpen] = useState(false)

  // Use provided timezone or user's timezone
  const meetingTimezone = timezone || preferences.userTimezone

  // Determine whether to show multiple timezones
  const shouldShowMultipleTimezones =
    showMultipleTimezones !== undefined ? showMultipleTimezones : preferences.showMultipleTimezones

  // Format the meeting time in the meeting's timezone
  const formattedStartTime = preferences.showTimezoneIndicator
    ? formatTimeWithTimezone(startTime, date, meetingTimezone)
    : convertTime(startTime, date, meetingTimezone, preferences.userTimezone)

  const formattedEndTime = preferences.showTimezoneIndicator
    ? formatTimeWithTimezone(endTime, date, meetingTimezone)
    : convertTime(endTime, date, meetingTimezone, preferences.userTimezone)

  return (
    <div className={className}>
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
        <span>
          {formattedStartTime} - {formattedEndTime}
        </span>

        {shouldShowMultipleTimezones && preferences.additionalTimezones.length > 0 && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 rounded-full">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Show in other timezones</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Timezone</span>
                      <span className="text-sm font-medium">Time</span>
                    </div>

                    {/* User's timezone */}
                    <div className="flex justify-between items-center py-1 border-b">
                      <span className="text-sm">
                        {preferences.userTimezone.replace(/_/g, " ")} (
                        {getTimezoneAbbreviation(preferences.userTimezone)})
                      </span>
                      <span className="text-sm">
                        {convertTime(startTime, date, meetingTimezone, preferences.userTimezone)} -{" "}
                        {convertTime(endTime, date, meetingTimezone, preferences.userTimezone)}
                      </span>
                    </div>

                    {/* Additional timezones */}
                    {preferences.additionalTimezones.map((tz) => (
                      <div key={tz} className="flex justify-between items-center py-1">
                        <span className="text-sm">
                          {tz.replace(/_/g, " ")} ({getTimezoneAbbreviation(tz)})
                        </span>
                        <span className="text-sm">
                          {convertTime(startTime, date, meetingTimezone, tz)} -{" "}
                          {convertTime(endTime, date, meetingTimezone, tz)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}
