"use client"

import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { LoadingButton } from "@/components/ui/loading-button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Moon, Sun, Laptop } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { updateUserSettings, useUserSettings } from "@/lib/user-profile"
import { useAutosave } from "@/hooks/use-autosave"
import { AutosaveIndicator } from "@/components/ui/autosave-indicator"

export function AppearanceForm() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const { isDemoMode } = useDemo()
  const userSettings = useUserSettings()
  const [isLoading, setIsLoading] = useState(false)
  const [fontSize, setFontSize] = useState("medium")
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Load user settings
  useEffect(() => {
    if (userSettings) {
      setFontSize(userSettings.fontSize || "medium")
      setReducedMotion(userSettings.reducedMotion || false)
      setHighContrast(userSettings.highContrast || false)
    }
  }, [userSettings])

  const appearanceSettings = {
    theme,
    fontSize,
    reducedMotion,
    highContrast,
  }

  const saveAppearance = async (data: typeof appearanceSettings) => {
    if (isDemoMode) {
      // Simulate API call for demo mode
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return
    }

    if (user) {
      // Actually update the user settings
      await updateUserSettings(user.id, data)
    }
  }

  const { status: autosaveStatus, forceSave } = useAutosave({
    data: appearanceSettings,
    onSave: saveAppearance,
    debounceMs: 1000,
  })

  const handleSaveAppearance = async () => {
    setIsLoading(true)

    try {
      await forceSave()

      toast({
        title: "Appearance settings saved",
        description: "Your appearance preferences have been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Appearance settings update error:", error)
      toast({
        title: "Error",
        description: "Failed to update appearance settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Appearance Settings</h3>
        <AutosaveIndicator status={autosaveStatus} />
      </div>

      <div>
        <h3 className="text-lg font-medium">Theme</h3>
        <p className="text-sm text-muted-foreground mb-4">Select your preferred theme for the application.</p>

        <RadioGroup defaultValue={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
          <div>
            <RadioGroupItem value="light" id="theme-light" className="sr-only peer" />
            <Label
              htmlFor="theme-light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Sun className="mb-3 h-6 w-6" />
              Light
            </Label>
          </div>

          <div>
            <RadioGroupItem value="dark" id="theme-dark" className="sr-only peer" />
            <Label
              htmlFor="theme-dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Moon className="mb-3 h-6 w-6" />
              Dark
            </Label>
          </div>

          <div>
            <RadioGroupItem value="system" id="theme-system" className="sr-only peer" />
            <Label
              htmlFor="theme-system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Laptop className="mb-3 h-6 w-6" />
              System
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Font Size</h3>
        <p className="text-sm text-muted-foreground mb-4">Choose your preferred font size for the application.</p>

        <Select value={fontSize} onValueChange={setFontSize}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select font size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium (Default)</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="x-large">Extra Large</SelectItem>
          </SelectContent>
        </Select>

        <p className="text-sm text-muted-foreground mt-2">
          This setting will adjust the font size throughout the application.
        </p>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Accessibility</h3>
        <p className="text-sm text-muted-foreground mb-4">Customize accessibility settings for a better experience.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Reduced motion</p>
              <p className="text-sm text-muted-foreground">Reduce the amount of animations in the interface.</p>
            </div>
            <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">High contrast</p>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility.</p>
            </div>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <LoadingButton
          onClick={handleSaveAppearance}
          isLoading={isLoading}
          loadingText="Saving..."
          className="bg-primary hover:bg-primary/90"
        >
          Save Preferences
        </LoadingButton>
      </div>
    </div>
  )
}
