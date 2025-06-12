"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Quicksand } from "next/font/google"
import {
  X,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
  MapPin,
  Download,
  Star,
  Smartphone,
  Globe,
  Zap,
  Sun,
  Moon,
  CheckCircle,
  Calculator,
  CreditCard,
  Shield,
} from "lucide-react"
import DesktopLayout from "./desktop-layout"

// Add this style block at the top of the component, right after the imports
const scrollbarStyles = `
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar { 
  display: none;  /* Safari and Chrome */
}
`

// Add this style block at the top of the component, right after the scrollbarStyles
const fontStyles = `
h1, h2, h3, h4, h5, h6, .font-heading {
  font-family: var(--font-quicksand);
}
`

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
})

interface App {
  id: number
  name: string
  description: string
  category: string
  fundingGoal?: number
  currentFunding?: number
  backers?: number
  location: string
  image: string
  images: string[]
  type: "crowdfunding" | "marketplace"
  price?: number
  valuation?: number
  downloads?: number
  rating?: number
  revenue?: number
  ownershipPercentage?: number
  platform: "iOS" | "Android" | "Web" | "Cross-platform"
  stage: "Idea" | "MVP" | "Growth" | "Profitable"
  monthlyUsers?: number
  betting?: {
    willReachGoal: {
      odds: number
      totalBets: number
      percentage: number
    }
    wontReachGoal: {
      odds: number
      totalBets: number
      percentage: number
    }
    deadline: string
    totalBettingPool: number
    predictions: {
      bullish: number
      bearish: number
      neutral: number
    }
  }
}

const apps: App[] = [
  {
    id: 1,
    name: "MindfulMoments",
    description:
      "AI-powered meditation app with personalized sessions. Growing 40% month-over-month with 50K+ active users.",
    category: "Health & Wellness",
    fundingGoal: 250000,
    currentFunding: 180000,
    backers: 847,
    location: "San Francisco, CA",
    image: "/meditation-app-interface.png",
    images: ["/meditation-app-interface.png", "/placeholder-6x8w1.png", "/restaurant-discovery-app.png"],
    type: "crowdfunding",
    valuation: 2000000,
    downloads: 125000,
    rating: 4.8,
    platform: "Cross-platform",
    stage: "Growth",
    monthlyUsers: 52000,
    betting: {
      willReachGoal: {
        odds: 1.65,
        totalBets: 45000,
        percentage: 73,
      },
      wontReachGoal: {
        odds: 2.35,
        totalBets: 16500,
        percentage: 27,
      },
      deadline: "Dec 31, 2024",
      totalBettingPool: 61500,
      predictions: {
        bullish: 68,
        bearish: 22,
        neutral: 10,
      },
    },
  },
  {
    id: 2,
    name: "TaskFlow Pro",
    description: "Premium productivity app with 10K+ paying subscribers. Proven revenue model, seeking new ownership.",
    category: "Productivity",
    location: "Austin, TX",
    image: "/placeholder-6x8w1.png",
    images: ["/placeholder-6x8w1.png", "/meditation-app-interface.png", "/restaurant-discovery-app.png"],
    type: "marketplace",
    price: 450000,
    valuation: 1200000,
    downloads: 89000,
    rating: 4.6,
    revenue: 45000,
    ownershipPercentage: 75,
    platform: "iOS",
    stage: "Profitable",
    monthlyUsers: 28000,
  },
  {
    id: 3,
    name: "CryptoTracker",
    description:
      "Real-time crypto portfolio tracker with advanced analytics. Seeking funding for institutional features.",
    category: "Finance",
    fundingGoal: 500000,
    currentFunding: 75000,
    backers: 234,
    location: "New York, NY",
    image: "/cryptocurrency-trading-app.png",
    images: ["/cryptocurrency-trading-app.png", "/placeholder-6x8w1.png", "/restaurant-discovery-app.png"],
    type: "crowdfunding",
    valuation: 5000000,
    downloads: 45000,
    rating: 4.4,
    platform: "Cross-platform",
    stage: "MVP",
    monthlyUsers: 15000,
    betting: {
      willReachGoal: {
        odds: 3.2,
        totalBets: 12000,
        percentage: 35,
      },
      wontReachGoal: {
        odds: 1.4,
        totalBets: 22000,
        percentage: 65,
      },
      deadline: "Mar 15, 2025",
      totalBettingPool: 34000,
      predictions: {
        bullish: 28,
        bearish: 58,
        neutral: 14,
      },
    },
  },
  {
    id: 4,
    name: "FoodieFinds",
    description:
      "Local restaurant discovery app with 25K+ monthly users. Established revenue from restaurant partnerships.",
    category: "Food & Drink",
    location: "Portland, OR",
    image: "/restaurant-discovery-app.png",
    images: ["/restaurant-discovery-app.png", "/placeholder-6x8w1.png", "/meditation-app-interface.png"],
    type: "marketplace",
    price: 180000,
    valuation: 600000,
    downloads: 67000,
    rating: 4.7,
    revenue: 12000,
    ownershipPercentage: 100,
    platform: "Cross-platform",
    stage: "Growth",
    monthlyUsers: 25000,
  },
  {
    id: 5,
    name: "StudyBuddy AI",
    description: "AI-powered study companion for students. Viral growth in universities, seeking expansion funding.",
    category: "Education",
    fundingGoal: 300000,
    currentFunding: 220000,
    backers: 1456,
    location: "Boston, MA",
    image: "/ai-study-app-interface.png",
    images: ["/ai-study-app-interface.png", "/placeholder-6x8w1.png", "/restaurant-discovery-app.png"],
    type: "crowdfunding",
    valuation: 3500000,
    downloads: 156000,
    rating: 4.9,
    platform: "Cross-platform",
    stage: "Growth",
    monthlyUsers: 78000,
    betting: {
      willReachGoal: {
        odds: 1.25,
        totalBets: 85000,
        percentage: 89,
      },
      wontReachGoal: {
        odds: 4.5,
        totalBets: 10500,
        percentage: 11,
      },
      deadline: "Jan 20, 2025",
      totalBettingPool: 95500,
      predictions: {
        bullish: 84,
        bearish: 8,
        neutral: 8,
      },
    },
  },
  {
    id: 6,
    name: "PetCare Plus",
    description:
      "Comprehensive pet health tracking app. Profitable with veterinary partnerships. Partial ownership available.",
    category: "Lifestyle",
    location: "Denver, CO",
    image: "/pet-care-app-interface.png",
    images: ["/pet-care-app-interface.png", "/placeholder-6x8w1.png", "/restaurant-discovery-app.png"],
    type: "marketplace",
    price: 85000,
    valuation: 400000,
    downloads: 34000,
    rating: 4.5,
    revenue: 8500,
    ownershipPercentage: 30,
    platform: "iOS",
    stage: "Profitable",
    monthlyUsers: 12000,
  },
]

