"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Branch, BranchComparison } from "@/types/branch"
import { BranchService } from "@/services/branch-service"

interface BranchContextType {
  branches: Branch[]
  selectedRepository: string | null
  baseBranch: Branch | null
  compareBranch: Branch | null
  comparison: BranchComparison | null
  loading: boolean
  error: string | null
  setSelectedRepository: (repositoryId: string) => Promise<void>
  setBaseBranch: (branch: Branch) => void
  setCompareBranch: (branch: Branch) => void
  compareBranches: () => Promise<void>
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedRepository, setSelectedRepositoryState] = useState<string | null>(null)
  const [baseBranch, setBaseBranchState] = useState<Branch | null>(null)
  const [compareBranch, setCompareBranchState] = useState<Branch | null>(null)
  const [comparison, setComparison] = useState<BranchComparison | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const setSelectedRepository = async (repositoryId: string) => {
    try {
      setLoading(true)
      setError(null)
      setSelectedRepositoryState(repositoryId)
      setBaseBranchState(null)
      setCompareBranchState(null)
      setComparison(null)

      const fetchedBranches = await BranchService.getBranches(repositoryId)
      setBranches(fetchedBranches)

      // Set default branch as base branch if available
      const defaultBranch = fetchedBranches.find((branch) => branch.isDefault)
      if (defaultBranch) {
        setBaseBranchState(defaultBranch)
      }
    } catch (err) {
      setError("Failed to fetch branches")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const setBaseBranch = (branch: Branch) => {
    setBaseBranchState(branch)
    // Reset comparison when changing branches
    setComparison(null)
  }

  const setCompareBranch = (branch: Branch) => {
    setCompareBranchState(branch)
    // Reset comparison when changing branches
    setComparison(null)
  }

  const compareBranches = async () => {
    if (!selectedRepository || !baseBranch || !compareBranch) {
      setError("Please select a repository and branches to compare")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const comparisonResult = await BranchService.compareBranches(
        selectedRepository,
        baseBranch.name,
        compareBranch.name,
      )

      setComparison(comparisonResult)
    } catch (err) {
      setError("Failed to compare branches")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BranchContext.Provider
      value={{
        branches,
        selectedRepository,
        baseBranch,
        compareBranch,
        comparison,
        loading,
        error,
        setSelectedRepository,
        setBaseBranch,
        setCompareBranch,
        compareBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider")
  }
  return context
}
