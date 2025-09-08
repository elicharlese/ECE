'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  Star,
  Crown,
  Zap,
  Diamond,
  Flame,
  Shield,
  Gift,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '../ui/button'

interface TierProgress {
  tierId: string
  tierName: string
  tierIcon: React.ElementType
  tierColor: string
  gradient: string
  rarity: number
  totalCards: number
  ownedCards: number
  completionPercentage: number
  rewardUnlocked: boolean
  nextMilestone: number
  estimatedValue: number
  timeToComplete?: string
  lastCardAcquired?: string
  recentAcquisitions: string[]
  milestones: {
    percentage: number
    reward: string
    unlocked: boolean
    unlockedDate?: string
  }[]
}

interface TierReward {
  id: string
  name: string
  description: string
  value: number
  icon: React.ElementType
  tierRequirement: string
  completionRequirement: number
  special: boolean
}

const tierRewards: TierReward[] = [
  {
    id: 'common-complete',
    name: 'Common Collector',
    description: 'Unlock basic trading bonuses',
    value: 100,
    icon: Shield,
    tierRequirement: 'common',
    completionRequirement: 100,
    special: false
  },
  {
    id: 'uncommon-complete',
    name: 'Uncommon Enthusiast',
    description: 'Enhanced trading multipliers',
    value: 500,
    icon: Star,
    tierRequirement: 'uncommon',
    completionRequirement: 100,
    special: false
  },
  {
    id: 'rare-complete',
    name: 'Rare Master',
    description: 'Premium marketplace access',
    value: 2500,
    icon: Zap,
    tierRequirement: 'rare',
    completionRequirement: 100,
    special: true
  },
  {
    id: 'epic-complete',
    name: 'Epic Legend',
    description: 'VIP trading privileges',
    value: 10000,
    icon: Flame,
    tierRequirement: 'epic',
    completionRequirement: 100,
    special: true
  },
  {
    id: 'legendary-complete',
    name: 'Legendary Champion',
    description: 'Exclusive legendary card pack',
    value: 50000,
    icon: Crown,
    tierRequirement: 'legendary',
    completionRequirement: 100,
    special: true
  },
  {
    id: 'mythic-complete',
    name: 'Mythic Ascendant',
    description: 'Reality-bending trading powers',
    value: 500000,
    icon: Diamond,
    tierRequirement: 'mythic',
    completionRequirement: 100,
    special: true
  }
]

