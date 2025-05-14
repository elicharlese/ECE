"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { FileText, Download, CheckCircle2, XCircle, Clock, AlertTriangle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PaymentApprovalDetailsProps {
  payment: any
  onApprove: (paymentId: string, level: number, comments: string) => void
  onReject: (paymentId: string, level: number, comments: string) => void
  isLoading: boolean
}

export function PaymentApprovalDetails({ payment, onApprove, onReject, isLoading }: PaymentApprovalDetailsProps) {
  const [comments, setComments] = useState("")

  // Find the current approval level that is pending
  const currentApprovalLevel = payment.approvalFlow.find((approval: any) => approval.status === "pending")

  // Check if the current user is an approver at the current level
  // In a real app, you would check the current user's ID against the approver's ID
  const isApprover = currentApprovalLevel !== undefined

  // Render SLA status indicator and progress
  const renderSLAInfo = () => {
    if (!currentApprovalLevel || !payment.slaStatus) return null

    const slaPercentage = currentApprovalLevel.slaElapsedPercentage || 0

    let statusIcon
    let statusText
    let statusColor

    switch (payment.slaStatus) {
      case "onTrack":
        statusIcon = <Clock className="h-4 w-4 text-green-500" />
        statusText = "On track"
        statusColor = "text-green-500"
        break
      case "atRisk":
        statusIcon = <AlertTriangle className="h-4 w-4 text-amber-500" />
        statusText = "At risk"
        statusColor = "text-amber-500"
        break
      case "breached":
        statusIcon = <AlertCircle className="h-4 w-4 text-red-500" />
        statusText = "SLA breached"
        statusColor = "text-red-500"
        break
      default:
        return null
    }

    return (
      <div className="space-y-2 mt-4">
        <h3 className="text-sm font-medium">Approval Time Commitment</h3>
        <div className="flex items-center gap-2">
          {statusIcon}
          <span className={`text-sm font-medium ${statusColor}`}>{statusText}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Time elapsed</span>
            <span>{slaPercentage}%</span>
          </div>
          <Progress
            value={slaPercentage}
            className={`h-2 ${
              payment.slaStatus === "onTrack"
                ? "bg-green-100"
                : payment.slaStatus === "atRisk"
                  ? "bg-amber-100"
                  : "bg-red-100"
            }`}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {currentApprovalLevel.slaTimeRemaining
            ? `${currentApprovalLevel.slaTimeRemaining} remaining of ${currentApprovalLevel.slaTarget}`
            : `Target: ${currentApprovalLevel.slaTarget}`}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Request Details</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Amount:</div>
              <div className="col-span-2 font-medium">
                {payment.amount} {payment.currency}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Category:</div>
              <div className="col-span-2">{payment.category}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Created:</div>
              <div className="col-span-2">{format(new Date(payment.createdAt), "MMM d, yyyy 'at' h:mm a")}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Due Date:</div>
              <div className="col-span-2">{format(new Date(payment.dueDate), "MMM d, yyyy")}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Priority:</div>
              <div className="col-span-2">
                {payment.priority === "urgent" ? (
                  <span className="text-red-500 font-medium">Urgent</span>
                ) : (
                  <span>Standard</span>
                )}
              </div>
            </div>
          </div>

          {renderSLAInfo()}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Requested By</h3>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={payment.requestedBy.avatar || "/placeholder.svg"} />
              <AvatarFallback>{payment.requestedBy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{payment.requestedBy.name}</div>
              <div className="text-sm text-muted-foreground">{payment.requestedBy.role}</div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Description</h3>
        <p className="text-sm">{payment.description}</p>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Attachments</h3>
        <div className="space-y-2">
          {payment.attachments.map((attachment: any) => (
            <div key={attachment.id} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">{attachment.name}</div>
                  <div className="text-xs text-muted-foreground">{attachment.size}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {isApprover && (
        <>
          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Your Decision</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Add your comments or feedback here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onReject(payment.id, currentApprovalLevel.level, comments)}
                  disabled={isLoading}
                >
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  Reject
                </Button>
                <Button
                  className="w-full"
                  onClick={() => onApprove(payment.id, currentApprovalLevel.level, comments)}
                  disabled={isLoading}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
