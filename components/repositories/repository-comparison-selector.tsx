"use client"

import { useState } from "react"
import { useRepositories } from "@/context/repository-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RepositoryCard } from "./repository-card"
import { GitCompare } from "lucide-react"

export function RepositoryComparisonSelector() {
  const {
    repositories,
    selectedRepositories,
    toggleRepositorySelection,
    clearSelectedRepositories,
    compareRepositories,
    isComparing,
  } = useRepositories()

  const [isOpen, setIsOpen] = useState(false)
  const [includeDiff, setIncludeDiff] = useState(true)
  const [includeStats, setIncludeStats] = useState(true)
  const [includePerformance, setIncludePerformance] = useState(true)
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month")

  const handleCompare = async () => {
    if (selectedRepositories.length < 2) return

    await compareRepositories({
      repositories: selectedRepositories,
      includeDiff,
      includeStats,
      includePerformance,
      period,
    })

    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={selectedRepositories.length < 2} className="gap-2">
        <GitCompare className="h-4 w-4" />
        Compare Repositories
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Compare Repositories</DialogTitle>
            <DialogDescription>Configure comparison settings and select repositories to compare</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Selected Repositories</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {repositories
                  .filter((repo) => selectedRepositories.includes(repo.id))
                  .map((repo) => (
                    <RepositoryCard
                      key={repo.id}
                      repository={repo}
                      isSelected={true}
                      onToggleSelect={toggleRepositorySelection}
                      showCheckbox={false}
                    />
                  ))}
              </div>
              {selectedRepositories.length < 2 && (
                <p className="text-sm text-amber-500">Please select at least 2 repositories to compare</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Comparison Options</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-diff"
                      checked={includeDiff}
                      onCheckedChange={(checked) => setIncludeDiff(!!checked)}
                    />
                    <Label htmlFor="include-diff">Include code differences</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-stats"
                      checked={includeStats}
                      onCheckedChange={(checked) => setIncludeStats(!!checked)}
                    />
                    <Label htmlFor="include-stats">Include repository statistics</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-performance"
                      checked={includePerformance}
                      onCheckedChange={(checked) => setIncludePerformance(!!checked)}
                    />
                    <Label htmlFor="include-performance">Include performance metrics</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Activity period</Label>
                  <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompare} disabled={selectedRepositories.length < 2 || isComparing}>
              {isComparing ? "Comparing..." : "Compare"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
