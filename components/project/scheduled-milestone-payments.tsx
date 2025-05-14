"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, CreditCard, Trash2 } from "lucide-react"
import { format, isBefore, addDays } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useProjectContext } from "@/context/project-context"

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

export function ScheduledMilestonePayments() {
  const { toast } = useToast()
  const { scheduledPayments, cancelScheduledPayment, processScheduledPayment } = useProjectContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<ScheduledPayment | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"cancel" | "process">("cancel")

  const openConfirmDialog = (payment: ScheduledPayment, action: "cancel" | "process") => {
    setSelectedPayment(payment)
    setConfirmAction(action)
    setConfirmDialogOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedPayment) return

    setIsProcessing(true)
    try {
      if (confirmAction === "cancel") {
        await cancelScheduledPayment(selectedPayment.id)
        toast({
          title: "Payment Cancelled",
          description: "The scheduled payment has been cancelled.",
        })
      } else {
        await processScheduledPayment(selectedPayment.id)
        toast({
          title: "Payment Processed",
          description: "The scheduled payment has been processed successfully.",
        })
      }
      setConfirmDialogOpen(false)
    } catch (error) {
      toast({
        title: "Action Failed",
        description: `Failed to ${confirmAction} the scheduled payment.`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string, date: string) => {
    const isPastDue = isBefore(new Date(date), new Date())

    switch (status) {
      case "pending":
        return isPastDue ? (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Past Due
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Scheduled
          </Badge>
        )
      case "processed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Processed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getReminderDate = (scheduledDate: string, reminderDays: number) => {
    const date = new Date(scheduledDate)
    return addDays(date, -reminderDays)
  }

  if (scheduledPayments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Payments</CardTitle>
          <CardDescription>You don't have any scheduled milestone payments</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="text-center">
            <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-2 text-sm text-muted-foreground">
              When you schedule milestone payments, they will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Payments</CardTitle>
          <CardDescription>Manage your scheduled milestone payments</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {scheduledPayments.map((payment) => (
                <Card key={payment.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{payment.projectName}</h3>
                        <p className="text-sm text-muted-foreground">Milestone: {payment.milestoneName}</p>
                      </div>
                      {getStatusBadge(payment.status, payment.scheduledDate)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Amount:</span>{" "}
                        <span className="font-medium">
                          {payment.amount} {payment.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payment Date:</span>{" "}
                        <span className="font-medium">{format(new Date(payment.scheduledDate), "MMM d, yyyy")}</span>
                      </div>
                      {payment.reminderDays > 0 && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Reminder:</span>{" "}
                          <span className="font-medium">
                            {format(getReminderDate(payment.scheduledDate, payment.reminderDays), "MMM d, yyyy")}(
                            {payment.reminderDays} {payment.reminderDays === 1 ? "day" : "days"} before)
                          </span>
                        </div>
                      )}
                    </div>

                    {payment.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openConfirmDialog(payment, "cancel")}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => openConfirmDialog(payment, "process")}>
                          <CreditCard className="h-4 w-4 mr-1" />
                          Process Now
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction === "cancel" ? "Cancel Scheduled Payment" : "Process Payment Now"}</DialogTitle>
            <DialogDescription>
              {confirmAction === "cancel"
                ? "Are you sure you want to cancel this scheduled payment?"
                : "Are you sure you want to process this payment now?"}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="py-4">
              <div className="rounded-lg border p-4 bg-muted/20">
                <div className="font-medium mb-2">{selectedPayment.projectName}</div>
                <div className="text-sm space-y-1">
                  <p>Milestone: {selectedPayment.milestoneName}</p>
                  <p>
                    Amount: {selectedPayment.amount} {selectedPayment.currency}
                  </p>
                  <p>Scheduled for: {format(new Date(selectedPayment.scheduledDate), "PPP")}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isProcessing}
              variant={confirmAction === "cancel" ? "destructive" : "default"}
            >
              {isProcessing ? (
                "Processing..."
              ) : confirmAction === "cancel" ? (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Payment
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
