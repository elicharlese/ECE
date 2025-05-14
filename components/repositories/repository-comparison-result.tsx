"use client"

import { useState } from "react"
import { useRepositories } from "@/context/repository-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  FileText,
  GitCommit,
  GitPullRequest,
  Clock,
  Users,
  Code,
  AlertTriangle,
  Zap,
  FileCode,
  Download,
} from "lucide-react"
import { format } from "date-fns"

export function RepositoryComparisonResult() {
  const { comparison, repositories } = useRepositories()
  const [activeTab, setActiveTab] = useState("overview")

  if (!comparison) return null

  // Find repository objects from IDs
  const comparedRepos = comparison.repositories

  // Generate colors for charts
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

  // Format activity data for charts
  const activityData = comparison.activityComparison.map((period) => {
    const formattedData: any = { period: period.period }

    Object.entries(period.commits).forEach(([repoId, count], index) => {
      const repo = comparedRepos.find((r) => r.id === repoId)
      if (repo) {
        formattedData[`${repo.name} Commits`] = count
      }
    })

    return formattedData
  })

  // Format language data for pie charts
  const languageCharts = comparedRepos
    .map((repo) => {
      const stats = comparison.stats[repo.id]
      if (!stats) return null

      return {
        repo,
        data: stats.languageBreakdown.map((lang) => ({
          name: lang.language,
          value: lang.percentage,
          color: lang.color,
        })),
      }
    })
    .filter(Boolean)

  // Format file comparison data
  const fileComparisonData = comparison.fileComparisons.map((file) => ({
    name: file.path.split("/").pop() || file.path,
    additions: file.differences.additions,
    deletions: file.differences.deletions,
    changes: file.differences.changes,
    path: file.path,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Repository Comparison</CardTitle>
        <CardDescription>Comparing {comparedRepos.map((repo) => repo.name).join(" vs ")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            {comparison.performanceMetrics && <TabsTrigger value="performance">Performance</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              {comparedRepos.map((repo) => {
                const stats = comparison.stats[repo.id]
                if (!stats) return null

                return (
                  <Card key={repo.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                      <CardDescription>{repo.owner}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <GitCommit className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Commits:</span>
                            <span className="ml-auto font-medium">{stats.commitCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Contributors:</span>
                            <span className="ml-auto font-medium">{stats.contributorCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <GitPullRequest className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Pull Requests:</span>
                            <span className="ml-auto font-medium">{stats.pullRequestCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Issues:</span>
                            <span className="ml-auto font-medium">{stats.issueCount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Last Commit:</span>
                            <span className="ml-auto font-medium">
                              {format(new Date(stats.lastCommitDate), "MMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Avg. Time to Merge:</span>
                            <span className="ml-auto font-medium">
                              {stats.averageTimeToMerge ? `${stats.averageTimeToMerge}h` : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Primary Language:</span>
                            <span className="ml-auto font-medium">{stats.languageBreakdown[0]?.language || "N/A"}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Size:</span>
                            <span className="ml-auto font-medium">{(repo.size / 1024).toFixed(1)} MB</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Commit Activity</CardTitle>
                  <CardDescription>Commit frequency comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {comparedRepos.map((repo, index) => (
                          <Bar key={repo.id} dataKey={`${repo.name} Commits`} fill={colors[index % colors.length]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pull Request Activity</CardTitle>
                    <CardDescription>Pull request frequency comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={comparison.activityComparison.map((period) => {
                            const data: any = { period: period.period }
                            Object.entries(period.pullRequests).forEach(([repoId, count], index) => {
                              const repo = comparedRepos.find((r) => r.id === repoId)
                              if (repo) {
                                data[repo.name] = count
                              }
                            })
                            return data
                          })}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {comparedRepos.map((repo, index) => (
                            <Bar key={repo.id} dataKey={repo.name} fill={colors[index % colors.length]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Issue Activity</CardTitle>
                    <CardDescription>Issue frequency comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={comparison.activityComparison.map((period) => {
                            const data: any = { period: period.period }
                            Object.entries(period.issues).forEach(([repoId, count], index) => {
                              const repo = comparedRepos.find((r) => r.id === repoId)
                              if (repo) {
                                data[repo.name] = count
                              }
                            })
                            return data
                          })}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {comparedRepos.map((repo, index) => (
                            <Bar key={repo.id} dataKey={repo.name} fill={colors[index % colors.length]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">File Differences</CardTitle>
                  <CardDescription>Changes between repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={fileComparisonData} layout="vertical" margin={{ left: 120 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="additions" fill="#10b981" name="Additions" />
                        <Bar dataKey="deletions" fill="#ef4444" name="Deletions" />
                        <Bar dataKey="changes" fill="#3b82f6" name="Changes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Common Files</CardTitle>
                    <CardDescription>Files present in all repositories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto">
                      <ul className="space-y-2">
                        {comparison.commonFiles.map((file) => (
                          <li key={file} className="flex items-center text-sm">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{file}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Unique Files</CardTitle>
                    <CardDescription>Files unique to each repository</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="space-y-4">
                        {Object.entries(comparison.uniqueFiles).map(([repoId, files]) => {
                          const repo = comparedRepos.find((r) => r.id === repoId)
                          if (!repo) return null

                          return (
                            <div key={repoId}>
                              <h4 className="text-sm font-medium mb-2">{repo.name}</h4>
                              <ul className="space-y-1">
                                {files.slice(0, 5).map((file) => (
                                  <li key={file} className="flex items-center text-sm">
                                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{file}</span>
                                  </li>
                                ))}
                                {files.length > 5 && (
                                  <li className="text-sm text-muted-foreground">+ {files.length - 5} more files</li>
                                )}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="languages">
            <div className="grid gap-6 md:grid-cols-2">
              {languageCharts.map((chart) => (
                <Card key={chart.repo.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{chart.repo.name}</CardTitle>
                    <CardDescription>Language breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chart.data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {chart.data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {comparison.performanceMetrics && (
            <TabsContent value="performance">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Build Performance</CardTitle>
                    <CardDescription>Build time and test coverage comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={Object.entries(comparison.performanceMetrics.buildTime).map(([repoId, time]) => {
                              const repo = comparedRepos.find((r) => r.id === repoId)
                              return {
                                name: repo?.name || repoId,
                                value: time,
                              }
                            })}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: "Seconds", angle: -90, position: "insideLeft" }} />
                            <Tooltip formatter={(value) => `${value} seconds`} />
                            <Bar dataKey="value" fill="#3b82f6" name="Build Time" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={Object.entries(comparison.performanceMetrics.testCoverage).map(
                              ([repoId, coverage]) => {
                                const repo = comparedRepos.find((r) => r.id === repoId)
                                return {
                                  name: repo?.name || repoId,
                                  value: coverage,
                                }
                              },
                            )}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: "Percentage", angle: -90, position: "insideLeft" }} />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Bar dataKey="value" fill="#10b981" name="Test Coverage" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Code Quality</CardTitle>
                    <CardDescription>Code quality metrics comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      {comparedRepos.map((repo) => {
                        const metrics = comparison.performanceMetrics?.codeQuality[repo.id]
                        if (!metrics) return null

                        return (
                          <Card key={repo.id}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{repo.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                                    Bugs
                                  </span>
                                  <Badge variant={metrics.bugs > 3 ? "destructive" : "outline"}>{metrics.bugs}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                    Vulnerabilities
                                  </span>
                                  <Badge variant={metrics.vulnerabilities > 0 ? "destructive" : "outline"}>
                                    {metrics.vulnerabilities}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm flex items-center">
                                    <Code className="h-4 w-4 mr-2 text-blue-500" />
                                    Code Smells
                                  </span>
                                  <Badge variant={metrics.codeSmells > 10 ? "destructive" : "outline"}>
                                    {metrics.codeSmells}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm flex items-center">
                                    <Zap className="h-4 w-4 mr-2 text-purple-500" />
                                    Duplications
                                  </span>
                                  <Badge variant={metrics.duplications > 5 ? "destructive" : "outline"}>
                                    {metrics.duplications}%
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