// Chart data for each app with projections
const chartData: Record<number, { revenue: any[]; users: any[]; projectedRevenue: any[]; projectedUsers: any[] }> = {
  1: {
    // MindfulMoments - High growth trajectory
    revenue: [
      { month: "Jan", revenue: 2500, type: "actual" },
      { month: "Feb", revenue: 3200, type: "actual" },
      { month: "Mar", revenue: 4100, type: "actual" },
      { month: "Apr", revenue: 5800, type: "actual" },
      { month: "May", revenue: 7200, type: "actual" },
      { month: "Jun", revenue: 9500, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 12000, type: "actual" },
      { month: "Feb", users: 18500, type: "actual" },
      { month: "Mar", users: 26000, type: "actual" },
      { month: "Apr", users: 35000, type: "actual" },
      { month: "May", users: 44000, type: "actual" },
      { month: "Jun", users: 52000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 9500, type: "actual" },
      { month: "Jul", revenue: 12500, type: "projected" },
      { month: "Aug", revenue: 16200, type: "projected" },
      { month: "Sep", revenue: 21000, type: "projected" },
      { month: "Oct", revenue: 27300, type: "projected" },
      { month: "Nov", revenue: 35500, type: "projected" },
      { month: "Dec", revenue: 46200, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 52000, type: "actual" },
      { month: "Jul", users: 68000, type: "projected" },
      { month: "Aug", users: 88000, type: "projected" },
      { month: "Sep", users: 114000, type: "projected" },
      { month: "Oct", users: 148000, type: "projected" },
      { month: "Nov", users: 192000, type: "projected" },
      { month: "Dec", users: 250000, type: "projected" },
    ],
  },
  2: {
    // TaskFlow Pro - Stable growth
    revenue: [
      { month: "Jan", revenue: 38000, type: "actual" },
      { month: "Feb", revenue: 41000, type: "actual" },
      { month: "Mar", revenue: 43500, type: "actual" },
      { month: "Apr", revenue: 45000, type: "actual" },
      { month: "May", revenue: 45000, type: "actual" },
      { month: "Jun", revenue: 45000, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 24000, type: "actual" },
      { month: "Feb", users: 25500, type: "actual" },
      { month: "Mar", users: 26800, type: "actual" },
      { month: "Apr", users: 27500, type: "actual" },
      { month: "May", users: 28000, type: "actual" },
      { month: "Jun", users: 28000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 45000, type: "actual" },
      { month: "Jul", revenue: 46500, type: "projected" },
      { month: "Aug", revenue: 48000, type: "projected" },
      { month: "Sep", revenue: 49500, type: "projected" },
      { month: "Oct", revenue: 51000, type: "projected" },
      { month: "Nov", revenue: 52500, type: "projected" },
      { month: "Dec", revenue: 54000, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 28000, type: "actual" },
      { month: "Jul", users: 29000, type: "projected" },
      { month: "Aug", users: 30000, type: "projected" },
      { month: "Sep", users: 31000, type: "projected" },
      { month: "Oct", users: 32000, type: "projected" },
      { month: "Nov", users: 33000, type: "projected" },
      { month: "Dec", users: 34000, type: "projected" },
    ],
  },
  3: {
    // CryptoTracker - Exponential early growth
    revenue: [
      { month: "Jan", revenue: 0, type: "actual" },
      { month: "Feb", revenue: 500, type: "actual" },
      { month: "Mar", revenue: 1200, type: "actual" },
      { month: "Apr", revenue: 2800, type: "actual" },
      { month: "May", revenue: 4500, type: "actual" },
      { month: "Jun", revenue: 6200, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 2000, type: "actual" },
      { month: "Feb", users: 4500, type: "actual" },
      { month: "Mar", users: 7800, type: "actual" },
      { month: "Apr", users: 11000, type: "actual" },
      { month: "May", users: 13500, type: "actual" },
      { month: "Jun", users: 15000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 6200, type: "actual" },
      { month: "Jul", revenue: 9800, type: "projected" },
      { month: "Aug", revenue: 15200, type: "projected" },
      { month: "Sep", revenue: 23500, type: "projected" },
      { month: "Oct", revenue: 36000, type: "projected" },
      { month: "Nov", revenue: 55000, type: "projected" },
      { month: "Dec", revenue: 84000, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 15000, type: "actual" },
      { month: "Jul", users: 19500, type: "projected" },
      { month: "Aug", users: 25500, type: "projected" },
      { month: "Sep", users: 33000, type: "projected" },
      { month: "Oct", users: 43000, type: "projected" },
      { month: "Nov", users: 56000, type: "projected" },
      { month: "Dec", users: 73000, type: "projected" },
    ],
  },
  4: {
    // FoodieFinds - Moderate steady growth
    revenue: [
      { month: "Jan", revenue: 8500, type: "actual" },
      { month: "Feb", revenue: 9200, type: "actual" },
      { month: "Mar", revenue: 10100, type: "actual" },
      { month: "Apr", revenue: 11200, type: "actual" },
      { month: "May", revenue: 11800, type: "actual" },
      { month: "Jun", revenue: 12000, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 18000, type: "actual" },
      { month: "Feb", users: 20500, type: "actual" },
      { month: "Mar", users: 22000, type: "actual" },
      { month: "Apr", users: 23500, type: "actual" },
      { month: "May", users: 24500, type: "actual" },
      { month: "Jun", users: 25000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 12000, type: "actual" },
      { month: "Jul", revenue: 13200, type: "projected" },
      { month: "Aug", revenue: 14500, type: "projected" },
      { month: "Sep", revenue: 16000, type: "projected" },
      { month: "Oct", revenue: 17600, type: "projected" },
      { month: "Nov", revenue: 19400, type: "projected" },
      { month: "Dec", revenue: 21300, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 25000, type: "actual" },
      { month: "Jul", users: 27500, type: "projected" },
      { month: "Aug", users: 30000, type: "projected" },
      { month: "Sep", users: 33000, type: "projected" },
      { month: "Oct", users: 36000, type: "projected" },
      { month: "Nov", users: 39500, type: "projected" },
      { month: "Dec", users: 43000, type: "projected" },
    ],
  },
  5: {
    // StudyBuddy AI - Viral growth
    revenue: [
      { month: "Jan", revenue: 1200, type: "actual" },
      { month: "Feb", revenue: 2800, type: "actual" },
      { month: "Mar", revenue: 5500, type: "actual" },
      { month: "Apr", revenue: 12000, type: "actual" },
      { month: "May", revenue: 18500, type: "actual" },
      { month: "Jun", revenue: 24000, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 15000, type: "actual" },
      { month: "Feb", users: 28000, type: "actual" },
      { month: "Mar", users: 42000, type: "actual" },
      { month: "Apr", users: 58000, type: "actual" },
      { month: "May", users: 68000, type: "actual" },
      { month: "Jun", users: 78000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 24000, type: "actual" },
      { month: "Jul", revenue: 32000, type: "projected" },
      { month: "Aug", revenue: 42500, type: "projected" },
      { month: "Sep", revenue: 56500, type: "projected" },
      { month: "Oct", revenue: 75000, type: "projected" },
      { month: "Nov", revenue: 99500, type: "projected" },
      { month: "Dec", revenue: 132000, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 78000, type: "actual" },
      { month: "Jul", users: 95000, type: "projected" },
      { month: "Aug", users: 115000, type: "projected" },
      { month: "Sep", users: 140000, type: "projected" },
      { month: "Oct", users: 170000, type: "projected" },
      { month: "Nov", users: 206000, type: "projected" },
      { month: "Dec", users: 250000, type: "projected" },
    ],
  },
  6: {
    // PetCare Plus - Slow steady growth
    revenue: [
      { month: "Jan", revenue: 7200, type: "actual" },
      { month: "Feb", revenue: 7800, type: "actual" },
      { month: "Mar", revenue: 8100, type: "actual" },
      { month: "Apr", revenue: 8300, type: "actual" },
      { month: "May", revenue: 8400, type: "actual" },
      { month: "Jun", revenue: 8500, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 10500, type: "actual" },
      { month: "Feb", users: 11200, type: "actual" },
      { month: "Mar", users: 11600, type: "actual" },
      { month: "Apr", users: 11800, type: "actual" },
      { month: "May", users: 12000, type: "actual" },
      { month: "Jun", users: 12000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 8500, type: "actual" },
      { month: "Jul", revenue: 8800, type: "projected" },
      { month: "Aug", revenue: 9100, type: "projected" },
      { month: "Sep", revenue: 9400, type: "projected" },
      { month: "Oct", revenue: 9700, type: "projected" },
      { month: "Nov", revenue: 10000, type: "projected" },
      { month: "Dec", revenue: 10300, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 12000, type: "actual" },
      { month: "Jul", users: 12500, type: "projected" },
      { month: "Aug", users: 13000, type: "projected" },
      { month: "Sep", users: 13500, type: "projected" },
      { month: "Oct", users: 14000, type: "projected" },
      { month: "Nov", users: 14500, type: "projected" },
      { month: "Dec", users: 15000, type: "projected" },
    ],
  },
}

