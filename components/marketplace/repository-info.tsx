import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  GitBranch,
  GitFork,
  Star,
  Eye,
  AlertCircle,
  GitPullRequest,
  Check,
  X,
  Clock,
  Code,
  FileCode,
  Scale,
} from "lucide-react"

interface RepositoryInfoProps {
  productId: string
}

export function RepositoryInfo({ productId }: RepositoryInfoProps) {
  // In a real app, this would fetch data from an API
  // For demo purposes, we'll use mock data
  const repoData = {
    name: `blockchain-product-${productId}`,
    description: "Enterprise blockchain solution with smart contract support",
    owner: "blockchain-enterprise",
    stars: 1243,
    forks: 342,
    watchers: 89,
    openIssues: 24,
    branches: [
      { name: "main", isDefault: true, commits: 1243, lastUpdated: "2 days ago" },
      { name: "develop", isDefault: false, commits: 1567, lastUpdated: "6 hours ago" },
      { name: "feature/new-contracts", isDefault: false, commits: 87, lastUpdated: "1 day ago" },
    ],
    pullRequests: {
      open: 12,
      closed: 342,
      merged: 287,
    },
    languages: [
      { name: "Solidity", percentage: 45 },
      { name: "TypeScript", percentage: 30 },
      { name: "JavaScript", percentage: 15 },
      { name: "Python", percentage: 10 },
    ],
    license: "MIT",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FileCode className="mr-2 h-5 w-5" />
                {repoData.owner}/{repoData.name}
              </h2>
              <p className="text-muted-foreground mt-1">{repoData.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <span className="flex items-center">
                  <Star className="mr-1 h-4 w-4" />
                  Star
                  <Badge variant="secondary" className="ml-2">
                    {repoData.stars}
                  </Badge>
                </span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <span className="flex items-center">
                  <GitFork className="mr-1 h-4 w-4" />
                  Fork
                  <Badge variant="secondary" className="ml-2">
                    {repoData.forks}
                  </Badge>
                </span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              <div>
                <div className="text-sm text-muted-foreground">Stars</div>
                <div className="font-medium">{repoData.stars}</div>
              </div>
            </div>
            <div className="flex items-center">
              <GitFork className="h-5 w-5 mr-2 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Forks</div>
                <div className="font-medium">{repoData.forks}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-purple-500" />
              <div>
                <div className="text-sm text-muted-foreground">Watchers</div>
                <div className="font-medium">{repoData.watchers}</div>
              </div>
            </div>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              <div>
                <div className="text-sm text-muted-foreground">Open Issues</div>
                <div className="font-medium">{repoData.openIssues}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <GitBranch className="mr-2 h-5 w-5" />
              Branches
            </h3>
            <div className="space-y-3">
              {repoData.branches.map((branch) => (
                <div key={branch.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center">
                    <GitBranch className="h-4 w-4 mr-2" />
                    <span className="font-medium">{branch.name}</span>
                    {branch.isDefault && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{branch.commits}</span> commits
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {branch.lastUpdated}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <GitPullRequest className="mr-2 h-5 w-5" />
                Pull Requests
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mr-2">
                      <Check className="h-3 w-3 mr-1" />
                      Merged
                    </Badge>
                  </div>
                  <div className="font-medium">{repoData.pullRequests.merged}</div>
                </div>
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 mr-2">
                      <X className="h-3 w-3 mr-1" />
                      Closed
                    </Badge>
                  </div>
                  <div className="font-medium">{repoData.pullRequests.closed}</div>
                </div>
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mr-2">
                      <GitPullRequest className="h-3 w-3 mr-1" />
                      Open
                    </Badge>
                  </div>
                  <div className="font-medium">{repoData.pullRequests.open}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Languages
              </h3>
              <div className="space-y-2">
                {repoData.languages.map((language) => (
                  <div key={language.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>{language.name}</span>
                      <span className="text-sm text-muted-foreground">{language.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${language.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center">
                  <Scale className="h-4 w-4 mr-2" />
                  <span className="text-sm">Let's fix the DeploymentInfo component:</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
