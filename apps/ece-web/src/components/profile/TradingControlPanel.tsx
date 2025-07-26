'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  Shield, 
  Bell, 
  DollarSign, 
  TrendingUp, 
  Lock, 
  Eye, 
  EyeOff,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Save,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Activity,
  BarChart3,
  Calendar,
  Timer,
  Target,
  Layers,
  Filter,
  RefreshCw
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'

interface TradingSettings {
  maxDailySpend: number
  maxWeeklySpend: number
  autoTradingEnabled: boolean
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  notificationsEnabled: boolean
  publicProfile: boolean
  showTradingHistory: boolean
  requireConfirmation: boolean
  twoFactorEnabled: boolean
  autoRenewListings: boolean
  maxSimultaneousTrades: number
  minimumProfitMargin: number
}

interface TradingTemplate {
  id: string
  name: string
  description: string
  settings: Partial<TradingSettings>
  isActive: boolean
  createdAt: Date
  lastUsed?: Date
  successRate: number
}

interface TradingStats {
  totalTrades: number
  successfulTrades: number
  totalVolume: number
  avgTradeSize: number
  currentStreak: number
  bestStreak: number
  dailyLimit: number
  dailyUsed: number
  weeklyLimit: number
  weeklyUsed: number
}

interface TradingControlPanelProps {
  className?: string
}

