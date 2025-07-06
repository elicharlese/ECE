'use client'

import React, { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdvancedRateLimitingControls } from '@/components/admin/AdvancedRateLimitingControls'
import { CustomWidgetBuilder } from '@/components/admin/CustomWidgetBuilder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  Shield,
  Palette,
  Zap,
  Clock,
  BarChart3
} from 'lucide-react'

export default function AdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState('rate-limiting')

  return (
    <AdminLayout>
      <div className="flex-1 space-y-6 p-6">
        <AdminBreadcrumbs />
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Advanced Features
            </h1>
            <Badge variant="secondary" className="ml-2">
              NEW
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced administrative tools and customization options
          </p>
        </div>

        {/* Feature Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-base">Rate Limiting</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure custom rate limiting rules for API endpoints with advanced controls
              </p>
            </CardContent>
          </Card>

          <Card className="border border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-base">Widget Builder</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create and customize dashboard widgets with visual drag-and-drop editor
              </p>
            </CardContent>
          </Card>

          <Card className="border border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-base">Performance Tools</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced performance monitoring and optimization tools
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rate-limiting" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Rate Limiting
            </TabsTrigger>
            <TabsTrigger value="widget-builder" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Widget Builder
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rate-limiting">
            <Card>
              <CardContent className="p-6">
                <AdvancedRateLimitingControls />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="widget-builder">
            <Card>
              <CardContent className="p-6">
                <CustomWidgetBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle>Performance Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">98.9%</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">145ms</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2.1GB</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">12%</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">CPU Usage</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    Advanced performance tools coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
