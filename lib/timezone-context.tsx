"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { useDemo } from "./demo-context"
import { supabase } from "./supabase-client"
import { useToast } from "@/hooks/use-toast"

// List of common timezones with their UTC offsets
export const COMMON_TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)", offset: 0 },
  { value: "America/New_York", label: "Eastern Time (ET)", offset: -5 },
  { value: "America/Chicago", label: "Central Time (CT)", offset: -6 },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: -7 },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: -8 },
  { value: "America/Anchorage", label: "Alaska Time", offset: -9 },
  { value: "Pacific/Honolulu", label: "Hawaii Time", offset: -10 },
  { value: "Europe/London", label: "GMT/BST (UK)", offset: 0 },
  { value: "Europe/Paris", label: "Central European Time", offset: 1 },
  { value: "Europe/Helsinki", label: "Eastern European Time", offset: 2 },
  { value: "Asia/Dubai", label: "Gulf Standard Time", offset: 4 },
  { value: "Asia/Kolkata", label: "India Standard Time", offset: 5.5 },
  { value: "Asia/Singapore", label: "Singapore Time", offset: 8 },
  { value: "Asia/Tokyo", label: "Japan Standard Time", offset: 9 },
  { value: "Australia/Sydney", label: "Australian Eastern Time", offset: 10 },
  { value: "Pacific/Auckland", label: "New Zealand Time", offset: 12 },
]

// Get all IANA timezone identifiers
export const ALL_TIMEZONES = Intl.supportedValuesOf("timeZone").map((tz) => {
  // Try to get the offset for this timezone
  try {
    const now = new Date()
    const offset =
      new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "shortOffset",
      })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value || ""

    return {
      value: tz,
      label: `${tz.replace(/_/g, " ")} (${offset})`,
      offset: Number.parseFloat(offset.replace("GMT", "").replace(":", ".")) || 0,
    }
  } catch (e) {
    return {
      value: tz,
      label: tz.replace(/_/g, " "),
      offset: 0,
    }
  }
})

export type TimezonePreferences = {
  userTimezone: string
  showMultipleTimezones: boolean
  additionalTimezones: string[]
  format24Hour: boolean
  showTimezoneIndicator: boolean
}

type TimezoneContextType = {
  preferences: TimezonePreferences
  isLoading: boolean
  updatePreferences: (newPreferences: Partial<TimezonePreferences>) => Promise<void>
  convertTime: (time: string, date: string, fromTimezone: string, toTimezone: string) => string
  formatTimeWithTimezone: (time: string, date: string, timezone: string) => string
  getCurrentTimezoneOffset: (timezone?: string) => number
  getTimezoneAbbreviation: (timezone: string) => string
  getLocalTime: (timezone?: string) => Date
}