export function TradingControlPanel({ className = '' }: TradingControlPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'templates' | 'stats' | 'security'>('settings')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const [settings, setSettings] = useState<TradingSettings>({
    maxDailySpend: 5000,
    maxWeeklySpend: 25000,
    autoTradingEnabled: false,
    riskLevel: 'moderate',
    notificationsEnabled: true,
    publicProfile: true,
    showTradingHistory: false,
    requireConfirmation: true,
    twoFactorEnabled: false,
    autoRenewListings: true,
    maxSimultaneousTrades: 10,
    minimumProfitMargin: 5
  })

  const [templates, setTemplates] = useState<TradingTemplate[]>([
    {
      id: '1',
      name: 'Conservative Trading',
      description: 'Low-risk, steady growth strategy',
      settings: {
        maxDailySpend: 1000,
        riskLevel: 'conservative',
        minimumProfitMargin: 10,
        maxSimultaneousTrades: 3
      },
      isActive: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      successRate: 85.2
    },
    {
      id: '2',
      name: 'Aggressive Growth',
      description: 'High-risk, high-reward strategy',
      settings: {
        maxDailySpend: 10000,
        riskLevel: 'aggressive',
        minimumProfitMargin: 3,
        maxSimultaneousTrades: 20
      },
      isActive: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(),
      successRate: 72.8
    }
  ])

  const [stats] = useState<TradingStats>({
    totalTrades: 247,
    successfulTrades: 189,
    totalVolume: 156780,
    avgTradeSize: 635,
    currentStreak: 8,
    bestStreak: 15,
    dailyLimit: 5000,
    dailyUsed: 1250,
    weeklyLimit: 25000,
    weeklyUsed: 8940
  })

  const handleSettingChange = (key: keyof TradingSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTemplateActivate = (templateId: string) => {
    setTemplates(prev => prev.map(template => ({
      ...template,
      isActive: template.id === templateId
    })))
    
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSettings(prev => ({ ...prev, ...template.settings }))
    }
  }

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId))
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'conservative': return '#A6E22E'
      case 'moderate': return '#E6DB74'
      case 'aggressive': return '#F92672'
      default: return '#66D9EF'
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return '#A6E22E'
    if (rate >= 60) return '#E6DB74'
    return '#F92672'
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
              <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2">Trading Control Panel</h2>
              <p className="text-[#75715E]">
                Configure your trading preferences, security settings, and automation rules
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {lastSaved && (
                <div className="text-sm text-[#75715E]">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </div>
              )}
              <Button 
                variant="accent" 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <GlassCard variant="dark" className="p-2">
          <div className="flex space-x-1">
            {[
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'templates', label: 'Templates', icon: Layers },
              { id: 'stats', label: 'Statistics', icon: BarChart3 },
              { id: 'security', label: 'Security', icon: Shield }
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
                      ? 'bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 text-[#F8EFD6] border border-[#A6E22E]/30'
                      : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/30'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#A6E22E]' : ''}`} />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Trading Limits */}
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-[#A6E22E]" />
                Trading Limits
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[#F8EFD6] text-sm font-medium mb-2">
                    Daily Spending Limit: {settings.maxDailySpend} ECE
                  </label>
                  <Slider
                    value={[settings.maxDailySpend]}
                    onValueChange={(value) => handleSettingChange('maxDailySpend', value[0])}
                    max={20000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#75715E] mt-1">
                    <span>100 ECE</span>
                    <span>20,000 ECE</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#F8EFD6] text-sm font-medium mb-2">
                    Weekly Spending Limit: {settings.maxWeeklySpend} ECE
                  </label>
                  <Slider
                    value={[settings.maxWeeklySpend]}
                    onValueChange={(value) => handleSettingChange('maxWeeklySpend', value[0])}
                    max={100000}
                    min={500}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#75715E] mt-1">
                    <span>500 ECE</span>
                    <span>100,000 ECE</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#F8EFD6] text-sm font-medium mb-2">
                    Maximum Simultaneous Trades: {settings.maxSimultaneousTrades}
                  </label>
                  <Slider
                    value={[settings.maxSimultaneousTrades]}
                    onValueChange={(value) => handleSettingChange('maxSimultaneousTrades', value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#75715E] mt-1">
                    <span>1 Trade</span>
                    <span>50 Trades</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Risk Management */}
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-[#E6DB74]" />
                Risk Management
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-[#F8EFD6] text-sm font-medium mb-3">
                    Risk Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['conservative', 'moderate', 'aggressive'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => handleSettingChange('riskLevel', level)}
                        className={`p-4 rounded-lg border transition-all ${
                          settings.riskLevel === level
                            ? 'border-[#A6E22E] bg-[#A6E22E]/10'
                            : 'border-[#75715E]/30 hover:border-[#75715E]'
                        }`}
                      >
                        <div className="text-center">
                          <div 
                            className="w-3 h-3 rounded-full mx-auto mb-2"
                            style={{ backgroundColor: getRiskLevelColor(level) }}
                          />
                          <div className="font-medium text-[#F8EFD6] capitalize">{level}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#F8EFD6] text-sm font-medium mb-2">
                    Minimum Profit Margin: {settings.minimumProfitMargin}%
                  </label>
                  <Slider
                    value={[settings.minimumProfitMargin]}
                    onValueChange={(value) => handleSettingChange('minimumProfitMargin', value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#75715E] mt-1">
                    <span>1%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Automation Settings */}
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-[#66D9EF]" />
                Automation
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#F8EFD6]">Auto Trading</div>
                    <div className="text-sm text-[#75715E]">Enable automated trading based on your rules</div>
                  </div>
                  <Switch
                    checked={settings.autoTradingEnabled}
                    onCheckedChange={(checked) => handleSettingChange('autoTradingEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#F8EFD6]">Auto-Renew Listings</div>
                    <div className="text-sm text-[#75715E]">Automatically renew expired listings</div>
                  </div>
                  <Switch
                    checked={settings.autoRenewListings}
                    onCheckedChange={(checked) => handleSettingChange('autoRenewListings', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#F8EFD6]">Require Confirmation</div>
                    <div className="text-sm text-[#75715E]">Confirm all trades before execution</div>
                  </div>
                  <Switch
                    checked={settings.requireConfirmation}
                    onCheckedChange={(checked) => handleSettingChange('requireConfirmation', checked)}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Privacy Settings */}
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-[#F92672]" />
                Privacy & Visibility
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#F8EFD6]">Public Trading Profile</div>
                    <div className="text-sm text-[#75715E]">Show your profile to other traders</div>
                  </div>
                  <Switch
                    checked={settings.publicProfile}
                    onCheckedChange={(checked) => handleSettingChange('publicProfile', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#F8EFD6]">Show Trading History</div>
                    <div className="text-sm text-[#75715E]">Make your trading history visible</div>
                  </div>
                  <Switch
                    checked={settings.showTradingHistory}
                    onCheckedChange={(checked) => handleSettingChange('showTradingHistory', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#F8EFD6]">Trading Notifications</div>
                    <div className="text-sm text-[#75715E]">Receive alerts for trading activities</div>
                  </div>
                  <Switch
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard variant="dark" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#F8EFD6]">Trading Templates</h3>
                <Button variant="accent">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>

              <div className="space-y-4">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border transition-all ${
                      template.isActive
                        ? 'border-[#A6E22E] bg-[#A6E22E]/10'
                        : 'border-[#75715E]/30 hover:border-[#75715E]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-[#F8EFD6]">{template.name}</h4>
                          {template.isActive && (
                            <Badge variant="secondary" className="bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          )}
                          <Badge 
                            style={{ 
                              backgroundColor: `${getSuccessRateColor(template.successRate)}20`,
                              color: getSuccessRateColor(template.successRate),
                              borderColor: `${getSuccessRateColor(template.successRate)}30`
                            }}
                          >
                            {template.successRate}% Success
                          </Badge>
                        </div>
                        <p className="text-[#75715E] text-sm mb-3">{template.description}</p>
                        <div className="text-xs text-[#75715E]">
                          Created: {template.createdAt.toLocaleDateString()} • 
                          Last used: {template.lastUsed?.toLocaleDateString() || 'Never'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          variant="ghost" 
                         
                          onClick={() => handleTemplateActivate(template.id)}
                          disabled={template.isActive}
                        >
                          {template.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                         
                          onClick={() => handleTemplateDelete(template.id)}
                          className="text-[#F92672] hover:text-[#F92672]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Usage Statistics */}
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Usage Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#A6E22E] mb-2">{stats.totalTrades}</div>
                  <div className="text-sm text-[#75715E]">Total Trades</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#66D9EF] mb-2">
                    {((stats.successfulTrades / stats.totalTrades) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-[#75715E]">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#E6DB74] mb-2">{stats.totalVolume.toLocaleString()}</div>
                  <div className="text-sm text-[#75715E]">Total Volume (ECE)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#F92672] mb-2">{stats.currentStreak}</div>
                  <div className="text-sm text-[#75715E]">Current Streak</div>
                </div>
              </div>
            </GlassCard>

            {/* Limit Usage */}
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Limit Usage</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#F8EFD6]">Daily Limit</span>
                    <span className="text-[#75715E]">
                      {stats.dailyUsed} / {stats.dailyLimit} ECE
                    </span>
                  </div>
                  <Progress value={(stats.dailyUsed / stats.dailyLimit) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#F8EFD6]">Weekly Limit</span>
                    <span className="text-[#75715E]">
                      {stats.weeklyUsed} / {stats.weeklyLimit} ECE
                    </span>
                  </div>
                  <Progress value={(stats.weeklyUsed / stats.weeklyLimit) * 100} className="h-2" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#A6E22E]" />
                Security Settings
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#F8EFD6]">Two-Factor Authentication</div>
                    <div className="text-sm text-[#75715E]">Add an extra layer of security to your account</div>
                  </div>
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
                  />
                </div>

                <div className="border-t border-[#75715E]/30 pt-6">
                  <h4 className="font-semibold text-[#F8EFD6] mb-4">Recent Security Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#272822]/30">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-[#A6E22E]" />
                        <div>
                          <div className="text-sm font-medium text-[#F8EFD6]">Successful login</div>
                          <div className="text-xs text-[#75715E]">2 hours ago from Chrome</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#272822]/30">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-[#E6DB74]" />
                        <div>
                          <div className="text-sm font-medium text-[#F8EFD6]">Settings changed</div>
                          <div className="text-xs text-[#75715E]">1 day ago from Safari</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
