"use client"

import CrowdfundingMode from "@/components/modes/crowdfunding-mode"
import { BettingStyleLayout } from "@/components/crowdfunding/betting-style-layout"

export default function CrowdfundingPage() {
  return (
    <BettingStyleLayout>
      <CrowdfundingMode />
    </BettingStyleLayout>
  )
}
