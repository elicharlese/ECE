'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Package, Clock, CheckCircle } from 'lucide-react'
import { OrderForm } from '../../components/order-form'
import { OrdersDashboard } from '../../components/orders-dashboard'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Badge } from '../../components/ui/badge'
import SolanaWallet from '../../components/solana-wallet'

// Mock user data - replace with actual auth
const mockUser = {
  id: 'user_123',
  email: 'user@example.com',
  username: 'demo_user',
  eceBalance: 12000
}

interface QuickStats {
  activeOrders: number
  completedOrders: number
  totalSpent: number
  avgDeliveryTime: number
}

export default function OrdersPage() {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [quickStats, setQuickStats] = useState<QuickStats>({
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    avgDeliveryTime: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load quick stats for the header
  useEffect(() => {
    const loadQuickStats = async () => {
      try {
        // Fetch active orders
        const activeResponse = await fetch(`/api/orders?userId=${mockUser.id}&status=IN_PROGRESS`)
        const activeData = await activeResponse.json()
        
        // Fetch completed orders
        const completedResponse = await fetch(`/api/orders?userId=${mockUser.id}&status=COMPLETED`)
        const completedData = await completedResponse.json()
        
        const activeOrders = activeData.success ? activeData.data.length : 0
        const completedOrders = completedData.success ? completedData.data.length : 0
        const totalSpent = completedData.success 
          ? completedData.data.reduce((sum: number, order: any) => sum + (order.actualCost || order.estimatedCost), 0)
          : 0

        setQuickStats({
          activeOrders,
          completedOrders,
          totalSpent,
          avgDeliveryTime: 18 // Mock average - would calculate from actual data
        })
      } catch (error) {
        console.error('Failed to load quick stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuickStats()
  }, [])

  const handleOrderCreated = () => {
    setShowOrderForm(false)
    setActiveTab('dashboard')
    // Refresh stats
    window.location.reload()
  }

  const handleOrderSubmit = async (orderData: any) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          userId: mockUser.id
        })
      })

      if (response.ok) {
        handleOrderCreated()
      } else {
        const error = await response.json()
        alert(`Error creating order: ${error.error}`)
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Failed to submit order')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                App Orders
              </h1>
              <p className="text-lg text-gray-600">
                Order custom full-stack applications built to your specifications
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-200">
                <span className="text-sm text-gray-600">ECE Balance:</span>
                <span className="ml-2 text-lg font-bold text-blue-600">
                  {mockUser.eceBalance.toLocaleString()} ECE
                </span>
              </div>
              
              <Button
                onClick={() => setShowOrderForm(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Order
              </Button>
            </div>
          </div>

          {/* Quick Stats Cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Orders</p>
                      <p className="text-2xl font-bold text-blue-600">{quickStats.activeOrders}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{quickStats.completedOrders}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {quickStats.totalSpent.toLocaleString()} ECE
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Delivery</p>
                      <p className="text-2xl font-bold text-orange-600">{quickStats.avgDeliveryTime}d</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/60 backdrop-blur-sm border border-blue-200 grid w-full max-w-lg grid-cols-3">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                My Orders
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Services
              </TabsTrigger>
              <TabsTrigger 
                value="wallet" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                ECE Wallet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <OrdersDashboard userId={mockUser.id} userBalance={mockUser.eceBalance} />
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Available Services</CardTitle>
                  <CardDescription>
                    Choose from our range of professional development services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Service Cards */}
                    {[
                      {
                        title: 'SaaS Dashboard',
                        description: 'Complete dashboard with user management, analytics, and billing',
                        price: '4,800 - 9,600 ECE',
                        timeline: '2-4 weeks',
                        features: ['User Auth', 'Analytics', 'Payment Integration', 'Admin Panel'],
                        complexity: 'High'
                      },
                      {
                        title: 'Portfolio Site',
                        description: 'Professional portfolio with animations and modern design',
                        price: '3,200 - 6,400 ECE',
                        timeline: '1-3 weeks',
                        features: ['Responsive Design', 'Animations', 'Contact Forms', 'SEO'],
                        complexity: 'Low'
                      },
                      {
                        title: 'E-Commerce Store',
                        description: 'Full-featured online store with payment processing',
                        price: '5,200 - 10,400 ECE',
                        timeline: '3-4 weeks',
                        features: ['Product Catalog', 'Shopping Cart', 'Payments', 'Admin Dashboard'],
                        complexity: 'High'
                      },
                      {
                        title: 'Landing Page',
                        description: 'High-converting landing page with modern animations',
                        price: '2,400 - 4,800 ECE',
                        timeline: '1-2 weeks',
                        features: ['Conversion Optimized', 'Animations', 'Forms', 'Analytics'],
                        complexity: 'Low'
                      },
                      {
                        title: 'Mobile App',
                        description: 'Cross-platform mobile app with native features',
                        price: '5,600 - 11,200 ECE',
                        timeline: '3-5 weeks',
                        features: ['React Native', 'Push Notifications', 'Offline Support', 'App Store Ready'],
                        complexity: 'High'
                      },
                      {
                        title: 'Web Application',
                        description: 'Custom web application with advanced functionality',
                        price: '4,800 - 9,600 ECE',
                        timeline: '2-4 weeks',
                        features: ['Custom Features', 'Database Design', 'API Integration', 'Scalable'],
                        complexity: 'Medium'
                      }
                    ].map((service, index) => (
                      <Card key={index} className="bg-white/60 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <Badge variant={service.complexity === 'High' ? 'destructive' : service.complexity === 'Medium' ? 'default' : 'secondary'}>
                              {service.complexity}
                            </Badge>
                          </div>
                          <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="text-lg font-bold text-blue-600">{service.price}</p>
                              <p className="text-sm text-gray-600">{service.timeline}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-2">Features:</p>
                              <div className="flex flex-wrap gap-1">
                                {service.features.map((feature, featureIndex) => (
                                  <Badge key={featureIndex} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Button 
                              onClick={() => setShowOrderForm(true)}
                              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            >
                              Order Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-6">
              <SolanaWallet
                userId={mockUser.id}
                onConnect={(address) => {
                  console.log('Wallet connected:', address)
                  // Handle wallet connection
                }}
                onDisconnect={() => {
                  console.log('Wallet disconnected')
                  // Handle wallet disconnection
                }}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          onSubmit={handleOrderSubmit}
          onClose={() => setShowOrderForm(false)}
          isOpen={showOrderForm}
          userBalance={mockUser.eceBalance}
        />
      )}
    </div>
  )
}
