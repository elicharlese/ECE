"use client"

import { useState, useCallback } from "react"

interface UseLazyDataOptions<T> {
  initialData?: T
  delay?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useLazyData<T>(fetchFn: () => Promise<T>, options: UseLazyDataOptions<T> = {}) {
  const { initialData, delay = 0, onSuccess, onError } = options
  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Add artificial delay if specified
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      const result = await fetchFn()
      setData(result)

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)

      if (onError) {
        onError(error)
      }
    } finally {
      setLoading(false)
    }
  }, [fetchFn, delay, onSuccess, onError])

  return {
    data,
    loading,
    error,
    fetchData,
    setData,
  }
}
