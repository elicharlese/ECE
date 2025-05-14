"use client"

import { RepositoryProvider } from "@/context/repository-context"
import { RepositoryList } from "@/components/repositories/repository-list"
import { RepositoryComparisonSelector } from "@/components/repositories/repository-comparison-selector"
import { RepositoryComparisonResult } from "@/components/repositories/repository-comparison-result"

export default function RepositoriesPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
        <p className="text-muted-foreground">Manage and compare your repositories</p>
      </div>

      <RepositoryProvider>
        <div className="flex justify-end">
          <RepositoryComparisonSelector />
        </div>

        <RepositoryComparisonResult />

        <RepositoryList />
      </RepositoryProvider>
    </div>
  )
}
