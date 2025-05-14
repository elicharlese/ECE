"use client"

import { CrowdfundingGamificationProvider } from "@/context/crowdfunding-gamification-context"
import { CrowdfundingGamificationDashboard } from "@/components/gamification/crowdfunding-dashboard"

export default function CrowdfundingRewardsPage() {
  return (
    <CrowdfundingGamificationProvider>
      <CrowdfundingGamificationDashboard />
    </CrowdfundingGamificationProvider>
  )
}
