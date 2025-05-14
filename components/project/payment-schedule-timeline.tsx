"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, CreditCard, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentScheduleTimelineProps {
  paymentType: "invoice" | "escrow"
  paymentStructure: "milestone" | "onetime" | "hourly" | "fixed"
  startDate: Date
  endDate?: Date
  timeline: number // in weeks
  totalAmount: number
  currency?: string
  milestones?: Array<{
    name: string
    description?: string
    date: Date
    amount: number
  }>
  invoiceBilling?: {
    enabled: boolean
    frequency: "weekly" | "biweekly" | "monthly"
    fixedAmount: number
  }
  taxRate?: number
}

export function PaymentScheduleTimeline({
  paymentType,
  paymentStructure,
  startDate,
  endDate,
  timeline,
  totalAmount,
  currency = "ECE",
  milestones = [],
  invoiceBilling = { enabled: false, frequency: "monthly", fixedAmount: 0 },
  taxRate = 0,
}: PaymentScheduleTimelineProps) {
  const [view, setView] = useState<"timeline" | "calendar" | "list">("timeline")
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(startDate))

  // Calculate end date if not provided
  const calculatedEndDate = endDate || new Date(startDate.getTime() + timeline * 7 * 24 * 60 * 60 * 1000)

  // Generate payment schedule based on payment type and structure
  const generatePaymentSchedule = () => {
    const payments = []

    if (paymentType === "escrow") {
      if (paymentStructure === "onetime") {
        // One-time payment at the start
        payments.push({
          name: "Full Payment",
          description: "Complete project payment",
          date: new Date(startDate),
          amount: totalAmount,
          type: "escrow",
          status: "pending",
        })
      } else if (paymentStructure === "milestone") {
        // Use provided milestones or generate default ones
        if (milestones && milestones.length > 0) {
          milestones.forEach((milestone) => {
            payments.push({
              ...milestone,
              type: "milestone",
              status: "pending",
            })
          })
        } else {
          // Generate default milestones if none provided
          const milestoneCount = 3
          const milestoneInterval = timeline / milestoneCount

          for (let i = 0; i < milestoneCount; i++) {
            const milestoneDate = new Date(startDate.getTime() + i * milestoneInterval * 7 * 24 * 60 * 60 * 1000)
            const isLast = i === milestoneCount - 1

            payments.push({
              name: isLast ? "Final Milestone" : `Milestone ${i + 1}`,
              description: isLast ? "Project completion" : `Project milestone ${i + 1}`,
              date: milestoneDate,
              amount: isLast ? Math.round(totalAmount * 0.4) : Math.round(totalAmount * 0.3),
              type: "milestone",
              status: "pending",
            })
          }
        }
      }
    } else if (paymentType === "invoice") {
      if (paymentStructure === "fixed" && invoiceBilling?.enabled) {
        // Generate fixed payments based on frequency
        const { frequency, fixedAmount } = invoiceBilling
        let currentDate = new Date(startDate)
        let totalPaid = 0

        while (currentDate <= calculatedEndDate && totalPaid < totalAmount) {
          const remainingAmount = totalAmount - totalPaid
          const paymentAmount = Math.min(fixedAmount, remainingAmount)

          payments.push({
            name: `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Payment`,
            description: `Regular ${frequency} payment`,
            date: new Date(currentDate),
            amount: paymentAmount,
            type: "invoice",
            status: "pending",
          })

          totalPaid += paymentAmount

          // Advance to next payment date based on frequency
          if (frequency === "weekly") {
            currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
          } else if (frequency === "biweekly") {
            currentDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000)
          } else if (frequency === "monthly") {
            const newMonth = currentDate.getMonth() + 1
            currentDate = new Date(currentDate)
            currentDate.setMonth(newMonth)
          }
        }

        // Adjust last payment if needed
        if (totalPaid > totalAmount && payments.length > 0) {
          const lastPayment = payments[payments.length - 1]
          lastPayment.amount = lastPayment.amount - (totalPaid - totalAmount)
        }
      } else if (paymentStructure === "hourly") {
        // For hourly, we show estimated payments
        const weeklyEstimate = totalAmount / timeline

        for (let week = 0; week < timeline; week++) {
          const paymentDate = new Date(startDate.getTime() + week * 7 * 24 * 60 * 60 * 1000)

          payments.push({
            name: `Week ${week + 1} Hours`,
            description: "Payment for hours worked",
            date: paymentDate,
            amount: Math.round(weeklyEstimate),
            type: "hourly",
            status: "estimated",
          })
        }
      }
    }

    return payments.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const paymentSchedule = generatePaymentSchedule()

  // Calculate months between start and end date for the timeline
  const getMonthsBetween = (start: Date, end: Date) => {
    const months = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
      months.push(new Date(currentDate))
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    return months
  }

  const months = getMonthsBetween(startDate, calculatedEndDate)

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Format month for display
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Navigate between months in calendar view
  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  // Check if a date has a payment
  const getPaymentForDate = (date: Date) => {
    return paymentSchedule.find(
      (payment) =>
        payment.date.getDate() === date.getDate() &&
        payment.date.getMonth() === date.getMonth() &&
        payment.date.getFullYear() === date.getFullYear(),
    )
  }

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get first day of month and how many days in month
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay()

    // Generate array of day objects
    const days = []

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, isCurrentMonth: false })
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        payment: getPaymentForDate(date),
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Calculate total with tax
  const calculateTotalWithTax = (amount: number) => {
    return amount * (1 + taxRate / 100)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currency}`
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="payment-title">Payment Schedule</CardTitle>
            <CardDescription>Visualize your payment timeline</CardDescription>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-auto">
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="timeline" className="text-xs px-2">
                Timeline
              </TabsTrigger>
              <TabsTrigger value="calendar" className="text-xs px-2">
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list" className="text-xs px-2">
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TabsContent value="timeline" className="m-0">
          <div className="space-y-6">
            {/* Timeline visualization */}
            <div className="relative pt-6 pb-12">
              {/* Timeline line */}
              <div className="absolute top-10 left-0 right-0 h-1 bg-muted" />

              {/* Timeline months */}
              <div className="flex justify-between mb-6">
                {months.map((month, index) => (
                  <div key={index} className="text-xs text-muted-foreground font-medium">
                    {month.toLocaleDateString("en-US", { month: "short" })}
                  </div>
                ))}
              </div>

              {/* Timeline payments */}
              <div className="relative">
                {paymentSchedule.map((payment, index) => {
                  // Calculate position as percentage from start to end date
                  const startTime = startDate.getTime()
                  const endTime = calculatedEndDate.getTime()
                  const paymentTime = payment.date.getTime()

                  const position = ((paymentTime - startTime) / (endTime - startTime)) * 100

                  return (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute transform -translate-x-1/2" style={{ left: `${position}%` }}>
                            <div className="flex flex-col items-center">
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 border-background",
                                  payment.type === "milestone"
                                    ? "bg-blue-500"
                                    : payment.type === "escrow"
                                      ? "bg-green-500"
                                      : payment.type === "hourly"
                                        ? "bg-amber-500"
                                        : "bg-primary",
                                )}
                              />
                              <div className="h-8 w-px bg-muted-foreground/30 my-1" />
                              <div className="text-xs font-medium timeline-marker max-w-[80px] text-center truncate">
                                {payment.name}
                              </div>
                              <div className="text-xs payment-amount">{formatCurrency(payment.amount)}</div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{payment.name}</p>
                            <p className="text-xs payment-date">{formatDate(payment.date)}</p>
                            <p className="text-xs">{payment.description}</p>
                            <p className="font-medium">{formatCurrency(payment.amount)}</p>
                            {taxRate > 0 && (
                              <p className="text-xs text-muted-foreground">
                                With tax: {formatCurrency(calculateTotalWithTax(payment.amount))}
                              </p>
                            )}
                            <Badge
                              variant="outline"
                              className={cn(
                                "mt-1",
                                payment.status === "estimated" ? "text-amber-500 border-amber-200 bg-amber-50" : "",
                              )}
                            >
                              {payment.status === "estimated" ? "Estimated" : "Scheduled"}
                            </Badge>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </div>

            {/* Payment summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-cursive">{paymentSchedule.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paymentType === "escrow"
                      ? paymentStructure === "milestone"
                        ? "Milestone-based payments"
                        : "One-time payment"
                      : paymentStructure === "fixed"
                        ? `${invoiceBilling?.frequency} fixed payments`
                        : "Hourly-based payments"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Project Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-cursive">{timeline} weeks</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(startDate)} - {formatDate(calculatedEndDate)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-cursive">{formatCurrency(totalAmount)}</div>
                  {taxRate > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      With {taxRate}% tax: {formatCurrency(calculateTotalWithTax(totalAmount))}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Payment type info */}
            <div className="bg-muted/40 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {paymentType === "escrow" ? (
                    <CreditCard className="h-5 w-5 text-primary" />
                  ) : (
                    <Calendar className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium font-cursive">
                    {paymentType === "escrow" ? "Escrow Payments" : "Invoice Billing"}
                  </h4>
                  <p className="text-muted-foreground mt-1">
                    {paymentType === "escrow"
                      ? "Client pays upfront with funds held until milestone or project completion. Perfect for new relationships."
                      : "Client gets invoiced regularly, based on a fixed fee or hours worked. Ideal for existing relationships."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="m-0">
          <div className="space-y-6">
            {/* Month navigation */}
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <h3 className="text-base font-medium font-cursive">{formatMonth(currentMonth)}</h3>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Calendar grid */}
            <div className="rounded-lg border overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 bg-muted/50">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                  <div key={i} className="p-2 text-center text-xs font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 divide-x divide-y">
                {calendarDays.map((day, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-24 p-1 relative",
                      !day.isCurrentMonth && "bg-muted/20",
                      day.date && day.date.getTime() === new Date(startDate).setHours(0, 0, 0, 0) && "bg-primary/5",
                    )}
                  >
                    {day.date && (
                      <>
                        <div className="text-xs p-1">{day.date.getDate()}</div>

                        {day.payment && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "mt-1 p-1 rounded text-xs font-medium font-cursive truncate",
                                    day.payment.type === "milestone"
                                      ? "bg-blue-100 text-blue-800"
                                      : day.payment.type === "escrow"
                                        ? "bg-green-100 text-green-800"
                                        : day.payment.type === "hourly"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-primary/10 text-primary",
                                  )}
                                >
                                  {day.payment.name}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  <p className="font-medium">{day.payment.name}</p>
                                  <p className="text-xs">{day.payment.description}</p>
                                  <p className="font-medium">{formatCurrency(day.payment.amount)}</p>
                                  {taxRate > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                      With tax: {formatCurrency(calculateTotalWithTax(day.payment.amount))}
                                    </p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Milestone Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Escrow Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Fixed Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Hourly Payment</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="m-0">
          <div className="space-y-6">
            {/* Payment list */}
            <div className="rounded-lg border overflow-hidden">
              {/* List header */}
              <div className="grid grid-cols-4 bg-muted/50 p-3 text-xs font-medium">
                <div>Payment</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Type</div>
              </div>

              {/* List items */}
              <div className="divide-y">
                {paymentSchedule.length > 0 ? (
                  paymentSchedule.map((payment, index) => (
                    <div key={index} className="grid grid-cols-4 p-3 text-sm items-center">
                      <div>
                        <div className="font-medium font-cursive">{payment.name}</div>
                        <div className="text-xs text-muted-foreground">{payment.description}</div>
                      </div>
                      <div>{formatDate(payment.date)}</div>
                      <div>
                        <div>{formatCurrency(payment.amount)}</div>
                        {taxRate > 0 && (
                          <div className="text-xs text-muted-foreground">
                            With tax: {formatCurrency(calculateTotalWithTax(payment.amount))}
                          </div>
                        )}
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={cn(
                            payment.type === "milestone"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : payment.type === "escrow"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : payment.type === "hourly"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-primary/10",
                          )}
                        >
                          {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                          {payment.status === "estimated" && " (Est.)"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">No payments scheduled</div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Total</div>
                <div className="text-lg font-bold font-cursive">{formatCurrency(totalAmount)}</div>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between items-center mt-2 text-sm">
                  <div className="text-muted-foreground">With {taxRate}% tax</div>
                  <div>{formatCurrency(calculateTotalWithTax(totalAmount))}</div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  )
}
