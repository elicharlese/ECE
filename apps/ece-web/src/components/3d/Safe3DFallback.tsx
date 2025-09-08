'use client'

import { ReactNode } from 'react'

interface Safe3DFallbackProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function Safe3DFallback({ children, fallback }: Safe3DFallbackProps) {
  // Simple fallback that doesn't use complex 3D contexts
  if (typeof window === 'undefined') {
    return fallback || <div className="min-h-screen bg-gradient-to-br from-[#272822] to-[#1B1B1B]" />
  }

  try {
    return <>{children}</>
  } catch (error) {
    console.warn('3D rendering failed, using fallback:', error)
    return fallback || <div className="min-h-screen bg-gradient-to-br from-[#272822] to-[#1B1B1B]" />
  }
}
