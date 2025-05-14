"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitPullRequestClosed,
  GitMerge,
  AlertCircle,
  CheckCircle2,
  Clock,
  Code,
  ExternalLink,
  Eye,
  MessageSquare,
  Star,
  GitFork,
} from "lucide-react"

export interface GitHubCommit {
  id: string
  message: string
  author: {
    name: string
    avatar: string
    username: string
  }
  date: string
  sha: string
  branch: string
}

export interface GitHubPullRequest {
  id: string
  title: string
  number: number
  author: {
    name: string
    avatar: string
    username: string
  }
  status: "open" | "closed" | "merged"
  createdAt: string
  updatedAt: string
  branch: string
  targetBranch: string
  comments: number
}

export interface GitHubIssue {
  id: string
  title: string
  number: number
  author: {
    name: string
    avatar: string
    username: string
  }
  status: "open" | "closed"
  createdAt: string
  updatedAt: string
  labels: Array<{
    name: string
    color: string
  }>
  comments: number
  assignees: Array<{
    name: string
    avatar: string
    username: string
  }>
}

export interface GitHubRepository {
  name: string
  owner: string
  description: string
  url: string
  stars: number
  forks: number
  watchers: number
  defaultBranch: string
  branches: string[]
  commits: GitHubCommit[]
  pullRequests: GitHubPullRequest[]
  issues: GitHubIssue[]
  lastUpdated: string
}

interface GitHubRepositoryCardProps {
  repository: GitHubRepository
  onRefresh?: () => void
}

export function GitHubRepositoryCard({ repository, onRefresh }: GitHubRepositoryCardProps) {
  const [activeTab, setActiveTab] = useState("commits")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "merged":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <GitPullRequest className="h-3.5 w-3.5 text-green-500" />
      case "closed":
        return <GitPullRequestClosed className="h-3.5 w-3.5 text-red-500" />
      case "merged":
        return <GitMerge className="h-3.5 w-3.5 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Code className="h-5 w-5" />
              {repository.owner}/{repository.name}
            </CardTitle>
            <CardDescription className="mt-1">{repository.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={repository.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">{repository.stars} stars</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{repository.forks} forks</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-purple-500" />
            <span className="text-sm">{repository.watchers} watchers</span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch className="h-4 w-4 text-green-500" />
            <span className="text-sm">{repository.branches.length} branches</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Updated {formatDistanceToNow(new Date(repository.lastUpdated))} ago</span>
          </div>
        </div>

        <Tabs defaultValue="commits" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="commits">Commits</TabsTrigger>
            <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="commits" className="mt-0">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {repository.commits.map((commit) => (
                  <div key={commit.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={commit.author.avatar || "/placeholder.svg"} alt={commit.author.name} />
                          <AvatarFallback>{commit.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{commit.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">{commit.author.name}</span> committed{" "}
                            {formatDistanceToNow(new Date(commit.date))} ago on{" "}
                            <Badge variant="outline" className="ml-1 text-xs">
                              <GitBranch className="h-3 w-3 mr-1" />
                              {commit.branch}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                          <a href={`${repository.url}/commit/${commit.sha}`} target="_blank" rel="noopener noreferrer">
                            <GitCommit className="h-3.5 w-3.5 mr-1" />
                            {commit.sha.substring(0, 7)}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="pull-requests" className="mt-0">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {repository.pullRequests.map((pr) => (
                  <div key={pr.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={pr.author.avatar || "/placeholder.svg"} alt={pr.author.name} />
                          <AvatarFallback>{pr.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {pr.title}
                            <Badge variant="outline" className={getStatusColor(pr.status)}>
                              {getStatusIcon(pr.status)}
                              <span className="ml-1">{pr.status}</span>
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">#{pr.number}</span> opened by{" "}
                            <span className="font-medium">{pr.author.username}</span>{" "}
                            {formatDistanceToNow(new Date(pr.createdAt))} ago
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <GitBranch className="h-3 w-3 mr-1" />
                              {pr.branch} → {pr.targetBranch}
                            </Badge>
                            {pr.comments > 0 && (
                              <div className="text-xs flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {pr.comments}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                        <a href={`${repository.url}/pull/${pr.number}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="issues" className="mt-0">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {repository.issues.map((issue) => (
                  <div key={issue.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={issue.author.avatar || "/placeholder.svg"} alt={issue.author.name} />
                          <AvatarFallback>{issue.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {issue.title}
                            <Badge
                              variant="outline"
                              className={
                                issue.status === "open"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }
                            >
                              {issue.status === "open" ? (
                                <AlertCircle className="h-3.5 w-3.5 text-green-500 mr-1" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5 text-red-500 mr-1" />
                              )}
                              {issue.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">#{issue.number}</span> opened by{" "}
                            <span className="font-medium">{issue.author.username}</span>{" "}
                            {formatDistanceToNow(new Date(issue.createdAt))} ago
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {issue.labels.map((label) => (
                              <Badge
                                key={label.name}
                                variant="outline"
                                className="text-xs"
                                style={{
                                  backgroundColor: `#${label.color}20`,
                                  color: `#${label.color}`,
                                  borderColor: `#${label.color}40`,
                                }}
                              >
                                {label.name}
                              </Badge>
                            ))}
                            {issue.comments > 0 && (
                              <div className="text-xs flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {issue.comments}
                              </div>
                            )}
                          </div>
                          {issue.assignees.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-xs text-muted-foreground">Assignees:</span>
                              <div className="flex -space-x-2">
                                {issue.assignees.map((assignee) => (
                                  <Avatar key={assignee.username} className="h-5 w-5 border border-background">
                                    <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                                    <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                        <a href={`${repository.url}/issues/${issue.number}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          Default branch: <Badge variant="outline">{repository.defaultBranch}</Badge>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={`${repository.url}/actions`} target="_blank" rel="noopener noreferrer">
            View CI/CD
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
