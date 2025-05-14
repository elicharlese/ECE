"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, Wallet, CalendarClock } from "lucide-react"
import { useToast } from "../ui/use-toast"
import { useProjectContext } from "@/context/project-context"
import type { Milestone } from "@/types"
import { DialogFooter } from "../ui/dialog"
import { MilestoneTransactionRecord } from "./milestone-transaction-record"
import { MilestonePaymentScheduler } from "./milestone-payment-scheduler"
import { format } from "date-fns"

interface MilestonePaymentDialogProps {
  milestone: Milestone
  projectName: string
  currency: string
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function MilestonePaymentDialog({
  milestone,
  projectName,
  currency,
  onOpenChange,
  open,
}: MilestonePaymentDialogProps) {
  const { toast } = useToast()
  const { payMilestone, scheduleMilestonePayment } = useProjectContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)

  const insufficientFunds = milestone?.paymentAmount > 1000 // Replace 1000 with actual user balance

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      if (milestone?.id) {
        await payMilestone(milestone.id)
        toast({
          title: "Payment Successful",
          description: "The milestone payment has been processed.",
        })
        onOpenChange(false)
      } else {
        toast({
          title: "Payment Failed",
          description: "Milestone ID is missing.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing the payment.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSchedulePayment = async (scheduledDate: Date, reminderDays: number) => {
    try {
      if (milestone?.id) {
        await scheduleMilestonePayment(milestone.id, scheduledDate, reminderDays)
        toast({
          title: "Payment Scheduled",
          description: `Payment scheduled for ${format(scheduledDate, "PPP")}.`,
        })
        onOpenChange(false)
      } else {
        toast({
          title: "Scheduling Failed",
          description: "Milestone ID is missing.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling the payment.",
        variant: "destructive",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{showScheduler ? "Schedule Milestone Payment" : "Pay Milestone"}</AlertDialogTitle>
          <AlertDialogDescription>
            {showScheduler
              ? "Choose when you want to process this payment"
              : `Are you sure you want to pay milestone "${milestone?.title}"? This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {showScheduler ? (
          <MilestonePaymentScheduler onSchedule={handleSchedulePayment} onCancel={() => setShowScheduler(false)} />
        ) : (
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancel
            </Button>
            {milestone?.paymentStatus === "paid" ? (
              <MilestoneTransactionRecord projectName={projectName} milestone={milestone} />
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowScheduler(true)}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  <CalendarClock className="h-4 w-4" />
                  Schedule
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || insufficientFunds || !milestone?.paymentAmount}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay {milestone?.paymentAmount} {currency}
                    </>
                  )}
                </Button>
              </>
            )}
            {insufficientFunds && (
              <Button variant="outline" className="gap-2">
                <Wallet className="h-4 w-4" />
                Add Funds
              </Button>
            )}
          </DialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
