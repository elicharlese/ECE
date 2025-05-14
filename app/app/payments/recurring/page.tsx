"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecurringPaymentForm } from "@/components/payments/recurring-payment-form"
import { RecurringPaymentHistory } from "@/components/payments/recurring-payment-history"
import { UpcomingPayments } from "@/components/payments/upcoming-payments"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "@/lib/demo-context"
import { Plus } from "lucide-react"

// Mock data for demo mode
const mockRecurringPayments = [
  {
    id: "rp1",
    title: "Cloud Server Subscription",
    amount: 49.99,
    category: "Operational Expense",
    description: "Monthly payment for cloud server infrastructure",
    frequency: "monthly",
    startDate: new Date(2023, 0, 15).toISOString(),
    endDate: null,
    isActive: true,
    nextPaymentDate: new Date(2023, 5, 15).toISOString(),
    lastPaymentDate: new Date(2023, 4, 15).toISOString(),
    createdAt: new Date(2022, 11, 10).toISOString(),
  },
  {
    id: "rp2",
    title: "Developer Tools License",
    amount: 199.99,
    category: "Capital Expense",
    description: "Annual license renewal for development tools",
    frequency: "annually",
    startDate: new Date(2023, 1, 5).toISOString(),
    endDate: new Date(2026, 1, 5).toISOString(),
    isActive: true,
    nextPaymentDate: new Date(2024, 1, 5).toISOString(),
    lastPaymentDate: new Date(2023, 1, 5).toISOString(),
    createdAt: new Date(2023, 1, 1).toISOString(),
  },
  {
    id: "rp3",
    title: "Marketing Platform",
    amount: 29.99,
    category: "Marketing Expense",
    description: "Bi-weekly payment for marketing automation platform",
    frequency: "biweekly",
    startDate: new Date(2023, 2, 10).toISOString(),
    endDate: null,
    isActive: false,
    nextPaymentDate: new Date(2023, 5, 19).toISOString(),
    lastPaymentDate: new Date(2023, 5, 5).toISOString(),
    createdAt: new Date(2023, 2, 8).toISOString(),
  },
]

