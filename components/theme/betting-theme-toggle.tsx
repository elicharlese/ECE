"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function BettingThemeToggle() {
  const [isBettingDarkMode, setIsBettingDarkMode] = useState(false)
  const { toast } = useToast()

  // Load preference from localStorage on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem("bettingDarkMode")
    if (storedPreference === "true") {
      setIsBettingDarkMode(true)
      document.body.classList.add("betting-dark-mode")
    }
  }, [])

  // Toggle the betting dark mode
  const toggleBettingDarkMode = () => {
    const newState = !isBettingDarkMode
    setIsBettingDarkMode(newState)

    if (newState) {
      document.body.classList.add("betting-dark-mode")
      localStorage.setItem("bettingDarkMode", "true")
      toast({
        title: "Betting Dark Mode Enabled",
        description: "Enjoy the immersive betting experience!",
        duration: 3000,
      })
    } else {
      document.body.classList.remove("betting-dark-mode")
      localStorage.setItem("bettingDarkMode", "false")
      toast({
        title: "Betting Dark Mode Disabled",
        description: "Returned to standard theme",
        duration: 3000,
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleBettingDarkMode}
      className={`w-10 h-10 relative ${isBettingDarkMode ? "bg-[#2a2a2a] border-[#444444] text-white" : ""}`}
      aria-label={isBettingDarkMode ? "Disable betting dark mode" : "Enable betting dark mode"}
    >
      {isBettingDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">{isBettingDarkMode ? "Disable betting dark mode" : "Enable betting dark mode"}</span>
    </Button>
  )
}
