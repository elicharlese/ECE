"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, AlertTriangle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PaymentApprovalListProps {
  payments: any[]
  selectedPaymentId: string | null
  onSelectPayment: (id: string) => void
}

export function PaymentApprovalList({ payments, selectedPaymentId, onSelectPayment }: PaymentApprovalListProps) {
  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No payment requests found</p>
      </div>
    )
  }

  // Helper function to render SLA status indicator
  const renderSLAStatus = (slaStatus: string) => {
    switch (slaStatus) {
      case "onTrack":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">On track</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Approval is on track to meet SLA</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "atRisk":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                  <span className="text-xs text-amber-500">At risk</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Approval is at risk of missing SLA (75% of time elapsed)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "breached":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-500">SLA breached</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Approval has exceeded the SLA time commitment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
            selectedPaymentId === payment.id ? "bg-muted/50 border-primary" : ""
          }`}
          onClick={() => onSelectPayment(payment.id)}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium text-sm">{payment.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{payment.description}</p>
            </div>
            <Badge
              variant={
                payment.status === "approved" ? "outline" : payment.status === "rejected" ? "destructive" : "secondary"
              }
              className={
                payment.status === "approved"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : payment.status === "rejected"
                    ? ""
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }
            >
              {payment.status === "approved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
              {payment.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
              {payment.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Badge>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {payment.amount} {payment.currency}
              </span>
            </div>
            <div className="text-muted-foreground">{format(new Date(payment.createdAt), "MMM d, yyyy")}</div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex -space-x-2">
              {payment.approvalFlow.map((approval: any, index: number) => (
                <div
                  key={index}
                  className={`w-5 h-5 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold ${
                    approval.status === "approved"
                      ? "bg-green-500 text-white"
                      : approval.status === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                  title={`Level ${approval.level}: ${approval.approver.name} - ${approval.status}`}
                >
                  {approval.level}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {payment.status === "pending" && payment.slaStatus && renderSLAStatus(payment.slaStatus)}
              <span className="text-xs text-muted-foreground">{payment.requestedBy.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
