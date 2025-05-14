"use client"

import { useState } from "react"
import { Clock, Moon, Sun, Monitor } from "lucide-react"
import { useAutoTheme } from "@/lib/auto-theme-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

export function AutoThemeSettings() {
  const { autoMode, setAutoMode, darkTimeRange, setDarkTimeRange, isDuringDarkHours } = useAutoTheme()
  const { theme } = useTheme()

  const [startTime, setStartTime] = useState(darkTimeRange.start)
  const [endTime, setEndTime] = useState(darkTimeRange.end)

  const handleSaveTimeRange = () => {
    setDarkTimeRange({ start: startTime, end: endTime })
  }

  return (
    <Card className="w-full transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5" />
          <span>Automatic Dark Mode</span>
        </CardTitle>
        <CardDescription>Configure when dark mode is automatically enabled</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={autoMode}
          onValueChange={(value) => setAutoMode(value as "off" | "time" | "system")}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="off" id="auto-off" />
            <Label htmlFor="auto-off" className="flex items-center gap-2 cursor-pointer">
              <Button variant="outline" size="icon" className="h-6 w-6 pointer-events-none">
                <Sun className="h-4 w-4" />
              </Button>
              <span>Manual (Use theme toggle)</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="auto-system" />
            <Label htmlFor="auto-system" className="flex items-center gap-2 cursor-pointer">
              <Button variant="outline" size="icon" className="h-6 w-6 pointer-events-none">
                <Monitor className="h-4 w-4" />
              </Button>
              <span>Follow system preference</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="time" id="auto-time" />
            <Label htmlFor="auto-time" className="flex items-center gap-2 cursor-pointer">
              <Button variant="outline" size="icon" className="h-6 w-6 pointer-events-none">
                <Clock className="h-4 w-4" />
              </Button>
              <span>Time-based</span>
            </Label>
          </div>
        </RadioGroup>

        {autoMode === "time" && (
          <div className="space-y-4 pt-2 pl-8 border-l-2 border-muted animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dark-start">Dark mode starts at</Label>
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dark-start"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dark-end">Dark mode ends at</Label>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dark-end"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                onClick={handleSaveTimeRange}
                variant="outline"
                size="sm"
                disabled={startTime === darkTimeRange.start && endTime === darkTimeRange.end}
              >
                Save time settings
              </Button>

              <div className="flex items-center gap-2 text-sm">
                <span>Current status:</span>
                <span className={`font-medium ${isDuringDarkHours ? "text-blue-400" : "text-yellow-500"}`}>
                  {isDuringDarkHours ? "Dark mode active" : "Light mode active"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-medium">Theme preview</h4>
              <p className="text-sm text-muted-foreground">Current theme: {theme}</p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className={`h-4 w-4 ${theme === "dark" ? "text-muted-foreground" : "text-yellow-500"}`} />
              <Switch checked={theme === "dark"} disabled aria-label="Theme preview" />
              <Moon className={`h-4 w-4 ${theme === "dark" ? "text-blue-400" : "text-muted-foreground"}`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
