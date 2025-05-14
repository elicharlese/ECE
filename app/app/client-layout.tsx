"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { GitHubWebhookProvider } from "@/lib/github-webhook-context"
import { VercelWebhookProvider } from "@/lib/vercel-webhook-context"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AutoThemeProvider } from "@/lib/auto-theme-context"
import { AuthProvider } from "@/lib/auth-context"
import { WalletProvider } from "@/lib/wallet-context"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { RecentlyViewedProvider } from "@/lib/recently-viewed-context"
import { LoadingProvider } from "@/lib/loading-context"
import { DeploymentNotificationProvider } from "@/context/deployment-notification-context"
import { DeploymentNotificationToast } from "@/components/deployments/notification-toast"
import { Header } from "@/components/layout/header"
import { MeetingNotificationProvider } from "@/lib/meeting-notification-context"
import { AppTabsNav } from "./components/app-tabs-nav"
import { DemoProvider } from "@/lib/demo-context"
import { DemoModeInitializer } from "@/components/demo-mode-initializer"
import { FontOptimizationProvider } from "@/components/font-optimization-provider"
import { MediaProvider } from "@/context/media-context"
import { BottomNav } from "@/components/layout/bottom-nav"
import { ErrorBoundary } from "@/components/error-boundary"
import { LiveUpdatesTicker } from "@/components/crowdfunding/live-updates-ticker"
import "@/app/betting-dark-theme.css"
import "@/app/ticker-animations.css"
import { BettingThemeToggle } from "@/components/theme/betting-theme-toggle"
import { OfflineNotification } from "@/components/offline-notification"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const isMarketplacePage = pathname === "/app/marketplace"
  const isProductDetailsPage = pathname.startsWith("/app/marketplace/") && pathname !== "/app/marketplace"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ErrorBoundary fallback={<div className="p-4">Something went wrong. Please try refreshing the page.</div>}>
      <MediaProvider>
        <FontOptimizationProvider>
          <MeetingNotificationProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <AutoThemeProvider>
                <DemoProvider>
                  <DemoModeInitializer />
                  <AuthProvider>
                    <WalletProvider>
                      <CartProvider>
                        <WishlistProvider>
                          <RecentlyViewedProvider>
                            <LoadingProvider>
                              <GitHubWebhookProvider>
                                <VercelWebhookProvider>
                                  <DeploymentNotificationProvider>
                                    <div className="min-h-screen bg-background">
                                      <Header>
                                        <div className="ml-2">
                                          <BettingThemeToggle />
                                        </div>
                                      </Header>
                                      <div className="md:hidden">
                                        <AppTabsNav />
                                      </div>

                                      {/* Live Updates Ticker */}
                                      <LiveUpdatesTicker />

                                      <main className="bg-gradient-to-b from-background to-muted/30 min-h-[calc(100vh-4rem)]">
                                        <div className="container py-6 betting-container">
                                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                            {/* Sidebar for featured projects, stats, and quick actions */}
                                            {!isMarketplacePage && !isProductDetailsPage && (
                                              <div className="hidden lg:block lg:col-span-1 space-y-4">
                                                <div className="bg-card rounded-lg border border-border/40 p-4 shadow-sm">
                                                  <h3 className="font-medium text-sm mb-3">Featured Opportunities</h3>
                                                  <div className="space-y-2">
                                                    {/* This would be populated dynamically */}
                                                    <div className="bg-muted/50 p-3 rounded-md hover:bg-muted/80 cursor-pointer transition-colors">
                                                      <div className="flex justify-between items-center">
                                                        <span className="text-xs font-medium">DeFi Protocol</span>
                                                        <span className="text-xs text-primary">+18%</span>
                                                      </div>
                                                      <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                          className="bg-primary h-full rounded-full"
                                                          style={{ width: "68%" }}
                                                        ></div>
                                                      </div>
                                                    </div>
                                                    <div className="bg-muted/50 p-3 rounded-md hover:bg-muted/80 cursor-pointer transition-colors">
                                                      <div className="flex justify-between items-center">
                                                        <span className="text-xs font-medium">NFT Gaming</span>
                                                        <span className="text-xs text-primary">+24%</span>
                                                      </div>
                                                      <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                          className="bg-primary h-full rounded-full"
                                                          style={{ width: "42%" }}
                                                        ></div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="bg-card rounded-lg border border-border/40 p-4 shadow-sm">
                                                  <h3 className="font-medium text-sm mb-3">Your Portfolio</h3>
                                                  <div className="text-2xl font-bold">
                                                    2,450{" "}
                                                    <span className="text-sm font-normal text-muted-foreground">
                                                      ECE
                                                    </span>
                                                  </div>
                                                  <div className="text-xs text-green-500 mt-1">
                                                    +125 ECE (5.4%) this week
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {/* Main content area */}
                                            <div
                                              className={`col-span-1 ${!isMarketplacePage && !isProductDetailsPage ? "lg:col-span-3" : "lg:col-span-4"}`}
                                            >
                                              <ErrorBoundary>{children}</ErrorBoundary>
                                              <OfflineNotification />
                                            </div>
                                          </div>
                                        </div>
                                      </main>
                                      <BottomNav />
                                      <div className="h-16 md:h-0"></div>
                                      <DeploymentNotificationToast />
                                      <Toaster />
                                    </div>
                                  </DeploymentNotificationProvider>
                                </VercelWebhookProvider>
                              </GitHubWebhookProvider>
                            </LoadingProvider>
                          </RecentlyViewedProvider>
                        </WishlistProvider>
                      </CartProvider>
                    </WalletProvider>
                  </AuthProvider>
                </DemoProvider>
              </AutoThemeProvider>
            </ThemeProvider>
          </MeetingNotificationProvider>
        </FontOptimizationProvider>
      </MediaProvider>
    </ErrorBoundary>
  )
}
