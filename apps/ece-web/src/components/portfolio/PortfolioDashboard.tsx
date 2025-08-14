'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { AssetList } from './AssetList'
import { ValuationChart } from './ValuationChart'
import { DiversificationChart } from './DiversificationChart'

interface PortfolioAsset {
  id: string
  cardId: string
  cardName: string
  cardCategory: string
  cardRarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'
  cardImageUrl: string
  acquisitionPrice: number
  currentValue: number
  quantity: number
  acquisitionDate: string
  lastUpdated: string
}

interface PortfolioData {
  totalValue: number
  totalGainLoss: number
  totalGainLossPercentage: number
  assets: PortfolioAsset[]
  valuationHistory: {
    date: string
    value: number
  }[]
  diversification: {
    category: string
    value: number
    percentage: number
  }[]
}

interface PortfolioDashboardProps {
  portfolioData: PortfolioData
  onViewAsset?: (assetId: string) => void
  onTradeAsset?: (assetId: string) => void
}

export function PortfolioDashboard({ portfolioData, onViewAsset, onTradeAsset }: PortfolioDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('value')
  const [hideSmallHoldings, setHideSmallHoldings] = useState(false)
  
  // Get unique categories from assets
  const categories = [...new Set(portfolioData.assets.map(asset => asset.cardCategory))]
  
  // Filter and sort assets
  const filteredAssets = portfolioData.assets
    .filter(asset => {
      const matchesSearch = 
        asset.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.cardCategory.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || asset.cardCategory === categoryFilter
      const matchesRarity = rarityFilter === 'all' || asset.cardRarity === rarityFilter
      
      // Hide small holdings if enabled
      const isVisible = !hideSmallHoldings || asset.currentValue >= 10 // Hide assets worth less than 10 ECE
      
      return matchesSearch && matchesCategory && matchesRarity && isVisible
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.currentValue - a.currentValue
        case 'gainLoss':
          const aGainLoss = ((a.currentValue - a.acquisitionPrice) / a.acquisitionPrice) * 100
          const bGainLoss = ((b.currentValue - b.acquisitionPrice) / b.acquisitionPrice) * 100
          return bGainLoss - aGainLoss
        case 'name':
          return a.cardName.localeCompare(b.cardName)
        default:
          return 0
      }
    })
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
  
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }
  
  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolioData.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                <p className={`text-2xl font-bold ${portfolioData.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(portfolioData.totalGainLoss)}
                </p>
              </div>
              {portfolioData.totalGainLoss >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
            <p className={`text-sm mt-1 ${portfolioData.totalGainLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(portfolioData.totalGainLossPercentage)}
            </p>
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{portfolioData.assets.length}</p>
              </div>
              <PieChart className="h-8 w-8 text-primary" />
            </div>
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Holdings</p>
                <p className="text-2xl font-bold">
                  {portfolioData.assets.filter(asset => asset.quantity > 0).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Portfolio Value Over Time</h3>
              <Button variant="outline" size="sm">
                30D
              </Button>
            </div>
            <ValuationChart data={portfolioData.valuationHistory} />
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Portfolio Diversification</h3>
            <DiversificationChart data={portfolioData.diversification} />
          </div>
        </GlassCard>
      </div>
      
      {/* Asset List Controls */}
      <GlassCard>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-bold">Your Assets</h3>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setHideSmallHoldings(!hideSmallHoldings)}
                className="flex items-center gap-2"
              >
                {hideSmallHoldings ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {hideSmallHoldings ? 'Show All' : 'Hide Small'}
              </Button>
              
              <Badge variant="secondary">
                {filteredAssets.length} of {portfolioData.assets.length}
              </Badge>
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select 
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Rarity</option>
                <option value="COMMON">Common</option>
                <option value="RARE">Rare</option>
                <option value="EPIC">Epic</option>
                <option value="LEGENDARY">Legendary</option>
                <option value="MYTHIC">Mythic</option>
              </select>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="value">Sort by Value</option>
                <option value="gainLoss">Sort by Gain/Loss</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
          
          {/* Asset List */}
          <AssetList 
            assets={filteredAssets}
            onViewAsset={onViewAsset}
            onTradeAsset={onTradeAsset}
          />
        </div>
      </GlassCard>
    </div>
  )
}
