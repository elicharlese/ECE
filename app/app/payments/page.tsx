import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentDashboard } from "@/components/payments/payment-dashboard"
import { PaymentHistory } from "@/components/payments/payment-history"
import { PaymentSettings } from "@/components/payments/payment-settings"
import { PaymentReports } from "@/components/payments/payment-reports"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payments</h2>
          <p className="text-muted-foreground mt-1">Manage payments, approvals, and transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payment Workflows</CardTitle>
            <CardDescription>Manage payment requests and approvals</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Payment Approval</CardTitle>
                <CardDescription>Review and approve payment requests</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Streamline your payment approval process with multi-level approvals, notifications, and audit trails.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/app/payments/approval" className="w-full">
                  <Button className="w-full">
                    Go to Approval Workflow
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recurring Payments</CardTitle>
                <CardDescription>Set up automated recurring payments</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Configure automated recurring payments with customizable schedules and payment tracking.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/app/payments/recurring" className="w-full">
                  <Button className="w-full">
                    Go to Recurring Payments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Batch Payments</CardTitle>
                <CardDescription>Process multiple payments at once</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Create and manage batch payments for efficient processing of multiple transactions simultaneously.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Go to Batch Payments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Payment Templates</CardTitle>
                <CardDescription>Create reusable payment templates</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Save time by creating reusable payment templates for common payment types and workflows.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Go to Templates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common payment tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Create Payment Request
            </Button>
            <Link href="/app/payments/recurring" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                Create Recurring Payment
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              Review Pending Approvals
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Payment History
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Generate Payment Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Configure Approval Rules
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
          <PaymentDashboard />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <PaymentHistory />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <PaymentReports />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <PaymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
