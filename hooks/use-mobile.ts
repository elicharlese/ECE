"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Function to update all states
    const updateStates = () => {
      const width = window.innerWidth
      setScreenWidth(width)
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsLandscape(window.innerWidth > window.innerHeight)
    }

    // Initial update
    updateStates()

    // Add event listeners
    window.addEventListener("resize", updateStates)
    window.addEventListener("orientationchange", updateStates)

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateStates)
      window.removeEventListener("orientationchange", updateStates)
    }
  }, [])

  // Return default values for server-side rendering
  if (!isClient) {
    return {
      isMobile: false,
      isTablet: false,
      isLandscape: false,
      screenWidth: 1024, // Default to desktop
      isDesktop: true,
    }
  }

  return {
    isMobile,
    isTablet,
    isLandscape,
    screenWidth,
    isDesktop: !isMobile && !isTablet,
  }
}
