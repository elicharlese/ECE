"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TimezoneSelector } from "@/components/team/timezone-selector"
import { useTimezone } from "@/lib/timezone-context"
import { X } from "lucide-react"

export function TimezonePreferences() {
  const { preferences, updatePreferences, getTimezoneAbbreviation } = useTimezone()
  const [isLoading, setIsLoading] = useState(false)
  const [newTimezone, setNewTimezone] = useState("")

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await updatePreferences(preferences)
    } finally {
      setIsLoading(false)
    }
  }

  // Add a timezone to the additional timezones list
  const addTimezone = () => {
    if (newTimezone && !preferences.additionalTimezones.includes(newTimezone)) {
      updatePreferences({
        additionalTimezones: [...preferences.additionalTimezones, newTimezone],
      })
      setNewTimezone("")
    }
  }

  // Remove a timezone from the additional timezones list
  const removeTimezone = (timezone: string) => {
    updatePreferences({
      additionalTimezones: preferences.additionalTimezones.filter((tz) => tz !== timezone),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timezone Settings</CardTitle>
        <CardDescription>Configure your timezone preferences for meetings and calendar events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="userTimezone">Your Timezone</Label>
          <TimezoneSelector
            value={preferences.userTimezone}
            onValueChange={(value) => updatePreferences({ userTimezone: value })}
            showLabel={false}
            showAllTimezones={true}
          />
          <p className="text-sm text-muted-foreground mt-1">
            This is your primary timezone. All meeting times will be displayed in this timezone by default.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="format24Hour">Use 24-hour format</Label>
            <p className="text-sm text-muted-foreground">
              Display times in 24-hour format (e.g., 14:00) instead of 12-hour format (e.g., 2:00 PM)
            </p>
          </div>
          <Switch
            id="format24Hour"
            checked={preferences.format24Hour}
            onCheckedChange={(checked) => updatePreferences({ format24Hour: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showTimezoneIndicator">Show timezone indicators</Label>
            <p className="text-sm text-muted-foreground">
              Display timezone abbreviations (e.g., EDT, PST) next to times
            </p>
          </div>
          <Switch
            id="showTimezoneIndicator"
            checked={preferences.showTimezoneIndicator}
            onCheckedChange={(checked) => updatePreferences({ showTimezoneIndicator: checked })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showMultipleTimezones">Show multiple timezones</Label>
              <p className="text-sm text-muted-foreground">Display meeting times in multiple timezones</p>
            </div>
            <Switch
              id="showMultipleTimezones"
              checked={preferences.showMultipleTimezones}
              onCheckedChange={(checked) => updatePreferences({ showMultipleTimezones: checked })}
            />
          </div>

          {preferences.showMultipleTimezones && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Additional Timezones</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <TimezoneSelector
                      value={newTimezone}
                      onValueChange={setNewTimezone}
                      showLabel={false}
                      placeholder="Add timezone..."
                    />
                  </div>
                  <Button onClick={addTimezone} disabled={!newTimezone}>
                    Add
                  </Button>
                </div>
              </div>

              {preferences.additionalTimezones.length > 0 ? (
                <div className="space-y-2">
                  <Label>Selected Timezones</Label>
                  <div className="flex flex-wrap gap-2">
                    {preferences.additionalTimezones.map((timezone) => (
                      <Badge key={timezone} variant="secondary" className="flex items-center gap-1 py-1.5">
                        {timezone.replace(/_/g, " ")} ({getTimezoneAbbreviation(timezone)})
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full"
                          onClick={() => removeTimezone(timezone)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No additional timezones selected</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
