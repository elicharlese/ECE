'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { GlassCard } from '../ui/glass-card'
import { Badge } from '../ui/badge'
import { 
  Gavel, 
  Sword, 
  Target, 
  DollarSign, 
  Trophy, 
  Zap,
  Timer,
  Users,
  TrendingUp,
  Crown,
  Settings,
  Eye,
  Star,
  Activity
} from 'lucide-react'

interface UserTradingSetup {
  biddingEnabled: boolean
  bettingEnabled: boolean
  battlingEnabled: boolean
  biddingTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  bettingTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  battlingTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  activeBids: number
  activeBets: number
  activeBattles: number
  winRate: {
    bidding: number
    betting: number
    battling: number
  }
  reputation: {
    bidding: number
    betting: number
    battling: number
  }
}

interface TradingActionButtonsProps {
  cardId: string
  cardName: string
  cardValue: number
  userSetup: UserTradingSetup
  onStartBidding: (cardId: string) => void
  onStartBetting: (cardId: string) => void
  onStartBattling: (cardId: string) => void
  onManageSetup: () => void
  className?: string
}

interface ActionConfig {
  key: 'bidding' | 'betting' | 'battling'
  icon: React.ElementType
  label: string
  description: string
  enabled: boolean
  tier: string
  activeCount: number
  winRate: number
  reputation: number
  color: string
  gradient: string
  action: () => void
}

