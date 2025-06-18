"use client"

import React, { useState, useRef } from "react"
import { BottomNavigation } from '@/src/components/bottom-navigation';

// Simple UI Components
const Card = ({ children, className = "", style = {}, ...props }: any) => (
  <div className={`bg-white rounded-lg shadow-lg border ${className}`} style={style} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className = "", ...props }: any) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
)

const Button = ({ children, className = "", size = "default", variant = "default", onClick, disabled, ...props }: any) => {
  const sizeClasses: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }
  
  const variantClasses: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  }
  
  return (
    <button
      className={`rounded-lg font-medium transition-colors ${sizeClasses[size] || sizeClasses.default} ${variantClasses[variant] || variantClasses.default} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Badge = ({ children, className = "", variant = "default", ...props }: any) => {
  const variantClasses: Record<string, string> = {
    default: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700"
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variantClasses[variant] || variantClasses.default} ${className}`} {...props}>
      {children}
    </span>
  )
}

// Simple Icons (SVG components)
const ChevronRight = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const Sun = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const Moon = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

const Zap = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const Code = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const Star = ({ className = "" }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const Clock = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const X = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ShoppingCart = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293a1 1 0 00.293 1.414L6.414 18M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
)

const Heart = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const DollarSign = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const Trophy = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10v7a5 5 0 01-10 0V7zM4 7v3a3 3 0 003 3h0M20 7v3a3 3 0 01-3 3h0M7 21h10" />
  </svg>
)

const Briefcase = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
  </svg>
)

const Target = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
  </svg>
)

const Eye = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const Building = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

interface AppCard {
  id: number
  name: string
  description: string
  category: string
  price: number
  timeline: string
  complexity: "Simple" | "Medium" | "Complex"
  features: string[]
  framework: string
  stage: "Concept" | "In Development" | "Ready" | "Live"
  image: string
  images: string[]
  rating?: number
  monthlyRevenue?: number
  downloads?: number
  fundingRaised?: number
  marketCap?: number
  ownershipPercentage?: number
  type: "for-sale" | "crowdfunding" | "custom-order"
  betting?: {
    willSucceed: {
      odds: number
      totalBets: number
      percentage: number
    }
    willFail: {
      odds: number
      totalBets: number
      percentage: number
    }
    deadline: string
    totalBettingPool: number
  }
}

