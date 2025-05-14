"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, formatDistanceToNow } from "date-fns"
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  GitBranch,
  GitCommit,
  Globe,
  XCircle,
  RotateCw,
  Rocket,
  ArrowUpRight,
} from "lucide-react"

export interface VercelDeployment {
  id: string
  url: string
  name: string
  status: "building" | "ready" | "error" | "canceled" | "queued"
  createdAt: string
  readyAt?: string
  branch: string
  commit: {
    sha: string
    message: string
    author: string
  }
  meta: {
    buildTime?: number
    region?: string
    framework?: string
    nodeVersion?: string
  }
  buildLogs?: Array<{
    timestamp: string
    message: string
    type: "info" | "error" | "warning"
  }>
}

export interface VercelProject {
  id: string
  name: string
  framework: string
  url: string
  productionBranch: string
  latestDeployment?: VercelDeployment
  deployments: VercelDeployment[]
  domains: Array<{
    name: string
    verified: boolean
    primary: boolean
  }>
  team?: {
    name: string
    slug: string
  }
}

interface VercelDeploymentCardProps {
  project: VercelProject
  onRefresh?: () => void
  onRedeploy?: (deploymentId: string) => void
}

export function VercelDeploymentCard({ project, onRefresh, onRedeploy }: VercelDeploymentCardProps) {
  const [expandedDeployment, setExpandedDeployment] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Ready
          </Badge>
        )
      case "building":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Clock className="h-3.5 w-3.5 mr-1 animate-spin" />
            Building
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Error
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Canceled
          </Badge>
        )
      case "queued":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Queued
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const toggleDeploymentDetails = (deploymentId: string) => {
    if (expandedDeployment === deploymentId) {
      setExpandedDeployment(null)
    } else {
      setExpandedDeployment(deploymentId)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              {project.name}
              {project.team && <span className="text-sm text-muted-foreground">({project.team.name})</span>}
            </CardTitle>
            <CardDescription className="mt-1">
              {project.framework} • Production branch: {project.productionBranch}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RotateCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://vercel.com/${project.team?.slug || ""}/${project.name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View on Vercel
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {project.latestDeployment && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Latest Deployment</h3>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{project.latestDeployment.name}</h4>
                  {getStatusBadge(project.latestDeployment.status)}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={project.latestDeployment.url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-1" />
                      Visit
                    </a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Branch</div>
                  <div className="flex items-center">
                    <GitBranch className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-sm">{project.latestDeployment.branch}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Commit</div>
                  <div className="flex items-center">
                    <GitCommit className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-sm truncate" title={project.latestDeployment.commit.message}>
                      {project.latestDeployment.commit.sha.substring(0, 7)} -{" "}
                      {project.latestDeployment.commit.message.substring(0, 30)}
                      {project.latestDeployment.commit.message.length > 30 && "..."}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Deployed</div>
                  <div className="text-sm">
                    {project.latestDeployment.readyAt
                      ? formatDistanceToNow(new Date(project.latestDeployment.readyAt), { addSuffix: true })
                      : "In progress"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Build Time</div>
                  <div className="text-sm">
                    {project.latestDeployment.meta.buildTime
                      ? `${Math.round(project.latestDeployment.meta.buildTime / 1000)}s`
                      : "N/A"}
                  </div>
                </div>
              </div>
              {project.latestDeployment.status === "building" && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Build in progress</span>
                    <span>~2 min remaining</span>
                  </div>
                  <Progress value={45} className="h-1.5" />
                </div>
              )}
            </div>
          </div>
        )}

        <h3 className="text-sm font-medium mb-2">Deployment History</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {project.deployments.map((deployment) => (
              <div key={deployment.id} className="border rounded-lg overflow-hidden">
                <div
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleDeploymentDetails(deployment.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{deployment.name}</span>
                        {getStatusBadge(deployment.status)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(deployment.createdAt), "MMM d, yyyy h:mm a")} •{" "}
                        <span className="font-medium">{deployment.branch}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {deployment.status === "ready" && (
                      <Button variant="ghost" size="sm" className="h-7" asChild>
                        <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                          <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                          Visit
                        </a>
                      </Button>
                    )}
                    {(deployment.status === "error" || deployment.status === "canceled") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRedeploy?.(deployment.id)
                        }}
                      >
                        <RotateCw className="h-3.5 w-3.5 mr-1" />
                        Redeploy
                      </Button>
                    )}
                  </div>
                </div>
                {expandedDeployment === deployment.id && (
                  <div className="p-3 border-t bg-muted/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Commit</div>
                        <div className="text-sm flex items-center">
                          <GitCommit className="h-3.5 w-3.5 mr-1 text-blue-500" />
                          {deployment.commit.sha.substring(0, 7)} by {deployment.commit.author}
                        </div>
                        <div className="text-xs mt-1">{deployment.commit.message}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Deployment Info</div>
                        <div className="text-sm">
                          Region: {deployment.meta.region || "Auto"}
                          <br />
                          Node: {deployment.meta.nodeVersion || "N/A"}
                          <br />
                          Framework: {deployment.meta.framework || project.framework}
                        </div>
                      </div>
                    </div>
                    {deployment.buildLogs && deployment.buildLogs.length > 0 && (
                      <>
                        <div className="text-xs font-medium mb-2">Build Logs</div>
                        <ScrollArea className="h-[150px] border rounded p-2 bg-black text-white font-mono text-xs">
                          {deployment.buildLogs.map((log, index) => (
                            <div key={index} className="mb-1">
                              <span className="text-gray-400">[{log.timestamp}]</span>{" "}
                              <span
                                className={
                                  log.type === "error"
                                    ? "text-red-400"
                                    : log.type === "warning"
                                      ? "text-yellow-400"
                                      : "text-green-400"
                                }
                              >
                                {log.message}
                              </span>
                            </div>
                          ))}
                        </ScrollArea>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          Domains:
          {project.domains.map((domain) => (
            <Badge key={domain.name} variant="outline" className="ml-2">
              {domain.primary && <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />}
              {domain.name}
            </Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://vercel.com/${project.team?.slug || ""}/${project.name}/domains`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Manage Domains
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
