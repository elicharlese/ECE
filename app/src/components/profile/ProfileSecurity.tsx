'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Fingerprint,
  QrCode,
  Mail,
  Bell,
  User,
  MapPin,
  Calendar,
  Activity,
  Download,
  Trash2,
  RotateCcw,
  RefreshCw,
  Copy,
  ExternalLink,
  Info,
  Zap
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SecuritySession {
  id: string
  device: string
  location: string
  ipAddress: string
  browser: string
  lastActive: Date
  isCurrentSession: boolean
  isTrusted: boolean
}

interface SecurityAlert {
  id: string
  type: 'login' | 'trade' | 'setting_change' | 'suspicious_activity'
  title: string
  description: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  isRead: boolean
  location?: string
  device?: string
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  biometricEnabled: boolean
  loginNotifications: boolean
  tradeNotifications: boolean
  settingChangeNotifications: boolean
  sessionTimeout: number
  trustedDevicesEnabled: boolean
  locationBasedSecurity: boolean
  apiKeyRotation: boolean
  dataExportEnabled: boolean
}

interface ProfileSecurityProps {
  className?: string
}

export function ProfileSecurity({ className = '' }: ProfileSecurityProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newApiKeyName, setNewApiKeyName] = useState('')

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    biometricEnabled: false,
    loginNotifications: true,
    tradeNotifications: true,
    settingChangeNotifications: true,
    sessionTimeout: 30,
    trustedDevicesEnabled: true,
    locationBasedSecurity: false,
    apiKeyRotation: true,
    dataExportEnabled: false
  })

  const [sessions] = useState<SecuritySession[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.100',
      browser: 'Chrome 120.0',
      lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isCurrentSession: true,
      isTrusted: true
    },
    {
      id: '2',
      device: 'iPhone 15 Pro',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.101',
      browser: 'Safari Mobile',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isCurrentSession: false,
      isTrusted: true
    },
    {
      id: '3',
      device: 'Windows PC',
      location: 'New York, NY',
      ipAddress: '203.0.113.42',
      browser: 'Firefox 121.0',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isCurrentSession: false,
      isTrusted: false
    }
  ])

  const [securityAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'login',
      title: 'New Login from Unknown Device',
      description: 'Someone logged into your account from a Windows PC in New York, NY',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      severity: 'high',
      isRead: false,
      location: 'New York, NY',
      device: 'Windows PC'
    },
    {
      id: '2',
      type: 'trade',
      title: 'Large Trade Executed',
      description: 'A trade worth 500 ECE tokens was executed from your account',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      severity: 'medium',
      isRead: true
    },
    {
      id: '3',
      type: 'setting_change',
      title: 'Security Settings Modified',
      description: 'Two-factor authentication was enabled on your account',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      severity: 'low',
      isRead: true
    }
  ])

  const [apiKeys] = useState([
    {
      id: '1',
      name: 'Trading Bot API',
      key: 'ece_sk_live_1234567890abcdef...',
      created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      permissions: ['trade', 'read_portfolio']
    },
    {
      id: '2',
      name: 'Analytics Dashboard',
      key: 'ece_sk_live_abcdef1234567890...',
      created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 5 * 60 * 1000),
      permissions: ['read_portfolio', 'read_trades']
    }
  ])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'sessions', label: 'Active Sessions', icon: Monitor },
    { id: 'alerts', label: 'Security Alerts', icon: AlertTriangle },
    { id: 'settings', label: 'Security Settings', icon: Settings },
    { id: 'api', label: 'API Keys', icon: Key }
  ]

  const getSecurityScore = () => {
    let score = 0
    const maxScore = 100
    
    if (securitySettings.twoFactorEnabled) score += 25
    if (securitySettings.biometricEnabled) score += 15
    if (securitySettings.trustedDevicesEnabled) score += 10
    if (securitySettings.locationBasedSecurity) score += 15
    if (securitySettings.apiKeyRotation) score += 10
    if (securitySettings.loginNotifications) score += 10
    if (securitySettings.tradeNotifications) score += 10
    if (securitySettings.sessionTimeout <= 30) score += 5
    
    return Math.min(score, maxScore)
  }

  const getSecurityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: '#A6E22E', icon: ShieldCheck }
    if (score >= 60) return { level: 'Good', color: '#66D9EF', icon: Shield }
    if (score >= 40) return { level: 'Fair', color: '#E6DB74', icon: ShieldAlert }
    return { level: 'Poor', color: '#F92672', icon: ShieldOff }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const revokeSession = async (sessionId: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const toggleSecuritySetting = (setting: keyof SecuritySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const generateApiKey = async () => {
    if (!newApiKeyName.trim()) return
    
    setIsLoading(true)
    // Simulate API key generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setNewApiKeyName('')
    setIsLoading(false)
  }

  const securityScore = getSecurityScore()
  const securityLevel = getSecurityLevel(securityScore)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard variant="dark" className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <securityLevel.icon 
                    className="w-12 h-12" 
                    style={{ color: securityLevel.color }}
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#A6E22E] to-[#66D9EF] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-[#272822]">{securityScore}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#F8EFD6]">Security Dashboard</h2>
                  <p className="text-[#75715E]">Manage your account security and privacy settings</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: securityLevel.color }}>
                {securityLevel.level}
              </div>
              <div className="text-sm text-[#75715E]">Security Level</div>
              <div className="text-xs text-[#75715E] mt-1">Score: {securityScore}/100</div>
            </div>
          </div>

          {/* Quick Security Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${securitySettings.twoFactorEnabled ? 'bg-[#A6E22E]' : 'bg-[#F92672]'}`} />
              <div className="text-sm text-[#F8EFD6] font-medium">2FA</div>
              <div className="text-xs text-[#75715E]">{securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}</div>
            </div>
            
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${sessions.filter(s => s.isTrusted).length === sessions.length ? 'bg-[#A6E22E]' : 'bg-[#E6DB74]'}`} />
              <div className="text-sm text-[#F8EFD6] font-medium">Sessions</div>
              <div className="text-xs text-[#75715E]">{sessions.length} Active</div>
            </div>
            
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${securityAlerts.filter(a => !a.isRead && a.severity === 'high').length === 0 ? 'bg-[#A6E22E]' : 'bg-[#F92672]'}`} />
              <div className="text-sm text-[#F8EFD6] font-medium">Alerts</div>
              <div className="text-xs text-[#75715E]">{securityAlerts.filter(a => !a.isRead).length} Unread</div>
            </div>
            
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${apiKeys.length > 0 ? 'bg-[#66D9EF]' : 'bg-[#75715E]'}`} />
              <div className="text-sm text-[#F8EFD6] font-medium">API Keys</div>
              <div className="text-xs text-[#75715E]">{apiKeys.length} Active</div>
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
                  {tab.id === 'alerts' && securityAlerts.filter(a => !a.isRead).length > 0 && (
                    <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                      {securityAlerts.filter(a => !a.isRead).length}
                    </Badge>
                  )}
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Security Recommendations */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Security Recommendations</h3>
                <div className="space-y-4">
                  {!securitySettings.biometricEnabled && (
                    <div className="flex items-start space-x-3 p-4 bg-[#E6DB74]/10 border border-[#E6DB74]/30 rounded-lg">
                      <Fingerprint className="w-5 h-5 text-[#E6DB74] mt-0.5" />
                      <div className="flex-1">
                        <div className="text-[#E6DB74] font-medium mb-1">Enable Biometric Authentication</div>
                        <div className="text-sm text-[#75715E] mb-3">Add an extra layer of security with fingerprint or face recognition</div>
                        <Button variant="outline">
                          Enable Biometrics
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!securitySettings.locationBasedSecurity && (
                    <div className="flex items-start space-x-3 p-4 bg-[#66D9EF]/10 border border-[#66D9EF]/30 rounded-lg">
                      <MapPin className="w-5 h-5 text-[#66D9EF] mt-0.5" />
                      <div className="flex-1">
                        <div className="text-[#66D9EF] font-medium mb-1">Enable Location-Based Security</div>
                        <div className="text-sm text-[#75715E] mb-3">Get alerted when your account is accessed from unusual locations</div>
                        <Button variant="outline">
                          Enable Location Security
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {sessions.some(s => !s.isTrusted) && (
                    <div className="flex items-start space-x-3 p-4 bg-[#F92672]/10 border border-[#F92672]/30 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-[#F92672] mt-0.5" />
                      <div className="flex-1">
                        <div className="text-[#F92672] font-medium mb-1">Untrusted Sessions Detected</div>
                        <div className="text-sm text-[#75715E] mb-3">You have active sessions from devices that aren't marked as trusted</div>
                        <Button variant="outline" onClick={() => setActiveTab('sessions')}>
                          Review Sessions
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Recent Security Activity */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Recent Security Activity</h3>
                <div className="space-y-3">
                  {securityAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center space-x-3 p-3 bg-[#272822]/30 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.severity === 'critical' ? 'bg-[#F92672]' :
                        alert.severity === 'high' ? 'bg-[#FD5C63]' :
                        alert.severity === 'medium' ? 'bg-[#E6DB74]' : 'bg-[#A6E22E]'
                      }`} />
                      <div className="flex-1">
                        <div className="text-[#F8EFD6] font-medium">{alert.title}</div>
                        <div className="text-sm text-[#75715E]">{formatTimeAgo(alert.timestamp)}</div>
                      </div>
                      {!alert.isRead && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4" onClick={() => setActiveTab('alerts')}>
                  View All Alerts
                </Button>
              </GlassCard>
            </div>
          )}

          {/* Active Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <GlassCard variant="dark" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6]">Active Sessions</h3>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 bg-[#272822]/30 rounded-lg border border-[#75715E]/20">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            session.device.includes('MacBook') || session.device.includes('PC') ? 'bg-[#66D9EF]/20' : 'bg-[#A6E22E]/20'
                          }`}>
                            {session.device.includes('MacBook') || session.device.includes('PC') ? (
                              <Monitor className="w-6 h-6 text-[#66D9EF]" />
                            ) : (
                              <Smartphone className="w-6 h-6 text-[#A6E22E]" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-[#F8EFD6] font-medium">{session.device}</span>
                              {session.isCurrentSession && (
                                <Badge variant="secondary" className="text-xs">Current</Badge>
                              )}
                              {session.isTrusted && (
                                <Badge variant="outline" className="text-xs text-[#A6E22E] border-[#A6E22E]/30">Trusted</Badge>
                              )}
                            </div>
                            
                            <div className="space-y-1 text-sm text-[#75715E]">
                              <div className="flex items-center space-x-2">
                                <Globe className="w-3 h-3" />
                                <span>{session.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Activity className="w-3 h-3" />
                                <span>{session.browser} • {session.ipAddress}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3 h-3" />
                                <span>Last active {formatTimeAgo(session.lastActive)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {!session.isCurrentSession && (
                          <Button
                            variant="outline"
                           
                            onClick={() => revokeSession(session.id)}
                            disabled={isLoading}
                            className="text-[#F92672] border-[#F92672]/30 hover:bg-[#F92672]/10"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Security Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <GlassCard variant="dark" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6]">Security Alerts</h3>
                  <Button variant="outline">
                    Mark All Read
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${
                      alert.isRead ? 'bg-[#272822]/30 border-[#75715E]/20' : 'bg-[#272822]/50 border-[#A6E22E]/30'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            alert.severity === 'critical' ? 'bg-[#F92672]' :
                            alert.severity === 'high' ? 'bg-[#FD5C63]' :
                            alert.severity === 'medium' ? 'bg-[#E6DB74]' : 'bg-[#A6E22E]'
                          }`} />
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-[#F8EFD6] font-medium">{alert.title}</span>
                              <Badge variant={
                                alert.severity === 'critical' ? 'destructive' :
                                alert.severity === 'high' ? 'destructive' :
                                alert.severity === 'medium' ? 'secondary' : 'outline'
                              } className="text-xs">
                                {alert.severity.toUpperCase()}
                              </Badge>
                              {!alert.isRead && (
                                <Badge variant="secondary" className="text-xs bg-[#A6E22E]/20 text-[#A6E22E]">New</Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-[#75715E] mb-2">{alert.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-[#75715E]">
                              <span>{formatTimeAgo(alert.timestamp)}</span>
                              {alert.location && (
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{alert.location}</span>
                                </span>
                              )}
                              {alert.device && (
                                <span className="flex items-center space-x-1">
                                  <Monitor className="w-3 h-3" />
                                  <span>{alert.device}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="ghost">
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Authentication Settings */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F8EFD6] font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-[#75715E]">Require 2FA for all logins</div>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={() => toggleSecuritySetting('twoFactorEnabled')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F8EFD6] font-medium">Biometric Authentication</div>
                        <div className="text-sm text-[#75715E]">Use fingerprint or face recognition</div>
                      </div>
                      <Switch
                        checked={securitySettings.biometricEnabled}
                        onCheckedChange={() => toggleSecuritySetting('biometricEnabled')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F8EFD6] font-medium">Trusted Devices</div>
                        <div className="text-sm text-[#75715E]">Remember trusted devices</div>
                      </div>
                      <Switch
                        checked={securitySettings.trustedDevicesEnabled}
                        onCheckedChange={() => toggleSecuritySetting('trustedDevicesEnabled')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F8EFD6] font-medium">Location-Based Security</div>
                        <div className="text-sm text-[#75715E]">Alert on unusual locations</div>
                      </div>
                      <Switch
                        checked={securitySettings.locationBasedSecurity}
                        onCheckedChange={() => toggleSecuritySetting('locationBasedSecurity')}
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* Notification Settings */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F8EFD6] font-medium">Login Notifications</div>
                        <div className="text-sm text-[#75715E]">Notify on new login attempts</div>
                      </div>
                      <Switch
                        checked={securitySettings.loginNotifications}
                        onCheckedChange={() => toggleSecuritySetting('loginNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F8EFD6] font-medium">Trade Notifications</div>
                        <div className="text-sm text-[#75715E]">Notify on large trades</div>
                      </div>
                      <Switch
                        checked={securitySettings.tradeNotifications}
                        onCheckedChange={() => toggleSecuritySetting('tradeNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F8EFD6] font-medium">Setting Change Notifications</div>
                        <div className="text-sm text-[#75715E]">Notify on security changes</div>
                      </div>
                      <Switch
                        checked={securitySettings.settingChangeNotifications}
                        onCheckedChange={() => toggleSecuritySetting('settingChangeNotifications')}
                      />
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Advanced Settings */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Advanced Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[#F8EFD6] font-medium">Automatic API Key Rotation</div>
                      <div className="text-sm text-[#75715E]">Rotate API keys every 90 days</div>
                    </div>
                    <Switch
                      checked={securitySettings.apiKeyRotation}
                      onCheckedChange={() => toggleSecuritySetting('apiKeyRotation')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[#F8EFD6] font-medium">Data Export</div>
                      <div className="text-sm text-[#75715E]">Allow data export requests</div>
                    </div>
                    <Switch
                      checked={securitySettings.dataExportEnabled}
                      onCheckedChange={() => toggleSecuritySetting('dataExportEnabled')}
                    />
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <GlassCard variant="dark" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6]">API Keys</h3>
                  <Button onClick={() => setShowApiKeys(!showApiKeys)} variant="outline">
                    {showApiKeys ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showApiKeys ? 'Hide' : 'Show'} Keys
                  </Button>
                </div>

                {/* Create New API Key */}
                <div className="p-4 bg-[#272822]/30 rounded-lg border border-[#75715E]/20 mb-6">
                  <h4 className="text-[#F8EFD6] font-medium mb-3">Create New API Key</h4>
                  <div className="flex items-center space-x-3">
                    <Input
                      placeholder="API Key Name (e.g., Trading Bot)"
                      value={newApiKeyName}
                      onChange={(e) => setNewApiKeyName(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={generateApiKey}
                      disabled={!newApiKeyName.trim() || isLoading}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      {isLoading ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-4 bg-[#272822]/30 rounded-lg border border-[#75715E]/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[#F8EFD6] font-medium">{apiKey.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {apiKey.permissions.join(', ')}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-[#75715E]">
                            <div className="flex items-center space-x-2">
                              <Key className="w-3 h-3" />
                              <span className="font-mono">
                                {showApiKeys ? apiKey.key : '●'.repeat(32) + '...'}
                              </span>
                              {showApiKeys && (
                                <Button variant="ghost" className="h-6 w-6 p-0">
                                  <Copy className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3 h-3" />
                              <span>Created {formatTimeAgo(apiKey.created)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Activity className="w-3 h-3" />
                              <span>Last used {formatTimeAgo(apiKey.lastUsed)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" className="text-[#F92672] hover:bg-[#F92672]/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
