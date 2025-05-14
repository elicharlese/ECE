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
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Receipt, Download, FileText, Search } from "lucide-react"
import type { ProjectMilestone } from "@/components/project/project-tracker"

interface MilestonePaymentHistoryProps {
  projectName: string
  milestones: ProjectMilestone[]
}

export function MilestonePaymentHistory({ projectName, milestones }: MilestonePaymentHistoryProps) {
  const [open, setOpen] = useState(false)

  // Filter milestones that have been paid
  const paidMilestones = milestones.filter(
    (milestone) => milestone.paymentStatus === "paid" && milestone.paymentAmount && milestone.paymentDate,
  )

  // Calculate total paid amount
  const totalPaid = paidMilestones.reduce((sum, milestone) => sum + (milestone.paymentAmount || 0), 0)

  // Calculate total pending amount
  const pendingMilestones = milestones.filter(
    (milestone) => milestone.paymentStatus === "pending" && milestone.paymentAmount,
  )
  const totalPending = pendingMilestones.reduce((sum, milestone) => sum + (milestone.paymentAmount || 0), 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Receipt className="h-4 w-4" />
          Payment History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Milestone Payment History</DialogTitle>
          <DialogDescription>View all payments for {projectName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Paid</div>
              <div className="text-2xl font-bold">{totalPaid} ECE</div>
              <div className="text-xs text-muted-foreground mt-1">{paidMilestones.length} milestones</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Pending Payments</div>
              <div className="text-2xl font-bold">{totalPending} ECE</div>
              <div className="text-xs text-muted-foreground mt-1">{pendingMilestones.length} milestones</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Payment Records</h4>
            {paidMilestones.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {paidMilestones.map((milestone) => (
                    <div key={milestone.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <h5 className="font-medium">{milestone.title}</h5>
                        <div className="text-sm font-medium">{milestone.paymentAmount} ECE</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{milestone.description}</div>
                      <div className="flex justify-between text-sm">
                        <div className="text-muted-foreground">
                          Paid on{" "}
                          {milestone.paymentDate ? format(new Date(milestone.paymentDate), "MMM d, yyyy") : "N/A"}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Search className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <FileText className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No payment records found</div>
            )}
          </div>

          {pendingMilestones.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Pending Payments</h4>
              <ScrollArea className="h-[150px]">
                <div className="space-y-3">
                  {pendingMilestones.map((milestone) => (
                    <div key={milestone.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <h5 className="font-medium">{milestone.title}</h5>
                        <div className="text-sm font-medium">{milestone.paymentAmount} ECE</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{milestone.description}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">Due after approval</div>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
