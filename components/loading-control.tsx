"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useLoading } from "@/lib/loading-context"
import { useState, useEffect } from "react"

export function LoadingControl() {
  const { loadingDuration, setLoadingDuration } = useLoading()
  const [value, setValue] = useState([loadingDuration / 1000])

  useEffect(() => {
    setValue([loadingDuration / 1000])
  }, [loadingDuration])

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue)
    setLoadingDuration(newValue[0] * 1000)
  }

  return (
    <div className="p-4 bg-card border rounded-lg shadow-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="loading-speed">Loading Animation Speed</Label>
          <span className="text-sm font-medium">{value[0].toFixed(1)}s</span>
        </div>
        <Slider
          id="loading-speed"
          min={1}
          max={10}
          step={0.5}
          value={value}
          onValueChange={handleValueChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Faster</span>
          <span>Slower</span>
        </div>
      </div>
    </div>
  )
}
