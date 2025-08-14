'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'

interface PriceDataPoint {
  date: string
  price: number
  volume?: number
}

interface PriceHistoryChartProps {
  data: PriceDataDataPoint[]
  cardName: string
  timeRange?: '1d' | '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '1d' | '7d' | '30d' | '90d' | '1y') => void
}

export function PriceHistoryChart({ data, cardName, timeRange = '30d', onTimeRangeChange }: PriceHistoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No price history data available for {cardName}</p>
      </div>
    )
  }
  
  // Calculate min and max values for scaling
  const prices = data.map(d => d.price)
  const minValue = Math.min(...prices)
  const maxValue = Math.max(...prices)
  const priceRange = maxValue - minValue || 1 // Avoid division by zero
  
  // Calculate percentage change
  const firstPrice = data[0].price
  const lastPrice = data[data.length - 1].price
  const percentageChange = ((lastPrice - firstPrice) / firstPrice) * 100
  
  // Chart dimensions
  const chartHeight = 200
  const chartWidth = '100%'
  const pointSpacing = data.length > 1 ? 100 / (data.length - 1) : 0
  
  // Generate path for the line
  const generatePath = () => {
    if (data.length === 0) return ''
    
    const points = data.map((point, index) => {
      const x = index * pointSpacing
      const y = chartHeight - ((point.price - minValue) / priceRange) * chartHeight
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')}`
  }
  
  // Generate points for the area under the line
  const generateAreaPath = () => {
    if (data.length === 0) return ''
    
    const points = data.map((point, index) => {
      const x = index * pointSpacing
      const y = chartHeight - ((point.price - minValue) / priceRange) * chartHeight
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')} L 100,${chartHeight} L 0,${chartHeight} Z`
  }
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  // Format volume
  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A'
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
    return volume.toString()
  }
  
  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">{cardName} Price History</h3>
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold">{formatCurrency(lastPrice)}</p>
            {percentageChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
            </span>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-1">
          {(['1d', '7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange && onTimeRangeChange(range)}
              className={`px-2 py-1 text-xs rounded ${timeRange === range ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <div className="relative h-64">
        <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="w-full h-full">
          {/* Area under the line */}
          <motion.path
            d={generateAreaPath()}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          />
          
          {/* Line */}
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          
          {/* Points */}
          {data.map((point, index) => {
            const x = index * pointSpacing
            const y = chartHeight - ((point.price - minValue) / priceRange) * chartHeight
            
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="currentColor"
                className="text-primary"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              />
            )
          })}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" className="text-primary" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(maxValue)}</span>
          <span>{formatCurrency((maxValue + minValue) / 2)}</span>
          <span>{formatCurrency(minValue)}</span>
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatDate(data[0].date)}</span>
          <span>{formatDate(data[Math.floor(data.length / 2)].date)}</span>
          <span>{formatDate(data[data.length - 1].date)}</span>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Highest</p>
          <p className="font-bold">{formatCurrency(maxValue)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Lowest</p>
          <p className="font-bold">{formatCurrency(minValue)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Volume</p>
          <p className="font-bold">{formatVolume(data.reduce((sum, point) => sum + (point.volume || 0), 0))}</p>
        </div>
      </div>
      
      {/* Info */}
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        <p>Price history shows the trading activity for this card over the selected time period</p>
      </div>
    </div>
  )
}
