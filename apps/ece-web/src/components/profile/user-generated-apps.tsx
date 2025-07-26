'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User,
  Zap,
  Star,
  Crown,
  Gem,
  Award,
  Code,
  Github,
  Globe,
  Download,
  Heart,
  Share2,
  Filter,
  Grid3X3,
  List,
  Trophy,
  Target,
  Gauge,
  Sparkles,
  Eye,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Progress } from '../ui/progress'

interface UserGeneratedApp {
  id: string
  name: string
  description: string
  template: string
  category: 'web' | 'mobile' | 'desktop' | 'backend' | 'ai' | 'blockchain'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  battleStats: {
    power: number
    speed: number
    innovation: number
    scalability: number
  }
  techStack: string[]
  features: string[]
  specialAbilities: string[]
  createdAt: Date
  updatedAt: Date
  githubRepo?: string
  vercelUrl?: string
  downloadUrl?: string
  thumbnail: string
  isPublic: boolean
  likes: number
  views: number
  downloads: number
  tradingValue: number
  evolutionLevel: number
  xpEarned: number
}

interface UserAppStats {
  totalApps: number
  totalXP: number
  userLevel: number
  appsCreated: number
  totalLikes: number
  totalViews: number
  averageQuality: number
  rarityDistribution: Record<string, number>
  categoryExpertise: Record<string, number>
  achievements: Achievement[]
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlockedAt: Date
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface UserGeneratedAppsProfileProps {
  userId: string
  className?: string
}

// Mock data for demonstration
const mockUserApps: UserGeneratedApp[] = [
  {
    id: 'user_app_001',
    name: 'Personal Portfolio',
    description: 'Modern portfolio website with 3D animations and glassmorphism effects',
    template: 'Landing Page',
    category: 'web',
    rarity: 'epic',
    battleStats: { power: 85, speed: 92, innovation: 78, scalability: 70 },
    techStack: ['Next.js', 'TypeScript', 'Spline', 'Framer Motion'],
    features: ['3D Integration', 'Dark Mode', 'Responsive Design', 'SEO Optimized'],
    specialAbilities: ['Lightning Fast Loading', 'SEO Mastery', 'Responsive Adaptation'],
    createdAt: new Date('2024-01-10T14:30:00'),
    updatedAt: new Date('2024-01-10T15:45:00'),
    githubRepo: 'https://github.com/user/portfolio',
    vercelUrl: 'https://my-portfolio.vercel.app',
    downloadUrl: '/downloads/portfolio.zip',
    thumbnail: '/api/apps/user_app_001/thumbnail',
    isPublic: true,
    likes: 42,
    views: 187,
    downloads: 23,
    tradingValue: 850,
    evolutionLevel: 2,
    xpEarned: 340
  },
  {
    id: 'user_app_002',
    name: 'Task Manager Pro',
    description: 'Advanced task management application with team collaboration features',
    template: 'Web Application',
    category: 'web',
    rarity: 'legendary',
    battleStats: { power: 94, speed: 88, innovation: 92, scalability: 96 },
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
    features: ['Real-time Collaboration', 'Advanced Analytics', 'Mobile App', 'API Integration'],
    specialAbilities: ['Infinite Scalability', 'Real-time Processing', 'Team Synchronization', 'Analytics Dashboard'],
    createdAt: new Date('2024-01-05T09:15:00'),
    updatedAt: new Date('2024-01-12T16:20:00'),
    githubRepo: 'https://github.com/user/task-manager-pro',
    vercelUrl: 'https://task-manager-pro.vercel.app',
    downloadUrl: '/downloads/task-manager.zip',
    thumbnail: '/api/apps/user_app_002/thumbnail',
    isPublic: true,
    likes: 156,
    views: 834,
    downloads: 67,
    tradingValue: 1250,
    evolutionLevel: 3,
    xpEarned: 520
  },
  {
    id: 'user_app_003',
    name: 'AI Chat Bot',
    description: 'Intelligent chatbot with natural language processing capabilities',
    template: 'AI Service',
    category: 'ai',
    rarity: 'legendary',
    battleStats: { power: 98, speed: 76, innovation: 99, scalability: 85 },
    techStack: ['Python', 'FastAPI', 'OpenAI', 'React'],
    features: ['Natural Language Processing', 'Context Awareness', 'Multi-language', 'Voice Support'],
    specialAbilities: ['Machine Learning Power', 'Natural Language Processing', 'Context Memory', 'Multi-modal Understanding'],
    createdAt: new Date('2024-01-08T11:00:00'),
    updatedAt: new Date('2024-01-08T14:30:00'),
    githubRepo: 'https://github.com/user/ai-chatbot',
    thumbnail: '/api/apps/user_app_003/thumbnail',
    isPublic: false,
    likes: 89,
    views: 456,
    downloads: 34,
    tradingValue: 1680,
    evolutionLevel: 4,
    xpEarned: 780
  },
  {
    id: 'user_app_004',
    name: 'Mobile Crypto Tracker',
    description: 'React Native app for tracking cryptocurrency portfolios with real-time updates',
    template: 'Mobile App',
    category: 'mobile',
    rarity: 'rare',
    battleStats: { power: 78, speed: 85, innovation: 72, scalability: 68 },
    techStack: ['React Native', 'Redux', 'CoinGecko API', 'AsyncStorage'],
    features: ['Real-time Prices', 'Portfolio Tracking', 'Price Alerts', 'Dark Mode'],
    specialAbilities: ['Cross Platform Unity', 'Real-time Data Sync', 'Push Notifications'],
    createdAt: new Date('2024-01-12T10:20:00'),
    updatedAt: new Date('2024-01-12T12:45:00'),
    githubRepo: 'https://github.com/user/crypto-tracker',
    thumbnail: '/api/apps/user_app_004/thumbnail',
    isPublic: true,
    likes: 67,
    views: 298,
    downloads: 45,
    tradingValue: 720,
    evolutionLevel: 1,
    xpEarned: 180
  }
]

const mockUserStats: UserAppStats = {
  totalApps: 4,
  totalXP: 1820,
  userLevel: 12,
  appsCreated: 4,
  totalLikes: 354,
  totalViews: 1775,
  averageQuality: 87.5,
  rarityDistribution: {
    common: 0,
    rare: 25,
    epic: 25,
    legendary: 50
  },
  categoryExpertise: {
    web: 50,
    mobile: 25,
    ai: 25,
    backend: 40,
    desktop: 0,
    blockchain: 10
  },
  achievements: [
    {
      id: 'first_app',
      name: 'First Creation',
      description: 'Generated your first application',
      icon: <Star className="w-5 h-5" />,
      unlockedAt: new Date('2024-01-05T09:15:00'),
      rarity: 'bronze'
    },
    {
      id: 'legendary_creator',
      name: 'Legendary Creator',
      description: 'Created a legendary rarity application',
      icon: <Crown className="w-5 h-5" />,
      unlockedAt: new Date('2024-01-05T16:20:00'),
      rarity: 'gold'
    },
    {
      id: 'ai_master',
      name: 'AI Master',
      description: 'Specialized in AI application development',
      icon: <Zap className="w-5 h-5" />,
      unlockedAt: new Date('2024-01-08T14:30:00'),
      rarity: 'platinum'
    }
  ]
}

export function UserGeneratedAppsProfile({ userId, className }: UserGeneratedAppsProfileProps) {
  const [userApps, setUserApps] = useState<UserGeneratedApp[]>(mockUserApps)
  const [userStats, setUserStats] = useState<UserAppStats>(mockUserStats)
  const [filteredApps, setFilteredApps] = useState<UserGeneratedApp[]>(mockUserApps)
  const [selectedApp, setSelectedApp] = useState<UserGeneratedApp | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterRarity, setFilterRarity] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')

