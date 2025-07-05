'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarketplaceDashboard } from '@/components/marketplace-dashboard'
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Activity,
  Zap,
  Database,
  Shield,
  BarChart3
} from 'lucide-react'

interface AdminAction {
  id: string
  title: string
  description: string
  type: 'automation' | 'management' | 'security'
  status: 'active' | 'inactive' | 'warning'
  lastRun?: Date
  icon: React.ComponentType<any>
}

const adminActions: AdminAction[] = [
  {
    id: 'create-markets',
    title: 'Create Daily Markets',
    description: 'Generate new betting markets based on company performance metrics',
    type: 'automation',
    status: 'active',
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: TrendingUp
  },
  {
    id: 'settle-markets',
    title: 'Settle Expired Markets',
    description: 'Process payouts for completed betting markets',
    type: 'automation',
    status: 'active',
    lastRun: new Date(Date.now() - 30 * 60 * 1000),
    icon: CheckCircle
  },
  {
    id: 'close-auctions',
    title: 'Close Ended Auctions',
    description: 'Finalize auctions and transfer card ownership',
    type: 'automation',
    status: 'active',
    lastRun: new Date(Date.now() - 45 * 60 * 1000),
    icon: CheckCircle
  },
  {
    id: 'resolve-battles',
    title: 'Resolve M&A Battles',
    description: 'Complete voting periods and distribute battle rewards',
    type: 'automation',
    status: 'warning',
    lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000),
    icon: AlertTriangle
  },
  {
    id: 'user-management',
    title: 'User Account Management',
    description: 'Monitor user activity and handle account issues',
    type: 'management',
    status: 'active',
    icon: Users
  },
  {
    id: 'fraud-detection',
    title: 'Fraud Detection System',
    description: 'Monitor for suspicious trading patterns and behaviors',
    type: 'security',
    status: 'active',
    icon: Shield
  }
]

export default function MarketplaceAdminPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [loading, setLoading] = useState<string | null>(null)
  const [logs, setLogs] = useState<Array<{
    id: string
    timestamp: Date
    action: string
    status: 'success' | 'error' | 'warning'
    message: string
  }>>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      action: 'create-markets',
      status: 'success',
      message: 'Created 5 new betting markets successfully'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      action: 'settle-markets',
      status: 'success',
      message: 'Settled 3 expired markets, distributed 2,450 ECE in payouts'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      action: 'close-auctions',
      status: 'warning',
      message: 'Auction settlement delayed - high network congestion'
    }
  ])

  const executeAction = async (actionId: string) => {
    setLoading(actionId)
    
    try {
      const response = await fetch(`/api/marketplace/automation?action=${actionId}`, {
        method: 'GET'
      })
      
      const result = await response.json()
      
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        action: actionId,
        status: result.success ? 'success' as const : 'error' as const,
        message: result.success 
          ? `Action completed successfully: ${JSON.stringify(result)}`
          : `Action failed: ${result.error}`
      }
      
      setLogs(prev => [newLog, ...prev.slice(0, 9)])
      
    } catch (error) {
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        action: actionId,
        status: 'error' as const,
        message: `Network error: ${error}`
      }
      
      setLogs(prev => [newLog, ...prev.slice(0, 9)])
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      case 'warning': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'inactive': return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getLogStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-[#A6E22E]'
      case 'error': return 'text-[#F92672]'
      case 'warning': return 'text-[#E6DB74]'
      default: return 'text-[#75715E]'
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#272822] to-[#1a1a15] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent mb-4">
            Marketplace Administration
          </h1>
          <p className="text-lg text-[#75715E]">
            Monitor and manage all marketplace operations
          </p>
        </motion.div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#272822]/50 border border-[#75715E]/30 mb-8">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#A6E22E] data-[state=active]:to-[#3EBA7C] data-[state=active]:text-[#272822]"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="automation"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#66D9EF] data-[state=active]:to-[#819AFF] data-[state=active]:text-[#272822]"
            >
              <Zap className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger 
              value="management"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F92672] data-[state=active]:to-[#FD5C63] data-[state=active]:text-[#F8EFD6]"
            >
              <Settings className="h-4 w-4 mr-2" />
              Management
            </TabsTrigger>
            <TabsTrigger 
              value="logs"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E6DB74] data-[state=active]:to-[#E6DB74] data-[state=active]:text-[#272822]"
            >
              <Activity className="h-4 w-4 mr-2" />
              System Logs
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="mt-0">
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MarketplaceDashboard />
              </motion.div>
            </TabsContent>

            <TabsContent value="automation" className="mt-0">
              <motion.div
                key="automation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {adminActions.filter(action => action.type === 'automation').map((action) => (
                    <Card key={action.id} className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#66D9EF]/20 rounded-lg">
                            <action.icon className="h-5 w-5 text-[#66D9EF]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#F8EFD6]">{action.title}</h3>
                            <p className="text-sm text-[#75715E]">{action.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status}
                        </Badge>
                      </div>

                      {action.lastRun && (
                        <div className="text-xs text-[#75715E] mb-4">
                          Last run: {formatTimeAgo(action.lastRun)}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => executeAction(action.id)}
                          disabled={loading === action.id}
                          className="flex-1 bg-gradient-to-r from-[#66D9EF] to-[#819AFF] hover:from-[#66D9EF]/80 hover:to-[#819AFF]/80 text-[#272822] font-semibold"
                        >
                          {loading === action.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                            </motion.div>
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          Run Now
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="management" className="mt-0">
              <motion.div
                key="management"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {adminActions.filter(action => action.type === 'management' || action.type === 'security').map((action) => (
                    <Card key={action.id} className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${action.type === 'security' ? 'bg-[#F92672]/20' : 'bg-[#A6E22E]/20'}`}>
                            <action.icon className={`h-5 w-5 ${action.type === 'security' ? 'text-[#F92672]' : 'text-[#A6E22E]'}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#F8EFD6]">{action.title}</h3>
                            <p className="text-sm text-[#75715E]">{action.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className={`flex-1 ${action.type === 'security' 
                            ? 'bg-gradient-to-r from-[#F92672] to-[#FD5C63] hover:from-[#F92672]/80 hover:to-[#FD5C63]/80 text-[#F8EFD6]'
                            : 'bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822]'
                          } font-semibold`}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="logs" className="mt-0">
              <motion.div
                key="logs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
                  <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-[#E6DB74]" />
                    System Activity Logs
                  </h3>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {logs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 bg-[#272822]/50 rounded-lg border border-[#75715E]/20"
                      >
                        <div className={`mt-1 ${getLogStatusColor(log.status)}`}>
                          {log.status === 'success' && <CheckCircle className="h-4 w-4" />}
                          {log.status === 'error' && <AlertTriangle className="h-4 w-4" />}
                          {log.status === 'warning' && <AlertTriangle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[#F8EFD6]">
                              {adminActions.find(a => a.id === log.action)?.title || log.action}
                            </span>
                            <span className="text-xs text-[#75715E]">
                              {formatTimeAgo(log.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-[#75715E]">{log.message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}
