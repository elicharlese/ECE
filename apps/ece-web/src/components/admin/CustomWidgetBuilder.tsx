'use client'

import React, { useState } from 'react'
import { motion, Reorder } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Eye,
  Code,
  Palette,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Heart,
  Zap
} from 'lucide-react'

interface Widget {
  id: string
  name: string
  type: 'metric' | 'chart' | 'list' | 'custom'
  title: string
  icon: string
  dataSource: string
  config: {
    size: 'small' | 'medium' | 'large'
    color: string
    refreshInterval: number
    showTrend: boolean
    customCSS?: string
    queryParams?: Record<string, any>
  }
  position: { x: number; y: number; w: number; h: number }
  isVisible: boolean
  createdAt: Date
}

const ICON_OPTIONS = [
  { value: 'BarChart3', label: 'Bar Chart', icon: BarChart3 },
  { value: 'PieChart', label: 'Pie Chart', icon: PieChart },
  { value: 'LineChart', label: 'Line Chart', icon: LineChart },
  { value: 'Activity', label: 'Activity', icon: Activity },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'DollarSign', label: 'Revenue', icon: DollarSign },
  { value: 'TrendingUp', label: 'Trending', icon: TrendingUp },
  { value: 'Clock', label: 'Time', icon: Clock },
  { value: 'Star', label: 'Rating', icon: Star },
  { value: 'Heart', label: 'Favorites', icon: Heart },
  { value: 'Zap', label: 'Performance', icon: Zap }
]

const DATA_SOURCES = [
  'users/stats',
  'orders/analytics', 
  'marketplace/metrics',
  'system/performance',
  'security/alerts',
  'api/usage',
  'custom/endpoint'
]

export function CustomWidgetBuilder() {
  const [activeTab, setActiveTab] = useState('builder')
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      name: 'User Growth Widget',
      type: 'metric',
      title: 'Total Users',
      icon: 'Users',
      dataSource: 'users/stats',
      config: {
        size: 'medium',
        color: '#3B82F6',
        refreshInterval: 30,
        showTrend: true
      },
      position: { x: 0, y: 0, w: 4, h: 2 },
      isVisible: true,
      createdAt: new Date()
    }
  ])

  const [editingWidget, setEditingWidget] = useState<Widget | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const createNewWidget = () => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      name: 'New Widget',
      type: 'metric',
      title: 'Widget Title',
      icon: 'BarChart3',
      dataSource: 'users/stats',
      config: {
        size: 'medium',
        color: '#3B82F6',
        refreshInterval: 60,
        showTrend: true
      },
      position: { x: 0, y: 0, w: 4, h: 2 },
      isVisible: true,
      createdAt: new Date()
    }
    setWidgets([...widgets, newWidget])
    setEditingWidget(newWidget)
    setShowCreateModal(false)
  }

  const updateWidget = (updatedWidget: Widget) => {
    setWidgets(widgets.map(widget => 
      widget.id === updatedWidget.id ? updatedWidget : widget
    ))
    setEditingWidget(null)
  }

  const deleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId))
  }

  const duplicateWidget = (widget: Widget) => {
    const duplicated = {
      ...widget,
      id: Date.now().toString(),
      name: `${widget.name} (Copy)`,
      position: { ...widget.position, x: widget.position.x + 4 }
    }
    setWidgets([...widgets, duplicated])
  }

  const generateWidgetCode = (widget: Widget) => {
    return `// ${widget.name}
<Widget
  title="${widget.title}"
  icon={${widget.icon}}
  dataSource="${widget.dataSource}"
  size="${widget.config.size}"
  color="${widget.config.color}"
  refreshInterval={${widget.config.refreshInterval}}
  showTrend={${widget.config.showTrend}}
/>`
  }

  const getIconComponent = (iconName: string) => {
    const iconData = ICON_OPTIONS.find(option => option.value === iconName)
    return iconData ? iconData.icon : BarChart3
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#75715E] dark:text-[#75715E]">
            Custom Widget Builder
          </h2>
          <p className="text-[#75715E] dark:text-[#75715E] mt-1">
            Create and customize dashboard widgets with visual editor
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={previewMode ? "primary" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Widget
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder">Widget Builder</TabsTrigger>
          <TabsTrigger value="library">Widget Library</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="code">Code Export</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          {previewMode ? (
            // Preview Mode
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {widgets.filter(w => w.isVisible).map((widget) => {
                const IconComponent = getIconComponent(widget.icon)
                return (
                  <motion.div
                    key={widget.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`col-span-${widget.config.size === 'small' ? '1' : widget.config.size === 'large' ? '2' : '1'}`}
                  >
                    <Card 
                      className="h-full border border-white/10 dark:border-white/10"
                      style={{ borderColor: widget.config.color + '40' }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: widget.config.color + '20' }}
                          >
                            <IconComponent 
                              className="w-5 h-5" 
                              style={{ color: widget.config.color }}
                            />
                          </div>
                          <CardTitle className="text-base">{widget.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-[#75715E] dark:text-[#75715E]">
                          {Math.floor(Math.random() * 10000).toLocaleString()}
                        </div>
                        {widget.config.showTrend && (
                          <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-500">+12%</span>
                            <span className="text-xs text-[#75715E]">vs last period</span>
                          </div>
                        )}
                        <p className="text-xs text-[#75715E] mt-2">
                          Updates every {widget.config.refreshInterval}s
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            // Builder Mode
            <div className="grid gap-4">
              <Reorder.Group 
                axis="y" 
                values={widgets} 
                onReorder={setWidgets}
                className="space-y-4"
              >
                {widgets.map((widget) => {
                  const IconComponent = getIconComponent(widget.icon)
                  return (
                    <Reorder.Item key={widget.id} value={widget}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="group"
                      >
                        <Card className="border border-white/10 dark:border-white/10 hover:border-white/10 dark:hover:border-white/10 transition-colors">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <GripVertical className="w-5 h-5 text-[#75715E] cursor-grab" />
                                <div 
                                  className="p-2 rounded-lg"
                                  style={{ backgroundColor: widget.config.color + '20' }}
                                >
                                  <IconComponent 
                                    className="w-5 h-5" 
                                    style={{ color: widget.config.color }}
                                  />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{widget.name}</CardTitle>
                                  <p className="text-sm text-[#75715E]">{widget.title}</p>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  widget.config.size === 'small' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                  widget.config.size === 'large' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                                  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                }`}>
                                  {widget.config.size.toUpperCase()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => duplicateWidget(widget)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingWidget(widget)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteWidget(widget.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <Label className="text-[#75715E] dark:text-[#75715E]">Data Source</Label>
                              <p className="font-mono text-[#75715E] dark:text-[#75715E]">{widget.dataSource}</p>
                            </div>
                            <div>
                              <Label className="text-[#75715E] dark:text-[#75715E]">Refresh Rate</Label>
                              <p className="text-[#75715E] dark:text-[#75715E]">{widget.config.refreshInterval}s</p>
                            </div>
                            <div>
                              <Label className="text-[#75715E] dark:text-[#75715E]">Type</Label>
                              <p className="capitalize text-[#75715E] dark:text-[#75715E]">{widget.type}</p>
                            </div>
                            <div>
                              <Label className="text-[#75715E] dark:text-[#75715E]">Status</Label>
                              <p className={`capitalize font-medium ${
                                widget.isVisible 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-[#75715E] dark:text-[#75715E]'
                              }`}>
                                {widget.isVisible ? 'Active' : 'Hidden'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Reorder.Item>
                  )
                })}
              </Reorder.Group>

              {widgets.length === 0 && (
                <Card className="border-dashed border-2 border-white/10 dark:border-white/10">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Palette className="w-12 h-12 text-[#75715E] mb-4" />
                    <h3 className="text-lg font-medium text-[#75715E] dark:text-[#75715E] mb-2">
                      No widgets created yet
                    </h3>
                    <p className="text-[#75715E] dark:text-[#75715E] text-center mb-4">
                      Create your first custom widget to get started
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      Create First Widget
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="library">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pre-built widget templates */}
            <Card className="border-dashed border-2 border-blue-300 dark:border-blue-600">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Analytics Widget</h3>
                <p className="text-sm text-[#75715E] mb-4">Track key metrics with charts</p>
                <Button size="sm" onClick={createNewWidget}>Use Template</Button>
              </CardContent>
            </Card>
            {/* Add more templates... */}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="text-center py-8">
            <Code className="w-16 h-16 text-[#75715E] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#75715E] dark:text-[#75715E] mb-2">
              Widget Templates Coming Soon
            </h3>
            <p className="text-[#75715E] dark:text-[#75715E]">
              Pre-built templates for common use cases
            </p>
          </div>
        </TabsContent>

        <TabsContent value="code">
          <div className="space-y-4">
            {widgets.map((widget) => (
              <Card key={widget.id}>
                <CardHeader>
                  <CardTitle className="text-base">{widget.name} - Generated Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-[#75715E] dark:bg-[#75715E] p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{generateWidgetCode(widget)}</code>
                  </pre>
                  <Button size="sm" className="mt-2">Copy Code</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Widget Editor Modal */}
      {editingWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#75715E] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Widget</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-4">
                <div>
                  <Label>Widget Name</Label>
                  <Input 
                    value={editingWidget.name}
                    onChange={(e) => setEditingWidget({...editingWidget, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Display Title</Label>
                  <Input 
                    value={editingWidget.title}
                    onChange={(e) => setEditingWidget({...editingWidget, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <Select 
                    value={editingWidget.icon} 
                    onValueChange={(value) => setEditingWidget({...editingWidget, icon: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data Source</Label>
                  <Select 
                    value={editingWidget.dataSource} 
                    onValueChange={(value) => setEditingWidget({...editingWidget, dataSource: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_SOURCES.map((source) => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Size</Label>
                  <Select 
                    value={editingWidget.config.size} 
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      setEditingWidget({
                        ...editingWidget, 
                        config: {...editingWidget.config, size: value}
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Color</Label>
                  <Input 
                    type="color"
                    value={editingWidget.config.color}
                    onChange={(e) => setEditingWidget({
                      ...editingWidget, 
                      config: {...editingWidget.config, color: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label>Refresh Interval (seconds)</Label>
                  <Input 
                    type="number"
                    value={editingWidget.config.refreshInterval}
                    onChange={(e) => setEditingWidget({
                      ...editingWidget, 
                      config: {...editingWidget.config, refreshInterval: parseInt(e.target.value)}
                    })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={editingWidget.config.showTrend}
                    onChange={(e) => setEditingWidget({
                      ...editingWidget, 
                      config: {...editingWidget.config, showTrend: e.target.checked}
                    })}
                  />
                  <Label>Show Trend Indicator</Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingWidget(null)}>
                Cancel
              </Button>
              <Button onClick={() => updateWidget(editingWidget)}>
                Save Widget
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
