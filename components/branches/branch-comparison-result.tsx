"use client"

import { useBranch } from "@/context/branch-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { GitBranch, GitCommit, FileCode, GitCompare, AlertTriangle, Check } from "lucide-react"

export function BranchComparisonResult() {
  const { comparison, baseBranch, compareBranch } = useBranch()

  if (!comparison || !baseBranch || !compareBranch) {
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GitCompare className="mr-2 h-5 w-5" />
          Comparing {baseBranch.name} with {compareBranch.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="branch-stats-card">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Commits</div>
                <GitCommit className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">{comparison.stats.commits}</div>
            </CardContent>
          </Card>

          <Card className="branch-stats-card">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Files Changed</div>
                <FileCode className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">{comparison.stats.files}</div>
            </CardContent>
          </Card>

          <Card className="branch-stats-card">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Merge Status</div>
                {comparison.stats.mergeStatus === "clean" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : comparison.stats.mergeStatus === "conflicts" ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="text-2xl font-bold mt-2 capitalize">{comparison.stats.mergeStatus}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="branch-comparison-tabs">
            <TabsTrigger value="overview" className="branch-comparison-tab">
              Overview
            </TabsTrigger>
            <TabsTrigger value="commits" className="branch-comparison-tab">
              Commits
            </TabsTrigger>
            <TabsTrigger value="files" className="branch-comparison-tab">
              Files
            </TabsTrigger>
            <TabsTrigger value="diff" className="branch-comparison-tab">
              Diff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="branch-comparison-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Base: {baseBranch.name}</h3>
                <div className="text-sm text-muted-foreground mb-4">Last commit: {baseBranch.lastCommitMessage}</div>
                <div className="text-sm">
                  <div className="flex items-center mb-1">
                    <span className="font-medium mr-2">Author:</span> {baseBranch.lastCommitAuthor}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Date:</span>
                    {formatDistanceToNow(new Date(baseBranch.lastCommitDate), { addSuffix: true })}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Compare: {compareBranch.name}</h3>
                <div className="text-sm text-muted-foreground mb-4">Last commit: {compareBranch.lastCommitMessage}</div>
                <div className="text-sm">
                  <div className="flex items-center mb-1">
                    <span className="font-medium mr-2">Author:</span> {compareBranch.lastCommitAuthor}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Date:</span>
                    {formatDistanceToNow(new Date(compareBranch.lastCommitDate), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Changes Summary</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>{comparison.stats.additions} additions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>{comparison.stats.deletions} deletions</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="commits" className="branch-comparison-content">
            <ScrollArea className="branch-commit-list">
              {comparison.commits.map((commit) => (
                <div key={commit.id} className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        {commit.avatarUrl ? (
                          <img
                            src={commit.avatarUrl || "/placeholder.svg"}
                            alt={commit.author}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <GitCommit className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{commit.message}</div>
                      <div className="text-sm text-muted-foreground">
                        {commit.author} committed {formatDistanceToNow(new Date(commit.date), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">{commit.id.substring(0, 7)}</div>
                  </div>
                  <Separator className="mt-3" />
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="files" className="branch-comparison-content">
            <ScrollArea className="branch-file-list">
              {comparison.files.map((file) => (
                <div key={file.filename} className="py-3">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <Badge
                        variant={
                          file.status === "added" ? "success" : file.status === "modified" ? "outline" : "destructive"
                        }
                      >
                        {file.status}
                      </Badge>
                    </div>
                    <div className="font-mono text-sm">{file.filename}</div>
                    <div className="ml-auto flex items-center space-x-2 text-sm">
                      <span className="text-green-600">+{file.additions}</span>
                      <span className="text-red-600">-{file.deletions}</span>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="diff" className="branch-comparison-content">
            <div className="branch-diff-view">
              <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                {comparison.diffText?.split("\n").map((line, index) => {
                  let lineClass = ""
                  if (line.startsWith("+")) lineClass = "branch-diff-addition"
                  else if (line.startsWith("-")) lineClass = "branch-diff-deletion"
                  else if (line.startsWith("@@")) lineClass = "branch-diff-hunk-header"

                  return (
                    <div key={index} className={`branch-diff-line ${lineClass}`}>
                      <span className="branch-diff-line-number">{index + 1}</span>
                      <span className="branch-diff-line-content">{line}</span>
                    </div>
                  )
                })}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
