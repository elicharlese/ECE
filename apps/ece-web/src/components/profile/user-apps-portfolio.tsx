'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Rocket, 
  Eye, 
  Github, 
  Globe, 
  Download, 
  Settings, 
  Trash2,
  Star,
  TrendingUp,
  Users,
  Code,
  Palette,
  Brain,
  BarChart3,
  Gem,
  Crown,
  Zap,
  Award,
  Filter,
  Search,
  Calendar,
  Activity
} from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Progress } from '../ui/progress'

interface UserApp {
  id: string
  name: string
  description: string
  template: string
  category: 'Social' | 'Analytics' | 'Blockchain' | 'Finance' | 'Design' | 'Backend'
  status: 'deployed' | 'building' | 'failed' | 'draft'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  techStack: string[]
  createdAt: string
  updatedAt: string
  stats: {
    views: number
    forks: number
    stars: number
    deployments: number
  }
  battleStats: {
    power: number
    speed: number
    innovation: number
    scalability: number
  }
  links: {
    github?: string
    live?: string
    documentation?: string
  }
  thumbnail?: string
}

const mockUserApps: UserApp[] = [
  {
    id: '1',
    name: 'Social Trading Hub',
    description: 'Community-driven trading platform with social features',
    template: 'social-platform',
    category: 'Social',
    status: 'deployed',
    rarity: 'epic',
    techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'],
    createdAt: '2025-07-20',
    updatedAt: '2025-07-24',
    stats: { views: 1240, forks: 23, stars: 89, deployments: 5 },
    battleStats: { power: 88, speed: 92, innovation: 95, scalability: 85 },
    links: {
      github: 'https://github.com/user/social-trading-hub',
      live: 'https://social-trading-hub.vercel.app',
      documentation: 'https://docs.social-trading-hub.com'
    }
  },
  {
    id: '2',
    name: 'AI Analytics Dashboard',
    description: 'Advanced analytics with AI-powered insights',
    template: 'ai-analytics',
    category: 'Analytics',
    status: 'building',
    rarity: 'legendary',
    techStack: ['React', 'TypeScript', 'D3.js', 'Python API'],
    createdAt: '2025-07-22',
    updatedAt: '2025-07-25',
    stats: { views: 0, forks: 0, stars: 0, deployments: 0 },
    battleStats: { power: 95, speed: 88, innovation: 98, scalability: 92 },
    links: {
      github: 'https://github.com/user/ai-analytics-dashboard'
    }
  },
  {
    id: '3',
    name: 'Portfolio Tracker Pro',
    description: 'Track and analyze investment performance',
    template: 'portfolio-tracker',
    category: 'Finance',
    status: 'deployed',
    rarity: 'rare',
    techStack: ['Vue.js', 'Chart.js', 'Node.js', 'MongoDB'],
    createdAt: '2025-07-18',
    updatedAt: '2025-07-23',
    stats: { views: 856, forks: 12, stars: 34, deployments: 3 },
    battleStats: { power: 78, speed: 85, innovation: 82, scalability: 88 },
    links: {
      github: 'https://github.com/user/portfolio-tracker-pro',
      live: 'https://portfolio-tracker-pro.vercel.app'
    }
  }
]

const categoryIcons = {
  Social: Users,
  Analytics: Brain,
  Blockchain: Gem,
  Finance: BarChart3,
  Design: Palette,
  Backend: Code
}

const statusColors = {
  deployed: 'text-[#A6E22E] bg-[#A6E22E]/20',
  building: 'text-[#E6DB74] bg-[#E6DB74]/20',
  failed: 'text-[#F92672] bg-[#F92672]/20',
  draft: 'text-[#75715E] bg-[#75715E]/20'
}

const rarityColors = {
  common: 'text-[#A6E22E]',
  rare: 'text-[#66D9EF]',
  epic: 'text-[#9966CC]',
  legendary: 'text-[#FFD700]'
}

const rarityIcons = {
  common: Star,
  rare: Zap,
  epic: Crown,
  legendary: Award
}

interface UserAppsPortfolioProps {
  userId?: string
  isOwner?: boolean
}

