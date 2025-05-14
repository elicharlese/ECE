/**
 * Font loading optimization utilities
 */

// Check if a font has loaded
export function checkFontLoaded(fontFamily: string): Promise<boolean> {
  return document.fonts.ready.then(() => {
    return document.fonts.check(`1em "${fontFamily}"`)
  })
}

// Prioritize loading critical fonts
export function prioritizeCriticalFonts() {
  if (typeof document !== "undefined") {
    // Find all font resources
    const fontResources = Array.from(document.querySelectorAll('link[rel="preload"][as="font"]'))

    // Set high priority for UI fonts
    fontResources.forEach((link) => {
      const href = (link as HTMLLinkElement).href
      if (href.includes("inter")) {
        // Set high priority for primary UI font
        ;(link as HTMLLinkElement).setAttribute("fetchpriority", "high")
      } else {
        // Set low priority for decorative fonts
        ;(link as HTMLLinkElement).setAttribute("fetchpriority", "low")
      }
    })
  }
}

// Detect slow connections and adjust font loading strategy
export function adjustFontLoadingForConnection() {
  if (typeof navigator !== "undefined" && "connection" in navigator) {
    const connection = (navigator as any).connection

    if (
      connection &&
      (connection.saveData || connection.effectiveType === "2g" || connection.effectiveType === "slow-2g")
    ) {
      // On slow connections, disable non-critical font loading
      const style = document.createElement("style")
      style.textContent = `
        .font-cursive {
          font-family: system-ui, sans-serif !important;
        }
      `
      document.head.appendChild(style)
    }
  }
}
