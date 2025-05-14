"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import type { ProjectMilestone } from "@/components/project/project-tracker"

interface MilestoneApprovalDialogProps {
  milestone: ProjectMilestone | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (milestoneId: string, feedback: string) => void
  onRequestChanges: (milestoneId: string, feedback: string) => void
}

export function MilestoneApprovalDialog({
  milestone,
  open,
  onOpenChange,
  onApprove,
  onRequestChanges,
}: MilestoneApprovalDialogProps) {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!milestone) return null

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      await onApprove(milestone.id, feedback)
      setFeedback("")
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestChanges = async () => {
    setIsSubmitting(true)
    try {
      await onRequestChanges(milestone.id, feedback)
      setFeedback("")
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Completed
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
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Delayed
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Approved
          </Badge>
        )
      case "changes-requested":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Changes Requested
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Milestone Review</DialogTitle>
          <DialogDescription>Review and approve this milestone or request changes</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">{milestone.title}</h3>
              {getStatusBadge(milestone.status)}
            </div>
            <p className="text-sm text-muted-foreground">{milestone.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Due Date:</span>
              <div className="font-medium">{format(new Date(milestone.dueDate), "MMM d, yyyy")}</div>
            </div>
            {milestone.completedDate && (
              <div>
                <span className="text-muted-foreground">Completed Date:</span>
                <div className="font-medium">{format(new Date(milestone.completedDate), "MMM d, yyyy")}</div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{milestone.progress}%</span>
            </div>
            <Progress value={milestone.progress} className="h-2" />
          </div>

          {milestone.paymentAmount && (
            <div className="space-y-2">
              <h4 className="font-medium">Payment Information</h4>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Amount:</span>
                <span className="font-medium">{milestone.paymentAmount} ECE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className="font-medium capitalize">{milestone.paymentStatus || "pending"}</span>
              </div>
              {milestone.paymentDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Date:</span>
                  <span className="font-medium">{format(new Date(milestone.paymentDate), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          )}

          {milestone.approvalHistory && milestone.approvalHistory.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Approval History</h4>
                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
                  {milestone.approvalHistory.map((history, index) => (
                    <div key={index} className="text-sm border rounded-md p-3 bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        {history.action === "approved" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        )}
                        <span className="font-medium">
                          {history.action === "approved" ? "Approved" : "Changes Requested"}
                        </span>
                        <span className="text-muted-foreground ml-auto">
                          {format(new Date(history.date), "MMM d, yyyy")}
                        </span>
                      </div>
                      {history.feedback && <p className="text-muted-foreground">{history.feedback}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Your Feedback</h4>
            <Textarea
              placeholder="Add your feedback or comments about this milestone..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRequestChanges}
            disabled={isSubmitting || milestone.status === "changes-requested"}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting || milestone.status === "approved" || milestone.progress < 100}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
