'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
  Shield,
  Plus,
  Trash2,
  Edit,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Settings
} from 'lucide-react'

interface RateLimitRule {
  id: string
  name: string
  endpoint: string
  method: string
  limit: number
  window: number
  windowUnit: 'seconds' | 'minutes' | 'hours'
  action: 'block' | 'throttle' | 'log'
  priority: number
  isActive: boolean
  createdAt: Date
  lastTriggered?: Date
  hitCount: number
}

export function AdvancedRateLimitingControls() {
  const [activeTab, setActiveTab] = useState('rules')
  const [rules, setRules] = useState<RateLimitRule[]>([
    {
      id: '1',
      name: 'API Authentication',
      endpoint: '/api/auth/*',
      method: 'POST',
      limit: 5,
      window: 1,
      windowUnit: 'minutes',
      action: 'block',
      priority: 1,
      isActive: true,
      createdAt: new Date(),
      lastTriggered: new Date(Date.now() - 3600000),
      hitCount: 12
    },
    {
      id: '2', 
      name: 'File Upload Limit',
      endpoint: '/api/upload/*',
      method: 'POST',
      limit: 10,
      window: 1,
      windowUnit: 'hours',
      action: 'throttle',
      priority: 2,
      isActive: true,
      createdAt: new Date(),
      hitCount: 156
    }
  ])

  const [editingRule, setEditingRule] = useState<RateLimitRule | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const createNewRule = () => {
    const newRule: RateLimitRule = {
      id: Date.now().toString(),
      name: 'New Rate Limit Rule',
      endpoint: '/api/*',
      method: 'GET',
      limit: 100,
      window: 1,
      windowUnit: 'minutes',
      action: 'throttle',
      priority: rules.length + 1,
      isActive: true,
      createdAt: new Date(),
      hitCount: 0
    }
    setRules([...rules, newRule])
    setEditingRule(newRule)
    setShowCreateModal(false)
  }

  const updateRule = (updatedRule: RateLimitRule) => {
    setRules(rules.map(rule => 
      rule.id === updatedRule.id ? updatedRule : rule
    ))
    setEditingRule(null)
  }

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId))
  }

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Advanced Rate Limiting
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure custom rate limiting rules for API endpoints
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Rule
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Active Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <div className="grid gap-4">
            {rules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          rule.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.action === 'block' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                          rule.action === 'throttle' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {rule.action.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRule(rule)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRule(rule.id)}
                          className="h-8 w-8 p-0"
                        >
                          {rule.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRule(rule.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-500 dark:text-gray-400">Endpoint</Label>
                      <p className="font-mono text-gray-900 dark:text-gray-100">{rule.method} {rule.endpoint}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500 dark:text-gray-400">Limit</Label>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {rule.limit} / {rule.window} {rule.windowUnit}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-500 dark:text-gray-400">Hit Count</Label>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{rule.hitCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500 dark:text-gray-400">Last Triggered</Label>
                      <p className="text-gray-600 dark:text-gray-400">
                        {rule.lastTriggered ? rule.lastTriggered.toLocaleString() : 'Never'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {rules.length === 0 && (
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No rate limiting rules configured
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                    Create your first rate limiting rule to protect your API endpoints
                  </p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    Create First Rule
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Requests Blocked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">2,847</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +12% from last hour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {rules.filter(r => r.isActive).length}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  of {rules.length} total rules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Response Time Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">+12ms</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Average latency overhead
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Global Rate Limiting Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Window Size</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Action</Label>
                  <Select defaultValue="throttle">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="throttle">Throttle</SelectItem>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="log">Log Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Enable IP Whitelisting</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Allow whitelisted IPs to bypass rate limits
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alert Threshold</Label>
                  <Input 
                    type="number" 
                    defaultValue="100" 
                    placeholder="Requests per minute"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rule Editor Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Rate Limit Rule</h3>
            <div className="space-y-4">
              <div>
                <Label>Rule Name</Label>
                <Input 
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({...editingRule, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Endpoint Pattern</Label>
                <Input 
                  value={editingRule.endpoint}
                  onChange={(e) => setEditingRule({...editingRule, endpoint: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Method</Label>
                  <Select 
                    value={editingRule.method} 
                    onValueChange={(value) => setEditingRule({...editingRule, method: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="*">ALL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Action</Label>
                  <Select 
                    value={editingRule.action} 
                    onValueChange={(value: 'block' | 'throttle' | 'log') => setEditingRule({...editingRule, action: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="throttle">Throttle</SelectItem>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="log">Log Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Limit</Label>
                  <Input 
                    type="number"
                    value={editingRule.limit}
                    onChange={(e) => setEditingRule({...editingRule, limit: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Window</Label>
                  <Input 
                    type="number"
                    value={editingRule.window}
                    onChange={(e) => setEditingRule({...editingRule, window: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Select 
                    value={editingRule.windowUnit} 
                    onValueChange={(value: 'seconds' | 'minutes' | 'hours') => setEditingRule({...editingRule, windowUnit: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">Seconds</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditingRule(null)}>
                Cancel
              </Button>
              <Button onClick={() => updateRule(editingRule)}>
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
