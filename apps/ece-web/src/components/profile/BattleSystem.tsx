'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sword, 
  Shield, 
  Crown, 
  Trophy, 
  Zap, 
  Target, 
  Activity, 
  Users, 
  Timer, 
  Play, 
  Pause, 
  SkipForward,
  RotateCcw,
  Eye,
  Share2,
  Download,
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  Flame,
  Lightbulb,
  Layers,
  BarChart3,
  Calendar,
  Clock,
  ChevronRight,
  Plus,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'

interface BattleCard {
  id: string
  name: string
  tier: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  power: number
  health: number
  maxHealth: number
  attack: number
  defense: number
  speed: number
  abilities: BattleAbility[]
  image: string
  rarity: number
  experience: number
  level: number
}

interface BattleAbility {
  id: string
  name: string
  description: string
  cost: number
  damage?: number
  healing?: number
  effect?: string
  cooldown: number
  currentCooldown: number
  type: 'attack' | 'defense' | 'special' | 'heal'
}

interface Battle {
  id: string
  type: 'ranked' | 'casual' | 'tournament' | 'guild' | 'ai'
  status: 'waiting' | 'active' | 'completed' | 'cancelled'
  participants: BattleParticipant[]
  currentTurn: number
  totalTurns: number
  startTime: Date
  endTime?: Date
  spectators: number
  prizePool: number
  rules: BattleRules
  history: BattleAction[]
}

interface BattleParticipant {
  id: string
  username: string
  avatar: string
  deck: BattleCard[]
  activeDeck: BattleCard[]
  health: number
  maxHealth: number
  energy: number
  maxEnergy: number
  rank: number
  winStreak: number
  isReady: boolean
}

interface BattleRules {
  maxCards: number
  turnTimeLimit: number
  maxTurns: number
  allowedTiers: string[]
  powerLimit: number
  specialRules: string[]
}

interface BattleAction {
  turn: number
  playerId: string
  action: 'play_card' | 'use_ability' | 'end_turn' | 'surrender'
  card?: BattleCard
  ability?: BattleAbility
  target?: string
  damage?: number
  healing?: number
  timestamp: Date
}

interface Tournament {
  id: string
  name: string
  description: string
  type: 'single_elimination' | 'double_elimination' | 'round_robin'
  status: 'registration' | 'active' | 'completed'
  participants: number
  maxParticipants: number
  prizePool: number
  entryFee: number
  startTime: Date
  rounds: TournamentRound[]
  winner?: string
}

interface TournamentRound {
  round: number
  matches: Battle[]
  completed: boolean
}

interface BattleSystemProps {
  className?: string
}

