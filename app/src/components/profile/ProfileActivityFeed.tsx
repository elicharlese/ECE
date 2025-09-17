'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity,
  TrendingUp,
  Trophy,
  Calendar,
  DollarSign,
  Star,
  Target,
  ChevronRight,
  Eye,
  Heart,
  MessageSquare,
  Users
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'

interface ActivityItem {
  id: string
  type: 'trade' | 'purchase' | 'battle' | 'achievement' | 'social' | 'market'
  title: string
  description: string
  timestamp: string
  value?: string
  status: 'completed' | 'pending' | 'failed'
  metadata?: {
    cardName?: string
    opponent?: string
    badgeName?: string
    friend?: string
    price?: number
    profit?: number
  }
}

interface ProfileActivityFeedProps {
  className?: string
}

export function ProfileActivityFeed({ className = '' }: ProfileActivityFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'trade',
      title: 'Successful Trade',
      description: 'Traded Tesla Model S Card for Apple Vision Pro Card',
      timestamp: '2024-07-05T10:30:00Z',
      value: '+$450 profit',
      status: 'completed',
      metadata: {
        cardName: 'Tesla Model S',
        profit: 450
      }
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Badge Earned',
      description: 'Earned the "Master Trader" achievement badge',
      timestamp: '2024-07-05T09:15:00Z',
      status: 'completed',
      metadata: {
        badgeName: 'Master Trader'
      }
    },
    {
      id: '3',
      type: 'battle',
      title: 'Battle Victory',
      description: 'Won card battle against @cryptotrader99',
      timestamp: '2024-07-05T08:45:00Z',
      value: '+125 ECE',
      status: 'completed',
      metadata: {
        opponent: 'cryptotrader99'
      }
    },
    {
      id: '4',
      type: 'purchase',
      title: 'Card Purchase',
      description: 'Purchased Netflix Premium Edition from marketplace',
      timestamp: '2024-07-04T16:20:00Z',
      value: '-$680',
      status: 'completed',
      metadata: {
        cardName: 'Netflix Premium Edition',
        price: 680
      }
    },
    {
      id: '5',
      type: 'social',
      title: 'New Connection',
      description: 'Connected with @tradingpro2024',
      timestamp: '2024-07-04T14:10:00Z',
      status: 'completed',
      metadata: {
        friend: 'tradingpro2024'
      }
    },
    {
      id: '6',
      type: 'market',
      title: 'Price Alert',
      description: 'OpenAI Developer Card reached target price',
      timestamp: '2024-07-04T12:05:00Z',
      value: '$1,200',
      status: 'completed',
      metadata: {
        cardName: 'OpenAI Developer Card',
        price: 1200
      }
    },
    {
      id: '7',
      type: 'trade',
      title: 'Trade Pending',
      description: 'Waiting for confirmation on Microsoft Azure Card trade',
      timestamp: '2024-07-04T11:30:00Z',
      value: 'Pending',
      status: 'pending',
      metadata: {
        cardName: 'Microsoft Azure Card'
      }
    },
    {
      id: '8',
      type: 'battle',
      title: 'Battle Challenge',
      description: 'Challenged @cardmaster to a battle',
      timestamp: '2024-07-04T10:15:00Z',
      status: 'pending',
      metadata: {
        opponent: 'cardmaster'
      }
    }
  ]

  const filters = [
    { id: 'all', label: 'All Activity', count: activities.length },
    { id: 'trade', label: 'Trading', count: activities.filter(a => a.type === 'trade').length },
    { id: 'battle', label: 'Battles', count: activities.filter(a => a.type === 'battle').length },
    { id: 'achievement', label: 'Achievements', count: activities.filter(a => a.type === 'achievement').length },
    { id: 'social', label: 'Social', count: activities.filter(a => a.type === 'social').length },
    { id: 'market', label: 'Market', count: activities.filter(a => a.type === 'market').length }
  ]

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === selectedFilter)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trade': return TrendingUp
      case 'purchase': return DollarSign
      case 'battle': return Trophy
      case 'achievement': return Star
      case 'social': return Users
      case 'market': return Target
      default: return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'trade': return 'text-[#A6E22E]'
      case 'purchase': return 'text-[#66D9EF]'
      case 'battle': return 'text-[#F92672]'
      case 'achievement': return 'text-[#E6DB74]'
      case 'social': return 'text-[#FD5C63]'
      case 'market': return 'text-[#819AFF]'
      default: return 'text-[#75715E]'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#A6E22E]'
      case 'pending': return 'text-[#E6DB74]'
      case 'failed': return 'text-[#F92672]'
      default: return 'text-[#75715E]'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30'
      case 'pending': return 'bg-[#E6DB74]/20 text-[#E6DB74] border-[#E6DB74]/30'
      case 'failed': return 'bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30'
      default: return 'bg-[#75715E]/20 text-[#75715E] border-[#75715E]/30'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  return (
    <div className={className}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2">
          Activity Feed
        </h2>
        <p className="text-[#75715E]">
          Your recent trades, achievements, and platform activity
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === filter.id
                ? 'bg-[#A6E22E] text-[#272822]'
                : 'bg-[#272822]/50 text-[#75715E] hover:bg-[#75715E]/20 hover:text-[#F8EFD6]'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </motion.div>

      {/* Activity list */}
      <div className="space-y-4">
        {filteredActivities.map((activity, index) => {
          const IconComponent = getActivityIcon(activity.type)
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard 
                variant="dark" 
                className="p-4 hover:border-white/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  {/* Activity icon */}
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-[#272822]/50 to-[#272822]/30 flex-shrink-0`}>
                    <IconComponent className={`w-5 h-5 ${getActivityColor(activity.type)}`} />
                  </div>

                  {/* Activity content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-[#F8EFD6] group-hover:text-[#A6E22E] transition-colors">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-[#75715E] mt-1">
                          {activity.description}
                        </p>
                      </div>
                      
                      {/* Value and status */}
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        {activity.value && (
                          <span className={`text-sm font-medium ${
                            activity.value.includes('+') ? 'text-[#A6E22E]' :
                            activity.value.includes('-') ? 'text-[#F92672]' :
                            'text-[#66D9EF]'
                          }`}>
                            {activity.value}
                          </span>
                        )}
                        <Badge className={getStatusBadge(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Metadata and timestamp */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-[#75715E]">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatTimeAgo(activity.timestamp)}
                        </div>
                        
                        {/* Additional metadata */}
                        {activity.metadata?.cardName && (
                          <span className="text-[#66D9EF]">
                            {activity.metadata.cardName}
                          </span>
                        )}
                        {activity.metadata?.opponent && (
                          <span className="text-[#F92672]">
                            vs @{activity.metadata.opponent}
                          </span>
                        )}
                        {activity.metadata?.friend && (
                          <span className="text-[#FD5C63]">
                            @{activity.metadata.friend}
                          </span>
                        )}
                      </div>

                      {/* Interaction buttons */}
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-[#75715E]/20 rounded transition-colors">
                          <Eye className="w-4 h-4 text-[#75715E] hover:text-[#F8EFD6]" />
                        </button>
                        <button className="p-1 hover:bg-[#75715E]/20 rounded transition-colors">
                          <Heart className="w-4 h-4 text-[#75715E] hover:text-[#FD5C63]" />
                        </button>
                        <button className="p-1 hover:bg-[#75715E]/20 rounded transition-colors">
                          <MessageSquare className="w-4 h-4 text-[#75715E] hover:text-[#66D9EF]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <ChevronRight className="w-5 h-5 text-[#75715E] group-hover:text-[#A6E22E] transition-colors flex-shrink-0" />
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Load more button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mt-6"
      >
        <button className="px-6 py-3 bg-gradient-to-r from-[#66D9EF]/20 to-[#A6E22E]/20 hover:from-[#66D9EF]/30 hover:to-[#A6E22E]/30 border border-[#75715E]/30 hover:border-[#A6E22E]/50 rounded-lg text-[#F8EFD6] hover:text-[#A6E22E] transition-all duration-300">
          Load More Activity
        </button>
      </motion.div>

      {/* Empty state */}
      {filteredActivities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Activity className="w-16 h-16 text-[#75715E] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#F8EFD6] mb-2">
            No activity yet
          </h3>
          <p className="text-[#75715E]">
            Start trading, battling, or connecting with others to see your activity here!
          </p>
        </motion.div>
      )}
    </div>
  )
}
