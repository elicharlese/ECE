'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { 
  GripVertical, 
  X, 
  Plus, 
  Settings, 
  Eye, 
  EyeOff,
  RotateCcw,
  Save
} from 'lucide-react'
import { StatsCard } from './widgets/StatsCard'
import { QuickAction } from './widgets/QuickAction'
import { ActivityItem } from './widgets/ActivityItem'
import { SystemStatus } from './widgets/SystemStatus'

interface DashboardWidget {
  id: string
  type: 'stats' | 'quick-actions' | 'activity' | 'system-status' | 'custom'
  title: string
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  visible: boolean
  config?: Record<string, any>
}

interface CustomizableDashboardProps {
  onSave?: (layout: DashboardWidget[]) => void
  className?: string
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'stats-overview',
    type: 'stats',
    title: 'System Overview',
    size: 'large',
    position: { x: 0, y: 0 },
    visible: true,
    config: { showTrends: true }
  },
  {
    id: 'quick-actions',
    type: 'quick-actions',
    title: 'Quick Actions',
    size: 'medium',
    position: { x: 1, y: 0 },
    visible: true
  },
  {
    id: 'recent-activity',
    type: 'activity',
    title: 'Recent Activity',
    size: 'medium',
    position: { x: 0, y: 1 },
    visible: true,
    config: { limit: 5 }
  },
  {
    id: 'system-health',
    type: 'system-status',
    title: 'System Health',
    size: 'small',
    position: { x: 1, y: 1 },
    visible: true
  }
]

const availableWidgets = [
  { id: 'user-stats', type: 'stats', title: 'User Statistics', size: 'medium' },
  { id: 'revenue-chart', type: 'stats', title: 'Revenue Chart', size: 'large' },
  { id: 'api-metrics', type: 'stats', title: 'API Metrics', size: 'small' },
  { id: 'error-logs', type: 'activity', title: 'Error Logs', size: 'medium' },
  { id: 'performance', type: 'system-status', title: 'Performance Monitor', size: 'small' }
]

export function CustomizableDashboard({ onSave, className = '' }: CustomizableDashboardProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets)
  const [isEditMode, setIsEditMode] = useState(false)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load saved layout from localStorage
    const savedLayout = localStorage.getItem('admin-dashboard-layout')
    if (savedLayout) {
      try {
        setWidgets(JSON.parse(savedLayout))
      } catch (error) {
        console.warn('Failed to load saved dashboard layout:', error)
      }
    }
  }, [])

  const handleSaveLayout = () => {
    localStorage.setItem('admin-dashboard-layout', JSON.stringify(widgets))
    onSave?.(widgets)
    setHasChanges(false)
    setIsEditMode(false)
  }

  const handleResetLayout = () => {
    setWidgets(defaultWidgets)
    setHasChanges(true)
  }

  const handleWidgetReorder = (newOrder: DashboardWidget[]) => {
    setWidgets(newOrder)
    setHasChanges(true)
  }

  const handleToggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ))
    setHasChanges(true)
  }

  const handleAddWidget = (widgetTemplate: any) => {
    const newWidget: DashboardWidget = {
      ...widgetTemplate,
      id: `${widgetTemplate.id}-${Date.now()}`,
      position: { x: 0, y: widgets.length },
      visible: true
    }
    setWidgets(prev => [...prev, newWidget])
    setHasChanges(true)
  }

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId))
    setHasChanges(true)
  }

  const renderWidget = (widget: DashboardWidget) => {
    if (!widget.visible) return null

    const sizeClasses = {
      small: 'col-span-1 row-span-1',
      medium: 'col-span-2 row-span-1',
      large: 'col-span-3 row-span-2'
    }

    return (
      <motion.div
        key={widget.id}
        layout
        className={`relative ${sizeClasses[widget.size]} ${
          isEditMode ? 'ring-2 ring-primary/20 rounded-lg' : ''
        }`}
        whileHover={isEditMode ? { scale: 1.02 } : {}}
        drag={isEditMode}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={() => setDraggedWidget(widget.id)}
        onDragEnd={() => setDraggedWidget(null)}
      >
        {isEditMode && (
          <div className="absolute -top-2 -right-2 z-10 flex space-x-1">
            <button
              onClick={() => handleToggleWidget(widget.id)}
              className="p-1 bg-background border border-border rounded shadow-sm hover:bg-muted"
            >
              {widget.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
            <button
              onClick={() => handleRemoveWidget(widget.id)}
              className="p-1 bg-destructive text-destructive-foreground border border-border rounded shadow-sm hover:bg-destructive/80"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {isEditMode && (
          <div className="absolute top-2 left-2 z-10 cursor-move">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        <div className={`h-full ${isEditMode ? 'pointer-events-none' : ''}`}>
          {widget.type === 'stats' && (
            <StatsCard
              title={widget.title}
              value="42"
              change="+12%"
              trend="up"
              className="h-full"
            />
          )}
          
          {widget.type === 'quick-actions' && (
            <div className="bg-card rounded-lg border border-border p-4 h-full">
              <h3 className="font-semibold mb-4">{widget.title}</h3>
              <div className="grid grid-cols-2 gap-2">
                <QuickAction icon="Plus" label="Add User" />
                <QuickAction icon="Mail" label="Send Alert" />
                <QuickAction icon="Download" label="Export" />
                <QuickAction icon="Settings" label="Configure" />
              </div>
            </div>
          )}
          
          {widget.type === 'activity' && (
            <div className="bg-card rounded-lg border border-border p-4 h-full">
              <h3 className="font-semibold mb-4">{widget.title}</h3>
              <div className="space-y-2">
                <ActivityItem 
                  type="user" 
                  description="New user registration"
                  timestamp="2 min ago"
                />
                <ActivityItem 
                  type="order" 
                  description="Order #1234 completed"
                  timestamp="5 min ago"
                />
                <ActivityItem 
                  type="system" 
                  description="Database backup completed"
                  timestamp="10 min ago"
                />
              </div>
            </div>
          )}
          
          {widget.type === 'system-status' && (
            <SystemStatus 
              title={widget.title}
              status="healthy"
              metrics={[
                { label: 'CPU', value: '45%', status: 'good' },
                { label: 'Memory', value: '67%', status: 'warning' },
                { label: 'Disk', value: '23%', status: 'good' }
              ]}
              className="h-full"
            />
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetLayout}
                className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md flex items-center space-x-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              
              <button
                onClick={handleSaveLayout}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/80 rounded-md flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          )}
          
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
              isEditMode 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{isEditMode ? 'Exit Edit' : 'Customize'}</span>
          </button>
        </div>
      </div>

      {/* Add Widget Panel */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-muted/50 rounded-lg border border-border p-4"
          >
            <h3 className="font-medium mb-3">Add Widgets</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {availableWidgets.map(widget => (
                <button
                  key={widget.id}
                  onClick={() => handleAddWidget(widget)}
                  className="p-3 bg-background hover:bg-muted border border-border rounded-md text-sm flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{widget.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Grid */}
      <Reorder.Group
        axis="y"
        values={widgets}
        onReorder={handleWidgetReorder}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr"
      >
        {widgets.map(widget => (
          <Reorder.Item key={widget.id} value={widget}>
            {renderWidget(widget)}
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {widgets.filter(w => w.visible).length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No widgets visible</p>
          <button
            onClick={() => setIsEditMode(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80"
          >
            Customize Dashboard
          </button>
        </div>
      )}
    </div>
  )
}
