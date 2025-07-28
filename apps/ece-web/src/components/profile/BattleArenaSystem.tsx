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
  Users,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Filter,
  Search,
  Plus,
  Settings,
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  Flame,
  Sparkles,
  Coins,
  Timer,
  UserCheck,
  Swords,
  ChevronRight,
  CircleDot,
  Ban,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'

interface Battle {
  id: string
  title: string
  type: 'ranked' | 'casual' | 'tournament' | 'guild'
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
  creator: {
    name: string
    avatar: string
    level: number
    rating: number
  }
  opponent?: {
    name: string
    avatar: string
    level: number
    rating: number
  }
  stakes: {
    type: 'ece' | 'cards' | 'points'
    amount: number
    items?: string[]
  }
  format: string
  duration: string
  prize: string
  spectators: number
  createdAt: Date
  startTime?: Date
  endTime?: Date
}

interface BattleStats {
  totalBattles: number
  wins: number
  losses: number
  draws: number
  winRate: number
  currentStreak: number
  longestStreak: number
  rating: number
  rank: string
  eceEarned: number
  cardsWon: number
}

interface Tournament {
  id: string
  name: string
  type: 'single_elimination' | 'round_robin' | 'swiss'
  status: 'registration' | 'in_progress' | 'completed'
  participants: number
  maxParticipants: number
  entryFee: number
  prizePool: number
  startDate: Date
  format: string
  sponsor?: string
}

