'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Edit3, 
  Trophy, 
  Wallet, 
  Star,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Target,
  Zap,
  Crown,
  DollarSign,
  BarChart3,
  HeadphonesIcon,
  Search,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  PieChart,
  LineChart,
  Building,
  Globe,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Lightbulb,
  Briefcase,
  UserCheck,
  Handshake,
  Network,
  Eye,
  Filter,
  Calculator,
  CreditCard,
  User,
  Plus,
  Heart,
  Share2
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { useSubscription } from '@/contexts/subscription-context'
import { UserAvatarSystem } from '@/components/profile/UserAvatarSystem'
import { ProfileStatisticsWidget } from '@/components/profile/ProfileStatisticsWidget'
import { AchievementBadges } from '@/components/profile/AchievementBadges'
import { ProfileActivityFeed } from '@/components/profile/ProfileActivityFeed'
import { TieredCardSystem } from '@/components/profile/TieredCardSystem'
import { TierProgressTracker } from '@/components/profile/TierProgressTracker'
import { ProfilePrivacySettings } from '@/components/profile/ProfilePrivacySettings'
import { SocialProfileLinks } from '@/components/profile/SocialProfileLinks'
import { ProfileTabNavigation } from '@/components/profile/ProfileTabNavigation'
import { TierUpgradeSystem } from '@/components/profile/TierUpgradeSystem'
import { Card3DViewer, Card3DGallery } from '@/components/profile/Card3DViewer'
import { ECEBalancePerformance } from '@/components/profile/ECEBalancePerformance'
import { WishlistSystem } from '@/components/profile/WishlistSystem'
import { TradingControlsDashboard } from '@/components/profile/TradingControlsDashboard'
import { BattleArenaSystem } from '@/components/profile/BattleArenaSystem'
import { BettingSystem } from '@/components/profile/BettingSystem'
import { BiddingSystem } from '@/components/profile/BiddingSystem'
import { PowerupInventory } from '@/components/powerups/PowerupInventory'
import { PowerupCard } from '@/components/powerups/PowerupCard'

// Business Stats Data
const businessStats = [
  { label: 'Monthly Revenue', value: '$24,580', change: '+12.5%', icon: DollarSign, positive: true },
  { label: 'Active Traders', value: '1,247', change: '+8.2%', icon: Users, positive: true },
  { label: 'Transaction Volume', value: '$2.1M', change: '+15.7%', icon: Activity, positive: true },
  { label: 'Market Growth', value: '23.4%', change: '+2.1%', icon: TrendingUp, positive: true }
]

// Financial Data
const financialMetrics = {
  revenue: {
    current: 124580,
    previous: 108750,
    breakdown: [
      { category: 'Trading Fees', amount: 45620, percentage: 36.6 },
      { category: 'Premium Subscriptions', amount: 38900, percentage: 31.2 },
      { category: 'Card Sales', amount: 25400, percentage: 20.4 },
      { category: 'Marketplace Commission', amount: 14660, percentage: 11.8 }
    ]
  },
  expenses: {
    total: 67890,
    breakdown: [
      { category: 'Operations', amount: 25600, percentage: 37.7 },
      { category: 'Marketing', amount: 18900, percentage: 27.8 },
      { category: 'Development', amount: 15200, percentage: 22.4 },
      { category: 'Support', amount: 8190, percentage: 12.1 }
    ]
  },
  profit: 56690
}

// Performance Metrics
const performanceData = {
  trading: {
    volume: 2100000,
    transactions: 8947,
    averageValue: 234.67,
    topPerformers: [
      { name: 'Alex Rivera', trades: 145, volume: 45600, profit: 12340 },
      { name: 'Jordan Smith', trades: 132, volume: 38900, profit: 9870 },
      { name: 'Casey Wong', trades: 121, volume: 35400, profit: 8950 },
      { name: 'Morgan Lee', trades: 108, volume: 29800, profit: 7650 }
    ]
  },
  engagement: {
    activeUsers: 1247,
    newSignups: 89,
    retention: 84.2,
    avgSessionTime: '23m 45s'
  }
}

