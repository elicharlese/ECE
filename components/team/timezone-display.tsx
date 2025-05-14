"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTimezone } from "@/lib/timezone-context"
import { format } from "date-fns"
import { Clock } from "lucide-react"

export function TimezoneDisplay() {
  const { preferences, getLocalTime, getTimezoneAbbreviation } = useTimezone()
  const [currentTimes, setCurrentTimes] = useState<Record<string, Date>>({})

  // Update the current time every minute
  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, Date> = {
        [preferences.userTimezone]: getLocalTime(preferences.userTimezone),
      }

      if (preferences.showMultipleTimezones) {
        preferences.additionalTimezones.forEach((tz) => {
          times[tz] = getLocalTime(tz)
        })
      }

      setCurrentTimes(times)
    }

    // Update immediately
    updateTimes()

    // Then update every minute
    const interval = setInterval(updateTimes, 60000)

    return () => clearInterval(interval)
  }, [preferences.userTimezone, preferences.additionalTimezones, preferences.showMultipleTimezones, getLocalTime])

  // Format time based on user preferences
  const formatTime = (date: Date) => {
    return format(date, preferences.format24Hour ? "HH:mm" : "h:mm a")
  }

  // Format date
  const formatDate = (date: Date) => {
    return format(date, "EEE, MMM d, yyyy")
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Current Times
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* User's timezone */}
          {currentTimes[preferences.userTimezone] && (
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <div className="font-medium">{preferences.userTimezone.replace(/_/g, " ")}</div>
                <div className="text-sm text-muted-foreground">Your timezone</div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {formatTime(currentTimes[preferences.userTimezone])}
                  {preferences.showTimezoneIndicator && (
                    <span className="ml-1 text-muted-foreground">
                      ({getTimezoneAbbreviation(preferences.userTimezone)})
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(currentTimes[preferences.userTimezone])}
                </div>
              </div>
            </div>
          )}

          {/* Additional timezones */}
          {preferences.showMultipleTimezones &&
            preferences.additionalTimezones.map(
              (tz) =>
                currentTimes[tz] && (
                  <div key={tz} className="flex justify-between items-center py-2">
                    <div>
                      <div className="font-medium">{tz.replace(/_/g, " ")}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatTime(currentTimes[tz])}
                        {preferences.showTimezoneIndicator && (
                          <span className="ml-1 text-muted-foreground">({getTimezoneAbbreviation(tz)})</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{formatDate(currentTimes[tz])}</div>
                    </div>
                  </div>
                ),
            )}
        </div>
      </CardContent>
    </Card>
  )
}
