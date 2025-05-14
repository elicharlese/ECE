"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Calendar, Clock, MapPin, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConflictEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  organizer: string
  source: string
  lastModified: string
}

interface ConflictPair {
  id: string
  localEvent: ConflictEvent
  remoteEvent: ConflictEvent
  resolution?: "local" | "remote" | "both"
}

// Demo data for conflicts
const demoConflicts: ConflictPair[] = [
  {
    id: "conflict1",
    localEvent: {
      id: "event1-local",
      title: "Team Meeting",
      date: "2023-06-15",
      startTime: "10:00",
      endTime: "11:00",
      location: "Conference Room A",
      organizer: "John Smith",
      source: "Team Calendar",
      lastModified: "2023-06-10T14:30:00Z",
    },
    remoteEvent: {
      id: "event1-remote",
      title: "Weekly Team Sync",
      date: "2023-06-15",
      startTime: "10:00",
      endTime: "11:30",
      location: "Virtual Meeting",
      organizer: "John Smith",
      source: "Google Calendar",
      lastModified: "2023-06-12T09:15:00Z",
    },
  },
  {
    id: "conflict2",
    localEvent: {
      id: "event2-local",
      title: "Project Review",
      date: "2023-06-16",
      startTime: "14:00",
      endTime: "15:00",
      location: "Meeting Room B",
      organizer: "Sarah Johnson",
      source: "Team Calendar",
      lastModified: "2023-06-11T11:20:00Z",
    },
    remoteEvent: {
      id: "event2-remote",
      title: "Project Status Update",
      date: "2023-06-16",
      startTime: "14:00",
      endTime: "16:00",
      location: "Conference Call",
      organizer: "Sarah Johnson",
      source: "Outlook Calendar",
      lastModified: "2023-06-13T16:45:00Z",
    },
  },
]

