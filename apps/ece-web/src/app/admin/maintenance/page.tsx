'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Database,
  Download,
  Upload,
  Calendar,
  Clock,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Shield,
  HardDrive,
  Archive,
  Trash2,
  Info
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BackupRecord {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  size: number // in MB
  status: 'completed' | 'running' | 'failed' | 'scheduled'
  createdAt: Date
  duration: number // in seconds
  location: string
  checksum: string
}

interface MaintenanceTask {
  id: string
  name: string
  description: string
  type: 'database' | 'cache' | 'logs' | 'system'
  schedule: string
  lastRun: Date
  nextRun: Date
  status: 'active' | 'paused' | 'failed'
  duration: number
  autoRun: boolean
}

interface SystemUpdate {
  id: string
  component: string
  currentVersion: string
  availableVersion: string
  type: 'security' | 'feature' | 'bugfix'
  priority: 'critical' | 'high' | 'medium' | 'low'
  releaseDate: Date
  description: string
  installed: boolean
}

const mockBackups: BackupRecord[] = [
  {
    id: '1',
    name: 'Full Database Backup',
    type: 'full',
    size: 2340,
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: 1820,
    location: 's3://ece-backups/2024-07-05/full-backup-001.sql.gz',
    checksum: 'sha256:a8b9c0d1e2f3...'
  },
  {
    id: '2',
    name: 'Incremental Backup',
    type: 'incremental',
    size: 145,
    status: 'completed',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    duration: 280,
    location: 's3://ece-backups/2024-07-05/inc-backup-002.sql.gz',
    checksum: 'sha256:b9c0d1e2f3a4...'
  },
  {
    id: '3',
    name: 'User Data Backup',
    type: 'differential',
    size: 890,
    status: 'running',
    createdAt: new Date(),
    duration: 0,
    location: 'In progress...',
    checksum: ''
  },
  {
    id: '4',
    name: 'Weekly Full Backup',
    type: 'full',
    size: 0,
    status: 'scheduled',
    createdAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 0,
    location: 'Scheduled',
    checksum: ''
  }
]

const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: '1',
    name: 'Database Optimization',
    description: 'Rebuild indexes and update statistics',
    type: 'database',
    schedule: '0 2 * * 0', // Weekly on Sunday at 2 AM
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000),
    status: 'active',
    duration: 1800,
    autoRun: true
  },
  {
    id: '2',
    name: 'Cache Cleanup',
    description: 'Clear expired cache entries',
    type: 'cache',
    schedule: '0 1 * * *', // Daily at 1 AM
    lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000),
    status: 'active',
    duration: 300,
    autoRun: true
  },
  {
    id: '3',
    name: 'Log Rotation',
    description: 'Archive and compress old log files',
    type: 'logs',
    schedule: '0 3 * * *', // Daily at 3 AM
    lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000),
    status: 'active',
    duration: 600,
    autoRun: true
  },
  {
    id: '4',
    name: 'Security Scan',
    description: 'Run automated security vulnerability scan',
    type: 'system',
    schedule: '0 0 * * 1', // Weekly on Monday at midnight
    lastRun: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'paused',
    duration: 2400,
    autoRun: false
  }
]

const mockSystemUpdates: SystemUpdate[] = [
  {
    id: '1',
    component: 'Next.js Framework',
    currentVersion: '15.1.4',
    availableVersion: '15.1.6',
    type: 'security',
    priority: 'high',
    releaseDate: new Date('2024-07-01'),
    description: 'Security patches and performance improvements',
    installed: false
  },
  {
    id: '2',
    component: 'PostgreSQL',
    currentVersion: '15.4',
    availableVersion: '15.7',
    type: 'bugfix',
    priority: 'medium',
    releaseDate: new Date('2024-06-28'),
    description: 'Bug fixes and stability improvements',
    installed: false
  },
  {
    id: '3',
    component: 'Node.js Runtime',
    currentVersion: '20.11.0',
    availableVersion: '20.15.1',
    type: 'feature',
    priority: 'low',
    releaseDate: new Date('2024-06-20'),
    description: 'New features and performance enhancements',
    installed: true
  }
]

