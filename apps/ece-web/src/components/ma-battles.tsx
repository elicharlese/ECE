'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  X, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Trophy, 
  BarChart3,
  Sword,
  Shield,
  Target,
  Clock,
  Star,
  Flame,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react'

interface MABattleCard {
  id: string
  companyName: string
  category: string
  marketCap: number
  revenue: number
  employees: number
  founded: number
  description: string
  advantages: string[]
  weaknesses: string[]
  battlePower: number
  defensiveRating: number
  acquisitionPrice: number
  imageUrl?: string
  ceo: string
  headquarters: string
  isHot: boolean
  recentNews: string[]
  stockPrice: number
  priceChange: number
  battleHistory: {
    wins: number
    losses: number
    draws: number
  }
}

interface MABattle {
  id: string
  challenger: MABattleCard
  defender: MABattleCard
  status: 'ACTIVE' | 'VOTING' | 'COMPLETED'
  timeLeft: number
  totalVotes: number
  challengerVotes: number
  defenderVotes: number
  potSize: number
  participants: number
}

interface MABattlesProps {
  onSwipeLeft?: (cardId: string) => void
  onSwipeRight?: (cardId: string) => void
  onCreateBattle?: (challengerId: string, defenderId: string) => void
  onVote?: (battleId: string, choice: 'challenger' | 'defender', amount: number) => void
}

const mockCards: MABattleCard[] = [
  {
    id: '1',
    companyName: 'Tesla',
    category: 'AUTOMOTIVE',
    marketCap: 800000000000,
    revenue: 96773000000,
    employees: 127855,
    founded: 2003,
    description: 'Revolutionary electric vehicle and clean energy company leading the transition to sustainable transport.',
    advantages: ['Market Leader in EVs', 'Supercharger Network', 'Autonomous Driving Tech', 'Vertical Integration'],
    weaknesses: ['High Valuation', 'Production Challenges', 'Regulatory Risks', 'CEO Volatility'],
    battlePower: 95,
    defensiveRating: 88,
    acquisitionPrice: 850000000000,
    ceo: 'Elon Musk',
    headquarters: 'Austin, TX',
    isHot: true,
    recentNews: [
      'Q4 deliveries exceed expectations',
      'FSD beta expands to more users',
      'New Gigafactory announced'
    ],
    stockPrice: 248.50,
    priceChange: 5.2,
    battleHistory: { wins: 23, losses: 3, draws: 1 }
  },
  {
    id: '2',
    companyName: 'OpenAI',
    category: 'TECHNOLOGY',
    marketCap: 90000000000,
    revenue: 2000000000,
    employees: 1500,
    founded: 2015,
    description: 'Leading artificial intelligence research company developing cutting-edge AI systems and models.',
    advantages: ['GPT Dominance', 'First Mover Advantage', 'Strong Partnerships', 'Top Talent'],
    weaknesses: ['High Costs', 'Regulatory Pressure', 'Competition Rising', 'Monetization Challenges'],
    battlePower: 92,
    defensiveRating: 75,
    acquisitionPrice: 120000000000,
    ceo: 'Sam Altman',
    headquarters: 'San Francisco, CA',
    isHot: true,
    recentNews: [
      'GPT-5 development announced',
      'New enterprise partnerships',
      'Funding round completed'
    ],
    stockPrice: 0, // Private
    priceChange: 0,
    battleHistory: { wins: 18, losses: 2, draws: 0 }
  },
  {
    id: '3',
    companyName: 'Netflix',
    category: 'ENTERTAINMENT',
    marketCap: 180000000000,
    revenue: 31616000000,
    employees: 12800,
    founded: 1997,
    description: 'Global streaming entertainment service with original content production and international expansion.',
    advantages: ['Content Library', 'Global Reach', 'Original Productions', 'Data Analytics'],
    weaknesses: ['Increasing Competition', 'Content Costs', 'Market Saturation', 'Password Sharing'],
    battlePower: 78,
    defensiveRating: 82,
    acquisitionPrice: 200000000000,
    ceo: 'Reed Hastings',
    headquarters: 'Los Gatos, CA',
    isHot: false,
    recentNews: [
      'Subscriber growth slows',
      'New password sharing rules',
      'International expansion'
    ],
    stockPrice: 425.30,
    priceChange: -2.1,
    battleHistory: { wins: 15, losses: 8, draws: 2 }
  }
]

