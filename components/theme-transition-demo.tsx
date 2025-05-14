"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeTransitionDemo() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    if (theme === newTheme || !mounted) return

    setIsTransitioning(true)

    // Trigger the theme change event
    window.dispatchEvent(new Event("themechange"))

    // Apply theme change
    setTheme(newTheme)

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }

  if (!mounted) return null

  return (
    <Card className="w-full max-w-md mx-auto theme-scale">
      <CardHeader>
        <CardTitle className="theme-fade">Theme Transition Demo</CardTitle>
        <CardDescription className="theme-fade">Experience smooth transitions between themes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground theme-fade">
          Click the buttons below to see the smooth transition effects when switching between themes.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className={`flex items-center justify-center gap-2 ${isTransitioning ? "pointer-events-none" : ""}`}
            onClick={() => handleThemeChange("light")}
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className={`flex items-center justify-center gap-2 ${isTransitioning ? "pointer-events-none" : ""}`}
            onClick={() => handleThemeChange("dark")}
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            className={`flex items-center justify-center gap-2 ${isTransitioning ? "pointer-events-none" : ""}`}
            onClick={() => handleThemeChange("system")}
          >
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Current theme: <span className="font-medium">{theme}</span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className={isTransitioning ? "pointer-events-none opacity-50" : ""}
          onClick={() => {
            const themes = ["light", "dark", "system"]
            const currentIndex = themes.indexOf(theme || "system")
            const nextIndex = (currentIndex + 1) % themes.length
            handleThemeChange(themes[nextIndex])
          }}
        >
          Cycle themes
        </Button>
      </CardFooter>
    </Card>
  )
}
