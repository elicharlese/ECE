import { Card, CardContent } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "lucide-react"

export function PaymentApprovalStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[200px]">
            <PieChart className="h-full w-full text-muted-foreground" />
          </div>
          <div className="text-center mt-4">
            <h3 className="font-medium">Approval Rate</h3>
            <p className="text-sm text-muted-foreground">85% of requests are approved</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[200px]">
            <BarChart className="h-full w-full text-muted-foreground" />
          </div>
          <div className="text-center mt-4">
            <h3 className="font-medium">Requests by Category</h3>
            <p className="text-sm text-muted-foreground">Project payments are most common</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[200px]">
            <LineChart className="h-full w-full text-muted-foreground" />
          </div>
          <div className="text-center mt-4">
            <h3 className="font-medium">Approval Time</h3>
            <p className="text-sm text-muted-foreground">Average approval time: 2.3 days</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
