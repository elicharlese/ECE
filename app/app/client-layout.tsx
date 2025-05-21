"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { AutoThemeProvider } from "@/lib/auto-theme-context"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { LoadingProvider } from "@/lib/loading-context"
import { ChatProvider } from "@/lib/chat-context"
import { ChatNotificationProvider } from "@/lib/chat-notification-context"
import { Toaster } from "@/components/ui/toaster"
import { NotificationManager } from "@/components/chat/notification-manager"
import { Footer } from "@/components/layout/footer"
import { usePathname } from "next/navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAppPage = pathname?.startsWith("/app")
  const showFooter = !isAppPage

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AutoThemeProvider>
        <LoadingProvider>
          <ChatProvider>
            <ChatNotificationProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                {showFooter && <Footer />}
                <BottomNav />
              </div>
              <Toaster />
              <NotificationManager />
            </ChatNotificationProvider>
          </ChatProvider>
        </LoadingProvider>
      </AutoThemeProvider>
    </ThemeProvider>
  )
}
