'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Keyboard, 
  Layout, 
  Bell, 
  Eye,
  Save,
  RotateCcw,
  Palette,
  Grid,
  List
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'

interface AdminPreferences {
  // Dashboard Layout
  dashboardLayout: 'grid' | 'list'
  widgetSize: 'compact' | 'medium' | 'large'
  showWelcomeMessage: boolean
  autoRefreshInterval: number
  
  // Notifications
  enableSoundNotifications: boolean
  enableDesktopNotifications: boolean
  notificationPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  
  // Interface
  sidebarCollapsed: boolean
  showBreadcrumbs: boolean
  enableKeyboardShortcuts: boolean
  animationsEnabled: boolean
  
  // Data Display
  itemsPerPage: number
  dateFormat: 'US' | 'EU' | 'ISO'
  timezone: string
  defaultSortOrder: 'asc' | 'desc'
}

const defaultPreferences: AdminPreferences = {
  dashboardLayout: 'grid',
  widgetSize: 'medium',
  showWelcomeMessage: true,
  autoRefreshInterval: 30,
  enableSoundNotifications: false,
  enableDesktopNotifications: true,
  notificationPosition: 'top-right',
  sidebarCollapsed: false,
  showBreadcrumbs: true,
  enableKeyboardShortcuts: true,
  animationsEnabled: true,
  itemsPerPage: 25,
  dateFormat: 'US',
  timezone: 'UTC',
  defaultSortOrder: 'desc'
}

interface AdminPreferencesProps {
  onSave?: (preferences: AdminPreferences) => void
  onReset?: () => void
}

export function AdminPreferences({ onSave, onReset }: AdminPreferencesProps) {
  const [preferences, setPreferences] = useState<AdminPreferences>(defaultPreferences)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('admin-preferences')
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences({ ...defaultPreferences, ...parsed })
      } catch (error) {
        console.error('Failed to parse admin preferences:', error)
      }
    }
  }, [])

  const updatePreference = <K extends keyof AdminPreferences>(
    key: K,
    value: AdminPreferences[K]
  ) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value }
      setHasChanges(true)
      return updated
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('admin-preferences', JSON.stringify(preferences))
      onSave?.(preferences)
      setHasChanges(false)
      
      // Apply preferences immediately
      applyPreferences(preferences)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setPreferences(defaultPreferences)
    setHasChanges(true)
    onReset?.()
  }

  const applyPreferences = (prefs: AdminPreferences) => {
    // Apply preferences to the interface
    const root = document.documentElement
    
    // Animation preferences
    if (!prefs.animationsEnabled) {
      root.style.setProperty('--animation-duration', '0s')
    } else {
      root.style.removeProperty('--animation-duration')
    }
    
    // Sidebar state
    const sidebar = document.querySelector('[data-sidebar]')
    if (sidebar) {
      sidebar.setAttribute('data-collapsed', prefs.sidebarCollapsed.toString())
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Settings className="w-6 h-6 mr-2 text-primary" />
            Admin Preferences
          </h2>
          <p className="text-muted-foreground">Customize your admin experience</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Dashboard Layout */}
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Layout className="w-5 h-5 mr-2 text-blue-500" />
            Dashboard Layout
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="layout">Layout Style</Label>
              <Select
                value={preferences.dashboardLayout}
                onValueChange={(value: 'grid' | 'list') => updatePreference('dashboardLayout', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">
                    <div className="flex items-center">
                      <Grid className="w-4 h-4 mr-2" />
                      Grid Layout
                    </div>
                  </SelectItem>
                  <SelectItem value="list">
                    <div className="flex items-center">
                      <List className="w-4 h-4 mr-2" />
                      List Layout
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="widget-size">Widget Size</Label>
              <Select
                value={preferences.widgetSize}
                onValueChange={(value: 'compact' | 'medium' | 'large') => updatePreference('widgetSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Auto Refresh Interval (seconds)</Label>
              <div className="space-y-2">
                <Slider
                  value={[preferences.autoRefreshInterval]}
                  onValueChange={([value]) => updatePreference('autoRefreshInterval', value)}
                  max={300}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-center">
                  {preferences.autoRefreshInterval} seconds
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="welcome-message">Show Welcome Message</Label>
              <Switch
                id="welcome-message"
                checked={preferences.showWelcomeMessage}
                onCheckedChange={(checked) => updatePreference('showWelcomeMessage', checked)}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-yellow-500" />
            Notifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-notifications">Sound Notifications</Label>
              <Switch
                id="sound-notifications"
                checked={preferences.enableSoundNotifications}
                onCheckedChange={(checked) => updatePreference('enableSoundNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
              <Switch
                id="desktop-notifications"
                checked={preferences.enableDesktopNotifications}
                onCheckedChange={(checked) => updatePreference('enableDesktopNotifications', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notification Position</Label>
              <Select
                value={preferences.notificationPosition}
                onValueChange={(value: any) => updatePreference('notificationPosition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Interface */}
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-purple-500" />
            Interface
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="sidebar-collapsed">Collapse Sidebar by Default</Label>
              <Switch
                id="sidebar-collapsed"
                checked={preferences.sidebarCollapsed}
                onCheckedChange={(checked) => updatePreference('sidebarCollapsed', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="breadcrumbs">Show Breadcrumbs</Label>
              <Switch
                id="breadcrumbs"
                checked={preferences.showBreadcrumbs}
                onCheckedChange={(checked) => updatePreference('showBreadcrumbs', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="keyboard-shortcuts">Enable Keyboard Shortcuts</Label>
              <Switch
                id="keyboard-shortcuts"
                checked={preferences.enableKeyboardShortcuts}
                onCheckedChange={(checked) => updatePreference('enableKeyboardShortcuts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Enable Animations</Label>
              <Switch
                id="animations"
                checked={preferences.animationsEnabled}
                onCheckedChange={(checked) => updatePreference('animationsEnabled', checked)}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Data Display */}
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-green-500" />
            Data Display
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Items Per Page</Label>
              <Select
                value={preferences.itemsPerPage.toString()}
                onValueChange={(value) => updatePreference('itemsPerPage', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 items</SelectItem>
                  <SelectItem value="25">25 items</SelectItem>
                  <SelectItem value="50">50 items</SelectItem>
                  <SelectItem value="100">100 items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select
                value={preferences.dateFormat}
                onValueChange={(value: 'US' | 'EU' | 'ISO') => updatePreference('dateFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">US (MM/DD/YYYY)</SelectItem>
                  <SelectItem value="EU">EU (DD/MM/YYYY)</SelectItem>
                  <SelectItem value="ISO">ISO (YYYY-MM-DD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Sort Order</Label>
              <Select
                value={preferences.defaultSortOrder}
                onValueChange={(value: 'asc' | 'desc') => updatePreference('defaultSortOrder', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={preferences.timezone}
                onChange={(e) => updatePreference('timezone', e.target.value)}
                placeholder="UTC"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Keyboard Shortcuts Info */}
      {preferences.enableKeyboardShortcuts && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Keyboard className="w-5 h-5 mr-2 text-blue-500" />
                Keyboard Shortcuts
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Search</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + K</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle Sidebar</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + B</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Go to Dashboard</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">G → D</kbd>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Go to Users</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">G → U</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Go to Settings</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">G → S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Refresh Page</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">R → R</kbd>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