const mockBattles: MABattle[] = [
  {
    id: '1',
    challenger: mockCards[0], // Tesla
    defender: mockCards[2], // Netflix
    status: 'VOTING',
    timeLeft: 3600000, // 1 hour
    totalVotes: 1245,
    challengerVotes: 720,
    defenderVotes: 525,
    potSize: 25600,
    participants: 89
  }
]

const formatNumber = (num: number) => {
  if (num >= 1000000000000) return `$${(num / 1000000000000).toFixed(1)}T`
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
  return `$${num}`
}

const formatTimeLeft = (ms: number) => {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function MABattles({ onSwipeLeft, onSwipeRight, onCreateBattle, onVote }: MABattlesProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [showBattles, setShowBattles] = useState(false)
  const [voteAmount, setVoteAmount] = useState<number>(100)
  
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  const currentCard = mockCards[currentCardIndex]

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset > 100 || velocity > 500) {
      // Swipe right - Like/Challenge
      handleSwipeRight()
    } else if (offset < -100 || velocity < -500) {
      // Swipe left - Pass
      handleSwipeLeft()
    } else {
      // Snap back
      x.set(0)
    }
  }

  const handleSwipeLeft = () => {
    if (currentCard) {
      onSwipeLeft?.(currentCard.id)
      nextCard()
    }
  }

  const handleSwipeRight = () => {
    if (currentCard) {
      onSwipeRight?.(currentCard.id)
      setSelectedCards([...selectedCards, currentCard.id])
      nextCard()
    }
  }

  const nextCard = () => {
    x.set(0)
    setCurrentCardIndex((prev) => (prev + 1) % mockCards.length)
  }

  const CompanyCard = ({ card, isActive = false }: { card: MABattleCard, isActive?: boolean }) => (
    <motion.div
      className={`absolute inset-0 ${isActive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={isActive ? { x, rotate, opacity } : {}}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isActive ? handleDragEnd : undefined}
      whileTap={isActive ? { scale: 0.95 } : {}}
    >
      <Card className="h-full bg-gradient-to-br from-[#272822]/90 to-[#272822]/70 backdrop-blur-xl border border-[#75715E]/30 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#75715E]/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {card.isHot && (
                  <Badge className="bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30">
                    <Flame className="h-3 w-3 mr-1" />
                    Hot
                  </Badge>
                )}
                <Badge variant="outline" className="border-[#66D9EF]/30 text-[#66D9EF]">
                  {card.category}
                </Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2">
                {card.companyName}
              </h2>
              <p className="text-sm text-[#75715E] mb-3">
                {card.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-[#75715E]">
                <span>CEO: {card.ceo}</span>
                <span>Founded: {card.founded}</span>
                <span>{card.headquarters}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-[#A6E22E]">
                  <Sword className="h-4 w-4 mr-1" />
                  <span className="font-bold">{card.battlePower}</span>
                </div>
                <div className="flex items-center text-[#66D9EF]">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="font-bold">{card.defensiveRating}</span>
                </div>
              </div>
              <div className="text-xs text-[#75715E]">Battle Stats</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div>
                <div className="text-lg font-bold text-[#E6DB74] font-mono">
                  {formatNumber(card.marketCap)}
                </div>
                <div className="text-xs text-[#75715E]">Market Cap</div>
              </div>
              
              <div>
                <div className="text-lg font-bold text-[#66D9EF] font-mono">
                  {formatNumber(card.revenue)}
                </div>
                <div className="text-xs text-[#75715E]">Annual Revenue</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-lg font-bold text-[#A6E22E] font-mono">
                  {card.employees.toLocaleString()}
                </div>
                <div className="text-xs text-[#75715E]">Employees</div>
              </div>
              
              <div>
                <div className="text-lg font-bold text-[#F92672] font-mono">
                  {formatNumber(card.acquisitionPrice)}
                </div>
                <div className="text-xs text-[#75715E]">Acquisition Value</div>
              </div>
            </div>
          </div>

          {/* Battle Record */}
          <div className="mb-6 p-4 bg-[#272822]/50 rounded-lg border border-[#75715E]/20">
            <div className="text-sm font-semibold text-[#F8EFD6] mb-2">Battle Record</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A6E22E]">Wins: {card.battleHistory.wins}</span>
              <span className="text-[#F92672]">Losses: {card.battleHistory.losses}</span>
              <span className="text-[#E6DB74]">Draws: {card.battleHistory.draws}</span>
            </div>
            <Progress 
              value={(card.battleHistory.wins / (card.battleHistory.wins + card.battleHistory.losses + card.battleHistory.draws)) * 100} 
              className="mt-2 h-2 bg-[#272822]"
            />
          </div>

          {/* Advantages & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-[#A6E22E] mb-2">Advantages</h4>
              <div className="space-y-1">
                {card.advantages.map((advantage, index) => (
                  <div key={index} className="text-xs text-[#75715E] flex items-center">
                    <div className="w-1 h-1 bg-[#A6E22E] rounded-full mr-2" />
                    {advantage}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-[#F92672] mb-2">Weaknesses</h4>
              <div className="space-y-1">
                {card.weaknesses.map((weakness, index) => (
                  <div key={index} className="text-xs text-[#75715E] flex items-center">
                    <div className="w-1 h-1 bg-[#F92672] rounded-full mr-2" />
                    {weakness}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent News */}
          <div>
            <h4 className="text-sm font-semibold text-[#66D9EF] mb-2">Recent News</h4>
            <div className="space-y-1">
              {card.recentNews.map((news, index) => (
                <div key={index} className="text-xs text-[#75715E]">
                  • {news}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )

  const BattleCard = ({ battle }: { battle: MABattle }) => {
    const challengerPercentage = (battle.challengerVotes / battle.totalVotes) * 100
    const defenderPercentage = (battle.defenderVotes / battle.totalVotes) * 100

    return (
      <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#F8EFD6] mb-2">M&A Battle</h3>
          <div className="flex items-center justify-center gap-4 text-lg">
            <span className="text-[#A6E22E] font-semibold">{battle.challenger.companyName}</span>
            <Sword className="h-5 w-5 text-[#F92672]" />
            <span className="text-[#66D9EF] font-semibold">{battle.defender.companyName}</span>
          </div>
          <div className="text-sm text-[#75715E] mt-2">
            Time Left: {formatTimeLeft(battle.timeLeft)}
          </div>
        </div>

        {/* Battle Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-[#A6E22E]/10 rounded-lg border border-[#A6E22E]/30">
            <div className="text-lg font-bold text-[#A6E22E]">{battle.challengerVotes}</div>
            <div className="text-sm text-[#75715E]">{challengerPercentage.toFixed(1)}% votes</div>
            <div className="text-xs text-[#75715E] mt-1">
              Battle Power: {battle.challenger.battlePower}
            </div>
          </div>
          
          <div className="text-center p-4 bg-[#66D9EF]/10 rounded-lg border border-[#66D9EF]/30">
            <div className="text-lg font-bold text-[#66D9EF]">{battle.defenderVotes}</div>
            <div className="text-sm text-[#75715E]">{defenderPercentage.toFixed(1)}% votes</div>
            <div className="text-xs text-[#75715E] mt-1">
              Defense Rating: {battle.defender.defensiveRating}
            </div>
          </div>
        </div>

        {/* Vote Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#A6E22E]">{battle.challenger.companyName}</span>
            <span className="text-sm text-[#66D9EF]">{battle.defender.companyName}</span>
          </div>
          <div className="relative h-4 bg-[#272822] rounded-full overflow-hidden border border-[#75715E]/30">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#A6E22E] to-[#A6E22E]/80 transition-all duration-300"
              style={{ width: `${challengerPercentage}%` }}
            />
            <div 
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-[#66D9EF] to-[#66D9EF]/80 transition-all duration-300"
              style={{ width: `${defenderPercentage}%` }}
            />
          </div>
        </div>

        {/* Voting Interface */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={voteAmount}
              onChange={(e) => setVoteAmount(Number(e.target.value))}
              min={10}
              className="flex-1 px-3 py-2 bg-[#272822]/50 border border-[#75715E]/30 rounded-lg text-[#F8EFD6] font-mono focus:border-[#66D9EF]/50 focus:outline-none"
              placeholder="Vote amount"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onVote?.(battle.id, 'challenger', voteAmount)}
              className="bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822] font-semibold"
            >
              <Trophy className="h-4 w-4 mr-1" />
              Vote {battle.challenger.companyName}
            </Button>
            
            <Button
              onClick={() => onVote?.(battle.id, 'defender', voteAmount)}
              className="bg-gradient-to-r from-[#66D9EF] to-[#819AFF] hover:from-[#66D9EF]/80 hover:to-[#819AFF]/80 text-[#272822] font-semibold"
            >
              <Shield className="h-4 w-4 mr-1" />
              Vote {battle.defender.companyName}
            </Button>
          </div>

          <div className="text-center text-sm text-[#75715E]">
            Pot Size: {formatNumber(battle.potSize)} • {battle.participants} participants
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F92672] to-[#A6E22E] bg-clip-text text-transparent mb-4">
          M&A Battles
        </h1>
        <p className="text-lg text-[#75715E] max-w-2xl mx-auto">
          Tinder-style company matching for epic merger & acquisition battles. Swipe, challenge, and bet on corporate showdowns.
        </p>
      </motion.div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#272822]/50 p-1 rounded-lg border border-[#75715E]/30">
          <Button
            variant={!showBattles ? "default" : "ghost"}
            onClick={() => setShowBattles(false)}
            className={!showBattles ? "bg-[#A6E22E] text-[#272822]" : "text-[#75715E]"}
          >
            <Target className="h-4 w-4 mr-1" />
            Discover Companies
          </Button>
          <Button
            variant={showBattles ? "default" : "ghost"}
            onClick={() => setShowBattles(true)}
            className={showBattles ? "bg-[#F92672] text-[#F8EFD6]" : "text-[#75715E]"}
          >
            <Sword className="h-4 w-4 mr-1" />
            Active Battles
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showBattles ? (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            {/* Card Stack */}
            <div className="relative h-[600px] max-w-md mx-auto">
              {mockCards.slice(currentCardIndex, currentCardIndex + 3).map((card, index) => (
                <CompanyCard
                  key={card.id}
                  card={card}
                  isActive={index === 0}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-6">
              <Button
                onClick={handleSwipeLeft}
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-[#F92672] to-[#FD5C63] hover:from-[#F92672]/80 hover:to-[#FD5C63]/80 text-[#F8EFD6]"
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={() => setCurrentCardIndex((prev) => Math.max(0, prev - 1))}
                variant="outline"
                size="lg"
                className="w-12 h-12 rounded-full border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={handleSwipeRight}
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822]"
              >
                <Heart className="h-6 w-6" />
              </Button>
            </div>

            {/* Instructions */}
            <div className="text-center space-y-2">
              <p className="text-sm text-[#75715E]">
                <span className="text-[#F92672]">Swipe left</span> to pass • <span className="text-[#A6E22E]">Swipe right</span> to challenge
              </p>
              <p className="text-xs text-[#75715E]">
                Selected companies: {selectedCards.length}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="battles"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="space-y-6"
          >
            {mockBattles.map((battle) => (
              <BattleCard key={battle.id} battle={battle} />
            ))}

            {mockBattles.length === 0 && (
              <Card className="p-12 text-center bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
                <Sword className="h-12 w-12 text-[#75715E] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#F8EFD6] mb-2">No Active Battles</h3>
                <p className="text-[#75715E] mb-4">
                  Swipe on companies to create new M&A battles and start the action!
                </p>
                <Button
                  onClick={() => setShowBattles(false)}
                  className="bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822] font-semibold"
                >
                  Discover Companies
                </Button>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
