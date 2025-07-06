'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Ban,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Star,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  fullName: string
  avatar?: string
  status: 'active' | 'suspended' | 'banned' | 'pending'
  role: 'user' | 'premium' | 'admin' | 'moderator'
  joinDate: Date
  lastActive: Date
  stats: {
    cardsOwned: number
    totalSpent: number
    wins: number
    trades: number
    rating: number
  }
  verification: {
    email: boolean
    phone: boolean
    identity: boolean
  }
  flags: {
    vip: boolean
    verified: boolean
    suspicious: boolean
  }
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'trader_mike',
    email: 'mike@example.com',
    fullName: 'Michael Johnson',
    status: 'active',
    role: 'premium',
    joinDate: new Date('2024-01-15'),
    lastActive: new Date('2025-07-05T10:30:00'),
    stats: {
      cardsOwned: 150,
      totalSpent: 2500,
      wins: 45,
      trades: 120,
      rating: 4.8
    },
    verification: {
      email: true,
      phone: true,
      identity: true
    },
    flags: {
      vip: true,
      verified: true,
      suspicious: false
    }
  },
  {
    id: '2',
    username: 'card_collector',
    email: 'sarah@example.com',
    fullName: 'Sarah Chen',
    status: 'active',
    role: 'user',
    joinDate: new Date('2024-03-20'),
    lastActive: new Date('2025-07-04T15:20:00'),
    stats: {
      cardsOwned: 85,
      totalSpent: 800,
      wins: 12,
      trades: 34,
      rating: 4.2
    },
    verification: {
      email: true,
      phone: false,
      identity: false
    },
    flags: {
      vip: false,
      verified: false,
      suspicious: false
    }
  },
  {
    id: '3',
    username: 'suspicious_user',
    email: 'suspicious@example.com',
    fullName: 'John Doe',
    status: 'suspended',
    role: 'user',
    joinDate: new Date('2024-06-10'),
    lastActive: new Date('2025-06-30T08:15:00'),
    stats: {
      cardsOwned: 200,
      totalSpent: 50,
      wins: 80,
      trades: 250,
      rating: 2.1
    },
    verification: {
      email: false,
      phone: false,
      identity: false
    },
    flags: {
      vip: false,
      verified: false,
      suspicious: true
    }
  }
]

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by tab
    switch (selectedTab) {
      case 'active':
        filtered = filtered.filter(user => user.status === 'active')
        break
      case 'suspended':
        filtered = filtered.filter(user => user.status === 'suspended')
        break
      case 'banned':
        filtered = filtered.filter(user => user.status === 'banned')
        break
      case 'premium':
        filtered = filtered.filter(user => user.role === 'premium' || user.flags.vip)
        break
      case 'suspicious':
        filtered = filtered.filter(user => user.flags.suspicious)
        break
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, selectedTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      case 'suspended': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'banned': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'pending': return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'moderator': return 'text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30'
      case 'premium': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'user': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  const handleUserAction = async (userId: string, action: string) => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'suspend':
              return { ...user, status: 'suspended' as const }
            case 'activate':
              return { ...user, status: 'active' as const }
            case 'ban':
              return { ...user, status: 'banned' as const }
            case 'flag':
              return { ...user, flags: { ...user.flags, suspicious: true } }
            case 'unflag':
              return { ...user, flags: { ...user.flags, suspicious: false } }
            default:
              return user
          }
        }
        return user
      }))
    } catch (error) {
      console.error('Error performing user action:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserStats = () => {
    const total = users.length
    const active = users.filter(u => u.status === 'active').length
    const suspended = users.filter(u => u.status === 'suspended').length
    const premium = users.filter(u => u.role === 'premium' || u.flags.vip).length
    const suspicious = users.filter(u => u.flags.suspicious).length

    return { total, active, suspended, premium, suspicious }
  }

  const stats = getUserStats()

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent mb-4">
            User Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor and manage user accounts, permissions, and activities
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-monokai-blue" />
            </div>
          </Card>

          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-[#A6E22E]">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-[#A6E22E]" />
            </div>
          </Card>

          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-[#E6DB74]">{stats.suspended}</p>
              </div>
              <UserX className="h-8 w-8 text-[#E6DB74]" />
            </div>
          </Card>

          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Premium</p>
                <p className="text-2xl font-bold text-[#66D9EF]">{stats.premium}</p>
              </div>
              <Star className="h-8 w-8 text-[#66D9EF]" />
            </div>
          </Card>

          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold text-[#F92672]">{stats.suspicious}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#F92672]" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by username, email, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-border/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="outline" className="border-border/30 text-muted-foreground hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </Card>

        {/* User Tabs and List */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 border border-border/30 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-blue data-[state=active]:to-monokai-purple data-[state=active]:text-white">
              All Users
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-green data-[state=active]:to-ocean-accent data-[state=active]:text-white">
              Active
            </TabsTrigger>
            <TabsTrigger value="suspended" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-yellow data-[state=active]:to-monokai-orange data-[state=active]:text-white">
              Suspended
            </TabsTrigger>
            <TabsTrigger value="banned" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-pink data-[state=active]:to-monokai-orange data-[state=active]:text-white">
              Banned
            </TabsTrigger>
            <TabsTrigger value="premium" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-blue data-[state=active]:to-monokai-purple data-[state=active]:text-white">
              Premium
            </TabsTrigger>
            <TabsTrigger value="suspicious" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-pink data-[state=active]:to-monokai-orange data-[state=active]:text-white">
              Flagged
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-0">
            <Card className="bg-white/10 backdrop-blur-xl border border-border/30">
              <div className="p-6">
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-border/20 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-monokai-blue to-monokai-purple rounded-full flex items-center justify-center text-white font-semibold">
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{user.fullName}</h3>
                            <span className="text-sm text-muted-foreground">@{user.username}</span>
                            
                            {user.flags.vip && (
                              <Badge className="text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30">
                                <Star className="h-3 w-3 mr-1" />
                                VIP
                              </Badge>
                            )}
                            
                            {user.flags.verified && (
                              <Badge className="text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            
                            {user.flags.suspicious && (
                              <Badge className="text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {formatDate(user.joinDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last active {formatTimeAgo(user.lastActive)}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${user.stats.totalSpent}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {user.stats.cardsOwned} cards
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground hover:bg-white/10"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground hover:bg-white/10"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground hover:bg-white/10"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Try adjusting your search terms' : 'No users match the current filter'}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
