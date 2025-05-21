"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { TrendingUp, Award, Clock, AlertCircle, Check, DollarSign, Users, Star } from "lucide-react"
import { cn } from "@/lib/utils"

type TickerUpdate = {
  id: string
  type: "funding" | "milestone" | "trending" | "launch" | "completion" | "reward" | "backer" | "featured"
  project: string
  action: string
  amount: string
  timestamp: Date
  highlight?: boolean
}

type LiveUpdatesTickerProps = {
  className?: string
  speed?: number // pixels per second
  pauseOnHover?: boolean
  updates?: TickerUpdate[]
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
  showControls?: boolean
}

export function LiveUpdatesTicker({
  className,
  speed = 4, // Reduced from 8 to 4 for even slower movement
  pauseOnHover = true,
  updates: initialUpdates,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  showControls = true,
}: LiveUpdatesTickerProps) {
  // If no updates are provided, use demo data
  const [updates, setUpdates] = useState<TickerUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [tickerWidth, setTickerWidth] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const [animationDuration, setAnimationDuration] = useState(180) // seconds
  const [isScrolled, setIsScrolled] = useState(false)

  // Load initial updates
  useEffect(() => {
    try {
      setLoading(true)
      const data = initialUpdates || getDemoUpdates()
      setUpdates(data)
      setError(null)
    } catch (err) {
      setError("Failed to load ticker updates")
      // Fallback to empty array if there's an error
      setUpdates([])
    } finally {
      setLoading(false)
    }
  }, [initialUpdates])

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

  // Calculate ticker dimensions for smooth animation
  useEffect(() => {
    if (!tickerRef.current || !contentRef.current) return

    const calculateDimensions = () => {
      const tickerElement = tickerRef.current
      const contentElement = contentRef.current

      if (tickerElement && contentElement) {
        const newTickerWidth = tickerElement.offsetWidth
        const newContentWidth = contentElement.scrollWidth

        setTickerWidth(newTickerWidth)
        setContentWidth(newContentWidth)

        // Calculate animation duration based on content width and speed
        // The slower the speed, the longer the duration
        const calculatedDuration = Math.max(180, newContentWidth / speed)
        setAnimationDuration(calculatedDuration)
      }
    }

    // Initial calculation
    calculateDimensions()

    // Recalculate on window resize
    const handleResize = () => {
      calculateDimensions()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [updates, speed])

  // Simulate fetching new updates
  useEffect(() => {
    if (!autoRefresh) return

    const fetchNewUpdates = () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll just add a new random update
        const newUpdate = generateRandomUpdate()
        setUpdates((prev) => [newUpdate, ...prev.slice(0, 19)]) // Keep last 20 updates
        setError(null)
      } catch (err) {
        console.error("Error refreshing ticker data:", err)
        // Don't update state on error to keep existing data
      }
    }

    const intervalId = setInterval(fetchNewUpdates, refreshInterval)
    return () => clearInterval(intervalId)
  }, [autoRefresh, refreshInterval])

  // Track scroll position for styling
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle pause state
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  // Icon mapping for update types
  const getIcon = (type: TickerUpdate["type"]) => {
    switch (type) {
      case "funding":
        return <DollarSign className="h-3 w-3" />
      case "milestone":
        return <Check className="h-3 w-3" />
      case "trending":
        return <TrendingUp className="h-3 w-3" />
      case "launch":
        return <AlertCircle className="h-3 w-3" />
      case "completion":
        return <Award className="h-3 w-3" />
      case "reward":
        return <Clock className="h-3 w-3" />
      case "backer":
        return <Users className="h-3 w-3" />
      case "featured":
        return <Star className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  // Get color class based on update type
  const getColorClass = (type: TickerUpdate["type"], highlight = false) => {
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
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Add trending categories data
  const trendingCategories = [
    { id: "defi", name: "DeFi", trend: "+12.4%" },
    { id: "nft", name: "NFT Gaming", trend: "+8.7%" },
    { id: "zk", name: "Zero Knowledge", trend: "+15.2%" },
    { id: "dao", name: "DAO Governance", trend: "+5.9%" },
    { id: "l2", name: "Layer 2 Solutions", trend: "+10.3%" },
    { id: "privacy", name: "Privacy Tools", trend: "+7.8%" },
    { id: "metaverse", name: "Metaverse", trend: "+9.5%" },
    { id: "identity", name: "Identity Solutions", trend: "+11.2%" },
  ]

  // If loading, show a simple loading state
  if (loading) {
    return (
      <div
        className={cn(
          "w-full overflow-hidden border-y border-border/30 bg-green-100/40 dark:bg-green-900/20 py-2.5 backdrop-blur-sm",
          isDarkMode ? "betting-ticker" : "",
          className,
        )}
      >
        <div className="flex items-center justify-center h-8">
          <div className="animate-pulse flex space-x-4">
            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // If error and no updates, show error state
  if (error && updates.length === 0) {
    return (
      <div
        className={cn(
          "w-full overflow-hidden border-y border-border/30 bg-green-100/40 dark:bg-green-900/20 py-2.5 backdrop-blur-sm",
          isDarkMode ? "betting-ticker" : "",
          className,
        )}
      >
        <div className="flex items-center justify-center h-8">
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return null // Component removed as requested
}

// Helper function to generate demo updates
function getDemoUpdates(): TickerUpdate[] {
  return [
    {
      id: "1",
      type: "funding",
      project: "Quantum Chain Protocol",
      action: "received funding",
      amount: "12,500 ECE",
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      highlight: true,
    },
    {
      id: "2",
      type: "milestone",
      project: "MetaVerse Pioneers",
      action: "reached milestone",
      amount: "75% complete",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
    {
      id: "3",
      type: "trending",
      project: "ZK-Rollup Solution",
      action: "trending",
      amount: "+215% today",
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    },
    {
      id: "4",
      type: "launch",
      project: "Decentralized Cloud",
      action: "just launched",
      amount: "25% bonus",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      highlight: true,
    },
    {
      id: "5",
      type: "completion",
      project: "Sovereign ID Network",
      action: "completed funding",
      amount: "120% of goal",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: "6",
      type: "reward",
      project: "Cross-Chain Bridge",
      action: "unlocked tier",
      amount: "Platinum level",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      id: "7",
      type: "backer",
      project: "DeFi Yield Optimizer",
      action: "gained backers",
      amount: "50+ new",
      timestamp: new Date(Date.now() - 3900000), // 65 minutes ago
    },
    {
      id: "8",
      type: "featured",
      project: "Privacy Protocol",
      action: "featured project",
      amount: "Top pick",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      highlight: true,
    },
  ]
}

// Helper function to generate a random update for demo purposes
function generateRandomUpdate(): TickerUpdate {
  const projects = [
    "Quantum Chain Protocol",
    "MetaVerse Pioneers",
    "ZK-Rollup Solution",
    "Decentralized Cloud",
    "Sovereign ID Network",
    "Cross-Chain Bridge",
    "DeFi Yield Optimizer",
    "Privacy Protocol",
    "Neural DAO",
    "Interstellar Exchange",
    "Blockchain Gaming Guild",
    "Decentralized Science",
    "Carbon Credit Oracle",
    "Regenerative Finance",
    "Tokenized Real Estate",
    "AI Governance Protocol",
    "Distributed Computing Grid",
    "Social Graph Protocol",
    "Crypto Payment Rails",
    "Decentralized Insurance",
  ]

  const types: TickerUpdate["type"][] = [
    "funding",
    "milestone",
    "trending",
    "launch",
    "completion",
    "reward",
    "backer",
    "featured",
  ]

  const fundingActions = ["received funding", "secured investment", "closed round"]
  const fundingAmounts = ["5,000 ECE", "12,500 ECE", "25,000 ECE", "50,000 ECE", "100,000 ECE", "250,000 ECE"]

  const milestoneActions = ["reached milestone", "hit target", "achieved goal"]
  const milestoneAmounts = ["25% complete", "50% complete", "75% complete", "90% complete"]

  const trendingActions = ["trending", "gaining traction", "rising fast"]
  const trendingAmounts = ["+45% today", "+87% today", "+125% today", "+215% today", "+300% today"]

  const launchActions = ["just launched", "now live", "opened funding"]
  const launchAmounts = ["25% bonus", "early bird bonus", "48hr special", "limited slots"]

  const completionActions = ["completed funding", "reached goal", "fully funded"]
  const completionAmounts = ["100% of goal", "120% of goal", "150% of goal", "200% of goal"]

  const rewardActions = ["unlocked tier", "added rewards", "special bonus"]
  const rewardAmounts = ["Gold level", "Platinum level", "Diamond level", "Exclusive tier"]

  const backerActions = ["gained backers", "new supporters", "community growth"]
  const backerAmounts = ["25+ new", "50+ new", "100+ new", "record day"]

  const featuredActions = ["featured project", "staff pick", "highlighted"]
  const featuredAmounts = ["Top pick", "Editor's choice", "Community favorite", "Trending pick"]

  const type = types[Math.floor(Math.random() * types.length)]
  const project = projects[Math.floor(Math.random() * projects.length)]

  let action = ""
  let amount = ""

  switch (type) {
    case "funding":
      action = fundingActions[Math.floor(Math.random() * fundingActions.length)]
      amount = fundingAmounts[Math.floor(Math.random() * fundingAmounts.length)]
      break
    case "milestone":
      action = milestoneActions[Math.floor(Math.random() * milestoneActions.length)]
      amount = milestoneAmounts[Math.floor(Math.random() * milestoneAmounts.length)]
      break
    case "trending":
      action = trendingActions[Math.floor(Math.random() * trendingActions.length)]
      amount = trendingAmounts[Math.floor(Math.random() * trendingAmounts.length)]
      break
    case "launch":
      action = launchActions[Math.floor(Math.random() * launchActions.length)]
      amount = launchAmounts[Math.floor(Math.random() * launchAmounts.length)]
      break
    case "completion":
      action = completionActions[Math.floor(Math.random() * completionActions.length)]
      amount = completionAmounts[Math.floor(Math.random() * completionAmounts.length)]
      break
    case "reward":
      action = rewardActions[Math.floor(Math.random() * rewardActions.length)]
      amount = rewardAmounts[Math.floor(Math.random() * rewardAmounts.length)]
      break
    case "backer":
      action = backerActions[Math.floor(Math.random() * backerActions.length)]
      amount = backerAmounts[Math.floor(Math.random() * backerAmounts.length)]
      break
    case "featured":
      action = featuredActions[Math.floor(Math.random() * featuredActions.length)]
      amount = featuredAmounts[Math.floor(Math.random() * featuredAmounts.length)]
      break
  }

  return {
    id: Date.now().toString(),
    type,
    project,
    action,
    amount,
    timestamp: new Date(),
    highlight: Math.random() > 0.8, // 20% chance of being highlighted
  }
}
