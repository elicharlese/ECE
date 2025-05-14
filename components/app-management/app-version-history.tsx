"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Download, GitBranch, GitCommit, GitMerge } from "lucide-react"

type Version = {
  version: string
  date: string
  commitHash: string
  author: string
  changes: string[]
  type: "major" | "minor" | "patch"
}

const mockVersions: Version[] = [
  {
    version: "1.2.3",
    date: "2023-04-15T10:30:00Z",
    commitHash: "8f4d76a",
    author: "Jane Smith",
    changes: ["Fixed authentication bug", "Improved performance by 15%", "Updated dependencies"],
    type: "patch",
  },
  {
    version: "1.2.0",
    date: "2023-04-01T09:45:00Z",
    commitHash: "3e2c19b",
    author: "John Doe",
    changes: ["Added new dashboard features", "Implemented dark mode", "Added export functionality"],
    type: "minor",
  },
  {
    version: "1.0.0",
    date: "2023-03-15T14:20:00Z",
    commitHash: "7a9b12c",
    author: "Jane Smith",
    changes: [
      "Initial stable release",
      "Complete UI overhaul",
      "Added user management",
      "Implemented payment processing",
    ],
    type: "major",
  },
]

export function AppVersionHistory() {
  const [versions] = useState<Version[]>(mockVersions)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getBadgeColor = (type: "major" | "minor" | "patch") => {
    switch (type) {
      case "major":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "minor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "patch":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Version History
          </span>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Changelog
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {versions.map((version, index) => (
            <div key={version.version} className="relative pl-6 pb-6">
              {index < versions.length - 1 && (
                <div className="absolute top-0 left-2 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}
              <div className="absolute top-0 left-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-semibold">v{version.version}</h3>
                <Badge className={getBadgeColor(version.type)}>{version.type}</Badge>
                <span className="ml-auto flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatDate(version.date)}
                </span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <GitCommit className="h-4 w-4" />
                <span>{version.commitHash}</span>
                <GitMerge className="ml-3 h-4 w-4" />
                <span>{version.author}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {version.changes.map((change, i) => (
                  <li key={i} className="text-sm">
                    • {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
