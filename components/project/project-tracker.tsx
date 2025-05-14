"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  Send,
  Download,
  Calendar,
  GitCommit,
  Link2,
  AlertTriangle,
} from "lucide-react"
import { MilestoneApprovalDialog } from "./milestone-approval-dialog"
import { MilestonePaymentDialog } from "./milestone-payment-dialog"
// Import the MilestonePaymentHistory component
import { MilestonePaymentHistory } from "./milestone-payment-history"
import { MilestoneComparison } from "./milestone-comparison"
// Add these imports at the top of the file
import { MilestoneDependencies } from "./milestone-dependencies"
import { MilestoneDependencyInfo } from "./milestone-dependency-info"
import { DependencyGraph } from "./dependency-graph"
import { Switch } from "@/components/ui/switch"
// Add this import at the top
import { CriticalPathAnalysis } from "./critical-path-analysis"
import { CriticalPathAlerts } from "./critical-path-alerts"
import { RiskActionDialog } from "./risk-action-dialog"
import { RiskNotificationCenter } from "./risk-notification-center"
import { RiskMetrics } from "./risk-metrics"
import { useToast } from "@/hooks/use-toast"

// Types for project data
export type ProjectMilestone = {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "pending" | "delayed" | "approved" | "changes-requested"
  dueDate: string
  completedDate?: string
  progress: number
  paymentAmount?: number
  paymentStatus?: string
  paymentDate?: string
  dependencies?: string[] // Array of milestone IDs that this milestone depends on
  approvalHistory?: {
    action: "approved" | "changes-requested"
    date: string
    feedback?: string
  }[]
}

export type ProjectComment = {
  id: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  timestamp: string
  isFromTeam: boolean
}

export type ProjectFile = {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  url: string
}

export type ProjectAddOn = {
  id: string
  name: string
  description: string
  price: number
  installed: boolean
}

export type Project = {
  id: string
  name: string
  description: string
  status: "planning" | "development" | "testing" | "review" | "completed" | "on-hold"
  startDate: string
  estimatedEndDate: string
  actualEndDate?: string
  progress: number
  team: {
    id: string
    name: string
    role: string
    avatar?: string
  }[]
  milestones: ProjectMilestone[]
  comments: ProjectComment[]
  files: ProjectFile[]
  addOns: ProjectAddOn[]
}

// Add this to the ProjectTrackerProps interface
interface ProjectTrackerProps {
  project: Project
  onAddComment: (content: string) => void
  onPurchaseAddOn: (addOnId: string) => void
  onApproveMilestone: (milestoneId: string, feedback: string) => void
  onRequestMilestoneChanges: (milestoneId: string, feedback: string) => void
  onMilestonePayment: (milestoneId: string) => void
  onUpdateDependencies: (milestoneId: string, dependencies: string[]) => void // Add this line
  onUpdateMilestone?: (milestoneId: string, updates: Partial<ProjectMilestone>) => void
}

