"use client"

import { useAutoTheme } from "@/lib/auto-theme-context"
import { Clock, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"

export function AutoThemeIndicator() {
  const { autoMode, isDuringDarkHours } = useAutoTheme()
  const { theme } = useTheme()

  if (autoMode === "off") return null

  return (
    <Badge variant="outline" className="ml-2 animate-in fade-in duration-300">
      {autoMode === "time" ? (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span className="text-xs">{isDuringDarkHours ? "Night mode" : "Day mode"}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          {theme === "dark" ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
          <span className="text-xs">System</span>
        </div>
      )}
    </Badge>
  )
}
