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
  CreditCard
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { useSubscription } from '@/contexts/subscription-context'

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
  const [activeTab, setActiveTab] = useState('financials')
  const { subscription, isPro, isEnterprise } = useSubscription()

  const tabs = [
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'support', label: 'Support & Development', icon: HeadphonesIcon },
    { id: 'research', label: 'Market Research', icon: Search },
    { id: 'forecasts', label: 'Forecasts & Connections', icon: Network }
  ]

  return (
    <div className="container mx-auto px-4 space-y-8">
      {/* Business Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard variant="dark" className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Business Logo */}
            <div className="relative">
                <div className="w-24 h-24 bg-gradient-ocean rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                  <Building className="w-12 h-12" />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-beach-primary rounded-full text-white hover:bg-beach-primary/90 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Business Info */}
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  ECE Trading Enterprise
                </h1>
                <p className="text-muted-foreground mb-4">
                  @ece-trading • Founded 2024 • {subscription?.plan || 'Enterprise'} Plan
                </p>
                <p className="text-foreground max-w-2xl">
                  Leading digital trading card marketplace specializing in high-value collectibles, 
                  premium trading experiences, and enterprise-grade financial services.
                </p>
                
                {/* Business Badges */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  <span className="px-3 py-1 bg-gradient-tide text-white text-sm rounded-full">
                    Verified Business
                  </span>
                  <span className="px-3 py-1 bg-beach-secondary text-beach-dark text-sm rounded-full">
                    Enterprise Partner
                  </span>
                  <span className="px-3 py-1 bg-beach-success/20 text-beach-success text-sm rounded-full">
                    Top Performer
                  </span>
                  {isEnterprise && (
                    <span className="px-3 py-1 bg-[#F92672]/20 text-[#F92672] text-sm rounded-full">
                      Premium Features
                    </span>
                  )}
                </div>
              </div>

              {/* Business Actions */}
              <div className="flex flex-col space-y-2">
                <Button variant="accent" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Business Settings
                </Button>
                <Button variant="ghost" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Reports
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Business Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {businessStats.map((stat, index) => (
            <GlassCard key={stat.label} variant="light" animation="breathe" className="p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-ocean rounded-lg mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-beach-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {stat.label}
              </div>
              <div className={`text-xs font-medium ${stat.positive ? 'text-[#A6E22E]' : 'text-[#F92672]'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3 inline mr-1" /> : <ArrowDownRight className="w-3 h-3 inline mr-1" />}
                {stat.change}
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Business Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "accent" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </Button>
            ))}
          </div>

          {/* Business Tab Content */}
          <div className="space-y-6">
            {/* FINANCIALS TAB */}
            {activeTab === 'financials' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Breakdown */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Revenue Breakdown
                    </h3>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-[#A6E22E] mb-2">
                        ${financialMetrics.revenue.current.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        +{((financialMetrics.revenue.current - financialMetrics.revenue.previous) / financialMetrics.revenue.previous * 100).toFixed(1)}% from last month
                      </div>
                      {financialMetrics.revenue.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-foreground">{item.category}</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-beach-primary">
                              ${item.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Expenses */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Expenses
                    </h3>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-[#F92672] mb-2">
                        ${financialMetrics.expenses.total.toLocaleString()}
                      </div>
                      {financialMetrics.expenses.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-foreground">{item.category}</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-[#F92672]">
                              ${item.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Profit Summary */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Profit Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-[#66D9EF] mb-2">
                        ${financialMetrics.profit.toLocaleString()}
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Margin</span>
                          <span className="text-sm font-semibold text-[#A6E22E]">
                            {((financialMetrics.profit / financialMetrics.revenue.current) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Growth Rate</span>
                          <span className="text-sm font-semibold text-[#A6E22E]">+12.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Projected Q4</span>
                          <span className="text-sm font-semibold text-[#66D9EF]">$68,200</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Financial Chart Placeholder */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Revenue Trends</h3>
                  <div className="aspect-video bg-gradient-tide/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="w-16 h-16 text-[#66D9EF] mx-auto mb-4" />
                      <span className="text-foreground">Interactive Financial Charts</span>
                      <div className="text-sm text-muted-foreground mt-2">
                        Revenue, Expenses, and Profit visualization
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* PERFORMANCE TAB */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Trading Performance */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Trading Performance
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-[#A6E22E]">
                            ${performanceData.trading.volume.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Volume</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-[#66D9EF]">
                            {performanceData.trading.transactions.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Transactions</div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Average Value</span>
                        <span className="text-sm font-semibold text-beach-primary">
                          ${performanceData.trading.averageValue}
                        </span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* User Engagement */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      User Engagement
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-[#A6E22E]">
                            {performanceData.engagement.activeUsers.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Active Users</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-[#66D9EF]">
                            {performanceData.engagement.newSignups}
                          </div>
                          <div className="text-sm text-muted-foreground">New Signups</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Retention Rate</span>
                          <span className="text-sm font-semibold text-[#A6E22E]">
                            {performanceData.engagement.retention}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg Session</span>
                          <span className="text-sm font-semibold text-beach-primary">
                            {performanceData.engagement.avgSessionTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Top Performers */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Top Performers
                  </h3>
                  <div className="space-y-3">
                    {performanceData.trading.topPerformers.map((performer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-ocean rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{performer.name}</h4>
                            <p className="text-sm text-muted-foreground">{performer.trades} trades</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#A6E22E]">
                            +${performer.profit.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${performer.volume.toLocaleString()} volume
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* SUPPORT & DEVELOPMENT TAB */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Support Metrics */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <HeadphonesIcon className="w-5 h-5 mr-2" />
                      Support Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-[#F92672]">
                            {supportMetrics.tickets.open}
                          </div>
                          <div className="text-sm text-muted-foreground">Open Tickets</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-[#A6E22E]">
                            {supportMetrics.tickets.resolved}
                          </div>
                          <div className="text-sm text-muted-foreground">Resolved</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg Response Time</span>
                          <span className="text-sm font-semibold text-[#66D9EF]">
                            {supportMetrics.tickets.avgResponseTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Satisfaction</span>
                          <span className="text-sm font-semibold text-[#A6E22E]">
                            {supportMetrics.tickets.satisfaction}/5.0
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Development Metrics */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Development Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-[#A6E22E]">
                            {supportMetrics.development.features}
                          </div>
                          <div className="text-sm text-muted-foreground">New Features</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-[#F92672]">
                            {supportMetrics.development.bugs}
                          </div>
                          <div className="text-sm text-muted-foreground">Open Bugs</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Sprint Velocity</span>
                          <span className="text-sm font-semibold text-[#66D9EF]">
                            {supportMetrics.development.velocity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Uptime</span>
                          <span className="text-sm font-semibold text-[#A6E22E]">
                            {supportMetrics.development.uptime}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Team Performance */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Team Performance
                  </h3>
                  <div className="space-y-3">
                    {supportMetrics.team.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-tide rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#A6E22E]">
                            {member.rating}/5.0
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.tickets} tickets handled
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* MARKET RESEARCH TAB */}
            {activeTab === 'research' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Market Trends */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Market Trends
                    </h3>
                    <div className="space-y-4">
                      {marketData.trends.map((trend, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-foreground">{trend.category}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${trend.volume.toLocaleString()} volume
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-[#A6E22E]">
                              +{trend.growth}%
                            </div>
                            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                              trend.interest === 'Very High' ? 'bg-[#F92672]/20 text-[#F92672]' :
                              trend.interest === 'High' ? 'bg-[#A6E22E]/20 text-[#A6E22E]' :
                              'bg-[#66D9EF]/20 text-[#66D9EF]'
                            }`}>
                              {trend.interest}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Demographics */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Demographics
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Age Groups</h4>
                        {marketData.demographics.ages.map((age, index) => (
                          <div key={index} className="flex justify-between mb-1">
                            <span className="text-sm text-muted-foreground">{age.range}</span>
                            <span className="text-sm font-semibold text-beach-primary">
                              {age.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Regions</h4>
                        {marketData.demographics.regions.map((region, index) => (
                          <div key={index} className="flex justify-between items-center mb-1">
                            <span className="text-sm text-muted-foreground">{region.name}</span>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-beach-primary">
                                {region.percentage}%
                              </span>
                              <div className="text-xs text-[#A6E22E]">
                                +{region.growth}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Market Analysis Chart */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Market Analysis</h3>
                  <div className="aspect-video bg-gradient-tide/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 text-[#66D9EF] mx-auto mb-4" />
                      <span className="text-foreground">Market Share & Growth Analytics</span>
                      <div className="text-sm text-muted-foreground mt-2">
                        Demographic breakdowns and trend analysis
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* FORECASTS & CONNECTIONS TAB */}
            {activeTab === 'forecasts' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Predictions */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Business Forecasts
                    </h3>
                    <div className="space-y-4">
                      {forecastData.predictions.map((prediction, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-foreground">{prediction.metric}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              prediction.confidence >= 85 ? 'bg-[#A6E22E]/20 text-[#A6E22E]' :
                              prediction.confidence >= 75 ? 'bg-[#66D9EF]/20 text-[#66D9EF]' :
                              'bg-[#E6DB74]/20 text-[#E6DB74]'
                            }`}>
                              {prediction.confidence}% confidence
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Current: {typeof prediction.current === 'number' && prediction.current > 1000 
                                ? `$${prediction.current.toLocaleString()}` 
                                : prediction.current}
                            </span>
                            <span className="text-sm font-semibold text-[#A6E22E]">
                              Predicted: {typeof prediction.predicted === 'number' && prediction.predicted > 1000 
                                ? `$${prediction.predicted.toLocaleString()}` 
                                : prediction.predicted}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Partnerships */}
                  <GlassCard variant="dark" className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <Handshake className="w-5 h-5 mr-2" />
                      Strategic Partnerships
                    </h3>
                    <div className="space-y-3">
                      {forecastData.partnerships.map((partnership, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-foreground">{partnership.name}</h4>
                            <p className="text-sm text-muted-foreground">{partnership.type}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-beach-primary">
                              ${partnership.value.toLocaleString()}
                            </div>
                            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                              partnership.status === 'Active' ? 'bg-[#A6E22E]/20 text-[#A6E22E]' :
                              partnership.status === 'Pending' ? 'bg-[#E6DB74]/20 text-[#E6DB74]' :
                              'bg-[#66D9EF]/20 text-[#66D9EF]'
                            }`}>
                              {partnership.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Discounts & Connections */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                    <Network className="w-5 h-5 mr-2" />
                    Active Discounts & Connections
                  </h3>
                  <div className="space-y-3">
                    {forecastData.discounts.map((discount, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-foreground">{discount.code}</h4>
                          <p className="text-sm text-muted-foreground">
                            {discount.usage} uses • Expires {discount.expires}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#A6E22E]">
                            ${discount.savings.toLocaleString()} saved
                          </div>
                          <div className="text-xs text-[#66D9EF]">
                            Total savings generated
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Forecast Chart */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Business Projections</h3>
                  <div className="aspect-video bg-gradient-tide/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-[#66D9EF] mx-auto mb-4" />
                      <span className="text-foreground">Predictive Analytics Dashboard</span>
                      <div className="text-sm text-muted-foreground mt-2">
                        Revenue forecasts, partnership tracking, and growth projections
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>      </motion.div>
    </div>
  )
}