export function CalendarConflictResolver() {
  const { toast } = useToast()
  const [conflicts, setConflicts] = useState<ConflictPair[]>(demoConflicts)
  const [showDialog, setShowDialog] = useState(false)
  const [currentConflict, setCurrentConflict] = useState<ConflictPair | null>(null)
  const [resolution, setResolution] = useState<"local" | "remote" | "both" | null>(null)
  const [applyToAll, setApplyToAll] = useState(false)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format date for comparison
  const formatDateForComparison = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0]
  }

  // Open conflict resolution dialog
  const openConflictDialog = (conflict: ConflictPair) => {
    setCurrentConflict(conflict)
    setResolution(conflict.resolution || null)
    setShowDialog(true)
  }

  // Resolve a single conflict
  const resolveConflict = () => {
    if (!currentConflict || !resolution) return

    setConflicts(
      conflicts.map((conflict) =>
        conflict.id === currentConflict.id
          ? { ...conflict, resolution }
          : applyToAll &&
              formatDateForComparison(conflict.localEvent.date) ===
                formatDateForComparison(currentConflict.localEvent.date)
            ? { ...conflict, resolution }
            : conflict,
      ),
    )

    setShowDialog(false)

    toast({
      title: "Conflict resolved",
      description: `The calendar conflict has been resolved using the ${resolution === "local" ? "local" : resolution === "remote" ? "remote" : "both"} version.`,
    })
  }

  // Resolve all conflicts
  const resolveAllConflicts = () => {
    // Count unresolved conflicts
    const unresolvedCount = conflicts.filter((c) => !c.resolution).length

    if (unresolvedCount === 0) {
      toast({
        title: "All conflicts resolved",
        description: "All calendar conflicts have been resolved.",
      })
      return
    }

    // Apply most common resolution to unresolved conflicts
    const resolutions = conflicts.filter((c) => c.resolution).map((c) => c.resolution)

    const counts = {
      local: resolutions.filter((r) => r === "local").length,
      remote: resolutions.filter((r) => r === "remote").length,
      both: resolutions.filter((r) => r === "both").length,
    }

    const mostCommon = Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as "local" | "remote" | "both"

    setConflicts(
      conflicts.map((conflict) => (conflict.resolution ? conflict : { ...conflict, resolution: mostCommon })),
    )

    toast({
      title: "All conflicts resolved",
      description: `Applied "${mostCommon}" resolution to all remaining conflicts.`,
    })
  }

  // Check if all conflicts are resolved
  const allResolved = conflicts.every((c) => c.resolution)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Calendar Sync Conflicts</CardTitle>
          <CardDescription>Resolve conflicts between your local and remote calendars</CardDescription>
        </CardHeader>
        <CardContent>
          {conflicts.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No conflicts found</p>
              <p className="text-sm text-muted-foreground">All your calendars are in sync</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sync Conflicts Detected</AlertTitle>
                <AlertDescription>
                  {conflicts.filter((c) => !c.resolution).length} calendar events have conflicts that need to be
                  resolved.
                </AlertDescription>
              </Alert>

              {conflicts.map((conflict) => (
                <Card key={conflict.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Event Conflict on {formatDate(conflict.localEvent.date)}
                      </CardTitle>
                      {conflict.resolution && (
                        <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                          Resolved:{" "}
                          {conflict.resolution === "local"
                            ? "Local version"
                            : conflict.resolution === "remote"
                              ? "Remote version"
                              : "Keep both"}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 divide-x">
                      <div className="p-4 space-y-2">
                        <div className="text-sm font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                          {conflict.localEvent.source}
                        </div>
                        <h4 className="font-medium">{conflict.localEvent.title}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {conflict.localEvent.startTime} - {conflict.localEvent.endTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {conflict.localEvent.location}
                          </div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {conflict.localEvent.organizer}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="text-sm font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-green-500" />
                          {conflict.remoteEvent.source}
                        </div>
                        <h4 className="font-medium">{conflict.remoteEvent.title}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {conflict.remoteEvent.startTime} - {conflict.remoteEvent.endTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {conflict.remoteEvent.location}
                          </div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {conflict.remoteEvent.organizer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/30 px-4 py-3">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => openConflictDialog(conflict)}>
                      {conflict.resolution ? "Edit Resolution" : "Resolve Conflict"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline">Sync Again</Button>
          <Button onClick={resolveAllConflicts} disabled={conflicts.length === 0 || allResolved}>
            Resolve All Conflicts
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Calendar Conflict</DialogTitle>
            <DialogDescription>Choose which version of this event you want to keep</DialogDescription>
          </DialogHeader>

          {currentConflict && (
            <div className="space-y-4 py-4">
              <RadioGroup
                value={resolution || ""}
                onValueChange={(value) => setResolution(value as "local" | "remote" | "both")}
              >
                <div className="flex items-start space-x-2 p-3 rounded-md border">
                  <RadioGroupItem value="local" id="local" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="local" className="font-medium">
                      Keep Local Version
                    </Label>
                    <div className="text-sm text-muted-foreground mt-1">
                      <p className="font-medium">{currentConflict.localEvent.title}</p>
                      <p>
                        {currentConflict.localEvent.startTime} - {currentConflict.localEvent.endTime}
                      </p>
                      <p>From {currentConflict.localEvent.source}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-3 rounded-md border">
                  <RadioGroupItem value="remote" id="remote" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="remote" className="font-medium">
                      Keep Remote Version
                    </Label>
                    <div className="text-sm text-muted-foreground mt-1">
                      <p className="font-medium">{currentConflict.remoteEvent.title}</p>
                      <p>
                        {currentConflict.remoteEvent.startTime} - {currentConflict.remoteEvent.endTime}
                      </p>
                      <p>From {currentConflict.remoteEvent.source}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-3 rounded-md border">
                  <RadioGroupItem value="both" id="both" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="both" className="font-medium">
                      Keep Both Events
                    </Label>
                    <div className="text-sm text-muted-foreground mt-1">
                      <p>This will create duplicate events in your calendar.</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-to-all"
                  checked={applyToAll}
                  onCheckedChange={(checked) => setApplyToAll(checked === true)}
                />
                <Label htmlFor="apply-to-all">Apply this resolution to all conflicts on the same day</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={resolveConflict} disabled={!resolution}>
              Resolve Conflict
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
