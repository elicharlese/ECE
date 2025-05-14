"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Check,
  Clock,
  Database,
  Download,
  MoreHorizontal,
  Plus,
  ArchiveRestoreIcon as Restore,
  Trash2,
} from "lucide-react"

type Backup = {
  id: string
  date: string
  size: string
  status: "completed" | "in-progress" | "failed"
  type: "automatic" | "manual"
  retention: number
}

const mockBackups: Backup[] = [
  {
    id: "backup-1",
    date: "2023-04-15T00:00:00Z",
    size: "1.2GB",
    status: "completed",
    type: "automatic",
    retention: 30,
  },
  {
    id: "backup-2",
    date: "2023-04-14T00:00:00Z",
    size: "1.2GB",
    status: "completed",
    type: "automatic",
    retention: 30,
  },
  {
    id: "backup-3",
    date: "2023-04-13T12:30:00Z",
    size: "1.1GB",
    status: "completed",
    type: "manual",
    retention: 90,
  },
  {
    id: "backup-4",
    date: "2023-04-12T00:00:00Z",
    size: "1.2GB",
    status: "completed",
    type: "automatic",
    retention: 30,
  },
  {
    id: "backup-5",
    date: "2023-04-11T00:00:00Z",
    status: "in-progress",
    size: "1.2GB",
    type: "automatic",
    retention: 30,
  },
  {
    id: "backup-6",
    date: "2023-04-10T00:00:00Z",
    size: "1.2GB",
    status: "failed",
    type: "automatic",
    retention: 30,
  },
]

export function AppBackups() {
  const [backups] = useState<Backup[]>(mockBackups)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadgeColor = (status: Backup["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
  }

  const getStatusIcon = (status: Backup["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <Trash2 className="h-4 w-4" />
    }
  }

  const getTypeBadgeColor = (type: Backup["type"]) => {
    switch (type) {
      case "automatic":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      case "manual":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    }
  }

  const handleCreateBackup = () => {
    setIsCreatingBackup(true)
    setBackupProgress(0)

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsCreatingBackup(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backups
          </span>
          <Button size="sm" onClick={handleCreateBackup} disabled={isCreatingBackup}>
            <Plus className="mr-2 h-4 w-4" />
            Create Backup
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCreatingBackup && (
          <div className="mb-4 rounded-md border bg-muted/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Creating backup...</span>
              <span className="text-sm">{backupProgress}%</span>
            </div>
            <Progress value={backupProgress} className="h-2" />
          </div>
        )}

        <Tabs defaultValue="all">
          <TabsList className="mb-4 grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="automatic">Automatic</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                <div className="col-span-4">Date</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Actions</div>
              </div>
              {backups.map((backup) => (
                <div key={backup.id} className="grid grid-cols-12 gap-4 border-b p-4 text-sm last:border-0">
                  <div className="col-span-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(backup.date)}</span>
                  </div>
                  <div className="col-span-2 flex items-center">{backup.size}</div>
                  <div className="col-span-2 flex items-center">
                    <Badge className={getStatusBadgeColor(backup.status)}>
                      <span className="mr-1">{getStatusIcon(backup.status)}</span>
                      {backup.status}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Badge className={getTypeBadgeColor(backup.type)}>{backup.type}</Badge>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Button variant="outline" size="icon" disabled={backup.status !== "completed"}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" disabled={backup.status !== "completed"}>
                      <Restore className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automatic" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Automatic backups will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Manual backups will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Backup schedule settings will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
