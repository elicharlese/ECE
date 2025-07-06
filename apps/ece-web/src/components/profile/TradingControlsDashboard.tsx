'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings,
  Bell,
  Shield,
  DollarSign,
  Zap,
  Lock,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Target,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Info,
  RefreshCw,
  Toggle
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'

interface TradingLimits {
  dailySpendLimit: number
  weeklySpendLimit: number
  maxTradeValue: number
  minTradeValue: number
  autoTradingEnabled: boolean
  highValueAuthRequired: boolean
}

interface NotificationSettings {
  tradeBids: boolean
  tradeBets: boolean
  battleInvites: boolean
  priceAlerts: boolean
  marketUpdates: boolean
  securityAlerts: boolean
  weeklyReports: boolean
}

interface AutoTradingRule {
  id: string
  name: string
  type: 'buy' | 'sell' | 'exchange'
  condition: string
  action: string
  isActive: boolean
  triggeredCount: number
  lastTriggered?: Date
}

interface TradingTemplate {
  id: string
  name: string
  description: string
  type: 'quick_buy' | 'bulk_trade' | 'auction_bid' | 'custom'
  settings: any
  usageCount: number
  lastUsed?: Date
}

export function TradingControlsDashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  const [tradingLimits, setTradingLimits] = useState<TradingLimits>({
    dailySpendLimit: 500,
    weeklySpendLimit: 2000,
    maxTradeValue: 1000,
    minTradeValue: 5,
    autoTradingEnabled: true,
    highValueAuthRequired: true
  })
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    tradeBids: true,
    tradeBets: true,
    battleInvites: true,
    priceAlerts: true,
    marketUpdates: false,
    securityAlerts: true,
    weeklyReports: true
  })

  const [autoRules, setAutoRules] = useState<AutoTradingRule[]>([
    {
      id: '1',
      name: 'Buy Rare Cards Under $50',
      type: 'buy',
      condition: 'Card tier = Rare AND price < $50',
      action: 'Auto-purchase if available',
      isActive: true,
      triggeredCount: 12,
      lastTriggered: new Date('2025-07-04')
    },
    {
      id: '2', 
      name: 'Sell Duplicate Commons',
      type: 'sell',
      condition: 'Card tier = Common AND quantity > 3',
      action: 'List at market price',
      isActive: true,
      triggeredCount: 28,
      lastTriggered: new Date('2025-07-03')
    },
    {
      id: '3',
      name: 'Exchange for Set Completion',
      type: 'exchange',
      condition: 'Missing cards for set completion',
      action: 'Propose trades for needed cards',
      isActive: false,
      triggeredCount: 5
    }
  ])

  const [templates, setTemplates] = useState<TradingTemplate[]>([
    {
      id: '1',
      name: 'Quick Buy Rare',
      description: 'Instantly purchase rare cards under $100',
      type: 'quick_buy',
      settings: { maxPrice: 100, tier: 'rare' },
      usageCount: 34,
      lastUsed: new Date('2025-07-04')
    },
    {
      id: '2',
      name: 'Bulk Commons Sale',
      description: 'List multiple common cards for sale',
      type: 'bulk_trade',
      settings: { tier: 'common', action: 'sell', minQuantity: 5 },
      usageCount: 18,
      lastUsed: new Date('2025-07-02')
    },
    {
      id: '3',
      name: 'Auction Sniper',
      description: 'Automated bidding with maximum limits',
      type: 'auction_bid',
      settings: { strategy: 'last_minute', maxBid: 200 },
      usageCount: 9,
      lastUsed: new Date('2025-07-01')
    }
  ])

  const [currentSpending, setCurrentSpending] = useState({
    daily: 287,
    weekly: 856
  })

  const tradingStats = {
    totalTrades: 156,
    successRate: 89.7,
    avgTradeValue: 67.50,
    activeRules: autoRules.filter(rule => rule.isActive).length,
    templatesUsed: templates.reduce((sum, t) => sum + t.usageCount, 0)
  }

  const handleLimitChange = (key: keyof TradingLimits, value: number | boolean) => {
    setTradingLimits(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleAutoRule = (ruleId: string) => {
    setAutoRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'limits', label: 'Trading Limits', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'auto-trading', label: 'Auto Rules', icon: Zap },
    { id: 'templates', label: 'Templates', icon: Save },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard variant="dark" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2">Trading Controls</h2>
              <p className="text-[#75715E]">Manage your trading preferences, limits, and automation</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-[#75715E]">Trading Status</div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#A6E22E] rounded-full animate-pulse"></div>
                  <span className="text-[#A6E22E] font-medium">Active</span>
                </div>
              </div>
              
              <Button variant="accent" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Quick Setup
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF]">{tradingStats.totalTrades}</div>
              <div className="text-sm text-[#75715E]">Total Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E]">{tradingStats.successRate}%</div>
              <div className="text-sm text-[#75715E]">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6DB74]">${tradingStats.avgTradeValue}</div>
              <div className="text-sm text-[#75715E]">Avg Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F92672]">{tradingStats.activeRules}</div>
              <div className="text-sm text-[#75715E]">Active Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#819AFF]">{tradingStats.templatesUsed}</div>
              <div className="text-sm text-[#75715E]">Templates Used</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Section Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <GlassCard variant="dark" className="p-2">
          <div className="flex flex-wrap gap-1">
            {sections.map((section) => {
              const IconComponent = section.icon
              const isActive = activeSection === section.id
              
              return (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 text-[#F8EFD6] border border-[#A6E22E]/30'
                      : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/30'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#A6E22E]' : ''}`} />
                  <span className="text-sm font-medium">{section.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-gradient-to-r from-[#A6E22E]/10 to-[#66D9EF]/10 rounded-lg border border-[#A6E22E]/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Spending Overview */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Spending Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#F8EFD6]">Daily Limit</span>
                      <span className="text-[#75715E]">${currentSpending.daily} / ${tradingLimits.dailySpendLimit}</span>
                    </div>
                    <Progress 
                      value={(currentSpending.daily / tradingLimits.dailySpendLimit) * 100} 
                      className="mb-4"
                    />
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#F8EFD6]">Weekly Limit</span>
                      <span className="text-[#75715E]">${currentSpending.weekly} / ${tradingLimits.weeklySpendLimit}</span>
                    </div>
                    <Progress 
                      value={(currentSpending.weekly / tradingLimits.weeklySpendLimit) * 100} 
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-[#F8EFD6] mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ArrowUpRight className="w-4 h-4 text-[#F92672]" />
                          <span className="text-[#F8EFD6]">Card Purchase</span>
                        </div>
                        <span className="text-[#F92672]">-$45.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ArrowDownRight className="w-4 h-4 text-[#A6E22E]" />
                          <span className="text-[#F8EFD6]">Card Sale</span>
                        </div>
                        <span className="text-[#A6E22E]">+$78.50</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-[#66D9EF]" />
                          <span className="text-[#F8EFD6]">Auto Trade</span>
                        </div>
                        <span className="text-[#66D9EF]">$23.75</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              {/* Quick Actions */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Quick Actions</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="ghost" className="h-20 flex-col space-y-2">
                    <Play className="w-6 h-6 text-[#A6E22E]" />
                    <span className="text-sm">Start Trading</span>
                  </Button>
                  <Button variant="ghost" className="h-20 flex-col space-y-2">
                    <Pause className="w-6 h-6 text-[#F92672]" />
                    <span className="text-sm">Pause All</span>
                  </Button>
                  <Button variant="ghost" className="h-20 flex-col space-y-2">
                    <RotateCcw className="w-6 h-6 text-[#66D9EF]" />
                    <span className="text-sm">Reset Limits</span>
                  </Button>
                  <Button variant="ghost" className="h-20 flex-col space-y-2">
                    <Settings className="w-6 h-6 text-[#E6DB74]" />
                    <span className="text-sm">Configure</span>
                  </Button>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Trading Limits Section */}
          {activeSection === 'limits' && (
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Trading Limits & Controls</h3>
              
              <div className="space-y-6">
                {/* Spending Limits */}
                <div>
                  <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4">Spending Limits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#F8EFD6] mb-2">Daily Spend Limit</label>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          value={tradingLimits.dailySpendLimit}
                          onChange={(e) => handleLimitChange('dailySpendLimit', parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-[#75715E]">USD</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[#F8EFD6] mb-2">Weekly Spend Limit</label>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          value={tradingLimits.weeklySpendLimit}
                          onChange={(e) => handleLimitChange('weeklySpendLimit', parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-[#75715E]">USD</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trade Value Limits */}
                <div>
                  <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4">Trade Value Limits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#F8EFD6] mb-2">Maximum Trade Value</label>
                      <div className="space-y-2">
                        <Slider
                          value={[tradingLimits.maxTradeValue]}
                          onValueChange={(value) => handleLimitChange('maxTradeValue', value[0])}
                          max={5000}
                          min={100}
                          step={50}
                        />
                        <div className="text-center text-[#75715E]">${tradingLimits.maxTradeValue}</div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[#F8EFD6] mb-2">Minimum Trade Value</label>
                      <div className="space-y-2">
                        <Slider
                          value={[tradingLimits.minTradeValue]}
                          onValueChange={(value) => handleLimitChange('minTradeValue', value[0])}
                          max={100}
                          min={1}
                          step={1}
                        />
                        <div className="text-center text-[#75715E]">${tradingLimits.minTradeValue}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div>
                  <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4">Security Controls</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#F8EFD6]">Enable Auto-Trading</span>
                        <p className="text-sm text-[#75715E]">Allow automated trading based on your rules</p>
                      </div>
                      <Switch
                        checked={tradingLimits.autoTradingEnabled}
                        onCheckedChange={(checked) => handleLimitChange('autoTradingEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#F8EFD6]">High-Value Authentication</span>
                        <p className="text-sm text-[#75715E]">Require additional auth for trades over $500</p>
                      </div>
                      <Switch
                        checked={tradingLimits.highValueAuthRequired}
                        onCheckedChange={(checked) => handleLimitChange('highValueAuthRequired', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Notification Settings</h3>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => {
                  const labels = {
                    tradeBids: 'Trade Bids & Offers',
                    tradeBets: 'Trading Bets & Wagers',
                    battleInvites: 'Battle Invitations',
                    priceAlerts: 'Price Alerts',
                    marketUpdates: 'Market Updates',
                    securityAlerts: 'Security Alerts',
                    weeklyReports: 'Weekly Reports'
                  }
                  
                  const descriptions = {
                    tradeBids: 'Get notified when someone bids on your cards or makes offers',
                    tradeBets: 'Notifications for betting opportunities and outcomes',
                    battleInvites: 'Alerts when other players challenge you to battles',
                    priceAlerts: 'Price change notifications for your watchlist',
                    marketUpdates: 'General market trends and news updates',
                    securityAlerts: 'Important security and account alerts',
                    weeklyReports: 'Weekly summary of your trading activity'
                  }
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-[#272822]/30 rounded-lg">
                      <div>
                        <span className="text-[#F8EFD6] font-medium">{labels[key as keyof typeof labels]}</span>
                        <p className="text-sm text-[#75715E] mt-1">{descriptions[key as keyof typeof descriptions]}</p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => handleNotificationChange(key as keyof NotificationSettings, checked)}
                      />
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          )}

          {/* Auto-Trading Rules Section */}
          {activeSection === 'auto-trading' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#F8EFD6]">Auto-Trading Rules</h3>
                <Button variant="accent" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
              
              <div className="space-y-4">
                {autoRules.map((rule) => (
                  <GlassCard key={rule.id} variant="dark" className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-[#F8EFD6]">{rule.name}</h4>
                          <Badge variant={rule.isActive ? 'success' : 'secondary'}>
                            {rule.isActive ? 'Active' : 'Paused'}
                          </Badge>
                          <Badge variant="outline">
                            {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-[#75715E]">Condition: </span>
                            <span className="text-[#F8EFD6]">{rule.condition}</span>
                          </div>
                          <div>
                            <span className="text-sm text-[#75715E]">Action: </span>
                            <span className="text-[#F8EFD6]">{rule.action}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAutoRule(rule.id)}
                        >
                          {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center border-t border-[#75715E]/30 pt-4">
                      <div>
                        <div className="text-lg font-bold text-[#66D9EF]">{rule.triggeredCount}</div>
                        <div className="text-sm text-[#75715E]">Times Triggered</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#A6E22E]">
                          {rule.lastTriggered ? rule.lastTriggered.toLocaleDateString() : 'Never'}
                        </div>
                        <div className="text-sm text-[#75715E]">Last Triggered</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#E6DB74]">
                          {rule.isActive ? 'Running' : 'Stopped'}
                        </div>
                        <div className="text-sm text-[#75715E]">Status</div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Templates Section */}
          {activeSection === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#F8EFD6]">Trading Templates</h3>
                <Button variant="accent" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <GlassCard key={template.id} variant="dark" className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-[#F8EFD6] mb-1">{template.name}</h4>
                        <p className="text-sm text-[#75715E] mb-2">{template.description}</p>
                        <Badge variant="outline">{template.type.replace('_', ' ')}</Badge>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3 border-t border-[#75715E]/30 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#75715E]">Usage Count</span>
                        <span className="text-[#F8EFD6] font-medium">{template.usageCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#75715E]">Last Used</span>
                        <span className="text-[#F8EFD6] font-medium">
                          {template.lastUsed ? template.lastUsed.toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button variant="ghost" size="sm" className="flex-1">
                          Use Template
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Security Settings</h3>
              
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="p-4 bg-[#272822]/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-[#F8EFD6]">Two-Factor Authentication</h4>
                      <p className="text-sm text-[#75715E]">Add an extra layer of security for high-value trades</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset Codes
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>

                {/* Trading Session Security */}
                <div className="p-4 bg-[#272822]/30 rounded-lg">
                  <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4">Trading Session Security</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#F8EFD6]">Auto-logout inactive sessions</span>
                        <p className="text-sm text-[#75715E]">Automatically end trading sessions after inactivity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#F8EFD6]">IP address monitoring</span>
                        <p className="text-sm text-[#75715E]">Alert for trades from new locations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#F8EFD6]">Device verification</span>
                        <p className="text-sm text-[#75715E]">Require verification for new devices</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Privacy Controls */}
                <div className="p-4 bg-[#272822]/30 rounded-lg">
                  <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4">Privacy Controls</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#F8EFD6]">Hide trading activity</span>
                        <p className="text-sm text-[#75715E]">Keep your trading history private</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#F8EFD6]">Anonymous bidding</span>
                        <p className="text-sm text-[#75715E]">Hide your identity in auctions</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#F8EFD6]">Public battle participation</span>
                        <p className="text-sm text-[#75715E]">Allow others to see your battle stats</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
