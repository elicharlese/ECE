"use client"

import { useEffect } from "react"

export function ButtonInteractionTracker() {
  useEffect(() => {
    const trackButtonInteraction = (event: MouseEvent | KeyboardEvent) => {
      const target = event.target as HTMLElement
      const button = target.closest('button, a, [role="button"], .card[tabindex="0"]')

      if (!button) return

      // Get button metadata
      const buttonText = button.textContent?.trim() || "Unknown"
      const buttonType = button.tagName.toLowerCase()
      const buttonVariant = button.getAttribute("data-button-variant") || "unknown"
      const buttonHref = button.getAttribute("href") || ""
      const buttonId = button.id || ""
      const buttonClass = button.className || ""
      const buttonAriaLabel = button.getAttribute("aria-label") || ""
      const buttonName = buttonAriaLabel || buttonText

      // Determine interaction type
      const interactionType = event.type

      // Get page information
      const pagePath = window.location.pathname
      const pageTitle = document.title

      // Create analytics data
      const analyticsData = {
        buttonName,
        buttonText,
        buttonType,
        buttonVariant,
        buttonHref,
        buttonId,
        buttonClass,
        interactionType,
        pagePath,
        pageTitle,
        timestamp: new Date().toISOString(),
      }

      // In a real app, you would send this data to your analytics service
      console.log("Button interaction:", analyticsData)
    }

    // Track mouse clicks
    document.addEventListener("click", trackButtonInteraction)

    // Track keyboard interactions (Enter and Space)
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        trackButtonInteraction(event)
      }
    })

    return () => {
      document.removeEventListener("click", trackButtonInteraction)
      document.removeEventListener("keydown", trackButtonInteraction)
    }
  }, [])

  return null
}