  // Filter and sort logic
  useEffect(() => {
    let filtered = userApps.filter(app => {
      const matchesRarity = filterRarity === 'all' || app.rarity === filterRarity
      const matchesCategory = filterCategory === 'all' || app.category === filterCategory
      return matchesRarity && matchesCategory
    })

    // Sort apps
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rarity':
          const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 }
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]
        case 'likes':
          return b.likes - a.likes
        case 'tradingValue':
          return b.tradingValue - a.tradingValue
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredApps(filtered)
  }, [userApps, filterRarity, filterCategory, sortBy])

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30',
      rare: 'text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30',
      epic: 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30',
      legendary: 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getRarityIcon = (rarity: string) => {
    const icons = {
      common: Star,
      rare: Gem,
      epic: Crown,
      legendary: Award
    }
    const IconComponent = icons[rarity as keyof typeof icons] || Star
    return <IconComponent className="w-4 h-4" />
  }

  const getAchievementColor = (rarity: string) => {
    const colors = {
      bronze: 'text-[#CD7F32] bg-[#CD7F32]/20',
      silver: 'text-[#C0C0C0] bg-[#C0C0C0]/20',
      gold: 'text-[#FFD700] bg-[#FFD700]/20',
      platinum: 'text-[#E5E4E2] bg-[#E5E4E2]/20'
    }
    return colors[rarity as keyof typeof colors] || colors.bronze
  }

  const calculateOverallScore = (app: UserGeneratedApp) => {
    return Math.round(Object.values(app.battleStats).reduce((sum, stat) => sum + stat, 0) / 4)
  }

  const getStatIcon = (statName: string) => {
    const icons = {
      power: Target,
      speed: Gauge,
      innovation: Sparkles,
      scalability: TrendingUp
    }
    const IconComponent = icons[statName as keyof typeof icons] || Star
    return <IconComponent className="w-4 h-4" />
  }

  const calculateLevelProgress = () => {
    const currentLevelXP = userStats.userLevel * 100
    const nextLevelXP = (userStats.userLevel + 1) * 100
    const progress = ((userStats.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-[#F8EFD6]">My Generated Apps</h2>
                <Badge className="bg-[#66D9EF]/20 text-[#66D9EF]">
                  Level {userStats.userLevel}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-4 text-sm text-[#75715E]">
                  <span>{userStats.totalApps} Apps Created</span>
                  <span>•</span>
                  <span>{userStats.totalXP.toLocaleString()} XP</span>
                  <span>•</span>
                  <span>{userStats.totalLikes} Total Likes</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-[#75715E] text-sm">Level Progress:</span>
                  <div className="flex-1 max-w-48">
                    <Progress value={calculateLevelProgress()} className="h-2" />
                  </div>
                  <span className="text-[#66D9EF] text-sm font-mono">
                    {Math.round(calculateLevelProgress())}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-[#F92672] mb-1">
              {userStats.averageQuality}%
            </div>
            <div className="text-[#75715E] text-sm">Average Quality</div>
          </div>
        </div>
      </GlassCard>

      {/* Statistics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-[#272822]/50">
          <TabsTrigger value="overview" className="text-[#F8EFD6]">Overview</TabsTrigger>
          <TabsTrigger value="apps" className="text-[#F8EFD6]">My Apps</TabsTrigger>
          <TabsTrigger value="stats" className="text-[#F8EFD6]">Statistics</TabsTrigger>
          <TabsTrigger value="achievements" className="text-[#F8EFD6]">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard variant="dark" className="p-4 text-center">
              <Code className="w-8 h-8 text-[#66D9EF] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#F8EFD6]">{userStats.totalApps}</div>
              <div className="text-[#75715E] text-sm">Apps Created</div>
            </GlassCard>

            <GlassCard variant="dark" className="p-4 text-center">
              <Heart className="w-8 h-8 text-[#F92672] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#F8EFD6]">{userStats.totalLikes}</div>
              <div className="text-[#75715E] text-sm">Total Likes</div>
            </GlassCard>

            <GlassCard variant="dark" className="p-4 text-center">
              <Eye className="w-8 h-8 text-[#A6E22E] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#F8EFD6]">{userStats.totalViews.toLocaleString()}</div>
              <div className="text-[#75715E] text-sm">Total Views</div>
            </GlassCard>

            <GlassCard variant="dark" className="p-4 text-center">
              <Trophy className="w-8 h-8 text-[#E6DB74] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#F8EFD6]">{userStats.achievements.length}</div>
              <div className="text-[#75715E] text-sm">Achievements</div>
            </GlassCard>
          </div>

          {/* Recent Apps */}
          <GlassCard variant="dark" className="p-6">
            <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Recent Applications</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {userApps.slice(0, 4).map((app) => (
                <motion.div
                  key={app.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedApp(app)}
                >
                  <GlassCard variant="dark" className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-[#F8EFD6] font-semibold">{app.name}</h4>
                        <p className="text-[#75715E] text-sm">{app.template}</p>
                      </div>
                      <Badge className={getRarityColor(app.rarity)}>
                        {getRarityIcon(app.rarity)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-[#75715E]">
                      <span>{app.likes} likes</span>
                      <span>{app.views} views</span>
                      <span className="text-[#66D9EF]">{app.tradingValue} ECE</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Apps Tab */}
        <TabsContent value="apps" className="space-y-6">
          {/* Filters and Controls */}
          <GlassCard variant="dark" className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                 
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[#F92672] text-white' : 'text-[#75715E]'}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                 
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[#F92672] text-white' : 'text-[#75715E]'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Select value={filterRarity} onValueChange={setFilterRarity}>
                <SelectTrigger className="w-32 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Latest First</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="tradingValue">Trading Value</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </GlassCard>

          {/* Apps Grid/List */}
          <GlassCard variant="dark" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#F8EFD6]">
                My Applications ({filteredApps.length})
              </h3>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredApps.map((app) => (
                  <motion.div
                    key={app.id}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    <GlassCard variant="dark" className="p-4 h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-[#F8EFD6] font-semibold truncate">{app.name}</h4>
                          <p className="text-[#75715E] text-sm">{app.template}</p>
                          <Badge variant="secondary" className="mt-1">
                            {app.category}
                          </Badge>
                        </div>
                        <Badge className={getRarityColor(app.rarity)}>
                          {getRarityIcon(app.rarity)}
                        </Badge>
                      </div>
                      
                      <p className="text-[#75715E] text-sm mb-3 line-clamp-2">{app.description}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#75715E]">Power Level</span>
                          <span className="text-[#F8EFD6] font-mono">{calculateOverallScore(app)}</span>
                        </div>
                        <Progress value={calculateOverallScore(app)} className="h-1" />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3 text-[#75715E]">
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {app.likes}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {app.views}
                          </span>
                        </div>
                        <div className="text-[#66D9EF] font-mono">
                          {app.tradingValue} ECE
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApps.map((app) => (
                  <motion.div
                    key={app.id}
                    whileHover={{ backgroundColor: 'rgba(39, 40, 34, 0.3)' }}
                    className="flex items-center p-4 rounded-lg border border-[#75715E]/20 cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="text-[#F8EFD6] font-semibold">{app.name}</h4>
                          <p className="text-[#75715E] text-sm">{app.description}</p>
                        </div>
                        <Badge className={getRarityColor(app.rarity)}>
                          {getRarityIcon(app.rarity)}
                          <span className="ml-1">{app.rarity}</span>
                        </Badge>
                        <Badge variant="secondary">{app.category}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="text-[#F8EFD6] font-mono">{calculateOverallScore(app)}</div>
                        <div className="text-[#75715E] text-xs">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#F92672] font-mono">{app.likes}</div>
                        <div className="text-[#75715E] text-xs">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#66D9EF] font-mono">{app.tradingValue}</div>
                        <div className="text-[#75715E] text-xs">ECE Value</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Rarity Distribution */}
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Rarity Distribution</h3>
              <div className="space-y-3">
                {Object.entries(userStats.rarityDistribution).map(([rarity, percentage]) => (
                  <div key={rarity} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getRarityIcon(rarity)}
                      <span className="ml-2 text-[#F8EFD6] capitalize">{rarity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-[#272822]/50 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            rarity === 'legendary' ? 'bg-[#F92672]' :
                            rarity === 'epic' ? 'bg-[#E6DB74]' :
                            rarity === 'rare' ? 'bg-[#66D9EF]' : 'bg-[#75715E]'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[#75715E] text-sm w-8 text-right">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Category Expertise */}
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Category Expertise</h3>
              <div className="space-y-3">
                {Object.entries(userStats.categoryExpertise).map(([category, level]) => (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#F8EFD6] capitalize">{category}</span>
                      <span className="text-[#66D9EF]">{level}%</span>
                    </div>
                    <Progress value={level} className="h-2" />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Performance Metrics */}
          <GlassCard variant="dark" className="p-6">
            <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Performance Metrics</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-[#272822]/30 rounded-lg">
                <Activity className="w-8 h-8 text-[#A6E22E] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#F8EFD6] mb-1">{userStats.averageQuality}%</div>
                <div className="text-[#75715E] text-sm">Average Quality Score</div>
              </div>
              
              <div className="text-center p-4 bg-[#272822]/30 rounded-lg">
                <TrendingUp className="w-8 h-8 text-[#66D9EF] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#F8EFD6] mb-1">
                  {Math.round(userStats.totalLikes / userStats.totalApps)}
                </div>
                <div className="text-[#75715E] text-sm">Avg Likes per App</div>
              </div>
              
              <div className="text-center p-4 bg-[#272822]/30 rounded-lg">
                <Eye className="w-8 h-8 text-[#E6DB74] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#F8EFD6] mb-1">
                  {Math.round(userStats.totalViews / userStats.totalApps)}
                </div>
                <div className="text-[#75715E] text-sm">Avg Views per App</div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <GlassCard variant="dark" className="p-6">
            <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">
              Achievements ({userStats.achievements.length})
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userStats.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-[#75715E]/20 bg-[#272822]/30"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getAchievementColor(achievement.rarity)}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#F8EFD6] font-semibold">{achievement.name}</h4>
                      <p className="text-[#75715E] text-sm mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getAchievementColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        <span className="text-[#75715E] text-xs">
                          {achievement.unlockedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* App Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard variant="dark" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#F8EFD6]">{selectedApp.name}</h3>
                    <p className="text-[#75715E]">{selectedApp.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                   
                    onClick={() => setSelectedApp(null)}
                    className="text-[#75715E]"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* App Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#F8EFD6] font-semibold mb-2">Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#75715E]">Template:</span>
                          <span className="text-[#F8EFD6]">{selectedApp.template}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#75715E]">Category:</span>
                          <Badge variant="secondary">{selectedApp.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#75715E]">Rarity:</span>
                          <Badge className={getRarityColor(selectedApp.rarity)}>
                            {getRarityIcon(selectedApp.rarity)}
                            <span className="ml-1">{selectedApp.rarity}</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#75715E]">Trading Value:</span>
                          <span className="text-[#66D9EF] font-mono">{selectedApp.tradingValue} ECE</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[#F8EFD6] font-semibold mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedApp.techStack.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[#F8EFD6] font-semibold mb-2">Special Abilities</h4>
                      <div className="space-y-1">
                        {selectedApp.specialAbilities.map((ability) => (
                          <div key={ability} className="flex items-center text-[#F8EFD6] text-sm">
                            <Star className="w-3 h-3 mr-2 text-[#E6DB74]" />
                            {ability}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Battle Stats */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#F8EFD6] font-semibold mb-2">Battle Statistics</h4>
                      <div className="space-y-3">
                        {Object.entries(selectedApp.battleStats).map(([stat, value]) => (
                          <div key={stat} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#F8EFD6] capitalize flex items-center">
                                {getStatIcon(stat)}
                                <span className="ml-1">{stat}</span>
                              </span>
                              <span className="text-[#66D9EF] font-mono">{value}</span>
                            </div>
                            <Progress value={value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-[#272822]/30 rounded-lg">
                      <div className="text-2xl font-bold text-[#F92672] mb-1">
                        {calculateOverallScore(selectedApp)}
                      </div>
                      <div className="text-[#75715E] text-sm">Overall Power Level</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-[#272822]/30 rounded">
                        <div className="text-[#F92672] font-mono">{selectedApp.likes}</div>
                        <div className="text-[#75715E]">Likes</div>
                      </div>
                      <div className="p-2 bg-[#272822]/30 rounded">
                        <div className="text-[#A6E22E] font-mono">{selectedApp.views}</div>
                        <div className="text-[#75715E]">Views</div>
                      </div>
                      <div className="p-2 bg-[#272822]/30 rounded">
                        <div className="text-[#66D9EF] font-mono">{selectedApp.downloads}</div>
                        <div className="text-[#75715E]">Downloads</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center space-x-3 mt-6 pt-4 border-t border-[#75715E]/30">
                  {selectedApp.githubRepo && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedApp.githubRepo, '_blank')}
                      className="border-[#75715E]/30 text-[#75715E]"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                  )}
                  
                  {selectedApp.vercelUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedApp.vercelUrl, '_blank')}
                      className="border-[#A6E22E]/30 text-[#A6E22E]"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  )}
                  
                  <Button className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share App
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserGeneratedAppsProfile
