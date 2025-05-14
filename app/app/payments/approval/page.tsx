"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/lib/wallet-context"
import { useDemo } from "@/lib/demo-context"
import { PaymentApprovalList } from "@/components/payments/payment-approval-list"
import { PaymentRequestForm } from "@/components/payments/payment-request-form"
import { PaymentApprovalDetails } from "@/components/payments/payment-approval-details"
import { PaymentApprovalHistory } from "@/components/payments/payment-approval-history"
import { PaymentApprovalStats } from "@/components/payments/payment-approval-stats"
import { PaymentApprovalFlow } from "@/components/payments/payment-approval-flow"
import { PaymentApprovalNotification } from "@/components/payments/payment-approval-notification"
import { FileText, CheckCircle2, XCircle, Clock, Filter, Search, Plus, RefreshCw, DollarSign } from "lucide-react"

export default function PaymentApprovalPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { isDemoMode } = useDemo()
  const { balance, currency } = useWallet()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  // Demo data for payment requests
  const paymentRequests = [
    {
      id: "pay-001",
      title: "Project Milestone Payment",
      amount: 2500,
      currency: "ECE",
      requestedBy: {
        id: "user-1",
        name: "Alex Johnson",
        avatar: "/diverse-person.png",
        role: "Project Manager",
      },
      createdAt: "2023-11-15T10:30:00Z",
      dueDate: "2023-11-25T23:59:59Z",
      status: "pending",
      description: "Payment for the completion of the frontend development milestone for the ECE Mobile App project.",
      category: "Project Payment",
      approvalFlow: [
        {
          level: 1,
          approver: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
            role: "Team Lead",
          },
          status: "approved",
          timestamp: "2023-11-16T14:20:00Z",
          comments: "Work completed as specified. Approved.",
        },
        {
          level: 2,
          approver: {
            id: "user-3",
            name: "Michael Rodriguez",
            avatar: "/diverse-group-outdoors.png",
            role: "Department Head",
          },
          status: "pending",
          timestamp: null,
          comments: null,
        },
        {
          level: 3,
          approver: {
            id: "user-4",
            name: "Emily Wong",
            avatar: "/diverse-group-four.png",
            role: "Finance Director",
          },
          status: "pending",
          timestamp: null,
          comments: null,
        },
      ],
      attachments: [
        {
          id: "att-001",
          name: "Milestone_Completion_Report.pdf",
          type: "application/pdf",
          size: "2.4 MB",
          url: "#",
        },
        {
          id: "att-002",
          name: "Invoice_ECE_Mobile_App.pdf",
          type: "application/pdf",
          size: "1.2 MB",
          url: "#",
        },
      ],
      history: [
        {
          action: "created",
          timestamp: "2023-11-15T10:30:00Z",
          user: {
            id: "user-1",
            name: "Alex Johnson",
            avatar: "/diverse-person.png",
          },
          details: "Payment request created",
        },
        {
          action: "approved",
          timestamp: "2023-11-16T14:20:00Z",
          user: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
          },
          details: "Approved at level 1",
        },
      ],
    },
    {
      id: "pay-002",
      title: "Software License Renewal",
      amount: 1200,
      currency: "ECE",
      requestedBy: {
        id: "user-5",
        name: "David Kim",
        avatar: "/diverse-group-five.png",
        role: "IT Manager",
      },
      createdAt: "2023-11-14T09:15:00Z",
      dueDate: "2023-11-20T23:59:59Z",
      status: "approved",
      description: "Annual renewal for development tools and software licenses.",
      category: "Operational Expense",
      approvalFlow: [
        {
          level: 1,
          approver: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
            role: "Team Lead",
          },
          status: "approved",
          timestamp: "2023-11-14T11:30:00Z",
          comments: "Essential tools for the team.",
        },
        {
          level: 2,
          approver: {
            id: "user-3",
            name: "Michael Rodriguez",
            avatar: "/diverse-group-outdoors.png",
            role: "Department Head",
          },
          status: "approved",
          timestamp: "2023-11-15T10:45:00Z",
          comments: "Approved as per annual budget.",
        },
        {
          level: 3,
          approver: {
            id: "user-4",
            name: "Emily Wong",
            avatar: "/diverse-group-four.png",
            role: "Finance Director",
          },
          status: "approved",
          timestamp: "2023-11-16T09:20:00Z",
          comments: "Final approval granted.",
        },
      ],
      attachments: [
        {
          id: "att-003",
          name: "License_Invoice_2023.pdf",
          type: "application/pdf",
          size: "1.8 MB",
          url: "#",
        },
      ],
      history: [
        {
          action: "created",
          timestamp: "2023-11-14T09:15:00Z",
          user: {
            id: "user-5",
            name: "David Kim",
            avatar: "/diverse-group-five.png",
          },
          details: "Payment request created",
        },
        {
          action: "approved",
          timestamp: "2023-11-14T11:30:00Z",
          user: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
          },
          details: "Approved at level 1",
        },
        {
          action: "approved",
          timestamp: "2023-11-15T10:45:00Z",
          user: {
            id: "user-3",
            name: "Michael Rodriguez",
            avatar: "/diverse-group-outdoors.png",
          },
          details: "Approved at level 2",
        },
        {
          action: "approved",
          timestamp: "2023-11-16T09:20:00Z",
          user: {
            id: "user-4",
            name: "Emily Wong",
            avatar: "/diverse-group-four.png",
          },
          details: "Approved at level 3",
        },
        {
          action: "completed",
          timestamp: "2023-11-16T09:25:00Z",
          user: {
            id: "system",
            name: "System",
            avatar: "",
          },
          details: "Payment processed automatically",
        },
      ],
    },
    {
      id: "pay-003",
      title: "Marketing Campaign Expense",
      amount: 3500,
      currency: "ECE",
      requestedBy: {
        id: "user-6",
        name: "Emma Wilson",
        avatar: "/diverse-group-six.png",
        role: "Marketing Manager",
      },
      createdAt: "2023-11-10T14:45:00Z",
      dueDate: "2023-11-18T23:59:59Z",
      status: "rejected",
      description: "Expenses for the Q4 digital marketing campaign across social media platforms.",
      category: "Marketing Expense",
      approvalFlow: [
        {
          level: 1,
          approver: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
            role: "Team Lead",
          },
          status: "approved",
          timestamp: "2023-11-11T09:30:00Z",
          comments: "Campaign aligns with Q4 goals.",
        },
        {
          level: 2,
          approver: {
            id: "user-3",
            name: "Michael Rodriguez",
            avatar: "/diverse-group-outdoors.png",
            role: "Department Head",
          },
          status: "rejected",
          timestamp: "2023-11-12T11:15:00Z",
          comments: "Budget exceeds quarterly allocation. Please revise and resubmit with a more detailed breakdown.",
        },
        {
          level: 3,
          approver: {
            id: "user-4",
            name: "Emily Wong",
            avatar: "/diverse-group-four.png",
            role: "Finance Director",
          },
          status: "pending",
          timestamp: null,
          comments: null,
        },
      ],
      attachments: [
        {
          id: "att-004",
          name: "Marketing_Campaign_Plan.pdf",
          type: "application/pdf",
          size: "3.2 MB",
          url: "#",
        },
        {
          id: "att-005",
          name: "Campaign_Budget.xlsx",
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: "1.5 MB",
          url: "#",
        },
      ],
      history: [
        {
          action: "created",
          timestamp: "2023-11-10T14:45:00Z",
          user: {
            id: "user-6",
            name: "Emma Wilson",
            avatar: "/diverse-group-six.png",
          },
          details: "Payment request created",
        },
        {
          action: "approved",
          timestamp: "2023-11-11T09:30:00Z",
          user: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
          },
          details: "Approved at level 1",
        },
        {
          action: "rejected",
          timestamp: "2023-11-12T11:15:00Z",
          user: {
            id: "user-3",
            name: "Michael Rodriguez",
            avatar: "/diverse-group-outdoors.png",
          },
          details: "Rejected at level 2: Budget exceeds quarterly allocation",
        },
      ],
    },
    {
      id: "pay-004",
      title: "Hardware Purchase",
      amount: 4200,
      currency: "ECE",
      requestedBy: {
        id: "user-5",
        name: "David Kim",
        avatar: "/diverse-group-five.png",
        role: "IT Manager",
      },
      createdAt: "2023-11-08T10:00:00Z",
      dueDate: "2023-11-22T23:59:59Z",
      status: "pending",
      description: "Purchase of new development workstations for the engineering team.",
      category: "Capital Expense",
      approvalFlow: [
        {
          level: 1,
          approver: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
            role: "Team Lead",
          },
          status: "approved",
          timestamp: "2023-11-09T14:20:00Z",
          comments: "Hardware upgrade is necessary for the team.",
        },
        {
          level: 2,
          approver: {
            id: "user-3",
            name: "Michael Rodriguez",
            avatar: "/diverse-group-outdoors.png",
            role: "Department Head",
          },
          status: "approved",
          timestamp: "2023-11-10T11:30:00Z",
          comments: "Approved as per annual equipment refresh plan.",
        },
        {
          level: 3,
          approver: {
            id: "user-4",
            name: "Emily Wong",
            avatar: "/diverse-group-four.png",
            role: "Finance Director",
          },
          status: "pending",
          timestamp: null,
          comments: null,
        },
      ],
      attachments: [
        {
          id: "att-006",
          name: "Hardware_Quotation.pdf",
          type: "application/pdf",
          size: "1.7 MB",
          url: "#",
        },
        {
          id: "att-007",
          name: "Equipment_Specifications.pdf",
          type: "application/pdf",
          size: "2.3 MB",
          url: "#",
        },
      ],
      history: [
        {
          action: "created",
          timestamp: "2023-11-08T10:00:00Z",
          user: {
            id: "user-5",
            name: "David Kim",
            avatar: "/diverse-group-five.png",
          },
          details: "Payment request created",
        },
        {
          action: "approved",
          timestamp: "2023-11-09T14:20:00Z",
          user: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
          },
          details: "Approved at level 1",
        },
        {
          action: "approved",
          timestamp: "2023-11-10T11:30:00Z",
          user: {
            id: "user-3",
            name: "Michael Rodriguez",
            avatar: "/diverse-group-outdoors.png",
          },
          details: "Approved at level 2",
        },
      ],
    },
    {
      id: "pay-005",
      title: "Conference Registration Fees",
      amount: 1800,
      currency: "ECE",
      requestedBy: {
        id: "user-7",
        name: "Priya Patel",
        avatar: "/diverse-group-four.png",
        role: "Senior Developer",
      },
      createdAt: "2023-11-05T11:30:00Z",
      dueDate: "2023-11-15T23:59:59Z",
      status: "approved",
      description: "Registration fees for the team to attend the annual blockchain development conference.",
      category: "Training & Development",
      approvalFlow: [
        {
          level: 1,
          approver: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
            role: "Team Lead",
          },
          status: "approved",
          timestamp: "2023-11-06T09:45:00Z",
          comments: "Valuable learning opportunity for the team.",
        },
        {
          level: 2,
          approver: {
            id: "user-3",
            name: "Michael Rodriguez",
            avatar: "/diverse-group-outdoors.png",
            role: "Department Head",
          },
          status: "approved",
          timestamp: "2023-11-07T14:20:00Z",
          comments: "Approved as per training budget.",
        },
        {
          level: 3,
          approver: {
            id: "user-4",
            name: "Emily Wong",
            avatar: "/diverse-group-four.png",
            role: "Finance Director",
          },
          status: "approved",
          timestamp: "2023-11-08T10:15:00Z",
          comments: "Final approval granted.",
        },
      ],
      attachments: [
        {
          id: "att-008",
          name: "Conference_Details.pdf",
          type: "application/pdf",
          size: "1.2 MB",
          url: "#",
        },
        {
          id: "att-009",
          name: "Registration_Invoice.pdf",
          type: "application/pdf",
          size: "0.8 MB",
          url: "#",
        },
      ],
      history: [
        {
          action: "created",
          timestamp: "2023-11-05T11:30:00Z",
          user: {
            id: "user-7",
            name: "Priya Patel",
            avatar: "/diverse-group-four.png",
          },
          details: "Payment request created",
        },
        {
          action: "approved",
          timestamp: "2023-11-06T09:45:00Z",
          user: {
            id: "user-2",
            name: "Sarah Chen",
            avatar: "/diverse-group-two.png",
          },
          details: "Approved at level 1",
        },
        {
          action: "approved",
          timestamp: "2023-11-07T14:20:00Z",
          user: {
            id: "user-3",
            name: "Michael Rodriguez",
            avatar: "/diverse-group-outdoors.png",
          },
          details: "Approved at level 2",
        },
        {
          action: "approved",
          timestamp: "2023-11-08T10:15:00Z",
          user: {
            id: "user-4",
            name: "Emily Wong",
            avatar: "/diverse-group-four.png",
          },
          details: "Approved at level 3",
        },
        {
          action: "completed",
          timestamp: "2023-11-08T10:20:00Z",
          user: {
            id: "system",
            name: "System",
            avatar: "",
          },
          details: "Payment processed automatically",
        },
      ],
    },
  ]

  // Filter payments based on status and search query
  const filteredPayments = paymentRequests.filter((payment) => {
    // Filter by status tab
    if (activeTab === "all" || payment.status === activeTab) {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          payment.title.toLowerCase().includes(query) ||
          payment.description.toLowerCase().includes(query) ||
          payment.requestedBy.name.toLowerCase().includes(query) ||
          payment.category.toLowerCase().includes(query)
        )
      }
      return true
    }
    return false
  })

  // Get the selected payment details
  const selectedPayment = paymentRequests.find((p) => p.id === selectedPaymentId)

  // Handle payment approval
  const handleApprovePayment = (paymentId: string, level: number, comments: string) => {
    setIsLoading(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "Payment Approved",
        description: "The payment request has been approved successfully.",
      })
      setIsLoading(false)
      // Refresh the data or update the local state
      // In a real app, you would fetch the updated data from the API
    }, 1000)
  }

  // Handle payment rejection
  const handleRejectPayment = (paymentId: string, level: number, comments: string) => {
    setIsLoading(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "Payment Rejected",
        description: "The payment request has been rejected.",
        variant: "destructive",
      })
      setIsLoading(false)
      // Refresh the data or update the local state
      // In a real app, you would fetch the updated data from the API
    }, 1000)
  }

  // Handle new payment request submission
  const handleSubmitPaymentRequest = (formData: any) => {
    setIsLoading(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "Payment Request Submitted",
        description: "Your payment request has been submitted for approval.",
      })
      setIsLoading(false)
      setShowNewRequestForm(false)
      // Refresh the data or update the local state
      // In a real app, you would fetch the updated data from the API
    }, 1000)
  }

  // Calculate statistics
  const stats = {
    totalRequests: paymentRequests.length,
    pendingApproval: paymentRequests.filter((p) => p.status === "pending").length,
    approved: paymentRequests.filter((p) => p.status === "approved").length,
    rejected: paymentRequests.filter((p) => p.status === "rejected").length,
    totalAmount: paymentRequests.reduce((sum, p) => sum + p.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="space-y-2">
        {paymentRequests
          .filter((p) => p.status === "pending" && p.approvalFlow.some((a) => a.status === "pending"))
          .slice(0, 2)
          .map((payment) => (
            <PaymentApprovalNotification
              key={payment.id}
              payment={payment}
              onView={() => {
                setSelectedPaymentId(payment.id)
                setActiveTab("pending")
              }}
            />
          ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Approval Workflow</h2>
          <p className="text-muted-foreground mt-1">Manage and track payment requests and approvals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowNewRequestForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalRequests}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <h3 className="text-2xl font-bold mt-1">{stats.pendingApproval}</h3>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                <Clock className="h-5 w-5 text-yellow-500 dark:text-yellow-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <h3 className="text-2xl font-bold mt-1">{stats.approved}</h3>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <h3 className="text-2xl font-bold mt-1">
                  {stats.totalAmount} {currency}
                </h3>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-500 dark:text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showNewRequestForm ? (
        <Card>
          <CardHeader>
            <CardTitle>New Payment Request</CardTitle>
            <CardDescription>Submit a new payment request for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentRequestForm
              onSubmit={handleSubmitPaymentRequest}
              onCancel={() => setShowNewRequestForm(false)}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payment Requests</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Filter">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8 w-[180px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <PaymentApprovalList
                    payments={filteredPayments}
                    selectedPaymentId={selectedPaymentId}
                    onSelectPayment={setSelectedPaymentId}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedPayment ? (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedPayment.title}</CardTitle>
                      <CardDescription>
                        Request #{selectedPayment.id} • {selectedPayment.category}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        selectedPayment.status === "approved"
                          ? "outline"
                          : selectedPayment.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        selectedPayment.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : selectedPayment.status === "rejected"
                            ? ""
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }
                    >
                      {selectedPayment.status === "approved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {selectedPayment.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                      {selectedPayment.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <PaymentApprovalDetails
                    payment={selectedPayment}
                    onApprove={handleApprovePayment}
                    onReject={handleRejectPayment}
                    isLoading={isLoading}
                  />
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <div className="text-sm text-muted-foreground">
                    Requested by {selectedPayment.requestedBy.name} on{" "}
                    {new Date(selectedPayment.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedPaymentId(null)}>
                      Close
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-full flex flex-col justify-center items-center p-6">
                <div className="text-center space-y-4 max-w-md">
                  <div className="bg-muted rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium">No Payment Request Selected</h3>
                  <p className="text-muted-foreground">
                    Select a payment request from the list to view its details, or create a new payment request.
                  </p>
                  <Button onClick={() => setShowNewRequestForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Request
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Payment Approval Flow and History */}
      {!showNewRequestForm && selectedPayment && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Flow</CardTitle>
              <CardDescription>Current approval status and workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentApprovalFlow approvalFlow={selectedPayment.approvalFlow} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Audit trail of actions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentApprovalHistory history={selectedPayment.history} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Statistics */}
      {!showNewRequestForm && !selectedPayment && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Approval Statistics</CardTitle>
            <CardDescription>Overview of payment requests and approval metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentApprovalStats />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
