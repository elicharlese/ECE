"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BottomNav } from "@/components/layout/bottom-nav"
import { AppNav } from "@/components/app-nav"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"
import { useDemo } from "@/lib/demo-context"
import { DemoModeIndicator } from "@/components/demo-mode-indicator"
import { DemoModeInitializer } from "@/components/demo-mode-initializer"
import { DemoModeDetector } from "@/components/demo-mode-detector"
import { WalletProvider } from "@/lib/wallet-context"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { RecentlyViewedProvider } from "@/lib/recently-viewed-context"
import { LoadingProvider } from "@/lib/loading-context"
import { LoadingControl } from "@/components/loading-control"
import { ThemeProvider } from "@/components/theme-provider"
import { AutoThemeProvider } from "@/lib/auto-theme-context"
import { ChatProvider } from "@/lib/chat-context"
import { ChatNotificationProvider } from "@/lib/chat-notification-context"
import { MeetingNotificationProvider } from "@/lib/meeting-notification-context"
import { DeploymentNotificationProvider } from "@/context/deployment-notification-context"
import { ProjectProvider } from "@/context/project-context"
import { DeploymentProvider } from "@/context/deployment-context"
import { RepositoryProvider } from "@/context/repository-context"
import { BranchProvider } from "@/context/branch-context"
import { GamificationProvider } from "@/context/gamification-context"
import { CrowdfundingGamificationProvider } from "@/context/crowdfunding-gamification-context"
import { MediaProvider } from "@/context/media-context"
import { TimezoneProvider } from "@/lib/timezone-context"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"
import { OfflineNotification } from "@/components/offline-notification"
import { ErrorBoundary } from "@/components/error-boundary"
import { FontOptimizationProvider } from "@/components/font-optimization-provider"
import { WalletAuthProvider } from "@/components/auth/wallet-auth-provider"
import { AuthProvider } from "@/lib/auth-context"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isDemoMode } = useDemo()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isAppPage = pathname?.startsWith("/app")
  const showFooter = !isAppPage

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <FontOptimizationProvider>
          <AuthProvider>
            <WalletAuthProvider>
              <DemoModeDetector />
              <DemoModeInitializer />
              <AutoThemeProvider>
                <TimezoneProvider>
                  <WalletProvider>
                    <CartProvider>
                      <WishlistProvider>
                        <RecentlyViewedProvider>
                          <LoadingProvider>
                            <ChatProvider>
                              <ChatNotificationProvider>
                                <MeetingNotificationProvider>
                                  <DeploymentNotificationProvider>
                                    <ProjectProvider>
                                      <DeploymentProvider>
                                        <RepositoryProvider>
                                          <BranchProvider>
                                            <GamificationProvider>
                                              <CrowdfundingGamificationProvider>
                                                <MediaProvider>
                                                  <div className="flex min-h-screen flex-col">
                                                    <Header />
                                                    {isAppPage && <AppNav />}
                                                    <main className="flex-1">
                                                      <LoadingControl>{children}</LoadingControl>
                                                    </main>
                                                    {showFooter && <Footer />}
                                                    <BottomNav />
                                                    {isDemoMode && <DemoModeIndicator />}
                                                    <Toaster />
                                                    <OfflineNotification />
                                                    <ServiceWorkerRegistration />
                                                  </div>
                                                </MediaProvider>
                                              </CrowdfundingGamificationProvider>
                                            </GamificationProvider>
                                          </BranchProvider>
                                        </RepositoryProvider>
                                      </DeploymentProvider>
                                    </ProjectProvider>
                                  </DeploymentNotificationProvider>
                                </MeetingNotificationProvider>
                              </ChatNotificationProvider>
                            </ChatProvider>
                          </LoadingProvider>
                        </RecentlyViewedProvider>
                      </WishlistProvider>
                    </CartProvider>
                  </WalletProvider>
                </TimezoneProvider>
              </AutoThemeProvider>
            </WalletAuthProvider>
          </AuthProvider>
        </FontOptimizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
