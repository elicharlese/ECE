'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity,
  Target,
  Award,
  Calendar
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

interface PortfolioMetric {
  name: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: string
}

interface PerformanceMetric {
  period: string
  return: number
  benchmark: number
}

interface PortfolioAnalyticsProps {
  portfolioMetrics: PortfolioMetric[]
  performanceData: PerformanceMetric[]
  riskScore: number
  diversificationScore: number
}

export function PortfolioAnalytics({ 
  portfolioMetrics, 
  performanceData, 
  riskScore, 
  diversificationScore 
}: PortfolioAnalyticsProps) {
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }
  
  // Get risk level text
  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'High'
    if (score >= 60) return 'Moderate'
    if (score >= 40) return 'Balanced'
    return 'Conservative'
  }
  
  // Get risk color
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500'
    if (score >= 60) return 'text-orange-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-green-500'
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Last updated: Today</span>
        </div>
      </div>
      
      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioMetrics.map((metric, index) => (
          <GlassCard key={index}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.name}</p>
                  <p className="text-xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
              {metric.change !== undefined && (
                <p className={`text-sm mt-1 ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(metric.change)} (24h)
                </p>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
      
      {/* Performance Chart */}
      <GlassCard>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Performance vs Benchmark</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs rounded bg-primary text-primary-foreground">Portfolio</button>
              <button className="px-3 py-1 text-xs rounded bg-muted text-muted-foreground">Benchmark</button>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-2 justify-center">
            {performanceData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px]">
                <div className="flex items-end gap-1 w-full justify-center">
                  <motion.div 
                    className="w-4 bg-primary rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.abs(data.return) * 4}px` }}
                    transition={{ delay: index * 0.1 }}
                    style={{ height: `${Math.abs(data.return) * 4}px` }}
                  />
                  <motion.div 
                    className="w-4 bg-muted rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.abs(data.benchmark) * 4}px` }}
                    transition={{ delay: index * 0.1 }}
                    style={{ height: `${Math.abs(data.benchmark) * 4}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.period}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-sm">Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded"></div>
              <span className="text-sm">Benchmark</span>
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Risk and Diversification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Risk Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Risk Score</span>
                  <span className="text-sm font-medium">{riskScore}/100</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div 
                    className={`h-2 rounded-full ${getRiskColor(riskScore)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${riskScore}%` }}
                    transition={{ duration: 1 }}
                    style={{ backgroundColor: getRiskColor(riskScore).includes('red') ? '#ef4444' : getRiskColor(riskScore).includes('orange') ? '#f97316' : getRiskColor(riskScore).includes('yellow') ? '#eab308' : '#22c55e' }}
                  />
                </div>
                <p className={`text-sm mt-1 ${getRiskColor(riskScore)}`}>
                  {getRiskLevel(riskScore)} Risk
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Max Drawdown</p>
                  <p className="font-bold">-12.4%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volatility</p>
                  <p className="font-bold">18.2%</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Diversification</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Diversification Score</span>
                  <span className="text-sm font-medium">{diversificationScore}/100</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div 
                    className="h-2 rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${diversificationScore}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-sm mt-1 text-muted-foreground">
                  {diversificationScore >= 80 ? 'Excellent' : 
                   diversificationScore >= 60 ? 'Good' : 
                   diversificationScore >= 40 ? 'Fair' : 'Needs Improvement'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="font-bold">12</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Correlation</p>
                  <p className="font-bold">0.42</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Recommendations */}
      <GlassCard>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3">Portfolio Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Increase Tech Exposure</p>
                <p className="text-sm text-muted-foreground">
                  Consider adding 2-3 more technology cards to capitalize on current market trends.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <PieChart className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Improve Diversification</p>
                <p className="text-sm text-muted-foreground">
                  Add cards from the healthcare or energy sectors to reduce portfolio correlation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Rebalance Holdings</p>
                <p className="text-sm text-muted-foreground">
                  Your top 3 holdings represent 45% of your portfolio. Consider rebalancing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
