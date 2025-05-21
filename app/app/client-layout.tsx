"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BottomNav } from "@/components/layout/bottom-nav"
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Calendar, Code, Rocket, Users, ShoppingBag, TrendingUp } from "lucide-react"
import { addDays } from "date-fns"

// Define mock data directly in the file to avoid import issues
const mockApps = [
  {
    id: "app1",
    name: "DeFi Protocol",
    description: "Decentralized finance protocol with lending and borrowing capabilities",
    type: "web",
    status: "running",
  },
  {
    id: "app2",
    name: "NFT Marketplace",
    description: "Platform for trading digital collectibles and artwork",
    type: "web",
    status: "deploying",
  },
  {
    id: "app3",
    name: "Blockchain Bridge",
    description: "Cross-chain asset transfer solution",
    type: "api",
    status: "stopped",
  },
]

// Mock team members data
const teamMembers = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Lead Developer",
    avatar: "/diverse-user-avatars.png",
    status: "online",
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Samantha Lee",
    role: "UX Designer",
    avatar: "/diverse-user-avatars.png",
    status: "online",
    lastActive: "5m ago",
  },
  {
    id: "3",
    name: "Marcus Chen",
    role: "Backend Developer",
    avatar: "/diverse-user-avatars.png",
    status: "away",
    lastActive: "30m ago",
  },
  {
    id: "4",
    name: "Priya Patel",
    role: "Project Manager",
    avatar: "/diverse-user-avatars.png",
    status: "offline",
    lastActive: "2h ago",
  },
]