// Support & Development Data
const supportMetrics = {
  tickets: {
    open: 23,
    resolved: 156,
    avgResponseTime: '2h 15m',
    satisfaction: 4.8
  },
  development: {
    features: 8,
    bugs: 3,
    velocity: 23,
    uptime: 99.97
  },
  team: [
    { name: 'Sarah Johnson', role: 'Lead Developer', tickets: 45, rating: 4.9 },
    { name: 'Mike Chen', role: 'Support Manager', tickets: 78, rating: 4.8 },
    { name: 'Emily Davis', role: 'UX Designer', tickets: 34, rating: 4.7 },
    { name: 'Tom Wilson', role: 'Backend Engineer', tickets: 52, rating: 4.8 }
  ]
}

// Market Research Data
const marketData = {
  trends: [
    { category: 'Fantasy Cards', growth: 23.4, volume: 450000, interest: 'High' },
    { category: 'Sci-Fi Collection', growth: 18.7, volume: 320000, interest: 'Medium' },
    { category: 'Sports Cards', growth: 15.2, volume: 280000, interest: 'High' },
    { category: 'Gaming Cards', growth: 31.5, volume: 180000, interest: 'Very High' }
  ],
  demographics: {
    ages: [
      { range: '18-25', percentage: 32.4 },
      { range: '26-35', percentage: 28.9 },
      { range: '36-45', percentage: 23.1 },
      { range: '46+', percentage: 15.6 }
    ],
    regions: [
      { name: 'North America', percentage: 45.2, growth: 12.3 },
      { name: 'Europe', percentage: 28.7, growth: 15.8 },
      { name: 'Asia Pacific', percentage: 18.9, growth: 23.1 },
      { name: 'Other', percentage: 7.2, growth: 8.9 }
    ]
  }
}

