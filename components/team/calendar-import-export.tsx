"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, FileUp, Info, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export function CalendarImportExport() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("import")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importFormat, setImportFormat] = useState("ics")
  const [importTarget, setImportTarget] = useState("new")
  const [exportFormat, setExportFormat] = useState("ics")
  const [exportDateRange, setExportDateRange] = useState("all")
  const [exportCalendars, setExportCalendars] = useState<string[]>(["work", "personal"])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0])
    }
  }

  // Handle import
  const handleImport = () => {
    if (!importFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to import.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    // Simulate file upload and processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)

          toast({
            title: "Import successful",
            description: `Successfully imported events from ${importFile.name}`,
          })

          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // Handle export
  const handleExport = () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate export processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)

          toast({
            title: "Export successful",
            description: `Calendar data has been exported as ${exportFormat.toUpperCase()}`,
          })

          // In a real app, this would trigger a file download
          const link = document.createElement("a")
          link.href = "#"
          link.download = `calendar-export-${new Date().toISOString().split("T")[0]}.${exportFormat}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // Toggle export calendar selection
  const toggleExportCalendar = (calendarId: string) => {
    if (exportCalendars.includes(calendarId)) {
      setExportCalendars(exportCalendars.filter((id) => id !== calendarId))
    } else {
      setExportCalendars([...exportCalendars, calendarId])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import & Export</CardTitle>
        <CardDescription>Import events from external files or export your calendar data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="import-file">Select File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="import-file"
                  type="file"
                  accept=".ics,.csv,.xlsx"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => document.getElementById("import-file")?.click()}
                  disabled={isProcessing}
                >
                  <FileUp className="h-4 w-4" />
                </Button>
              </div>
              {importFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {importFile.name} ({Math.round(importFile.size / 1024)} KB)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-format">File Format</Label>
              <Select value={importFormat} onValueChange={setImportFormat} disabled={isProcessing}>
                <SelectTrigger id="import-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ics">iCalendar (.ics)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Import To</Label>
              <RadioGroup value={importTarget} onValueChange={setImportTarget} disabled={isProcessing}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="import-new" />
                  <Label htmlFor="import-new">Create new calendar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="import-existing" />
                  <Label htmlFor="import-existing">Add to existing calendar</Label>
                </div>
              </RadioGroup>
            </div>

            {importTarget === "existing" && (
              <div className="space-y-2">
                <Label htmlFor="target-calendar">Target Calendar</Label>
                <Select disabled={isProcessing}>
                  <SelectTrigger id="target-calendar">
                    <SelectValue placeholder="Select calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work Calendar</SelectItem>
                    <SelectItem value="personal">Personal Calendar</SelectItem>
                    <SelectItem value="team">Team Calendar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="import-duplicates" disabled={isProcessing} />
                <Label htmlFor="import-duplicates">Skip duplicate events</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="import-reminders" disabled={isProcessing} />
                <Label htmlFor="import-reminders">Import reminders and notifications</Label>
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <Label>Importing...</Label>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Processing {importFile?.name}... {progress}%
                </p>
              </div>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Import Information</AlertTitle>
              <AlertDescription>
                Importing large files may take some time. Do not close this window during import.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat} disabled={isProcessing}>
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ics">iCalendar (.ics)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-date-range">Date Range</Label>
              <Select value={exportDateRange} onValueChange={setExportDateRange} disabled={isProcessing}>
                <SelectTrigger id="export-date-range">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All events</SelectItem>
                  <SelectItem value="future">Future events only</SelectItem>
                  <SelectItem value="past">Past events only</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {exportDateRange === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="export-start-date">Start Date</Label>
                  <Input id="export-start-date" type="date" disabled={isProcessing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="export-end-date">End Date</Label>
                  <Input id="export-end-date" type="date" disabled={isProcessing} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Calendars to Export</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-work"
                    checked={exportCalendars.includes("work")}
                    onCheckedChange={() => toggleExportCalendar("work")}
                    disabled={isProcessing}
                  />
                  <Label htmlFor="export-work">Work Calendar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-personal"
                    checked={exportCalendars.includes("personal")}
                    onCheckedChange={() => toggleExportCalendar("personal")}
                    disabled={isProcessing}
                  />
                  <Label htmlFor="export-personal">Personal Calendar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-team"
                    checked={exportCalendars.includes("team")}
                    onCheckedChange={() => toggleExportCalendar("team")}
                    disabled={isProcessing}
                  />
                  <Label htmlFor="export-team">Team Calendar</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="export-private" disabled={isProcessing} />
                <Label htmlFor="export-private">Include private events</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="export-reminders" disabled={isProcessing} />
                <Label htmlFor="export-reminders">Include reminders and notifications</Label>
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <Label>Exporting...</Label>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">Preparing export... {progress}%</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" disabled={isProcessing}>
          Cancel
        </Button>
        {activeTab === "import" ? (
          <Button onClick={handleImport} disabled={!importFile || isProcessing}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        ) : (
          <Button onClick={handleExport} disabled={exportCalendars.length === 0 || isProcessing}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
