"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Download, FileText, Info, Search, XCircle } from "lucide-react"

type LogEntry = {
  id: string
  timestamp: string
  level: "info" | "warning" | "error"
  source: string
  message: string
  details?: string
}

const mockLogs: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "2023-04-15T10:30:45Z",
    level: "error",
    source: "api/auth",
    message: "Failed to authenticate user: Invalid credentials",
    details: "Error: Authentication failed for user john.doe@example.com",
  },
  {
    id: "log-2",
    timestamp: "2023-04-15T10:29:30Z",
    level: "warning",
    source: "database",
    message: "Slow query detected",
    details: "Query took 2.5s to execute: SELECT * FROM transactions WHERE user_id = '123' AND date > '2023-01-01'",
  },
  {
    id: "log-3",
    timestamp: "2023-04-15T10:28:15Z",
    level: "info",
    source: "system",
    message: "Application started successfully",
    details: "Server listening on port 3000",
  },
  {
    id: "log-4",
    timestamp: "2023-04-15T10:27:00Z",
    level: "info",
    source: "api/users",
    message: "User profile updated",
    details: "User ID: 456, Fields: name, email",
  },
  {
    id: "log-5",
    timestamp: "2023-04-15T10:26:45Z",
    level: "warning",
    source: "api/payments",
    message: "Payment processing delayed",
    details: "Payment ID: 789, Reason: Gateway timeout",
  },
  {
    id: "log-6",
    timestamp: "2023-04-15T10:25:30Z",
    level: "error",
    source: "database",
    message: "Database connection failed",
    details: "Error: Connection refused to database host db-server-1",
  },
  {
    id: "log-7",
    timestamp: "2023-04-15T10:24:15Z",
    level: "info",
    source: "system",
    message: "Scheduled maintenance completed",
    details: "Duration: 5 minutes, Services affected: none",
  },
]

export function AppLogs() {
  const [logs] = useState<LogEntry[]>(mockLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesSource = sourceFilter === "all" || log.source === sourceFilter

    return matchesSearch && matchesLevel && matchesSource
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getLevelIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getLevelBadgeColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
  }

  const uniqueSources = Array.from(new Set(logs.map((log) => log.source)))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Logs
          </span>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="mb-4 flex flex-col space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="warnings">Warnings</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <div key={log.id} className="border-b p-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        <Badge className={getLevelBadgeColor(log.level)}>{log.level}</Badge>
                        <Badge variant="outline">{log.source}</Badge>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
                    </div>
                    <p className="mt-2 text-sm">{log.message}</p>
                    {log.details && (
                      <pre className="mt-2 max-h-32 overflow-auto rounded-md bg-gray-100 p-2 text-xs dark:bg-gray-800">
                        {log.details}
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex h-32 items-center justify-center p-4 text-center">
                  <p className="text-sm text-gray-500">No logs found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="errors" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Error logs will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="warnings" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Warning logs will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="info" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Info logs will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
