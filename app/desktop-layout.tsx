"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Quicksand } from "next/font/google"
import {
  X,
  ShoppingCart,
  Users,
  MapPin,
  Download,
  Star,
  Smartphone,
  Globe,
  Zap,
  Sun,
  Moon,
  Heart,
  Settings,
  BarChart3,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts"
import { apps, chartData, type App } from "./data"

// Add this after the imports
// Custom CSS for hiding scrollbars but allowing scrolling
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
})

export default function DesktopLayout() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragRotation, setDragRotation] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const [currentScreen, setCurrentScreen] = useState<
    "swipe" | "profile" | "cart" | "wishlist" | "analytics" | "bookmarks"
  >("swipe")
  const [cartItems, setCartItems] = useState<App[]>([])
  const [wishlistItems, setWishlistItems] = useState<App[]>([])
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [analyticsView, setAnalyticsView] = useState<"overview" | "calendar">("overview")

  // Add photo carousel state and functionality to the desktop view
  // Add these state variables after the existing state declarations
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<Record<number, number>>({})
  const [isPhotoSwiping, setIsPhotoSwiping] = useState(false)
  const photoStartPos = useRef({ x: 0, y: 0 })

  // Add bookmark state after existing state
  const [bookmarkedItems, setBookmarkedItems] = useState<App[]>([])

  const [activeTab, setActiveTab] = useState<"Overview" | "Financials" | "Team" | "Market" | "Risks">("Overview")

  const [user] = useState({
    name: "Alex Chen",
    email: "alex.chen@email.com",
    avatar: "/placeholder.svg?height=100&width=100&text=AC",
    joinDate: "March 2024",
    totalInvestments: 12,
    portfolioValue: 2450000,
    successfulExits: 3,
    location: "San Francisco, CA",
    bio: "Angel investor and tech entrepreneur with 8+ years in the startup ecosystem. Focused on AI, fintech, and sustainable technology investments.",
  })

  // Theme colors
  const theme = {
    dark: {
      primary: "#0a1312", // Dark teal background
      secondary: "#1a2625", // Card backgrounds - darker teal
      accent: "#0e5f59", // Primary accent - teal
      accentSecondary: "#0d4f4a", // Secondary accent - darker teal
      text: "#94a3a0", // Light teal-gray text
      textPrimary: "#ffffff", // Primary text
      border: "#0e5f59", // Borders - teal
    },
    light: {
      primary: "#FAFAFA", // Main light background
      secondary: "#ffffff", // Card backgrounds
      accent: "#0e5f59", // Primary accent - teal
      accentSecondary: "#0d4f4a", // Secondary accent - darker teal
      text: "#2d3e3b", // Dark teal text
      textPrimary: "#1a2625", // Primary text - dark teal
      border: "#0e5f59", // Borders - teal
    },
  }

  const currentTheme = isDarkMode ? theme.dark : theme.light
  const currentApp = apps[currentIndex]
  const nextApp = apps[currentIndex + 1]

  const handleSwipe = (direction: "left" | "right" | "up") => {
    setSwipeDirection(direction)
    setTimeout(() => {
      if (direction === "up") {
        setCartItems((prev) => [...prev.filter((item) => item.id !== currentApp.id), currentApp])
      } else if (direction === "right") {
        setWishlistItems((prev) => [...prev.filter((item) => item.id !== currentApp.id), currentApp])
      }
      setCurrentIndex((prev) => (prev + 1) % apps.length)
      setSwipeDirection(null)
      setSelectedApp(null)
    }, 300)
  }

  const formatCurrency = (amount: number) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " ECE"
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    startPos.current = { x: e.clientX, y: e.clientY }
    currentPos.current = { x: e.clientX, y: e.clientY }
  }

  // Add photo swipe handlers
  const handlePhotoMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPhotoSwiping(true)
    photoStartPos.current = { x: e.clientX, y: e.clientY }
  }

  // Add bookmark functions after existing functions
  const toggleBookmark = (app: App) => {
    setBookmarkedItems((prev) => {
      const isBookmarked = prev.some((item) => item.id === app.id)
      if (isBookmarked) {
        return prev.filter((item) => item.id !== app.id)
      } else {
        return [...prev, app]
      }
    })
  }

  const isBookmarked = (appId: number) => {
    return bookmarkedItems.some((item) => item.id === appId)
  }

  const removeBookmark = (appId: number) => {
    setBookmarkedItems((prev) => prev.filter((item) => item.id !== appId))
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      currentPos.current = { x: e.clientX, y: e.clientY }
      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y
      const rotation = deltaX * 0.1

      setDragOffset({ x: deltaX, y: deltaY })
      setDragRotation(rotation)
    }

    const handlePhotoMouseMove = (e: MouseEvent) => {
      if (!isPhotoSwiping) return
      e.stopPropagation()
    }

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = currentPos.current.x - startPos.current.x
      const deltaY = e.clientY - startPos.current.y
      const threshold = 100

      if (Math.abs(deltaY) > threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < 0) {
          handleSwipe("up")
        }
      } else if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handleSwipe("right")
        } else {
          handleSwipe("left")
        }
      }

      setIsDragging(false)
      setDragOffset({ x: 0, y: 0 })
      setDragRotation(0)
    }

    const handlePhotoMouseUp = (e: MouseEvent) => {
      if (!isPhotoSwiping) return
      e.stopPropagation()

      const deltaX = e.clientX - photoStartPos.current.x
      const threshold = 50

      if (Math.abs(deltaX) > threshold) {
        const currentIndex = currentPhotoIndex[currentApp.id] || 0
        const maxIndex = currentApp.images.length - 1

        if (deltaX > 0 && currentIndex > 0) {
          // Swipe right - previous photo
          setCurrentPhotoIndex((prev) => ({
            ...prev,
            [currentApp.id]: currentIndex - 1,
          }))
        } else if (deltaX < 0 && currentIndex < maxIndex) {
          // Swipe left - next photo
          setCurrentPhotoIndex((prev) => ({
            ...prev,
            [currentApp.id]: currentIndex + 1,
          }))
        }
      }

      setIsPhotoSwiping(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    if (isPhotoSwiping) {
      document.addEventListener("mousemove", handlePhotoMouseMove)
      document.addEventListener("mouseup", handlePhotoMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.removeEventListener("mousemove", handlePhotoMouseMove)
      document.removeEventListener("mouseup", handlePhotoMouseUp)
    }
  }, [isDragging, isPhotoSwiping, currentApp.id, currentPhotoIndex])

  const getFundingPercentage = (current: number, goal: number) => {
    return Math.round((current / goal) * 100)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "iOS":
        return <Smartphone className="h-4 w-4" />
      case "Android":
        return <Smartphone className="h-4 w-4" />
      case "Web":
        return <Globe className="h-4 w-4" />
      case "Cross-platform":
        return <Zap className="h-4 w-4" />
      default:
        return <Smartphone className="h-4 w-4" />
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Idea":
        return "bg-gray-500"
      case "MVP":
        return "bg-blue-500"
      case "Growth":
        return "bg-orange-500"
      case "Profitable":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Auto-select current app for details panel
  useEffect(() => {
    if (currentApp && currentScreen === "swipe") {
      setSelectedApp(currentApp)
    }
  }, [currentApp, currentScreen])

  // Add this effect near your other useEffects
  useEffect(() => {
    const checkTabsOverflow = () => {
      const tabsContainer = document.querySelector(".overflow-x-auto")
      if (tabsContainer) {
        const isOverflowing = tabsContainer.scrollWidth > tabsContainer.clientWidth
        document.documentElement.style.setProperty("--show-fade", isOverflowing ? "block" : "none")
      }
    }

    checkTabsOverflow()
    window.addEventListener("resize", checkTabsOverflow)
    return () => window.removeEventListener("resize", checkTabsOverflow)
  }, [])

  // Add a new state variable for the user profile toggle after the existing state declarations:
  const [isUserProfileExpanded, setIsUserProfileExpanded] = useState(false)

  return (
    <div
      className={`h-screen w-screen flex overflow-hidden ${quicksand.className}`}
      style={{ backgroundColor: currentTheme.primary }}
    >
      <style jsx global>
        {scrollbarHideStyles}
      </style>
      {/* Left Sidebar - Enhanced Navigation & Dashboard */}
      <div
        className="w-80 border-r flex flex-col"
        style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>
              InvestSwipe
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-8 h-8 p-0 border"
                style={{
                  borderColor: currentTheme.border,
                  backgroundColor: "transparent",
                  color: currentTheme.text,
                }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-full w-8 h-8 p-0 border"
                style={{
                  borderColor: currentTheme.border,
                  backgroundColor: "transparent",
                  color: currentTheme.text,
                }}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* User Profile Enhanced */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2"
                style={{ borderColor: currentTheme.accent }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate" style={{ color: currentTheme.textPrimary }}>
                {user.name}
              </p>
              <p className="text-xs" style={{ color: currentTheme.text }}>
                Level 3 Investor
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              style={{ color: currentTheme.text }}
              onClick={() => setIsUserProfileExpanded(!isUserProfileExpanded)}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${isUserProfileExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>

          {/* Portfolio Value with Trend */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: currentTheme.text }}>
                Portfolio Value
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+12.5%</span>
              </div>
            </div>
            <p className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
              {formatCurrency(user.portfolioValue)}
            </p>
            <p className="text-xs" style={{ color: currentTheme.text }}>
              +{formatCurrency(275000)} this month
            </p>
          </div>
          {/* Expanded User Profile */}
          {isUserProfileExpanded && (
            <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                  <p className="text-xs" style={{ color: currentTheme.text }}>
                    Member Since
                  </p>
                  <p className="font-semibold text-sm" style={{ color: currentTheme.textPrimary }}>
                    {user.joinDate}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                  <p className="text-xs" style={{ color: currentTheme.text }}>
                    Location
                  </p>
                  <p className="font-semibold text-sm" style={{ color: currentTheme.textPrimary }}>
                    {user.location}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                <p className="text-xs mb-2" style={{ color: currentTheme.text }}>
                  Bio
                </p>
                <p className="text-xs leading-relaxed" style={{ color: currentTheme.textPrimary }}>
                  {user.bio}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                >
                  Settings
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Market Overview */}
        <div className="p-4 border-b" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold" style={{ color: currentTheme.text }}>
              MARKET OVERVIEW
            </h3>
            <Button variant="ghost" size="sm" className="h-6 text-xs" style={{ color: currentTheme.text }}>
              View All
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span style={{ color: currentTheme.text }}>Tech Startups</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+8.2%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span style={{ color: currentTheme.text }}>FinTech</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+15.7%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span style={{ color: currentTheme.text }}>E-commerce</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-red-500">-2.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-2 mb-6">
            <Button
              variant={currentScreen === "swipe" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentScreen("swipe")}
              style={{
                backgroundColor: currentScreen === "swipe" ? currentTheme.accent : "transparent",
                color: currentScreen === "swipe" ? currentTheme.textPrimary : currentTheme.text,
              }}
            >
              <Zap className="h-5 w-5 mr-3" />
              Discover
              <Badge className="ml-auto bg-blue-500 text-white text-xs">12 New</Badge>
            </Button>

            <Button
              variant={currentScreen === "cart" ? "default" : "ghost"}
              className="w-full justify-start relative"
              onClick={() => setCurrentScreen("cart")}
              style={{
                backgroundColor: currentScreen === "cart" ? currentTheme.accent : "transparent",
                color: currentScreen === "cart" ? currentTheme.textPrimary : currentTheme.text,
              }}
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              Investment Cart
              {cartItems.length > 0 && <Badge className="ml-auto bg-red-500 text-white">{cartItems.length}</Badge>}
            </Button>

            <Button
              variant={currentScreen === "wishlist" ? "default" : "ghost"}
              className="w-full justify-start relative"
              onClick={() => setCurrentScreen("wishlist")}
              style={{
                backgroundColor: currentScreen === "wishlist" ? currentTheme.accent : "transparent",
                color: currentScreen === "wishlist" ? currentTheme.textPrimary : currentTheme.text,
              }}
            >
              <Heart className="h-5 w-5 mr-3" />
              Wishlist
              {wishlistItems.length > 0 && (
                <Badge className="ml-auto bg-red-500 text-white">{wishlistItems.length}</Badge>
              )}
            </Button>

            <Button
              variant={currentScreen === "bookmarks" ? "default" : "ghost"}
              className="w-full justify-start relative"
              onClick={() => setCurrentScreen("bookmarks")}
              style={{
                backgroundColor: currentScreen === "bookmarks" ? currentTheme.accent : "transparent",
                color: currentScreen === "bookmarks" ? currentTheme.textPrimary : currentTheme.text,
              }}
            >
              <svg
                className="h-5 w-5 mr-3"
                fill={currentScreen === "bookmarks" ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Bookmarks
              {bookmarkedItems.length > 0 && (
                <Badge className="ml-auto bg-yellow-500 text-white">{bookmarkedItems.length}</Badge>
              )}
            </Button>

            <Button
              variant={currentScreen === "analytics" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentScreen("analytics")}
              style={{
                backgroundColor: currentScreen === "analytics" ? currentTheme.accent : "transparent",
                color: currentScreen === "analytics" ? currentTheme.textPrimary : currentTheme.text,
              }}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Analytics
            </Button>

            <Button
              variant={currentScreen === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentScreen("profile")}
              style={{
                backgroundColor: currentScreen === "profile" ? currentTheme.accent : "transparent",
                color: currentScreen === "profile" ? currentTheme.textPrimary : currentTheme.text,
              }}
            >
              <Users className="h-5 w-5 mr-3" />
              Profile
            </Button>
          </nav>

          {/* Investment Goals */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.text }}>
                INVESTMENT GOALS
              </h3>
              <Button variant="ghost" size="sm" className="h-6 text-xs" style={{ color: currentTheme.text }}>
                Edit
              </Button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium" style={{ color: currentTheme.text }}>
                    Annual Target
                  </span>
                  <span className="text-xs text-green-500">78% Complete</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: currentTheme.text }}>{formatCurrency(1950000)}</span>
                  <span style={{ color: currentTheme.text }}>{formatCurrency(2500000)}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium" style={{ color: currentTheme.text }}>
                    Diversification
                  </span>
                  <span className="text-xs text-blue-500">5/8 Sectors</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-1 h-2 bg-blue-500 rounded-full" />
                  ))}
                  {[6, 7, 8].map((i) => (
                    <div key={i} className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.text }}>
                RECENT ACTIVITY
              </h3>
              <Button variant="ghost" size="sm" className="h-6 text-xs" style={{ color: currentTheme.text }}>
                View All
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: currentTheme.textPrimary }}>
                    FoodieApp funding reached 85%
                  </p>
                  <p className="text-xs" style={{ color: currentTheme.text }}>
                    2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: currentTheme.textPrimary }}>
                    Invested 50K ECE in TechFlow
                  </p>
                  <p className="text-xs" style={{ color: currentTheme.text }}>
                    1 day ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: currentTheme.textPrimary }}>
                    New AI startup matches your criteria
                  </p>
                  <p className="text-xs" style={{ color: currentTheme.text }}>
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Enhanced */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
              PERFORMANCE METRICS
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs" style={{ color: currentTheme.text }}>
                    ROI
                  </span>
                </div>
                <p className="text-lg font-bold text-green-500">+24.8%</p>
                <p className="text-xs" style={{ color: currentTheme.text }}>
                  This year
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                <div className="flex items-center gap-1 mb-1">
                  <BarChart3 className="h-3 w-3 text-blue-500" />
                  <span className="text-xs" style={{ color: currentTheme.text }}>
                    Win Rate
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-500">73%</p>
                <p className="text-xs" style={{ color: currentTheme.text }}>
                  12 investments
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                <p className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
                  {user.totalInvestments}
                </p>
                <p className="text-xs" style={{ color: currentTheme.text }}>
                  Active Investments
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                <p className="text-lg font-bold text-green-400">{user.successfulExits}</p>
                <p className="text-xs" style={{ color: currentTheme.text }}>
                  Successful Exits
                </p>
              </div>
            </div>
          </div>

          {/* Trending Opportunities */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.text }}>
                TRENDING NOW
              </h3>
              <Badge className="bg-red-500 text-white text-xs">Hot</Badge>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg border" style={{ borderColor: currentTheme.border }}>
                <div className="flex items-center gap-2 mb-1">
                  <img src="/placeholder.svg?height=24&width=24&text=AI" alt="AI Startup" className="w-6 h-6 rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: currentTheme.textPrimary }}>
                      AI Study Assistant
                    </p>
                    <p className="text-xs" style={{ color: currentTheme.text }}>
                      Education • Series A
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-500">+127%</p>
                    <p className="text-xs" style={{ color: currentTheme.text }}>
                      funded
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg border" style={{ borderColor: currentTheme.border }}>
                <div className="flex items-center gap-2 mb-1">
                  <img src="/placeholder.svg?height=24&width=24&text=FT" alt="FinTech" className="w-6 h-6 rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: currentTheme.textPrimary }}>
                      CryptoTrader Pro
                    </p>
                    <p className="text-xs" style={{ color: currentTheme.text }}>
                      FinTech • Seed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-blue-500">89%</p>
                    <p className="text-xs" style={{ color: currentTheme.text }}>
                      funded
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.text }}>
                NOTIFICATIONS
              </h3>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                  New investment opportunity matches your AI criteria
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">5 min ago</p>
              </div>

              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-xs font-medium text-green-800 dark:text-green-200">
                  FoodieApp reached funding milestone
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Enhanced */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: currentTheme.border }}>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex-1 justify-start text-xs"
              onClick={() => setShowFilters(!showFilters)}
              style={{ color: currentTheme.text }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="ghost" className="flex-1 justify-start text-xs" style={{ color: currentTheme.text }}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          <Button
            className="w-full text-xs"
            style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Funds
          </Button>
        </div>
      </div>

      {/* Center - Card Stack */}
      <div className="flex-1 flex items-center justify-center p-8">
        {currentScreen === "swipe" && currentApp && (
          <div className="relative w-full max-w-md h-[700px]">
            {/* Next Card (Background) */}
            {nextApp && (
              <Card
                className="absolute inset-0 w-full h-full transform scale-95 opacity-20"
                style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
              >
                <div className="relative h-full">
                  <img
                    src={nextApp.image || "/placeholder.svg"}
                    alt={nextApp.name}
                    className="w-full h-80 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg" style={{ color: currentTheme.textPrimary }}>
                      {nextApp.name}
                    </h3>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Current Card */}
            <Card
              ref={cardRef}
              className={`absolute inset-0 w-full h-full transition-transform duration-300 cursor-grab active:cursor-grabbing select-none shadow-xl rounded-xl overflow-hidden ${
                swipeDirection === "left"
                  ? "-translate-x-full rotate-12"
                  : swipeDirection === "right"
                    ? "translate-x-full -rotate-12"
                    : swipeDirection === "up"
                      ? "-translate-y-full rotate-6"
                      : ""
              }`}
              style={{
                backgroundColor: currentTheme.secondary,
                borderColor: currentTheme.border,
                transform: isDragging
                  ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragRotation}deg)`
                  : swipeDirection
                    ? undefined
                    : "translate(0px, 0px) rotate(0deg)",
                transition: isDragging ? "none" : "transform 0.3s ease-out",
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Swipe Indicators */}
              {isDragging && (
                <>
                  <div
                    className={`absolute top-1/2 left-8 transform -translate-y-1/2 transition-opacity duration-200 z-10 ${
                      dragOffset.x < -50 ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg border-4 border-white shadow-lg">
                      PASS
                    </div>
                  </div>
                  <div
                    className={`absolute top-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 z-10 ${
                      dragOffset.y < -50 ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold text-lg border-4 border-white shadow-lg">
                      INVEST
                    </div>
                  </div>
                  <div
                    className={`absolute top-1/2 right-8 transform -translate-y-1/2 transition-opacity duration-200 z-10 ${
                      dragOffset.x > 50 ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-bold text-lg border-4 border-white shadow-lg">
                      LIKE
                    </div>
                  </div>
                </>
              )}

              <div className="relative h-full flex flex-col">
                {/* Photo carousel section - takes up full height of card */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-out h-full"
                    style={{
                      transform: `translateX(-${(currentPhotoIndex[currentApp.id] || 0) * 100}%)`,
                    }}
                  >
                    {currentApp.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${currentApp.name} - Photo ${index + 1}`}
                        className="w-full h-full object-cover flex-shrink-0 cursor-pointer"
                        onMouseDown={handlePhotoMouseDown}
                      />
                    ))}
                  </div>

                  {/* Photo indicators */}
                  {currentApp.images.length > 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {currentApp.images.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                            index === (currentPhotoIndex[currentApp.id] || 0) ? "bg-white w-8" : "bg-white/50 w-4"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentPhotoIndex((prev) => ({
                              ...prev,
                              [currentApp.id]: index,
                            }))
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none"></div>

                {/* Top badges overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto z-10">
                  <Badge
                    className={`${
                      currentApp.type === "crowdfunding"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gradient-to-r from-green-500 to-emerald-500"
                    } text-white border-0 shadow-lg`}
                  >
                    {currentApp.type === "crowdfunding" ? "🚀 Funding" : "💼 For Sale"}
                  </Badge>

                  <div className="flex gap-2">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {currentApp.rating}
                    </div>
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg">
                      <Download className="h-4 w-4" />
                      {formatNumber(currentApp.downloads || 0)}
                    </div>
                  </div>
                </div>

                {/* Content section - positioned at the bottom */}
                <div className="relative mt-auto p-6 z-10">
                  {/* App header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-2xl text-white mb-1 truncate">{currentApp.name}</h3>
                        <div className="flex items-center gap-1 text-white/80 mb-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{currentApp.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 ml-3">
                        <Badge className={`${getStageColor(currentApp.stage)} text-white border-0 text-xs`}>
                          {currentApp.stage}
                        </Badge>
                        <Badge className="text-xs flex items-center gap-1 bg-white/20 text-white border-white/20">
                          {getPlatformIcon(currentApp.platform)}
                          {currentApp.platform}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                        {currentApp.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/90 line-clamp-2 mb-4">{currentApp.description}</p>

                  {/* Founder Info - compact */}
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm p-3 rounded-lg mb-4">
                    <img
                      src={selectedApp?.founder?.avatar || "/placeholder.svg"}
                      alt={selectedApp?.founder?.name || "Founder"}
                      className="w-8 h-8 rounded-full border-2 border-white/50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white truncate">
                        {selectedApp?.founder?.name || "Founder"}
                      </p>
                      <p className="text-xs text-white/70 truncate">
                        {selectedApp?.founder?.background || "Tech Entrepreneur"}
                      </p>
                    </div>
                    {selectedApp?.founder?.previousExits > 0 && (
                      <Badge className="bg-green-500/20 text-green-300 text-xs border-green-400/30">
                        {selectedApp.founder.previousExits} Exit{selectedApp.founder.previousExits > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  {/* Key metrics - compact grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-black/40 backdrop-blur-sm p-3 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-medium text-white/80">Monthly Users</span>
                      </div>
                      <p className="font-bold text-lg text-white">{formatNumber(currentApp.monthlyUsers || 0)}</p>
                      <p className="text-xs text-green-400">{selectedApp?.metrics?.userGrowthRate || "+12% MoM"}</p>
                    </div>

                    <div className="bg-black/40 backdrop-blur-sm p-3 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                        <span className="text-xs font-medium text-white/80">Market Size</span>
                      </div>
                      <p className="font-bold text-lg text-white">{selectedApp?.market?.size || "$1B+"}</p>
                      <p className="text-xs text-blue-400">{selectedApp?.market?.growth || "+15% YoY"}</p>
                    </div>
                  </div>

                  {/* Funding or Price info - more compact */}
                  {currentApp.type === "crowdfunding" ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-white">
                        <span className="text-sm font-medium">Funding Progress</span>
                        <span className="text-sm font-bold">
                          {getFundingPercentage(currentApp.currentFunding || 0, currentApp.fundingGoal || 1)}%
                        </span>
                      </div>

                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(getFundingPercentage(currentApp.currentFunding || 0, currentApp.fundingGoal || 1), 100)}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-white/70">Raised</span>
                          <p className="font-bold text-white">{formatCurrency(currentApp.currentFunding || 0)}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-white/70">Goal</span>
                          <p className="font-bold text-white">{formatCurrency(currentApp.fundingGoal || 0)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-400">
                          {formatCurrency(currentApp.price || 0)}
                        </span>
                        <p className="text-sm text-white/80">{currentApp.ownershipPercentage}% ownership</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Available</Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Other screens content */}
        {currentScreen !== "swipe" && (
          <div className="w-full max-w-6xl pt-8">
            {currentScreen === "cart" && (
              <div className="h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                    Investment Cart
                  </h2>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                      {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm" style={{ color: currentTheme.text }}>
                        Total Investment
                      </p>
                      <p className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        {formatCurrency(
                          cartItems.reduce((total, item) => {
                            if (item.type === "crowdfunding") {
                              return total + 10000 // Default investment amount
                            } else {
                              return total + (item.price || 0)
                            }
                          }, 0),
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart
                      className="h-16 w-16 mx-auto mb-4"
                      style={{ color: currentTheme.text, opacity: 0.5 }}
                    />
                    <h3 className="text-xl font-semibold mb-2" style={{ color: currentTheme.textPrimary }}>
                      Your cart is empty
                    </h3>
                    <p className="text-sm mb-6" style={{ color: currentTheme.text }}>
                      Start swiping to add investments to your cart
                    </p>
                    <Button
                      onClick={() => setCurrentScreen("swipe")}
                      style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Start Discovering
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Cart Items */}
                    <div className="grid gap-4">
                      {cartItems.map((item) => (
                        <Card
                          key={item.id}
                          style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg" style={{ color: currentTheme.textPrimary }}>
                                      {item.name}
                                    </h3>
                                    <p className="text-sm" style={{ color: currentTheme.text }}>
                                      {item.category} • {item.location}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== item.id))
                                    }
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="flex items-center gap-4 mb-3">
                                  <Badge className={`${getStageColor(item.stage)} text-white border-0 text-xs`}>
                                    {item.stage}
                                  </Badge>
                                  <Badge
                                    className={`text-xs ${
                                      item.type === "crowdfunding"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {item.type === "crowdfunding" ? "🚀 Funding" : "💼 For Sale"}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs" style={{ color: currentTheme.text }}>
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {item.rating}
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  {item.type === "crowdfunding" ? (
                                    <>
                                      <div>
                                        <p className="text-xs" style={{ color: currentTheme.text }}>
                                          Investment Amount
                                        </p>
                                        <p className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                          {formatCurrency(10000)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs" style={{ color: currentTheme.text }}>
                                          Funding Progress
                                        </p>
                                        <p className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                          {getFundingPercentage(item.currentFunding || 0, item.fundingGoal || 1)}%
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs" style={{ color: currentTheme.text }}>
                                          Valuation
                                        </p>
                                        <p className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                          {formatCurrency(item.valuation || 0)}
                                        </p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div>
                                        <p className="text-xs" style={{ color: currentTheme.text }}>
                                          Purchase Price
                                        </p>
                                        <p className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                          {formatCurrency(item.price || 0)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs" style={{ color: currentTheme.text }}>
                                          Ownership
                                        </p>
                                        <p className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                          {item.ownershipPercentage}%
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs" style={{ color: currentTheme.text }}>
                                          Monthly Revenue
                                        </p>
                                        <p className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                          {formatCurrency(item.revenue || 0)}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {/* Investment Amount Selector for Crowdfunding */}
                                {item.type === "crowdfunding" && (
                                  <div className="mb-4">
                                    <p className="text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
                                      Adjust Investment Amount
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm" className="text-xs">
                                        {formatCurrency(5000)}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs bg-blue-50 border-blue-200"
                                      >
                                        {formatCurrency(10000)}
                                      </Button>
                                      <Button variant="outline" size="sm" className="text-xs">
                                        {formatCurrency(25000)}
                                      </Button>
                                      <Button variant="outline" size="sm" className="text-xs">
                                        {formatCurrency(50000)}
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-xs" style={{ color: currentTheme.text }}>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {formatNumber(item.monthlyUsers || 0)} users
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3" />
                                      {item.metrics.userGrowthRate}
                                    </div>
                                    <Badge
                                      className={`text-xs ${
                                        item.risks.level === "Low"
                                          ? "bg-green-100 text-green-800"
                                          : item.risks.level === "Medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {item.risks.level} Risk
                                    </Badge>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => setSelectedApp(item)}
                                    variant="outline"
                                    style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Cart Summary */}
                    <Card style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.accent }}>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4" style={{ color: currentTheme.textPrimary }}>
                          Investment Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span style={{ color: currentTheme.text }}>Total Investments:</span>
                            <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                              {cartItems.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: currentTheme.text }}>Crowdfunding Investments:</span>
                            <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                              {cartItems.filter((item) => item.type === "crowdfunding").length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: currentTheme.text }}>Marketplace Purchases:</span>
                            <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                              {cartItems.filter((item) => item.type === "marketplace").length}
                            </span>
                          </div>
                          <div className="border-t pt-3" style={{ borderColor: currentTheme.border }}>
                            <div className="flex justify-between text-lg">
                              <span className="font-semibold" style={{ color: currentTheme.text }}>
                                Total Amount:
                              </span>
                              <span className="font-bold" style={{ color: currentTheme.textPrimary }}>
                                {formatCurrency(
                                  cartItems.reduce((total, item) => {
                                    if (item.type === "crowdfunding") {
                                      return total + 10000 // Default investment amount
                                    } else {
                                      return total + (item.price || 0)
                                    }
                                  }, 0),
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 space-y-3">
                          <Button
                            className="w-full"
                            size="lg"
                            style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Proceed to Checkout
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setCurrentScreen("swipe")}
                            style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                          >
                            Continue Browsing
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {currentScreen === "wishlist" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                    Wishlist
                  </h2>
                  <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                    {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
                  </Badge>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-20">
                    <Heart className="h-16 w-16 mx-auto mb-4" style={{ color: currentTheme.text, opacity: 0.5 }} />
                    <h3 className="text-xl font-semibold mb-2" style={{ color: currentTheme.textPrimary }}>
                      Your wishlist is empty
                    </h3>
                    <p className="text-sm mb-6" style={{ color: currentTheme.text }}>
                      Save interesting investments for later
                    </p>
                    <Button
                      onClick={() => setCurrentScreen("swipe")}
                      style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Start Discovering
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <Card
                        key={item.id}
                        style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
                      >
                        <div className="relative">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setWishlistItems((prev) => prev.filter((wishItem) => wishItem.id !== item.id))
                            }
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white/80 hover:bg-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold" style={{ color: currentTheme.textPrimary }}>
                              {item.name}
                            </h3>
                            <Badge className={`${getStageColor(item.stage)} text-white border-0 text-xs`}>
                              {item.stage}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3" style={{ color: currentTheme.text }}>
                            {item.category} • {item.location}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-xs" style={{ color: currentTheme.text }}>
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {item.rating}
                            </div>
                            <Badge
                              className={`text-xs ${
                                item.type === "crowdfunding"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.type === "crowdfunding" ? "🚀 Funding" : "💼 For Sale"}
                            </Badge>
                          </div>
                          <div className="space-y-2 mb-4">
                            {item.type === "crowdfunding" ? (
                              <>
                                <div className="flex justify-between text-sm">
                                  <span style={{ color: currentTheme.text }}>Goal:</span>
                                  <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    {formatCurrency(item.fundingGoal || 0)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span style={{ color: currentTheme.text }}>Progress:</span>
                                  <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    {getFundingPercentage(item.currentFunding || 0, item.fundingGoal || 1)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${Math.min(getFundingPercentage(item.currentFunding || 0, item.fundingGoal || 1), 100)}%`,
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between text-sm">
                                  <span style={{ color: currentTheme.text }}>Price:</span>
                                  <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    {formatCurrency(item.price || 0)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span style={{ color: currentTheme.text }}>Revenue:</span>
                                  <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    {formatCurrency(item.revenue || 0)}/mo
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setCartItems((prev) => [...prev.filter((cartItem) => cartItem.id !== item.id), item])
                              }}
                              style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setWishlistItems((prev) => [
                                  ...prev.filter((wishItem) => wishItem.id !== item.id),
                                  item,
                                ])
                              }}
                              style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                            >
                              <Star className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentScreen === "bookmarks" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                    Bookmarks
                  </h2>
                  <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
                    {bookmarkedItems.length} {bookmarkedItems.length === 1 ? "Item" : "Items"}
                  </Badge>
                </div>

                {bookmarkedItems.length === 0 ? (
                  <div className="text-center py-20">
                    <svg
                      className="h-16 w-16 mx-auto mb-4"
                      style={{ color: currentTheme.text, opacity: 0.5 }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: currentTheme.textPrimary }}>
                      No bookmarks yet
                    </h3>
                    <p className="text-sm mb-6" style={{ color: currentTheme.text }}>
                      Bookmark interesting investments to review them later
                    </p>
                    <Button
                      onClick={() => setCurrentScreen("swipe")}
                      style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Start Discovering
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedItems.map((item) => (
                      <Card
                        key={item.id}
                        style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
                      >
                        <div className="relative">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <button
                            onClick={() => removeBookmark(item.id)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-200"
                          >
                            <svg
                              className="w-5 h-5 text-yellow-400 fill-yellow-400"
                              fill="currentColor"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                          </button>
                          <div className="absolute top-2 left-2">
                            <Badge
                              className={`${
                                item.type === "crowdfunding"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                  : "bg-gradient-to-r from-green-500 to-emerald-500"
                              } text-white border-0 text-xs`}
                            >
                              {item.type === "crowdfunding" ? "🚀 Funding" : "💼 For Sale"}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold" style={{ color: currentTheme.textPrimary }}>
                              {item.name}
                            </h3>
                            <Badge className={`${getStageColor(item.stage)} text-white border-0 text-xs`}>
                              {item.stage}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3" style={{ color: currentTheme.text }}>
                            {item.category} • {item.location}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-xs" style={{ color: currentTheme.text }}>
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {item.rating}
                            </div>
                            <div className="flex items-center gap-1 text-xs" style={{ color: currentTheme.text }}>
                              <Users className="h-3 w-3" />
                              {formatNumber(item.monthlyUsers || 0)}
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            {item.type === "crowdfunding" ? (
                              <>
                                <div className="flex justify-between text-sm">
                                  <span style={{ color: currentTheme.text }}>Goal:</span>
                                  <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    {formatCurrency(item.fundingGoal || 0)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span style={{ color: currentTheme.text }}>Progress:</span>
                                  <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    {getFundingPercentage(item.currentFunding || 0, item.fundingGoal || 1)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${Math.min(getFundingPercentage(item.currentFunding || 0, item.fundingGoal || 1), 100)}%`,
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between text-sm">
                                  <span style={{ color: currentTheme.text }}>Price:</span>
                                  <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    {formatCurrency(item.price || 0)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span style={{ color: currentTheme.text }}>Revenue:</span>
                                  <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    {formatCurrency(item.revenue || 0)}/mo
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setCartItems((prev) => [...prev.filter((cartItem) => cartItem.id !== item.id), item])
                              }}
                              style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setWishlistItems((prev) => [
                                  ...prev.filter((wishItem) => wishItem.id !== item.id),
                                  item,
                                ])
                              }}
                              style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                            >
                              <Star className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(currentScreen === "profile" || currentScreen === "analytics") && (
              <div className="text-center py-12">
                <h2 className="text-3xl font-bold mb-4" style={{ color: currentTheme.textPrimary }}>
                  {currentScreen === "profile" && "Profile"}
                  {currentScreen === "analytics" && "Analytics Dashboard"}
                </h2>
                <p style={{ color: currentTheme.text }}>Coming soon...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel - Details */}
      {currentScreen === "swipe" && selectedApp && (
        <div
          className="w-[400px] border-l overflow-y-auto"
          style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
        >
          <div className="p-6">
            {/* Header with tabs */}
            <div className="flex flex-col mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>
                  Investment Details
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => toggleBookmark(selectedApp)}
                    style={{
                      borderColor: isBookmarked(selectedApp.id) ? "rgb(250 204 21)" : currentTheme.border,
                      color: isBookmarked(selectedApp.id) ? "rgb(250 204 21)" : currentTheme.text,
                    }}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors duration-200`}
                      fill={isBookmarked(selectedApp.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div
                  className="p-2 rounded-lg bg-opacity-20"
                  style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                >
                  <p className="text-xs" style={{ color: currentTheme.text }}>
                    Valuation
                  </p>
                  <p className="font-bold text-sm" style={{ color: currentTheme.textPrimary }}>
                    {formatCurrency(selectedApp.valuation || 0)}
                  </p>
                </div>
                <div
                  className="p-2 rounded-lg bg-opacity-20"
                  style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                >
                  <p className="text-xs" style={{ color: currentTheme.text }}>
                    Monthly Users
                  </p>
                  <p className="font-bold text-sm" style={{ color: currentTheme.textPrimary }}>
                    {formatNumber(selectedApp.monthlyUsers || 0)}
                  </p>
                </div>
                <div
                  className="p-2 rounded-lg bg-opacity-20"
                  style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                >
                  <p className="text-xs" style={{ color: currentTheme.text }}>
                    Risk Level
                  </p>
                  <p
                    className={`font-bold text-sm ${
                      selectedApp.risks.level === "Low"
                        ? "text-green-500"
                        : selectedApp.risks.level === "Medium"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {selectedApp.risks.level}
                  </p>
                </div>
              </div>

              {/* Navigation tabs */}
              <div className="relative">
                <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                  <div className="flex border-b min-w-max" style={{ borderColor: currentTheme.border }}>
                    {["Overview", "Financials", "Team", "Market", "Risks"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200 hover:bg-opacity-10 hover:bg-gray-500 ${
                          tab === activeTab ? "border-opacity-100" : "border-transparent"
                        }`}
                        style={{
                          color: tab === activeTab ? currentTheme.accent : currentTheme.text,
                          borderColor: tab === activeTab ? currentTheme.accent : "transparent",
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l pointer-events-none"
                  style={{
                    background: `linear-gradient(to left, ${currentTheme.secondary}, transparent)`,
                    display: "var(--show-fade, block)",
                  }}
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "Overview" && (
                <div>
                  {/* App description */}
                  <div className="mb-6">
                    <p className="text-sm mb-4" style={{ color: currentTheme.text }}>
                      {selectedApp.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-white/10 text-white/90 border-white/20">{selectedApp.category}</Badge>
                      <Badge className={`${getStageColor(selectedApp.stage)} text-white border-0`}>
                        {selectedApp.stage}
                      </Badge>
                      <Badge className="flex items-center gap-1 bg-white/10 text-white/90 border-white/20">
                        {getPlatformIcon(selectedApp.platform)}
                        {selectedApp.platform}
                      </Badge>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      KEY HIGHLIGHTS
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span style={{ color: currentTheme.text }}>
                          {formatNumber(selectedApp.monthlyUsers || 0)} monthly active users
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span style={{ color: currentTheme.text }}>
                          {selectedApp.rating}/5.0 user rating ({formatNumber(selectedApp.downloads || 0)} downloads)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span style={{ color: currentTheme.text }}>
                          {selectedApp.market?.size || "$1B+"} market opportunity
                        </span>
                      </div>
                      {selectedApp.revenue && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span style={{ color: currentTheme.text }}>
                            {formatCurrency(selectedApp.revenue)} monthly recurring revenue
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Funding or Price info */}
                  {selectedApp.type === "crowdfunding" ? (
                    <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: currentTheme.border }}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                          Funding Status
                        </h3>
                        <Badge className="bg-blue-100 text-blue-800">Crowdfunding</Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span style={{ color: currentTheme.text }}>Funding Progress</span>
                          <span className="font-bold" style={{ color: currentTheme.textPrimary }}>
                            {getFundingPercentage(selectedApp.currentFunding || 0, selectedApp.fundingGoal || 1)}%
                          </span>
                        </div>

                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(getFundingPercentage(selectedApp.currentFunding || 0, selectedApp.fundingGoal || 1), 100)}%`,
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs" style={{ color: currentTheme.text }}>
                              Raised
                            </span>
                            <p className="font-bold" style={{ color: currentTheme.textPrimary }}>
                              {formatCurrency(selectedApp.currentFunding || 0)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs" style={{ color: currentTheme.text }}>
                              Goal
                            </span>
                            <p className="font-bold" style={{ color: currentTheme.textPrimary }}>
                              {formatCurrency(selectedApp.fundingGoal || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t" style={{ borderColor: currentTheme.border }}>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: currentTheme.text }}>Deadline:</span>
                            <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                              {selectedApp.betting?.deadline || "Dec 31, 2024"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: currentTheme.text }}>Backers:</span>
                            <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                              {selectedApp.backers || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: currentTheme.border }}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                          Acquisition Details
                        </h3>
                        <Badge className="bg-green-100 text-green-800">For Sale</Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: currentTheme.text }}>
                            Purchase Price
                          </span>
                          <span className="text-xl font-bold text-green-500">
                            {formatCurrency(selectedApp.price || 0)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span style={{ color: currentTheme.text }}>Ownership</span>
                            <p className="font-bold" style={{ color: currentTheme.textPrimary }}>
                              {selectedApp.ownershipPercentage}%
                            </p>
                          </div>
                          <div>
                            <span style={{ color: currentTheme.text }}>Monthly Revenue</span>
                            <p className="font-bold" style={{ color: currentTheme.textPrimary }}>
                              {formatCurrency(selectedApp.revenue || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t" style={{ borderColor: currentTheme.border }}>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: currentTheme.text }}>ROI Estimate:</span>
                            <span className="font-semibold text-green-500">
                              {selectedApp.revenue
                                ? `${Math.round(((selectedApp.revenue * 12) / (selectedApp.price || 1)) * 100)}% / year`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: currentTheme.text }}>Break-even:</span>
                            <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                              {selectedApp.revenue
                                ? `~${Math.ceil((selectedApp.price || 0) / (selectedApp.revenue || 1))} months`
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Financials" && (
                <div>
                  {/* Revenue Chart */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold" style={{ color: currentTheme.text }}>
                        FINANCIAL PERFORMANCE
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Revenue
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Users
                        </Button>
                      </div>
                    </div>

                    <ChartContainer
                      config={{
                        revenue: {
                          label: "Revenue",
                          color: "hsl(var(--chart-1))",
                        },
                        projected: {
                          label: "Projected",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[200px] pt-4 pr-4 pb-4"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            ...(chartData[selectedApp.id]?.revenue || []),
                            ...(chartData[selectedApp.id]?.projectedRevenue?.filter(
                              (item) => item.type === "projected",
                            ) || []),
                          ]}
                        >
                          <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                          <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                          />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                formatter={(value, name) => [
                                  `${value.toLocaleString()} ECE`,
                                  name === "revenue" ? "Actual Revenue" : "Projected Revenue",
                                ]}
                              />
                            }
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                            name="revenue"
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill="url(#projectedGradient)"
                            name="projected"
                            connectNulls
                            data={
                              chartData[selectedApp.id]?.projectedRevenue?.filter(
                                (item) => item.type === "projected",
                              ) || []
                            }
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                        <p className="text-xs" style={{ color: currentTheme.text }}>
                          LTV/CAC Ratio
                        </p>
                        <p className="font-bold text-purple-600">3.2x</p>
                        <p className="text-xs" style={{ color: currentTheme.text }}>
                          Excellent
                        </p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                        <p className="text-xs" style={{ color: currentTheme.text }}>
                          Churn Rate
                        </p>
                        <p className="font-bold" style={{ color: currentTheme.textPrimary }}>
                          2.1%
                        </p>
                        <p className="text-xs" style={{ color: currentTheme.text }}>
                          Low
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      KEY FINANCIAL METRICS
                    </h4>
                    <div className="space-y-3">
                      <div
                        className="flex justify-between items-center p-3 rounded-lg"
                        style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                      >
                        <span className="text-sm" style={{ color: currentTheme.text }}>
                          Monthly Recurring Revenue
                        </span>
                        <span className="font-bold" style={{ color: currentTheme.textPrimary }}>
                          {formatCurrency(selectedApp.revenue || 0)}
                        </span>
                      </div>
                      <div
                        className="flex justify-between items-center p-3 rounded-lg"
                        style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                      >
                        <span className="text-sm" style={{ color: currentTheme.text }}>
                          Annual Run Rate
                        </span>
                        <span className="font-bold" style={{ color: currentTheme.textPrimary }}>
                          {formatCurrency((selectedApp.revenue || 0) * 12)}
                        </span>
                      </div>
                      <div
                        className="flex justify-between items-center p-3 rounded-lg"
                        style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                      >
                        <span className="text-sm" style={{ color: currentTheme.text }}>
                          Gross Margin
                        </span>
                        <span className="font-bold text-green-500">78%</span>
                      </div>
                      <div
                        className="flex justify-between items-center p-3 rounded-lg"
                        style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                      >
                        <span className="text-sm" style={{ color: currentTheme.text }}>
                          Burn Rate
                        </span>
                        <span className="font-bold text-orange-500">{formatCurrency(15000)}/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Team" && (
                <div>
                  {/* Founder & Team */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      FOUNDER & LEADERSHIP
                    </h3>
                    <div
                      className="flex items-center gap-3 mb-4 p-3 rounded-lg"
                      style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                    >
                      <img
                        src={selectedApp.founder?.avatar || "/placeholder.svg"}
                        alt={selectedApp.founder?.name || "Founder"}
                        className="w-12 h-12 rounded-full border-2"
                        style={{ borderColor: currentTheme.accent }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                          {selectedApp.founder?.name || "John Smith"}
                        </p>
                        <p className="text-xs" style={{ color: currentTheme.text }}>
                          {selectedApp.founder?.background || "Former Google PM, Stanford MBA"}
                        </p>
                        <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                          {selectedApp.founder?.previousExits || 2} Previous Exits
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: currentTheme.text }}>Team Size:</span>
                        <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                          {selectedApp.team?.size || 12} members
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: currentTheme.text }}>Engineering:</span>
                        <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                          60%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: currentTheme.text }}>Product & Design:</span>
                        <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                          25%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: currentTheme.text }}>Business & Marketing:</span>
                        <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                          15%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Team Members */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      KEY TEAM MEMBERS
                    </h4>
                    <div className="space-y-3">
                      {(
                        selectedApp.team?.keyMembers || [
                          "Sarah Chen: CTO, Former Meta Engineer",
                          "Mike Rodriguez: Head of Product, Ex-Airbnb",
                          "Lisa Wang: VP Marketing, Former Stripe",
                        ]
                      ).map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold">
                            {member.split(":")[0].trim()[0]}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: currentTheme.textPrimary }}>
                              {member.split(":")[0].trim()}
                            </p>
                            <p className="text-xs" style={{ color: currentTheme.text }}>
                              {member.split(":")[1]?.trim() || "Team Member"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advisors */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      ADVISORS & INVESTORS
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {["Sequoia Capital", "Y Combinator", "Reid Hoffman", "Naval Ravikant"].map((advisor, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-lg text-center"
                          style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                        >
                          <p className="text-xs font-medium" style={{ color: currentTheme.textPrimary }}>
                            {advisor}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Market" && (
                <div>
                  {/* Market Analysis */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      MARKET OPPORTUNITY
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                        <p className="text-xs" style={{ color: currentTheme.text }}>
                          Total Addressable Market
                        </p>
                        <p className="font-bold text-lg" style={{ color: currentTheme.textPrimary }}>
                          {selectedApp.market?.size || "$12B"}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}>
                        <p className="text-xs" style={{ color: currentTheme.text }}>
                          Market Growth Rate
                        </p>
                        <p className="font-bold text-lg text-green-500">{selectedApp.market?.growth || "+25% YoY"}</p>
                      </div>
                    </div>

                    <div
                      className="p-3 rounded-lg mb-4"
                      style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs" style={{ color: currentTheme.text }}>
                          Competition Level
                        </p>
                        <Badge
                          className={`text-xs ${
                            selectedApp.market?.competition === "Low"
                              ? "bg-green-100 text-green-800"
                              : selectedApp.market?.competition === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedApp.market?.competition || "Medium"}
                        </Badge>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            selectedApp.market?.competition === "Low"
                              ? "bg-green-500 w-1/3"
                              : selectedApp.market?.competition === "Medium"
                                ? "bg-yellow-500 w-2/3"
                                : "bg-red-500 w-full"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Competitive Landscape */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      COMPETITIVE LANDSCAPE
                    </h4>
                    <div className="space-y-3">
                      {[
                        { name: "Competitor A", market: "25%", funding: "$50M" },
                        { name: "Competitor B", market: "18%", funding: "$30M" },
                        { name: "Competitor C", market: "12%", funding: "$15M" },
                      ].map((competitor, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                        >
                          <div>
                            <p className="text-sm font-medium" style={{ color: currentTheme.textPrimary }}>
                              {competitor.name}
                            </p>
                            <p className="text-xs" style={{ color: currentTheme.text }}>
                              {competitor.market} market share
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold" style={{ color: currentTheme.textPrimary }}>
                              {competitor.funding}
                            </p>
                            <p className="text-xs" style={{ color: currentTheme.text }}>
                              Total funding
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Proof */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      SOCIAL PROOF & TRACTION
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                        <span style={{ color: currentTheme.text }}>
                          {selectedApp.social?.mentions || "2.5K"} social media mentions
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedApp.social?.sentiment === "Positive"
                              ? "bg-green-500"
                              : selectedApp.social?.sentiment === "Neutral"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span style={{ color: currentTheme.text }}>
                          {selectedApp.social?.sentiment || "Positive"} sentiment analysis
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span style={{ color: currentTheme.text }}>Featured in TechCrunch, Forbes</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Risks" && (
                <div>
                  {/* Risk Assessment */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      RISK ASSESSMENT
                    </h3>
                    <div
                      className="p-4 rounded-lg mb-4"
                      style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-medium" style={{ color: currentTheme.text }}>
                          Overall Risk Level
                        </p>
                        <Badge
                          className={`${
                            selectedApp.risks?.level === "Low"
                              ? "bg-green-100 text-green-800"
                              : selectedApp.risks?.level === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedApp.risks?.level || "Medium"}
                        </Badge>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full mb-3">
                        <div
                          className={`h-3 rounded-full ${
                            selectedApp.risks?.level === "Low"
                              ? "bg-green-500 w-1/3"
                              : selectedApp.risks?.level === "Medium"
                                ? "bg-yellow-500 w-2/3"
                                : "bg-red-500 w-full"
                          }`}
                        />
                      </div>

                      <p className="text-xs" style={{ color: currentTheme.text }}>
                        Based on market conditions, team experience, and financial metrics
                      </p>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      KEY RISK FACTORS
                    </h4>
                    <div className="space-y-3">
                      {(
                        selectedApp.risks?.factors || [
                          "Market competition from established players",
                          "Regulatory changes in the industry",
                          "Customer acquisition cost trends",
                          "Technology disruption risk",
                        ]
                      ).map((factor, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg"
                          style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                        >
                          <svg
                            className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm" style={{ color: currentTheme.textPrimary }}>
                              {factor}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mitigation Strategies */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                      MITIGATION STRATEGIES
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Strong IP portfolio and patent protection",
                        "Diversified revenue streams",
                        "Experienced advisory board",
                        "Conservative cash management",
                      ].map((strategy, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg"
                          style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5" }}
                        >
                          <svg
                            className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm" style={{ color: currentTheme.textPrimary }}>
                              {strategy}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investment Recommendation */}
                  <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span className="font-semibold text-green-800 dark:text-green-200">
                        Investment Recommendation
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Despite moderate risks, strong fundamentals and experienced team make this a solid investment
                      opportunity. Recommended allocation: 5-10% of portfolio.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