// Betting Checkout Component
interface BettingCheckoutProps {
  app: App
  betType: "for" | "against"
  onClose: () => void
}

function BettingCheckout({ app, betType, onClose }: BettingCheckoutProps) {
  const [betAmount, setBetAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [step, setStep] = useState<"amount" | "payment" | "confirmation">("amount")
  const [isProcessing, setIsProcessing] = useState(false)

  const odds = betType === "for" ? app.betting?.willReachGoal.odds || 1.5 : app.betting?.wontReachGoal.odds || 2.0
  const potentialPayout = betAmount ? (Number.parseFloat(betAmount) * odds).toFixed(2) : "0.00"
  const profit = betAmount ? (Number.parseFloat(potentialPayout) - Number.parseFloat(betAmount)).toFixed(2) : "0.00"

  const handleAmountSubmit = () => {
    if (betAmount && Number.parseFloat(betAmount) >= 100) {
      setStep("payment")
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setStep("confirmation")
  }

  const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {step === "amount" && "Place Your Bet"}
            {step === "payment" && "Payment Details"}
            {step === "confirmation" && "Bet Confirmed!"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === "amount" && (
          <div className="p-6 space-y-6">
            {/* App Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={app.image || "/placeholder.svg"}
                  alt={app.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{app.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                {betType === "for" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`font-medium ${betType === "for" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  Betting {betType.toUpperCase()} reaching ${(app.fundingGoal || 0).toLocaleString()} goal
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current: ${(app.currentFunding || 0).toLocaleString()} • {app.betting?.deadline || "TBD"}
              </div>
            </div>

            {/* Bet Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bet Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0 ECE"
                  min="100"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount.toString())}
                    className="py-2 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {amount} ECE
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Calculation */}
            {betAmount && Number.parseFloat(betAmount) > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Payout Calculation</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bet Amount:</span>
                    <span className="font-medium">{betAmount} ECE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Odds:</span>
                    <span className="font-medium">{odds}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Potential Payout:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{potentialPayout} ECE</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-2">
                    <span className="text-gray-600 dark:text-gray-400">Profit if Won:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">+{profit} ECE</span>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Risk Warning</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Betting involves risk. Only bet what you can afford to lose. All bets are placed using ECE tokens.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleAmountSubmit}
              disabled={!betAmount || Number.parseFloat(betAmount) < 100}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === "payment" && (
          <div className="p-6 space-y-6">
            {/* Bet Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Bet Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">App:</span>
                  <span>{app.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bet Type:</span>
                  <span
                    className={
                      betType === "for" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }
                  >
                    {betType.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium">{betAmount} ECE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Potential Payout:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{potentialPayout} ECE</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Credit/Debit Card</span>
                </label>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("amount")}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? "Processing..." : `Place Bet - ${betAmount} ECE`}
              </button>
            </div>
          </div>
        )}

        {step === "confirmation" && (
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bet Placed Successfully!</h3>
              <p className="text-gray-600 dark:text-gray-400">Your bet has been confirmed and is now active.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Bet Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bet ID:</span>
                  <span className="font-mono">#BET{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">App:</span>
                  <span>{app.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span
                    className={
                      betType === "for" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }
                  >
                    {betType.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium">{betAmount} ECE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Potential Payout:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{potentialPayout} ECE</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              You can track your bet progress in your profile under "My Bets"
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AppSwipeApp() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragRotation, setDragRotation] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const [viewingProfile, setViewingProfile] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<"swipe" | "profile" | "cart" | "wishlist" | "checkout">("swipe")
  const [cartItems, setCartItems] = useState<App[]>([])
  const [wishlistItems, setWishlistItems] = useState<App[]>([])
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Betting state
  const [showBettingCheckout, setShowBettingCheckout] = useState(false)
  const [bettingApp, setBettingApp] = useState<App | null>(null)
  const [betType, setBetType] = useState<"for" | "against">("for")

  // Add photo carousel state and functionality to the mobile view
  // Add these state variables after the existing state declarations
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<Record<number, number>>({})
  const [isPhotoSwiping, setIsPhotoSwiping] = useState(false)
  const photoStartPos = useRef({ x: 0, y: 0 })

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

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [investmentAmount, setInvestmentAmount] = useState<number | undefined>(undefined)
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCVC, setCardCVC] = useState("")
  const [billingAddress, setBillingAddress] = useState("")
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)

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

  // Add this useEffect to inject the styles
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = scrollbarStyles + fontStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const currentApp = apps[currentIndex]
  const nextApp = apps[currentIndex + 1]

  // Add photo swipe handlers
  const handlePhotoTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
    setIsPhotoSwiping(true)
    const touch = e.touches[0]
    photoStartPos.current = { x: touch.clientX, y: touch.clientY }
  }

  const handlePhotoTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  const handlePhotoTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation()
    if (!isPhotoSwiping) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - photoStartPos.current.x
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

  const handlePhotoMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPhotoSwiping(true)
    photoStartPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePhotoMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isPhotoSwiping) return

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

  const handleSwipe = (direction: "left" | "right" | "up") => {
    setSwipeDirection(direction)

    // Smoother transition timing
    setTimeout(() => {
      if (direction === "up") {
        setCartItems((prev) => [...prev.filter((item) => item.id !== currentApp.id), currentApp])
        console.log("Added to cart:", currentApp.name)
      } else if (direction === "right") {
        setWishlistItems((prev) => [...prev.filter((item) => item.id !== currentApp.id), currentApp])
        console.log("Added to wishlist:", currentApp.name)
      } else {
        console.log("Discarded:", currentApp.name)
      }

      // Smoother transition to next card
      setCurrentIndex((prev) => (prev + 1) % apps.length)
      setSwipeDirection(null)

      // Reset photo index for new card
      setCurrentPhotoIndex((prev) => ({
        ...prev,
        [apps[(currentIndex + 1) % apps.length].id]: 0,
      }))
    }, 350) // Reduced duration for snappier feel
  }

  const handleCardTap = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent tap during drag
    if (isDragging) return

    // Only trigger on single tap, not during swipe gestures
    const deltaX = Math.abs(currentPos.current.x - startPos.current.x)
    const deltaY = Math.abs(currentPos.current.y - startPos.current.y)

    if (deltaX < 10 && deltaY < 10) {
      setViewingProfile(true)
    }
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    const touch = e.touches[0]
    startPos.current = { x: touch.clientX, y: touch.clientY }
    currentPos.current = { x: touch.clientX, y: touch.clientY }
  }

  // Enhanced touch move handler with momentum and better physics
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    currentPos.current = { x: touch.clientX, y: touch.clientY }

    const deltaX = touch.clientX - startPos.current.x
    const deltaY = touch.clientY - startPos.current.y

    // Smoother rotation with better physics
    const rotation = deltaX * 0.08 * (1 - Math.abs(deltaY) * 0.0008)

    // Reduced spring effect for smoother movement
    const momentum = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.005
    const springEffect = Math.sin(momentum) * 1

    setDragOffset({ x: deltaX, y: deltaY })
    setDragRotation(rotation + springEffect)
  }

  // Enhanced touch end with better velocity detection and smoother thresholds
  const handleTouchEnd = () => {
    if (!isDragging) return

    const deltaX = currentPos.current.x - startPos.current.x
    const deltaY = currentPos.current.y - startPos.current.y

    // Calculate velocity for more responsive swipes with smoother thresholds
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const threshold = velocity > 100 ? 60 : 90 // Lower thresholds for easier swiping

    if (Math.abs(deltaY) > threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical swipe
      if (deltaY < 0) {
        handleSwipe("up")
      }
    } else if (Math.abs(deltaX) > threshold) {
      // Horizontal swipe
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    startPos.current = { x: e.clientX, y: e.clientY }
    currentPos.current = { x: e.clientX, y: e.clientY }
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      currentPos.current = { x: e.clientX, y: e.clientY }

      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientX - startPos.current.y

      const rotation = deltaX * 0.1

      setDragOffset({ x: deltaX, y: deltaY })
      setDragRotation(rotation)
    }

    const handleGlobalMouseUp = () => {
      if (!isDragging) return

      const deltaX = currentPos.current.x - startPos.current.x
      const deltaY = currentPos.current.y - startPos.current.y
      const threshold = 100

      if (Math.abs(deltaY) > threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical swipe
        if (deltaY < 0) {
          handleSwipe("up")
        }
      } else if (Math.abs(deltaX) > threshold) {
        // Horizontal swipe
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

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging])

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

  const removeFromCart = (appId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== appId))
  }

  const removeFromWishlist = (appId: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== appId))
  }

  const moveToCart = (app: App) => {
    setCartItems((prev) => [...prev.filter((item) => item.id !== app.id), app])
    setWishlistItems((prev) => prev.filter((item) => item.id !== app.id))
  }

  // Checkout functions
  const startCheckout = () => {
    setCheckoutStep(1)
    setCurrentScreen("checkout")
  }

  const nextCheckoutStep = () => {
    setCheckoutStep((prev) => prev + 1)
  }

  const prevCheckoutStep = () => {
    setCheckoutStep((prev) => prev - 1)
  }

  const calculateProcessingFees = (amount: number) => {
    // 2.9% + $0.30
    return amount * 0.029 + 0.3
  }

  const handleInvestmentAmountChange = (amount: number) => {
    setInvestmentAmount(amount)
  }

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      // Payment successful
      alert("Payment successful! Check your email for confirmation.")
      // Reset checkout state
      setCartItems([])
      setCheckoutStep(1)
      setCurrentScreen("swipe")
    }, 2000)
  }

  // Betting functions
  const handleBet = (app: App, type: "for" | "against") => {
    setBettingApp(app)
    setBetType(type)
    setShowBettingCheckout(true)
  }

  // Add bookmark state after existing state
  const [bookmarkedItems, setBookmarkedItems] = useState<App[]>([])

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

  // Navigation wrapper
  return (
    <div className="w-full h-screen">
      {/* Mobile Layout - Hidden on desktop */}
      <div className="block lg:hidden">
        {/* Keep existing mobile layout code here */}
        <div
          className={`h-screen w-screen flex flex-col overflow-hidden ${quicksand.className}`}
          style={{ backgroundColor: currentTheme.primary }}
        >
          {/* All existing mobile code stays exactly the same */}
          {/* Theme Toggle - Fixed position */}

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {currentScreen === "swipe" && !viewingProfile && (
              // Existing swipe interface code goes here - move the current card deck view
              <div
                className="h-full w-full flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {/* Enhanced Card Stack with Physics */}
                <div className="relative w-full max-w-sm h-[85vh] max-h-[900px]">
                  {/* Background Cards Stack with smoother transitions */}
                  {[3, 2, 1].map((offset) => {
                    const bgApp = apps[(currentIndex + offset) % apps.length]
                    if (!bgApp) return null

                    return (
                      <Card
                        key={`bg-${bgApp.id}-${offset}`}
                        className="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
                        style={{
                          backgroundColor: currentTheme.secondary,
                          borderColor: currentTheme.border,
                          transform: `scale(${0.88 + offset * 0.04}) translateY(${offset * 6}px)`,
                          opacity: 0.08 + offset * 0.08,
                          zIndex: offset,
                          filter: `blur(${(4 - offset) * 0.3}px)`,
                        }}
                      >
                        <div className="relative h-full">
                          <img
                            src={bgApp.image || "/placeholder.svg"}
                            alt={bgApp.name}
                            className="w-full h-72 object-cover rounded-t-lg"
                          />
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg" style={{ color: currentTheme.textPrimary }}>
                              {bgApp.name}
                            </h3>
                          </CardContent>
                        </div>
                      </Card>
                    )
                  })}

                  {/* Next Card (Immediate Background) */}
                  {nextApp && (
                    <Card
                      className="absolute inset-0 w-full h-full transition-all duration-300 ease-out"
                      style={{
                        backgroundColor: currentTheme.secondary,
                        borderColor: currentTheme.border,
                        transform: `scale(0.95) translateY(4px)`,
                        opacity: 0.3,
                        zIndex: 8,
                      }}
                    >
                      <div className="relative h-full">
                        <img
                          src={nextApp.image || "/placeholder.svg"}
                          alt={nextApp.name}
                          className="w-full h-72 object-cover rounded-t-lg"
                        />
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg" style={{ color: currentTheme.textPrimary }}>
                            {nextApp.name}
                          </h3>
                        </CardContent>
                      </div>
                    </Card>
                  )}

                  {/* Current Card with Enhanced Physics */}
                  <Card
                    ref={cardRef}
                    className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none rounded-xl overflow-hidden ${
                      swipeDirection === "left"
                        ? "transition-all duration-500 ease-out"
                        : swipeDirection === "right"
                          ? "transition-all duration-500 ease-out"
                          : swipeDirection === "up"
                            ? "transition-all duration-500 ease-out"
                            : isDragging
                              ? ""
                              : "transition-all duration-300 ease-out"
                    }`}
                    style={{
                      backgroundColor: currentTheme.secondary,
                      borderColor: currentTheme.border,
                      transform: isDragging
                        ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragRotation}deg) scale(${Math.max(0.96, 1 - Math.abs(dragOffset.x) * 0.0003)})`
                        : swipeDirection === "left"
                          ? "translate(-120vw, 0px) rotate(25deg) scale(0.85)"
                          : swipeDirection === "right"
                            ? "translate(120vw, 0px) rotate(-25deg) scale(0.85)"
                            : swipeDirection === "up"
                              ? "translate(0px, -120vh) rotate(8deg) scale(0.85)"
                              : "translate(0px, 0px) rotate(0deg) scale(1)",
                      zIndex: 10,
                      boxShadow: isDragging
                        ? `0 ${Math.abs(dragOffset.y) * 0.08 + 15}px ${Math.abs(dragOffset.x) * 0.03 + 30}px rgba(0,0,0,0.25)`
                        : "0 15px 30px rgba(0,0,0,0.12)",
                      filter: isDragging ? `brightness(${1 + Math.abs(dragOffset.x) * 0.0001})` : "brightness(1)",
                      transition: isDragging ? "none" : "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onClick={handleCardTap}
                  >
                    {/* Enhanced Swipe Indicators with smoother physics */}
                    {isDragging && (
                      <>
                        <div
                          className={`absolute top-1/2 left-8 transform -translate-y-1/2 transition-all duration-150 z-20 ${
                            dragOffset.x < -40 ? "opacity-100 scale-110" : "opacity-20 scale-85"
                          }`}
                          style={{
                            transform: `translateY(-50%) scale(${dragOffset.x < -40 ? 1.1 : 0.85}) rotate(${Math.max(-10, dragOffset.x * 0.08)}deg)`,
                          }}
                        >
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2.5 rounded-full font-bold text-base border-3 border-white shadow-xl">
                            PASS
                          </div>
                        </div>
                        <div
                          className={`absolute top-8 left-1/2 transform -translate-x-1/2 transition-all duration-150 z-20 ${
                            dragOffset.y < -40 ? "opacity-100 scale-110" : "opacity-20 scale-85"
                          }`}
                          style={{
                            transform: `translateX(-50%) scale(${dragOffset.y < -40 ? 1.1 : 0.85}) rotate(${Math.max(-8, dragOffset.y * 0.04)}deg)`,
                          }}
                        >
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-full font-bold text-base border-3 border-white shadow-xl">
                            INVEST
                          </div>
                        </div>
                        <div
                          className={`absolute top-1/2 right-8 transform -translate-y-1/2 transition-all duration-150 z-20 ${
                            dragOffset.x > 40 ? "opacity-100 scale-110" : "opacity-20 scale-85"
                          }`}
                          style={{
                            transform: `translateY(-50%) scale(${dragOffset.x > 40 ? 1.1 : 0.85}) rotate(${Math.min(10, dragOffset.x * 0.08)}deg)`,
                          }}
                        >
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2.5 rounded-full font-bold text-base border-3 border-white shadow-xl">
                            LIKE
                          </div>
                        </div>
                      </>
                    )}

                    {/* Card Content remains the same */}
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
                              className="w-full h-full object-cover flex-shrink-0"
                              onTouchStart={handlePhotoTouchStart}
                              onTouchMove={handlePhotoTouchMove}
                              onTouchEnd={handlePhotoTouchEnd}
                              onMouseDown={handlePhotoMouseDown}
                              onMouseUp={handlePhotoMouseUp}
                            />
                          ))}
                        </div>

                        {/* Photo indicators */}
                        {currentApp.images.length > 1 && (
                          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {currentApp.images.map((_, index) => (
                              <div
                                key={index}
                                className={`h-1 rounded-full transition-all duration-200 ${
                                  index === (currentPhotoIndex[currentApp.id] || 0) ? "bg-white w-6" : "bg-white/50 w-3"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none"></div>

                      {/* Top badges overlay */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-auto z-10">
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
                          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {currentApp.rating}
                          </div>
                          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
                            <Download className="h-3 w-3" />
                            {formatNumber(currentApp.downloads || 0)}
                          </div>
                        </div>
                      </div>

                      {/* Bookmark button - positioned in top right */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(currentApp)
                        }}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-200"
                      >
                        <svg
                          className={`w-5 h-5 transition-colors duration-200 ${
                            isBookmarked(currentApp.id)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-white/70 hover:text-white"
                          }`}
                          fill={isBookmarked(currentApp.id) ? "currentColor" : "none"}
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

                      {/* Content section - positioned at the bottom */}
                      <div className="relative mt-auto p-4 z-10">
                        {/* App header */}
                        <div className="mb-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-xl text-white mb-1 truncate">{currentApp.name}</h3>
                              <div className="flex items-center gap-1 text-white/80 mb-2">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="text-sm truncate">{currentApp.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                              <Badge className={`${getStageColor(currentApp.stage)} text-white border-0 text-xs`}>
                                {currentApp.stage}
                              </Badge>
                              <Badge className="text-xs flex items-center gap-1 bg-white/20 text-white border-white/20">
                                {getPlatformIcon(currentApp.platform)}
                                <span className="hidden sm:inline">{currentApp.platform}</span>
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                              {currentApp.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-white/90 line-clamp-2 mb-3">{currentApp.description}</p>

                        {/* Key metrics - compact grid */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <Users className="h-3 w-3 text-blue-400" />
                              <span className="text-xs font-medium text-white/80">Users</span>
                            </div>
                            <p className="font-bold text-sm text-white">{formatNumber(currentApp.monthlyUsers || 0)}</p>
                          </div>
                          {currentApp.revenue && (
                            <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg">
                              <div className="flex items-center gap-1 mb-1">
                                <DollarSign className="h-3 w-3 text-green-400" />
                                <span className="text-xs font-medium text-white/80">Revenue</span>
                              </div>
                              <p className="font-bold text-sm text-white">{formatCurrency(currentApp.revenue)}</p>
                            </div>
                          )}
                        </div>

                        {/* Funding or Price info - more compact */}
                        {currentApp.type === "crowdfunding" ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-white">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm font-bold">
                                {getFundingPercentage(currentApp.currentFunding || 0, currentApp.fundingGoal || 1)}%
                              </span>
                            </div>

                            <div className="w-full bg-white/20 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(getFundingPercentage(currentApp.currentFunding || 0, currentApp.fundingGoal || 1), 100)}%`,
                                }}
                              />
                            </div>

                            <div className="flex justify-between text-xs">
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
                              <span className="text-xl font-bold text-green-400">
                                {formatCurrency(currentApp.price || 0)}
                              </span>
                              <p className="text-xs text-white/80">{currentApp.ownershipPercentage}% ownership</p>
                            </div>
                            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Available</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {currentScreen === "profile" && (
              <div className="p-4 sm:p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                    Profile
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                  >
                    Edit Profile
                  </Button>
                </div>

                <Card style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6 mb-6">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-2xl font-bold mb-1" style={{ color: currentTheme.textPrimary }}>
                          {user.name}
                        </h3>
                        <p className="text-gray-500" style={{ color: currentTheme.text }}>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: currentTheme.textPrimary }}>
                          Join Date
                        </h4>
                        <p style={{ color: currentTheme.text }}>{user.joinDate}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: currentTheme.textPrimary }}>
                          Location
                        </h4>
                        <p style={{ color: currentTheme.text }}>{user.location}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1" style={{ color: currentTheme.textPrimary }}>
                        Bio
                      </h4>
                      <p style={{ color: currentTheme.text }}>{user.bio}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Settings Section */}
                <Card
                  className="mt-6"
                  style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4" style={{ color: currentTheme.textPrimary }}>
                      Settings
                    </h3>

                    <div className="space-y-4">
                      {/* Theme Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                            Theme
                          </h4>
                          <p className="text-sm" style={{ color: currentTheme.text }}>
                            Choose your preferred theme
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className="flex items-center gap-2"
                          style={{
                            borderColor: currentTheme.border,
                            backgroundColor: currentTheme.secondary,
                            color: currentTheme.text,
                          }}
                        >
                          {isDarkMode ? (
                            <>
                              <Moon className="h-4 w-4" />
                              <span>Dark</span>
                            </>
                          ) : (
                            <>
                              <Sun className="h-4 w-4" />
                              <span>Light</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Notifications */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                            Notifications
                          </h4>
                          <p className="text-sm" style={{ color: currentTheme.text }}>
                            Manage your notification preferences
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                        >
                          Configure
                        </Button>
                      </div>

                      {/* Privacy */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                            Privacy
                          </h4>
                          <p className="text-sm" style={{ color: currentTheme.text }}>
                            Control your privacy settings
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                        >
                          Manage
                        </Button>
                      </div>

                      {/* Account */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                            Account
                          </h4>
                          <p className="text-sm" style={{ color: currentTheme.text }}>
                            Manage your account settings
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                        >
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  <Card style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          Investments
                        </h3>
                        <Users className="h-6 w-6" style={{ color: currentTheme.text }} />
                      </div>
                      <p className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        {user.totalInvestments}
                      </p>
                      <p className="text-sm text-gray-500 mt-1" style={{ color: currentTheme.text }}>
                        Total investments made
                      </p>
                    </CardContent>
                  </Card>

                  <Card style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          Portfolio Value
                        </h3>
                        <DollarSign className="h-6 w-6" style={{ color: currentTheme.text }} />
                      </div>
                      <p className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        {formatCurrency(user.portfolioValue)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1" style={{ color: currentTheme.text }}>
                        Current portfolio valuation
                      </p>
                    </CardContent>
                  </Card>

                  <Card style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          Successful Exits
                        </h3>
                        <CheckCircle className="h-6 w-6" style={{ color: currentTheme.text }} />
                      </div>
                      <p className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        {user.successfulExits}
                      </p>
                      <p className="text-sm text-gray-500 mt-1" style={{ color: currentTheme.text }}>
                        Successful exits and returns
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentScreen === "cart" && (
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                    Cart
                  </h2>
                  <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                    {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                  </Badge>
                </div>

                {cartItems.length === 0 ? (
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
                        d="M16 11V7a4 4 0 00-8 0v4m-4 4v6a3 3 0 003 3h12a3 3 0 003-3v-6m-4-4h2m-2-4h2"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: currentTheme.textPrimary }}>
                      Your cart is empty
                    </h3>
                    <p className="text-sm mb-6" style={{ color: currentTheme.text }}>
                      Add investments to your cart to proceed with checkout
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
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cartItems.map((item) => (
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
                                onClick={() => removeFromCart(item.id)}
                                style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setWishlistItems((prev) => [
                                    ...prev.filter((wishItem) => wishItem.id !== item.id),
                                    item,
                                  ])
                                  removeFromCart(item.id)
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

                    <div className="mt-8 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: currentTheme.textPrimary }}>
                          Subtotal
                        </h4>
                        <p className="text-xl" style={{ color: currentTheme.textPrimary }}>
                          {formatCurrency(cartItems.reduce((acc, item) => acc + (item.price || 0), 0))}
                        </p>
                      </div>
                      <Button
                        onClick={startCheckout}
                        style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {currentScreen === "wishlist" && (
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                    Wishlist
                  </h2>
                  <Badge className="bg-pink-100 text-pink-800 px-3 py-1">
                    {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
                  </Badge>
                </div>

                {wishlistItems.length === 0 ? (
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: currentTheme.textPrimary }}>
                      Your wishlist is empty
                    </h3>
                    <p className="text-sm mb-6" style={{ color: currentTheme.text }}>
                      Save interesting investments to your wishlist for later
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
                              onClick={() => moveToCart(item)}
                              style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromWishlist(item.id)}
                              style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                            >
                              <X className="h-3 w-3" />
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
              <div className="p-4 sm:p-6">
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
                              className="w-4 h-4 text-yellow-400 fill-yellow-400"
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

            {currentScreen === "checkout" && (
              <div className="p-4 sm:p-6">
                {checkoutStep === 1 && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        Checkout
                      </h2>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">Step 1 of 3</Badge>
                    </div>

                    <h3 className="text-xl font-semibold mb-4" style={{ color: currentTheme.textPrimary }}>
                      Investment Amount
                    </h3>
                    <p className="mb-6" style={{ color: currentTheme.text }}>
                      Enter the amount you wish to invest in each project.
                    </p>

                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <Card
                          key={item.id}
                          style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4 mb-4">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <h3 className="font-bold" style={{ color: currentTheme.textPrimary }}>
                                  {item.name}
                                </h3>
                                <p className="text-sm" style={{ color: currentTheme.text }}>
                                  {item.category}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <span style={{ color: currentTheme.text }}>Price:</span>
                              <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                {formatCurrency(item.price || 0)}
                              </span>
                            </div>

                            <div>
                              <label
                                className="block text-sm font-medium mb-1"
                                style={{ color: currentTheme.textPrimary }}
                              >
                                Investment Amount
                              </label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type="number"
                                  placeholder="0 ECE"
                                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                  style={{
                                    backgroundColor: currentTheme.secondary,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.textPrimary,
                                  }}
                                  onChange={(e) => {
                                    const amount = Number.parseFloat(e.target.value)
                                    if (!isNaN(amount)) {
                                      handleInvestmentAmountChange(amount)
                                    } else {
                                      handleInvestmentAmountChange(undefined)
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={nextCheckoutStep}
                        disabled={!investmentAmount}
                        style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                      >
                        Next: Payment Details
                      </Button>
                    </div>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        Checkout
                      </h2>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">Step 2 of 3</Badge>
                    </div>

                    <h3 className="text-xl font-semibold mb-4" style={{ color: currentTheme.textPrimary }}>
                      Payment Details
                    </h3>
                    <p className="mb-6" style={{ color: currentTheme.text }}>
                      Enter your payment information to complete your investment.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.textPrimary }}>
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border rounded-lg"
                          style={{
                            backgroundColor: currentTheme.secondary,
                            borderColor: currentTheme.border,
                            color: currentTheme.textPrimary,
                          }}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.textPrimary }}>
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border rounded-lg"
                            style={{
                              backgroundColor: currentTheme.secondary,
                              borderColor: currentTheme.border,
                              color: currentTheme.textPrimary,
                            }}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.textPrimary }}>
                            CVC
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-3 py-2 border rounded-lg"
                            style={{
                              backgroundColor: currentTheme.secondary,
                              borderColor: currentTheme.border,
                              color: currentTheme.textPrimary,
                            }}
                            onChange={(e) => setCardCVC(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.textPrimary }}>
                          Billing Address
                        </label>
                        <input
                          type="text"
                          placeholder="123 Main St, Anytown"
                          className="w-full px-3 py-2 border rounded-lg"
                          style={{
                            backgroundColor: currentTheme.secondary,
                            borderColor: currentTheme.border,
                            color: currentTheme.textPrimary,
                          }}
                          onChange={(e) => setBillingAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <Button
                        onClick={prevCheckoutStep}
                        variant="outline"
                        style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                      >
                        Back: Investment Amount
                      </Button>
                      <Button
                        onClick={nextCheckoutStep}
                        disabled={!cardNumber || !cardExpiry || !cardCVC || !billingAddress}
                        style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                      >
                        Next: Confirmation
                      </Button>
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        Checkout
                      </h2>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">Step 3 of 3</Badge>
                    </div>

                    <h3 className="text-xl font-semibold mb-4" style={{ color: currentTheme.textPrimary }}>
                      Confirmation
                    </h3>
                    <p className="mb-6" style={{ color: currentTheme.text }}>
                      Please review your order before submitting.
                    </p>

                    <div className="space-y-4">
                      <Card style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2" style={{ color: currentTheme.textPrimary }}>
                            Order Summary
                          </h4>
                          <div className="space-y-2">
                            {cartItems.map((item) => (
                              <div key={item.id} className="flex items-center justify-between">
                                <span style={{ color: currentTheme.text }}>{item.name}</span>
                                <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                  {formatCurrency(item.price || 0)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-4 border-t pt-4">
                            <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                              Subtotal
                            </span>
                            <span className="font-bold" style={{ color: currentTheme.textPrimary }}>
                              {formatCurrency(cartItems.reduce((acc, item) => acc + (item.price || 0), 0))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span style={{ color: currentTheme.text }}>Processing Fees</span>
                            <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                              {formatCurrency(
                                calculateProcessingFees(cartItems.reduce((acc, item) => acc + (item.price || 0), 0)),
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2 border-t pt-4">
                            <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                              Total
                            </span>
                            <span className="font-bold" style={{ color: currentTheme.textPrimary }}>
                              {formatCurrency(
                                cartItems.reduce((acc, item) => acc + (item.price || 0), 0) +
                                  calculateProcessingFees(cartItems.reduce((acc, item) => acc + (item.price || 0), 0)),
                              )}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2" style={{ color: currentTheme.textPrimary }}>
                            Payment Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span style={{ color: currentTheme.text }}>Card Number</span>
                              <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                **** **** **** {cardNumber.slice(-4)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span style={{ color: currentTheme.text }}>Billing Address</span>
                              <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                                {billingAddress}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="terms"
                          className="h-5 w-5 rounded"
                          style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
                          onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                        />
                        <label htmlFor="terms" style={{ color: currentTheme.text }}>
                          I agree to the{" "}
                          <a href="#" className="underline">
                            Terms and Conditions
                          </a>
                        </label>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <Button
                        onClick={prevCheckoutStep}
                        variant="outline"
                        style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                      >
                        Back: Payment Details
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={!isTermsAccepted}
                        style={{ backgroundColor: currentTheme.accent, color: currentTheme.textPrimary }}
                      >
                        Confirm and Invest
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          {!viewingProfile && (
            <div
              className="border-t px-4 py-2 safe-area-pb"
              style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.border }}
            >
              <div className="flex justify-around items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen("swipe")}
                  className={`flex flex-col items-center gap-1 p-2 ${currentScreen === "swipe" ? "" : ""}`}
                  style={{ color: currentScreen === "swipe" ? currentTheme.accent : currentTheme.text }}
                >
                  <Zap className="h-5 w-5" />
                  <span className="text-xs">Discover</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen("cart")}
                  className={`flex flex-col items-center gap-1 p-2 relative ${currentScreen === "cart" ? "" : ""}`}
                  style={{ color: currentScreen === "cart" ? currentTheme.accent : currentTheme.text }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-xs">Cart</span>
                  {cartItems.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </div>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen("wishlist")}
                  className={`flex flex-col items-center gap-1 p-2 relative ${currentScreen === "wishlist" ? "" : ""}`}
                  style={{ color: currentScreen === "wishlist" ? currentTheme.accent : currentTheme.text }}
                >
                  <Star className="h-5 w-5" />
                  <span className="text-xs">Wishlist</span>
                  {wishlistItems.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </div>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen("bookmarks")}
                  className={`flex flex-col items-center gap-1 p-2 relative ${currentScreen === "bookmarks" ? "" : ""}`}
                  style={{ color: currentScreen === "bookmarks" ? currentTheme.accent : currentTheme.text }}
                >
                  <svg
                    className="h-5 w-5"
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
                  <span className="text-xs">Bookmarks</span>
                  {bookmarkedItems.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {bookmarkedItems.length}
                    </div>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen("profile")}
                  className={`flex flex-col items-center gap-1 p-2 ${currentScreen === "profile" ? "" : ""}`}
                  style={{ color: currentScreen === "profile" ? currentTheme.accent : currentTheme.text }}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Profile</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Betting Checkout Modal */}
        {showBettingCheckout && bettingApp && (
          <BettingCheckout app={bettingApp} betType={betType} onClose={() => setShowBettingCheckout(false)} />
        )}
      </div>

      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
    </div>
  )
}
