"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Receipt, Download, Printer, Share2 } from "lucide-react"
import type { ProjectMilestone } from "@/components/project/project-tracker"

interface MilestoneTransactionRecordProps {
  projectName: string
  milestone: ProjectMilestone
}

export function MilestoneTransactionRecord({ projectName, milestone }: MilestoneTransactionRecordProps) {
  const [open, setOpen] = useState(false)

  if (!milestone.paymentStatus || milestone.paymentStatus !== "paid" || !milestone.paymentDate) {
    return null
  }

  const transactionId = `TX-${Date.now().toString().slice(-6)}`
  const paymentDate = new Date(milestone.paymentDate)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Receipt className="h-3.5 w-3.5 mr-1" />
          Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogDescription>Transaction details for milestone payment</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">Payment Receipt</h3>
              <p className="text-sm text-muted-foreground">Transaction ID: {transactionId}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Date: {format(paymentDate, "MMM d, yyyy")}</p>
              <p className="text-sm text-muted-foreground">Time: {format(paymentDate, "h:mm a")}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Project Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Project Name:</p>
                  <p className="font-medium">{projectName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Milestone:</p>
                  <p className="font-medium">{milestone.title}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Payment Details</h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Milestone Payment:</span>
                  <span className="font-medium">{milestone.paymentAmount} ECE</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Processing Fee:</span>
                  <span className="font-medium">0 ECE</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">{milestone.paymentAmount} ECE</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Payment Method</h4>
              <div className="text-sm">
                <p>ECE Wallet</p>
                <p className="text-muted-foreground">Transaction processed via ECE secure payment system</p>
              </div>
            </div>
          </div>

          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-sm text-green-800 dark:text-green-200">
            <p className="font-medium">Payment Successful</p>
            <p>This payment has been successfully processed and recorded.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
