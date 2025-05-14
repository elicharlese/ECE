import { addDays, addWeeks, addMonths, addYears, isSameDay, isBefore, isAfter } from "date-fns"

export type RecurrencePattern = {
  type: "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
  interval: number
  daysOfWeek?: number[] // 0-6 (Sunday-Saturday)
  dayOfMonth?: number // 1-31
  monthOfYear?: number // 1-12
  endType: "never" | "after" | "on"
  endAfterOccurrences?: number
  endDate?: Date | string
}

export interface RecurringMeeting {
  id: string
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  timezone: string
  startDate: string | Date
  recurrencePattern: RecurrencePattern
  attendees: string[]
  organizer: string
  createdAt: string
}

export interface MeetingInstance {
  id: string
  recurringMeetingId: string
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  timezone: string
  date: Date
  attendees: string[]
  organizer: string
  isException: boolean
  isCancelled: boolean
}

/**
 * Generate meeting instances for a recurring meeting within a date range
 */
export function generateMeetingInstances(
  meeting: RecurringMeeting,
  startRange: Date,
  endRange: Date,
  exceptions: Array<{ date: Date; isCancelled: boolean; changes?: Partial<MeetingInstance> }> = [],
): MeetingInstance[] {
  const instances: MeetingInstance[] = []
  const pattern = meeting.recurrencePattern
  const startDate = new Date(meeting.startDate)

  // If the start date is after the end range, no instances to generate
  if (isAfter(startDate, endRange)) {
    return []
  }

  let currentDate = new Date(startDate)
  let occurrenceCount = 0
  const maxOccurrences =
    pattern.endType === "after" ? pattern.endAfterOccurrences || Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY
  const patternEndDate = pattern.endType === "on" && pattern.endDate ? new Date(pattern.endDate) : null

  // Check if we've reached the end of the pattern
  const hasReachedPatternEnd = () => {
    if (occurrenceCount >= maxOccurrences) {
      return true
    }
    if (patternEndDate && isAfter(currentDate, patternEndDate)) {
      return true
    }
    return false
  }

  // Generate instances until we reach the end of the range or pattern
  while (isBefore(currentDate, endRange) && !hasReachedPatternEnd()) {
    // Check if this date is within our range
    if (!isBefore(currentDate, startRange)) {
      // Check if this date has an exception
      const exception = exceptions.find((ex) => isSameDay(ex.date, currentDate))

      if (exception) {
        if (!exception.isCancelled) {
          // This is a modified instance
          instances.push({
            id: `${meeting.id}-${currentDate.toISOString().split("T")[0]}`,
            recurringMeetingId: meeting.id,
            title: exception.changes?.title || meeting.title,
            description: exception.changes?.description || meeting.description,
            location: exception.changes?.location || meeting.location,
            startTime: exception.changes?.startTime || meeting.startTime,
            endTime: exception.changes?.endTime || meeting.endTime,
            timezone: exception.changes?.timezone || meeting.timezone,
            date: new Date(currentDate),
            attendees: exception.changes?.attendees || meeting.attendees,
            organizer: meeting.organizer,
            isException: true,
            isCancelled: false,
          })
        }
        // If cancelled, we don't add it to the instances
      } else {
        // Regular instance
        instances.push({
          id: `${meeting.id}-${currentDate.toISOString().split("T")[0]}`,
          recurringMeetingId: meeting.id,
          title: meeting.title,
          description: meeting.description,
          location: meeting.location,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          timezone: meeting.timezone,
          date: new Date(currentDate),
          attendees: meeting.attendees,
          organizer: meeting.organizer,
          isException: false,
          isCancelled: false,
        })
      }
    }

    // Move to the next occurrence
    occurrenceCount++

    // Calculate next date based on pattern
    switch (pattern.type) {
      case "daily":
        currentDate = addDays(currentDate, pattern.interval)
        break
      case "weekly":
        if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
          // For weekly with multiple days, we need to find the next day of the week
          const currentDay = currentDate.getDay()
          const daysOfWeek = [...pattern.daysOfWeek].sort((a, b) => a - b)

          // Find the next day of week
          const nextDayIndex = daysOfWeek.findIndex((day) => day > currentDay)

          if (nextDayIndex !== -1) {
            // There's a day later this week
            const daysToAdd = daysOfWeek[nextDayIndex] - currentDay
            currentDate = addDays(currentDate, daysToAdd)
          } else {
            // Move to the first day of next week
            const daysToAdd = 7 - currentDay + daysOfWeek[0]
            currentDate = addDays(currentDate, daysToAdd + 7 * (pattern.interval - 1))
          }
        } else {
          // Simple weekly
          currentDate = addDays(currentDate, 7 * pattern.interval)
        }
        break
      case "biweekly":
        if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
          // Similar to weekly but with 2-week interval
          const currentDay = currentDate.getDay()
          const daysOfWeek = [...pattern.daysOfWeek].sort((a, b) => a - b)

          const nextDayIndex = daysOfWeek.findIndex((day) => day > currentDay)

          if (nextDayIndex !== -1) {
            // There's a day later this week
            const daysToAdd = daysOfWeek[nextDayIndex] - currentDay
            currentDate = addDays(currentDate, daysToAdd)
          } else {
            // Move to the first day of next biweekly period
            const daysToAdd = 7 - currentDay + daysOfWeek[0]
            currentDate = addDays(currentDate, daysToAdd + 14 * (pattern.interval - 1))
          }
        } else {
          // Simple biweekly
          currentDate = addWeeks(currentDate, 2 * pattern.interval)
        }
        break
      case "monthly":
        currentDate = addMonths(currentDate, pattern.interval)
        // Adjust to the specific day of month if specified
        if (pattern.dayOfMonth) {
          currentDate.setDate(
            Math.min(pattern.dayOfMonth, new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()),
          )
        }
        break
      case "yearly":
        currentDate = addYears(currentDate, pattern.interval)
        // Adjust to specific month and day if specified
        if (pattern.monthOfYear) {
          currentDate.setMonth(pattern.monthOfYear - 1)
        }
        if (pattern.dayOfMonth) {
          currentDate.setDate(
            Math.min(pattern.dayOfMonth, new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()),
          )
        }
        break
      default:
        currentDate = addDays(currentDate, 1)
    }
  }

  return instances
}
