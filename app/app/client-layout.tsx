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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AutoThemeProvider>
        <LoadingProvider>
          <ChatProvider>
            <ChatNotificationProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="container flex-1 px-4 py-6 sm:px-6 md:py-8 lg:px-8">{children}</main>
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
