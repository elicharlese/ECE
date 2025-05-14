"use client"

import { useState, useEffect } from "react"
import { format, addDays, addWeeks, addMonths, addYears, getDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type RecurrencePattern = {
  type: "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
  interval: number
  daysOfWeek?: number[] // 0-6 (Sunday-Saturday)
  dayOfMonth?: number // 1-31
  monthOfYear?: number // 1-12
  endType: "never" | "after" | "on"
  endAfterOccurrences?: number
  endDate?: Date
}

interface RecurrencePatternSelectorProps {
  startDate: Date
  value: RecurrencePattern
  onChange: (pattern: RecurrencePattern) => void
}

export function RecurrencePatternSelector({ startDate, value, onChange }: RecurrencePatternSelectorProps) {
  const [pattern, setPattern] = useState<RecurrencePattern>(value)

  // Update parent component when pattern changes
  useEffect(() => {
    onChange(pattern)
  }, [pattern, onChange])

  // Update local state when value changes
  useEffect(() => {
    setPattern(value)
  }, [value])

  // Handle pattern type change
  const handlePatternTypeChange = (type: RecurrencePattern["type"]) => {
    const newPattern = { ...pattern, type }

    // Set default values based on pattern type
    if (type === "weekly" || type === "biweekly") {
      newPattern.daysOfWeek = [getDay(startDate)]
    } else if (type === "monthly") {
      newPattern.dayOfMonth = startDate.getDate()
    } else if (type === "yearly") {
      newPattern.dayOfMonth = startDate.getDate()
      newPattern.monthOfYear = startDate.getMonth() + 1
    }

    setPattern(newPattern)
  }

  // Handle day of week toggle
  const toggleDayOfWeek = (day: number) => {
    const daysOfWeek = pattern.daysOfWeek || []
    const newDaysOfWeek = daysOfWeek.includes(day) ? daysOfWeek.filter((d) => d !== day) : [...daysOfWeek, day]
    setPattern({ ...pattern, daysOfWeek: newDaysOfWeek })
  }

  // Get next occurrence based on pattern
  const getNextOccurrence = () => {
    if (!startDate) return "No start date selected"

    try {
      let nextDate: Date

      switch (pattern.type) {
        case "daily":
          nextDate = addDays(startDate, pattern.interval)
          break
        case "weekly":
          nextDate = addDays(startDate, 7 * pattern.interval)
          break
        case "biweekly":
          nextDate = addWeeks(startDate, 2 * pattern.interval)
          break
        case "monthly":
          nextDate = addMonths(startDate, pattern.interval)
          break
        case "yearly":
          nextDate = addYears(startDate, pattern.interval)
          break
        default:
          return "Unknown pattern type"
      }

      return format(nextDate, "EEEE, MMMM d, yyyy")
    } catch (error) {
      console.error("Error calculating next occurrence:", error)
      return "Error calculating next occurrence"
    }
  }

  // Get recurrence summary
  const getRecurrenceSummary = () => {
    if (!startDate) return "No start date selected"

    try {
      let summary = ""

      switch (pattern.type) {
        case "daily":
          summary = pattern.interval === 1 ? "Daily" : `Every ${pattern.interval} days`
          break
        case "weekly":
          summary =
            pattern.interval === 1
              ? `Weekly on ${getDaysOfWeekText()}`
              : `Every ${pattern.interval} weeks on ${getDaysOfWeekText()}`
          break
        case "biweekly":
          summary = `Every 2 weeks on ${getDaysOfWeekText()}`
          break
        case "monthly":
          summary =
            pattern.interval === 1
              ? `Monthly on day ${pattern.dayOfMonth}`
              : `Every ${pattern.interval} months on day ${pattern.dayOfMonth}`
          break
        case "yearly":
          const monthName = new Date(2000, (pattern.monthOfYear || 1) - 1, 1).toLocaleString("default", {
            month: "long",
          })
          summary =
            pattern.interval === 1
              ? `Yearly on ${monthName} ${pattern.dayOfMonth}`
              : `Every ${pattern.interval} years on ${monthName} ${pattern.dayOfMonth}`
          break
        default:
          return "Unknown pattern type"
      }

      // Add end condition
      if (pattern.endType === "never") {
        summary += ", never ends"
      } else if (pattern.endType === "after" && pattern.endAfterOccurrences) {
        summary += `, for ${pattern.endAfterOccurrences} occurrences`
      } else if (pattern.endType === "on" && pattern.endDate) {
        summary += `, until ${format(pattern.endDate, "MMMM d, yyyy")}`
      }

      return summary
    } catch (error) {
      console.error("Error generating recurrence summary:", error)
      return "Error generating recurrence summary"
    }
  }

  // Helper function to get days of week text
  const getDaysOfWeekText = () => {
    const daysOfWeek = pattern.daysOfWeek || []
    if (daysOfWeek.length === 0) return "no days selected"

    const dayNames = daysOfWeek
      .sort((a, b) => a - b)
      .map((day) => {
        const date = new Date(2000, 0, 2 + day) // Jan 2, 2000 is a Sunday
        return date.toLocaleString("default", { weekday: "short" })
      })

    if (dayNames.length === 1) return dayNames[0]
    if (dayNames.length === 7) return "all days"

    const lastDay = dayNames.pop()
    return `${dayNames.join(", ")} and ${lastDay}`
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Repeat</Label>
        <RadioGroup
          value={pattern.type}
          onValueChange={(value) => handlePatternTypeChange(value as RecurrencePattern["type"])}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily" className="cursor-pointer">
              Daily
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly" className="cursor-pointer">
              Weekly
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="biweekly" id="biweekly" />
            <Label htmlFor="biweekly" className="cursor-pointer">
              Every 2 weeks
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="cursor-pointer">
              Monthly
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="yearly" />
            <Label htmlFor="yearly" className="cursor-pointer">
              Yearly
            </Label>
          </div>
        </RadioGroup>
      </div>

      {pattern.type === "daily" && (
        <div className="flex items-center space-x-2">
          <Label htmlFor="dailyInterval">Every</Label>
          <Input
            id="dailyInterval"
            type="number"
            min={1}
            max={365}
            value={pattern.interval}
            onChange={(e) => setPattern({ ...pattern, interval: Number.parseInt(e.target.value) || 1 })}
            className="w-16"
          />
          <span>day(s)</span>
        </div>
      )}

      {(pattern.type === "weekly" || pattern.type === "biweekly") && (
        <div className="space-y-2">
          {pattern.type === "weekly" && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="weeklyInterval">Every</Label>
              <Input
                id="weeklyInterval"
                type="number"
                min={1}
                max={52}
                value={pattern.interval}
                onChange={(e) => setPattern({ ...pattern, interval: Number.parseInt(e.target.value) || 1 })}
                className="w-16"
              />
              <span>week(s)</span>
            </div>
          )}
          <Label>Repeat on</Label>
          <div className="grid grid-cols-7 gap-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <Checkbox
                  id={`day-${index}`}
                  checked={(pattern.daysOfWeek || []).includes(index)}
                  onCheckedChange={() => toggleDayOfWeek(index)}
                  className="mb-1"
                />
                <Label htmlFor={`day-${index}`} className="text-xs cursor-pointer">
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {pattern.type === "monthly" && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="monthlyInterval">Every</Label>
            <Input
              id="monthlyInterval"
              type="number"
              min={1}
              max={12}
              value={pattern.interval}
              onChange={(e) => setPattern({ ...pattern, interval: Number.parseInt(e.target.value) || 1 })}
              className="w-16"
            />
            <span>month(s)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dayOfMonth">Day of month</Label>
            <Select
              value={pattern.dayOfMonth?.toString() || startDate.getDate().toString()}
              onValueChange={(value) => setPattern({ ...pattern, dayOfMonth: Number.parseInt(value) })}
            >
              <SelectTrigger id="dayOfMonth" className="w-20">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {pattern.type === "yearly" && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="yearlyInterval">Every</Label>
            <Input
              id="yearlyInterval"
              type="number"
              min={1}
              max={10}
              value={pattern.interval}
              onChange={(e) => setPattern({ ...pattern, interval: Number.parseInt(e.target.value) || 1 })}
              className="w-16"
            />
            <span>year(s)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="monthOfYear">Month</Label>
            <Select
              value={pattern.monthOfYear?.toString() || (startDate.getMonth() + 1).toString()}
              onValueChange={(value) => setPattern({ ...pattern, monthOfYear: Number.parseInt(value) })}
            >
              <SelectTrigger id="monthOfYear" className="w-32">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="yearlyDayOfMonth">Day</Label>
            <Select
              value={pattern.dayOfMonth?.toString() || startDate.getDate().toString()}
              onValueChange={(value) => setPattern({ ...pattern, dayOfMonth: Number.parseInt(value) })}
            >
              <SelectTrigger id="yearlyDayOfMonth" className="w-20">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>End</Label>
        <RadioGroup
          value={pattern.endType}
          onValueChange={(value) => setPattern({ ...pattern, endType: value as RecurrencePattern["endType"] })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="end-never" />
            <Label htmlFor="end-never" className="cursor-pointer">
              Never
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="after" id="end-after" />
            <Label htmlFor="end-after" className="cursor-pointer">
              After
            </Label>
            <Input
              type="number"
              min={1}
              max={999}
              value={pattern.endAfterOccurrences || 10}
              onChange={(e) =>
                setPattern({ ...pattern, endAfterOccurrences: Number.parseInt(e.target.value) || 10, endType: "after" })
              }
              className="w-16"
              disabled={pattern.endType !== "after"}
            />
            <span>occurrences</span>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="on" id="end-on" />
            <Label htmlFor="end-on" className="cursor-pointer">
              On
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal",
                    !pattern.endDate && "text-muted-foreground",
                  )}
                  onClick={() => {
                    if (pattern.endType !== "on") {
                      setPattern({ ...pattern, endType: "on" })
                    }
                  }}
                  disabled={pattern.endType !== "on"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pattern.endDate ? format(pattern.endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={pattern.endDate}
                  onSelect={(date) => setPattern({ ...pattern, endDate: date, endType: "on" })}
                  initialFocus
                  disabled={(date) => date < startDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-2 border-t">
        <div className="text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Summary:</span> {getRecurrenceSummary()}
          </div>
          <div className="mt-1">
            <span className="font-medium">Next occurrence:</span> {getNextOccurrence()}
          </div>
        </div>
      </div>
    </div>
  )
}
