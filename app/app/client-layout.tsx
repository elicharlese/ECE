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

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BarChart3, Calendar, Code, Rocket, Users, ShoppingBag, Activity, TrendingUp, Zap } from "lucide-react"
import { TransactionTrendsChart } from "@/components/analytics/transaction-trends-chart"
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
                                                          <div className="container mx-auto px-4 py-6 space-y-8">
                                                            <DemoModeDetector />

                                                            <div className="flex flex-col space-y-4">
                                                              <h1 className="text-3xl font-bold">Dashboard</h1>
                                                              <p className="text-muted-foreground">
                                                                Welcome to your dashboard. Here you can manage your
                                                                projects, view your portfolio, and more.
                                                              </p>
                                                            </div>

                                                            {/* Stats Cards */}
                                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                                              <Card className="bg-card rounded-lg border shadow-sm">
                                                                <CardContent className="p-6">
                                                                  <div className="flex justify-between items-start">
                                                                    <div>
                                                                      <p className="text-sm font-medium text-muted-foreground">
                                                                        Your Portfolio
                                                                      </p>
                                                                      <h3 className="text-2xl font-bold mt-1">
                                                                        2,450 ECE
                                                                      </h3>
                                                                    </div>
                                                                    <div className="bg-primary/10 p-2 rounded-full">
                                                                      <BarChart3 className="h-5 w-5 text-primary" />
                                                                    </div>
                                                                  </div>
                                                                  <p className="text-sm text-green-500 mt-1">
                                                                    +125 ECE (5.4%) this week
                                                                  </p>
                                                                </CardContent>
                                                              </Card>

                                                              <Card className="bg-card rounded-lg border shadow-sm">
                                                                <CardContent className="p-6">
                                                                  <div className="flex justify-between items-start">
                                                                    <div>
                                                                      <p className="text-sm font-medium text-muted-foreground">
                                                                        Team Members
                                                                      </p>
                                                                      <h3 className="text-2xl font-bold mt-1">
                                                                        {teamMembers.length}
                                                                      </h3>
                                                                    </div>
                                                                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                                                                      <Users className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                                                                    </div>
                                                                  </div>
                                                                  <p className="text-sm text-muted-foreground mt-1">
                                                                    {
                                                                      teamMembers.filter((m) => m.status === "online")
                                                                        .length
                                                                    }
                                                                    currently online
                                                                  </p>
                                                                </CardContent>
                                                              </Card>

                                                              <Card className="bg-card rounded-lg border shadow-sm">
                                                                <CardContent className="p-6">
                                                                  <div className="flex justify-between items-start">
                                                                    <div>
                                                                      <p className="text-sm font-medium text-muted-foreground">
                                                                        Upcoming Meetings
                                                                      </p>
                                                                      <h3 className="text-2xl font-bold mt-1">
                                                                        {upcomingMeetings.length}
                                                                      </h3>
                                                                    </div>
                                                                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                                                                      <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                                                                    </div>
                                                                  </div>
                                                                  <p className="text-sm text-muted-foreground mt-1">
                                                                    Next: {upcomingMeetings[0].title} at{" "}
                                                                    {upcomingMeetings[0].startTime}
                                                                  </p>
                                                                </CardContent>
                                                              </Card>

                                                              <Card className="bg-card rounded-lg border shadow-sm">
                                                                <CardContent className="p-6">
                                                                  <div className="flex justify-between items-start">
                                                                    <div>
                                                                      <p className="text-sm font-medium text-muted-foreground">
                                                                        Applications
                                                                      </p>
                                                                      <h3 className="text-2xl font-bold mt-1">
                                                                        {mockApps.length}
                                                                      </h3>
                                                                    </div>
                                                                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                                                                      <Code className="h-5 w-5 text-green-500 dark:text-green-300" />
                                                                    </div>
                                                                  </div>
                                                                  <p className="text-sm text-muted-foreground mt-1">
                                                                    3 active deployments
                                                                  </p>
                                                                </CardContent>
                                                              </Card>
                                                            </div>

                                                            {/* Main Dashboard Tabs */}
                                                            <Tabs defaultValue="overview" className="space-y-6">
                                                              <TabsList className="bg-muted/60 p-1">
                                                                <TabsTrigger value="overview" className="rounded-md">
                                                                  Overview
                                                                </TabsTrigger>
                                                                <TabsTrigger value="activity" className="rounded-md">
                                                                  Activity
                                                                </TabsTrigger>
                                                                <TabsTrigger value="projects" className="rounded-md">
                                                                  Projects
                                                                </TabsTrigger>
                                                              </TabsList>

                                                              {/* Overview Tab */}
                                                              <TabsContent value="overview" className="space-y-6">
                                                                {/* Featured Cards */}
                                                                <div className="grid gap-6 md:grid-cols-3">
                                                                  <Card className="col-span-3 md:col-span-1 bg-gradient-to-br from-primary/10 to-primary/5 border">
                                                                    <CardHeader>
                                                                      <CardTitle className="flex items-center gap-2">
                                                                        <Zap className="h-5 w-5 text-primary" />
                                                                        Quick Actions
                                                                      </CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="space-y-3">
                                                                      <Button
                                                                        variant="outline"
                                                                        className="w-full justify-start h-10 bg-background/80"
                                                                        asChild
                                                                      >
                                                                        <Link href="/app/order">
                                                                          <Rocket className="mr-2 h-4 w-4 text-orange-500" />
                                                                          Deploy New App
                                                                        </Link>
                                                                      </Button>
                                                                      <Button
                                                                        variant="outline"
                                                                        className="w-full justify-start h-10 bg-background/80"
                                                                        asChild
                                                                      >
                                                                        <Link href="/app/marketplace">
                                                                          <ShoppingBag className="mr-2 h-4 w-4 text-green-500" />
                                                                          Browse Marketplace
                                                                        </Link>
                                                                      </Button>
                                                                      <Button
                                                                        variant="outline"
                                                                        className="w-full justify-start h-10 bg-background/80"
                                                                        asChild
                                                                      >
                                                                        <Link href="/app/crowdfunding">
                                                                          <Users className="mr-2 h-4 w-4 text-purple-500" />
                                                                          Explore Crowdfunding
                                                                        </Link>
                                                                      </Button>
                                                                    </CardContent>
                                                                  </Card>

                                                                  <Card className="col-span-3 md:col-span-2">
                                                                    <CardHeader className="pb-2">
                                                                      <CardTitle className="flex items-center gap-2">
                                                                        <Activity className="h-5 w-5 text-primary" />
                                                                        Recent Activity
                                                                      </CardTitle>
                                                                      <CardDescription>
                                                                        Your latest transactions and updates
                                                                      </CardDescription>
                                                                    </CardHeader>
                                                                    <CardContent>
                                                                      <div className="space-y-4">
                                                                        <div className="flex items-center justify-between pb-4 border-b">
                                                                          <div>
                                                                            <p className="font-medium">
                                                                              DeFi Protocol Purchase
                                                                            </p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                              You purchased a new DeFi protocol license
                                                                            </p>
                                                                          </div>
                                                                          <div className="text-right">
                                                                            <p className="font-medium">-250 ECE</p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                              2 days ago
                                                                            </p>
                                                                          </div>
                                                                        </div>

                                                                        <div className="flex items-center justify-between pb-4 border-b">
                                                                          <div>
                                                                            <p className="font-medium">
                                                                              Project Milestone Completed
                                                                            </p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                              NFT Gaming project reached milestone 2
                                                                            </p>
                                                                          </div>
                                                                          <div className="text-right">
                                                                            <p className="font-medium">+175 ECE</p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                              5 days ago
                                                                            </p>
                                                                          </div>
                                                                        </div>

                                                                        <div className="flex items-center justify-between">
                                                                          <div>
                                                                            <p className="font-medium">
                                                                              Deposit Received
                                                                            </p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                              Monthly deposit to your wallet
                                                                            </p>
                                                                          </div>
                                                                          <div className="text-right">
                                                                            <p className="font-medium">+500 ECE</p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                              1 week ago
                                                                            </p>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    </CardContent>
                                                                    <CardFooter>
                                                                      <Button variant="outline" className="w-full">
                                                                        View All Activity
                                                                      </Button>
                                                                    </CardFooter>
                                                                  </Card>
                                                                </div>

                                                                {/* Transaction Trends Chart */}
                                                                <Card>
                                                                  <CardHeader>
                                                                    <CardTitle className="flex items-center gap-2">
                                                                      <TrendingUp className="h-5 w-5 text-primary" />
                                                                      Transaction Trends
                                                                    </CardTitle>
                                                                    <CardDescription>
                                                                      Your financial activity over the past 30 days
                                                                    </CardDescription>
                                                                  </CardHeader>
                                                                  <CardContent>
                                                                    <TransactionTrendsChart />
                                                                  </CardContent>
                                                                </Card>
                                                              </TabsContent>

                                                              {/* Activity Tab */}
                                                              <TabsContent value="activity">
                                                                <Card>
                                                                  <CardHeader>
                                                                    <CardTitle>Recent Activity</CardTitle>
                                                                    <CardDescription>
                                                                      Your latest transactions and updates
                                                                    </CardDescription>
                                                                  </CardHeader>
                                                                  <CardContent>
                                                                    <p>Activity content here...</p>
                                                                  </CardContent>
                                                                </Card>
                                                              </TabsContent>

                                                              {/* Projects Tab */}
                                                              <TabsContent value="projects">
                                                                <Card>
                                                                  <CardHeader>
                                                                    <CardTitle>Your Projects</CardTitle>
                                                                    <CardDescription>
                                                                      Manage your active and upcoming projects
                                                                    </CardDescription>
                                                                  </CardHeader>
                                                                  <CardContent>
                                                                    <p>Projects content here...</p>
                                                                  </CardContent>
                                                                </Card>
                                                              </TabsContent>
                                                            </Tabs>
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