const appCards: AppCard[] = [
  {
    id: 1,
    name: "EcoTracker Pro",
    description: "AI-powered sustainability tracking app with carbon footprint analytics. Built with Next.js and ML models for environmental impact tracking.",
    category: "Sustainability",
    price: 45000,
    timeline: "2 weeks",
    complexity: "Medium",
    features: ["AI Analytics", "Real-time Tracking", "Social Features", "Payment Integration"],
    framework: "Next.js + AI",
    stage: "Ready",
    image: "/ai-study-app-interface.png",
    images: ["/ai-study-app-interface.png", "/meditation-app-interface.png", "/cryptocurrency-trading-app.png"],
    rating: 4.8,
    monthlyRevenue: 12000,
    downloads: 25000,
    marketCap: 180000,
    ownershipPercentage: 100,
    type: "for-sale",
    betting: {
      willSucceed: { odds: 1.8, totalBets: 35000, percentage: 68 },
      willFail: { odds: 2.3, totalBets: 16000, percentage: 32 },
      deadline: "Mar 2025",
      totalBettingPool: 51000
    }
  },
  {
    id: 2,
    name: "FinanceFlow",
    description: "Modern personal finance management platform with crypto integration. React Native + blockchain for comprehensive wealth tracking.",
    category: "Finance",
    price: 85000,
    timeline: "3 weeks",
    complexity: "Complex",
    features: ["Crypto Integration", "AI Insights", "Multi-bank Sync", "Investment Tracking"],
    framework: "React Native + Blockchain",
    stage: "Live",
    image: "/cryptocurrency-trading-app.png",
    images: ["/cryptocurrency-trading-app.png", "/ai-study-app-interface.png", "/restaurant-discovery-app.png"],
    rating: 4.6,
    monthlyRevenue: 28000,
    downloads: 67000,
    marketCap: 450000,
    ownershipPercentage: 75,
    type: "for-sale"
  },
  {
    id: 3,
    name: "Custom E-commerce Platform",
    description: "Build your dream e-commerce platform from scratch. Full-stack development with modern payment systems and AI recommendations.",
    category: "E-commerce",
    price: 15000,
    timeline: "1-2 weeks",
    complexity: "Medium",
    features: ["Custom Design", "Payment Integration", "Admin Dashboard", "Mobile Responsive"],
    framework: "Next.js + Stripe",
    stage: "Concept",
    image: "/restaurant-discovery-app.png",
    images: ["/restaurant-discovery-app.png", "/meditation-app-interface.png", "/pet-care-app-interface.png"],
    type: "custom-order"
  },
  {
    id: 4,
    name: "MindSpace",
    description: "Mental wellness platform seeking crowdfunding. Meditation, therapy booking, and community features built with modern tech stack.",
    category: "Health & Wellness",
    price: 75000,
    timeline: "Seeking $200K",
    complexity: "Complex",
    features: ["Therapy Booking", "Community", "AI Coaching", "Progress Tracking"],
    framework: "Flutter + Firebase",
    stage: "In Development",
    image: "/meditation-app-interface.png",
    images: ["/meditation-app-interface.png", "/ai-study-app-interface.png", "/pet-care-app-interface.png"],
    rating: 4.9,
    fundingRaised: 145000,
    marketCap: 800000,
    type: "crowdfunding",
    betting: {
      willSucceed: { odds: 1.4, totalBets: 85000, percentage: 84 },
      willFail: { odds: 3.2, totalBets: 15000, percentage: 16 },
      deadline: "Apr 2025",
      totalBettingPool: 100000
    }
  },
  {
    id: 5,
    name: "PetCare Connect",
    description: "Veterinary appointment and pet health tracking app. Profitable SaaS with recurring revenue and growth potential.",
    category: "Pet Care",
    price: 32000,
    timeline: "1 week",
    complexity: "Simple",
    features: ["Appointment Booking", "Health Records", "Reminders", "Vet Network"],
    framework: "React + Node.js",
    stage: "Ready",
    image: "/pet-care-app-interface.png",
    images: ["/pet-care-app-interface.png", "/meditation-app-interface.png", "/restaurant-discovery-app.png"],
    rating: 4.5,
    monthlyRevenue: 8500,
    downloads: 18000,
    marketCap: 95000,
    ownershipPercentage: 60,
    type: "for-sale"
  }
]

interface User {
  name: string
  email: string
  avatar: string
  joinDate: string
  location: string
  bio: string
  balance: number
  portfolio: number
  successfulInvestments: number
}

const defaultUser: User = {
  name: "Alex Chen",
  email: "alex@example.com",
  avatar: "/placeholder-user.jpg",
  joinDate: "Jan 2024",
  location: "San Francisco, CA",
  bio: "Tech entrepreneur and app development enthusiast. Looking for the next big opportunity in mobile and web applications.",
  balance: 50000,
  portfolio: 285000,
  successfulInvestments: 12
}

