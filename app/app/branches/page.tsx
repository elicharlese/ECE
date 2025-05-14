"use client"

import { BranchProvider } from "@/context/branch-context"
import { BranchSelector } from "@/components/branches/branch-selector"
import { BranchComparisonResult } from "@/components/branches/branch-comparison-result"

export default function BranchesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Branch Comparison</h1>
        <p className="text-muted-foreground">Compare branches to see differences in code, commits, and files.</p>
      </div>

      <BranchProvider>
        <BranchSelector />
        <BranchComparisonResult />
      </BranchProvider>
    </div>
  )
}
