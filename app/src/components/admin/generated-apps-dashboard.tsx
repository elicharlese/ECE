'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3,
  Users,
  Zap,
  TrendingUp,
  Eye,
  Download,
  Github,
  Globe,
  Filter,
  Search,
  Calendar,
  Star,
  Crown,
  Gem,
  Award,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Progress } from '../ui/progress'

interface GeneratedApp {
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
  status: 'generating' | 'completed' | 'failed' | 'deployed'
  creator: string
  createdAt: Date
  updatedAt: Date
  githubRepo?: string
  vercelUrl?: string
  downloadCount: number
  viewCount: number
  likes: number
  generationTime: number // in seconds
  qualityScore: number
  deploymentStatus: 'pending' | 'deploying' | 'deployed' | 'failed'
}

interface DashboardStats {
  totalApps: number
  appsToday: number
  totalDownloads: number
  averageQuality: number
  popularTemplate: string
  generationSuccess: number
  rarityDistribution: Record<string, number>
  categoryDistribution: Record<string, number>
}

interface GeneratedAppsDashboardProps {
  className?: string
}

// Mock data for demonstration
const mockApps: GeneratedApp[] = [
  {
    id: 'app_001',
    name: 'TradingCard Pro',
    description: 'Advanced trading card management platform',
    template: 'Trading Dashboard',
    category: 'web',
    rarity: 'legendary',
    battleStats: { power: 92, speed: 88, innovation: 95, scalability: 90 },
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind'],
    status: 'deployed',
    creator: 'admin@ece.com',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T11:45:00'),
    githubRepo: 'https://github.com/ece-platform/tradingcard-pro',
    vercelUrl: 'https://tradingcard-pro.vercel.app',
    downloadCount: 124,
    viewCount: 2341,
    likes: 89,
    generationTime: 245,
    qualityScore: 94,
    deploymentStatus: 'deployed'
  },
  {
    id: 'app_002',
    name: 'Mobile Trader',
    description: 'Cross-platform mobile trading app',
    template: 'Mobile Trading App',
    category: 'mobile',
    rarity: 'epic',
    battleStats: { power: 85, speed: 92, innovation: 78, scalability: 82 },
    techStack: ['React Native', 'TypeScript', 'Redux'],
    status: 'completed',
    creator: 'dev@ece.com',
    createdAt: new Date('2024-01-14T14:20:00'),
    updatedAt: new Date('2024-01-14T15:30:00'),
    githubRepo: 'https://github.com/ece-platform/mobile-trader',
    downloadCount: 67,
    viewCount: 1205,
    likes: 34,
    generationTime: 180,
    qualityScore: 87,
    deploymentStatus: 'deploying'
  },
  {
    id: 'app_003',
    name: 'AI Analytics Engine',
    description: 'Machine learning powered analytics dashboard',
    template: 'AI Service',
    category: 'ai',
    rarity: 'legendary',
    battleStats: { power: 98, speed: 75, innovation: 99, scalability: 85 },
    techStack: ['Python', 'FastAPI', 'TensorFlow', 'React'],
    status: 'generating',
    creator: 'ai-team@ece.com',
    createdAt: new Date('2024-01-15T16:00:00'),
    updatedAt: new Date('2024-01-15T16:15:00'),
    downloadCount: 0,
    viewCount: 45,
    likes: 12,
    generationTime: 0,
    qualityScore: 0,
    deploymentStatus: 'pending'
  },
  {
    id: 'app_004',
    name: 'Portfolio Site',
    description: 'Personal portfolio website with 3D elements',
    template: 'Landing Page',
    category: 'web',
    rarity: 'rare',
    battleStats: { power: 70, speed: 88, innovation: 65, scalability: 60 },
    techStack: ['Next.js', 'Spline', 'Framer Motion'],
    status: 'completed',
    creator: 'designer@ece.com',
    createdAt: new Date('2024-01-13T09:15:00'),
    updatedAt: new Date('2024-01-13T10:00:00'),
    githubRepo: 'https://github.com/ece-platform/portfolio-site',
    vercelUrl: 'https://portfolio-site.vercel.app',
    downloadCount: 156,
    viewCount: 892,
    likes: 67,
    generationTime: 120,
    qualityScore: 78,
    deploymentStatus: 'deployed'
  }
]

const mockStats: DashboardStats = {
  totalApps: 247,
  appsToday: 12,
  totalDownloads: 5420,
  averageQuality: 84.2,
  popularTemplate: 'Trading Dashboard',
  generationSuccess: 94.5,
  rarityDistribution: {
    common: 45,
    rare: 30,
    epic: 20,
    legendary: 5
  },
  categoryDistribution: {
    web: 40,
    mobile: 25,
    backend: 15,
    ai: 10,
    desktop: 7,
    blockchain: 3
  }
}

