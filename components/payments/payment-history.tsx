"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CheckCircle2, XCircle, Clock, Search, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

export function PaymentHistory() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Mock payment history data
  const paymentHistory = [
    {
      id: "pay-001",
      title: "Project Milestone Payment",
      amount: 2500,
      currency: "ECE",
      date: "2023-11-16T09:25:00Z",
      status: "completed",
      requestedBy: "Alex Johnson",
      approvedBy: "Emily Wong",
      category: "Project Payment",
    },
    {
      id: "pay-002",
      title: "Software License Renewal",
      amount: 1200,
      currency: "ECE",
      date: "2023-11-16T09:25:00Z",
      status: "completed",
      requestedBy: "David Kim",
      approvedBy: "Emily Wong",
      category: "Operational Expense",
    },
    {
      id: "pay-003",
      title: "Marketing Campaign Expense",
      amount: 3500,
      currency: "ECE",
      date: "2023-11-12T11:15:00Z",
      status: "rejected",
      requestedBy: "Emma Wilson",
      approvedBy: "Michael Rodriguez",
      category: "Marketing Expense",
    },
    {
      id: "pay-004",
      title: "Hardware Purchase",
      amount: 4200,
      currency: "ECE",
      date: "2023-11-10T11:30:00Z",
      status: "pending",
      requestedBy: "David Kim",
      approvedBy: null,
      category: "Capital Expense",
    },
    {
      id: "pay-005",
      title: "Conference Registration Fees",
      amount: 1800,
      currency: "ECE",
      date: "2023-11-08T10:20:00Z",
      status: "completed",
      requestedBy: "Priya Patel",
      approvedBy: "Emily Wong",
      category: "Training & Development",
    },
    {
      id: "pay-006",
      title: "Office Supplies",
      amount: 350,
      currency: "ECE",
      date: "2023-11-05T14:45:00Z",
      status: "completed",
      requestedBy: "Sarah Chen",
      approvedBy: "Michael Rodriguez",
      category: "Operational Expense",
    },
    {
      id: "pay-007",
      title: "Team Building Event",
      amount: 1200,
      currency: "ECE",
      date: "2023-11-03T09:30:00Z",
      status: "completed",
      requestedBy: "Alex Johnson",
      approvedBy: "Michael Rodriguez",
      category: "Team Development",
    },
    {
      id: "pay-008",
      title: "Cloud Infrastructure Services",
      amount: 2800,
      currency: "ECE",
      date: "2023-10-28T11:20:00Z",
      status: "completed",
      requestedBy: "David Kim",
      approvedBy: "Emily Wong",
      category: "Operational Expense",
    },
    {
      id: "pay-009",
      title: "Design Software Subscription",
      amount: 750,
      currency: "ECE",
      date: "2023-10-25T10:15:00Z",
      status: "completed",
      requestedBy: "Emma Wilson",
      approvedBy: "Michael Rodriguez",
      category: "Operational Expense",
    },
    {
      id: "pay-010",
      title: "Client Meeting Expenses",
      amount: 420,
      currency: "ECE",
      date: "2023-10-20T15:30:00Z",
      status: "completed",
      requestedBy: "Alex Johnson",
      approvedBy: "Sarah Chen",
      category: "Business Development",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View and filter your payment history</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select defaultValue="all">
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="h-8 pl-8 w-[150px] sm:w-[180px]" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-[25px_1fr_120px_120px_120px] sm:grid-cols-[25px_1fr_120px_120px_120px_120px] bg-muted/50 p-3 text-sm font-medium">
            <div className="flex items-center">
              <Checkbox id="select-all" />
            </div>
            <div>Payment</div>
            <div className="hidden sm:block">Category</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Date</div>
          </div>
          <div className="divide-y">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="grid grid-cols-[25px_1fr_120px_120px_120px] sm:grid-cols-[25px_1fr_120px_120px_120px_120px] p-3 text-sm items-center"
              >
                <div className="flex items-center">
                  <Checkbox id={`select-${payment.id}`} />
                </div>
                <div>
                  <div className="font-medium">{payment.title}</div>
                  <div className="text-xs text-muted-foreground">Requested by {payment.requestedBy}</div>
                </div>
                <div className="hidden sm:block text-xs">{payment.category}</div>
                <div className="font-medium">
                  {payment.amount} {payment.currency}
                </div>
                <div>{getStatusBadge(payment.status)}</div>
                <div className="text-xs">{format(new Date(payment.date), "MMM d, yyyy")}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Showing <strong>10</strong> of <strong>24</strong> payments
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