export function TradingActionButtons({
  cardId,
  cardName,
  cardValue,
  userSetup,
  onStartBidding,
  onStartBetting,
  onStartBattling,
  onManageSetup,
  className = ''
}: TradingActionButtonsProps) {
  const [selectedAction, setSelectedAction] = useState<'bidding' | 'betting' | 'battling' | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-[#CD7F32]'
      case 'silver': return 'text-[#C0C0C0]'
      case 'gold': return 'text-[#E6DB74]'
      case 'platinum': return 'text-[#819AFF]'
      default: return 'text-[#75715E]'
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-[#CD7F32]/20 text-[#CD7F32]'
      case 'silver': return 'bg-[#C0C0C0]/20 text-[#C0C0C0]'
      case 'gold': return 'bg-[#E6DB74]/20 text-[#E6DB74]'
      case 'platinum': return 'bg-[#819AFF]/20 text-[#819AFF]'
      default: return 'bg-[#75715E]/20 text-[#75715E]'
    }
  }

  const actionConfigs: ActionConfig[] = [
    {
      key: 'bidding',
      icon: Gavel,
      label: 'Start Bidding',
      description: 'Place bids on this card in auction-style trading',
      enabled: userSetup.biddingEnabled,
      tier: userSetup.biddingTier,
      activeCount: userSetup.activeBids,
      winRate: userSetup.winRate.bidding,
      reputation: userSetup.reputation.bidding,
      color: 'text-[#A6E22E]',
      gradient: 'from-[#A6E22E] to-[#3EBA7C]',
      action: () => onStartBidding(cardId)
    },
    {
      key: 'betting',
      icon: Target,
      label: 'Place Bet',
      description: 'Bet on card performance and market predictions',
      enabled: userSetup.bettingEnabled,
      tier: userSetup.bettingTier,
      activeCount: userSetup.activeBets,
      winRate: userSetup.winRate.betting,
      reputation: userSetup.reputation.betting,
      color: 'text-[#F92672]',
      gradient: 'from-[#F92672] to-[#FD5C63]',
      action: () => onStartBetting(cardId)
    },
    {
      key: 'battling',
      icon: Sword,
      label: 'Challenge Battle',
      description: 'Use this card in competitive battles and tournaments',
      enabled: userSetup.battlingEnabled,
      tier: userSetup.battlingTier,
      activeCount: userSetup.activeBattles,
      winRate: userSetup.winRate.battling,
      reputation: userSetup.reputation.battling,
      color: 'text-[#66D9EF]',
      gradient: 'from-[#66D9EF] to-[#819AFF]',
      action: () => onStartBattling(cardId)
    }
  ]

  const getReputationLabel = (reputation: number) => {
    if (reputation >= 90) return 'Legendary'
    if (reputation >= 75) return 'Master'
    if (reputation >= 60) return 'Expert'
    if (reputation >= 40) return 'Skilled'
    if (reputation >= 20) return 'Novice'
    return 'Beginner'
  }

  const handleActionClick = (config: ActionConfig) => {
    if (!config.enabled) {
      setSelectedAction(config.key)
      setShowDetails(true)
      return
    }
    config.action()
  }

  const enabledActions = actionConfigs.filter(config => config.enabled)
  const disabledActions = actionConfigs.filter(config => !config.enabled)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Action Buttons */}
      {enabledActions.length > 0 && (
        <GlassCard variant="dark" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#F8EFD6] flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Trading Actions
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDetails(!showDetails)}
              className="text-[#75715E] hover:text-[#F8EFD6]"
            >
              <Eye className="h-4 w-4 mr-1" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {enabledActions.map((config) => (
              <motion.div
                key={config.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => handleActionClick(config)}
                  className={`
                    w-full h-auto p-4 bg-gradient-to-r ${config.gradient}
                    hover:shadow-lg hover:shadow-current/25
                    transition-all duration-300
                    flex flex-col items-center text-center
                  `}
                >
                  <config.icon className="h-6 w-6 text-[#F8EFD6] mb-2" />
                  <span className="text-sm font-medium text-[#F8EFD6] mb-1">
                    {config.label}
                  </span>
                  
                  <div className="flex items-center gap-2 text-xs text-[#F8EFD6]/80">
                    <Badge className={getTierBadgeColor(config.tier)}>
                      {config.tier.toUpperCase()}
                    </Badge>
                    {config.activeCount > 0 && (
                      <Badge variant="secondary" className="bg-[#272822] text-[#E6DB74]">
                        {config.activeCount} Active
                      </Badge>
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Detailed Stats */}
          <AnimatePresence>
            {showDetails && enabledActions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-[#75715E]/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {enabledActions.map((config) => (
                    <div key={`${config.key}-details`} className="bg-[#272822]/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#F8EFD6]">
                          {config.label.replace('Start ', '').replace('Place ', '').replace('Challenge ', '')}
                        </span>
                        <config.icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#75715E]">Win Rate</span>
                          <span className="text-[#F8EFD6]">{config.winRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#75715E]">Reputation</span>
                          <span className="text-[#F8EFD6]">
                            {getReputationLabel(config.reputation)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#75715E]">Active</span>
                          <span className="text-[#F8EFD6]">{config.activeCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      )}

      {/* Setup Required Actions */}
      {disabledActions.length > 0 && (
        <GlassCard variant="dark" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#F8EFD6] flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Setup Required
            </h3>
            <Button
              size="sm"
              onClick={onManageSetup}
              className="bg-[#E6DB74] text-[#272822] hover:bg-[#E6DB74]/80"
            >
              <Crown className="h-4 w-4 mr-1" />
              Configure
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {disabledActions.map((config) => (
              <motion.div
                key={config.key}
                whileHover={{ scale: 1.01 }}
                className="relative"
              >
                <Button
                  onClick={() => handleActionClick(config)}
                  disabled
                  className="w-full h-auto p-4 bg-[#272822]/50 border border-[#75715E]/30 opacity-60 flex flex-col items-center text-center"
                >
                  <config.icon className="h-6 w-6 text-[#75715E] mb-2" />
                  <span className="text-sm font-medium text-[#75715E] mb-1">
                    {config.label}
                  </span>
                  <Badge variant="secondary" className="bg-[#75715E]/20 text-[#75715E]">
                    Setup Required
                  </Badge>
                </Button>

                {/* Setup overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#272822]/80 rounded-lg">
                  <div className="text-center">
                    <Settings className="h-8 w-8 text-[#E6DB74] mx-auto mb-2" />
                    <div className="text-xs text-[#E6DB74] font-medium">
                      Tap to Setup
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-[#E6DB74]/10 rounded-lg border border-[#E6DB74]/20">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-[#E6DB74] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-[#E6DB74] mb-1">
                  Unlock Trading Features
                </div>
                <div className="text-xs text-[#75715E]">
                  Configure your trading preferences to enable bidding, betting, and battling for this card type.
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Quick Stats */}
      <GlassCard variant="dark" className="p-4">
        <h4 className="text-md font-semibold text-[#F8EFD6] mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Card Trading Potential
        </h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#75715E]">Current Value</span>
              <span className="text-[#F8EFD6]">${cardValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75715E]">Trading Volume</span>
              <span className="text-[#F8EFD6]">High</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#75715E]">Rarity Score</span>
              <span className="text-[#F8EFD6]">8.5/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75715E]">Battle Power</span>
              <span className="text-[#F8EFD6]">780</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#75715E]/20">
          <div className="text-xs text-[#75715E] text-center">
            Trading features available based on your tier and reputation
          </div>
        </div>
      </GlassCard>

      {/* Action Detail Modal */}
      <AnimatePresence>
        {selectedAction && showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <GlassCard variant="dark" className="p-6">
                {(() => {
                  const config = actionConfigs.find(c => c.key === selectedAction)!
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <config.icon className={`h-6 w-6 ${config.color}`} />
                        <h3 className="text-lg font-semibold text-[#F8EFD6]">
                          {config.label}
                        </h3>
                      </div>
                      
                      <p className="text-[#75715E] mb-4">
                        {config.description}
                      </p>
                      
                      <div className="bg-[#F92672]/10 border border-[#F92672]/20 rounded-lg p-3 mb-4">
                        <div className="text-sm text-[#F92672] font-medium mb-1">
                          Setup Required
                        </div>
                        <div className="text-xs text-[#75715E]">
                          This trading feature requires initial configuration. Set your preferences, limits, and strategies to get started.
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={onManageSetup}
                          className="flex-1 bg-[#E6DB74] text-[#272822] hover:bg-[#E6DB74]/80"
                        >
                          Setup Now
                        </Button>
                        <Button
                          onClick={() => setSelectedAction(null)}
                          variant="ghost"
                          className="text-[#75715E]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )
                })()}
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TradingActionButtons
