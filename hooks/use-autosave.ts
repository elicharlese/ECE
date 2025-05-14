"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "./use-toast"

type AutosaveStatus = "idle" | "saving" | "saved" | "error"

interface UseAutosaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  debounceMs?: number
  saveOnUnmount?: boolean
  onError?: (error: any) => void
}

export function useAutosave<T>({
  data,
  onSave,
  debounceMs = 1000,
  saveOnUnmount = true,
  onError,
}: UseAutosaveOptions<T>) {
  const [status, setStatus] = useState<AutosaveStatus>("idle")
  const [lastSavedData, setLastSavedData] = useState<T>(data)
  const { toast } = useToast()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMounted = useRef(true)

  // Track if the form is dirty (has unsaved changes)
  const isDirty = JSON.stringify(data) !== JSON.stringify(lastSavedData)

  // Function to save data
  const saveData = async () => {
    if (!isDirty) return

    try {
      setStatus("saving")
      await onSave(data)

      if (isMounted.current) {
        setStatus("saved")
        setLastSavedData(data)

        // Reset to idle after 2 seconds
        setTimeout(() => {
          if (isMounted.current) {
            setStatus("idle")
          }
        }, 2000)
      }
    } catch (error) {
      console.error("Autosave error:", error)

      if (isMounted.current) {
        setStatus("error")

        if (onError) {
          onError(error)
        } else {
          toast({
            title: "Failed to save changes",
            description: "Your changes couldn't be saved automatically. Please try again.",
            variant: "destructive",
          })
        }
      }
    }
  }

  // Debounced save effect
  useEffect(() => {
    if (isDirty) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        saveData()
      }, debounceMs)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, isDirty, debounceMs])

  // Save on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      isMounted.current = false

      if (saveOnUnmount && isDirty && timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        saveData()
      }
    }
  }, [saveOnUnmount, isDirty])

  // Force an immediate save
  const forceSave = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    await saveData()
  }

  return {
    status,
    isDirty,
    forceSave,
    lastSavedData,
  }
}
