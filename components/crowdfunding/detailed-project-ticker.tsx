"use client"

import { useState, useEffect, useCallback } from "react"
import {
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  Check,
  DollarSign,
  Users,
  Star,
  Zap,
  Shield,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

type ProjectUpdate = {
  id: string
  projectId: string
  projectName: string
  type:
    | "funding"
    | "milestone"
    | "trending"
    | "launch"
    | "completion"
    | "reward"
    | "backer"
    | "featured"
    | "security"
    | "partnership"
  amount?: number
  percentage?: number
  message: string
  timestamp: Date
  highlight?: boolean
  category?: string
}

type DetailedProjectTickerProps = {
  className?: string
  projectId?: string // If provided, only show updates for this project
  limit?: number
  showHeader?: boolean
  showTimestamp?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export function DetailedProjectTicker({
  className,
  projectId,
  limit = 5,
  showHeader = true,
  showTimestamp = true,
  autoRefresh = true,
  refreshInterval = 60000, // 1 minute
}: DetailedProjectTickerProps) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const isMobile = useMediaQuery("(max-width: 640px)")

  // Check if dark mode is enabled
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") || document.body.classList.contains("betting-dark-mode")
      setIsDarkMode(isDark)
    }

    checkDarkMode()

    // Set up a mutation observer to detect class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  }, [])

  // Fetch updates function with error handling
  const fetchUpdates = useCallback(() => {
    try {
      setIsRefreshing(true)
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      let mockUpdates = getMockProjectUpdates()

      // Filter by project if projectId is provided
      if (projectId) {
        mockUpdates = mockUpdates.filter((update) => update.projectId === projectId)
      }

      // Sort by timestamp (newest first) and limit
      mockUpdates = mockUpdates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)

      setUpdates(mockUpdates)
      setError(null)
    } catch (err) {
      console.error("Error fetching updates:", err)
      setError("Failed to load updates. Please try again.")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [projectId, limit])

  // Fetch updates on mount and when autoRefresh is triggered
  useEffect(() => {
    // Initial fetch
    fetchUpdates()

    // Set up interval for auto-refresh
    if (autoRefresh) {
      const intervalId = setInterval(fetchUpdates, refreshInterval)
      return () => clearInterval(intervalId)
    }
  }, [autoRefresh, refreshInterval, fetchUpdates])

  // Icon mapping for update types
  const getIcon = (type: ProjectUpdate["type"]) => {
    switch (type) {
      case "funding":
        return <DollarSign className="h-4 w-4" />
      case "milestone":
        return <Check className="h-4 w-4" />
      case "trending":
        return <TrendingUp className="h-4 w-4" />
      case "launch":
        return <Zap className="h-4 w-4" />
      case "completion":
        return <Award className="h-4 w-4" />
      case "reward":
        return <Clock className="h-4 w-4" />
      case "backer":
        return <Users className="h-4 w-4" />
      case "featured":
        return <Star className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "partnership":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  // Get color class based on update type
  const getColorClass = (type: ProjectUpdate["type"], highlight = false) => {
    if (highlight) return "text-yellow-500 dark:text-yellow-400"

    switch (type) {
      case "funding":
        return "text-green-600 dark:text-green-400"
      case "milestone":
        return "text-blue-600 dark:text-blue-400"
      case "trending":
        return "text-purple-600 dark:text-purple-400"
      case "launch":
        return "text-orange-600 dark:text-orange-400"
      case "completion":
        return "text-teal-600 dark:text-teal-400"
      case "reward":
        return "text-pink-600 dark:text-pink-400"
      case "backer":
        return "text-indigo-600 dark:text-indigo-400"
      case "featured":
        return "text-amber-600 dark:text-amber-400"
      case "security":
        return "text-red-600 dark:text-red-400"
      case "partnership":
        return "text-cyan-600 dark:text-cyan-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Get background class based on update type
  const getBgClass = (type: ProjectUpdate["type"], highlight = false) => {
    if (highlight) return "bg-yellow-50 dark:bg-yellow-900/20"

    switch (type) {
      case "funding":
        return "bg-green-50 dark:bg-green-900/20"
      case "milestone":
        return "bg-blue-50 dark:bg-blue-900/20"
      case "trending":
        return "bg-purple-50 dark:bg-purple-900/20"
      case "launch":
        return "bg-orange-50 dark:bg-orange-900/20"
      case "completion":
        return "bg-teal-50 dark:bg-teal-900/20"
      case "reward":
        return "bg-pink-50 dark:bg-pink-900/20"
      case "backer":
        return "bg-indigo-50 dark:bg-indigo-900/20"
      case "featured":
        return "bg-amber-50 dark:bg-amber-900/20"
      case "security":
        return "bg-red-50 dark:bg-red-900/20"
      case "partnership":
        return "bg-cyan-50 dark:bg-cyan-900/20"
      default:
        return "bg-gray-50 dark:bg-gray-900/20"
    }
  }

  // Loading state
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border/40 overflow-hidden",
          isDarkMode ? "betting-updates-panel" : "",
          className,
        )}
      >
        {showHeader && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-muted/50 dark:bg-gray-800/50 border-b border-border/40 flex justify-between items-center">
            <h3 className="font-medium text-sm">Live Project Updates</h3>
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        )}
        <div className="divide-y divide-border/30">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 sm:p-5 flex items-start gap-3 sm:gap-4">
              <div className="mt-0.5 p-1.5 rounded-full flex-shrink-0 bg-gray-200 dark:bg-gray-700 animate-pulse h-7 w-7 sm:h-8 sm:w-8"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <div className="h-3.5 sm:h-4 w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  {showTimestamp && (
                    <div className="h-3 w-14 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  )}
                </div>
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border/40 overflow-hidden",
        isDarkMode ? "betting-updates-panel" : "",
        className,
      )}
    >
      {showHeader && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-muted/50 dark:bg-gray-800/50 border-b border-border/40 flex justify-between items-center">
          <h3 className="font-medium text-sm">Live Project Updates</h3>
          <button
            onClick={fetchUpdates}
            disabled={isRefreshing}
            className={cn(
              "text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1",
              isRefreshing && "opacity-70 cursor-not-allowed",
            )}
            aria-label="Refresh updates"
          >
            <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      )}

      <div className="divide-y divide-border/30">
        {error && (
          <div className="p-4 sm:p-6 text-center">
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            <button
              onClick={fetchUpdates}
              className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!error && updates.length > 0
          ? updates.map((update) => (
              <div
                key={update.id}
                className={cn(
                  "p-3 sm:p-5 flex items-start gap-3 sm:gap-4 transition-colors",
                  getBgClass(update.type, update.highlight),
                  update.highlight ? "animate-pulse-subtle" : "",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 p-1.5 rounded-full flex-shrink-0",
                    getColorClass(update.type, update.highlight)
                      .replace("text-", "bg-")
                      .replace("dark:text-", "dark:bg-") + "/20",
                  )}
                >
                  <span className={getColorClass(update.type, update.highlight)}>{getIcon(update.type)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-medium text-xs sm:text-sm truncate">{update.projectName}</p>
                      {update.category && (
                        <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-muted/70 dark:bg-gray-800/70">
                          {update.category}
                        </span>
                      )}
                    </div>
                    {showTimestamp && (
                      <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
                        {getRelativeTime(update.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm mt-1.5 sm:mt-2 text-muted-foreground">{update.message}</p>

                  {update.percentage !== undefined && (
                    <div className="mt-2 sm:mt-3">
                      <div className="h-1 sm:h-1.5 bg-muted dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full animate-progress-fill",
                            getColorClass(update.type, update.highlight)
                              .replace("text-", "bg-")
                              .replace("dark:text-", "dark:bg-"),
                          )}
                          style={{ width: `${update.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 sm:mt-1.5">
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Progress</span>
                        <span className="text-[10px] sm:text-xs font-medium">{update.percentage}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          : !error && (
              <div className="p-4 sm:p-6 text-center text-sm text-muted-foreground">
                No recent updates
                {projectId && (
                  <>
                    <br />
                    <span className="text-xs">Try removing project filter</span>
                  </>
                )}
              </div>
            )}
      </div>
    </div>
  )
}

// Helper function to get mock project updates
function getMockProjectUpdates(): ProjectUpdate[] {
  return [
    {
      id: "pu1",
      projectId: "proj1",
      projectName: "Quantum Chain Protocol",
      type: "funding",
      amount: 12500,
      percentage: 68,
      message: "Received 12,500 ECE in new funding from Blockchain Capital, now at 68% of goal",
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      highlight: true,
      category: "DeFi",
    },
    {
      id: "pu2",
      projectId: "proj2",
      projectName: "MetaVerse Pioneers",
      type: "milestone",
      percentage: 75,
      message: "Completed alpha version of virtual world engine, unlocking new rewards tier",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      category: "Gaming",
    },
    {
      id: "pu3",
      projectId: "proj3",
      projectName: "ZK-Rollup Solution",
      type: "trending",
      percentage: 92,
      message: "Trending with +215% increase in backers after successful technical demo",
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      category: "Privacy",
    },
    {
      id: "pu4",
      projectId: "proj4",
      projectName: "Decentralized Cloud",
      type: "launch",
      percentage: 25,
      message: "Just launched with 25% early backer bonus for first 48 hours only",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      highlight: true,
      category: "Infrastructure",
    },
    {
      id: "pu5",
      projectId: "proj5",
      projectName: "Sovereign ID Network",
      type: "completion",
      percentage: 100,
      message: "Successfully completed funding round with 120% of target, moving to development phase",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      category: "Identity",
    },
    {
      id: "pu6",
      projectId: "proj6",
      projectName: "Cross-Chain Bridge",
      type: "reward",
      message: "Unlocked new exclusive Platinum tier with hardware wallet integration",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      category: "Infrastructure",
    },
    {
      id: "pu7",
      projectId: "proj1",
      projectName: "Quantum Chain Protocol",
      type: "backer",
      message: "Gained 50 new backers in the last hour after technical whitepaper release",
      timestamp: new Date(Date.now() - 3900000), // 65 minutes ago
      category: "DeFi",
    },
    {
      id: "pu8",
      projectId: "proj3",
      projectName: "ZK-Rollup Solution",
      type: "featured",
      message: "Selected as featured project of the day by ECE editorial team",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      highlight: true,
      category: "Privacy",
    },
    {
      id: "pu9",
      projectId: "proj7",
      projectName: "Neural DAO",
      type: "partnership",
      message: "Announced strategic partnership with Ethereum Foundation for governance research",
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      category: "Governance",
    },
    {
      id: "pu10",
      projectId: "proj8",
      projectName: "Interstellar Exchange",
      type: "security",
      message: "Completed comprehensive security audit by Trail of Bits with zero critical findings",
      timestamp: new Date(Date.now() - 18000000), // 5 hours ago
      category: "Exchange",
    },
    {
      id: "pu11",
      projectId: "proj9",
      projectName: "Blockchain Gaming Guild",
      type: "milestone",
      percentage: 60,
      message: "Released SDK for game developers, now integrated with 5 upcoming titles",
      timestamp: new Date(Date.now() - 21600000), // 6 hours ago
      category: "Gaming",
    },
    {
      id: "pu12",
      projectId: "proj10",
      projectName: "Decentralized Science",
      type: "funding",
      amount: 25000,
      percentage: 45,
      message: "Secured 25,000 ECE grant from Science Foundation for open research platform",
      timestamp: new Date(Date.now() - 25200000), // 7 hours ago
      category: "Research",
    },
    {
      id: "pu13",
      projectId: "proj11",
      projectName: "Carbon Credit Oracle",
      type: "launch",
      percentage: 15,
      message: "Launched carbon credit verification network with 15 initial validators",
      timestamp: new Date(Date.now() - 28800000), // 8 hours ago
      category: "Climate",
    },
    {
      id: "pu14",
      projectId: "proj12",
      projectName: "Regenerative Finance",
      type: "trending",
      percentage: 78,
      message: "Trending in sustainability category with +178% increase in engagement",
      timestamp: new Date(Date.now() - 32400000), // 9 hours ago
      category: "Finance",
    },
    {
      id: "pu15",
      projectId: "proj13",
      projectName: "Tokenized Real Estate",
      type: "partnership",
      message: "Partnered with major property developer for first tokenized commercial building",
      timestamp: new Date(Date.now() - 36000000), // 10 hours ago
      highlight: true,
      category: "Real Estate",
    },
  ]
}
