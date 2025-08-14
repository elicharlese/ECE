'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface ValuationDataPoint {
  date: string
  value: number
}

interface ValuationChartProps {
  data: ValuationDataPoint[]
}

export function ValuationChart({ data }: ValuationChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No valuation data available</p>
      </div>
    )
  }
  
  // Calculate min and max values for scaling
  const values = data.map(d => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const valueRange = maxValue - minValue || 1 // Avoid division by zero
  
  // Calculate percentage change
  const firstValue = data[0].value
  const lastValue = data[data.length - 1].value
  const percentageChange = ((lastValue - firstValue) / firstValue) * 100
  
  // Chart dimensions
  const chartHeight = 200
  const chartWidth = '100%'
  const pointSpacing = data.length > 1 ? 100 / (data.length - 1) : 0
  
  // Generate path for the line
  const generatePath = () => {
    if (data.length === 0) return ''
    
    const points = data.map((point, index) => {
      const x = index * pointSpacing
      const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')}`
  }
  
  // Generate points for the area under the line
  const generateAreaPath = () => {
    if (data.length === 0) return ''
    
    const points = data.map((point, index) => {
      const x = index * pointSpacing
      const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')} L 100,${chartHeight} L 0,${chartHeight} Z`
  }
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{formatCurrency(lastValue)}</p>
          <div className="flex items-center gap-1">
            {percentageChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
            </span>
            <span className="text-sm text-muted-foreground">(30 days)</span>
          </div>
        </div>
        
        <div className="text-right text-sm text-muted-foreground">
          <p>{formatDate(data[0].date)} - {formatDate(data[data.length - 1].date)}</p>
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
            const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight
            
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
          <p className="text-sm text-muted-foreground">Average</p>
          <p className="font-bold">{formatCurrency(values.reduce((a, b) => a + b, 0) / values.length)}</p>
        </div>
      </div>
    </div>
  )
}
