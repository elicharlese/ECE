"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = "ece-theme"

function getSystemPrefersDark() {
  if (typeof window === "undefined") return false
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
}

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const isDark = theme === "dark" || (theme === "system" && getSystemPrefersDark())
  root.classList.toggle("dark", isDark)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light"
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
    return stored ?? "light"
  })

  // Apply theme class on mount and when theme changes
  useEffect(() => {
    applyThemeClass(theme)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme)
    }
  }, [theme])

  // React to system changes when using system theme
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      if (theme === "system") applyThemeClass("system")
    }
    mq.addEventListener?.("change", handler)
    return () => mq.removeEventListener?.("change", handler)
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