export function BattleSystem({ className = '' }: BattleSystemProps) {
  const [activeTab, setActiveTab] = useState<'arena' | 'decks' | 'tournaments' | 'history' | 'leaderboard'>('arena')
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null)
  const [isInBattle, setIsInBattle] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'ranked' | 'casual' | 'tournament'>('all')

  // Mock battle data
  const [userStats] = useState({
    rank: 1247,
    rating: 2156,
    winRate: 68.4,
    totalBattles: 89,
    wins: 61,
    losses: 28,
    currentStreak: 5,
    bestStreak: 12,
    favoriteCard: 'Tesla Motors Elite',
    totalEarnings: 12450
  })

  const [activeBattles] = useState<Battle[]>([
    {
      id: '1',
      type: 'ranked',
      status: 'waiting',
      participants: [
        {
          id: '1',
          username: 'CryptoKing',
          avatar: '/avatars/crypto-king.jpg',
          deck: [],
          activeDeck: [],
          health: 100,
          maxHealth: 100,
          energy: 10,
          maxEnergy: 10,
          rank: 1205,
          winStreak: 3,
          isReady: true
        }
      ],
      currentTurn: 0,
      totalTurns: 0,
      startTime: new Date(),
      spectators: 23,
      prizePool: 500,
      rules: {
        maxCards: 5,
        turnTimeLimit: 60,
        maxTurns: 20,
        allowedTiers: ['rare', 'epic', 'legendary'],
        powerLimit: 1000,
        specialRules: ['No healing cards']
      },
      history: []
    }
  ])

  const [tournaments] = useState<Tournament[]>([
    {
      id: '1',
      name: 'Summer Championship',
      description: 'The ultimate test of trading card mastery',
      type: 'single_elimination',
      status: 'registration',
      participants: 64,
      maxParticipants: 128,
      prizePool: 50000,
      entryFee: 500,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      rounds: []
    },
    {
      id: '2',
      name: 'Weekly Legends Cup',
      description: 'Fast-paced weekly competition',
      type: 'round_robin',
      status: 'active',
      participants: 32,
      maxParticipants: 32,
      prizePool: 10000,
      entryFee: 200,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      rounds: []
    }
  ])

  const [leaderboard] = useState([
    { rank: 1, username: 'BattleMaster', rating: 2850, wins: 245, winRate: 89.2 },
    { rank: 2, username: 'CardLegend', rating: 2720, wins: 198, winRate: 85.6 },
    { rank: 3, username: 'EliteTrader', rating: 2680, wins: 176, winRate: 82.1 },
    { rank: 4, username: 'TradingKing', rating: 2590, wins: 234, winRate: 78.9 },
    { rank: 5, username: 'DeckMaster', rating: 2545, wins: 167, winRate: 76.3 }
  ])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'common': return '#75715E'
      case 'rare': return '#66D9EF'
      case 'epic': return '#A6E22E'
      case 'legendary': return '#E6DB74'
      case 'mythic': return '#F92672'
      default: return '#75715E'
    }
  }

  const getBattleTypeIcon = (type: string) => {
    switch (type) {
      case 'ranked': return Trophy
      case 'casual': return Users
      case 'tournament': return Crown
      case 'guild': return Shield
      case 'ai': return Target
      default: return Sword
    }
  }

  const handleJoinBattle = (battleId: string) => {
    setIsInBattle(true)
    setSelectedBattle(activeBattles.find(b => b.id === battleId) || null)
  }

  const handleCreateBattle = () => {
    // Logic to create a new battle
    console.log('Creating new battle...')
  }

  const handleJoinTournament = (tournamentId: string) => {
    // Logic to join tournament
    console.log('Joining tournament:', tournamentId)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard variant="dark" className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2 flex items-center">
                <Sword className="w-6 h-6 mr-3 text-[#F92672]" />
                Battle Arena
              </h2>
              <p className="text-[#75715E]">
                Engage in strategic card battles and compete for glory and rewards
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="accent" onClick={handleCreateBattle}>
                <Plus className="w-4 h-4 mr-2" />
                Create Battle
              </Button>
              <Button variant="ghost">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* User Battle Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <GlassCard variant="dark" className="p-6">
          <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Your Battle Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E] mb-1">{userStats.rank}</div>
              <div className="text-xs text-[#75715E]">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF] mb-1">{userStats.rating}</div>
              <div className="text-xs text-[#75715E]">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6DB74] mb-1">{userStats.winRate}%</div>
              <div className="text-xs text-[#75715E]">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F92672] mb-1">{userStats.currentStreak}</div>
              <div className="text-xs text-[#75715E]">Win Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E] mb-1">{userStats.totalBattles}</div>
              <div className="text-xs text-[#75715E]">Total Battles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF] mb-1">{userStats.totalEarnings}</div>
              <div className="text-xs text-[#75715E]">Earnings (ECE)</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GlassCard variant="dark" className="p-2">
          <div className="flex space-x-1">
            {[
              { id: 'arena', label: 'Arena', icon: Sword },
              { id: 'decks', label: 'Decks', icon: Layers },
              { id: 'tournaments', label: 'Tournaments', icon: Crown },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
            ].map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 flex-1 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F92672]/20 to-[#A6E22E]/20 text-[#F8EFD6] border border-[#F92672]/30'
                      : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/30'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#F92672]' : ''}`} />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Arena Tab */}
        {activeTab === 'arena' && (
          <motion.div
            key="arena"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Active Battles */}
            <GlassCard variant="dark" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#F8EFD6]">Active Battles</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#75715E]" />
                    <Input
                      placeholder="Search battles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="ghost">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {activeBattles.map((battle) => {
                  const BattleIcon = getBattleTypeIcon(battle.type)
                  
                  return (
                    <motion.div
                      key={battle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border border-[#75715E]/30 hover:border-[#A6E22E]/50 transition-all cursor-pointer"
                      onClick={() => handleJoinBattle(battle.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <BattleIcon className="w-6 h-6 text-[#F92672]" />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge 
                                variant="secondary" 
                                className={`bg-${battle.type === 'ranked' ? '[#F92672]' : '[#66D9EF]'}/20 text-${battle.type === 'ranked' ? '[#F92672]' : '[#66D9EF]'} border-${battle.type === 'ranked' ? '[#F92672]' : '[#66D9EF]'}/30`}
                              >
                                {battle.type.charAt(0).toUpperCase() + battle.type.slice(1)}
                              </Badge>
                              <Badge variant="secondary" className="bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30">
                                {battle.status.charAt(0).toUpperCase() + battle.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-sm text-[#75715E]">
                              {battle.participants.length} participant(s) • {battle.spectators} watching • {battle.prizePool} ECE prize
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-[#F8EFD6]">{battle.prizePool} ECE</div>
                            <div className="text-xs text-[#75715E]">Prize Pool</div>
                          </div>
                          <Button>
                            Join Battle
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>

            {/* Quick Match */}
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Quick Match</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="accent" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={handleCreateBattle}
                >
                  <Trophy className="w-6 h-6" />
                  <span>Ranked Match</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={handleCreateBattle}
                >
                  <Users className="w-6 h-6" />
                  <span>Casual Match</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={handleCreateBattle}
                >
                  <Target className="w-6 h-6" />
                  <span>AI Practice</span>
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <motion.div
            key="tournaments"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Tournaments</h3>
              
              <div className="space-y-4">
                {tournaments.map((tournament) => (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border border-[#75715E]/30 hover:border-[#E6DB74]/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <Crown className="w-5 h-5 text-[#E6DB74]" />
                          <h4 className="font-semibold text-[#F8EFD6]">{tournament.name}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              tournament.status === 'registration' 
                                ? 'bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30'
                                : tournament.status === 'active'
                                ? 'bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30'
                                : 'bg-[#75715E]/20 text-[#75715E] border-[#75715E]/30'
                            }`}
                          >
                            {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-[#75715E] text-sm mb-3">{tournament.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-[#A6E22E] font-medium">{tournament.participants}/{tournament.maxParticipants}</div>
                            <div className="text-[#75715E]">Participants</div>
                          </div>
                          <div>
                            <div className="text-[#E6DB74] font-medium">{tournament.prizePool} ECE</div>
                            <div className="text-[#75715E]">Prize Pool</div>
                          </div>
                          <div>
                            <div className="text-[#66D9EF] font-medium">{tournament.entryFee} ECE</div>
                            <div className="text-[#75715E]">Entry Fee</div>
                          </div>
                          <div>
                            <div className="text-[#F92672] font-medium">{tournament.startTime.toLocaleDateString()}</div>
                            <div className="text-[#75715E]">Start Date</div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button 
                         
                          disabled={tournament.status !== 'registration'}
                          onClick={() => handleJoinTournament(tournament.id)}
                        >
                          {tournament.status === 'registration' ? 'Join' : 'View'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Global Leaderboard</h3>
              
              <div className="space-y-2">
                {leaderboard.map((player, index) => (
                  <motion.div
                    key={player.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      player.rank <= 3 
                        ? 'bg-gradient-to-r from-[#E6DB74]/20 to-[#F92672]/10 border border-[#E6DB74]/30'
                        : 'bg-[#272822]/30 border border-[#75715E]/30'
                    } hover:border-[#A6E22E]/50 transition-all`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        player.rank === 1 ? 'bg-[#E6DB74] text-[#272822]' :
                        player.rank === 2 ? 'bg-[#75715E] text-[#F8EFD6]' :
                        player.rank === 3 ? 'bg-[#F92672] text-[#F8EFD6]' :
                        'bg-[#66D9EF]/20 text-[#66D9EF]'
                      }`}>
                        {player.rank <= 3 ? (
                          <Crown className="w-4 h-4" />
                        ) : (
                          player.rank
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#F8EFD6]">{player.username}</div>
                        <div className="text-sm text-[#75715E]">{player.wins} wins • {player.winRate}% win rate</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#A6E22E]">{player.rating}</div>
                      <div className="text-sm text-[#75715E]">Rating</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
