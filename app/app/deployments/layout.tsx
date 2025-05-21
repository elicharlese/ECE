import type React from "react"
import { DeploymentProvider } from "@/context/deployment-context"

export default function DeploymentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DeploymentProvider>{children}</DeploymentProvider>
}
