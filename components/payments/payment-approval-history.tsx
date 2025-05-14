import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { CheckCircle2, XCircle, FileText, Clock } from "lucide-react"

interface PaymentApprovalHistoryProps {
  history: any[]
}

export function PaymentApprovalHistory({ history }: PaymentApprovalHistoryProps) {
  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={index} className="flex gap-3">
          <div className="mt-0.5">
            {item.action === "created" && <FileText className="h-4 w-4 text-blue-500" />}
            {item.action === "approved" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            {item.action === "rejected" && <XCircle className="h-4 w-4 text-red-500" />}
            {item.action === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            {item.action === "pending" && <Clock className="h-4 w-4 text-yellow-500" />}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              {item.user.id !== "system" ? (
                <Avatar className="h-5 w-5">
                  <AvatarImage src={item.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : null}
              <span className="text-sm font-medium">{item.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
            <p className="text-sm">{item.details}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
