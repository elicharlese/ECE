"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type LoadingContextType = {
  loadingDuration: number
  setLoadingDuration: (duration: number) => void
}

const LoadingContext = createContext<LoadingContextType>({
  loadingDuration: 3000, // Default to 3 seconds
  setLoadingDuration: () => {},
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingDuration, setLoadingDuration] = useState(3000)

  return <LoadingContext.Provider value={{ loadingDuration, setLoadingDuration }}>{children}</LoadingContext.Provider>
}

export const useLoading = () => useContext(LoadingContext)
