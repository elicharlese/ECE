'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PortfolioDashboard } from '@/components/portfolio/PortfolioDashboard'
import { MarketTrends } from '@/components/analytics/MarketTrends'
import { PortfolioAnalytics } from '@/components/analytics/PortfolioAnalytics'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  PieChart, 
  Activity, 
  Target, 
  RefreshCw, 
  Download, 
  Bell,
  Settings
} from 'lucide-react'

// Mock data for portfolio
const mockPortfolioData = {
  totalValue: 12500,
  totalGainLoss: 2350,
  totalGainLossPercentage: 23.1,
  assets: [
    {
      id: '1',
      cardId: 'card-1',
      cardName: 'Tesla Inc.',
      cardCategory: 'Technology',
      cardRarity: 'LEGENDARY',
      cardImageUrl: '',
      acquisitionPrice: 8500,
      currentValue: 10250,
      quantity: 1,
      acquisitionDate: '2023-01-15',
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      cardId: 'card-2',
      cardName: 'Netflix Inc.',
      cardCategory: 'Entertainment',
      cardRarity: 'EPIC',
      cardImageUrl: '',
      acquisitionPrice: 3200,
      currentValue: 2800,
      quantity: 2,
      acquisitionDate: '2023-03-22',
      lastUpdated: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      cardId: 'card-3',
      cardName: 'Amazon.com Inc.',
      cardCategory: 'E-commerce',
      cardRarity: 'RARE',
      cardImageUrl: '',
      acquisitionPrice: 4500,
      currentValue: 5100,
      quantity: 1,
      acquisitionDate: '2023-05-10',
      lastUpdated: '2024-01-15T11:45:00Z'
    },
    {
      id: '4',
      cardId: 'card-4',
      cardName: 'Microsoft Corp.',
      cardCategory: 'Technology',
      cardRarity: 'LEGENDARY',
      cardImageUrl: '',
      acquisitionPrice: 6800,
      currentValue: 7950,
      quantity: 1,
      acquisitionDate: '2023-07-18',
      lastUpdated: '2024-01-15T12:30:00Z'
    }
  ],
  valuationHistory: [
    { date: '2023-01-01', value: 8500 },
    { date: '2023-02-01', value: 9200 },
    { date: '2023-03-01', value: 8900 },
    { date: '2023-04-01', value: 10100 },
    { date: '2023-05-01', value: 9800 },
    { date: '2023-06-01', value: 11200 },
    { date: '2023-07-01', value: 10800 },
    { date: '2023-08-01', value: 11500 },
    { date: '2023-09-01', value: 12100 },
    { date: '2023-10-01', value: 11800 },
    { date: '2023-11-01', value: 12400 },
    { date: '2023-12-01', value: 12200 },
    { date: '2024-01-01', value: 12500 }
  ],
  diversification: [
    { category: 'Technology', value: 18200, percentage: 65 },
    { category: 'Entertainment', value: 2800, percentage: 10 },
    { category: 'E-commerce', value: 5100, percentage: 25 }
  ]
}

// Mock data for market trends
const mockTrendingCards = [
  {
    id: 'trend-1',
    name: 'Apple Inc.',
    category: 'Technology',
    currentPrice: 15200,
    priceChange: 1200,
    priceChangePercentage: 8.6,
    volume: 24500,
    rank: 1,
    isNew: true
  },
  {
    id: 'trend-2',
    name: 'Google LLC',
    category: 'Technology',
    currentPrice: 13800,
    priceChange: 850,
    priceChangePercentage: 6.6,
    volume: 18900,
    rank: 2
  },
  {
    id: 'trend-3',
    name: 'Meta Platforms',
    category: 'Technology',
    currentPrice: 9600,
    priceChange: -450,
    priceChangePercentage: -4.5,
    volume: 15200,
    rank: 3
  }
]

// Mock data for portfolio analytics
const mockPortfolioMetrics = [
  {
    name: 'Total Value',
    value: '$12,500',
    change: 5.2,
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-green-500/20 text-green-500'
  },
  {
    name: 'Daily P&L',
    value: '+$320',
    change: 2.1,
    icon: <Activity className="h-5 w-5" />,
    color: 'bg-blue-500/20 text-blue-500'
  },
  {
    name: 'Active Assets',
    value: '12',
    icon: <PieChart className="h-5 w-5" />,
    color: 'bg-purple-500/20 text-purple-500'
  },
  {
    name: 'Best Performer',
    value: 'Tesla Inc.',
    change: 21.2,
    icon: <Target className="h-5 w-5" />,
    color: 'bg-yellow-500/20 text-yellow-500'
  }
]

const mockPerformanceData = [
  { period: '1M', return: 5.2, benchmark: 3.1 },
  { period: '3M', return: 12.4, benchmark: 8.7 },
  { period: '6M', return: 23.1, benchmark: 15.2 },
  { period: '1Y', return: 45.6, benchmark: 32.8 },
  { period: 'YTD', return: 18.7, benchmark: 12.3 }
]

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('portfolio')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }
  
  const handleViewAsset = (assetId: string) => {
    console.log('Viewing asset:', assetId)
    // Implement view asset logic
  }
  
  const handleTradeAsset = (assetId: string) => {
    console.log('Trading asset:', assetId)
    // Implement trade asset logic
  }
  
  const handleViewCard = (cardId: string) => {
    console.log('Viewing card:', cardId)
    // Implement view card logic
  }
  
  const handleTradeCard = (cardId: string) => {
    console.log('Trading card:', cardId)
    // Implement trade card logic
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Portfolio Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track and manage your M&A trading card investments
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-8">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="market">Market Trends</TabsTrigger>
          </TabsList>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="portfolio" className="mt-0">
              <PortfolioDashboard 
                portfolioData={mockPortfolioData}
                onViewAsset={handleViewAsset}
                onTradeAsset={handleTradeAsset}
              />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <GlassCard>
                <div className="p-6">
                  <PortfolioAnalytics 
                    portfolioMetrics={mockPortfolioMetrics}
                    performanceData={mockPerformanceData}
                    riskScore={65}
                    diversificationScore={78}
                  />
                </div>
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="market" className="mt-0">
              <GlassCard>
                <div className="p-6">
                  <MarketTrends 
                    trendingCards={mockTrendingCards}
                    onViewCard={handleViewCard}
                    onTradeCard={handleTradeCard}
                  />
                </div>
              </GlassCard>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  )
}