export function GeneratedAppsDashboard({ className }: GeneratedAppsDashboardProps) {
  const [apps, setApps] = useState<GeneratedApp[]>(mockApps)
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [filteredApps, setFilteredApps] = useState<GeneratedApp[]>(mockApps)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [rarityFilter, setRarityFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedApp, setSelectedApp] = useState<GeneratedApp | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Filter and search logic
  useEffect(() => {
    const filtered = apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.creator.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter
      const matchesRarity = rarityFilter === 'all' || app.rarity === rarityFilter

      return matchesSearch && matchesStatus && matchesCategory && matchesRarity
    })

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof GeneratedApp]
      let bValue = b[sortBy as keyof GeneratedApp]

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue as Date).getTime()
        bValue = new Date(bValue as Date).getTime()
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    setFilteredApps(filtered)
  }, [apps, searchTerm, statusFilter, categoryFilter, rarityFilter, sortBy, sortOrder])

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-[#75715E] bg-[#75715E]/20',
      rare: 'text-[#66D9EF] bg-[#66D9EF]/20',
      epic: 'text-[#E6DB74] bg-[#E6DB74]/20',
      legendary: 'text-[#F92672] bg-[#F92672]/20'
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

  const getStatusColor = (status: string) => {
    const colors = {
      generating: 'text-[#E6DB74] bg-[#E6DB74]/20',
      completed: 'text-[#A6E22E] bg-[#A6E22E]/20',
      failed: 'text-[#FD5C63] bg-[#FD5C63]/20',
      deployed: 'text-[#66D9EF] bg-[#66D9EF]/20'
    }
    return colors[status as keyof typeof colors] || colors.completed
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      generating: Clock,
      completed: CheckCircle,
      failed: AlertCircle,
      deployed: Activity
    }
    const IconComponent = icons[status as keyof typeof icons] || CheckCircle
    return <IconComponent className="w-4 h-4" />
  }

  const calculateOverallScore = (app: GeneratedApp) => {
    const statAverage = Object.values(app.battleStats).reduce((sum, stat) => sum + stat, 0) / 4
    return Math.round((statAverage + app.qualityScore) / 2)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#F8EFD6] flex items-center">
            <Zap className="w-7 h-7 mr-3 text-[#E6DB74]" />
            Generated Apps Dashboard
          </h2>
          <p className="text-[#75715E] mt-1">
            Manage and monitor AI-generated applications
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
           
            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
            className="border-[#75715E]/30 text-[#75715E]"
          >
            {viewMode === 'table' ? 'Card View' : 'Table View'}
          </Button>
          <Button
           
            className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="dark" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#75715E] text-sm">Total Apps</p>
              <p className="text-2xl font-bold text-[#F8EFD6]">{stats.totalApps}</p>
              <p className="text-[#A6E22E] text-xs">+{stats.appsToday} today</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[#66D9EF]" />
          </div>
        </GlassCard>

        <GlassCard variant="dark" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#75715E] text-sm">Downloads</p>
              <p className="text-2xl font-bold text-[#F8EFD6]">{stats.totalDownloads.toLocaleString()}</p>
              <p className="text-[#66D9EF] text-xs">All time</p>
            </div>
            <Download className="w-8 h-8 text-[#A6E22E]" />
          </div>
        </GlassCard>

        <GlassCard variant="dark" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#75715E] text-sm">Avg Quality</p>
              <p className="text-2xl font-bold text-[#F8EFD6]">{stats.averageQuality}%</p>
              <p className="text-[#A6E22E] text-xs">Quality score</p>
            </div>
            <Star className="w-8 h-8 text-[#E6DB74]" />
          </div>
        </GlassCard>

        <GlassCard variant="dark" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#75715E] text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-[#F8EFD6]">{stats.generationSuccess}%</p>
              <p className="text-[#A6E22E] text-xs">Generation success</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#F92672]" />
          </div>
        </GlassCard>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rarity Distribution */}
        <GlassCard variant="dark" className="p-6">
          <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Rarity Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.rarityDistribution).map(([rarity, count]) => (
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
                      style={{ width: `${(count / stats.totalApps) * 100}%` }}
                    />
                  </div>
                  <span className="text-[#75715E] text-sm w-8 text-right">{count}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Category Distribution */}
        <GlassCard variant="dark" className="p-6">
          <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryDistribution).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-[#F8EFD6] capitalize">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-[#272822]/50 rounded-full">
                    <div 
                      className="h-2 bg-[#66D9EF] rounded-full"
                      style={{ width: `${(count / stats.totalApps) * 100}%` }}
                    />
                  </div>
                  <span className="text-[#75715E] text-sm w-8 text-right">{count}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Filters and Search */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#75715E]" />
              <Input
                placeholder="Search apps, creators, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="deployed">Deployed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]">
              <SelectValue placeholder="Category" />
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

          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-32 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
           
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setCategoryFilter('all')
              setRarityFilter('all')
            }}
            className="border-[#75715E]/30 text-[#75715E]"
          >
            Clear Filters
          </Button>
        </div>
      </GlassCard>

      {/* Apps List */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#F8EFD6]">
            Generated Applications ({filteredApps.length})
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-[#75715E] text-sm">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="qualityScore">Quality Score</SelectItem>
                <SelectItem value="downloadCount">Downloads</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
             
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="border-[#75715E]/30 text-[#75715E]"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#75715E]/30">
                  <TableHead className="text-[#F8EFD6]">App</TableHead>
                  <TableHead className="text-[#F8EFD6]">Category</TableHead>
                  <TableHead className="text-[#F8EFD6]">Rarity</TableHead>
                  <TableHead className="text-[#F8EFD6]">Status</TableHead>
                  <TableHead className="text-[#F8EFD6]">Score</TableHead>
                  <TableHead className="text-[#F8EFD6]">Stats</TableHead>
                  <TableHead className="text-[#F8EFD6]">Created</TableHead>
                  <TableHead className="text-[#F8EFD6]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.id} className="border-[#75715E]/30 hover:bg-[#272822]/30">
                    <TableCell>
                      <div>
                        <p className="text-[#F8EFD6] font-medium">{app.name}</p>
                        <p className="text-[#75715E] text-sm truncate max-w-48">{app.description}</p>
                        <p className="text-[#66D9EF] text-xs">{app.template}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {app.category}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getRarityColor(app.rarity)}>
                        {getRarityIcon(app.rarity)}
                        <span className="ml-1 capitalize">{app.rarity}</span>
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status}</span>
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#F8EFD6] font-mono">{calculateOverallScore(app)}</span>
                        <div className="w-12 h-2 bg-[#272822]/50 rounded-full">
                          <div 
                            className="h-2 bg-[#A6E22E] rounded-full"
                            style={{ width: `${calculateOverallScore(app)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#75715E]">PWR:</span>
                          <span className="text-[#F8EFD6]">{app.battleStats.power}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#75715E]">SPD:</span>
                          <span className="text-[#F8EFD6]">{app.battleStats.speed}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-xs text-[#75715E]">
                        {app.createdAt.toLocaleDateString()}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                         
                          variant="ghost"
                          onClick={() => setSelectedApp(app)}
                          className="text-[#66D9EF] hover:bg-[#66D9EF]/20 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {app.githubRepo && (
                          <Button
                           
                            variant="ghost"
                            onClick={() => window.open(app.githubRepo, '_blank')}
                            className="text-[#75715E] hover:bg-[#75715E]/20 p-1"
                          >
                            <Github className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {app.vercelUrl && (
                          <Button
                           
                            variant="ghost"
                            onClick={() => window.open(app.vercelUrl, '_blank')}
                            className="text-[#A6E22E] hover:bg-[#A6E22E]/20 p-1"
                          >
                            <Globe className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Card View */
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
                    </div>
                    <Badge className={getRarityColor(app.rarity)}>
                      {getRarityIcon(app.rarity)}
                    </Badge>
                  </div>
                  
                  <p className="text-[#75715E] text-sm mb-3 line-clamp-2">{app.description}</p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#75715E]">Overall Score</span>
                      <span className="text-[#F8EFD6] font-mono">{calculateOverallScore(app)}</span>
                    </div>
                    <Progress value={calculateOverallScore(app)} className="h-1" />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                    <div className="text-[#75715E]">
                      {app.downloadCount} downloads
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>

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
                          <span className="text-[#75715E]">Status:</span>
                          <Badge className={getStatusColor(selectedApp.status)}>
                            {selectedApp.status}
                          </Badge>
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
                      <h4 className="text-[#F8EFD6] font-semibold mb-2">Metrics</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-center p-2 bg-[#272822]/30 rounded">
                          <div className="text-[#66D9EF] font-mono">{selectedApp.downloadCount}</div>
                          <div className="text-[#75715E] text-xs">Downloads</div>
                        </div>
                        <div className="text-center p-2 bg-[#272822]/30 rounded">
                          <div className="text-[#A6E22E] font-mono">{selectedApp.viewCount}</div>
                          <div className="text-[#75715E] text-xs">Views</div>
                        </div>
                        <div className="text-center p-2 bg-[#272822]/30 rounded">
                          <div className="text-[#F92672] font-mono">{selectedApp.likes}</div>
                          <div className="text-[#75715E] text-xs">Likes</div>
                        </div>
                        <div className="text-center p-2 bg-[#272822]/30 rounded">
                          <div className="text-[#E6DB74] font-mono">{selectedApp.qualityScore}%</div>
                          <div className="text-[#75715E] text-xs">Quality</div>
                        </div>
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
                              <span className="text-[#F8EFD6] capitalize">{stat}</span>
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
                    <Settings className="w-4 h-4 mr-2" />
                    Manage App
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

export default GeneratedAppsDashboard
