"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDemo } from "@/lib/demo-context"
import { demoUsers } from "@/lib/demo-data"
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"
import { ListSkeleton } from "@/components/skeletons/list-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { useLoadingState } from "@/hooks/use-loading-state"
import { useWallet } from "@/lib/wallet-context"
import {
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  Wallet,
  Users,
  ChevronRight,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  User,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { ProjectTracker, type Project } from "@/components/project/project-tracker"
import { ProjectsList } from "@/components/project/projects-list"
import { AddonPurchaseDialog } from "@/components/project/addon-purchase-dialog"
import { MilestoneNotification } from "@/components/project/milestone-notification"
// Import the MilestonePaymentNotification component
import { MilestonePaymentNotification } from "@/components/project/milestone-payment-notification"
import { ScheduledPaymentNotification } from "@/components/project/scheduled-payment-notification"
import { ProjectOrderFlow } from "@/components/project/project-order-flow"
import { TransactionTrendsChart } from "@/components/analytics/transaction-trends-chart"
import { MonthlySpendingChart } from "@/components/analytics/monthly-spending-chart"
import { MonthlyActivityChart } from "@/components/analytics/monthly-activity-chart"
import { WalletBalanceHistory } from "@/components/wallet/wallet-balance-history"
import { QuickTransfer } from "@/components/wallet/quick-transfer"
import { TransactionCategories } from "@/components/wallet/transaction-categories"
import { useRouter } from "next/navigation"

// Mock project data
const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "ECE Mobile App",
    description:
      "A cross-platform mobile application for ECE users with wallet integration and real-time notifications.",
    status: "development",
    startDate: "2023-11-15",
    estimatedEndDate: "2024-02-15",
    progress: 45,
    team: [
      {
        id: "team-1",
        name: "Alex Johnson",
        role: "Project Manager",
        avatar: "/diverse-person.png",
      },
      {
        id: "team-2",
        name: "Sarah Chen",
        role: "Lead Developer",
        avatar: "/diverse-group-two.png",
      },
      {
        id: "team-3",
        name: "Miguel Rodriguez",
        role: "UI/UX Designer",
        avatar: "/diverse-group-outdoors.png",
      },
      {
        id: "team-4",
        name: "Priya Patel",
        role: "Backend Developer",
        avatar: "/diverse-group-four.png",
      },
    ],
    milestones: [
      {
        id: "ms-1",
        title: "Project Planning",
        description: "Define project scope, requirements, and timeline",
        status: "approved",
        dueDate: "2023-11-30",
        completedDate: "2023-11-28",
        progress: 100,
        paymentAmount: 500,
        paymentStatus: "paid",
        paymentDate: "2023-11-30T10:30:00",
        approvalHistory: [
          {
            action: "approved",
            date: "2023-11-29T10:30:00",
            feedback: "Great work on the project planning. All requirements are well defined.",
          },
        ],
      },
      {
        id: "ms-2",
        title: "UI/UX Design",
        description: "Create wireframes and design mockups for all app screens",
        status: "completed",
        dueDate: "2023-12-20",
        completedDate: "2023-12-22",
        progress: 100,
        paymentAmount: 750,
        paymentStatus: "pending",
      },
      {
        id: "ms-3",
        title: "Frontend Development",
        description: "Implement user interface and client-side functionality",
        status: "in-progress",
        dueDate: "2024-01-15",
        progress: 70,
        paymentAmount: 1200,
        paymentStatus: "not_required",
      },
      {
        id: "ms-4",
        title: "Backend Integration",
        description: "Connect to APIs and implement server-side logic",
        status: "in-progress",
        dueDate: "2024-01-30",
        progress: 40,
        paymentAmount: 1500,
        paymentStatus: "not_required",
      },
      {
        id: "ms-5",
        title: "Testing & QA",
        description: "Perform comprehensive testing and bug fixes",
        status: "pending",
        dueDate: "2024-02-10",
        progress: 0,
        paymentAmount: 800,
        paymentStatus: "not_required",
      },
    ],
    comments: [
      {
        id: "comment-1",
        author: {
          id: "user-1",
          name: "You",
          avatar: "/person-client.png",
        },
        content: "When will the first beta version be available for testing?",
        timestamp: "2023-12-10T14:30:00",
        isFromTeam: false,
      },
      {
        id: "comment-2",
        author: {
          id: "team-1",
          name: "Alex Johnson",
          avatar: "/diverse-person.png",
        },
        content: "We're planning to have a beta version ready by January 20th. I'll keep you updated on our progress.",
        timestamp: "2023-12-10T15:45:00",
        isFromTeam: true,
      },
      {
        id: "comment-3",
        author: {
          id: "user-1",
          name: "You",
          avatar: "/person-client.png",
        },
        content: "Great! I'd also like to discuss adding push notifications to the app. Is that possible?",
        timestamp: "2023-12-11T09:15:00",
        isFromTeam: false,
      },
      {
        id: "comment-4",
        author: {
          id: "team-2",
          name: "Sarah Chen",
          avatar: "/diverse-group-two.png",
        },
        content:
          "Yes, we can definitely implement push notifications. It's already part of our development plan for the next sprint.",
        timestamp: "2023-12-11T10:30:00",
        isFromTeam: true,
      },
      {
        id: "comment-5",
        author: {
          id: "team-3",
          name: "Miguel Rodriguez",
          avatar: "/diverse-group-outdoors.png",
        },
        content:
          "I've just uploaded the latest UI designs for the notification screens. You can check them in the Files section.",
        timestamp: "2023-12-12T14:20:00",
        isFromTeam: true,
      },
    ],
    files: [
      {
        id: "file-1",
        name: "ECE_App_Requirements.pdf",
        type: "PDF Document",
        size: "2.4 MB",
        uploadedAt: "2023-11-15",
        url: "#",
      },
      {
        id: "file-2",
        name: "UI_Design_Mockups.zip",
        type: "ZIP Archive",
        size: "15.8 MB",
        uploadedAt: "2023-12-05",
        url: "#",
      },
      {
        id: "file-3",
        name: "Frontend_Progress_Report.docx",
        type: "Word Document",
        size: "1.2 MB",
        uploadedAt: "2024-01-05",
        url: "#",
      },
      {
        id: "file-4",
        name: "Notification_Screens_V2.fig",
        type: "Figma File",
        size: "8.5 MB",
        uploadedAt: "2023-12-12",
        url: "#",
      },
    ],
    addOns: [
      {
        id: "addon-1",
        name: "Advanced Analytics Dashboard",
        description: "Comprehensive analytics with user behavior tracking and custom reports.",
        price: 1200,
        installed: false,
      },
      {
        id: "addon-2",
        name: "Multi-language Support",
        description: "Add support for 10+ languages with automatic translation.",
        price: 800,
        installed: true,
      },
      {
        id: "addon-3",
        name: "Offline Mode",
        description: "Enable full app functionality without internet connection.",
        price: 1500,
        installed: false,
      },
      {
        id: "addon-4",
        name: "Advanced User Roles",
        description: "Implement granular permission system with custom roles.",
        price: 950,
        installed: false,
      },
    ],
  },
  {
    id: "proj-2",
    name: "ECE Wallet Integration",
    description: "Connect wallet functionality to the main app with secure transaction processing.",
    status: "planning",
    startDate: "2024-01-10",
    estimatedEndDate: "2024-03-30",
    progress: 15,
    team: [
      {
        id: "team-1",
        name: "Alex Johnson",
        role: "Project Manager",
        avatar: "/diverse-person.png",
      },
      {
        id: "team-5",
        name: "David Kim",
        role: "Blockchain Developer",
        avatar: "/diverse-group-five.png",
      },
      {
        id: "team-6",
        name: "Emma Wilson",
        role: "Security Specialist",
        avatar: "/diverse-group-six.png",
      },
    ],
    milestones: [
      {
        id: "ms-1",
        title: "Requirements Gathering",
        description: "Define integration requirements and security protocols",
        status: "completed",
        dueDate: "2024-01-20",
        completedDate: "2024-01-18",
        progress: 100,
        paymentAmount: 600,
        paymentStatus: "paid",
        paymentDate: "2024-01-20T10:30:00",
      },
      {
        id: "ms-2",
        title: "Architecture Design",
        description: "Design system architecture and data flow",
        status: "in-progress",
        dueDate: "2024-02-10",
        progress: 60,
        paymentAmount: 900,
        paymentStatus: "pending",
      },
      {
        id: "ms-3",
        title: "API Development",
        description: "Develop secure APIs for wallet integration",
        status: "pending",
        dueDate: "2024-03-01",
        progress: 0,
        paymentAmount: 1100,
        paymentStatus: "not_required",
      },
      {
        id: "ms-4",
        title: "Testing & Security Audit",
        description: "Comprehensive security testing and third-party audit",
        status: "pending",
        dueDate: "2024-03-20",
        progress: 0,
        paymentAmount: 700,
        paymentStatus: "not_required",
      },
    ],
    comments: [
      {
        id: "comment-1",
        author: {
          id: "user-1",
          name: "You",
          avatar: "/person-client.png",
        },
        content: "What security measures are being implemented for the wallet integration?",
        timestamp: "2024-01-12T10:30:00",
        isFromTeam: false,
      },
      {
        id: "comment-2",
        author: {
          id: "team-6",
          name: "Emma Wilson",
          avatar: "/diverse-group-six.png",
        },
        content:
          "We're implementing multi-factor authentication, end-to-end encryption, and regular security audits. I'll share our full security protocol document with you this week.",
        timestamp: "2024-01-12T11:45:00",
        isFromTeam: true,
      },
    ],
    files: [
      {
        id: "file-1",
        name: "Wallet_Integration_Requirements.pdf",
        type: "PDF Document",
        size: "3.1 MB",
        uploadedAt: "2024-01-10",
        url: "#",
      },
      {
        id: "file-2",
        name: "Security_Protocol_Draft.pdf",
        type: "PDF Document",
        size: "5.2 MB",
        uploadedAt: "2024-01-15",
        url: "#",
      },
    ],
    addOns: [
      {
        id: "addon-1",
        name: "Multi-currency Support",
        description: "Add support for 20+ cryptocurrencies and tokens.",
        price: 2200,
        installed: false,
      },
      {
        id: "addon-2",
        name: "Advanced Transaction Monitoring",
        description: "Real-time monitoring and alerts for suspicious activities.",
        price: 1800,
        installed: false,
      },
    ],
  },
]

