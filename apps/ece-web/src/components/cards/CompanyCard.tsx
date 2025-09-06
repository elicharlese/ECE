'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Users, 
  DollarSign, 
  Crown, 
  Shield, 
  Zap, 
  Star,
  Eye,
  Heart,
  Share2,
  Sword,
  Target,
  Gavel,
  Sparkles,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Globe,
  Award
} from 'lucide-react'

// Enhanced company card interface for M&A focus
export interface CompanyCardData {
  id: string
  name: string
  ticker: string
  sector: 'TECH' | 'FINANCE' | 'HEALTHCARE' | 'ENERGY' | 'RETAIL' | 'AUTOMOTIVE' | 'AEROSPACE' | 'MEDIA'
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  
  // Market Data
  marketCap: number
  currentPrice: number
  priceChange24h: number
  volume24h: number
  
  // M&A Specific Stats
  stats: {
    acquisitionPower: number    // 1-100 - ability to acquire others
    defenseRating: number      // 1-100 - resistance to takeovers
    marketDominance: number    // 1-100 - market position
    innovation: number         // 1-100 - R&D and innovation score
    financialHealth: number    // 1-100 - balance sheet strength
    leadership: number         // 1-100 - management quality
  }
  
  // Visual & Metadata
  logo?: string
  description: string
  founded: number
  headquarters: string
  employees: number
  revenue: number
  
  // M&A History & Potential
  recentAcquisitions?: string[]
  vulnerabilities?: string[]
  strengths?: string[]
  
  // NFT & Trading
  isNFT: boolean
  tokenId?: string
  owner?: string
  
  // Powerups & Effects
  activePowerups?: PowerupEffect[]
  
  // Market sentiment
  sentiment: 'bullish' | 'bearish' | 'neutral'
  analystRating: 'buy' | 'hold' | 'sell'
}

interface PowerupEffect {
  id: string
  name: string
  type: 'boost' | 'defense' | 'special'
  value: number
  duration?: number
  description: string
}

