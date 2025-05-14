import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  BarChart,
  Users,
  Lock,
  Unlock,
} from "lucide-react"

interface ProjectRepositoryInfoProps {
  projectId: string
}

export function ProjectRepositoryInfo({ projectId }: ProjectRepositoryInfoProps) {
  // In a real app, this would fetch data from an API
  // For demo purposes, we'll use mock data
  const repoData = {
    name: `blockchain-project-${projectId}`,
    description: "Enterprise blockchain solution with smart contract support",
    owner: "blockchain-enterprise",
    private: true,
    stars: 43,
    forks: 12,
    watchers: 15,
    openIssues: 8,
    branches: [
      { name: "main", isDefault: true, commits: 243, lastUpdated: "2 days ago" },
      { name: "develop", isDefault: false, commits: 367, lastUpdated: "6 hours ago" },
      { name: "feature/payment-gateway", isDefault: false, commits: 47, lastUpdated: "1 day ago" },
    ],
    pullRequests: {
      open: 5,
      closed: 42,
      merged: 37,
    },
    languages: [
      { name: "Solidity", percentage: 45 },
      { name: "TypeScript", percentage: 30 },
      { name: "JavaScript", percentage: 15 },
      { name: "Python", percentage: 10 },
    ],
    license: "MIT",
    contributors: [
      { name: "Jane Smith", commits: 143, additions: 12500, deletions: 8700 },
      { name: "John Doe", commits: 98, additions: 8900, deletions: 5400 },
      { name: "Alice Johnson", commits: 76, additions: 6200, deletions: 3100 },
    ],
    commitActivity: [
      { week: "This week", commits: 23 },
      { week: "Last week", commits: 31 },
      { week: "2 weeks ago", commits: 18 },
      { week: "3 weeks ago", commits: 27 },
    ],
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
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">{repoData.description}</p>
                {repoData.private ? (
                  <Badge variant="outline" className="flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center">
                    <Unlock className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                )}
              </div>
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
                  <span className="text-sm">{repoData.license} License</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repoData.contributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {contributor.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{contributor.name}</div>
                      <div className="text-xs text-muted-foreground">{contributor.commits} commits</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="text-green-600">+{contributor.additions}</span> /{" "}
                    <span className="text-red-600">-{contributor.deletions}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Commit Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repoData.commitActivity.map((week, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{week.week}</span>
                    <span className="text-sm font-medium">{week.commits} commits</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${(week.commits / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
