import type { Metadata } from "next"
import { DemoModeDetector } from "@/components/demo-mode-detector"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  BarChart3,
  Calendar,
  Code,
  Globe,
  Layers,
  Rocket,
  Server,
  Users,
  ShoppingBag,
  Activity,
  TrendingUp,
  Zap,
} from "lucide-react"
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

// Mock recent messages
const recentMessages = [
  {
    id: "msg1",
    sender: "1",
    content: "I've pushed the latest changes to the repository. Please review when you get a chance.",
    timestamp: "10:45 AM",
    channel: "Development",
  },
  {
    id: "msg2",
    sender: "2",
    content: "The new UI designs are ready for implementation. Let me know if you need any clarification.",
    timestamp: "Yesterday",
    channel: "Design",
  },
  {
    id: "msg3",
    sender: "4",
    content: "Team meeting scheduled for tomorrow at 10 AM. Please prepare your weekly updates.",
    timestamp: "Yesterday",
    channel: "General",
  },
]

// Mock integration events
const integrationEvents = [
  {
    id: "ie1",
    type: "github",
    event: "push",
    repo: "ece-app",
    user: "Alex Johnson",
    message: "Add wallet balance display",
    timestamp: "1h ago",
  },
  {
    id: "ie2",
    type: "vercel",
    event: "deployment",
    project: "ece-app",
    status: "completed",
    environment: "production",
    timestamp: "3h ago",
  },
  {
    id: "ie3",
    type: "github",
    event: "pull_request",
    repo: "ece-app",
    user: "Samantha Lee",
    message: "Update marketplace UI",
    timestamp: "Yesterday",
  },
]

export const metadata: Metadata = {
  title: "Dashboard | ECE Platform",
  description: "Your ECE dashboard",
}

export default function DashboardPage() {
  // Get the first 3 apps for the dashboard summary
  const recentApps = mockApps.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Demo mode detector - will show a notification if demo mode is active */}
      <DemoModeDetector />

      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here you can manage your projects, view your portfolio, and more.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card rounded-lg border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Portfolio</p>
                <h3 className="text-2xl font-bold mt-1">2,450 ECE</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-green-500 mt-1">+125 ECE (5.4%) this week</p>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-lg border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <h3 className="text-2xl font-bold mt-1">{teamMembers.length}</h3>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-500 dark:text-blue-300" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {teamMembers.filter((m) => m.status === "online").length} currently online
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-lg border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Meetings</p>
                <h3 className="text-2xl font-bold mt-1">{upcomingMeetings.length}</h3>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-300" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Next: {upcomingMeetings[0].title} at {upcomingMeetings[0].startTime}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-lg border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <h3 className="text-2xl font-bold mt-1">{mockApps.length}</h3>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <Code className="h-5 w-5 text-green-500 dark:text-green-300" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">3 active deployments</p>
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
                <Button variant="outline" className="w-full justify-start h-10 bg-background/80" asChild>
                  <Link href="/app/order">
                    <Rocket className="mr-2 h-4 w-4 text-orange-500" />
                    Deploy New App
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start h-10 bg-background/80" asChild>
                  <Link href="/app/marketplace">
                    <ShoppingBag className="mr-2 h-4 w-4 text-green-500" />
                    Browse Marketplace
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start h-10 bg-background/80" asChild>
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
                <CardDescription>Your latest transactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="font-medium">DeFi Protocol Purchase</p>
                      <p className="text-sm text-muted-foreground">You purchased a new DeFi protocol license</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">-250 ECE</p>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="font-medium">Project Milestone Completed</p>
                      <p className="text-sm text-muted-foreground">NFT Gaming project reached milestone 2</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">+175 ECE</p>
                      <p className="text-sm text-muted-foreground">5 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Deposit Received</p>
                      <p className="text-sm text-muted-foreground">Monthly deposit to your wallet</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">+500 ECE</p>
                      <p className="text-sm text-muted-foreground">1 week ago</p>
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
              <CardDescription>Your financial activity over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionTrendsChart />
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Your Applications
              </CardTitle>
              <CardDescription>Recently deployed applications and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {recentApps.map((app) => (
                  <Card key={app.id} className="bg-muted/40">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === "running"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : app.status === "deploying"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Applications
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions, messages, and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recent Messages */}
              <div>
                <h3 className="text-lg font-medium mb-3">Recent Messages</h3>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">
                            {teamMembers.find((m) => m.id === message.sender)?.name || "Unknown User"}
                          </p>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{message.content}</p>
                        <div className="mt-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">{message.channel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    View All Messages
                  </Button>
                </div>
              </div>

              {/* Integration Events */}
              <div>
                <h3 className="text-lg font-medium mb-3">Integration Events</h3>
                <div className="space-y-4">
                  {integrationEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {event.type === "github" ? (
                          <Code className="h-5 w-5 text-primary" />
                        ) : (
                          <Server className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">
                            {event.type === "github" ? "GitHub" : "Vercel"} - {event.event}
                          </p>
                          <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.type === "github"
                            ? `${event.user} ${event.event === "push" ? "pushed to" : "opened PR in"} ${event.repo}: ${event.message}`
                            : `Deployment ${event.status} to ${event.environment} for ${event.project}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    View All Events
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
              <CardDescription>Manage your active and upcoming projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-muted/40">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">NFT Gaming Platform</CardTitle>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Active
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        A gaming platform that integrates NFTs for in-game assets and rewards.
                      </p>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        View Project
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-muted/40">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">DeFi Protocol</CardTitle>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Planning
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        A decentralized finance protocol with lending and borrowing capabilities.
                      </p>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>15%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        View Project
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button variant="default">
                    <Rocket className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions with null checks to prevent errors
function getAppTypeIcon(type: string | undefined) {
  if (!type) return <Code className="h-5 w-5 text-gray-500" />

  switch (type.toLowerCase()) {
    case "web":
      return <Globe className="h-5 w-5 text-blue-500" />
    case "mobile":
      return <Smartphone className="h-5 w-5 text-green-500" />
    case "api":
      return <Code className="h-5 w-5 text-purple-500" />
    case "backend":
      return <Server className="h-5 w-5 text-orange-500" />
    default:
      return <Layers className="h-5 w-5 text-gray-500" />
  }
}

function getStatusVariant(status: string | undefined): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return "outline"

  switch (status.toLowerCase()) {
    case "running":
    case "active":
      return "default"
    case "deploying":
    case "maintenance":
      return "secondary"
    case "stopped":
      return "destructive"
    default:
      return "outline"
  }
}

// Add missing Smartphone icon
function Smartphone({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}
