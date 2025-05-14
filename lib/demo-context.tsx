"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import {
  enableDemoMode as enableDemo,
  disableDemoMode as disableDemo,
  isDemoModeEnabled,
  navigateTo,
} from "./demo-utils"

type DemoContextType = {
  isDemoMode: boolean
  enableDemoMode: () => void
  disableDemoMode: () => void
}

const DemoContext = createContext<DemoContextType>({
  isDemoMode: false,
  enableDemoMode: () => {},
  disableDemoMode: () => {},
})

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Check demo mode status on mount
  useEffect(() => {
    const isEnabled = isDemoModeEnabled()
    setIsDemoMode(isEnabled)
  }, [])

  const enableDemoMode = () => {
    const success = enableDemo()
    if (success) {
      setIsDemoMode(true)
    }
  }

  const disableDemoMode = () => {
    const success = disableDemo()
    if (success) {
      setIsDemoMode(false)
      navigateTo("/login")
    }
  }

  return <DemoContext.Provider value={{ isDemoMode, enableDemoMode, disableDemoMode }}>{children}</DemoContext.Provider>
}

export const useDemo = () => useContext(DemoContext)
