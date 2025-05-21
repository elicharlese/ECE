"use client"

import type React from "react"

import { DeploymentNotificationProvider } from "@/context/deployment-notification-context"

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <DeploymentNotificationProvider>{children}</DeploymentNotificationProvider>
}
