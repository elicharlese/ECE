'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp,
  Filter,
  Search,
  Eye,
  Edit,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  ExternalLink,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { GlassCard } from '@/components/glass-card'
import { OrderCommunication } from '@/components/order-communication'
import FileUpload from './file-upload'
import OrderHandoff from './order-handoff'

interface AdminOrder {
  id: string
  userId: string
  projectType: string
  title: string
  description: string
  timeline: string
  estimatedCost: number
  actualCost?: number
  status: string
  priority: string
  progressPercentage: number
  currentMilestone?: string
  createdAt: Date
  updatedAt: Date
  assignedAdminId?: string
  deliveryDate?: Date
  githubRepo?: string
  vercelLink?: string
  downloadLink?: string
}

interface AdminOrdersProps {
  isAdmin?: boolean
}

export function AdminOrders({ isAdmin = false }: AdminOrdersProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [showCommunication, setShowCommunication] = useState<AdminOrder | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    revenue: 0,
    avgCompletionTime: 0
  })

  // Mock admin authentication
  const adminToken = 'Bearer admin_token_demo'

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/orders?status=${statusFilter}&limit=50`, {
        headers: {
          'Authorization': adminToken
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.data || [])
        setStats(data.stats || stats)
      } else {
        console.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchOrders()
    }
  }, [isAdmin, statusFilter])

  const updateOrderStatus = async (orderId: string, status: string, data: any = {}) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': adminToken
        },
        body: JSON.stringify({
          orderId,
          action: 'update_status',
          data: { status, ...data }
        })
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.projectType.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500'
      case 'APPROVED': return 'bg-blue-500'
      case 'IN_PROGRESS': return 'bg-purple-500'
      case 'REVIEW': return 'bg-orange-500'
      case 'COMPLETED': return 'bg-green-500'
      case 'DELIVERED': return 'bg-emerald-500'
      case 'CANCELLED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'destructive'
      case 'URGENT': return 'destructive'
      default: return 'secondary'
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-lg text-gray-600 mb-6">
            Manage client orders, track progress, and handle deliverables
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {stats.revenue.toLocaleString()} ECE
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle>Order Queue</CardTitle>
              <CardDescription>
                Manage and track all client orders in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Try adjusting your search criteria' : 'No orders match the current filter'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Order</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{order.title}</p>
                              <p className="text-sm text-gray-600">{order.projectType}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <User className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{order.userId}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
                              <Badge variant="outline" className="text-xs">
                                {order.status.replace('_', ' ')}
                              </Badge>
                              {order.priority !== 'STANDARD' && (
                                <Badge variant={getPriorityColor(order.priority)} className="text-xs">
                                  {order.priority}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="w-24">
                              <Progress value={order.progressPercentage} className="h-2" />
                              <p className="text-xs text-gray-600 mt-1">
                                {order.progressPercentage}%
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {(order.actualCost || order.estimatedCost).toLocaleString()} ECE
                              </p>
                              <p className="text-xs text-gray-600">{order.timeline}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button
                               
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                               
                                variant="outline"
                                onClick={() => updateOrderStatus(order.id, 'IN_PROGRESS', {
                                  progressPercentage: Math.min(order.progressPercentage + 25, 100)
                                })}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                               
                                variant="outline"
                                onClick={() => setShowCommunication(order)}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-ocean-dark rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-ocean-dark dark:text-ocean-light">Order Details</h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>

              <Tabs value="overview" onValueChange={() => {}} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="handoff">Handoff</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h4 className="font-medium text-ocean-dark dark:text-ocean-light mb-2">{selectedOrder.title}</h4>
                    <p className="text-ocean-muted">{selectedOrder.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-ocean-dark dark:text-ocean-light">Project Type</label>
                      <p className="text-ocean-muted">{selectedOrder.projectType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ocean-dark dark:text-ocean-light">Timeline</label>
                      <p className="text-ocean-muted">{selectedOrder.timeline}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ocean-dark dark:text-ocean-light">Status</label>
                      <Badge variant="outline">{selectedOrder.status}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ocean-dark dark:text-ocean-light">Progress</label>
                      <div className="mt-2">
                        <Progress value={selectedOrder.progressPercentage} className="h-2" />
                        <p className="text-sm text-ocean-muted mt-1">{selectedOrder.progressPercentage}%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-ocean-dark dark:text-ocean-light mb-2 block">Quick Actions</label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'APPROVED')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'IN_PROGRESS', {
                          progressPercentage: 25
                        })}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Start Work
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'COMPLETED', {
                          progressPercentage: 100
                        })}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>

                  {selectedOrder.githubRepo && (
                    <div>
                      <label className="text-sm font-medium text-ocean-dark dark:text-ocean-light">Deliverables</label>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          GitHub
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Vercel
                        </Button>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="files">
                  <div className="space-y-4">
                    <h4 className="font-medium text-ocean-dark dark:text-ocean-light">File Management</h4>
                    <FileUpload
                      maxFiles={10}
                      maxSize={50}
                      acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.txt', '.zip', '.sketch', '.fig']}
                      onFilesChange={(files) => {
                        console.log('Files uploaded:', files)
                        // Handle file upload for order
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="handoff">
                  <OrderHandoff
                    orderId={selectedOrder.id}
                    orderTitle={selectedOrder.title}
                    orderType={selectedOrder.projectType}
                    status={selectedOrder.status === 'COMPLETED' ? 'READY_FOR_HANDOFF' : 'PROCESSING'}
                    onInitiateHandoff={() => {
                      // Handle handoff completion
                      updateOrderStatus(selectedOrder.id, 'DELIVERED', {
                        progressPercentage: 100
                      })
                    }}
                  />
                </TabsContent>

                <TabsContent value="communication">
                  <OrderCommunication
                    orderId={selectedOrder.id}
                    userId={selectedOrder.userId}
                    isAdmin={true}
                    onClose={() => {}}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
        {/* Communication Modal */}
        {showCommunication && (
          <OrderCommunication
            orderId={showCommunication.id}
            userId={showCommunication.userId}
            isAdmin={true}
            onClose={() => setShowCommunication(null)}
          />
        )}
      </div>
    </div>
  )
}
