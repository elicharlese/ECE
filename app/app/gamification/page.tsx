"use client"

import { GamificationDashboard } from "@/components/gamification/dashboard"
import { GamificationProvider } from "@/context/gamification-context"

export default function GamificationPage() {
  return (
    <GamificationProvider>
      <GamificationDashboard />
    </GamificationProvider>
  )
}
