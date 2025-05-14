"use client"

import { useEffect } from "react"

/**
 * This component helps reduce Cumulative Layout Shift (CLS) by applying
 * size-adjust and other properties to fallback fonts to match the metrics
 * of the web fonts. This reduces layout shift when fonts load.
 */
export function FontStyleMatcher() {
  useEffect(() => {
    // Add font style matcher CSS
    const style = document.createElement("style")
    style.textContent = `
      /* Font fallback optimization to reduce CLS */
      @font-face {
        font-family: 'Inter Fallback';
        src: local('Arial');
        size-adjust: 107%;
        ascent-override: 90%;
        descent-override: 23%;
        line-gap-override: 0%;
      }
      
      @font-face {
        font-family: 'Raleway Fallback';
        src: local('Helvetica');
        size-adjust: 104%;
        ascent-override: 92%;
        descent-override: 22%;
        line-gap-override: 0%;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
