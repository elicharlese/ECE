import type { Metadata } from "next"
import { DemoModeDetector } from "@/components/demo-mode-detector"

export const metadata: Metadata = {
  title: "Dashboard | ECE Platform",
  description: "Your ECE dashboard",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Demo mode detector - will show a notification if demo mode is active */}
      <DemoModeDetector />

      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here you can manage your projects, view your portfolio, and more.
        </p>
      </div>

      {/* Rest of dashboard content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard cards */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Your Portfolio</h3>
          <div className="text-3xl font-bold">2,450 ECE</div>
          <p className="text-sm text-green-500 mt-1">+125 ECE (5.4%) this week</p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Active Projects</h3>
          <div className="text-3xl font-bold">3</div>
          <p className="text-sm text-muted-foreground mt-1">2 awaiting approval</p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Marketplace Activity</h3>
          <div className="text-3xl font-bold">12</div>
          <p className="text-sm text-muted-foreground mt-1">New listings this week</p>
        </div>
      </div>

      {/* Recent activity section */}
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="font-medium">DeFi Protocol Purchase</p>
              <p className="text-sm text-muted-foreground">You purchased a new DeFi protocol license</p>
            </div>
            <div className="text-right">
              <p className="font-medium">-250 ECE</p>
              <p className="text-sm text-muted-foreground">2 days ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="font-medium">Project Milestone Completed</p>
              <p className="text-sm text-muted-foreground">NFT Gaming project reached milestone 2</p>
            </div>
            <div className="text-right">
              <p className="font-medium">+175 ECE</p>
              <p className="text-sm text-muted-foreground">5 days ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Deposit Received</p>
              <p className="text-sm text-muted-foreground">Monthly deposit to your wallet</p>
            </div>
            <div className="text-right">
              <p className="font-medium">+500 ECE</p>
              <p className="text-sm text-muted-foreground">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
