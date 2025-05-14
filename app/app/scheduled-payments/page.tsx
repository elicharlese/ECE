"use client"

import { Button } from "@/components/ui/button"
import { ScheduledMilestonePayments } from "@/components/project/scheduled-milestone-payments"
import { CalendarClock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ScheduledPaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scheduled Payments</h1>
          <p className="text-muted-foreground">Manage your scheduled milestone payments</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/app">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <ScheduledMilestonePayments />

      <div className="rounded-lg border p-4 bg-muted/20">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <CalendarClock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">About Scheduled Payments</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Scheduled payments allow you to plan ahead for milestone payments. You'll receive reminders before the
              payment date, and you can always process payments early or cancel them if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
