"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Repository, RepositoryStats, RepositoryComparison, RepositoryComparisonRequest } from "@/types/repository"
import { repositoryService } from "@/services/repository-service"
import { useToast } from "@/components/ui/use-toast"

interface RepositoryContextType {
  repositories: Repository[]
  isLoading: boolean
  error: string | null
  selectedRepositories: string[]
  setSelectedRepositories: (repos: string[]) => void
  toggleRepositorySelection: (repoId: string) => void
  clearSelectedRepositories: () => void
  repositoryStats: Record<string, RepositoryStats>
  getRepositoryStats: (repoId: string) => Promise<RepositoryStats | null>
  comparison: RepositoryComparison | null
  isComparing: boolean
  compareRepositories: (request: RepositoryComparisonRequest) => Promise<void>
  refreshRepositories: () => Promise<void>
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined)

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRepositories, setSelectedRepositories] = useState<string[]>([])
  const [repositoryStats, setRepositoryStats] = useState<Record<string, RepositoryStats>>({})
  const [comparison, setComparison] = useState<RepositoryComparison | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const { toast } = useToast()

  const fetchRepositories = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await repositoryService.getRepositories()
      setRepositories(data)
    } catch (err) {
      setError("Failed to fetch repositories")
      toast({
        title: "Error",
        description: "Failed to fetch repositories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRepositories()
  }, [])

  const refreshRepositories = async () => {
    await fetchRepositories()
  }

  const toggleRepositorySelection = (repoId: string) => {
    setSelectedRepositories((current) => {
      if (current.includes(repoId)) {
        return current.filter((id) => id !== repoId)
      } else {
        return [...current, repoId]
      }
    })
  }

  const clearSelectedRepositories = () => {
    setSelectedRepositories([])
  }

  const getRepositoryStats = async (repoId: string): Promise<RepositoryStats | null> => {
    if (repositoryStats[repoId]) {
      return repositoryStats[repoId]
    }

    try {
      const stats = await repositoryService.getRepositoryStats(repoId)
      if (stats) {
        setRepositoryStats((current) => ({
          ...current,
          [repoId]: stats,
        }))
        return stats
      }
      return null
    } catch (err) {
      console.error("Failed to fetch repository stats:", err)
      toast({
        title: "Error",
        description: "Failed to fetch repository statistics",
        variant: "destructive",
      })
      return null
    }
  }

  const compareRepositories = async (request: RepositoryComparisonRequest) => {
    try {
      setIsComparing(true)
      setError(null)

      const response = await repositoryService.compareRepositories(request)

      if (response.success && response.comparison) {
        setComparison(response.comparison)
      } else {
        setError(response.message || "Failed to compare repositories")
        toast({
          title: "Error",
          description: response.message || "Failed to compare repositories",
          variant: "destructive",
        })
      }
    } catch (err) {
      setError("Failed to compare repositories")
      toast({
        title: "Error",
        description: "Failed to compare repositories",
        variant: "destructive",
      })
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <RepositoryContext.Provider
      value={{
        repositories,
        isLoading,
        error,
        selectedRepositories,
        setSelectedRepositories,
        toggleRepositorySelection,
        clearSelectedRepositories,
        repositoryStats,
        getRepositoryStats,
        comparison,
        isComparing,
        compareRepositories,
        refreshRepositories,
      }}
    >
      {children}
    </RepositoryContext.Provider>
  )
}

export function useRepositories() {
  const context = useContext(RepositoryContext)
  if (context === undefined) {
    throw new Error("useRepositories must be used within a RepositoryProvider")
  }
  return context
}