export default function BackupMaintenancePage() {
  const [activeTab, setActiveTab] = useState<'backups' | 'maintenance' | 'updates'>('backups')
  const [backups, setBackups] = useState<BackupRecord[]>(mockBackups)
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(mockMaintenanceTasks)
  const [systemUpdates, setSystemUpdates] = useState<SystemUpdate[]>(mockSystemUpdates)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB === 0) return 'N/A'
    if (sizeInMB < 1024) return `${sizeInMB} MB`
    return `${(sizeInMB / 1024).toFixed(1)} GB`
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'N/A'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'active': return 'text-green-500'
      case 'running': return 'text-blue-500'
      case 'failed': return 'text-red-500'
      case 'scheduled': case 'paused': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': case 'active': return CheckCircle
      case 'running': return RefreshCw
      case 'failed': return AlertTriangle
      case 'scheduled': case 'paused': return Clock
      default: return Clock
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-500/20'
      case 'high': return 'text-orange-500 bg-orange-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/20'
      case 'low': return 'text-green-500 bg-green-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const tabs = [
    { id: 'backups', label: 'Backups', icon: Database },
    { id: 'maintenance', label: 'Maintenance', icon: Settings },
    { id: 'updates', label: 'Updates', icon: RefreshCw }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Archive className="w-8 h-8 mr-3 text-purple-500" />
              Backup & Maintenance
            </h1>
            <p className="text-muted-foreground">Manage system backups, maintenance tasks, and updates</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <Switch
                id="maintenance-mode"
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Config
            </Button>
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Quick Backup
            </Button>
          </div>
        </div>

        {/* Maintenance Mode Alert */}
        {maintenanceMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-yellow-500">Maintenance Mode Active</span>
              <span className="text-muted-foreground">- System is in read-only mode</span>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div className="space-y-6">
            {/* Backup Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {backups.filter(b => b.status === 'completed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Successful Backups</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <HardDrive className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {formatFileSize(backups.reduce((sum, b) => sum + b.size, 0))}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Storage Used</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(backups.filter(b => b.duration > 0).reduce((sum, b) => sum + b.duration, 0) / backups.filter(b => b.duration > 0).length / 60)}m
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Backup Time</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {backups.filter(b => b.status === 'scheduled').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Scheduled Backups</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Backup List */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Backup History</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Create Backup
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {backups.map((backup) => {
                  const StatusIcon = getStatusIcon(backup.status)
                  return (
                    <div key={backup.id} className="border border-border/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <StatusIcon className={`w-5 h-5 ${getStatusColor(backup.status)} ${backup.status === 'running' ? 'animate-spin' : ''}`} />
                          <div>
                            <p className="font-medium text-foreground">{backup.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)} backup
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {backup.status === 'completed' && (
                            <>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Info className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {backup.status === 'completed' && (
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/30">
                        <div>
                          <p className="text-xs text-muted-foreground">Size</p>
                          <p className="font-medium text-foreground">{formatFileSize(backup.size)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-medium text-foreground">{formatDuration(backup.duration)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="font-medium text-foreground">{formatTimeAgo(backup.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className={`font-medium ${getStatusColor(backup.status)}`}>
                            {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                          </p>
                        </div>
                      </div>
                      
                      {backup.location && backup.location !== 'In progress...' && backup.location !== 'Scheduled' && (
                        <div className="mt-4 pt-4 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-1">Location</p>
                          <p className="text-sm text-foreground font-mono bg-white/5 rounded px-2 py-1">
                            {backup.location}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Maintenance Tasks</h2>
              <Button>Add New Task</Button>
            </div>
            
            <div className="space-y-4">
              {maintenanceTasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status)
                return (
                  <div key={task.id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(task.status)}`} />
                        <div>
                          <p className="font-medium text-foreground">{task.name}</p>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch checked={task.autoRun} />
                        <Button variant="ghost" size="sm">
                          {task.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/30">
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-medium text-foreground">{task.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Run</p>
                        <p className="font-medium text-foreground">{formatTimeAgo(task.lastRun)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Next Run</p>
                        <p className="font-medium text-foreground">{formatTimeAgo(task.nextRun)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium text-foreground">{formatDuration(task.duration)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        )}

        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">System Updates</h2>
              <Button>Check for Updates</Button>
            </div>
            
            <div className="space-y-4">
              {systemUpdates.map((update) => (
                <div key={update.id} className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${update.installed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <p className="font-medium text-foreground">{update.component}</p>
                        <p className="text-sm text-muted-foreground">{update.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(update.priority)}`}>
                        {update.priority}
                      </span>
                      {!update.installed && (
                        <Button size="sm">Install</Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Version</p>
                      <p className="font-medium text-foreground">{update.currentVersion}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Available Version</p>
                      <p className="font-medium text-foreground">{update.availableVersion}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium text-foreground">{update.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Release Date</p>
                      <p className="font-medium text-foreground">{update.releaseDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </AdminLayout>
  )
}
