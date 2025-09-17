'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { GlassCard } from '../ui/glass-card'
import { Badge } from '../ui/badge'
import { 
  Heart, 
  X, 
  Star, 
  Zap, 
  Eye, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  Timer,
  Crown
} from 'lucide-react'

interface ActionButtonsProps {
  onPass: () => void
  onLike: () => void
  onSuperLike: () => void
  onBoost: () => void
  onWatchlist: () => void
  onUndo: () => void
  canUndo: boolean
  isPremium: boolean
  remainingBoosts: number
  remainingSuperLikes: number
  className?: string
}

interface ActionButtonConfig {
  icon: React.ElementType
  label: string
  action: () => void
  color: string
  hoverColor: string
  gradient: string
  size: 'sm' | 'md' | 'lg'
  premium?: boolean
  cooldown?: number
  hapticIntensity?: 'light' | 'medium' | 'heavy'
  description: string
}

// Haptic feedback helper
const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30]
    }
    navigator.vibrate(patterns[intensity])
  }
}

export function ActionButtons({
  onPass,
  onLike,
  onSuperLike,
  onBoost,
  onWatchlist,
  onUndo,
  canUndo,
  isPremium,
  remainingBoosts,
  remainingSuperLikes,
  className = ''
}: ActionButtonsProps) {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle action with cooldown and haptic feedback
  const handleAction = async (
    action: () => void, 
    actionKey: string, 
    cooldownTime: number = 0,
    hapticIntensity: 'light' | 'medium' | 'heavy' = 'medium'
  ) => {
    if (cooldowns[actionKey] || isProcessing) return
    
    setIsProcessing(true)
    triggerHaptic(hapticIntensity)
    
    try {
      await action()
      
      if (cooldownTime > 0) {
        setCooldowns(prev => ({ ...prev, [actionKey]: cooldownTime }))
        
        const interval = setInterval(() => {
          setCooldowns(prev => {
            const newTime = prev[actionKey] - 1000
            if (newTime <= 0) {
              clearInterval(interval)
              const { [actionKey]: _, ...rest } = prev
              return rest
            }
            return { ...prev, [actionKey]: newTime }
          })
        }, 1000)
      }
    } finally {
      setTimeout(() => setIsProcessing(false), 200)
    }
  }

  const actionConfigs: ActionButtonConfig[] = [
    {
      icon: X,
      label: 'Pass',
      action: () => handleAction(onPass, 'pass', 0, 'light'),
      color: 'text-[#F92672]',
      hoverColor: 'hover:text-[#FD5C63]',
      gradient: 'from-[#F92672] to-[#FD5C63]',
      size: 'md',
      description: 'Skip this card'
    },
    {
      icon: Eye,
      label: 'Watchlist',
      action: () => handleAction(onWatchlist, 'watchlist', 1000, 'medium'),
      color: 'text-[#819AFF]',
      hoverColor: 'hover:text-[#66D9EF]',
      gradient: 'from-[#819AFF] to-[#66D9EF]',
      size: 'md',
      description: 'Add to watchlist'
    },
    {
      icon: Heart,
      label: 'Like',
      action: () => handleAction(onLike, 'like', 0, 'medium'),
      color: 'text-[#A6E22E]',
      hoverColor: 'hover:text-[#3EBA7C]',
      gradient: 'from-[#A6E22E] to-[#3EBA7C]',
      size: 'lg',
      description: 'Express interest'
    },
    {
      icon: Star,
      label: 'Super Like',
      action: () => handleAction(onSuperLike, 'superlike', 5000, 'heavy'),
      color: 'text-[#E6DB74]',
      hoverColor: 'hover:text-[#F8EFD6]',
      gradient: 'from-[#E6DB74] to-[#F8EFD6]',
      size: 'md',
      premium: true,
      description: 'Priority interest'
    },
    {
      icon: Zap,
      label: 'Boost',
      action: () => handleAction(onBoost, 'boost', 10000, 'heavy'),
      color: 'text-[#FD5C63]',
      hoverColor: 'hover:text-[#F92672]',
      gradient: 'from-[#FD5C63] to-[#F92672]',
      size: 'md',
      premium: true,
      description: 'Promote visibility'
    }
  ]

  const getButtonSize = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm': return 'w-12 h-12'
      case 'md': return 'w-16 h-16'
      case 'lg': return 'w-20 h-20'
    }
  }

  const getIconSize = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm': return 'h-5 w-5'
      case 'md': return 'h-6 w-6'
      case 'lg': return 'h-8 w-8'
    }
  }

  const getRemainingCount = (label: string) => {
    if (label === 'Super Like') return remainingSuperLikes
    if (label === 'Boost') return remainingBoosts
    return null
  }

  const isActionDisabled = (config: ActionButtonConfig) => {
    if (config.premium && !isPremium) return true
    const remaining = getRemainingCount(config.label)
    return remaining !== null && remaining <= 0
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <GlassCard variant="dark" className="p-4">
        <div className="flex items-center justify-center gap-4">
          {/* Undo Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: canUndo ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Button
              onClick={() => handleAction(onUndo, 'undo', 2000, 'light')}
              disabled={!canUndo || !!cooldowns.undo}
             
              className="w-10 h-10 rounded-full bg-[#75715E]/20 hover:bg-[#75715E]/30 text-[#75715E] hover:text-[#F8EFD6] border border-[#75715E]/30"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Main Action Buttons */}
          {actionConfigs.map((config, index) => {
            const isDisabled = isActionDisabled(config)
            const remainingCount = getRemainingCount(config.label)
            const cooldownTime = cooldowns[config.label.toLowerCase().replace(' ', '')]

            return (
              <motion.div
                key={config.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Cooldown Timer */}
                <AnimatePresence>
                  {cooldownTime && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -top-2 -right-2 z-10"
                    >
                      <Badge variant="secondary" className="text-xs bg-[#272822] text-[#E6DB74] border border-[#75715E]/30">
                        <Timer className="h-3 w-3 mr-1" />
                        {Math.ceil(cooldownTime / 1000)}s
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remaining Count Badge */}
                <AnimatePresence>
                  {remainingCount !== null && remainingCount >= 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -top-2 -left-2 z-10"
                    >
                      <Badge 
                        variant={remainingCount > 0 ? "default" : "destructive"} 
                        className={`text-xs ${remainingCount > 0 ? 'bg-[#A6E22E] text-[#272822]' : 'bg-[#F92672] text-[#F8EFD6]'}`}
                      >
                        {remainingCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Premium Badge */}
                <AnimatePresence>
                  {config.premium && !isPremium && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -top-2 -right-2 z-10"
                    >
                      <Badge className="text-xs bg-[#E6DB74] text-[#272822] border border-[#F8EFD6]/30">
                        <Crown className="h-3 w-3" />
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Button */}
                <motion.div
                  whileHover={{ scale: isDisabled ? 1 : 1.1 }}
                  whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Button
                    onClick={config.action}
                    disabled={isDisabled || !!cooldownTime || isProcessing}
                    className={`
                      ${getButtonSize(config.size)} 
                      rounded-full 
                      bg-gradient-to-r ${config.gradient}
                      hover:shadow-lg hover:shadow-current/25
                      transition-all duration-300
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                      ${config.size === 'lg' ? 'mx-2' : ''}
                      group relative overflow-hidden
                    `}
                  >
                    {/* Button Background Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    {/* Icon */}
                    <config.icon className={`${getIconSize(config.size)} text-[#F8EFD6] relative z-10`} />
                    
                    {/* Ripple Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 2, opacity: 0.3 }}
                      transition={{ duration: 0.3 }}
                      style={{ backgroundColor: 'rgba(248, 239, 214, 0.3)' }}
                    />
                  </Button>
                </motion.div>

                {/* Action Label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                >
                  <span className="text-xs text-[#75715E] whitespace-nowrap">
                    {config.label}
                  </span>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Action Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t border-[#75715E]/20"
        >
          <div className="flex items-center justify-center gap-4 text-xs text-[#75715E]">
            <div className="flex items-center gap-1">
              <X className="h-3 w-3" />
              <span>Pass</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>Like</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>Super</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Premium</span>
            </div>
          </div>
        </motion.div>

        {/* Premium Upsell */}
        <AnimatePresence>
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-[#75715E]/20"
            >
              <div className="text-center">
                <p className="text-xs text-[#75715E] mb-2">
                  Unlock Super Likes & Boosts with Pro
                </p>
                <Button
                 
                  className="bg-gradient-to-r from-[#E6DB74] to-[#F8EFD6] text-[#272822] hover:from-[#E6DB74]/80 hover:to-[#F8EFD6]/80"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  )
}

export default ActionButtons
