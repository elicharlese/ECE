'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { 
  Settings, 
  Save, 
  RefreshCw,
  Globe,
  Database,
  Mail,
  Smartphone,
  CreditCard,
  Shield,
  Zap,
  Code,
  Palette,
  Bell,
  Users,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  Key,
  Server,
  Monitor,
  Wifi,
  Cloud
} from 'lucide-react'

interface SettingSection {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  settings: Setting[]
}

interface Setting {
  id: string
  name: string
  description: string
  type: 'text' | 'textarea' | 'boolean' | 'number' | 'select' | 'password'
  value: any
  options?: Array<{ label: string; value: string }>
  sensitive?: boolean
  required?: boolean
}

const settingSections: SettingSection[] = [
  {
    id: 'general',
    name: 'General Settings',
    description: 'Basic platform configuration and preferences',
    icon: Settings,
    settings: [
      {
        id: 'platform_name',
        name: 'Platform Name',
        description: 'Display name for your platform',
        type: 'text',
        value: 'ECE Trading Cards',
        required: true
      },
      {
        id: 'platform_description',
        name: 'Platform Description',
        description: 'Brief description shown on login and marketing pages',
        type: 'textarea',
        value: 'The ultimate trading card marketplace for corporate entertainment'
      },
      {
        id: 'maintenance_mode',
        name: 'Maintenance Mode',
        description: 'Enable to temporarily disable user access',
        type: 'boolean',
        value: false
      },
      {
        id: 'new_user_registration',
        name: 'New User Registration',
        description: 'Allow new users to register accounts',
        type: 'boolean',
        value: true
      }
    ]
  },
  {
    id: 'trading',
    name: 'Trading Settings',
    description: 'Configure trading parameters and market behavior',
    icon: Zap,
    settings: [
      {
        id: 'trading_enabled',
        name: 'Trading Enabled',
        description: 'Enable or disable all trading activities',
        type: 'boolean',
        value: true
      },
      {
        id: 'minimum_trade_amount',
        name: 'Minimum Trade Amount',
        description: 'Minimum ECE tokens required for a trade',
        type: 'number',
        value: 10
      },
      {
        id: 'maximum_trade_amount',
        name: 'Maximum Trade Amount',
        description: 'Maximum ECE tokens allowed per trade',
        type: 'number',
        value: 10000
      },
      {
        id: 'trading_fee_percentage',
        name: 'Trading Fee (%)',
        description: 'Percentage fee charged on each trade',
        type: 'number',
        value: 2.5
      },
      {
        id: 'market_hours',
        name: 'Market Hours',
        description: 'When trading is allowed',
        type: 'select',
        value: '24/7',
        options: [
          { label: '24/7', value: '24/7' },
          { label: 'Business Hours (9AM-5PM)', value: 'business' },
          { label: 'Extended Hours (7AM-8PM)', value: 'extended' }
        ]
      }
    ]
  },
  {
    id: 'payments',
    name: 'Payment Settings',
    description: 'Configure payment processors and billing options',
    icon: CreditCard,
    settings: [
      {
        id: 'stripe_public_key',
        name: 'Stripe Public Key',
        description: 'Your Stripe publishable key',
        type: 'text',
        value: 'pk_test_...',
        required: true
      },
      {
        id: 'stripe_secret_key',
        name: 'Stripe Secret Key',
        description: 'Your Stripe secret key',
        type: 'password',
        value: 'sk_test_...',
        sensitive: true,
        required: true
      },
      {
        id: 'payment_methods_enabled',
        name: 'Enabled Payment Methods',
        description: 'Which payment methods to accept',
        type: 'select',
        value: 'card,bank',
        options: [
          { label: 'Credit Cards Only', value: 'card' },
          { label: 'Bank Transfers Only', value: 'bank' },
          { label: 'Both Cards and Bank', value: 'card,bank' }
        ]
      },
      {
        id: 'auto_payout_enabled',
        name: 'Automatic Payouts',
        description: 'Automatically process payouts to users',
        type: 'boolean',
        value: true
      }
    ]
  },
  {
    id: 'notifications',
    name: 'Notification Settings',
    description: 'Configure email, SMS, and push notification services',
    icon: Bell,
    settings: [
      {
        id: 'email_service_provider',
        name: 'Email Service Provider',
        description: 'Service used for sending emails',
        type: 'select',
        value: 'sendgrid',
        options: [
          { label: 'SendGrid', value: 'sendgrid' },
          { label: 'Mailgun', value: 'mailgun' },
          { label: 'AWS SES', value: 'ses' }
        ]
      },
      {
        id: 'sendgrid_api_key',
        name: 'SendGrid API Key',
        description: 'Your SendGrid API key',
        type: 'password',
        value: 'SG.xxx',
        sensitive: true
      },
      {
        id: 'from_email',
        name: 'From Email Address',
        description: 'Email address used as sender',
        type: 'text',
        value: 'noreply@ece.com',
        required: true
      },
      {
        id: 'sms_enabled',
        name: 'SMS Notifications',
        description: 'Enable SMS notifications via Twilio',
        type: 'boolean',
        value: false
      }
    ]
  },
  {
    id: 'security',
    name: 'Security Settings',
    description: 'Configure security policies and authentication',
    icon: Shield,
    settings: [
      {
        id: 'password_min_length',
        name: 'Minimum Password Length',
        description: 'Minimum number of characters for passwords',
        type: 'number',
        value: 8
      },
      {
        id: 'require_2fa',
        name: 'Require Two-Factor Authentication',
        description: 'Force all users to enable 2FA',
        type: 'boolean',
        value: false
      },
      {
        id: 'session_timeout',
        name: 'Session Timeout (minutes)',
        description: 'How long user sessions remain active',
        type: 'number',
        value: 480
      },
      {
        id: 'login_attempts_limit',
        name: 'Max Login Attempts',
        description: 'Number of failed attempts before account lockout',
        type: 'number',
        value: 5
      },
      {
        id: 'rate_limiting_enabled',
        name: 'API Rate Limiting',
        description: 'Enable rate limiting for API endpoints',
        type: 'boolean',
        value: true
      }
    ]
  },
  {
    id: 'system',
    name: 'System Settings',
    description: 'Configure system resources and performance',
    icon: Server,
    settings: [
      {
        id: 'database_url',
        name: 'Database URL',
        description: 'Primary database connection string',
        type: 'password',
        value: 'postgresql://...',
        sensitive: true,
        required: true
      },
      {
        id: 'redis_url',
        name: 'Redis URL',
        description: 'Redis cache connection string',
        type: 'password',
        value: 'redis://...',
        sensitive: true
      },
      {
        id: 'log_level',
        name: 'Log Level',
        description: 'Minimum log level to record',
        type: 'select',
        value: 'info',
        options: [
          { label: 'Debug', value: 'debug' },
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warn' },
          { label: 'Error', value: 'error' }
        ]
      },
      {
        id: 'backup_enabled',
        name: 'Automatic Backups',
        description: 'Enable scheduled database backups',
        type: 'boolean',
        value: true
      }
    ]
  }
]

