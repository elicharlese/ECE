'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  Shield, 
  Flame,
  Heart,
  CheckCircle,
  Lock,
  Calendar
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'

interface ECEBadge {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isEarned: boolean
  earnedDate?: string
  progress?: number
  maxProgress?: number
  category: 'trading' | 'collection' | 'social' | 'achievements' | 'special'
}

interface AchievementBadgesProps {
  className?: string
}

export function AchievementBadges({ className = '' }: AchievementBadgesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const badges: ECEBadge[] = [
    {
      id: 'first-trade',
      name: 'First Trade',
      description: 'Complete your first successful trade',
      icon: Trophy,
      color: 'text-[#E6DB74]',
      bgColor: 'from-[#E6DB74]/20 to-[#E6DB74]/10',
      rarity: 'common',
      isEarned: true,
      earnedDate: '2024-06-15',
      category: 'trading'
    },
    {
      id: 'master-trader',
      name: 'Master Trader',
      description: 'Complete 100 successful trades',
      icon: Crown,
      color: 'text-[#F92672]',
      bgColor: 'from-[#F92672]/20 to-[#F92672]/10',
      rarity: 'legendary',
      isEarned: true,
      earnedDate: '2024-07-01',
      category: 'trading'
    },
    {
      id: 'collector',
      name: 'Serious Collector',
      description: 'Own 200+ cards in your collection',
      icon: Star,
      color: 'text-[#66D9EF]',
      bgColor: 'from-[#66D9EF]/20 to-[#66D9EF]/10',
      rarity: 'epic',
      isEarned: true,
      earnedDate: '2024-06-28',
      category: 'collection'
    },
    {
      id: 'battle-champion',
      name: 'Battle Champion',
      description: 'Win 50 card battles',
      icon: Shield,
      color: 'text-[#A6E22E]',
      bgColor: 'from-[#A6E22E]/20 to-[#A6E22E]/10',
      rarity: 'rare',
      isEarned: false,
      progress: 32,
      maxProgress: 50,
      category: 'achievements'
    },
    {
      id: 'speed-trader',
      name: 'Speed Trader',
      description: 'Complete 10 trades in 24 hours',
      icon: Zap,
      color: 'text-[#819AFF]',
      bgColor: 'from-[#819AFF]/20 to-[#819AFF]/10',
      rarity: 'rare',
      isEarned: true,
      earnedDate: '2024-06-20',
      category: 'trading'
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Have 50+ friends in your network',
      icon: Heart,
      color: 'text-[#FD5C63]',
      bgColor: 'from-[#FD5C63]/20 to-[#FD5C63]/10',
      rarity: 'common',
      isEarned: true,
      earnedDate: '2024-06-25',
      category: 'social'
    },
    {
      id: 'precise-predictor',
      name: 'Precise Predictor',
      description: 'Win 20 prediction bets in a row',
      icon: Target,
      color: 'text-[#3EBA7C]',
      bgColor: 'from-[#3EBA7C]/20 to-[#3EBA7C]/10',
      rarity: 'epic',
      isEarned: false,
      progress: 12,
      maxProgress: 20,
      category: 'achievements'
    },
    {
      id: 'fire-streak',
      name: 'On Fire!',
      description: 'Maintain a 7-day trading streak',
      icon: Flame,
      color: 'text-[#F92672]',
      bgColor: 'from-[#F92672]/20 to-[#F92672]/10',
      rarity: 'rare',
      isEarned: false,
      progress: 4,
      maxProgress: 7,
      category: 'trading'
    },
    {
      id: 'early-adopter',
      name: 'Early Adopter',
      description: 'Joined ECE in the first month',
      icon: Award,
      color: 'text-[#E6DB74]',
      bgColor: 'from-[#E6DB74]/20 to-[#E6DB74]/10',
      rarity: 'legendary',
      isEarned: true,
      earnedDate: '2024-06-01',
      category: 'special'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Badges', count: badges.length },
    { id: 'trading', label: 'Trading', count: badges.filter(b => b.category === 'trading').length },
    { id: 'collection', label: 'Collection', count: badges.filter(b => b.category === 'collection').length },
    { id: 'social', label: 'Social', count: badges.filter(b => b.category === 'social').length },
    { id: 'achievements', label: 'Achievements', count: badges.filter(b => b.category === 'achievements').length },
    { id: 'special', label: 'Special', count: badges.filter(b => b.category === 'special').length }
  ]

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory)

  const earnedBadges = badges.filter(badge => badge.isEarned)
  const totalBadges = badges.length

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-[#75715E]/50'
      case 'rare': return 'border-[#66D9EF]/50'
      case 'epic': return 'border-[#A6E22E]/50'
      case 'legendary': return 'border-[#F92672]/50'
      default: return 'border-[#75715E]/50'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2">
              Achievement Badges
            </h2>
            <p className="text-[#75715E]">
              {earnedBadges.length} of {totalBadges} badges earned
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#A6E22E]">
              {Math.round((earnedBadges.length / totalBadges) * 100)}%
            </div>
            <div className="text-sm text-[#75715E]">
              Completion
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#272822]/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#A6E22E] to-[#66D9EF] h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(earnedBadges.length / totalBadges) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Category filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-[#A6E22E] text-[#272822]'
                : 'bg-[#272822]/50 text-[#75715E] hover:bg-[#75715E]/20 hover:text-[#F8EFD6]'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </motion.div>

      {/* Badges grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <GlassCard 
              variant="dark" 
              className={`p-6 bg-gradient-to-br ${badge.bgColor} border-2 ${getRarityColor(badge.rarity)} ${
                badge.isEarned ? 'opacity-100' : 'opacity-60'
              } hover:scale-105 transition-all duration-300`}
            >
              {/* Badge header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-[#272822]/50 to-[#272822]/30`}>
                  <badge.icon className={`w-6 h-6 ${badge.color}`} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      badge.rarity === 'legendary' ? 'border-[#F92672] text-[#F92672]' :
                      badge.rarity === 'epic' ? 'border-[#A6E22E] text-[#A6E22E]' :
                      badge.rarity === 'rare' ? 'border-[#66D9EF] text-[#66D9EF]' :
                      'border-[#75715E] text-[#75715E]'
                    }`}
                  >
                    {badge.rarity}
                  </Badge>
                  {badge.isEarned ? (
                    <CheckCircle className="w-5 h-5 text-[#A6E22E]" />
                  ) : (
                    <Lock className="w-5 h-5 text-[#75715E]" />
                  )}
                </div>
              </div>

              {/* Badge info */}
              <div className="mb-4">
                <h3 className={`font-bold text-lg mb-2 ${badge.isEarned ? 'text-[#F8EFD6]' : 'text-[#75715E]'}`}>
                  {badge.name}
                </h3>
                <p className="text-sm text-[#75715E]">
                  {badge.description}
                </p>
              </div>

              {/* Progress or earned date */}
              {badge.isEarned ? (
                <div className="flex items-center text-sm text-[#A6E22E]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Earned {formatDate(badge.earnedDate!)}
                </div>
              ) : badge.progress !== undefined && badge.maxProgress !== undefined ? (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#75715E]">Progress</span>
                    <span className="text-[#F8EFD6]">
                      {badge.progress}/{badge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-[#272822]/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#66D9EF] to-[#A6E22E] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-[#75715E]">
                  Complete the requirement to unlock
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredBadges.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Award className="w-16 h-16 text-[#75715E] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#F8EFD6] mb-2">
            No badges in this category
          </h3>
          <p className="text-[#75715E]">
            Try selecting a different category or start earning badges!
          </p>
        </motion.div>
      )}
    </div>
  )
}
