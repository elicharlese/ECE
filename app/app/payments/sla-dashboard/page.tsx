import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SLASettings } from "@/components/payments/sla-settings"
import { SLAPerformanceReport } from "@/components/payments/sla-performance-report"

export default function SLADashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Approval Time Commitments</h1>
        <p className="text-muted-foreground">Monitor and manage Service Level Agreements for payment approvals</p>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <SLAPerformanceReport />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Approvers with fastest response times</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Top performers content would go here */}
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Top performers chart
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SLA Breaches</CardTitle>
                <CardDescription>Recent and recurring SLA violations</CardDescription>
              </CardHeader>
              <CardContent>
                {/* SLA breaches content would go here */}
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  SLA breaches list
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <SLASettings />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SLA Compliance Reports</CardTitle>
              <CardDescription>Generate and export SLA compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Reports content would go here */}
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                SLA reporting tools
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