// Sample progress data
const sampleProgress: TierProgress[] = [
  {
    tierId: 'common',
    tierName: 'Common',
    tierIcon: Shield,
    tierColor: '#75715E',
    gradient: 'linear-gradient(135deg, #75715E, #5A5750)',
    rarity: 60,
    totalCards: 45,
    ownedCards: 38,
    completionPercentage: 84.4,
    rewardUnlocked: false,
    nextMilestone: 90,
    estimatedValue: 1200,
    timeToComplete: '2 weeks',
    lastCardAcquired: '2024-03-10',
    recentAcquisitions: ['Code Defender', 'Data Stream'],
    milestones: [
      { percentage: 25, reward: '250 ECE', unlocked: true, unlockedDate: '2024-02-15' },
      { percentage: 50, reward: '500 ECE', unlocked: true, unlockedDate: '2024-02-28' },
      { percentage: 75, reward: '750 ECE', unlocked: true, unlockedDate: '2024-03-08' },
      { percentage: 100, reward: 'Common Collector Badge', unlocked: false }
    ]
  },
  {
    tierId: 'uncommon',
    tierName: 'Uncommon',
    tierIcon: Star,
    tierColor: '#A6E22E',
    gradient: 'linear-gradient(135deg, #A6E22E, #8BC34A)',
    rarity: 25,
    totalCards: 20,
    ownedCards: 14,
    completionPercentage: 70,
    rewardUnlocked: false,
    nextMilestone: 75,
    estimatedValue: 3500,
    timeToComplete: '1 month',
    lastCardAcquired: '2024-03-05',
    recentAcquisitions: ['Quantum Processor', 'Neural Interface'],
    milestones: [
      { percentage: 25, reward: '1,000 ECE', unlocked: true, unlockedDate: '2024-02-20' },
      { percentage: 50, reward: '2,000 ECE', unlocked: true, unlockedDate: '2024-03-01' },
      { percentage: 75, reward: '3,000 ECE', unlocked: false },
      { percentage: 100, reward: 'Uncommon Enthusiast Badge', unlocked: false }
    ]
  },
  {
    tierId: 'rare',
    tierName: 'Rare',
    tierIcon: Zap,
    tierColor: '#66D9EF',
    gradient: 'linear-gradient(135deg, #66D9EF, #4FC3F7)',
    rarity: 10,
    totalCards: 12,
    ownedCards: 7,
    completionPercentage: 58.3,
    rewardUnlocked: false,
    nextMilestone: 75,
    estimatedValue: 8500,
    timeToComplete: '3 months',
    lastCardAcquired: '2024-02-25',
    recentAcquisitions: ['Quantum Warrior'],
    milestones: [
      { percentage: 25, reward: '5,000 ECE', unlocked: true, unlockedDate: '2024-01-30' },
      { percentage: 50, reward: '10,000 ECE', unlocked: true, unlockedDate: '2024-02-25' },
      { percentage: 75, reward: '15,000 ECE', unlocked: false },
      { percentage: 100, reward: 'Rare Master Badge + Premium Access', unlocked: false }
    ]
  },
  {
    tierId: 'epic',
    tierName: 'Epic',
    tierIcon: Flame,
    tierColor: '#F92672',
    gradient: 'linear-gradient(135deg, #F92672, #E91E63)',
    rarity: 4,
    totalCards: 8,
    ownedCards: 2,
    completionPercentage: 25,
    rewardUnlocked: false,
    nextMilestone: 50,
    estimatedValue: 15000,
    timeToComplete: '6 months',
    lastCardAcquired: '2024-02-03',
    recentAcquisitions: ['Cyber Dragon'],
    milestones: [
      { percentage: 25, reward: '25,000 ECE', unlocked: true, unlockedDate: '2024-02-03' },
      { percentage: 50, reward: '50,000 ECE', unlocked: false },
      { percentage: 75, reward: '75,000 ECE', unlocked: false },
      { percentage: 100, reward: 'Epic Legend Badge + VIP Access', unlocked: false }
    ]
  },
  {
    tierId: 'legendary',
    tierName: 'Legendary',
    tierIcon: Crown,
    tierColor: '#E6DB74',
    gradient: 'linear-gradient(135deg, #E6DB74, #FFD700)',
    rarity: 1,
    totalCards: 5,
    ownedCards: 1,
    completionPercentage: 20,
    rewardUnlocked: false,
    nextMilestone: 40,
    estimatedValue: 75000,
    timeToComplete: '1 year',
    lastCardAcquired: '2024-01-15',
    recentAcquisitions: ['Digital Phoenix'],
    milestones: [
      { percentage: 20, reward: '100,000 ECE', unlocked: true, unlockedDate: '2024-01-15' },
      { percentage: 40, reward: '200,000 ECE', unlocked: false },
      { percentage: 60, reward: '300,000 ECE', unlocked: false },
      { percentage: 80, reward: '400,000 ECE', unlocked: false },
      { percentage: 100, reward: 'Legendary Champion + Exclusive Pack', unlocked: false }
    ]
  },
  {
    tierId: 'mythic',
    tierName: 'Mythic',
    tierIcon: Diamond,
    tierColor: '#819AFF',
    gradient: 'linear-gradient(135deg, #819AFF, #7B1FA2)',
    rarity: 0.1,
    totalCards: 3,
    ownedCards: 0,
    completionPercentage: 0,
    rewardUnlocked: false,
    nextMilestone: 33,
    estimatedValue: 1500000,
    timeToComplete: 'Unknown',
    recentAcquisitions: [],
    milestones: [
      { percentage: 33, reward: '1,000,000 ECE', unlocked: false },
      { percentage: 67, reward: '2,000,000 ECE', unlocked: false },
      { percentage: 100, reward: 'Mythic Ascendant + Reality Powers', unlocked: false }
    ]
  }
]

interface TierProgressTrackerProps {
  className?: string
}