// Forecasts & Connections Data
const forecastData = {
  predictions: [
    { metric: 'Q4 Revenue', current: 124580, predicted: 145670, confidence: 87 },
    { metric: 'User Growth', current: 1247, predicted: 1580, confidence: 92 },
    { metric: 'Market Share', current: 12.4, predicted: 15.8, confidence: 78 },
    { metric: 'Transaction Volume', current: 2100000, predicted: 2650000, confidence: 85 }
  ],
  partnerships: [
    { name: 'CardVault Inc.', type: 'Distribution', value: 250000, status: 'Active' },
    { name: 'GameStore Pro', type: 'Retail', value: 180000, status: 'Pending' },
    { name: 'TradingHQ', type: 'Technology', value: 120000, status: 'Active' },
    { name: 'CollectorSpace', type: 'Marketing', value: 95000, status: 'Negotiating' }
  ],
  discounts: [
    { code: 'ENTERPRISE20', usage: 45, savings: 12000, expires: '2025-07-31' },
    { code: 'BULK15', usage: 78, savings: 8900, expires: '2025-06-30' },
    { code: 'PARTNER10', usage: 23, savings: 4500, expires: '2025-08-15' }
  ]
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview')
  const { subscription, isPro, isEnterprise } = useSubscription()
  const [userAvatar, setUserAvatar] = useState<string>('')
  
  // Mock session for demo - replace with actual session hook
  const session = { user: { id: 'demo-user-123', email: 'demo@ece.com' } }

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setUserAvatar(newAvatarUrl)
    // In a real app, this would save to the backend
    console.log('Avatar updated:', newAvatarUrl)
  }

  return (
    <div className="container mx-auto px-4 space-y-8">
      {/* Enhanced Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard variant="dark" className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Enhanced Avatar System */}
            <UserAvatarSystem
              currentAvatar={userAvatar}
              userName="Alex Rivera"
              onAvatarUpdate={handleAvatarUpdate}
            />

            {/* User Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold text-[#F8EFD6] mb-2">
                Alex Rivera
              </h1>
              <p className="text-[#75715E] mb-4">
                @alexrivera • Trader Level 42 • {subscription?.plan || 'Pro'} Member
              </p>
              <p className="text-[#F8EFD6] max-w-2xl mb-4">
                Passionate digital card trader specializing in tech and gaming collectibles. 
                Building the future of decentralized trading one card at a time.
              </p>
              
              {/* Enhanced Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-[#A6E22E]/20 to-[#A6E22E]/10 border border-[#A6E22E]/30 text-[#A6E22E] text-sm rounded-full">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Verified Trader
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-[#F92672]/20 to-[#F92672]/10 border border-[#F92672]/30 text-[#F92672] text-sm rounded-full">
                  <Crown className="w-3 h-3 inline mr-1" />
                  Elite Member
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-[#66D9EF]/20 to-[#66D9EF]/10 border border-[#66D9EF]/30 text-[#66D9EF] text-sm rounded-full">
                  <Trophy className="w-3 h-3 inline mr-1" />
                  Top 1% Trader
                </span>
                {isPro && (
                  <span className="px-3 py-1 bg-gradient-to-r from-[#E6DB74]/20 to-[#E6DB74]/10 border border-[#E6DB74]/30 text-[#E6DB74] text-sm rounded-full">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Pro Features
                  </span>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#A6E22E]">247</div>
                  <div className="text-sm text-[#75715E]">Cards Owned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#66D9EF]">156</div>
                  <div className="text-sm text-[#75715E]">Trades Made</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#E6DB74]">89</div>
                  <div className="text-sm text-[#75715E]">Friends</div>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="flex flex-col space-y-3">
              <Button variant="accent" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Enhanced Navigation Tabs */}
      <ProfileTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Enhanced Tab Content */}
      <div className="space-y-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <ProfileStatisticsWidget />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Recent Achievements</h3>
                  <AchievementBadges className="max-h-96 overflow-y-auto" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Latest Activity</h3>
                  <ProfileActivityFeed className="max-h-96 overflow-y-auto" />
                </div>
              </div>
            </div>
          )}

          {/* COLLECTION TAB */}
          {activeTab === 'collection' && (
            <div className="space-y-6">
              {/* Tier Progress Overview */}
              <TierProgressTracker />
              
              {/* Tier Upgrade System */}
              <TierUpgradeSystem />
              
              {/* Tiered Card Collection */}
              <TieredCardSystem />
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <ProfileActivityFeed />
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <AchievementBadges />
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === 'performance' && (
            <ECEBalancePerformance />
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <WishlistSystem />
          )}

          {/* 3D VIEWER TAB */}
          {activeTab === '3d-viewer' && (
            <Card3DViewer 
              cardId="sample-card"
              cardName="Legendary Cyber Dragon"
              cardTier="legendary"
              cardImage="/cards/cyber-dragon.jpg"
            />
          )}

          {/* TRADING TAB */}
          {activeTab === 'trading' && (
            <TradingControlsDashboard />
          )}

          {/* BATTLES TAB */}
          {activeTab === 'battles' && (
            <BattleArenaSystem />
          )}

          {/* BETTING TAB */}
          {activeTab === 'betting' && (
            <BettingSystem />
          )}

          {/* AUCTIONS TAB */}
          {activeTab === 'auctions' && (
            <BiddingSystem />
          )}

          {/* POWERUPS TAB */}
          {activeTab === 'powerups' && (
            <div className="space-y-6">
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Card Powerups System</h3>
                <p className="text-[#75715E] mb-6">
                  Enhance your trading cards with powerful abilities and temporary boosts. 
                  Apply powerups to increase card stats, unlock special effects, and gain competitive advantages.
                </p>
                
                <PowerupInventory
                  userId={session?.user?.id || 'demo-user'}
                  powerups={[
                    // Demo powerup data - replace with actual API call
                    {
                      id: 'speed-boost-1',
                      userId: 'demo-user',
                      powerupType: {
                        id: 'speed-boost',
                        name: 'speed_boost',
                        displayName: 'Speed Boost',
                        description: 'Increases card trading speed by 25% for 5 minutes',
                        category: 'UTILITY',
                        rarity: 'UNCOMMON',
                        iconUrl: null,
                        animationUrl: null,
                        effectColor: '#A6E22E',
                        glowEffect: true,
                        particleEffect: false,
                        baseCost: 1500,
                        duration: 300,
                        maxStacks: 1,
                        cooldownDuration: 900,
                        isLimited: false,
                        effects: [
                          {
                            id: 'effect-1',
                            type: 'STAT_BOOST',
                            targetStat: 'trading_speed',
                            modifier: 25,
                            modifierType: 'PERCENT_INCREASE',
                            triggerCondition: 'on_application',
                            duration: 300
                          }
                        ],
                        acquisitionSources: ['PURCHASE', 'REWARDS'],
                        requirements: null,
                        createdAt: new Date(),
                        updatedAt: new Date()
                      },
                      quantity: 3,
                      acquiredAt: new Date(),
                      lastUsed: null,
                      totalUsageCount: 0
                    },
                    {
                      id: 'defense-shield-1',
                      userId: 'demo-user',
                      powerupType: {
                        id: 'defense-shield',
                        name: 'defense_shield',
                        displayName: 'Defense Shield',
                        description: 'Protects cards from negative effects for 10 minutes',
                        category: 'DEFENSE',
                        rarity: 'RARE',
                        iconUrl: null,
                        animationUrl: null,
                        effectColor: '#66D9EF',
                        glowEffect: true,
                        particleEffect: true,
                        baseCost: 3500,
                        duration: 600,
                        maxStacks: 1,
                        cooldownDuration: 1800,
                        isLimited: false,
                        effects: [
                          {
                            id: 'effect-2',
                            type: 'PROTECTION',
                            targetStat: 'status_immunity',
                            modifier: 100,
                            modifierType: 'PERCENT_INCREASE',
                            triggerCondition: 'on_negative_effect',
                            duration: 600
                          }
                        ],
                        acquisitionSources: ['PURCHASE', 'CRAFTING'],
                        requirements: null,
                        createdAt: new Date(),
                        updatedAt: new Date()
                      },
                      quantity: 1,
                      acquiredAt: new Date(),
                      lastUsed: null,
                      totalUsageCount: 2
                    }
                  ]}
                  onPowerupSelect={(powerupId: string) => console.log('Selected powerup:', powerupId)}
                  onPowerupApply={(powerupId: string, cardId?: string) => console.log('Applied powerup:', powerupId, 'to card:', cardId)}
                  className="mt-6"
                />
              </GlassCard>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Privacy Settings */}
              <ProfilePrivacySettings />
              
              {/* Social Links */}
              <SocialProfileLinks />
              
              {/* Profile Settings */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Profile Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F8EFD6]">Public Profile</span>
                    <Button variant="ghost" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F8EFD6]">Trading Notifications</span>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F8EFD6]">Account Security</span>
                    <Button variant="ghost" size="sm">Review</Button>
                  </div>
                </div>
              </GlassCard>

              {/* Profile Customization */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Customization</h3>
                <div className="aspect-video bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 rounded-lg flex items-center justify-center border border-[#75715E]/30">
                  <div className="text-center">
                    <Settings className="w-16 h-16 text-[#66D9EF] mx-auto mb-4" />
                    <span className="text-[#F8EFD6] text-lg">Profile Customization</span>
                    <div className="text-sm text-[#75715E] mt-2">
                      Theme preferences, backgrounds, and personal branding options
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
    </div>
  )
}