// Mock upcoming meetings
const upcomingMeetings = [
  {
    id: "m1",
    title: "Sprint Planning",
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    attendees: ["1", "2", "4"],
    location: "Main Conference Room",
  },
  {
    id: "m2",
    title: "Design Review",
    date: addDays(new Date(), 1),
    startTime: "14:00",
    endTime: "15:00",
    attendees: ["2", "4"],
    location: "Virtual Meeting",
  },
  {
    id: "m3",
    title: "Client Demo",
    date: addDays(new Date(), 2),
    startTime: "11:00",
    endTime: "12:00",
    attendees: ["1", "3", "4"],
    location: "Demo Room",
  },
]

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
                                                    <main className="flex-1">
                                                      <LoadingControl>
                                                        {pathname === "/app" ? (
                                                          <div className="container mx-auto px-4 py-6">
                                                            <div className="grid gap-6">
                                                              {/* Welcome Section */}
                                                              <div className="flex items-center justify-between">
                                                                <div>
                                                                  <h1 className="text-3xl font-bold tracking-tight">
                                                                    Dashboard
                                                                  </h1>
                                                                  <p className="text-muted-foreground">
                                                                    Welcome back to your ECE dashboard
                                                                  </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                  <Button variant="outline" size="sm">
                                                                    <Calendar className="mr-2 h-4 w-4" />
                                                                    View Calendar
                                                                  </Button>
                                                                  <Button size="sm">
                                                                    <Rocket className="mr-2 h-4 w-4" />
                                                                    New Project
                                                                  </Button>
                                                                </div>
                                                              </div>

                                                              {/* Stats Row */}
                                                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                                                <Card>
                                                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                                    <CardTitle className="text-sm font-medium">
                                                                      Total Balance
                                                                    </CardTitle>
                                                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                                                  </CardHeader>
                                                                  <CardContent>
                                                                    <div className="text-2xl font-bold">2,450 ECE</div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                      +20.1% from last month
                                                                    </p>
                                                                  </CardContent>
                                                                </Card>
                                                                <Card>
                                                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                                    <CardTitle className="text-sm font-medium">
                                                                      Active Projects
                                                                    </CardTitle>
                                                                    <Code className="h-4 w-4 text-muted-foreground" />
                                                                  </CardHeader>
                                                                  <CardContent>
                                                                    <div className="text-2xl font-bold">6</div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                      2 pending approval
                                                                    </p>
                                                                  </CardContent>
                                                                </Card>
                                                                <Card>
                                                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                                    <CardTitle className="text-sm font-medium">
                                                                      Marketplace Items
                                                                    </CardTitle>
                                                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                                                  </CardHeader>
                                                                  <CardContent>
                                                                    <div className="text-2xl font-bold">24</div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                      3 in your cart
                                                                    </p>
                                                                  </CardContent>
                                                                </Card>
                                                                <Card>
                                                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                                    <CardTitle className="text-sm font-medium">
                                                                      Team Members
                                                                    </CardTitle>
                                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                                  </CardHeader>
                                                                  <CardContent>
                                                                    <div className="text-2xl font-bold">12</div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                      4 online now
                                                                    </p>
                                                                  </CardContent>
                                                                </Card>
                                                              </div>

                                                              {/* Main Content */}
                                                              <div className="grid gap-6 md:grid-cols-6">
                                                                {/* Recent Activity */}
                                                                <Card className="md:col-span-4">
                                                                  <CardHeader className="flex flex-row items-center">
                                                                    <div className="flex-1">
                                                                      <CardTitle>Recent Activity</CardTitle>
                                                                      <CardDescription>
                                                                        Your latest transactions and updates
                                                                      </CardDescription>
                                                                    </div>
                                                                    <Button variant="outline" size="sm">
                                                                      View All
                                                                    </Button>
                                                                  </CardHeader>
                                                                  <CardContent>
                                                                    <div className="space-y-4">
                                                                      <div className="flex items-center gap-4">
                                                                        <div className="bg-primary/10 p-2 rounded-full">
                                                                          <ShoppingBag className="h-4 w-4 text-primary" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                          <p className="font-medium">
                                                                            Purchased DeFi Protocol
                                                                          </p>
                                                                          <p className="text-sm text-muted-foreground">
                                                                            2 days ago
                                                                          </p>
                                                                        </div>
                                                                        <div className="font-medium">-250 ECE</div>
                                                                      </div>
                                                                      <div className="flex items-center gap-4">
                                                                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                                                                          <Rocket className="h-4 w-4 text-green-500 dark:text-green-300" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                          <p className="font-medium">
                                                                            Project Milestone Completed
                                                                          </p>
                                                                          <p className="text-sm text-muted-foreground">
                                                                            5 days ago
                                                                          </p>
                                                                        </div>
                                                                        <div className="font-medium text-green-600">
                                                                          +175 ECE
                                                                        </div>
                                                                      </div>
                                                                      <div className="flex items-center gap-4">
                                                                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                                                                          <TrendingUp className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                          <p className="font-medium">Monthly Deposit</p>
                                                                          <p className="text-sm text-muted-foreground">
                                                                            1 week ago
                                                                          </p>
                                                                        </div>
                                                                        <div className="font-medium text-green-600">
                                                                          +500 ECE
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </CardContent>
                                                                </Card>

                                                                {/* Quick Actions */}
                                                                <Card className="md:col-span-2">
                                                                  <CardHeader>
                                                                    <CardTitle>Quick Actions</CardTitle>
                                                                  </CardHeader>
                                                                  <CardContent className="space-y-2">
                                                                    <Button
                                                                      className="w-full justify-start"
                                                                      variant="outline"
                                                                      asChild
                                                                    >
                                                                      <Link href="/app/marketplace">
                                                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                                                        Browse Marketplace
                                                                      </Link>
                                                                    </Button>
                                                                    <Button
                                                                      className="w-full justify-start"
                                                                      variant="outline"
                                                                      asChild
                                                                    >
                                                                      <Link href="/app/crowdfunding">
                                                                        <Users className="mr-2 h-4 w-4" />
                                                                        Explore Crowdfunding
                                                                      </Link>
                                                                    </Button>
                                                                    <Button
                                                                      className="w-full justify-start"
                                                                      variant="outline"
                                                                      asChild
                                                                    >
                                                                      <Link href="/app/deployments">
                                                                        <Rocket className="mr-2 h-4 w-4" />
                                                                        Manage Deployments
                                                                      </Link>
                                                                    </Button>
                                                                    <Button
                                                                      className="w-full justify-start"
                                                                      variant="outline"
                                                                      asChild
                                                                    >
                                                                      <Link href="/app/wallet-management">
                                                                        <BarChart3 className="mr-2 h-4 w-4" />
                                                                        Wallet Management
                                                                      </Link>
                                                                    </Button>
                                                                  </CardContent>
                                                                </Card>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          children
                                                        )}
                                                      </LoadingControl>
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