export const TierProgressTracker: React.FC<TierProgressTrackerProps> = ({ className = '' }) => {
  const [selectedTier, setSelectedTier] = useState<string>('common')
  const [progress] = useState<TierProgress[]>(sampleProgress)
  const [rewards] = useState<TierReward[]>(tierRewards)
  const [showRewards, setShowRewards] = useState(false)

  const selectedProgress = progress.find(p => p.tierId === selectedTier)
  const completedTiers = progress.filter(p => p.completionPercentage >= 100)
  const nearCompletionTiers = progress.filter(p => p.completionPercentage >= 75 && p.completionPercentage < 100)

  const getProgressColor = (percentage: number, tierColor: string) => {
    if (percentage >= 100) return '#A6E22E'
    if (percentage >= 75) return '#E6DB74'
    if (percentage >= 50) return tierColor
    return '#75715E'
  }

  const getTimeUntilMilestone = (current: number, target: number) => {
    const cardsNeeded = Math.ceil((target - current) / 100 * (selectedProgress?.totalCards || 1))
    if (cardsNeeded <= 1) return 'Very soon'
    if (cardsNeeded <= 3) return '1-2 weeks'
    if (cardsNeeded <= 6) return '1 month'
    return '2+ months'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Quick Stats */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#F8EFD6] mb-2 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Tier Collection Progress
            </h3>
            <p className="text-[#75715E]">
              Track your progress towards completing each tier and unlock exclusive rewards
            </p>
          </div>
          <Button
            variant={showRewards ? 'default' : 'ghost'}
            onClick={() => setShowRewards(!showRewards)}
            className="flex items-center space-x-2"
          >
            <Gift className="w-4 h-4" />
            <span>Rewards</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#A6E22E] mb-1">
              {completedTiers.length}
            </div>
            <div className="text-sm text-[#75715E]">Completed Tiers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E6DB74] mb-1">
              {nearCompletionTiers.length}
            </div>
            <div className="text-sm text-[#75715E]">Near Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#66D9EF] mb-1">
              {progress.reduce((sum, p) => sum + p.ownedCards, 0)}
            </div>
            <div className="text-sm text-[#75715E]">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F92672] mb-1">
              ${progress.reduce((sum, p) => sum + p.estimatedValue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-[#75715E]">Collection Value</div>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="flex flex-wrap gap-2">
          {progress.map(tier => (
            <Button
              key={tier.tierId}
              variant={selectedTier === tier.tierId ? 'default' : 'ghost'}
             
              onClick={() => setSelectedTier(tier.tierId)}
              className={`flex items-center space-x-2 ${
                selectedTier === tier.tierId 
                  ? 'text-[#272822]' 
                  : ''
              }`}
            >
              <tier.tierIcon className="w-4 h-4" />
              <span>{tier.tierName}</span>
              <span className="text-xs opacity-70">
                {tier.ownedCards}/{tier.totalCards}
              </span>
            </Button>
          ))}
        </div>
      </GlassCard>

      {/* Rewards Panel */}
      <AnimatePresence>
        {showRewards && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="dark" className="p-6">
              <h4 className="text-xl font-bold text-[#F8EFD6] mb-4 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Tier Completion Rewards
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map(reward => {
                  const tier = progress.find(p => p.tierId === reward.tierRequirement)
                  const isUnlocked = tier ? tier.completionPercentage >= reward.completionRequirement : false
                  
                  return (
                    <motion.div
                      key={reward.id}
                      className={`p-4 rounded-lg border ${
                        isUnlocked 
                          ? 'bg-[#A6E22E]/10 border-[#A6E22E]/30' 
                          : reward.special 
                          ? 'bg-[#F92672]/10 border-[#F92672]/30'
                          : 'bg-[#272822]/50 border-[#75715E]/30'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <reward.icon 
                          className={`w-6 h-6 ${
                            isUnlocked ? 'text-[#A6E22E]' : 
                            reward.special ? 'text-[#F92672]' : 'text-[#75715E]'
                          }`} 
                        />
                        {isUnlocked ? (
                          <CheckCircle className="w-5 h-5 text-[#A6E22E]" />
                        ) : (
                          <Lock className="w-5 h-5 text-[#75715E]" />
                        )}
                      </div>
                      
                      <h5 className={`font-bold mb-2 ${
                        isUnlocked ? 'text-[#A6E22E]' : 'text-[#F8EFD6]'
                      }`}>
                        {reward.name}
                      </h5>
                      
                      <p className="text-sm text-[#75715E] mb-3">
                        {reward.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#66D9EF]">
                          ${reward.value.toLocaleString()} value
                        </span>
                        <span className="text-xs text-[#75715E]">
                          {tier?.tierName} 100%
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Progress View */}
      {selectedProgress && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Details */}
          <GlassCard variant="dark" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: selectedProgress.gradient }}
                >
                  <selectedProgress.tierIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#F8EFD6]">
                    {selectedProgress.tierName} Collection
                  </h4>
                  <p className="text-sm text-[#75715E]">
                    {selectedProgress.rarity}% rarity • {selectedProgress.ownedCards} of {selectedProgress.totalCards} cards
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#F8EFD6]">Collection Progress</span>
                <span className="text-sm font-bold" style={{ color: selectedProgress.tierColor }}>
                  {selectedProgress.completionPercentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-[#272822] rounded-full h-3">
                  <motion.div
                    className="h-3 rounded-full relative overflow-hidden"
                    style={{ 
                      backgroundColor: getProgressColor(selectedProgress.completionPercentage, selectedProgress.tierColor),
                      width: `${selectedProgress.completionPercentage}%`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedProgress.completionPercentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    {selectedProgress.completionPercentage >= 75 && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </motion.div>
                </div>
                
                {/* Milestone markers */}
                {selectedProgress.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="absolute top-0 h-3 w-1 bg-[#F8EFD6] rounded"
                    style={{ left: `${milestone.percentage}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-lg font-bold text-[#A6E22E]">
                  ${selectedProgress.estimatedValue.toLocaleString()}
                </div>
                <div className="text-sm text-[#75715E]">Estimated Value</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#66D9EF]">
                  {selectedProgress.timeToComplete}
                </div>
                <div className="text-sm text-[#75715E]">Time to Complete</div>
              </div>
            </div>

            {/* Recent Activity */}
            {selectedProgress.recentAcquisitions.length > 0 && (
              <div>
                <h5 className="font-semibold text-[#F8EFD6] mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Acquisitions
                </h5>
                <div className="space-y-1">
                  {selectedProgress.recentAcquisitions.map((card, index) => (
                    <div key={index} className="text-sm text-[#75715E] flex items-center">
                      <Sparkles className="w-3 h-3 mr-2 text-[#A6E22E]" />
                      {card}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          {/* Milestones */}
          <GlassCard variant="dark" className="p-6">
            <h4 className="text-xl font-bold text-[#F8EFD6] mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Collection Milestones
            </h4>

            <div className="space-y-4">
              {selectedProgress.milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    milestone.unlocked 
                      ? 'bg-[#A6E22E]/10 border-[#A6E22E]/30' 
                      : selectedProgress.completionPercentage >= milestone.percentage - 10
                      ? 'bg-[#E6DB74]/10 border-[#E6DB74]/30'
                      : 'bg-[#272822]/50 border-[#75715E]/30'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.unlocked 
                          ? 'bg-[#A6E22E] text-[#272822]' 
                          : 'bg-[#75715E] text-[#F8EFD6]'
                      }`}>
                        {milestone.unlocked ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#F8EFD6]">
                          {milestone.percentage}% Complete
                        </div>
                        <div className="text-sm text-[#75715E]">
                          {milestone.reward}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {milestone.unlocked ? (
                        <div className="text-xs text-[#A6E22E]">
                          Unlocked {milestone.unlockedDate}
                        </div>
                      ) : selectedProgress.completionPercentage >= milestone.percentage - 10 ? (
                        <div className="text-xs text-[#E6DB74]">
                          {getTimeUntilMilestone(selectedProgress.completionPercentage, milestone.percentage)}
                        </div>
                      ) : (
                        <div className="text-xs text-[#75715E]">
                          {milestone.percentage - selectedProgress.completionPercentage}% remaining
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Next Milestone Prediction */}
            {selectedProgress.completionPercentage < 100 && (
              <motion.div
                className="mt-6 p-4 bg-gradient-to-r from-[#66D9EF]/10 to-[#A6E22E]/10 rounded-lg border border-[#66D9EF]/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-[#66D9EF]" />
                  <div>
                    <h5 className="font-semibold text-[#F8EFD6] mb-1">
                      Next Milestone: {selectedProgress.nextMilestone}%
                    </h5>
                    <p className="text-sm text-[#75715E]">
                      {Math.ceil((selectedProgress.nextMilestone - selectedProgress.completionPercentage) / 100 * selectedProgress.totalCards)} more cards needed
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  )
}

export default TierProgressTracker
