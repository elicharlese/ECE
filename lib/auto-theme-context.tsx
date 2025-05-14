"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useTheme } from "next-themes"

type AutoThemeMode = "off" | "time" | "system"
type TimeRange = { start: string; end: string }

interface AutoThemeContextType {
  autoMode: AutoThemeMode
  setAutoMode: (mode: AutoThemeMode) => void
  darkTimeRange: TimeRange
  setDarkTimeRange: (range: TimeRange) => void
  isDuringDarkHours: boolean
}

const defaultDarkTimeRange: TimeRange = { start: "20:00", end: "07:00" }

const AutoThemeContext = createContext<AutoThemeContextType | undefined>(undefined)

export function AutoThemeProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme()
  const [autoMode, setAutoMode] = useState<AutoThemeMode>("off")
  const [darkTimeRange, setDarkTimeRange] = useState<TimeRange>(defaultDarkTimeRange)
  const [isDuringDarkHours, setIsDuringDarkHours] = useState<boolean>(false)

  // Load saved preferences
  useEffect(() => {
    const savedAutoMode = localStorage.getItem("autoThemeMode") as AutoThemeMode | null
    const savedTimeRange = localStorage.getItem("darkTimeRange")

    if (savedAutoMode) {
      setAutoMode(savedAutoMode)
    }

    if (savedTimeRange) {
      setDarkTimeRange(JSON.parse(savedTimeRange))
    }
  }, [])

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem("autoThemeMode", autoMode)
    localStorage.setItem("darkTimeRange", JSON.stringify(darkTimeRange))
  }, [autoMode, darkTimeRange])

  // Check if current time is within dark hours
  const checkDarkHours = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute

    const [startHour, startMinute] = darkTimeRange.start.split(":").map(Number)
    const [endHour, endMinute] = darkTimeRange.end.split(":").map(Number)

    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute

    // If start time is after end time, it means the range crosses midnight
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime < endTime
    } else {
      return currentTime >= startTime && currentTime < endTime
    }
  }

  // Update theme based on time
  useEffect(() => {
    const updateThemeByTime = () => {
      if (autoMode !== "time") return

      const isDark = checkDarkHours()
      setIsDuringDarkHours(isDark)
      setTheme(isDark ? "dark" : "light")
    }

    // Initial check
    updateThemeByTime()

    // Set up interval to check every minute
    const interval = setInterval(updateThemeByTime, 60000)

    return () => clearInterval(interval)
  }, [autoMode, darkTimeRange, setTheme])

  // Handle system preference changes if in system mode
  useEffect(() => {
    if (autoMode !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light")
    }

    // Set initial theme based on system preference
    setTheme(mediaQuery.matches ? "dark" : "light")

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [autoMode, setTheme])

  return (
    <AutoThemeContext.Provider
      value={{
        autoMode,
        setAutoMode,
        darkTimeRange,
        setDarkTimeRange,
        isDuringDarkHours,
      }}
    >
      {children}
    </AutoThemeContext.Provider>
  )
}

export const useAutoTheme = () => {
  const context = useContext(AutoThemeContext)
  if (context === undefined) {
    throw new Error("useAutoTheme must be used within an AutoThemeProvider")
  }
  return context
}
