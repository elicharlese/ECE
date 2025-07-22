'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Share,
  MessageSquare,
  Calendar,
  Star,
  Zap,
  Users,
  Activity,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { GlassCard } from '../../components/ui/glass-card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'

interface OrderStatus {
  id: string
  title: string
  type: string
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  progress: number
  timeline: string
  estimatedCompletion: string
  amount: number
  createdAt: string
  lastUpdate: string
  assignedTeam?: string[]
  milestones: {
    id: string
    title: string
    description: string
    status: 'completed' | 'in_progress' | 'pending'
    completedAt?: string
    estimatedDate?: string
  }[]
  updates: {
    id: string
    message: string
    timestamp: string
    type: 'info' | 'milestone' | 'warning' | 'success'
    author: string
  }[]
}

export default function OrderStatus() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUpdates, setShowUpdates] = useState(false)

  const orderId = searchParams.get('orderId') || 'ECE-2025-001'

  useEffect(() => {
    const fetchOrderStatus = async () => {
      setIsLoading(true)
      
      // Mock order status data
      const mockOrderData: OrderStatus = {
        id: orderId,
        title: 'Tesla Model S Enhancement Package',
        type: 'CARD_ENHANCEMENT',
        status: 'in_progress',
        progress: 65,
        timeline: '3-5 days',
        estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        amount: 2500,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
        assignedTeam: ['Alex Chen', 'Sarah Kim', 'Mike Rodriguez'],
        milestones: [
          {
            id: '1',
            title: 'Order Confirmation',
            description: 'Payment processed and order confirmed',
            status: 'completed',
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString()
          },
          {
            id: '2',
            title: 'Design Phase',
            description: 'Creating enhancement design and specifications',
            status: 'completed',
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString()
          },
          {
            id: '3',
            title: 'Implementation',
            description: 'Applying enhancements to selected cards',
            status: 'in_progress'
          },
          {
            id: '4',
            title: 'Quality Review',
            description: 'Testing and quality assurance',
            status: 'pending',
            estimatedDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            id: '5',
            title: 'Delivery',
            description: 'Final delivery and completion',
            status: 'pending',
            estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }
        ],
        updates: [
          {
            id: '1',
            message: 'Started working on attack boost enhancements for Tesla Model S card',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
            type: 'info',
            author: 'Alex Chen'
          },
          {
            id: '2',
            message: 'Design phase completed ahead of schedule! 🎉',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(),
            type: 'success',
            author: 'Sarah Kim'
          },
          {
            id: '3',
            message: 'Order confirmed and assigned to development team',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
            type: 'milestone',
            author: 'ECE System'
          }
        ]
      }

      setTimeout(() => {
        setOrderData(mockOrderData)
        setIsLoading(false)
      }, 1000)
    }

    fetchOrderStatus()
  }, [orderId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#A6E22E]'
      case 'in_progress': return 'text-[#66D9EF]'
      case 'pending': return 'text-[#E6DB74]'
      case 'cancelled': return 'text-[#F92672]'
      default: return 'text-[#75715E]'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />
      case 'in_progress': return <Activity className="w-5 h-5" />
      case 'pending': return <Clock className="w-5 h-5" />
      case 'cancelled': return <AlertCircle className="w-5 h-5" />
      default: return <Package className="w-5 h-5" />
    }
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-[#A6E22E]" />
      case 'milestone': return <Star className="w-4 h-4 text-[#E6DB74]" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-[#F92672]" />
      default: return <Activity className="w-4 h-4 text-[#66D9EF]" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#3E3D32] to-[#272822] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#66D9EF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#F8EFD6] text-lg">Loading order status...</p>
        </motion.div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#3E3D32] to-[#272822] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[#F92672] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#F8EFD6] mb-2">Order Not Found</h1>
          <p className="text-[#75715E] mb-6">The order you're looking for doesn't exist or has been removed.</p>
          <Button asChild variant="secondary">
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#3E3D32] to-[#272822]">
      {/* ECE Branding Header */}
      <div className="relative pt-8 pb-4">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <Link href="/orders" className="flex items-center space-x-3 group">
              <ArrowLeft className="w-5 h-5 text-[#66D9EF] group-hover:translate-x-[-4px] transition-transform" />
              <span className="text-[#66D9EF] font-medium">Back to Orders</span>
            </Link>
            
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-lg font-bold bg-gradient-to-r from-[#F8EFD6] to-[#66D9EF] bg-clip-text text-transparent">
                  ECE Trading Cards
                </h1>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard variant="dark" className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r from-[#66D9EF]/20 to-[#66D9EF]/10`}>
                      {getStatusIcon(orderData.status)}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(orderData.status)} bg-current/20 border-current/30`}
                    >
                      {orderData.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-[#F8EFD6] mb-2">
                    {orderData.title}
                  </h1>
                  
                  <div className="flex items-center space-x-6 text-[#75715E] text-sm">
                    <span>Order #{orderData.id}</span>
                    <span>•</span>
                    <span>Created {orderData.createdAt}</span>
                    <span>•</span>
                    <span>{orderData.amount.toLocaleString()} ECE</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#66D9EF]/30 text-[#66D9EF] hover:bg-[#66D9EF]/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#A6E22E]/30 text-[#A6E22E] hover:bg-[#A6E22E]/20"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#F8EFD6] font-medium">Progress</span>
                  <span className="text-[#66D9EF] font-bold">{orderData.progress}%</span>
                </div>
                <Progress value={orderData.progress} className="h-2" />
                <div className="flex justify-between items-center mt-2 text-sm text-[#75715E]">
                  <span>Estimated completion: {orderData.estimatedCompletion}</span>
                  <span>Last update: {orderData.lastUpdate}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Milestones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[#66D9EF]" />
                    Project Milestones
                  </h3>
                  
                  <div className="space-y-4">
                    {orderData.milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start space-x-4"
                      >
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${milestone.status === 'completed' 
                            ? 'bg-[#A6E22E]/20 text-[#A6E22E]'
                            : milestone.status === 'in_progress'
                            ? 'bg-[#66D9EF]/20 text-[#66D9EF]'
                            : 'bg-[#75715E]/20 text-[#75715E]'
                          }
                        `}>
                          {milestone.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : milestone.status === 'in_progress' ? (
                            <Activity className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#F8EFD6]">{milestone.title}</h4>
                          <p className="text-[#75715E] text-sm mb-1">{milestone.description}</p>
                          
                          {milestone.completedAt && (
                            <p className="text-[#A6E22E] text-xs">
                              Completed on {milestone.completedAt}
                            </p>
                          )}
                          
                          {milestone.estimatedDate && milestone.status === 'pending' && (
                            <p className="text-[#E6DB74] text-xs">
                              Estimated: {milestone.estimatedDate}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Recent Updates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard variant="dark" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#F8EFD6] flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-[#66D9EF]" />
                      Recent Updates
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUpdates(!showUpdates)}
                      className="text-[#66D9EF] hover:bg-[#66D9EF]/20"
                    >
                      {showUpdates ? 'Show Less' : 'Show All'}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    <div className="space-y-4">
                      {(showUpdates ? orderData.updates : orderData.updates.slice(0, 3)).map((update, index) => (
                        <motion.div
                          key={update.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: 0.05 * index }}
                          className="flex items-start space-x-3 p-3 bg-[#272822]/30 rounded-lg"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getUpdateIcon(update.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-[#F8EFD6] text-sm">{update.message}</p>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-[#75715E]">
                              <span>{update.author}</span>
                              <span>•</span>
                              <span>{update.timestamp}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard variant="light" className="p-6">
                  <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Order Details</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Type:</span>
                      <span className="text-[#F8EFD6]">{orderData.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Timeline:</span>
                      <span className="text-[#F8EFD6]">{orderData.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Amount:</span>
                      <span className="text-[#A6E22E] font-bold">{orderData.amount.toLocaleString()} ECE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Status:</span>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(orderData.status)} bg-current/20 border-current/30 text-xs`}
                      >
                        {orderData.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Assigned Team */}
              {orderData.assignedTeam && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <GlassCard variant="light" className="p-6">
                    <h3 className="text-lg font-bold text-[#F8EFD6] mb-4 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Assigned Team
                    </h3>
                    
                    <div className="space-y-2">
                      {orderData.assignedTeam.map((member, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#66D9EF] to-[#A6E22E] rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-[#F8EFD6]">{member}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard variant="light" className="p-6">
                  <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start bg-[#66D9EF]/20 text-[#66D9EF] hover:bg-[#66D9EF]/30"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Status
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start bg-[#A6E22E]/20 text-[#A6E22E] hover:bg-[#A6E22E]/30"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Share Progress
                    </Button>
                    
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start bg-[#E6DB74]/20 text-[#E6DB74] hover:bg-[#E6DB74]/30"
                    >
                      <Link href="/orders">
                        <Package className="w-4 h-4 mr-2" />
                        All Orders
                      </Link>
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>

          {/* ECE Branding Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 pt-8 border-t border-[#75715E]/30"
          >
            <p className="text-[#75715E] text-sm mb-2">
              Powered by <span className="text-[#66D9EF] font-semibold">ECE Trading Cards</span>
            </p>
            <p className="text-[#75715E] text-xs">
              Elite Card Exchange - Your Order, Our Commitment
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