interface CompanyCardProps {
  card: CompanyCardData
  onAcquire?: (cardId: string) => void
  onDefend?: (cardId: string) => void
  onTrade?: (cardId: string) => void
  onView?: (cardId: string) => void
  onBattle?: (cardId: string) => void
  onBid?: (cardId: string) => void
  variant?: 'default' | 'compact' | 'battle' | 'marketplace'
  className?: string
  showActions?: boolean
  isInteractive?: boolean
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  card,
  onAcquire,
  onDefend, 
  onTrade,
  onView,
  onBattle,
  onBid,
  variant = 'default',
  className,
  showActions = true,
  isInteractive = true
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0)

  // Rarity configurations with M&A themes
  const rarityConfig = {
    common: {
      colors: 'from-slate-500 to-slate-700',
      borderColor: 'border-slate-400/50',
      glowColor: 'shadow-slate-400/20',
      icon: Building2,
      bgPattern: 'bg-gradient-to-br from-slate-50/5 to-slate-100/10'
    },
    rare: {
      colors: 'from-blue-500 to-blue-700', 
      borderColor: 'border-blue-400/50',
      glowColor: 'shadow-blue-400/30',
      icon: TrendingUp,
      bgPattern: 'bg-gradient-to-br from-blue-50/5 to-blue-100/10'
    },
    epic: {
      colors: 'from-purple-500 to-purple-700',
      borderColor: 'border-purple-400/50', 
      glowColor: 'shadow-purple-400/30',
      icon: Crown,
      bgPattern: 'bg-gradient-to-br from-purple-50/5 to-purple-100/10'
    },
    legendary: {
      colors: 'from-yellow-500 to-orange-600',
      borderColor: 'border-yellow-400/50',
      glowColor: 'shadow-yellow-400/40',
      icon: Award,
      bgPattern: 'bg-gradient-to-br from-yellow-50/5 to-orange-100/10'
    },
    mythic: {
      colors: 'from-red-500 to-pink-600',
      borderColor: 'border-red-400/50',
      glowColor: 'shadow-red-400/40', 
      icon: Sparkles,
      bgPattern: 'bg-gradient-to-br from-red-50/5 to-pink-100/10'
    }
  }

  const sectorIcons = {
    TECH: Globe,
    FINANCE: DollarSign,
    HEALTHCARE: Heart,
    ENERGY: Zap,
    RETAIL: Users,
    AUTOMOTIVE: Building2,
    AEROSPACE: Star,
    MEDIA: Eye
  }

  const config = rarityConfig[card.rarity]
  const RarityIcon = config.icon
  const SectorIcon = sectorIcons[card.sector]

  // Animation effects
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 3)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isHovered])

  const formatNumber = (num: number, type: 'currency' | 'compact' = 'compact') => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(num)
    }
    
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toString()
  }

  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-400'
    if (value >= 60) return 'text-yellow-400'
    if (value >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const cardVariants = {
    default: 'w-80 h-[520px]',
    compact: 'w-64 h-80', 
    battle: 'w-96 h-[600px]',
    marketplace: 'w-72 h-[480px]'
  }

  return (
    <motion.div
      className={cn(
        'relative group cursor-pointer select-none',
        cardVariants[variant],
        className
      )}
      onHoverStart={() => isInteractive && setIsHovered(true)}
      onHoverEnd={() => isInteractive && setIsHovered(false)}
      whileHover={isInteractive ? { 
        scale: 1.02,
        rotateY: 3,
        z: 50
      } : {}}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      <Card className={cn(
        'h-full relative overflow-hidden border-2',
        config.borderColor,
        'glass-card shadow-soft-xl transition-all duration-300',
        isHovered ? config.glowColor : 'shadow-soft-lg',
        config.bgPattern
      )}>
        
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={isHovered ? {
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.2, 0.1]
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
            className={cn(
              'absolute -top-20 -right-20 w-40 h-40 rounded-full',
              `bg-gradient-to-br ${config.colors}`,
              'blur-3xl'
            )}
          />
          <motion.div
            animate={isHovered ? {
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              opacity: [0.1, 0.15, 0.1]
            } : {}}
            transition={{ duration: 4, repeat: Infinity }}
            className={cn(
              'absolute -bottom-20 -left-20 w-32 h-32 rounded-full',
              `bg-gradient-to-tr ${config.colors}`,
              'blur-3xl'
            )}
          />
        </div>

        {/* Header with badges */}
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-start justify-between mb-2">
            {/* Company info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SectorIcon className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-bold text-foreground truncate">
                  {card.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {card.ticker}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {card.sector}
                </Badge>
              </div>
            </div>
            
            {/* Rarity badge */}
            <div className={cn(
              'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1',
              'bg-gradient-to-r text-white shadow-soft',
              config.colors
            )}>
              <RarityIcon className="w-3 h-3" />
              {card.rarity.toUpperCase()}
            </div>
          </div>

          {/* NFT & Status badges */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {card.isNFT && (
                <Badge className="bg-monokai-accent/20 text-monokai-accent border-monokai-accent/30">
                  🪙 NFT
                </Badge>
              )}
              {card.activePowerups && card.activePowerups.length > 0 && (
                <Badge className="bg-monokai-purple/20 text-monokai-purple border-monokai-purple/30">
                  ⚡ {card.activePowerups.length}
                </Badge>
              )}
            </div>
            
            {/* Market sentiment */}
            <div className="flex items-center gap-1">
              {card.sentiment === 'bullish' && <TrendingUp className="w-4 h-4 text-green-400" />}
              {card.sentiment === 'bearish' && <TrendingDown className="w-4 h-4 text-red-400" />}
              {card.sentiment === 'neutral' && <BarChart3 className="w-4 h-4 text-yellow-400" />}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex flex-col h-full relative z-10">
          {/* Company logo/visual area */}
          <div className={cn(
            'relative flex-1 mb-4 rounded-lg overflow-hidden',
            'bg-gradient-to-br from-background/20 to-card/40',
            'border border-border/50 flex items-center justify-center',
            'shadow-soft group-hover:shadow-soft-lg transition-all duration-300',
            'min-h-[120px]'
          )}>
            {card.logo ? (
              <img 
                src={card.logo} 
                alt={card.name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="text-center">
                <SectorIcon className="w-12 h-12 mb-2 text-muted-foreground/50" />
                <div className="text-xs text-muted-foreground font-medium">
                  {card.name}
                </div>
              </div>
            )}
            
            {/* Hover overlay with quick stats */}
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center text-white space-y-1">
                <div className="text-sm font-medium">Market Cap</div>
                <div className="text-lg font-bold">{formatNumber(card.marketCap, 'currency')}</div>
                <div className="text-xs text-gray-300">
                  {card.employees.toLocaleString()} employees
                </div>
              </div>
            </motion.div>
          </div>

          {/* Key stats grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-background/20 rounded-lg border border-border/30">
              <Sword className="w-4 h-4 mx-auto mb-1 text-red-400" />
              <div className="text-xs text-muted-foreground">ACQUIRE</div>
              <div className={cn('text-sm font-bold', getStatColor(card.stats.acquisitionPower))}>
                {card.stats.acquisitionPower}
              </div>
            </div>
            <div className="text-center p-2 bg-background/20 rounded-lg border border-border/30">
              <Shield className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <div className="text-xs text-muted-foreground">DEFENSE</div>
              <div className={cn('text-sm font-bold', getStatColor(card.stats.defenseRating))}>
                {card.stats.defenseRating}
              </div>
            </div>
            <div className="text-center p-2 bg-background/20 rounded-lg border border-border/30">
              <Crown className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
              <div className="text-xs text-muted-foreground">MARKET</div>
              <div className={cn('text-sm font-bold', getStatColor(card.stats.marketDominance))}>
                {card.stats.marketDominance}
              </div>
            </div>
          </div>

          {/* Price & performance */}
          <div className="mb-4 p-3 bg-gradient-to-r from-monokai-warning/10 to-monokai-warning/5 rounded-lg border border-monokai-warning/20">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground">STOCK PRICE</div>
              <div className={cn(
                'flex items-center gap-1 text-xs',
                card.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {card.priceChange24h >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {Math.abs(card.priceChange24h).toFixed(2)}%
              </div>
            </div>
            <div className="text-xl font-bold text-monokai-warning flex items-center justify-center">
              ${card.currentPrice.toFixed(2)}
            </div>
          </div>

          {/* Action buttons */}
          {showActions && (
            <div className="grid grid-cols-2 gap-2 mt-auto">
              {onBattle && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBattle(card.id)}
                  className="text-xs"
                >
                  <Sword className="w-3 h-3 mr-1" />
                  BATTLE
                </Button>
              )}
              
              {onAcquire && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAcquire(card.id)}
                  className="text-xs"
                >
                  <Target className="w-3 h-3 mr-1" />
                  ACQUIRE
                </Button>
              )}
              
              {onBid && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onBid(card.id)}
                  className="text-xs"
                >
                  <Gavel className="w-3 h-3 mr-1" />
                  BID
                </Button>
              )}
              
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(card.id)}
                  className="text-xs col-span-full"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  VIEW DETAILS
                </Button>
              )}
            </div>
          )}
        </CardContent>

        {/* Powerup effects overlay */}
        <AnimatePresence>
          {card.activePowerups && card.activePowerups.length > 0 && isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-4 right-4 z-20"
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-monokai-purple/30">
                <div className="text-xs text-monokai-purple font-medium mb-1">Active Powerups:</div>
                <div className="space-y-1">
                  {card.activePowerups.slice(0, 2).map((powerup) => (
                    <div key={powerup.id} className="text-xs text-white flex justify-between">
                      <span>{powerup.name}</span>
                      <span className="text-monokai-accent">+{powerup.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

// Sample M&A focused company cards
export const sampleCompanyCards: CompanyCardData[] = [
  {
    id: 'company-001',
    name: 'TechNova Corp',
    ticker: 'TNVA',
    sector: 'TECH',
    rarity: 'legendary',
    marketCap: 850000000000,
    currentPrice: 342.50,
    priceChange24h: 2.3,
    volume24h: 45000000,
    stats: {
      acquisitionPower: 95,
      defenseRating: 88,
      marketDominance: 92,
      innovation: 97,
      financialHealth: 89,
      leadership: 94
    },
    description: 'Revolutionary AI and quantum computing leader',
    founded: 1998,
    headquarters: 'Silicon Valley, CA',
    employees: 145000,
    revenue: 280000000000,
    recentAcquisitions: ['DataMind AI', 'QuantumFlow Systems', 'NeuralNet Dynamics'],
    strengths: ['Market Leadership', 'Innovation Pipeline', 'Strong Balance Sheet'],
    isNFT: true,
    tokenId: 'ECE-TNVA-001',
    sentiment: 'bullish',
    analystRating: 'buy',
    activePowerups: [
      {
        id: 'pw-001',
        name: 'Innovation Boost',
        type: 'boost',
        value: 15,
        description: '+15% to all innovation-related stats'
      }
    ]
  },
  {
    id: 'company-002', 
    name: 'MegaBank Financial',
    ticker: 'MBFN',
    sector: 'FINANCE',
    rarity: 'epic',
    marketCap: 420000000000,
    currentPrice: 185.75,
    priceChange24h: -1.2,
    volume24h: 32000000,
    stats: {
      acquisitionPower: 87,
      defenseRating: 93,
      marketDominance: 85,
      innovation: 65,
      financialHealth: 96,
      leadership: 82
    },
    description: 'Global banking and financial services giant',
    founded: 1852,
    headquarters: 'New York, NY',
    employees: 267000,
    revenue: 145000000000,
    recentAcquisitions: ['CreditFlow Systems', 'Digital Wallet Pro'],
    strengths: ['Regulatory Compliance', 'Capital Reserves', 'Global Reach'],
    vulnerabilities: ['Digital Transformation', 'Fintech Competition'],
    isNFT: false,
    sentiment: 'neutral',
    analystRating: 'hold'
  },
  {
    id: 'company-003',
    name: 'BioHeal Industries',
    ticker: 'BHIL',
    sector: 'HEALTHCARE',
    rarity: 'mythic',
    marketCap: 650000000000,
    currentPrice: 425.80,
    priceChange24h: 5.7,
    volume24h: 28000000,
    stats: {
      acquisitionPower: 78,
      defenseRating: 91,
      marketDominance: 88,
      innovation: 99,
      financialHealth: 85,
      leadership: 87
    },
    description: 'Breakthrough gene therapy and regenerative medicine',
    founded: 2005,
    headquarters: 'Boston, MA',
    employees: 89000,
    revenue: 95000000000,
    recentAcquisitions: ['GeneCure Labs', 'Stem Cell Innovations'],
    strengths: ['Patent Portfolio', 'Clinical Pipeline', 'Regulatory Expertise'],
    isNFT: true,
    tokenId: 'ECE-BHIL-001',
    sentiment: 'bullish',
    analystRating: 'buy',
    activePowerups: [
      {
        id: 'pw-002',
        name: 'Research Accelerator',
        type: 'special',
        value: 25,
        description: '+25% innovation and development speed'
      },
      {
        id: 'pw-003',
        name: 'Patent Shield',
        type: 'defense',
        value: 10,
        description: '+10% defense against IP challenges'
      }
    ]
  }
]