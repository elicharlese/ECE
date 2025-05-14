import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"

interface PaymentApprovalFlowProps {
  approvalFlow: any[]
}

export function PaymentApprovalFlow({ approvalFlow }: PaymentApprovalFlowProps) {
  return (
    <div className="relative pl-6 border-l-2 border-muted space-y-8">
      {approvalFlow.map((approval, index) => (
        <div key={index} className="relative">
          <div
            className={`absolute -left-[25px] p-1 bg-background border-2 border-muted rounded-full ${
              approval.status === "approved"
                ? "text-green-500"
                : approval.status === "rejected"
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {approval.status === "approved" && <CheckCircle2 className="h-4 w-4" />}
            {approval.status === "rejected" && <XCircle className="h-4 w-4" />}
            {approval.status === "pending" && <Clock className="h-4 w-4" />}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={approval.approver.avatar || "/placeholder.svg"} />
                <AvatarFallback>{approval.approver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{approval.approver.name}</div>
                <div className="text-xs text-muted-foreground">
                  Level {approval.level} • {approval.approver.role}
                </div>
              </div>
            </div>
            <div className="text-sm">
              {approval.status === "approved" && (
                <div className="text-green-600 dark:text-green-400">
                  Approved on {format(new Date(approval.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </div>
              )}
              {approval.status === "rejected" && (
                <div className="text-red-600 dark:text-red-400">
                  Rejected on {format(new Date(approval.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </div>
              )}
              {approval.status === "pending" && <div className="text-muted-foreground">Pending approval</div>}
            </div>
            {approval.comments && <div className="text-sm bg-muted/50 p-2 rounded-md">"{approval.comments}"</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
