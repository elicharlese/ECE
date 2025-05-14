"use client"

import { useEffect } from "react"

export function ButtonTracker() {
  useEffect(() => {
    const trackButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest("button, a[role='button'], [data-button-variant]")

      if (button) {
        const buttonText = button.textContent?.trim() || "Unknown"
        const buttonVariant = button.getAttribute("data-button-variant") || "default"
        const buttonSize = button.getAttribute("data-button-size") || "default"
        const buttonHref = button instanceof HTMLAnchorElement ? button.href : undefined

        // In a real app, you would send this to your analytics service
        console.log("Button clicked:", {
          text: buttonText,
          variant: buttonVariant,
          size: buttonSize,
          href: buttonHref,
          path: window.location.pathname,
          timestamp: new Date().toISOString(),
        })
      }
    }

    document.addEventListener("click", trackButtonClick)

    return () => {
      document.removeEventListener("click", trackButtonClick)
    }
  }, [])

  return null
}
