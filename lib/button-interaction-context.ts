"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type ButtonInteractionContextType = {
  isInteracting: boolean
  setIsInteracting: (isInteracting: boolean) => void
}

const ButtonInteractionContext = createContext<ButtonInteractionContextType>({
  isInteracting: false,
  setIsInteracting: () => {},
})

export function ButtonInteractionProvider({ children }: { children: React.ReactNode }) {
  const [isInteracting, setIsInteracting] = useState(false)

  return (
    <ButtonInteractionContext.Provider value={{ isInteracting, setIsInteracting }}>
      {children}
    </ButtonInteractionContext.Provider>
  )
}

export const useButtonInteraction = () => useContext(ButtonInteractionContext)