export default function AppMode() {
  const { isDemoMode } = useDemo()
  const { balance, currency, transactions, scheduledDeposits, walletNotifications, addFunds, withdrawFunds } =
    useWallet()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading] = useLoadingState(true)
  const [quickActionAmount, setQuickActionAmount] = useState("100")
  const [showQuickActionSuccess, setShowQuickActionSuccess] = useState(false)
  const [quickActionType, setQuickActionType] = useState<"deposit" | "withdraw" | null>(null)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [addonToPurchase, setAddonToPurchase] = useState<(typeof projects)[0]["addOns"][0] | null>(null)
  const [addonPurchaseDialogOpen, setAddonPurchaseDialogOpen] = useState(false)
  const [milestoneNotifications, setMilestoneNotifications] = useState<
    {
      id: string
      type: "approved" | "changes-requested"
      milestoneTitle: string
      timestamp: string
    }[]
  >([])
  // Add a state for payment notifications
  const [paymentNotifications, setPaymentNotifications] = useState<
    {
      id: string
      projectId: string
      projectName: string
      milestoneId: string
      milestoneName: string
      amount: number
      dueDate?: string
    }[]
  >([])
  const [selectedMilestone, setSelectedMilestone] = useState<(typeof mockProjects)[0]["milestones"][0] | null>(null)
  const [milestonePaymentDialogOpen, setMilestonePaymentDialogOpen] = useState(false)
  const [scheduledPaymentNotifications, setScheduledPaymentNotifications] = useState<
    {
      id: string
      projectName: string
      milestoneName: string
      amount: number
      currency: string
      scheduledDate: string
    }[]
  >([])

  // Order form state
  const [orderForm, setOrderForm] = useState({
    projectName: "",
    projectType: "mobile",
    description: "",
    budget: 5000,
    timeline: 8, // weeks
    expediteFactor: 0, // 0-100 where 0 is normal timeline and 100 is max expedite
    features: {
      authentication: false,
      payments: false,
      userProfiles: false,
      notifications: false,
      analytics: false,
      adminDashboard: false,
      customDesign: false,
      apiIntegration: false,
    },
    platform: {
      ios: false,
      android: false,
      web: false,
    },
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    additionalInfo: "",
  })

  // In a real app, you would fetch this data from your API
  const user = isDemoMode ? demoUsers[0] : null
  const allTransactions = isDemoMode ? transactions : []
  const notifications = isDemoMode ? walletNotifications : []
  const router = useRouter()

  // Get the selected project
  const selectedProject = projects.find((project) => project.id === selectedProjectId)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Calculate statistics
  const stats = {
    totalDeposits: allTransactions
      .filter((tx) => tx.type === "deposit" || tx.type === "scheduled_deposit")
      .reduce((sum, tx) => sum + tx.amount, 0),
    totalWithdrawals: allTransactions
      .filter((tx) => tx.type === "withdrawal" || tx.type === "purchase")
      .reduce((sum, tx) => sum + tx.amount, 0),
    transactionCount: allTransactions.length,
    pendingTransactions: allTransactions.filter((tx) => tx.status === "pending").length,
    upcomingDeposits: scheduledDeposits.filter((d) => d.isActive).length,
  }

  // Get recent activity for the activity feed
  const recentActivity = [...allTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Calculate monthly spending by category (mock data for demo)
  const spendingByCategory = [
    { category: "Services", amount: 450, percentage: 45 },
    { category: "Products", amount: 300, percentage: 30 },
    { category: "Subscriptions", amount: 150, percentage: 15 },
    { category: "Other", amount: 100, percentage: 10 },
  ]

  // Handle quick deposit/withdraw
  const handleQuickAction = async (type: "deposit" | "withdraw") => {
    const amount = Number(quickActionAmount)
    if (isNaN(amount) || amount <= 0) return

    setQuickActionType(type)

    try {
      if (type === "deposit") {
        await addFunds(amount)
      } else {
        await withdrawFunds(amount)
      }
      setShowQuickActionSuccess(true)
      setTimeout(() => {
        setShowQuickActionSuccess(false)
        setQuickActionType(null)
      }, 3000)
    } catch (error) {
      console.error(`Error with ${type}:`, error)
      setQuickActionType(null)
    }
  }

  // Get transaction status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <PlusCircle className="h-4 w-4 text-green-500" />
      case "scheduled_deposit":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <MinusCircle className="h-4 w-4 text-red-500" />
      case "purchase":
        return <MinusCircle className="h-4 w-4 text-red-500" />
      case "conversion":
        return <RefreshCw className="h-4 w-4 text-blue-500" />
      default:
        return <RefreshCw className="h-4 w-4" />
    }
  }

  // Get transaction status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <HelpCircle className="h-4 w-4" />
    }
  }

  // Calculate base cost based on features and platforms
  const calculateBaseCost = () => {
    let cost = orderForm.budget

    // Add costs for selected features
    const featureCosts = {
      authentication: 500,
      payments: 1000,
      userProfiles: 600,
      notifications: 400,
      analytics: 800,
      adminDashboard: 1200,
      customDesign: 1500,
      apiIntegration: 900,
    }

    Object.entries(orderForm.features).forEach(([feature, isSelected]) => {
      if (isSelected) {
        cost += featureCosts[feature as keyof typeof featureCosts]
      }
    })

    // Add costs for selected platforms
    let platformCount = 0
    if (orderForm.platform.ios) platformCount++
    if (orderForm.platform.android) platformCount++
    if (orderForm.platform.web) platformCount++

    // First platform is included in base cost, additional platforms cost extra
    if (platformCount > 1) {
      cost += (platformCount - 1) * 2000
    }

    return cost
  }

  // Calculate timeline based on features and platforms
  const calculateBaseTimeline = () => {
    let weeks = orderForm.timeline

    // Add time for selected features
    const featureTimeAdds = {
      authentication: 1,
      payments: 2,
      userProfiles: 1,
      notifications: 1,
      analytics: 1.5,
      adminDashboard: 2,
      customDesign: 2,
      apiIntegration: 1.5,
    }

    Object.entries(orderForm.features).forEach(([feature, isSelected]) => {
      if (isSelected) {
        weeks += featureTimeAdds[feature as keyof typeof featureTimeAdds]
      }
    })

    // Add time for selected platforms
    let platformCount = 0
    if (orderForm.platform.ios) platformCount++
    if (orderForm.platform.android) platformCount++
    if (orderForm.platform.web) platformCount++

    // First platform is included in base timeline, additional platforms add time
    if (platformCount > 1) {
      weeks += (platformCount - 1) * 2
    }

    return weeks
  }

  // Calculate expedited timeline and cost
  const calculateExpedited = () => {
    const baseCost = calculateBaseCost()
    const baseTimeline = calculateBaseTimeline()

    // Calculate expedited timeline (reduce by up to 40% based on expedite factor)
    const expeditedTimeline = Math.max(
      Math.round(baseTimeline * (1 - (orderForm.expediteFactor / 100) * 0.4)),
      Math.ceil(baseTimeline * 0.6),
    )

    // Calculate expedited cost (increase by up to 100% based on expedite factor)
    const expeditedCost = Math.round(baseCost * (1 + (orderForm.expediteFactor / 100) * 1))

    return {
      timeline: expeditedTimeline,
      cost: expeditedCost,
      timelineSaved: baseTimeline - expeditedTimeline,
      costIncrease: expeditedCost - baseCost,
    }
  }

  // Get the final timeline and cost
  const getFinalEstimate = () => {
    const expedited = calculateExpedited()
    return {
      timeline: expedited.timeline,
      cost: expedited.cost,
      timelineSaved: expedited.timelineSaved,
      costIncrease: expedited.costIncrease,
    }
  }

  // Handle adding a comment to a project
  const handleAddComment = (content: string) => {
    if (!selectedProjectId) return

    const newComment = {
      id: `comment-${Date.now()}`,
      author: {
        id: "user-1",
        name: "You",
        avatar: "/person-client.png",
      },
      content,
      timestamp: new Date().toISOString(),
      isFromTeam: false,
    }

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            comments: [newComment, ...project.comments],
          }
        }
        return project
      }),
    )
  }

  // Handle purchasing an add-on
  const handlePurchaseAddOn = (addOnId: string) => {
    if (!selectedProjectId) return

    // Find the add-on to purchase
    const project = projects.find((p) => p.id === selectedProjectId)
    if (!project) return

    const addon = project.addOns.find((a) => a.id === addOnId)
    if (!addon) return

    // Open the purchase dialog
    setAddonToPurchase(addon)
    setAddonPurchaseDialogOpen(true)
  }

  // Confirm add-on purchase
  const confirmAddonPurchase = () => {
    if (!selectedProjectId || !addonToPurchase) return

    // Update the project with the purchased add-on
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            addOns: project.addOns.map((addon) => {
              if (addon.id === addonToPurchase.id) {
                return {
                  ...addon,
                  installed: true,
                }
              }
              return addon
            }),
          }
        }
        return project
      }),
    )

    // Deduct the cost from the wallet (in a real app)
    if (isDemoMode && addonToPurchase) {
      withdrawFunds(addonToPurchase.price)
    }
  }

  const handleApproveMilestone = (milestoneId: string, feedback: string) => {
    if (!selectedProjectId) return

    // Find the milestone title
    const milestoneTitle =
      projects.find((p) => p.id === selectedProjectId)?.milestones.find((m) => m.id === milestoneId)?.title || "Unknown"

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            milestones: project.milestones.map((milestone) => {
              if (milestone.id === milestoneId) {
                // Create approval history entry
                const approvalHistory = milestone.approvalHistory || []
                approvalHistory.push({
                  action: "approved",
                  date: new Date().toISOString(),
                  feedback: feedback || undefined,
                })

                return {
                  ...milestone,
                  status: "approved",
                  approvalHistory,
                }
              }
              return milestone
            }),
          }
        }
        return project
      }),
    )

    // Create a notification or comment about the approval
    const newComment = {
      id: `comment-${Date.now()}`,
      author: {
        id: "user-1",
        name: "You",
        avatar: "/person-client.png",
      },
      content: `Milestone "${milestoneTitle}" has been approved.${feedback ? ` Feedback: ${feedback}` : ""}`,
      timestamp: new Date().toISOString(),
      isFromTeam: false,
    }

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            comments: [newComment, ...project.comments],
          }
        }
        return project
      }),
    )

    // Add milestone notification
    setMilestoneNotifications((prev) => [
      ...prev,
      {
        id: `notification-${Date.now()}`,
        type: "approved",
        milestoneTitle,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const handleRequestMilestoneChanges = (milestoneId: string, feedback: string) => {
    if (!selectedProjectId) return

    // Find the milestone title
    const milestoneTitle =
      projects.find((p) => p.id === selectedProjectId)?.milestones.find((m) => m.id === milestoneId)?.title || "Unknown"

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            milestones: project.milestones.map((milestone) => {
              if (milestone.id === milestoneId) {
                // Create approval history entry
                const approvalHistory = milestone.approvalHistory || []
                approvalHistory.push({
                  action: "changes-requested",
                  date: new Date().toISOString(),
                  feedback: feedback || undefined,
                })

                return {
                  ...milestone,
                  status: "changes-requested",
                  approvalHistory,
                }
              }
              return milestone
            }),
          }
        }
        return project
      }),
    )

    // Create a notification or comment about the change request
    const newComment = {
      id: `comment-${Date.now()}`,
      author: {
        id: "user-1",
        name: "You",
        avatar: "/person-client.png",
      },
      content: `Changes requested for milestone "${milestoneTitle}".${feedback ? ` Feedback: ${feedback}` : ""}`,
      timestamp: new Date().toISOString(),
      isFromTeam: false,
    }

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            comments: [newComment, ...project.comments],
          }
        }
        return project
      }),
    )

    // Add milestone notification
    setMilestoneNotifications((prev) => [
      ...prev,
      {
        id: `notification-${Date.now()}`,
        type: "changes-requested",
        milestoneTitle,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const dismissMilestoneNotification = (notificationId: string) => {
    setMilestoneNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  // Add the onMilestonePayment handler function
  const handleMilestonePayment = (milestoneId: string) => {
    if (!selectedProjectId) return

    // Find the milestone title
    const milestoneTitle =
      projects.find((p) => p.id === selectedProjectId)?.milestones.find((m) => m.id === milestoneId)?.title || "Unknown"

    // Update the milestone payment status
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            milestones: project.milestones.map((milestone) => {
              if (milestone.id === milestoneId) {
                return {
                  ...milestone,
                  paymentStatus: "paid",
                  paymentDate: new Date().toISOString(),
                }
              }
              return milestone
            }),
          }
        }
        return project
      }),
    )

    // Create a notification or comment about the payment
    const newComment = {
      id: `comment-${Date.now()}`,
      author: {
        id: "user-1",
        name: "You",
        avatar: "/person-client.png",
      },
      content: `Payment for milestone "${milestoneTitle}" has been processed.`,
      timestamp: new Date().toISOString(),
      isFromTeam: false,
    }

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            comments: [newComment, ...project.comments],
          }
        }
        return project
      }),
    )

    // Add milestone notification
    setMilestoneNotifications((prev) => [
      ...prev,
      {
        id: `notification-${Date.now()}`,
        type: "approved", // Reuse the approved type for payment notifications
        milestoneTitle: `Payment for ${milestoneTitle} processed`,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  // Add a function to check for due payments
  useEffect(() => {
    // Check for milestones that are approved but not paid
    const duePayments = projects.flatMap((project) =>
      project.milestones
        .filter(
          (milestone) =>
            milestone.status === "approved" && milestone.paymentStatus === "pending" && milestone.paymentAmount,
        )
        .map((milestone) => ({
          id: `payment-${project.id}-${milestone.id}`,
          projectId: project.id,
          projectName: project.name,
          milestoneId: milestone.id,
          milestoneName: milestone.title,
          amount: milestone.paymentAmount || 0,
          dueDate: milestone.completedDate
            ? new Date(new Date(milestone.completedDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
        })),
    )

    // Update payment notifications
    setPaymentNotifications(duePayments)

    // Add a sample scheduled payment notification
    setScheduledPaymentNotifications([
      {
        id: "spn1",
        projectName: "ECE Mobile App",
        milestoneName: "Backend Integration",
        amount: 1500,
        currency: "ECE",
        scheduledDate: addDays(new Date(), 3).toISOString(),
      },
    ])
  }, [projects])

  // Add a function to handle payment from notification
  const handlePaymentFromNotification = (projectId: string, milestoneId: string) => {
    setSelectedProjectId(projectId)
    setActiveTab("projects")

    // Find the milestone
    const project = projects.find((p) => p.id === projectId)
    const milestone = project?.milestones.find((m) => m.id === milestoneId)

    if (project && milestone) {
      // Open the payment dialog
      setSelectedMilestone(milestone)
      setMilestonePaymentDialogOpen(true)
    }
  }

  // Add a function to dismiss payment notification
  const dismissPaymentNotification = (notificationId: string) => {
    setPaymentNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const dismissScheduledPaymentNotification = (notificationId: string) => {
    setScheduledPaymentNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const finalEstimate = getFinalEstimate()

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  return (
    <div className="space-y-6">
      {/* Milestone Notifications */}
      {milestoneNotifications.length > 0 && (
        <div className="space-y-2">
          {milestoneNotifications.map((notification) => (
            <MilestoneNotification
              key={notification.id}
              type={notification.type}
              milestoneTitle={notification.milestoneTitle}
              timestamp={notification.timestamp}
              onDismiss={() => dismissMilestoneNotification(notification.id)}
            />
          ))}
        </div>
      )}
      {/* Scheduled Payment Notifications */}
      {scheduledPaymentNotifications.length > 0 && (
        <div className="space-y-2">
          {scheduledPaymentNotifications.map((notification) => (
            <ScheduledPaymentNotification
              key={notification.id}
              projectName={notification.projectName}
              milestoneName={notification.milestoneName}
              amount={notification.amount}
              currency={notification.currency}
              scheduledDate={notification.scheduledDate}
              onDismiss={() => dismissScheduledPaymentNotification(notification.id)}
            />
          ))}
        </div>
      )}
      {paymentNotifications.length > 0 && (
        <div className="space-y-2">
          {paymentNotifications.map((notification) => (
            <MilestonePaymentNotification
              key={notification.id}
              projectName={notification.projectName}
              milestoneName={notification.milestoneName}
              amount={notification.amount}
              currency={currency}
              dueDate={notification.dueDate}
              onDismiss={() => dismissPaymentNotification(notification.id)}
              onPay={() => handlePaymentFromNotification(notification.projectId, notification.milestoneId)}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-cursive text-primary">Custom App Development</h2>
          <p className="font-thin text-muted-foreground mt-1 tracking-wide">
            Manage your app development projects and resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="font-thin">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => router.push("/app/order")} className="font-thin">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 font-thin">
          <TabsTrigger value="overview" className="font-thin">
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="font-thin">
            My Projects
          </TabsTrigger>
          <TabsTrigger value="transactions" className="font-thin">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="font-thin">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-thin">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="order" className="font-thin">
            Order App
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          {isDemoMode ? (
            isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-cursive">Account Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileSkeleton />
                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-cursive">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ListSkeleton items={3} />
                    <Skeleton className="h-9 w-full mt-4" />
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-cursive">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-card border shadow-sm card-hover-subtle">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                          <h3 className="text-2xl font-bold mt-1">
                            {balance} {currency}
                          </h3>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex items-center mt-4 text-sm">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">+{stats.totalDeposits}</span>
                        <span className="text-muted-foreground ml-1">deposits</span>
                        <Separator orientation="vertical" className="mx-2 h-4" />
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-500 font-medium">-{stats.totalWithdrawals}</span>
                        <span className="text-muted-foreground ml-1">spent</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border shadow-sm card-hover-subtle">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                          <h3 className="text-2xl font-bold mt-1">{stats.transactionCount}</h3>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                          <BarChart3 className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                        </div>
                      </div>
                      <div className="flex items-center mt-4 text-sm">
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-yellow-500 font-medium">{stats.pendingTransactions}</span>
                        <span className="text-muted-foreground ml-1">pending</span>
                        <Separator orientation="vertical" className="mx-2 h-4" />
                        <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-blue-500 font-medium">{stats.upcomingDeposits}</span>
                        <span className="text-muted-foreground ml-1">scheduled</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border shadow-sm card-hover-subtle">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                          <h3 className="text-2xl font-bold mt-1">{projects.length}</h3>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                          <Layers className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className="font-medium">
                              {Math.round(
                                projects.reduce((sum, project) => sum + project.progress, 0) / projects.length,
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={Math.round(
                              projects.reduce((sum, project) => sum + project.progress, 0) / projects.length,
                            )}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border shadow-sm card-hover-subtle">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                          <h3 className="text-2xl font-bold mt-1">7</h3>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                          <Users className="h-5 w-5 text-green-500 dark:text-green-300" />
                        </div>
                      </div>
                      <div className="flex -space-x-2 mt-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Avatar key={i} className="border-2 border-background w-8 h-8">
                            <AvatarImage src={`/diverse-group.png?key=rs4dm&height=32&width=32&query=person ${i}`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-xs font-medium border-2 border-background">
                          +2
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                    <div className="md:col-span-3 space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="font-cursive text-md font-medium">Account Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src="/diverse-user-avatars.png" alt="User Avatar" />
                              <AvatarFallback>
                                <User className="h-8 w-8" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{user?.email || "demo@example.com"}</h3>
                              <p className="text-sm text-muted-foreground">
                                {isDemoMode ? "Demo Account" : "Premium Account"}
                              </p>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="text-xs px-2 py-0 h-5 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  Verified
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">Profile Completion</span>
                                <span className="text-sm font-medium">85%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: "85%" }}></div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Complete your profile to unlock all features
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div className="bg-muted/50 rounded-lg p-3">
                                <div className="text-sm font-medium">Total Projects</div>
                                <div className="text-2xl font-bold">12</div>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-3">
                                <div className="text-sm font-medium">Completed</div>
                                <div className="text-2xl font-bold">8</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <WalletBalanceHistory />
                    </div>

                    <div className="md:col-span-3 space-y-4">
                      <QuickTransfer />
                      <TransactionCategories />
                    </div>
                  </div>

                  <Card className="bg-card border shadow-sm card-hover-subtle">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-cursive">Account Overview</CardTitle>
                      <CardDescription className="font-thin">Your account details and quick actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                              <img
                                src={user?.avatar || "/placeholder.svg?height=64&width=64&query=person"}
                                alt={user?.name}
                                className="h-16 w-16 rounded-full border-2 border-primary/20"
                              />
                              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-background"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{user?.name}</h3>
                              <p className="text-sm text-muted-foreground">{user?.email}</p>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Member since {new Date(user?.joinedDate || "").toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Profile Completion */}
                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Profile Completion</span>
                              <span className="font-medium">85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              Complete your profile to unlock all features
                            </div>
                          </div>

                          {/* Account Verification Status */}
                          <div className="bg-primary/5 p-3 rounded-lg mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm font-medium">Account Verified</span>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                Verified
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your account has been fully verified and has access to all features
                            </p>
                          </div>

                          {/* Account Stats */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/40 p-2 rounded-lg">
                              <div className="text-xs text-muted-foreground">Projects</div>
                              <div className="text-lg font-semibold">{projects.length}</div>
                            </div>
                            <div className="bg-muted/40 p-2 rounded-lg">
                              <div className="text-xs text-muted-foreground">Completed</div>
                              <div className="text-lg font-semibold">
                                {projects.filter((p) => p.progress === 100).length}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="bg-muted/40 rounded-lg p-4 h-full">
                            <h4 className="font-medium mb-3 text-sm">Quick Actions</h4>
                            <div className="space-y-3">
                              <div>
                                <label htmlFor="quick-action-amount" className="text-xs font-medium block mb-1.5">
                                  Amount
                                </label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    id="quick-action-amount"
                                    type="number"
                                    value={quickActionAmount}
                                    onChange={(e) => setQuickActionAmount(e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter amount"
                                  />
                                  <span className="text-sm font-medium">{currency}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                                  onClick={() => handleQuickAction("deposit")}
                                  disabled={quickActionType !== null}
                                >
                                  {quickActionType === "deposit" ? (
                                    showQuickActionSuccess ? (
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                    ) : (
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    )
                                  ) : (
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                  )}
                                  {quickActionType === "deposit"
                                    ? showQuickActionSuccess
                                      ? "Success!"
                                      : "Processing..."
                                    : "Deposit"}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => handleQuickAction("withdraw")}
                                  disabled={quickActionType !== null}
                                >
                                  {quickActionType === "withdraw" ? (
                                    showQuickActionSuccess ? (
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                    ) : (
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    )
                                  ) : (
                                    <MinusCircle className="h-4 w-4 mr-1" />
                                  )}
                                  {quickActionType === "withdraw"
                                    ? showQuickActionSuccess
                                      ? "Success!"
                                      : "Processing..."
                                    : "Withdraw"}
                                </Button>
                              </div>

                              <div className="pt-2">
                                <h5 className="text-xs font-medium mb-2">Quick Transfer Presets</h5>
                                <div className="flex flex-wrap gap-2">
                                  {[50, 100, 250, 500].map((amount) => (
                                    <Button
                                      key={amount}
                                      variant="outline"
                                      size="sm"
                                      className="h-7 px-2 text-xs"
                                      onClick={() => setQuickActionAmount(amount.toString())}
                                    >
                                      {amount} {currency}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-2">
                      <Button className="flex-1 bg-[#0e5f59] hover:bg-[#0e5f59]/90 dark:bg-[#14a89d] dark:hover:bg-[#14a89d]/90">
                        <Wallet className="mr-2 h-4 w-4" />
                        Manage Wallet
                      </Button>
                      <Button className="flex-1" variant="outline">
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-card border shadow-sm card-hover-subtle">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="font-cursive">Recent Activity</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View all
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[280px] pr-4">
                        <div className="space-y-4">
                          {recentActivity.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-start space-x-3 rounded-md p-2.5 transition-colors hover:bg-muted/50"
                            >
                              <div className="mt-0.5 bg-muted rounded-full p-1.5">
                                {getTransactionIcon(activity.type)}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                                  <div
                                    className={`font-medium text-sm ${
                                      activity.type === "deposit" || activity.type === "scheduled_deposit"
                                        ? "text-green-600 dark:text-green-400"
                                        : activity.type === "withdrawal" || activity.type === "purchase"
                                          ? "text-red-600 dark:text-red-400"
                                          : ""
                                    }`}
                                  >
                                    {activity.type === "deposit" || activity.type === "scheduled_deposit"
                                      ? "+"
                                      : activity.type === "withdrawal" || activity.type === "purchase"
                                        ? "-"
                                        : ""}
                                    {activity.amount} {activity.currency}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{format(new Date(activity.date), "MMM d, yyyy 'at' h:mm a")}</span>
                                  <div className="flex items-center">
                                    {getStatusIcon(activity.status)}
                                    <span className="ml-1 capitalize">{activity.status}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 bg-card border shadow-sm card-hover-subtle">
                    <CardHeader>
                      <CardTitle className="font-cursive">Projects</CardTitle>
                      <CardDescription className="font-thin">Your active development projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {projects.slice(0, 3).map((project, i) => (
                          <Card key={project.id} className="overflow-hidden border">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="font-cursive text-base">{project.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                              </div>
                              <div className="flex justify-between mt-4 text-sm">
                                <div className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                                  <span className="text-muted-foreground">
                                    Due {format(new Date(project.estimatedEndDate), "MMM d")}
                                  </span>
                                </div>
                                {getStatusBadge(project.status)}
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                              <div className="flex -space-x-2">
                                {project.team.slice(0, 3).map((member, j) => (
                                  <Avatar key={member.id} className="border-2 border-background w-7 h-7">
                                    <AvatarImage
                                      src={member.avatar || `/placeholder.svg?height=28&width=28&query=person ${i + j}`}
                                    />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {project.team.length > 3 && (
                                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground text-xs font-medium border-2 border-background">
                                    +{project.team.length - 3}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => {
                                  setActiveTab("projects")
                                  setSelectedProjectId(project.id)
                                }}
                              >
                                Details
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => setActiveTab("projects")}>
                        <Layers className="mr-2 h-4 w-4" />
                        View All Projects
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No data available. Please connect to a database or enable demo mode.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          {isDemoMode ? (
            isLoading ? (
              <Card className="bg-card border shadow-sm">
                <CardHeader>
                  <CardTitle className="font-cursive">My Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ListSkeleton items={3} />
                </CardContent>
              </Card>
            ) : selectedProjectId ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => setSelectedProjectId(null)}>
                    <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                    Back to Projects
                  </Button>
                  <Button size="sm" onClick={() => setActiveTab("order")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </div>

                {selectedProject && (
                  <ProjectTracker
                    project={selectedProject}
                    onAddComment={handleAddComment}
                    onPurchaseAddOn={handlePurchaseAddOn}
                    onApproveMilestone={handleApproveMilestone}
                    onRequestMilestoneChanges={handleRequestMilestoneChanges}
                    onMilestonePayment={handleMilestonePayment}
                  />
                )}

                <AddonPurchaseDialog
                  addon={addonToPurchase}
                  open={addonPurchaseDialogOpen}
                  onOpenChange={setAddonPurchaseDialogOpen}
                  onConfirm={confirmAddonPurchase}
                  walletBalance={balance}
                />
              </div>
            ) : (
              <ProjectsList projects={projects} onSelectProject={(projectId) => setSelectedProjectId(projectId)} />
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No projects available. Please connect to a database or enable demo mode.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          {isDemoMode ? (
            isLoading ? (
              <Card className="bg-card border shadow-sm">
                <CardHeader>
                  <CardTitle className="font-cursive">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ListSkeleton items={5} />
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border shadow-sm card-hover-subtle">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-cursive">Transaction History</CardTitle>
                    <CardDescription className="font-thin">View and manage your transaction history</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                      <div>Description</div>
                      <div>Date</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div className="text-right">Amount</div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="divide-y">
                        {allTransactions.map((transaction) => (
                          <div key={transaction.id} className="grid grid-cols-5 p-3 text-sm items-center">
                            <div className="flex items-center gap-2">
                              <div className="bg-muted rounded-full p-1.5">{getTransactionIcon(transaction.type)}</div>
                              <span className="font-medium truncate max-w-[150px]">{transaction.description}</span>
                            </div>
                            <div>{format(new Date(transaction.date), "MMM d, yyyy")}</div>
                            <div>
                              <Badge variant="outline" className="capitalize">
                                {transaction.type.replace("_", " ")}
                              </Badge>
                            </div>
                            <div>{getStatusBadge(transaction.status)}</div>
                            <div
                              className={`text-right font-medium ${
                                transaction.type === "deposit" || transaction.type === "scheduled_deposit"
                                  ? "text-green-600 dark:text-green-400"
                                  : transaction.type === "withdrawal" || transaction.type === "purchase"
                                    ? "text-red-600 dark:text-red-400"
                                    : ""
                              }`}
                            >
                              {transaction.type === "deposit" || transaction.type === "scheduled_deposit"
                                ? "+"
                                : transaction.type === "withdrawal" || transaction.type === "purchase"
                                  ? "-"
                                  : ""}
                              {transaction.amount} {transaction.currency}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{allTransactions.length}</strong> transactions
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No transactions available. Please connect to a database or enable demo mode.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          {isDemoMode ? (
            isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-cursive">Spending Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-cursive">Transaction Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-card border shadow-sm card-hover-subtle">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-cursive text-base">Monthly Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,000 {currency}</div>
                      <p className="text-xs text-muted-foreground">vs. 850 last month</p>
                      <div className="mt-4 flex items-center text-sm">
                        <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-500 font-medium">+17.6%</span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border shadow-sm card-hover-subtle">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-cursive text-base">Average Transaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">125 {currency}</div>
                      <p className="text-xs text-muted-foreground">vs. 110 last month</p>
                      <div className="mt-4 flex items-center text-sm">
                        <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-500 font-medium">+13.6%</span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border shadow-sm card-hover-subtle">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-cursive text-base">Savings Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">32%</div>
                      <p className="text-xs text-muted-foreground">vs. 28% last month</p>
                      <div className="mt-4 flex items-center text-sm">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">+4%</span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MonthlySpendingChart />

                  <TransactionTrendsChart />
                </div>

                <MonthlyActivityChart />
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No analytics data available. Please connect to a database or enable demo mode.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          {isDemoMode ? (
            isLoading ? (
              <Card className="bg-card border shadow-sm">
                <CardHeader>
                  <CardTitle className="font-cursive">Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-3 rounded-lg border bg-card">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="h-4 w-full mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border shadow-sm card-hover-subtle">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-cursive">Notifications</CardTitle>
                    <CardDescription className="font-thin">
                      Stay updated with important alerts and information
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Mark all as read
                    </Button>
                    <Button variant="outline" size="sm">
                      Settings
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${notification.read ? "bg-card" : "bg-muted/20"} transition-all duration-200 hover:shadow-sm`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {notification.type === "deposit_reminder" && (
                                <Calendar className="h-5 w-5 text-blue-500" />
                              )}
                              {notification.type === "deposit_executed" && (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              )}
                              {notification.type === "low_balance" && <AlertCircle className="h-5 w-5 text-red-500" />}
                              {notification.type === "large_transaction" && (
                                <ArrowUpRight className="h-5 w-5 text-purple-500" />
                              )}
                              {notification.type === "activity_summary" && (
                                <BarChart3 className="h-5 w-5 text-indigo-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{notification.title}</h3>
                                <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                              </div>
                              <p className="text-sm mt-1">{notification.message}</p>
                              <div className="flex justify-end mt-2 gap-2">
                                {!notification.read && (
                                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    Mark as read
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                  {notification.type === "deposit_reminder"
                                    ? "View Deposit"
                                    : notification.type === "deposit_executed"
                                      ? "View Transaction"
                                      : notification.type === "low_balance"
                                        ? "Add Funds"
                                        : notification.type === "large_transaction"
                                          ? "View Details"
                                          : "View Report"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Load More
                  </Button>
                </CardFooter>
              </Card>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No notifications available. Please connect to a database or enable demo mode.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="order" className="mt-0">
          <Card className="bg-card border shadow-sm card-hover-subtle">
            <CardHeader>
              <CardTitle className="font-cursive">Order Custom App Development</CardTitle>
              <CardDescription className="font-thin">
                Follow the steps below to request a custom app development project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orderSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold">Order Submitted Successfully!</h3>
                  <p className="text-muted-foreground">
                    Thank you for your order. Our team will review your requirements and contact you shortly.
                  </p>
                  <Button className="mt-4" onClick={() => setActiveTab("projects")}>
                    View Your Projects
                  </Button>
                </div>
              ) : (
                <ProjectOrderFlow
                  onSubmit={(formData) => {
                    // In a real app, you would submit the order to your backend here
                    setOrderSubmitted(true)

                    // Create a new project based on the order
                    const newProject: Project = {
                      id: `proj-${Date.now()}`,
                      name: formData.projectName,
                      description: formData.description,
                      status: "planning",
                      startDate: new Date().toISOString(),
                      estimatedEndDate: new Date(
                        Date.now() + getFinalEstimate().timeline * 7 * 24 * 60 * 60 * 1000,
                      ).toISOString(),
                      progress: 0,
                      team: [
                        {
                          id: "team-1",
                          name: "Alex Johnson",
                          role: "Project Manager",
                          avatar: "/diverse-person.png",
                        },
                        {
                          id: "team-2",
                          name: "Sarah Chen",
                          role: "Lead Developer",
                          avatar: "/diverse-group-two.png",
                        },
                      ],
                      milestones: [
                        {
                          id: "ms-1",
                          title: "Project Planning",
                          description: "Define project scope, requirements, and timeline",
                          status: "pending",
                          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                          progress: 0,
                          paymentAmount: Math.round(finalEstimate.cost * 0.2), // 20% of total cost
                          paymentStatus: "not_required",
                        },
                        {
                          id: "ms-2",
                          title: "Design Phase",
                          description: "Create wireframes and design mockups",
                          status: "pending",
                          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                          progress: 0,
                          paymentAmount: Math.round(finalEstimate.cost * 0.3), // 30% of total
                          paymentStatus: "not_required",
                        },
                      ],
                      comments: [],
                      files: [],
                      addOns: [
                        {
                          id: "addon-1",
                          name: "Advanced Analytics Dashboard",
                          description: "Comprehensive analytics with user behavior tracking and custom reports.",
                          price: 1200,
                          installed: false,
                        },
                        {
                          id: "addon-2",
                          name: "Multi-language Support",
                          description: "Add support for 10+ languages with automatic translation.",
                          price: 800,
                          installed: false,
                        },
                      ],
                    }

                    // Add the new project to the projects list
                    setProjects((prev) => [newProject, ...prev])

                    // Reset form after submission
                    setTimeout(() => {
                      setOrderSubmitted(false)

                      // Switch to the projects tab and select the new project
                      setActiveTab("projects")
                      setSelectedProjectId(newProject.id)
                    }, 2000)
                  }}
                  initialData={orderForm}
                  currency={currency}
                  balance={balance}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