export default function SettingsPage() {
  const [sections, setSections] = useState<SettingSection[]>(settingSections)
  const [selectedTab, setSelectedTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set())

  const handleSettingChange = (sectionId: string, settingId: string, value: any) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          settings: section.settings.map(setting => 
            setting.id === settingId ? { ...setting, value } : setting
          )
        }
      }
      return section
    }))
  }

  const handleSaveSettings = async (sectionId?: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (settingId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev)
      if (newSet.has(settingId)) {
        newSet.delete(settingId)
      } else {
        newSet.add(settingId)
      }
      return newSet
    })
  }

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedFields(prev => new Set([...prev, fieldId]))
      setTimeout(() => {
        setCopiedFields(prev => {
          const newSet = new Set(prev)
          newSet.delete(fieldId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const renderSettingInput = (section: SettingSection, setting: Setting) => {
    const inputId = `${section.id}_${setting.id}`
    
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={inputId}
              checked={setting.value}
              onCheckedChange={(checked) => handleSettingChange(section.id, setting.id, checked)}
            />
            <label htmlFor={inputId} className="text-sm font-medium text-foreground">
              {setting.value ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        )
      
      case 'select':
        return (
          <select
            id={inputId}
            value={setting.value}
            onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-ocean-accent focus:bg-white/10 transition-all"
          >
            {setting.options?.map(option => (
              <option key={option.value} value={option.value} className="bg-background text-foreground">
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'textarea':
        return (
          <Textarea
            id={inputId}
            value={setting.value}
            onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
            placeholder={setting.description}
            className="bg-white/5 border-border/30 text-foreground placeholder:text-muted-foreground resize-none"
            rows={3}
          />
        )
      
      case 'password':
        return (
          <div className="relative">
            <Input
              id={inputId}
              type={visiblePasswords.has(inputId) ? 'text' : 'password'}
              value={setting.value}
              onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
              placeholder={setting.description}
              className="pr-20 bg-white/5 border-border/30 text-foreground placeholder:text-muted-foreground"
            />
            <div className="absolute right-1 top-1 flex gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => togglePasswordVisibility(inputId)}
                className="h-8 w-8 p-0 hover:bg-white/10"
              >
                {visiblePasswords.has(inputId) ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(setting.value, inputId)}
                className="h-8 w-8 p-0 hover:bg-white/10"
              >
                {copiedFields.has(inputId) ? (
                  <Check className="h-4 w-4 text-monokai-green" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )
      
      case 'number':
        return (
          <Input
            id={inputId}
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingChange(section.id, setting.id, parseFloat(e.target.value) || 0)}
            placeholder={setting.description}
            className="bg-white/5 border-border/30 text-foreground placeholder:text-muted-foreground"
          />
        )
      
      default:
        return (
          <Input
            id={inputId}
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
            placeholder={setting.description}
            className="bg-white/5 border-border/30 text-foreground placeholder:text-muted-foreground"
          />
        )
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent mb-4">
              System Settings
            </h1>
            <p className="text-lg text-muted-foreground">
              Configure platform settings, integrations, and system parameters
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-monokai-green"
              >
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Settings saved!</span>
              </motion.div>
            )}
            
            <Button
              onClick={() => handleSaveSettings()}
              disabled={loading}
              className="bg-gradient-to-r from-monokai-green to-ocean-accent hover:from-monokai-green/80 hover:to-ocean-accent/80 text-white"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                </motion.div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save All Settings
            </Button>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 border border-border/30 mb-8">
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id}
                value={section.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-blue data-[state=active]:to-monokai-purple data-[state=active]:text-white"
              >
                <section.icon className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">{section.name.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            {sections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground flex items-center">
                          <section.icon className="h-5 w-5 mr-2 text-monokai-blue" />
                          {section.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      
                      <Button
                        onClick={() => handleSaveSettings(section.id)}
                        disabled={loading}
                        variant="outline"
                        className="border-border/30 text-muted-foreground hover:bg-white/10"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Section
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {section.settings.map((setting) => (
                        <div key={setting.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label 
                              htmlFor={`${section.id}_${setting.id}`}
                              className="text-sm font-medium text-foreground flex items-center gap-2"
                            >
                              {setting.name}
                              {setting.required && (
                                <span className="text-monokai-pink">*</span>
                              )}
                              {setting.sensitive && (
                                <Badge className="text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Sensitive
                                </Badge>
                              )}
                            </label>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2">
                            {setting.description}
                          </p>
                          
                          {renderSettingInput(section, setting)}
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>

        {/* System Status */}
        <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-monokai-green" />
            System Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-border/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Database</span>
                <div className="w-3 h-3 bg-monokai-green rounded-full animate-pulse"></div>
              </div>
              <p className="text-lg font-bold text-monokai-green">Connected</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-border/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Cache</span>
                <div className="w-3 h-3 bg-monokai-green rounded-full animate-pulse"></div>
              </div>
              <p className="text-lg font-bold text-monokai-green">Active</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-border/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Email Service</span>
                <div className="w-3 h-3 bg-monokai-green rounded-full animate-pulse"></div>
              </div>
              <p className="text-lg font-bold text-monokai-green">Operational</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-border/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Payment Gateway</span>
                <div className="w-3 h-3 bg-monokai-green rounded-full animate-pulse"></div>
              </div>
              <p className="text-lg font-bold text-monokai-green">Connected</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
