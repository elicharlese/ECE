'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Download,
  ExternalLink,
  Github,
  Calendar,
  DollarSign,
  Package,
  RefreshCw,
  Plus,
  Filter,
  Eye,
  Edit3
} from 'lucide-react'
import { GlassCard } from './glass-card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { AppOrder, OrderRevision, OrderCommunication } from '@/lib/db/schema'
import { OrderForm } from './order-form'
import { OrderCommunication as OrderComm } from './order-communication'

interface OrdersDashboardProps {
  userId: string
  userBalance: number
}

interface OrderWithDetails extends AppOrder {
  communications?: OrderCommunication[]
  revisions?: OrderRevision[]
}

export function OrdersDashboard({ userId, userBalance }: OrdersDashboardProps) {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCommunication, setShowCommunication] = useState<OrderWithDetails | null>(null)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders?userId=${userId}&status=${statusFilter}&limit=50`)
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [userId, statusFilter])

  const handleCreateOrder = async (orderData: Partial<AppOrder>) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...orderData
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        fetchOrders() // Refresh orders list
        return data.data
      } else {
        throw new Error(data.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
      case 'APPROVED': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'IN_PROGRESS': return 'bg-purple-500/20 text-purple-700 border-purple-500/30'
      case 'REVIEW': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
      case 'REVISION_REQUESTED': return 'bg-red-500/20 text-red-700 border-red-500/30'
      case 'COMPLETED': return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'DELIVERED': return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30'
      case 'CANCELLED': return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />
      case 'IN_PROGRESS': return <RefreshCw className="w-4 h-4" />
      case 'REVIEW': return <Eye className="w-4 h-4" />
      case 'REVISION_REQUESTED': return <Edit3 className="w-4 h-4" />
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'DELIVERED': return <Package className="w-4 h-4" />
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProjectTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      'SAAS_DASHBOARD': 'SaaS Dashboard',
      'PORTFOLIO_SITE': 'Portfolio Site',
      'ECOMMERCE_STORE': 'eCommerce Store',
      'LANDING_PAGE': 'Landing Page',
      'MOBILE_APP': 'Mobile App',
      'WEB_APP': 'Web Application',
      'CUSTOM': 'Custom Project'
    }
    return types[type] || type
  }

  const getTimelineDisplay = (timeline: string) => {
    return timeline === 'RUSH_2_WEEKS' ? '2 Weeks (Rush)' : '1 Month (Standard)'
  }

  const activeOrders = orders.filter(order => 
    !['COMPLETED', 'DELIVERED', 'CANCELLED'].includes(order.status)
  )
  const completedOrders = orders.filter(order => 
    ['COMPLETED', 'DELIVERED'].includes(order.status)
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Orders</h2>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Orders</h2>
          <p className="text-muted-foreground">
            Track your custom app development projects
          </p>
        </div>
        <Button 
          onClick={() => setShowOrderForm(true)}
          className="bg-monokai-pink hover:bg-monokai-pink/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-xl font-bold">{orders.length}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <RefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-xl font-bold">{activeOrders.length}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-xl font-bold">{completedOrders.length}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-monokai-green/20">
              <DollarSign className="w-5 h-5 text-monokai-green" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-xl font-bold">
                {orders.reduce((sum, order) => sum + (order.actualCost || order.estimatedCost), 0).toLocaleString()} ECE
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Orders List */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-muted">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Active Orders</h3>
                  <p className="text-muted-foreground">Start your first custom app project today!</p>
                </div>
                <Button 
                  onClick={() => setShowOrderForm(true)}
                  className="bg-monokai-pink hover:bg-monokai-pink/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </div>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {activeOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{order.title}</h3>
                          <Badge className={`${getStatusColor(order.status)} border`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status.replace('_', ' ')}</span>
                          </Badge>
                          <Badge variant="outline">
                            {getProjectTypeDisplay(order.projectType)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{order.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium">{order.progressPercentage}%</span>
                          </div>
                          <Progress value={order.progressPercentage} className="h-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Timeline: {getTimelineDisplay(order.timeline)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span>Cost: {order.estimatedCost.toLocaleString()} ECE</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>Created: {formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Messages
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-muted">
                  <CheckCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Completed Orders</h3>
                  <p className="text-muted-foreground">Your completed projects will appear here</p>
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {completedOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{order.title}</h3>
                          <Badge className={`${getStatusColor(order.status)} border`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                          <Badge variant="outline">
                            {getProjectTypeDisplay(order.projectType)}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{order.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Delivered: {order.deliveryDate ? formatDate(order.deliveryDate) : 'Pending'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span>Final Cost: {(order.actualCost || order.estimatedCost).toLocaleString()} ECE</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>Duration: {getTimelineDisplay(order.timeline)}</span>
                          </div>
                        </div>

                        {/* Deliverables */}
                        <div className="flex flex-wrap gap-2">
                          {order.githubRepo && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={order.githubRepo} target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4 mr-1" />
                                View Code
                              </a>
                            </Button>
                          )}
                          {order.vercelLink && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={order.vercelLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                          {order.downloadLink && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={order.downloadLink} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Form Modal */}
      <OrderForm
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        onSubmit={handleCreateOrder}
        userBalance={userBalance}
      />
    </div>
  )
}