// Generate upcoming payments based on recurring payments
const generateUpcomingPayments = (recurringPayments) => {
  const now = new Date()
  const twoMonthsLater = new Date()
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2)

  const upcomingPayments = []

  // Add recurring payments
  recurringPayments.forEach((payment) => {
    if (!payment.isActive) return

    let nextDate = new Date(payment.nextPaymentDate)
    while (nextDate <= twoMonthsLater) {
      upcomingPayments.push({
        id: `up-${payment.id}-${nextDate.getTime()}`,
        title: payment.title,
        amount: payment.amount,
        date: nextDate.toISOString(),
        isRecurring: true,
        frequency: payment.frequency,
      })

      // Calculate next date based on frequency
      switch (payment.frequency) {
        case "daily":
          nextDate = new Date(nextDate)
          nextDate.setDate(nextDate.getDate() + 1)
          break
        case "weekly":
          nextDate = new Date(nextDate)
          nextDate.setDate(nextDate.getDate() + 7)
          break
        case "biweekly":
          nextDate = new Date(nextDate)
          nextDate.setDate(nextDate.getDate() + 14)
          break
        case "monthly":
          nextDate = new Date(nextDate)
          nextDate.setMonth(nextDate.getMonth() + 1)
          break
        case "quarterly":
          nextDate = new Date(nextDate)
          nextDate.setMonth(nextDate.getMonth() + 3)
          break
        case "annually":
          nextDate = new Date(nextDate)
          nextDate.setFullYear(nextDate.getFullYear() + 1)
          break
      }

      // Check if we've passed the end date
      if (payment.endDate && nextDate > new Date(payment.endDate)) {
        break
      }
    }
  })

  // Add some one-time payments for demo
  upcomingPayments.push({
    id: "one-time-1",
    title: "Project Milestone Payment",
    amount: 500,
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3).toISOString(),
    isRecurring: false,
  })

  upcomingPayments.push({
    id: "one-time-2",
    title: "Conference Registration",
    amount: 299,
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10).toISOString(),
    isRecurring: false,
  })

  // Sort by date
  return upcomingPayments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export default function RecurringPaymentsPage() {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [recurringPayments, setRecurringPayments] = useState([])
  const [upcomingPayments, setUpcomingPayments] = useState([])

  useEffect(() => {
    const loadPayments = async () => {
      setIsLoading(true)
      try {
        if (isDemoMode) {
          // Load mock data for demo mode
          setRecurringPayments(mockRecurringPayments)
          setUpcomingPayments(generateUpcomingPayments(mockRecurringPayments))
        } else {
          // In a real app, you would fetch from your API
          // const response = await fetch('/api/payments/recurring')
          // const data = await response.json()
          // setRecurringPayments(data)

          // For now, use mock data for non-demo mode too
          setRecurringPayments(mockRecurringPayments)
          setUpcomingPayments(generateUpcomingPayments(mockRecurringPayments))
        }
      } catch (error) {
        console.error("Error loading recurring payments:", error)
        toast({
          title: "Error",
          description: "Failed to load recurring payments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPayments()
  }, [isDemoMode, toast])

  const handleCreatePayment = async (formData) => {
    setIsLoading(true)
    try {
      if (isDemoMode) {
        // Create a new payment with mock data
        const newPayment = {
          id: `rp${Date.now()}`,
          ...formData,
          nextPaymentDate: formData.startDate,
          lastPaymentDate: null,
          createdAt: new Date().toISOString(),
        }

        setRecurringPayments([newPayment, ...recurringPayments])
        setUpcomingPayments(generateUpcomingPayments([newPayment, ...recurringPayments]))

        toast({
          title: "Payment created",
          description: "Your recurring payment has been created successfully.",
        })
      } else {
        // In a real app, you would send to your API
        // const response = await fetch('/api/payments/recurring', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // })
        // const data = await response.json()

        // For now, simulate API response
        const newPayment = {
          id: `rp${Date.now()}`,
          ...formData,
          nextPaymentDate: formData.startDate,
          lastPaymentDate: null,
          createdAt: new Date().toISOString(),
        }

        setRecurringPayments([newPayment, ...recurringPayments])
        setUpcomingPayments(generateUpcomingPayments([newPayment, ...recurringPayments]))

        toast({
          title: "Payment created",
          description: "Your recurring payment has been created successfully.",
        })
      }

      setIsFormOpen(false)
    } catch (error) {
      console.error("Error creating recurring payment:", error)
      toast({
        title: "Error",
        description: "Failed to create recurring payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePayment = async (formData) => {
    if (!selectedPayment) return

    setIsLoading(true)
    try {
      if (isDemoMode) {
        // Update the payment in mock data
        const updatedPayments = recurringPayments.map((payment) =>
          payment.id === selectedPayment.id
            ? {
                ...payment,
                ...formData,
                // Keep the next payment date logic consistent
                nextPaymentDate:
                  formData.startDate > payment.nextPaymentDate ? formData.startDate : payment.nextPaymentDate,
              }
            : payment,
        )

        setRecurringPayments(updatedPayments)
        setUpcomingPayments(generateUpcomingPayments(updatedPayments))

        toast({
          title: "Payment updated",
          description: "Your recurring payment has been updated successfully.",
        })
      } else {
        // In a real app, you would send to your API
        // const response = await fetch(`/api/payments/recurring/${selectedPayment.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // })
        // const data = await response.json()

        // For now, simulate API response
        const updatedPayments = recurringPayments.map((payment) =>
          payment.id === selectedPayment.id
            ? {
                ...payment,
                ...formData,
                // Keep the next payment date logic consistent
                nextPaymentDate:
                  formData.startDate > payment.nextPaymentDate ? formData.startDate : payment.nextPaymentDate,
              }
            : payment,
        )

        setRecurringPayments(updatedPayments)
        setUpcomingPayments(generateUpcomingPayments(updatedPayments))

        toast({
          title: "Payment updated",
          description: "Your recurring payment has been updated successfully.",
        })
      }

      setIsFormOpen(false)
      setSelectedPayment(null)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating recurring payment:", error)
      toast({
        title: "Error",
        description: "Failed to update recurring payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePayment = async (id) => {
    setIsLoading(true)
    try {
      if (isDemoMode) {
        // Delete the payment from mock data
        const updatedPayments = recurringPayments.filter((payment) => payment.id !== id)
        setRecurringPayments(updatedPayments)
        setUpcomingPayments(generateUpcomingPayments(updatedPayments))
      } else {
        // In a real app, you would send to your API
        // await fetch(`/api/payments/recurring/${id}`, {
        //   method: 'DELETE',
        // })

        // For now, simulate API response
        const updatedPayments = recurringPayments.filter((payment) => payment.id !== id)
        setRecurringPayments(updatedPayments)
        setUpcomingPayments(generateUpcomingPayments(updatedPayments))
      }
    } catch (error) {
      console.error("Error deleting recurring payment:", error)
      toast({
        title: "Error",
        description: "Failed to delete recurring payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (id, isActive) => {
    setIsLoading(true)
    try {
      if (isDemoMode) {
        // Toggle active status in mock data
        const updatedPayments = recurringPayments.map((payment) =>
          payment.id === id ? { ...payment, isActive } : payment,
        )

        setRecurringPayments(updatedPayments)
        setUpcomingPayments(generateUpcomingPayments(updatedPayments))
      } else {
        // In a real app, you would send to your API
        // await fetch(`/api/payments/recurring/${id}/toggle`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ isActive }),
        // })

        // For now, simulate API response
        const updatedPayments = recurringPayments.map((payment) =>
          payment.id === id ? { ...payment, isActive } : payment,
        )

        setRecurringPayments(updatedPayments)
        setUpcomingPayments(generateUpcomingPayments(updatedPayments))
      }
    } catch (error) {
      console.error("Error toggling recurring payment status:", error)
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recurring Payments</h2>
          <p className="text-muted-foreground mt-1">Manage your recurring payments and subscriptions</p>
        </div>
        <Button
          onClick={() => {
            setIsFormOpen(true)
            setIsEditing(false)
            setSelectedPayment(null)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Recurring Payment
        </Button>
      </div>

      {isFormOpen ? (
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? "Edit Recurring Payment" : "Create Recurring Payment"}
          </h3>
          <RecurringPaymentForm
            onSubmit={isEditing ? handleUpdatePayment : handleCreatePayment}
            onCancel={() => {
              setIsFormOpen(false)
              setIsEditing(false)
              setSelectedPayment(null)
            }}
            isLoading={isLoading}
            initialData={selectedPayment}
            isEditing={isEditing}
          />
        </div>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Payments</TabsTrigger>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6">
            <RecurringPaymentHistory
              payments={recurringPayments.filter((p) => p.isActive)}
              onEdit={handleEditPayment}
              onDelete={handleDeletePayment}
              onToggleActive={handleToggleActive}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="all" className="mt-6">
            <RecurringPaymentHistory
              payments={recurringPayments}
              onEdit={handleEditPayment}
              onDelete={handleDeletePayment}
              onToggleActive={handleToggleActive}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="upcoming" className="mt-6">
            <UpcomingPayments payments={upcomingPayments} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
