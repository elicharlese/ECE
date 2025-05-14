"use client"

import { useState, useEffect } from "react"
import { useLoading } from "@/lib/loading-context"

export function useLoadingState(initialState = true, customDuration?: number) {
  const [isLoading, setIsLoading] = useState(initialState)
  const { loadingDuration } = useLoading()

  useEffect(() => {
    if (initialState) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, customDuration || loadingDuration)

      return () => clearTimeout(timer)
    }
  }, [initialState, customDuration, loadingDuration])

  return [isLoading, setIsLoading] as const
}
