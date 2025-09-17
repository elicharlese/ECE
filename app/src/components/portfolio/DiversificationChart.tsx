'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface DiversificationData {
  category: string
  value: number
  percentage: number
}

interface DiversificationChartProps {
  data: DiversificationData[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4']

export function DiversificationChart({ data }: DiversificationChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No diversification data available</p>
      </div>
    )
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
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-bold">{data.category}</p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">{data.percentage.toFixed(1)}% of portfolio</p>
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="category"
              label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              formatter={(value, entry, index) => (
                <span className="text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Category Breakdown */}
      <div className="space-y-3">
        <h4 className="font-bold">Category Breakdown</h4>
        <div className="space-y-2">
          {data
            .sort((a, b) => b.value - a.value)
            .map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.percentage.toFixed(1)}% of portfolio
                    </p>
                  </div>
                </div>
                <p className="font-bold">{formatCurrency(item.value)}</p>
              </motion.div>
            ))}
        </div>
      </div>
      
      {/* Diversification Score */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Diversification Score</span>
          <span className="font-bold">
            {data.length > 5 ? 'Excellent' : data.length > 3 ? 'Good' : 'Needs Improvement'}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <motion.div 
            className="bg-primary h-2 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(data.length * 20, 100)}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {data.length > 5 
            ? 'Your portfolio is well-diversified across many categories' 
            : data.length > 3 
              ? 'Your portfolio has good diversification' 
              : 'Consider adding assets from more categories to improve diversification'}
        </p>
      </div>
    </div>
  )
}