export function BattleArenaSystem() {
  const [activeTab, setActiveTab] = useState('battles')
  const [selectedBattleFormat, setSelectedBattleFormat] = useState('standard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const [playerStats] = useState<BattleStats>({
    totalBattles: 156,
    wins: 89,
    losses: 52,
    draws: 15,
    winRate: 57.1,
    currentStreak: 3,
    longestStreak: 12,
    rating: 1847,
    rank: 'Gold III',
    eceEarned: 2450,
    cardsWon: 23
  })

  const [activeBattles] = useState<Battle[]>([
    {
      id: '1',
      title: 'Epic Showdown',
      type: 'ranked',
      status: 'waiting',
      creator: {
        name: 'DragonSlayer',
        avatar: '/avatars/dragon.jpg',
        level: 45,
        rating: 1923
      },
      stakes: {
        type: 'ece',
        amount: 100
      },
      format: 'Standard (Best of 3)',
      duration: '15 minutes',
      prize: '200 ECE + Rating Points',
      spectators: 0,
      createdAt: new Date('2025-07-05T10:30:00')
    },
    {
      id: '2',
      title: 'Legendary Card Duel',
      type: 'casual',
      status: 'in_progress',
      creator: {
        name: 'CardMaster',
        avatar: '/avatars/master.jpg',
        level: 38,
        rating: 1654
      },
      opponent: {
        name: 'TechWizard',
        avatar: '/avatars/wizard.jpg',
        level: 42,
        rating: 1789
      },
      stakes: {
        type: 'cards',
        amount: 1,
        items: ['Mythic Tech Core', 'Rare Cyber Knight']
      },
      format: 'Classic (Single Match)',
      duration: '20 minutes',
      prize: 'Winner takes selected cards',
      spectators: 15,
      createdAt: new Date('2025-07-05T09:45:00'),
      startTime: new Date('2025-07-05T10:00:00')
    },
    {
      id: '3',
      title: 'Guild Championship',
      type: 'guild',
      status: 'waiting',
      creator: {
        name: 'GuildLeader',
        avatar: '/avatars/leader.jpg',
        level: 52,
        rating: 2156
      },
      stakes: {
        type: 'points',
        amount: 500
      },
      format: 'Tournament (Elimination)',
      duration: '45 minutes',
      prize: 'Guild points + Title',
      spectators: 42,
      createdAt: new Date('2025-07-05T08:15:00')
    }
  ])

  const [tournaments] = useState<Tournament[]>([
    {
      id: '1',
      name: 'Summer Championship 2025',
      type: 'single_elimination',
      status: 'registration',
      participants: 247,
      maxParticipants: 512,
      entryFee: 50,
      prizePool: 25600,
      startDate: new Date('2025-07-15T18:00:00'),
      format: 'Standard + Draft',
      sponsor: 'ECE Platform'
    },
    {
      id: '2',
      name: 'Weekly Grind',
      type: 'swiss',
      status: 'in_progress',
      participants: 128,
      maxParticipants: 128,
      entryFee: 25,
      prizePool: 3200,
      startDate: new Date('2025-07-05T12:00:00'),
      format: 'Standard'
    },
    {
      id: '3',
      name: 'Newcomer Cup',
      type: 'round_robin',
      status: 'registration',
      participants: 45,
      maxParticipants: 64,
      entryFee: 10,
      prizePool: 640,
      startDate: new Date('2025-07-08T14:00:00'),
      format: 'Beginner Friendly'
    }
  ])

  const battleFormats = [
    { id: 'standard', name: 'Standard', description: 'Best of 3, 15min timer' },
    { id: 'blitz', name: 'Blitz', description: 'Single match, 5min timer' },
    { id: 'classic', name: 'Classic', description: 'Best of 5, 30min timer' },
    { id: 'draft', name: 'Draft', description: 'Pick cards live, 20min' },
    { id: 'sealed', name: 'Sealed', description: 'Limited card pool, 25min' }
  ]

  const tabs = [
    { id: 'battles', label: 'Active Battles', icon: Swords },
    { id: 'create', label: 'Create Battle', icon: Plus },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'history', label: 'Battle History', icon: Activity },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'replays', label: 'Replays', icon: Eye }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-[#E6DB74]'
      case 'in_progress': return 'text-[#A6E22E]'
      case 'completed': return 'text-[#66D9EF]'
      case 'cancelled': return 'text-[#F92672]'
      default: return 'text-[#75715E]'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return Clock
      case 'in_progress': return Play
      case 'completed': return CheckCircle
      case 'cancelled': return Ban
      default: return CircleDot
    }
  }

  const filteredBattles = activeBattles.filter(battle => {
    const matchesSearch = battle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         battle.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || battle.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard variant="dark" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2">Battle Arena</h2>
              <p className="text-[#75715E]">Compete with other traders in strategic card battles</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-[#75715E]">Current Rating</div>
                <div className="text-2xl font-bold text-[#A6E22E]">{playerStats.rating}</div>
                <div className="text-sm text-[#66D9EF]">{playerStats.rank}</div>
              </div>
              
              <Button variant="gradient">
                <Sword className="w-4 h-4 mr-2" />
                Quick Battle
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF]">{playerStats.totalBattles}</div>
              <div className="text-sm text-[#75715E]">Battles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E]">{playerStats.winRate}%</div>
              <div className="text-sm text-[#75715E]">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6DB74]">{playerStats.currentStreak}</div>
              <div className="text-sm text-[#75715E]">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F92672]">{playerStats.eceEarned}</div>
              <div className="text-sm text-[#75715E]">ECE Won</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#819AFF]">{playerStats.cardsWon}</div>
              <div className="text-sm text-[#75715E]">Cards Won</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#3EBA7C]">{playerStats.longestStreak}</div>
              <div className="text-sm text-[#75715E]">Best Streak</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <GlassCard variant="dark" className="p-2">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 text-[#F8EFD6] border border-[#A6E22E]/30'
                      : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/30'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#A6E22E]' : ''}`} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Active Battles Tab */}
          {activeTab === 'battles' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <GlassCard variant="dark" className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#75715E]" />
                      <Input
                        placeholder="Search battles or players..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {['all', 'ranked', 'casual', 'tournament', 'guild'].map((type) => (
                      <Button
                        key={type}
                        variant={filterType === type ? 'accent' : 'ghost'}
                       
                        onClick={() => setFilterType(type)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Battles List */}
              <div className="space-y-4">
                {filteredBattles.map((battle) => {
                  const StatusIcon = getStatusIcon(battle.status)
                  
                  return (
                    <GlassCard key={battle.id} variant="dark" className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-[#F8EFD6]">{battle.title}</h3>
                            <Badge variant={battle.type === 'ranked' ? 'destructive' : 'secondary'}>
                              {battle.type.charAt(0).toUpperCase() + battle.type.slice(1)}
                            </Badge>
                            <div className={`flex items-center space-x-1 ${getStatusColor(battle.status)}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {battle.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-[#75715E]">Creator: </span>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-6 h-6 bg-[#A6E22E]/20 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-[#A6E22E]">{battle.creator.level}</span>
                                </div>
                                <span className="text-[#F8EFD6] font-medium">{battle.creator.name}</span>
                                <span className="text-sm text-[#75715E]">({battle.creator.rating})</span>
                              </div>
                            </div>

                            {battle.opponent && (
                              <div>
                                <span className="text-sm text-[#75715E]">Opponent: </span>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="w-6 h-6 bg-[#F92672]/20 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-[#F92672]">{battle.opponent.level}</span>
                                  </div>
                                  <span className="text-[#F8EFD6] font-medium">{battle.opponent.name}</span>
                                  <span className="text-sm text-[#75715E]">({battle.opponent.rating})</span>
                                </div>
                              </div>
                            )}

                            <div>
                              <span className="text-sm text-[#75715E]">Stakes: </span>
                              <div className="mt-1">
                                {battle.stakes.type === 'ece' && (
                                  <span className="text-[#E6DB74] font-medium">{battle.stakes.amount} ECE</span>
                                )}
                                {battle.stakes.type === 'cards' && (
                                  <div>
                                    <span className="text-[#66D9EF] font-medium">{battle.stakes.amount} Card(s)</span>
                                    {battle.stakes.items && (
                                      <div className="text-xs text-[#75715E] mt-1">
                                        {battle.stakes.items.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {battle.stakes.type === 'points' && (
                                  <span className="text-[#819AFF] font-medium">{battle.stakes.amount} Points</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-[#75715E]">Format: </span>
                              <span className="text-[#F8EFD6]">{battle.format}</span>
                            </div>
                            <div>
                              <span className="text-[#75715E]">Duration: </span>
                              <span className="text-[#F8EFD6]">{battle.duration}</span>
                            </div>
                            <div>
                              <span className="text-[#75715E]">Prize: </span>
                              <span className="text-[#F8EFD6]">{battle.prize}</span>
                            </div>
                            <div>
                              <span className="text-[#75715E]">Spectators: </span>
                              <span className="text-[#F8EFD6]">{battle.spectators}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          {battle.status === 'waiting' && !battle.opponent && (
                            <Button variant="gradient">
                              <Sword className="w-4 h-4 mr-2" />
                              Join Battle
                            </Button>
                          )}
                          
                          {battle.status === 'in_progress' && (
                            <Button variant="gradient">
                              <Eye className="w-4 h-4 mr-2" />
                              Spectate
                            </Button>
                          )}
                          
                          {battle.status === 'waiting' && battle.opponent && (
                            <Button variant="ghost">
                              <Eye className="w-4 h-4 mr-2" />
                              Watch
                            </Button>
                          )}
                          
                          <Button variant="ghost">
                            <Info className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  )
                })}
              </div>
            </div>
          )}

          {/* Create Battle Tab */}
          {activeTab === 'create' && (
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Create New Battle</h3>
              
              <div className="space-y-6">
                {/* Battle Type */}
                <div>
                  <label className="block text-[#F8EFD6] mb-3">Battle Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Ranked', 'Casual', 'Private', 'Tournament'].map((type) => (
                      <Button key={type} variant="ghost" className="h-16 flex-col space-y-1">
                        <span className="text-sm font-medium">{type}</span>
                        <span className="text-xs text-[#75715E]">
                          {type === 'Ranked' && 'Affects rating'}
                          {type === 'Casual' && 'For fun'}
                          {type === 'Private' && 'Invite only'}
                          {type === 'Tournament' && 'Bracket style'}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Battle Format */}
                <div>
                  <label className="block text-[#F8EFD6] mb-3">Battle Format</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {battleFormats.map((format) => (
                      <motion.button
                        key={format.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedBattleFormat(format.id)}
                        className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                          selectedBattleFormat === format.id
                            ? 'bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 border-[#A6E22E]/30'
                            : 'bg-[#272822]/30 border-[#75715E]/30 hover:border-[#75715E]/50'
                        }`}
                      >
                        <div className="font-medium text-[#F8EFD6] mb-1">{format.name}</div>
                        <div className="text-sm text-[#75715E]">{format.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Stakes and Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#F8EFD6] mb-3">Stakes</label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Button variant="ghost">ECE Tokens</Button>
                        <Input placeholder="Amount" className="flex-1" />
                      </div>
                      <Button variant="ghost" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Card Stakes
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#F8EFD6] mb-3">Battle Settings</label>
                    <div className="space-y-3">
                      <Input placeholder="Battle Title" />
                      <div className="flex space-x-3">
                        <Input placeholder="Time Limit" className="flex-1" />
                        <Button variant="ghost">Private</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Button */}
                <div className="flex justify-center pt-4">
                  <Button variant="gradient" size="lg">
                    <Sword className="w-5 h-5 mr-2" />
                    Create Battle
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Tournaments Tab */}
          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              {tournaments.map((tournament) => (
                <GlassCard key={tournament.id} variant="dark" className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-[#F8EFD6]">{tournament.name}</h3>
                        <Badge variant={tournament.status === 'registration' ? 'default' : 'secondary'}>
                          {tournament.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {tournament.sponsor && (
                          <Badge variant="outline">Sponsored by {tournament.sponsor}</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-[#75715E]">Participants</span>
                          <div className="text-[#F8EFD6] font-medium">
                            {tournament.participants} / {tournament.maxParticipants}
                          </div>
                          <Progress 
                            value={(tournament.participants / tournament.maxParticipants) * 100} 
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <span className="text-sm text-[#75715E]">Entry Fee</span>
                          <div className="text-[#E6DB74] font-medium">{tournament.entryFee} ECE</div>
                        </div>
                        <div>
                          <span className="text-sm text-[#75715E]">Prize Pool</span>
                          <div className="text-[#A6E22E] font-medium">{tournament.prizePool} ECE</div>
                        </div>
                        <div>
                          <span className="text-sm text-[#75715E]">Start Date</span>
                          <div className="text-[#F8EFD6] font-medium">
                            {tournament.startDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-[#75715E]">Format: </span>
                        <span className="text-[#F8EFD6]">{tournament.format}</span>
                        <span className="text-[#75715E]">Type: </span>
                        <span className="text-[#F8EFD6]">{tournament.type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {tournament.status === 'registration' && (
                        <Button variant="gradient">
                          <Trophy className="w-4 h-4 mr-2" />
                          Register
                        </Button>
                      )}
                      
                      {tournament.status === 'in_progress' && (
                        <Button variant="gradient">
                          <Eye className="w-4 h-4 mr-2" />
                          View Bracket
                        </Button>
                      )}
                      
                      <Button variant="ghost">
                        <Info className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Battle Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Win/Loss Statistics */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Battle Performance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#A6E22E] mb-2">{playerStats.wins}</div>
                    <div className="text-[#75715E]">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#F92672] mb-2">{playerStats.losses}</div>
                    <div className="text-[#75715E]">Losses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#E6DB74] mb-2">{playerStats.draws}</div>
                    <div className="text-[#75715E]">Draws</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#75715E]/30">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#66D9EF]">{playerStats.winRate}%</div>
                      <div className="text-sm text-[#75715E]">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#819AFF]">{playerStats.rating}</div>
                      <div className="text-sm text-[#75715E]">Current Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#3EBA7C]">{playerStats.currentStreak}</div>
                      <div className="text-sm text-[#75715E]">Current Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#F92672]">{playerStats.longestStreak}</div>
                      <div className="text-sm text-[#75715E]">Longest Streak</div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Ranking Progress */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Ranking Progress</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-8 h-8 text-[#E6DB74]" />
                    <div>
                      <div className="text-xl font-bold text-[#F8EFD6]">{playerStats.rank}</div>
                      <div className="text-sm text-[#75715E]">Current Rank</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#A6E22E]">{playerStats.rating}</div>
                    <div className="text-sm text-[#75715E]">Rating Points</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#75715E]">Progress to Gold II</span>
                    <span className="text-[#F8EFD6]">1847 / 1900</span>
                  </div>
                  <Progress value={97} className="h-3" />
                  <div className="text-center text-sm text-[#75715E]">53 points to next rank</div>
                </div>
              </GlassCard>

              {/* Earnings Summary */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Battle Earnings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Coins className="w-12 h-12 text-[#E6DB74] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-[#E6DB74]">{playerStats.eceEarned}</div>
                    <div className="text-sm text-[#75715E]">ECE Tokens Earned</div>
                  </div>
                  <div className="text-center">
                    <Star className="w-12 h-12 text-[#66D9EF] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-[#66D9EF]">{playerStats.cardsWon}</div>
                    <div className="text-sm text-[#75715E]">Cards Won</div>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-[#A6E22E] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-[#A6E22E]">5</div>
                    <div className="text-sm text-[#75715E]">Tournament Wins</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
