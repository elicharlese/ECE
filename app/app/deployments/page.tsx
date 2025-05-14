import type { Metadata } from "next"
import { DeploymentHistory } from "@/components/deployments/deployment-history"
import { CanaryDeployments } from "@/components/deployments/canary-deployments"
import { CanaryConfig } from "@/components/deployments/canary-config"
import { AutoRollbackConfig } from "@/components/deployments/auto-rollback-config"
import { AutoRollbackHistory } from "@/components/deployments/auto-rollback-history"
import { AutoRollbackMonitor } from "@/components/deployments/auto-rollback-monitor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Deployments",
  description: "Manage and monitor your deployments",
}

export default function DeploymentsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
        <p className="text-muted-foreground">Manage and monitor your deployments</p>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="history">Deployment History</TabsTrigger>
          <TabsTrigger value="canary">Canary Deployments</TabsTrigger>
          <TabsTrigger value="auto-rollback">Automatic Rollbacks</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <DeploymentHistory />
        </TabsContent>
        <TabsContent value="canary">
          <div className="space-y-8">
            <CanaryConfig />
            <CanaryDeployments />
          </div>
        </TabsContent>
        <TabsContent value="auto-rollback">
          <div className="space-y-8">
            <AutoRollbackConfig />
            <AutoRollbackMonitor />
            <AutoRollbackHistory />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
