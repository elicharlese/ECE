"use client"
import { useBranch } from "@/context/branch-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Mock repository data
const mockRepositories = [
  { id: "repo1", name: "Frontend App" },
  { id: "repo2", name: "Backend API" },
  { id: "repo3", name: "Mobile App" },
]

export function BranchSelector() {
  const {
    branches,
    selectedRepository,
    baseBranch,
    compareBranch,
    loading,
    error,
    setSelectedRepository,
    setBaseBranch,
    setCompareBranch,
    compareBranches,
  } = useBranch()

  const handleRepositoryChange = async (repoId: string) => {
    await setSelectedRepository(repoId)
  }

  const handleBaseBranchChange = (branchName: string) => {
    const branch = branches.find((b) => b.name === branchName)
    if (branch) {
      setBaseBranch(branch)
    }
  }

  const handleCompareBranchChange = (branchName: string) => {
    const branch = branches.find((b) => b.name === branchName)
    if (branch) {
      setCompareBranch(branch)
    }
  }

  const handleCompare = () => {
    compareBranches()
  }

  return (
    <Card className="branch-selector-container">
      <CardHeader>
        <CardTitle>Compare Branches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Repository</label>
            <Select value={selectedRepository || ""} onValueChange={handleRepositoryChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>
              <SelectContent>
                {mockRepositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.id}>
                    {repo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRepository && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Base Branch</label>
                  <Select
                    value={baseBranch?.name || ""}
                    onValueChange={handleBaseBranchChange}
                    disabled={loading || branches.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select base branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.name}>
                          {branch.name} {branch.isDefault && "(default)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Compare Branch</label>
                  <Select
                    value={compareBranch?.name || ""}
                    onValueChange={handleCompareBranchChange}
                    disabled={loading || branches.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select compare branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.name} disabled={branch.name === baseBranch?.name}>
                          {branch.name} {branch.isDefault && "(default)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCompare} disabled={loading || !baseBranch || !compareBranch} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  "Compare Branches"
                )}
              </Button>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
