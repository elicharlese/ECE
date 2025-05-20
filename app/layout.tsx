import type React from "react"
import "./globals.css"
import "./primary-color.css"
import "./button-cursor.css"
import "./hide-scrollbar.css"
import "./micro-interactions.css"
import "./grid-pattern.css"
import "./skeleton-animations.css"
import "./button-styles.css"
import "./slate-theme.css"
import "./transition-effects.css"
import "./cart-animations.css"
import "./quick-add-buttons.css"
import "./wishlist-animations.css"
import "./recently-viewed-animations.css"
import "./mobile-menu.css"
import "./nav-animations.css"
import "./theme-transitions.css"
import "./theme-test.css"
import "./theme-persistence.css"
import "./dark-mode-enhancements.css"
import "./deployment-animations.css"
import "./deployment-comparison.css"
import "./auto-rollback.css"
import "./repository-comparison.css"
import "./branch-comparison.css"
import "./notification-animations.css"
import "./ticker-animations.css"
import "./marketplace-product-feed.css"
import "./vertical-card-stack.css"
import "./font-animations.css"
import "./font-loading-optimizations.css"
import "./cursive-font.css"
import "./null-state-animations.css"
import "./project-dashboard-animations.css"
import "./responsive-cards.css"
import "./wallet-auth.css"
import "./font-debug.css"
import "./betting-dark-theme.css"
import "./mobile-media-queries.css"
import "./mobile-optimizations.css"
import "./lazy-loading.css"
import "./betting-style.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { fonts } from "./fonts"
import { FontStyleMatcher } from "@/components/ui/font-style-matcher"

export const metadata = {
  title: "ECE - Blockchain Development Platform",
  description: "A platform for blockchain development, marketplace, and crowdfunding",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fonts.sans.variable} ${fonts.heading.variable} ${fonts.marker.variable} ${fonts.script.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FontStyleMatcher />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
