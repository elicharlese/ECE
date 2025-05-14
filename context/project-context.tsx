"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/lib/wallet-context"

interface ScheduledPayment {
  id: string
  projectId: string
  projectName: string
  milestoneId: string
  milestoneName: string
  amount: number
  currency: string
  scheduledDate: string
  reminderDays: number
  status: "pending" | "processed" | "cancelled"
}

interface Milestone {
  id: string
  title: string
  description: string
  status: string
  paymentAmount?: number
  paymentStatus?: string
  paymentDate?: string
}

interface ProjectContextType {
  scheduledPayments: ScheduledPayment[]
  scheduleMilestonePayment: (
    milestoneId: string,
    scheduledDate: Date,
    reminderDays: number,
    projectId?: string,
    projectName?: string,
    milestoneName?: string,
    amount?: number,
  ) => Promise<void>
  cancelScheduledPayment: (paymentId: string) => Promise<void>
  processScheduledPayment: (paymentId: string) => Promise<void>
  payMilestone: (milestoneId: string) => Promise<void>
  updateMilestoneDependencies: (projectId: string, milestoneId: string, dependencies: string[]) => Promise<void>
}

const ProjectContext = createContext<ProjectContextType>({
  scheduledPayments: [],
  scheduleMilestonePayment: async () => {},
  cancelScheduledPayment: async () => {},
  processScheduledPayment: async () => {},
  payMilestone: async () => {},
  updateMilestoneDependencies: async () => {},
})

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const { withdrawFunds } = useWallet()
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([])

  // Load scheduled payments from localStorage on mount
  useEffect(() => {
    const savedPayments = localStorage.getItem("scheduledMilestonePayments")
    if (savedPayments) {
      try {
        setScheduledPayments(JSON.parse(savedPayments))
      } catch (error) {
        console.error("Error loading scheduled payments:", error)
      }
    }
  }, [])

  // Save scheduled payments to localStorage when they change
  useEffect(() => {
    localStorage.setItem("scheduledMilestonePayments", JSON.stringify(scheduledPayments))
  }, [scheduledPayments])

  // Check for payments that need reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()

      scheduledPayments.forEach((payment) => {
        if (payment.status !== "pending" || !payment.reminderDays) return

        const scheduledDate = new Date(payment.scheduledDate)
        const reminderDate = new Date(scheduledDate)
        reminderDate.setDate(reminderDate.getDate() - payment.reminderDays)

        // If today is the reminder date
        if (
          now.getDate() === reminderDate.getDate() &&
          now.getMonth() === reminderDate.getMonth() &&
          now.getFullYear() === reminderDate.getFullYear()
        ) {
          // Instead of showing a toast, we now add this to the notification system
          // The notification will appear in the notification popout
          const notificationData = {
            id: `payment-reminder-${payment.id}`,
            title: "Scheduled Payment Reminder",
            message: `Payment for milestone "${payment.milestoneName}" in project "${payment.projectName}" is scheduled for ${new Date(payment.scheduledDate).toLocaleDateString()}.`,
            date: new Date().toISOString(),
            read: false,
            type: "payment" as const,
            priority: "high" as const,
            avatar: "/images/projects/defi-protocol.png",
            link: "/app/scheduled-payments",
            actions: [
              { label: "View Details", link: "/app/scheduled-payments" },
              { label: "Process Now", link: `/app/scheduled-payments?process=${payment.id}` },
            ],
          }

          // Add to localStorage notifications
          const existingNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
          const notificationExists = existingNotifications.some((n: any) => n.id === notificationData.id)

          if (!notificationExists) {
            localStorage.setItem("notifications", JSON.stringify([notificationData, ...existingNotifications]))

            // Dispatch a custom event to notify the notification system
            window.dispatchEvent(new CustomEvent("new-notification", { detail: notificationData }))
          }
        }
      })
    }

    // Check immediately and then set up daily check
    checkReminders()
    const interval = setInterval(checkReminders, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [scheduledPayments])

  const scheduleMilestonePayment = async (
    milestoneId: string,
    scheduledDate: Date,
    reminderDays: number,
    projectId = "unknown",
    projectName = "Unknown Project",
    milestoneName = "Unknown Milestone",
    amount = 0,
  ) => {
    try {
      const newPayment: ScheduledPayment = {
        id: uuidv4(),
        projectId,
        projectName,
        milestoneId,
        milestoneName,
        amount,
        currency: "ECE",
        scheduledDate: scheduledDate.toISOString(),
        reminderDays,
        status: "pending",
      }

      setScheduledPayments((prev) => [...prev, newPayment])

      // Add a notification for the newly scheduled payment
      const notificationData = {
        id: `payment-scheduled-${newPayment.id}`,
        title: "Payment Scheduled",
        message: `You've scheduled a payment of ${amount} ECE for milestone "${milestoneName}" in project "${projectName}" on ${scheduledDate.toLocaleDateString()}.`,
        date: new Date().toISOString(),
        read: false,
        type: "payment" as const,
        priority: "medium" as const,
        avatar: "/images/projects/defi-protocol.png",
        link: "/app/scheduled-payments",
        actions: [
          { label: "View Details", link: "/app/scheduled-payments" },
          { label: "Edit Schedule", link: `/app/scheduled-payments?edit=${newPayment.id}` },
        ],
      }

      // Add to localStorage notifications
      const existingNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
      localStorage.setItem("notifications", JSON.stringify([notificationData, ...existingNotifications]))

      // Dispatch a custom event to notify the notification system
      window.dispatchEvent(new CustomEvent("new-notification", { detail: notificationData }))

      toast({
        title: "Payment scheduled",
        description: `Payment for milestone "${milestoneName}" has been scheduled.`,
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Error scheduling payment:", error)
      return Promise.reject(error)
    }
  }

  const cancelScheduledPayment = async (paymentId: string) => {
    try {
      const payment = scheduledPayments.find((p) => p.id === paymentId)

      setScheduledPayments((prev) =>
        prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "cancelled" } : payment)),
      )

      if (payment) {
        // Add a notification for the cancelled payment
        const notificationData = {
          id: `payment-cancelled-${paymentId}`,
          title: "Payment Cancelled",
          message: `You've cancelled the scheduled payment for milestone "${payment.milestoneName}" in project "${payment.projectName}".`,
          date: new Date().toISOString(),
          read: false,
          type: "payment" as const,
          priority: "medium" as const,
          avatar: "/images/projects/defi-protocol.png",
          link: "/app/scheduled-payments",
          actions: [
            { label: "View Details", link: "/app/scheduled-payments" },
            { label: "Reschedule", link: `/app/scheduled-payments?reschedule=${paymentId}` },
          ],
        }

        // Add to localStorage notifications
        const existingNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
        localStorage.setItem("notifications", JSON.stringify([notificationData, ...existingNotifications]))

        // Dispatch a custom event to notify the notification system
        window.dispatchEvent(new CustomEvent("new-notification", { detail: notificationData }))
      }

      toast({
        title: "Payment cancelled",
        description: "The scheduled payment has been cancelled.",
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Error cancelling payment:", error)
      return Promise.reject(error)
    }
  }

  const processScheduledPayment = async (paymentId: string) => {
    try {
      const payment = scheduledPayments.find((p) => p.id === paymentId)
      if (!payment) throw new Error("Payment not found")

      // Process the payment (in a real app, this would interact with a payment API)
      await withdrawFunds(payment.amount)

      // Update the payment status
      setScheduledPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "processed" } : p)))

      // Add a notification for the processed payment
      const notificationData = {
        id: `payment-processed-${paymentId}`,
        title: "Payment Processed",
        message: `Payment of ${payment.amount} ${payment.currency} for milestone "${payment.milestoneName}" in project "${payment.projectName}" has been processed successfully.`,
        date: new Date().toISOString(),
        read: false,
        type: "payment" as const,
        priority: "high" as const,
        avatar: "/images/projects/defi-protocol.png",
        link: "/app/payments",
        actions: [
          { label: "View Payment", link: "/app/payments" },
          { label: "View Project", link: `/app/crowdfunding?project=${payment.projectId}` },
        ],
      }

      // Add to localStorage notifications
      const existingNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
      localStorage.setItem("notifications", JSON.stringify([notificationData, ...existingNotifications]))

      // Dispatch a custom event to notify the notification system
      window.dispatchEvent(new CustomEvent("new-notification", { detail: notificationData }))

      toast({
        title: "Payment processed",
        description: `Payment for milestone "${payment.milestoneName}" has been processed successfully.`,
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Error processing payment:", error)

      toast({
        title: "Payment failed",
        description: "There was an error processing the payment. Please try again.",
        variant: "destructive",
      })

      return Promise.reject(error)
    }
  }

  const payMilestone = async (milestoneId: string) => {
    try {
      // In a real app, this would make an API call to process the payment
      // For now, we'll just simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return Promise.resolve()
    } catch (error) {
      console.error("Error paying milestone:", error)
      return Promise.reject(error)
    }
  }

  const updateMilestoneDependencies = async (projectId: string, milestoneId: string, dependencies: string[]) => {
    try {
      // In a real app, this would make an API call to update the dependencies
      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Dependencies updated",
        description: "Milestone dependencies have been updated successfully.",
      })

      return Promise.resolve()
    } catch (error) {
      console.error("Error updating dependencies:", error)
      toast({
        title: "Error updating dependencies",
        description: "There was a problem updating the milestone dependencies.",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        scheduledPayments,
        scheduleMilestonePayment,
        cancelScheduledPayment,
        processScheduledPayment,
        payMilestone,
        updateMilestoneDependencies,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjectContext = () => useContext(ProjectContext)
