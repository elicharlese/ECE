'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowUp,
  Zap,
  Star,
  Crown,
  Diamond,
  Flame,
  Shield,
  Plus,
  Minus,
  Calculator,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  Sparkles
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface CardUpgrade {
  id: string
  cardId: string
  cardName: string
  currentTier: string
  targetTier: string
  currentValue: number
  targetValue: number
  upgradeCost: number
  requiredMaterials: Material[]
  successRate: number
  timeRequired: string
  benefits: string[]
}

interface Material {
  id: string
  name: string
  type: 'essence' | 'shard' | 'catalyst' | 'token'
  required: number
  owned: number
  icon: React.ComponentType<any>
  rarity: string
}

interface TierUpgradeSystemProps {
  className?: string
}

export function TierUpgradeSystem({ className = '' }: TierUpgradeSystemProps) {
  const [selectedUpgrade, setSelectedUpgrade] = useState<CardUpgrade | null>(null)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [upgradeQuantity, setUpgradeQuantity] = useState(1)

  const availableUpgrades: CardUpgrade[] = [
    {
      id: '1',
      cardId: 'card-1',
      cardName: 'Tech Warrior',
      currentTier: 'common',
      targetTier: 'uncommon',
      currentValue: 25,
      targetValue: 75,
      upgradeCost: 500,
      requiredMaterials: [
        { id: 'm1', name: 'Essence of Power', type: 'essence', required: 3, owned: 5, icon: Sparkles, rarity: 'uncommon' },
        { id: 'm2', name: 'Energy Shard', type: 'shard', required: 2, owned: 1, icon: Zap, rarity: 'common' }
      ],
      successRate: 85,
      timeRequired: '2 hours',
      benefits: ['Enhanced glow effect', '+200% value increase', 'Particle animations']
    },
    {
      id: '2',
      cardId: 'card-2',
      cardName: 'Cyber Guardian',
      currentTier: 'rare',
      targetTier: 'epic',
      currentValue: 800,
      targetValue: 2400,
      upgradeCost: 2000,
      requiredMaterials: [
        { id: 'm3', name: 'Flame Core', type: 'catalyst', required: 1, owned: 1, icon: Flame, rarity: 'epic' },
        { id: 'm4', name: 'Rare Essence', type: 'essence', required: 5, owned: 3, icon: Star, rarity: 'rare' },
        { id: 'm5', name: 'ECE Tokens', type: 'token', required: 1000, owned: 2500, icon: Calculator, rarity: 'common' }
      ],
      successRate: 70,
      timeRequired: '6 hours',
      benefits: ['Flame effects', '+300% value increase', 'Pulsing animation', 'Color shifting']
    },
    {
      id: '3',
      cardId: 'card-3',
      cardName: 'Storm Elemental',
      currentTier: 'epic',
      targetTier: 'legendary',
      currentValue: 3500,
      targetValue: 12000,
      upgradeCost: 8000,
      requiredMaterials: [
        { id: 'm6', name: 'Crown Fragment', type: 'catalyst', required: 1, owned: 0, icon: Crown, rarity: 'legendary' },
        { id: 'm7', name: 'Epic Essence', type: 'essence', required: 10, owned: 7, icon: Diamond, rarity: 'epic' },
        { id: 'm8', name: 'ECE Tokens', type: 'token', required: 5000, owned: 2500, icon: Calculator, rarity: 'common' }
      ],
      successRate: 45,
      timeRequired: '24 hours',
      benefits: ['Golden aura', '+243% value increase', 'Royal crown effect', 'Majestic glow']
    }
  ]

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      common: '#75715E',
      uncommon: '#A6E22E',
      rare: '#66D9EF',
      epic: '#F92672',
      legendary: '#E6DB74',
      mythic: '#819AFF'
    }
    return colors[tier] || '#75715E'
  }

  const getTierIcon = (tier: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      common: Shield,
      uncommon: Star,
      rare: Zap,
      epic: Flame,
      legendary: Crown,
      mythic: Diamond
    }
    return icons[tier] || Shield
  }

  const canUpgrade = (upgrade: CardUpgrade) => {
    return upgrade.requiredMaterials.every(material => material.owned >= material.required)
  }

  const handleUpgradeStart = async (upgrade: CardUpgrade) => {
    setIsUpgrading(true)
    setSelectedUpgrade(upgrade)
    
    // Simulate upgrade process
    setTimeout(() => {
      setIsUpgrading(false)
      setSelectedUpgrade(null)
      // In a real app, this would trigger the actual upgrade
      console.log('Upgrade completed for:', upgrade.cardName)
    }, 3000)
  }

  const calculateTotalCost = (upgrade: CardUpgrade, quantity: number) => {
    return upgrade.upgradeCost * quantity
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2 flex items-center justify-center">
          <ArrowUp className="w-6 h-6 mr-2" />
          Tier Upgrade System
        </h2>
        <p className="text-[#75715E]">
          Enhance your cards to higher tiers for increased value and special effects
        </p>
      </motion.div>

      {/* Available Upgrades */}
      <div className="space-y-4">
        {availableUpgrades.map((upgrade, index) => {
          const CurrentTierIcon = getTierIcon(upgrade.currentTier)
          const TargetTierIcon = getTierIcon(upgrade.targetTier)
          const canPerformUpgrade = canUpgrade(upgrade)
          
          return (
            <motion.div
              key={upgrade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="dark" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 flex items-center justify-center mb-1"
                        style={{ 
                          borderColor: getTierColor(upgrade.currentTier),
                          backgroundColor: `${getTierColor(upgrade.currentTier)}20`
                        }}
                      >
                        <CurrentTierIcon 
                          className="w-6 h-6" 
                          style={{ color: getTierColor(upgrade.currentTier) }}
                        />
                      </div>
                      <span className="text-xs text-[#75715E]">{upgrade.currentTier}</span>
                    </div>
                    
                    <ArrowUp className="w-6 h-6 text-[#A6E22E]" />
                    
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 flex items-center justify-center mb-1"
                        style={{ 
                          borderColor: getTierColor(upgrade.targetTier),
                          backgroundColor: `${getTierColor(upgrade.targetTier)}20`
                        }}
                      >
                        <TargetTierIcon 
                          className="w-6 h-6" 
                          style={{ color: getTierColor(upgrade.targetTier) }}
                        />
                      </div>
                      <span className="text-xs text-[#75715E]">{upgrade.targetTier}</span>
                    </div>

                    <div className="ml-4">
                      <h3 className="font-bold text-[#F8EFD6] text-lg">{upgrade.cardName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-[#75715E]">
                        <span>Value: {upgrade.currentValue} → {upgrade.targetValue} ECE</span>
                        <span>Success Rate: {upgrade.successRate}%</span>
                        <span>Time: {upgrade.timeRequired}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#E6DB74] mb-1">
                      {upgrade.upgradeCost.toLocaleString()} ECE
                    </div>
                    <Button
                      variant={canPerformUpgrade ? "accent" : "ghost"}
                     
                      disabled={!canPerformUpgrade || isUpgrading}
                      onClick={() => handleUpgradeStart(upgrade)}
                    >
                      {isUpgrading && selectedUpgrade?.id === upgrade.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#272822]/30 border-t-[#272822] rounded-full animate-spin mr-2" />
                          Upgrading...
                        </>
                      ) : (
                        <>
                          <ArrowUp className="w-4 h-4 mr-2" />
                          Upgrade
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Required Materials */}
                <div className="mb-4">
                  <h4 className="font-semibold text-[#F8EFD6] mb-3">Required Materials</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {upgrade.requiredMaterials.map((material) => {
                      const MaterialIcon = material.icon
                      const hasEnough = material.owned >= material.required
                      
                      return (
                        <div
                          key={material.id}
                          className={`p-3 rounded-lg border transition-colors ${
                            hasEnough 
                              ? 'bg-[#A6E22E]/10 border-[#A6E22E]/30' 
                              : 'bg-[#F92672]/10 border-[#F92672]/30'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <MaterialIcon className={`w-4 h-4 ${hasEnough ? 'text-[#A6E22E]' : 'text-[#F92672]'}`} />
                            <span className="text-sm font-medium text-[#F8EFD6]">{material.name}</span>
                          </div>
                          <div className={`text-sm ${hasEnough ? 'text-[#A6E22E]' : 'text-[#F92672]'}`}>
                            {material.owned}/{material.required}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold text-[#F8EFD6] mb-2">Upgrade Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {upgrade.benefits.map((benefit, benefitIndex) => (
                      <span
                        key={benefitIndex}
                        className="px-3 py-1 bg-gradient-to-r from-[#66D9EF]/20 to-[#66D9EF]/10 border border-[#66D9EF]/30 text-[#66D9EF] text-sm rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Upgrade Progress Modal */}
      <AnimatePresence>
        {isUpgrading && selectedUpgrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#272822]/95 backdrop-blur-xl border border-[#75715E]/30 rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#A6E22E]/30 border-t-[#A6E22E] rounded-full animate-spin" />
                
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-2">
                  Upgrading {selectedUpgrade.cardName}
                </h3>
                
                <p className="text-[#75715E] mb-4">
                  Please wait while your card is being enhanced...
                </p>

                <Progress value={33} className="mb-4" />
                
                <div className="text-sm text-[#66D9EF]">
                  Estimated time remaining: {selectedUpgrade.timeRequired}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard variant="dark" className="p-6">
          <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Upgrade Tips
          </h3>
          
          <div className="space-y-3 text-sm text-[#75715E]">
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-[#A6E22E] mt-0.5 flex-shrink-0" />
              <span>Higher tier upgrades have lower success rates but greater rewards</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-[#A6E22E] mt-0.5 flex-shrink-0" />
              <span>Collect materials through trading, battles, and special events</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-[#A6E22E] mt-0.5 flex-shrink-0" />
              <span>Failed upgrades return 50% of materials and 25% of ECE cost</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-[#A6E22E] mt-0.5 flex-shrink-0" />
              <span>Upgraded cards gain unique visual effects and increased trading value</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