export default function TradingCardAppPlatform() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragRotation, setDragRotation] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<"landing" | "swipe" | "portfolio" | "order" | "marketplace">("landing")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [user] = useState<User>(defaultUser)
  const [cartItems, setCartItems] = useState<AppCard[]>([])
  const [wishlistItems, setWishlistItems] = useState<AppCard[]>([])
  const [viewingProfile, setViewingProfile] = useState(false)
  const [showBettingModal, setShowBettingModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState<AppCard | null>(null)

  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })

  const currentApp = appCards[currentIndex % appCards.length]

  const themes = {
    light: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      accent: "#3b82f6",
      text: "#64748b",
      textPrimary: "#1e293b",
      border: "#e2e8f0"
    },
    dark: {
      primary: "#0f172a",
      secondary: "#1e293b",
      accent: "#6366f1",
      text: "#94a3b8",
      textPrimary: "#f1f5f9",
      border: "#334155"
    }
  }

  const currentTheme = isDarkMode ? themes.dark : themes.light

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Concept": return "bg-gray-500"
      case "In Development": return "bg-blue-500"
      case "Ready": return "bg-orange-500"
      case "Live": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple": return "bg-green-500"
      case "Medium": return "bg-yellow-500"
      case "Complex": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const handleSwipe = (direction: string) => {
    setSwipeDirection(direction)
    
    setTimeout(() => {
      if (direction === "right") {
        // Add to wishlist (like)
        if (!wishlistItems.find(item => item.id === currentApp.id)) {
          setWishlistItems(prev => [...prev, currentApp])
        }
      } else if (direction === "up") {
        // Add to cart (invest/buy)
        if (!cartItems.find(item => item.id === currentApp.id)) {
          setCartItems(prev => [...prev, currentApp])
        }
      } else if (direction === "left") {
        // Pass - just move to next
        console.log("Passed on:", currentApp.name)
      }

      setCurrentIndex((prev) => (prev + 1) % appCards.length)
      setSwipeDirection(null)
    }, 300)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    const touch = e.touches[0]
    startPos.current = { x: touch.clientX, y: touch.clientY }
    currentPos.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    currentPos.current = { x: touch.clientX, y: touch.clientY }

    const deltaX = touch.clientX - startPos.current.x
    const deltaY = touch.clientY - startPos.current.y

    const rotation = deltaX * 0.08 * (1 - Math.abs(deltaY) * 0.0008)

    setDragOffset({ x: deltaX, y: deltaY })
    setDragRotation(rotation)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const deltaX = currentPos.current.x - startPos.current.x
    const deltaY = currentPos.current.y - startPos.current.y

    const threshold = 80

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

  const renderLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-white">ECE Trading</div>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">BETA</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => setCurrentScreen("marketplace")} className="text-white/80 hover:text-white transition-colors">Marketplace</button>
          <button onClick={() => setCurrentScreen("order")} className="text-white/80 hover:text-white transition-colors">Order App</button>
          <button onClick={() => setCurrentScreen("portfolio")} className="text-white/80 hover:text-white transition-colors">Portfolio</button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Button
            onClick={() => setCurrentScreen("swipe")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
          >
            Start Trading
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Trade App
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Trading Cards
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover, invest, and trade custom-built applications like trading cards. 
            Swipe through professionally developed apps, place bets on their success, 
            and build your digital portfolio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => setCurrentScreen("swipe")}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg px-8 py-4 hover:from-purple-600 hover:to-blue-600 shadow-2xl shadow-purple-500/25"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Discovery
            </Button>
            <Button
              onClick={() => setCurrentScreen("order")}
              size="lg"
              variant="outline"
              className="border-2 border-white/20 text-white text-lg px-8 py-4 hover:bg-white/10 backdrop-blur-sm"
            >
              <Code className="mr-2 h-5 w-5" />
              Order Custom App
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                🚀
              </div>
              <h3 className="text-white font-semibold mb-2">Swipe & Discover</h3>
              <p className="text-white/70 text-sm">Browse apps like trading cards</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                💰
              </div>
              <h3 className="text-white font-semibold mb-2">Invest & Trade</h3>
              <p className="text-white/70 text-sm">Buy, sell, and trade app ownership</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                🎯
              </div>
              <h3 className="text-white font-semibold mb-2">Place Bets</h3>
              <p className="text-white/70 text-sm">Bet on app success and growth</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                🏆
              </div>
              <h3 className="text-white font-semibold mb-2">Build Portfolio</h3>
              <p className="text-white/70 text-sm">Create your digital asset collection</p>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-white/60">Apps Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">$2.5M</div>
              <div className="text-white/60">Total Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-white/60">Active Traders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-white/60">Fast Delivery</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  const renderSwipeInterface = () => (
    <div 
      className="h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: currentTheme.primary }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 z-20 relative">
        <button 
          onClick={() => setCurrentScreen("landing")}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5 text-white rotate-180" />
        </button>
        <div className="text-white font-semibold">Discover Apps</div>
        <div className="flex items-center gap-2">
          <div className="text-white text-sm">
            {currentIndex + 1} / {appCards.length}
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="relative w-full max-w-sm h-[600px]">
          {/* Current Card */}
          <Card
            className="absolute inset-0 w-full h-full cursor-pointer shadow-2xl border-0"
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragRotation}deg)`,
              transition: isDragging ? "none" : "all 0.3s ease-out",
              zIndex: 10
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setViewingProfile(true)}
          >
            {/* Swipe Direction Indicators */}
            {isDragging && (
              <>
                <div
                  className={`absolute top-1/2 left-8 transform -translate-y-1/2 transition-all duration-150 z-20 ${
                    dragOffset.x < -40 ? "opacity-100 scale-110" : "opacity-20 scale-85"
                  }`}
                >
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm border-2 border-white shadow-xl">
                    PASS
                  </div>
                </div>
                <div
                  className={`absolute top-8 left-1/2 transform -translate-x-1/2 transition-all duration-150 z-20 ${
                    dragOffset.y < -40 ? "opacity-100 scale-110" : "opacity-20 scale-85"
                  }`}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm border-2 border-white shadow-xl">
                    INVEST
                  </div>
                </div>
                <div
                  className={`absolute top-1/2 right-8 transform -translate-y-1/2 transition-all duration-150 z-20 ${
                    dragOffset.x > 40 ? "opacity-100 scale-110" : "opacity-20 scale-85"
                  }`}
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm border-2 border-white shadow-xl">
                    LIKE
                  </div>
                </div>
              </>
            )}

            <div className="relative h-full flex flex-col">
              {/* App Image */}
              <div className="h-2/3 relative overflow-hidden rounded-t-lg">
                <img
                  src={currentApp.image || "/placeholder.svg"}
                  alt={currentApp.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <Badge className={`${getStageColor(currentApp.stage)} text-white border-0`}>
                    {currentApp.stage}
                  </Badge>
                  <div className="flex gap-2">
                    <Badge className={`${getComplexityColor(currentApp.complexity)} text-white border-0 text-xs`}>
                      {currentApp.complexity}
                    </Badge>
                    {currentApp.rating && (
                      <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {currentApp.rating}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom overlay info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{currentApp.name}</h3>
                  <p className="text-sm text-white/80 mb-2">{currentApp.category}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {currentApp.timeline}
                    </span>
                    <span className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      {currentApp.framework}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="h-1/3 p-4 bg-white dark:bg-gray-900 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {currentApp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {currentApp.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price/Investment Info */}
                <div className="flex justify-between items-center">
                  {currentApp.type === "for-sale" ? (
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(currentApp.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentApp.ownershipPercentage}% ownership
                      </div>
                    </div>
                  ) : currentApp.type === "crowdfunding" ? (
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(currentApp.fundingRaised || 0)} raised
                      </div>
                      <div className="text-xs text-gray-500">
                        Goal: {formatCurrency(currentApp.price)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        From {formatCurrency(currentApp.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Custom development
                      </div>
                    </div>
                  )}

                  {currentApp.betting && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        setSelectedApp(currentApp)
                        setShowBettingModal(true)
                      }}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Bet
                    </Button>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Next Card Preview */}
          {appCards[(currentIndex + 1) % appCards.length] && (
            <Card className="absolute inset-0 w-full h-full shadow-xl border-0 -z-10 scale-95 opacity-50">
              <div className="h-2/3 relative overflow-hidden rounded-t-lg">
                <img
                  src={appCards[(currentIndex + 1) % appCards.length].image || "/placeholder.svg"}
                  alt={appCards[(currentIndex + 1) % appCards.length].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="h-1/3 p-4 bg-white dark:bg-gray-900">
                <h3 className="font-bold">
                  {appCards[(currentIndex + 1) % appCards.length].name}
                </h3>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 p-6 bg-white/5 backdrop-blur-sm">
        <button
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={() => handleSwipe("up")}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        >
          <ShoppingCart className="h-7 w-7 text-white" />
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        >
          <Heart className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center p-4 bg-white/10 backdrop-blur-sm border-t border-white/10">
        <button
          onClick={() => setCurrentScreen("portfolio")}
          className="flex flex-col items-center text-white/60 hover:text-white transition-colors"
        >
          <Briefcase className="h-5 w-5 mb-1" />
          <span className="text-xs">Portfolio</span>
        </button>
        <button className="flex flex-col items-center text-white transition-colors">
          <Zap className="h-5 w-5 mb-1" />
          <span className="text-xs">Discover</span>
        </button>
        <button
          onClick={() => setCurrentScreen("order")}
          className="flex flex-col items-center text-white/60 hover:text-white transition-colors"
        >
          <Code className="h-5 w-5 mb-1" />
          <span className="text-xs">Order</span>
        </button>
      </div>
    </div>
  )

  const renderPortfolio = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentScreen("landing")}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {formatCurrency(user.portfolio)}
            </div>
            <div className="text-white/60 text-sm">Total Value</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Balance</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(user.balance)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Investments</p>
                  <p className="text-2xl font-bold text-white">
                    {user.successfulInvestments}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Wishlist</p>
                  <p className="text-2xl font-bold text-white">{wishlistItems.length}</p>
                </div>
                <Heart className="h-8 w-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Cart</p>
                  <p className="text-2xl font-bold text-white">{cartItems.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((app) => (
            <Card key={app.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
              <div className="relative">
                <img
                  src={app.image || "/placeholder.svg"}
                  alt={app.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className={`absolute top-3 left-3 ${getStageColor(app.stage)} text-white border-0`}>
                  {app.stage}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-white mb-2">{app.name}</h3>
                <p className="text-white/70 text-sm mb-3">{app.category}</p>
                <div className="flex justify-between items-center">
                  <div className="text-green-400 font-bold">
                    {formatCurrency(app.price)}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-white/20 text-white">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white">
                      <Target className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {cartItems.length === 0 && (
            <div className="col-span-full text-center py-20">
              <Briefcase className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your portfolio is empty</h3>
              <p className="text-white/60 mb-6">Start discovering and investing in apps to build your portfolio</p>
              <Button
                onClick={() => setCurrentScreen("swipe")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
              >
                Start Discovering
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "landing":
        return renderLandingPage()
      case "swipe":
        return renderSwipeInterface()
      case "portfolio":
        return renderPortfolio()
      case "order":
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
            <Card className="max-w-2xl w-full bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Order Custom App</h2>
                <p className="text-white/80 text-center mb-8">
                  Work with our development team to create your custom application. 
                  Your app will be added to the trading marketplace once completed.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  onClick={() => window.open('/order', '_blank')}
                >
                  <Code className="mr-2 h-5 w-5" />
                  Start Custom Order
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case "marketplace":
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
            <Card className="max-w-2xl w-full bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Marketplace</h2>
                <p className="text-white/80 text-center mb-8">
                  Browse and trade app ownership, participate in crowdfunding campaigns, 
                  and discover investment opportunities in the digital app economy.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  onClick={() => setCurrentScreen("swipe")}
                >
                  <Building className="mr-2 h-5 w-5" />
                  Browse Marketplace
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return renderLandingPage()
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {renderCurrentScreen()}
      <BottomNavigation />
    </div>
  )
}