// Update the function parameters to include onUpdateDependencies
export function ProjectTracker({
  project,
  onAddComment,
  onPurchaseAddOn,
  onApproveMilestone,
  onRequestMilestoneChanges,
  onMilestonePayment,
  onUpdateDependencies, // Add this line
  onUpdateMilestone,
}: ProjectTrackerProps) {
  const { toast } = useToast()
  // Add this state
  const [milestoneDependenciesDialogOpen, setMilestoneDependenciesDialogOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMilestone, setSelectedMilestone] = useState<ProjectMilestone | null>(null)
  const [milestoneApprovalDialogOpen, setMilestoneApprovalDialogOpen] = useState(false)
  const [milestonePaymentDialogOpen, setMilestonePaymentDialogOpen] = useState(false)
  const [milestoneComparisonOpen, setMilestoneComparisonOpen] = useState(false) // New state for comparison dialog
  const [addonToPurchase, setAddonToPurchase] = useState<(typeof project)["addOns"][0] | null>(null)
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

  const [currency, setCurrency] = useState("ECE")
  // Add this state near the other state declarations
  const [showCriticalPath, setShowCriticalPath] = useState(true)

  // Add these new states
  const [riskActionDialogOpen, setRiskActionDialogOpen] = useState(false)
  const [selectedRiskMilestone, setSelectedRiskMilestone] = useState<ProjectMilestone | null>(null)

  // Add this function
  const openDependenciesDialog = (milestone: ProjectMilestone) => {
    setSelectedMilestone(milestone)
    setMilestoneDependenciesDialogOpen(true)
  }

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onAddComment(commentText)
      setCommentText("")
    }
  }

  const openMilestoneApprovalDialog = (milestone: ProjectMilestone) => {
    setSelectedMilestone(milestone)
    setMilestoneApprovalDialogOpen(true)
  }

  const openMilestonePaymentDialog = (milestone: ProjectMilestone) => {
    setSelectedMilestone(milestone)
    setMilestonePaymentDialogOpen(true)
  }

  // Add this function to handle risk actions
  const handleRiskAction = (milestoneId: string, action: "extend" | "allocate" | "prioritize") => {
    const milestone = project.milestones.find((m) => m.id === milestoneId)
    if (milestone) {
      setSelectedRiskMilestone(milestone)
      setRiskActionDialogOpen(true)
    }
  }

  // Add this function to process risk actions
  const processRiskAction = async (
    milestoneId: string,
    action: "extend" | "allocate" | "prioritize",
    data: { [key: string]: any },
  ) => {
    try {
      // In a real app, this would make API calls to update the milestone
      // For this demo, we'll just show a toast

      let successMessage = ""

      switch (action) {
        case "extend":
          successMessage = `Deadline extended to ${format(new Date(data.newDueDate), "MMM d, yyyy")}`
          // Update the milestone due date if onUpdateMilestone is provided
          if (onUpdateMilestone) {
            onUpdateMilestone(milestoneId, { dueDate: data.newDueDate.toISOString() })
          }
          break
        case "allocate":
          successMessage = `${data.additionalResources} additional resources allocated`
          break
        case "prioritize":
          successMessage = `Milestone priority updated to ${data.newPriority}`
          break
      }

      toast({
        title: "Action Taken",
        description: successMessage,
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Error processing risk action:", error)
      toast({
        title: "Action Failed",
        description: "Failed to process the risk action. Please try again.",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  // Add this function to view a milestone from a notification
  const handleViewMilestone = (milestoneId: string) => {
    const milestone = project.milestones.find((m) => m.id === milestoneId)
    if (milestone) {
      setActiveTab("milestones")
      // In a real app, you might want to scroll to the milestone
      setTimeout(() => {
        const element = document.getElementById(`milestone-${milestoneId}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {status}
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pending
          </Badge>
        )
      case "delayed":
      case "changes-requested":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {status}
          </Badge>
        )
      case "planning":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Planning
          </Badge>
        )
      case "development":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            Development
          </Badge>
        )
      case "testing":
        return (
          <Badge variant="outline" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
            Testing
          </Badge>
        )
      case "review":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Review
          </Badge>
        )
      case "on-hold":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            On Hold
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Paid
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <GitCommit className="h-4 w-4 text-blue-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "delayed":
      case "changes-requested":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const dismissMilestoneNotification = (id: string) => {
    setMilestoneNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const dismissScheduledPaymentNotification = (id: string) => {
    setScheduledPaymentNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const dismissPaymentNotification = (id: string) => {
    setPaymentNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const handlePaymentFromNotification = (projectId: string, milestoneId: string) => {
    // Implement your payment logic here
    console.log(`Payment initiated for project ${projectId}, milestone ${milestoneId}`)
    // After successful payment, you can update the payment status and remove the notification
    dismissPaymentNotification(milestoneId)
  }

  const handlePurchaseAddOn = (addOnId: string) => {
    onPurchaseAddOn(addOnId)
  }

  const MilestoneNotification = ({
    type,
    milestoneTitle,
    timestamp,
    onDismiss,
  }: {
    type: string
    milestoneTitle: string
    timestamp: string
    onDismiss: () => void
  }) => (
    <div className="flex items-center justify-between p-4 bg-blue-50 border rounded-md">
      <div>
        <p className="text-sm">
          Milestone <span className="font-semibold">{milestoneTitle}</span> was {type} on {timestamp}.
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={onDismiss}>
        Dismiss
      </Button>
    </div>
  )

  const ScheduledPaymentNotification = ({
    projectName,
    milestoneName,
    amount,
    currency,
    scheduledDate,
    onDismiss,
  }: {
    projectName: string
    milestoneName: string
    amount: number
    currency: string
    scheduledDate: string
    onDismiss: () => void
  }) => (
    <div className="flex items-center justify-between p-4 bg-yellow-50 border rounded-md">
      <div>
        <p className="text-sm">
          Scheduled payment for <span className="font-semibold">{milestoneName}</span> in project{" "}
          <span className="font-semibold">{projectName}</span> of {amount} {currency} is due on {scheduledDate}.
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={onDismiss}>
        Dismiss
      </Button>
    </div>
  )

  const MilestonePaymentNotification = ({
    projectName,
    milestoneName,
    amount,
    currency,
    onDismiss,
    onPay,
  }: {
    projectName: string
    milestoneName: string
    amount: number
    currency: string
    onDismiss: () => void
    onPay: () => void
  }) => (
    <div className="flex items-center justify-between p-4 bg-green-50 border rounded-md">
      <div>
        <p className="text-sm">
          Payment for <span className="font-semibold">{milestoneName}</span> in project{" "}
          <span className="font-semibold">{projectName}</span> of {amount} {currency} is due.
        </p>
      </div>
      <div>
        <Button variant="ghost" size="sm" onClick={onDismiss} className="mr-2">
          Dismiss
        </Button>
        <Button size="sm" onClick={onPay}>
          Pay Now
        </Button>
      </div>
    </div>
  )

  // Calculate the critical path for milestone badges
  const criticalPath = calculateCriticalPath(project.milestones)

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
              currency={currency}
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
              onDismiss={() => dismissPaymentNotification(notification.id)}
              onPay={() => handlePaymentFromNotification(notification.projectId, notification.milestoneId)}
            />
          ))}
        </div>
      )}

      <Card className="bg-card border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <CardDescription className="mt-1">{project.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(project.status)}
              <RiskNotificationCenter milestones={project.milestones} onViewMilestone={handleViewMilestone} />
              <MilestonePaymentHistory projectName={project.name} milestones={project.milestones} />
              <Button variant="outline" size="sm" onClick={() => setMilestoneComparisonOpen(true)}>
                Compare Milestones
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Started: {format(new Date(project.startDate), "MMM d, yyyy")}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  Est. Completion: {format(new Date(project.estimatedEndDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Team:</span>
                <div className="flex -space-x-2">
                  {project.team.map((member) => (
                    <Avatar key={member.id} className="border-2 border-background w-6 h-6">
                      <AvatarImage src={member.avatar || `/placeholder.svg?height=24&width=24&query=person`} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add the Risk Metrics component */}
      <RiskMetrics milestones={project.milestones} />

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-muted space-y-8">
                {project.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative">
                    <div className="absolute -left-[25px] p-1 bg-background border-2 border-muted rounded-full">
                      {getStatusIcon(milestone.status)}
                    </div>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{milestone.title}</h4>
                          {criticalPath.has(milestone.id) && (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800">
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                              Critical Path
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(milestone.status)}
                          {(milestone.status === "completed" ||
                            milestone.status === "approved" ||
                            milestone.status === "changes-requested") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => openMilestoneApprovalDialog(milestone)}
                            >
                              Review
                            </Button>
                          )}
                          {milestone.status === "approved" && milestone.paymentStatus !== "paid" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => openMilestonePaymentDialog(milestone)}
                            >
                              Pay
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Due: {format(new Date(milestone.dueDate), "MMM d, yyyy")}</span>
                        {milestone.completedDate && (
                          <>
                            <span>•</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>Completed: {format(new Date(milestone.completedDate), "MMM d, yyyy")}</span>
                          </>
                        )}
                      </div>
                      {milestone.status !== "approved" && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{milestone.progress}%</span>
                          </div>
                          <Progress value={milestone.progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-4">
                    {project.comments.slice(0, 3).map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={comment.author.avatar || `/placeholder.svg?height=32&width=32&query=person`}
                          />
                          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.timestamp), "MMM d, h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("comments")}>
                  View All Comments
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.team.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || `/placeholder.svg?height=40&width=40&query=person`} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
              <CardDescription>Track the progress of your project milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} id={`milestone-${milestone.id}`} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{milestone.title}</h3>
                        {criticalPath.has(milestone.id) && (
                          <Badge variant="outline" className="bg-orange-100 text-orange-800">
                            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                            Critical Path
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(milestone.status)}
                        {(milestone.status === "completed" ||
                          milestone.status === "approved" ||
                          milestone.status === "changes-requested") && (
                          <Button variant="outline" size="sm" onClick={() => openMilestoneApprovalDialog(milestone)}>
                            Review
                          </Button>
                        )}
                        {milestone.status === "approved" && milestone.paymentStatus !== "paid" && (
                          <Button variant="outline" size="sm" onClick={() => openMilestonePaymentDialog(milestone)}>
                            Pay
                          </Button>
                        )}
                        {/* Add this button */}
                        <Button variant="outline" size="sm" onClick={() => openDependenciesDialog(milestone)}>
                          <Link2 className="h-4 w-4 mr-2" />
                          Dependencies
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    {/* Add this section for dependencies */}
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Dependencies:</div>
                      <MilestoneDependencyInfo milestone={milestone} allMilestones={project.milestones} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Due: {format(new Date(milestone.dueDate), "MMM d, yyyy")}</span>
                      </div>
                      {milestone.completedDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          <span>Completed: {format(new Date(milestone.completedDate), "MMM d, yyyy")}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-1.5" />
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add this new TabsContent after the "milestones" tab */}
        <TabsContent value="dependencies" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Milestone Dependencies</CardTitle>
                  <CardDescription>Visualize and manage dependencies between project milestones</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Show Critical Path</span>
                  <Switch
                    checked={showCriticalPath}
                    onCheckedChange={setShowCriticalPath}
                    aria-label="Toggle critical path"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DependencyGraph milestones={project.milestones} showCriticalPath={showCriticalPath} />
            </CardContent>
          </Card>

          {/* Add the Critical Path Analysis component */}
          <CriticalPathAnalysis milestones={project.milestones} />
        </TabsContent>

        {/* Add the new Risks tab */}
        <TabsContent value="risks" className="mt-0 space-y-4">
          <CriticalPathAlerts milestones={project.milestones} onTakeAction={handleRiskAction} />
        </TabsContent>

        <TabsContent value="comments" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Project Communication</CardTitle>
              <CardDescription>Communicate with your development team</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {project.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`flex gap-3 ${comment.isFromTeam ? "justify-start" : "justify-end flex-row-reverse"}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={comment.author.avatar || `/placeholder.svg?height=32&width=32&query=person`}
                        />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`space-y-1 max-w-[80%] p-3 rounded-lg ${
                          comment.isFromTeam ? "bg-muted" : "bg-primary/10 dark:bg-primary/20 text-primary-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.author.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.timestamp), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder="Type your message here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button className="self-end" onClick={handleCommentSubmit}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
              <CardDescription>Access and download project files and deliverables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {file.type} • {file.size} • Uploaded {format(new Date(file.uploadedAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="addons" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Available Add-ons</CardTitle>
              <CardDescription>Enhance your app with additional features and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.addOns.map((addon) => (
                  <Card key={addon.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{addon.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">{addon.description}</p>
                      <div className="mt-2 font-medium">{addon.price} ECE</div>
                    </CardContent>
                    <CardFooter>
                      {addon.installed ? (
                        <Button variant="outline" className="w-full" disabled>
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          Installed
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={() => handlePurchaseAddOn(addon.id)}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Purchase
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <MilestoneApprovalDialog
        milestone={selectedMilestone}
        open={milestoneApprovalDialogOpen}
        onOpenChange={setMilestoneApprovalDialogOpen}
        onApprove={onApproveMilestone}
        onRequestChanges={onRequestMilestoneChanges}
      />
      <MilestonePaymentDialog
        milestone={selectedMilestone}
        projectName={project.name}
        currency={currency}
        onOpenChange={setMilestonePaymentDialogOpen}
        onPaymentComplete={onMilestonePayment}
      />
      <MilestoneComparison
        milestones={project.milestones}
        open={milestoneComparisonOpen}
        onOpenChange={setMilestoneComparisonOpen}
      />
      <MilestoneDependencies
        milestone={selectedMilestone}
        allMilestones={project.milestones}
        open={milestoneDependenciesDialogOpen}
        onOpenChange={setMilestoneDependenciesDialogOpen}
        onSave={onUpdateDependencies}
      />
      <RiskActionDialog
        milestone={selectedRiskMilestone}
        open={riskActionDialogOpen}
        onOpenChange={setRiskActionDialogOpen}
        onAction={processRiskAction}
      />
    </div>
  )
}

// Helper function to calculate the critical path
function calculateCriticalPath(milestones: ProjectMilestone[]): Set<string> {
  const criticalPath = new Set<string>()

  // This is a simplified implementation - in a real app, this would use the same algorithm as the graph
  // For this demo, we'll identify milestones that form the longest path through the dependency graph

  // Find milestones with no dependencies (starting points)
  const startMilestones = milestones.filter((m) => !m.dependencies || m.dependencies.length === 0)

  // Find milestones with no dependents (end points)
  const endMilestones = milestones.filter((m) => {
    return !milestones.some((other) => other.dependencies?.includes(m.id))
  })

  // For each possible path from start to end, calculate the total duration
  let longestPathLength = 0
  let longestPath: string[] = []

  // Helper function to find all paths
  const findPaths = (currentId: string, path: string[], visited: Set<string>) => {
    // Add current milestone to path and visited set
    path.push(currentId)
    visited.add(currentId)

    // Check if we've reached an end milestone
    const isEndMilestone = endMilestones.some((m) => m.id === currentId)
    if (isEndMilestone) {
      // Check if this is the longest path so far
      if (path.length > longestPathLength) {
        longestPathLength = path.length
        longestPath = [...path]
      }
    }

    // Find all milestones that depend on the current one
    const dependents = milestones.filter((m) => m.dependencies?.includes(currentId) && !visited.has(m.id))

    // Recursively explore all dependents
    for (const dependent of dependents) {
      findPaths(dependent.id, [...path], new Set(visited))
    }
  }

  // Start path finding from each start milestone
  for (const start of startMilestones) {
    findPaths(start.id, [], new Set())
  }

  // Add all milestones in the longest path to the critical path set
  longestPath.forEach((id) => criticalPath.add(id))

  return criticalPath
}