export function UserAppsPortfolio({ userId, isOwner = true }: UserAppsPortfolioProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rarity'>('recent')

  const filteredAndSortedApps = useMemo(() => {
    let filtered = mockUserApps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })

    // Sort apps
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.stats.stars + b.stats.views) - (a.stats.stars + a.stats.views))
        break
      case 'rarity':
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 }
        filtered.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity])
        break
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
    }

    return filtered
  }, [searchTerm, statusFilter, categoryFilter, sortBy])

  const portfolioStats = useMemo(() => {
    const totalApps = mockUserApps.length
    const deployedApps = mockUserApps.filter(app => app.status === 'deployed').length
    const totalViews = mockUserApps.reduce((sum, app) => sum + app.stats.views, 0)
    const totalStars = mockUserApps.reduce((sum, app) => sum + app.stats.stars, 0)
    const avgBattleRating = mockUserApps.reduce((sum, app) => {
      const total = Object.values(app.battleStats).reduce((a, b) => a + b, 0)
      return sum + (total / 4)
    }, 0) / totalApps

    return { totalApps, deployedApps, totalViews, totalStars, avgBattleRating }
  }, [])

  return (
    <div className="space-y-6">
      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-[#F8EFD6]">{portfolioStats.totalApps}</div>
          <div className="text-sm text-[#75715E]">Total Apps</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-[#A6E22E]">{portfolioStats.deployedApps}</div>
          <div className="text-sm text-[#75715E]">Deployed</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-[#66D9EF]">{portfolioStats.totalViews.toLocaleString()}</div>
          <div className="text-sm text-[#75715E]">Total Views</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-[#E6DB74]">{portfolioStats.totalStars}</div>
          <div className="text-sm text-[#75715E]">Total Stars</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-[#F92672]">{portfolioStats.avgBattleRating.toFixed(1)}</div>
          <div className="text-sm text-[#75715E]">Avg Rating</div>
        </GlassCard>
      </div>

      {/* Filters and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#75715E] w-4 h-4" />
              <Input
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#272822]/50 border border-[#75715E]/30 rounded-md text-[#F8EFD6] text-sm"
            >
              <option value="all">All Status</option>
              <option value="deployed">Deployed</option>
              <option value="building">Building</option>
              <option value="failed">Failed</option>
              <option value="draft">Draft</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#272822]/50 border border-[#75715E]/30 rounded-md text-[#F8EFD6] text-sm"
            >
              <option value="all">All Categories</option>
              {Object.keys(categoryIcons).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#272822]/50 border border-[#75715E]/30 rounded-md text-[#F8EFD6] text-sm"
            >
              <option value="recent">Recent</option>
              <option value="popular">Popular</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAndSortedApps.map((app) => {
            const CategoryIcon = categoryIcons[app.category]
            const RarityIcon = rarityIcons[app.rarity]
            const totalBattleRating = Object.values(app.battleStats).reduce((a, b) => a + b, 0) / 4

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 hover:bg-white/5 transition-all duration-300">
                  <div className="space-y-4">
                    {/* App Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-[#66D9EF]/20 rounded-lg">
                          <CategoryIcon className="w-5 h-5 text-[#66D9EF]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#F8EFD6] text-lg">{app.name}</h3>
                          <p className="text-[#75715E] text-sm">{app.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={`${statusColors[app.status]} text-xs`}>
                          {app.status}
                        </Badge>
                        <RarityIcon className={`w-4 h-4 ${rarityColors[app.rarity]}`} />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#75715E] text-sm">{app.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-[#F8EFD6] font-semibold">{app.stats.views}</div>
                        <div className="text-[#75715E]">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#F8EFD6] font-semibold">{app.stats.stars}</div>
                        <div className="text-[#75715E]">Stars</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#F8EFD6] font-semibold">{app.stats.forks}</div>
                        <div className="text-[#75715E]">Forks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#F8EFD6] font-semibold">{totalBattleRating.toFixed(1)}</div>
                        <div className="text-[#75715E]">Rating</div>
                      </div>
                    </div>

                    {/* Battle Stats Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#75715E]">Power</span>
                        <span className="text-[#F8EFD6]">{app.battleStats.power}</span>
                      </div>
                      <Progress value={app.battleStats.power} className="h-1" />
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1">
                      {app.techStack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {app.techStack.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{app.techStack.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-2">
                        {app.links.live && (
                          <Button variant="ghost" className="p-2">
                            <Globe className="w-4 h-4" />
                          </Button>
                        )}
                        {app.links.github && (
                          <Button variant="ghost" className="p-2">
                            <Github className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" className="p-2">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {isOwner && (
                        <div className="flex space-x-1">
                          <Button variant="ghost" className="p-2">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" className="p-2 text-[#F92672] hover:text-[#F92672]">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredAndSortedApps.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#75715E] text-lg mb-4">No apps found</div>
          {isOwner && (
            <Button className="bg-gradient-to-r from-[#66D9EF] to-[#819AFF]">
              <Rocket className="w-4 h-4 mr-2" />
              Create Your First App
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
