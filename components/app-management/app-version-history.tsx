"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  GitCommit,
  GitCompare,
  GitMerge,
  GitPullRequest,
  MoreHorizontal,
  Tag,
  Clock,
  User,
  ArrowDownToLine,
  RotateCcw,
} from "lucide-react"

interface AppVersionHistoryProps {
  app: any
}

export function AppVersionHistory({ app }: AppVersionHistoryProps) {
  // Ensure app and its properties exist to prevent errors
  if (!app) {
    return <div className="p-4 text-center">No app data available</div>
  }

  // Use a default array if versions is undefined
  const versions = app.versions || []

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Version History</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <GitCompare className="mr-2 h-4 w-4" />
            Compare Versions
          </Button>
          <Button variant="outline" size="sm">
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Download Logs
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Deployment Versions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {versions.length > 0 ? (
              versions.map((version: any, index: number) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="mt-0.5">
                    <Badge
                      variant={version.status === "success" ? "default" : "destructive"}
                      className="h-8 w-8 rounded-full p-0 flex items-center justify-center"
                    >
                      {version.status === "success" ? (
                        <GitCommit className="h-4 w-4" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
                      )}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">v{version.number || "0.0.1"}</h4>
                        <Badge variant="outline" className="text-xs">
                          {version.environment || "Production"}
                        </Badge>
                        {version.current && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{version.message || "Deployment completed"}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Tag className="mr-1 h-3 w-3" />
                        {version.commit || "Unknown commit"}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {version.timestamp ? formatTimeAgo(version.timestamp) : "Recently"}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="mr-1 h-3 w-3" />
                        {version.author || "Unknown user"}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <GitPullRequest className="mr-1 h-3 w-3" />
                        View PR
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <GitMerge className="mr-1 h-3 w-3" />
                        View Merge
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No version history available</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Deploy First Version
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
}
