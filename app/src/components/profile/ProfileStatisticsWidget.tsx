'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Trophy, 
  Target, 
  Star,
  Activity,
  Users,
  BarChart3,
  Coins,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

interface ProfileStatistic {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<any>
  color: string
  bgColor: string
}

interface ProfileStatisticsWidgetProps {
  className?: string
}

export function ProfileStatisticsWidget({ className = '' }: ProfileStatisticsWidgetProps) {
  const stats: ProfileStatistic[] = [
    {
      label: 'Portfolio Value',
      value: '$24,580',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-[#A6E22E]',
      bgColor: 'from-[#A6E22E]/20 to-[#A6E22E]/10'
    },
    {
      label: 'Total Cards',
      value: '247',
      change: '+8',
      changeType: 'positive',
      icon: Star,
      color: 'text-[#66D9EF]',
      bgColor: 'from-[#66D9EF]/20 to-[#66D9EF]/10'
    },
    {
      label: 'Successful Trades',
      value: '156',
      change: '+23',
      changeType: 'positive',
      icon: Trophy,
      color: 'text-[#E6DB74]',
      bgColor: 'from-[#E6DB74]/20 to-[#E6DB74]/10'
    },
    {
      label: 'Win Rate',
      value: '84%',
      change: '+2.1%',
      changeType: 'positive',
      icon: Target,
      color: 'text-[#F92672]',
      bgColor: 'from-[#F92672]/20 to-[#F92672]/10'
    },
    {
      label: 'ECE Balance',
      value: '12,450',
      change: '-125',
      changeType: 'negative',
      icon: Coins,
      color: 'text-[#819AFF]',
      bgColor: 'from-[#819AFF]/20 to-[#819AFF]/10'
    },
    {
      label: 'Active Battles',
      value: '7',
      change: '+3',
      changeType: 'positive',
      icon: Activity,
      color: 'text-[#3EBA7C]',
      bgColor: 'from-[#3EBA7C]/20 to-[#3EBA7C]/10'
    },
    {
      label: 'Friends',
      value: '89',
      change: '+12',
      changeType: 'positive',
      icon: Users,
      color: 'text-[#FD5C63]',
      bgColor: 'from-[#FD5C63]/20 to-[#FD5C63]/10'
    },
    {
      label: 'Rank',
      value: '#142',
      change: '+15',
      changeType: 'positive',
      icon: BarChart3,
      color: 'text-[#F8EFD6]',
      bgColor: 'from-[#F8EFD6]/20 to-[#F8EFD6]/10'
    }
  ]

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'positive':
        return <ArrowUpRight className="w-3 h-3" />
      case 'negative':
        return <ArrowDownRight className="w-3 h-3" />
      default:
        return null
    }
  }

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-[#A6E22E]'
      case 'negative':
        return 'text-[#F92672]'
      default:
        return 'text-[#75715E]'
    }
  }

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2">
          Profile Statistics
        </h2>
        <p className="text-[#75715E]">
          Your trading performance and collection overview
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <GlassCard 
              variant="dark" 
              animation="breathe" 
              className={`p-4 bg-gradient-to-br ${stat.bgColor} border border-white/10 hover:border-white/20 transition-all duration-300`}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#272822]/50 to-[#272822]/30 mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>

              {/* Value */}
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm text-[#F8EFD6] mb-2">
                {stat.label}
              </div>

              {/* Change indicator */}
              {stat.change && (
                <div className={`flex items-center text-xs font-medium ${getChangeColor(stat.changeType)}`}>
                  {getChangeIcon(stat.changeType)}
                  <span className="ml-1">{stat.change}</span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Quick insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6"
      >
        <GlassCard variant="dark" className="p-6">
          <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4">
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E] mb-1">
                +15.7%
              </div>
              <div className="text-sm text-[#75715E]">
                Portfolio Growth (30d)
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF] mb-1">
                23
              </div>
              <div className="text-sm text-[#75715E]">
                Trades This Week
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6DB74] mb-1">
                4.8★
              </div>
              <div className="text-sm text-[#75715E]">
                Trader Rating
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