const defaultPreferences: TimezonePreferences = {
  userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  showMultipleTimezones: false,
  additionalTimezones: [],
  format24Hour: false,
  showTimezoneIndicator: true,
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined)

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<TimezonePreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { isDemoMode } = useDemo()
  const { toast } = useToast()

  // Load timezone preferences
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true)

      try {
        if (isDemoMode) {
          // Set demo preferences
          setPreferences({
            ...defaultPreferences,
            additionalTimezones: ["America/New_York", "Europe/London", "Asia/Tokyo"],
            showMultipleTimezones: true,
          })
        } else if (user) {
          // Load real data from Supabase
          const { data, error } = await supabase
            .from("timezone_preferences")
            .select("*")
            .eq("user_id", user.id)
            .single()

          if (error && error.code !== "PGRST116") {
            console.error("Error loading timezone preferences:", error)
          }

          if (data) {
            setPreferences({
              userTimezone: data.user_timezone,
              showMultipleTimezones: data.show_multiple_timezones,
              additionalTimezones: data.additional_timezones || [],
              format24Hour: data.format_24_hour,
              showTimezoneIndicator: data.show_timezone_indicator,
            })
          } else {
            // Create default preferences if none exist
            const { error: insertError } = await supabase.from("timezone_preferences").insert([
              {
                user_id: user.id,
                user_timezone: defaultPreferences.userTimezone,
                show_multiple_timezones: defaultPreferences.showMultipleTimezones,
                additional_timezones: defaultPreferences.additionalTimezones,
                format_24_hour: defaultPreferences.format24Hour,
                show_timezone_indicator: defaultPreferences.showTimezoneIndicator,
              },
            ])

            if (insertError) {
              console.error("Error creating timezone preferences:", insertError)
            }

            setPreferences(defaultPreferences)
          }
        }
      } catch (error) {
        console.error("Error in loadPreferences:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [user, isDemoMode])

  // Update timezone preferences
  const updatePreferences = async (newPreferences: Partial<TimezonePreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences }

      if (isDemoMode) {
        setPreferences(updatedPreferences)
      } else if (user) {
        const { error } = await supabase
          .from("timezone_preferences")
          .update({
            user_timezone: updatedPreferences.userTimezone,
            show_multiple_timezones: updatedPreferences.showMultipleTimezones,
            additional_timezones: updatedPreferences.additionalTimezones,
            format_24_hour: updatedPreferences.format24Hour,
            show_timezone_indicator: updatedPreferences.showTimezoneIndicator,
          })
          .eq("user_id", user.id)

        if (error) throw error

        setPreferences(updatedPreferences)
      }

      toast({
        title: "Success",
        description: "Timezone preferences updated",
      })
    } catch (error) {
      console.error("Error updating timezone preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update timezone preferences",
        variant: "destructive",
      })
    }
  }

  // Convert time between timezones
  const convertTime = (time: string, date: string, fromTimezone: string, toTimezone: string): string => {
    try {
      // Parse the input time and date
      const [hours, minutes] = time.split(":").map(Number)
      const [year, month, day] = date.split("-").map(Number)

      // Create a date object in the source timezone
      const sourceDate = new Date(Date.UTC(year, month - 1, day, hours, minutes))

      // Format the time in the target timezone
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: !preferences.format24Hour,
        timeZone: toTimezone,
      })

      return formatter.format(sourceDate)
    } catch (error) {
      console.error("Error converting time:", error)
      return time // Return original time if conversion fails
    }
  }

  // Format time with timezone indicator
  const formatTimeWithTimezone = (time: string, date: string, timezone: string): string => {
    try {
      // Parse the input time and date
      const [hours, minutes] = time.split(":").map(Number)
      const [year, month, day] = date.split("-").map(Number)

      // Create a date object
      const dateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes))

      // Format the time with timezone
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: !preferences.format24Hour,
        timeZone: timezone,
        timeZoneName: "short",
      })

      return formatter.format(dateObj)
    } catch (error) {
      console.error("Error formatting time with timezone:", error)
      return time // Return original time if formatting fails
    }
  }

  // Get current timezone offset in hours
  const getCurrentTimezoneOffset = (timezone?: string): number => {
    try {
      const tz = timezone || preferences.userTimezone
      const now = new Date()
      const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }))
      const tzDate = new Date(now.toLocaleString("en-US", { timeZone: tz }))
      return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
    } catch (error) {
      console.error("Error getting timezone offset:", error)
      return 0
    }
  }

  // Get timezone abbreviation (e.g., EST, PST)
  const getTimezoneAbbreviation = (timezone: string): string => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "short",
      })

      const parts = formatter.formatToParts(new Date())
      const tzPart = parts.find((part) => part.type === "timeZoneName")
      return tzPart?.value || timezone
    } catch (error) {
      console.error("Error getting timezone abbreviation:", error)
      return timezone
    }
  }

  // Get current local time in specified timezone
  const getLocalTime = (timezone?: string): Date => {
    try {
      const tz = timezone || preferences.userTimezone
      const now = new Date()

      // Get the UTC time
      const utcYear = now.getUTCFullYear()
      const utcMonth = now.getUTCMonth()
      const utcDate = now.getUTCDate()
      const utcHours = now.getUTCHours()
      const utcMinutes = now.getUTCMinutes()
      const utcSeconds = now.getUTCSeconds()

      // Create a date string in ISO format
      const isoDate = `${utcYear}-${String(utcMonth + 1).padStart(2, "0")}-${String(utcDate).padStart(2, "0")}T${String(utcHours).padStart(2, "0")}:${String(utcMinutes).padStart(2, "0")}:${String(utcSeconds).padStart(2, "0")}Z`

      // Create a date object with the timezone
      const options = { timeZone: tz }
      const formatter = new Intl.DateTimeFormat("en-US", options)

      // Format the date in the target timezone
      return new Date(formatter.format(new Date(isoDate)))
    } catch (error) {
      console.error("Error getting local time:", error)
      return new Date()
    }
  }

  return (
    <TimezoneContext.Provider
      value={{
        preferences,
        isLoading,
        updatePreferences,
        convertTime,
        formatTimeWithTimezone,
        getCurrentTimezoneOffset,
        getTimezoneAbbreviation,
        getLocalTime,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  )
}

export function useTimezone() {
  const context = useContext(TimezoneContext)
  if (context === undefined) {
    throw new Error("useTimezone must be used within a TimezoneProvider")
  }
  return context
}
