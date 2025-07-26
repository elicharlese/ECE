/**
 * Order Management Service
 * Handles complete order lifecycle, payments, and admin dashboard
 */

import { AppOrder, OrderStatus, PaymentStatus, GeneratedApp } from './app-generation-orchestrator.service'

export interface OrderDashboardData {
  activeOrders: AppOrder[]
  generationQueue: AppOrder[]
  completedOrders: AppOrder[]
  revenue: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
  }
  performance: {
    averageGenerationTime: number
    successRate: number
    revisionRate: number
    customerSatisfaction: number
  }
  analytics: {
    popularFeatures: Array<{ feature: string; count: number }>
    complexityDistribution: Record<string, number>
    revenueByComplexity: Record<string, number>
    timeToCompletion: Record<string, number>
  }
}

export interface OrderFilters {
  status?: OrderStatus[]
  paymentStatus?: PaymentStatus[]
  complexity?: string[]
  dateRange?: { start: Date; end: Date }
  searchTerm?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'totalAmount' | 'complexity'
  sortOrder?: 'asc' | 'desc'
}

export class OrderService {
  private orders: Map<string, AppOrder> = new Map()
  private generatedApps: Map<string, GeneratedApp> = new Map()
  private orderHistory: AppOrder[] = []
  
  /**
   * Create new order with validation and pricing calculation
   */
  async createOrder(orderData: Partial<AppOrder>): Promise<AppOrder> {
    // Validate order data
    this.validateOrderData(orderData)
    
    // Calculate pricing
    const pricing = this.calculatePricing(orderData.appSpecification!)
    
    // Calculate timeline
    const timeline = this.calculateTimeline(orderData.appSpecification!)
    
    // Generate legal terms
    const legal = this.generateLegalTerms(orderData.appSpecification!, pricing)
    
    const order: AppOrder = {
      id: orderData.id || `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: orderData.userId!,
      customerInfo: orderData.customerInfo!,
      appSpecification: orderData.appSpecification!,
      pricing,
      timeline,
      legal,
      status: 'pending_payment',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Store order
    this.orders.set(order.id, order)
    this.orderHistory.push(order)
    
    // Log order creation
    console.log(`📝 Order created: ${order.id} for ${order.customerInfo.name}`)
    
    return order
  }
  
  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<AppOrder> {
    const order = this.orders.get(orderId)
    if (!order) {
      throw new Error(`Order not found: ${orderId}`)
    }
    return order
  }
  
  /**
   * Update order status with audit trail
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const order = await this.getOrder(orderId)
    const previousStatus = order.status
    
    order.status = status
    order.updatedAt = new Date()
    
    // Store updated order
    this.orders.set(orderId, order)
    
    // Log status change
    console.log(`📊 Order ${orderId}: ${previousStatus} → ${status}`)
    
    // Update order history
    const historyIndex = this.orderHistory.findIndex(o => o.id === orderId)
    if (historyIndex !== -1) {
      this.orderHistory[historyIndex] = order
    }
    
    // Trigger webhooks/notifications
    await this.triggerStatusChangeWebhooks(order, previousStatus, status)
  }
  
  /**
   * Get admin dashboard data
   */
  async getAdminDashboard(filters?: OrderFilters): Promise<OrderDashboardData> {
    const allOrders = this.applyFilters(Array.from(this.orders.values()), filters)
    
    // Categorize orders
    const activeOrders = allOrders.filter(o => 
      ['pending_payment', 'payment_confirmed', 'contract_signed', 'in_queue', 
       'orchestrating', 'generating_core', 'generating_ui', 'integrating', 
       'testing', 'deploying', 'ready_for_review', 'revision_requested', 
       'revision_in_progress'].includes(o.status)
    )
    
    const generationQueue = allOrders.filter(o => 
      ['in_queue', 'orchestrating', 'generating_core', 'generating_ui', 
       'integrating', 'testing', 'deploying'].includes(o.status)
    )
    
    const completedOrders = allOrders.filter(o => 
      ['delivered', 'completed'].includes(o.status)
    )
    
    // Calculate revenue
    const revenue = this.calculateRevenue(allOrders)
    
    // Calculate performance metrics
    const performance = this.calculatePerformanceMetrics(allOrders)
    
    // Calculate analytics
    const analytics = this.calculateAnalytics(allOrders)
    
    return {
      activeOrders,
      generationQueue,
      completedOrders,
      revenue,
      performance,
      analytics
    }
  }
  
  /**
   * Get orders for specific user
   */
  async getUserOrders(userId: string): Promise<AppOrder[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
  
  /**
   * Get generated app for order
   */
  async getGeneratedApp(orderId: string): Promise<GeneratedApp | null> {
    return this.generatedApps.get(orderId) || null
  }
  
  /**
   * Store generated app
   */
  async storeGeneratedApp(orderId: string, app: GeneratedApp): Promise<void> {
    this.generatedApps.set(orderId, app)
    console.log(`🎴 Generated app stored for order: ${orderId}`)
  }
  
  /**
   * Cancel order with refund processing
   */
  async cancelOrder(orderId: string, reason: string): Promise<void> {
    const order = await this.getOrder(orderId)
    
    // Check if cancellation is allowed
    if (['delivered', 'completed', 'cancelled'].includes(order.status)) {
      throw new Error('Order cannot be cancelled in current status')
    }
    
    // Process refund if payment was completed
    if (order.paymentStatus === 'completed') {
      await this.processRefund(order, 'full', reason)
    }
    
    // Update status
    await this.updateOrderStatus(orderId, 'cancelled')
    
    console.log(`❌ Order cancelled: ${orderId} - Reason: ${reason}`)
  }
  
  /**
   * Process refund
   */
  async processRefund(order: AppOrder, type: 'full' | 'partial', reason: string, amount?: number): Promise<void> {
    const refundAmount = type === 'full' ? order.pricing.totalAmount : amount || 0
    
    // Process refund through payment service (would integrate with Stripe/PayPal)
    console.log(`💰 Processing ${type} refund: $${refundAmount} for order ${order.id}`)
    
    // Update payment status
    order.paymentStatus = type === 'full' ? 'refunded' : 'partial_refund'
    order.updatedAt = new Date()
    
    this.orders.set(order.id, order)
  }
  
  /**
   * Search orders with advanced filtering
   */
  async searchOrders(query: string, filters?: OrderFilters): Promise<AppOrder[]> {
    const allOrders = Array.from(this.orders.values())
    
    // Apply text search
    const searchResults = allOrders.filter(order => 
      order.customerInfo.name.toLowerCase().includes(query.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(query.toLowerCase()) ||
      order.appSpecification.name.toLowerCase().includes(query.toLowerCase()) ||
      order.appSpecification.description.toLowerCase().includes(query.toLowerCase()) ||
      order.id.toLowerCase().includes(query.toLowerCase())
    )
    
    // Apply additional filters
    return this.applyFilters(searchResults, filters)
  }
  
  /**
   * Get order analytics
   */
  async getOrderAnalytics(timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<{
    orderTrends: Array<{ date: string; orders: number; revenue: number }>
    complexityTrends: Array<{ complexity: string; count: number; avgRevenue: number }>
    featureTrends: Array<{ feature: string; popularity: number; avgPrice: number }>
    statusDistribution: Record<OrderStatus, number>
    conversionRates: {
      paymentToGeneration: number
      generationToDelivery: number
      overallSuccess: number
    }
  }> {
    const orders = Array.from(this.orders.values())
    const timeRange = this.getTimeRange(timeframe)
    
    return {
      orderTrends: this.calculateOrderTrends(orders, timeRange),
      complexityTrends: this.calculateComplexityTrends(orders),
      featureTrends: this.calculateFeatureTrends(orders),
      statusDistribution: this.calculateStatusDistribution(orders),
      conversionRates: this.calculateConversionRates(orders)
    }
  }
  
  // Private helper methods
  
  private validateOrderData(orderData: Partial<AppOrder>): void {
    if (!orderData.userId) throw new Error('User ID is required')
    if (!orderData.customerInfo) throw new Error('Customer info is required')
    if (!orderData.appSpecification) throw new Error('App specification is required')
    if (!orderData.customerInfo.name) throw new Error('Customer name is required')
    if (!orderData.customerInfo.email) throw new Error('Customer email is required')
    if (!orderData.appSpecification.name) throw new Error('App name is required')
    if (!orderData.appSpecification.features || orderData.appSpecification.features.length === 0) {
      throw new Error('App features are required')
    }
  }
  
  private calculatePricing(appSpec: AppOrder['appSpecification']) {
    // Base pricing by complexity
    const basePrices = {
      simple: 2500,
      medium: 5000,
      complex: 10000,
      enterprise: 25000
    }
    
    const basePrice = basePrices[appSpec.complexity] || basePrices.simple
    
    // Complexity multiplier
    const complexityMultipliers = {
      simple: 1.0,
      medium: 1.5,
      complex: 2.0,
      enterprise: 3.0
    }
    
    const complexityMultiplier = complexityMultipliers[appSpec.complexity] || 1.0
    
    // Feature add-ons
    const featurePricing = {
      '3D Integration': 1500,
      'AI/ML Features': 2000,
      'Real-time Chat': 800,
      'Payment Processing': 1200,
      'Advanced Analytics': 1000,
      'Multi-platform': 2500,
      'Custom Integrations': 1800,
      'Enterprise Security': 3000
    }
    
    const featureAddOns = appSpec.features.reduce((total, feature) => {
      return total + (featurePricing[feature] || 500)
    }, 0)
    
    const totalAmount = Math.round((basePrice * complexityMultiplier) + featureAddOns)
    
    return {
      basePrice,
      complexityMultiplier,
      featureAddOns,
      totalAmount,
      currency: 'USD' as const
    }
  }
  
  private calculateTimeline(appSpec: AppOrder['appSpecification']) {
    // Base timeline by complexity (in days)
    const baseTimelines = {
      simple: 3,
      medium: 7,
      complex: 14,
      enterprise: 21
    }
    
    const baseDays = baseTimelines[appSpec.complexity] || 7
    const featureDays = appSpec.features.length * 0.5 // 0.5 days per feature
    const totalDays = Math.ceil(baseDays + featureDays)
    
    const now = new Date()
    const estimatedCompletion = new Date(now.getTime() + totalDays * 24 * 60 * 60 * 1000)
    const revisionDeadline = new Date(estimatedCompletion.getTime() + 14 * 24 * 60 * 60 * 1000) // 2 weeks for revisions
    const finalDelivery = new Date(revisionDeadline.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days for final delivery
    
    return {
      estimatedCompletion,
      revisionDeadline,
      finalDelivery
    }
  }
  
  private generateLegalTerms(appSpec: AppOrder['appSpecification'], pricing: any) {
    return {
      contractId: `contract-${Date.now()}`,
      codeOwnership: 'client' as const,
      licenseType: 'MIT' as const,
      commercialRights: true,
      redistributionRights: pricing.totalAmount >= 10000 // Only for premium orders
    }
  }
  
  private applyFilters(orders: AppOrder[], filters?: OrderFilters): AppOrder[] {
    if (!filters) return orders
    
    let filtered = [...orders]
    
    if (filters.status) {
      filtered = filtered.filter(o => filters.status!.includes(o.status))
    }
    
    if (filters.paymentStatus) {
      filtered = filtered.filter(o => filters.paymentStatus!.includes(o.paymentStatus))
    }
    
    if (filters.complexity) {
      filtered = filtered.filter(o => filters.complexity!.includes(o.appSpecification.complexity))
    }
    
    if (filters.dateRange) {
      filtered = filtered.filter(o => 
        o.createdAt >= filters.dateRange!.start && 
        o.createdAt <= filters.dateRange!.end
      )
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(o => 
        o.customerInfo.name.toLowerCase().includes(term) ||
        o.appSpecification.name.toLowerCase().includes(term) ||
        o.id.toLowerCase().includes(term)
      )
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = this.getSortValue(a, filters.sortBy!)
        const bValue = this.getSortValue(b, filters.sortBy!)
        
        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1
        } else {
          return aValue > bValue ? 1 : -1
        }
      })
    }
    
    return filtered
  }
  
  private getSortValue(order: AppOrder, sortBy: string): any {
    switch (sortBy) {
      case 'createdAt': return order.createdAt.getTime()
      case 'updatedAt': return order.updatedAt.getTime()
      case 'totalAmount': return order.pricing.totalAmount
      case 'complexity': return order.appSpecification.complexity
      default: return order.createdAt.getTime()
    }
  }
  
  private calculateRevenue(orders: AppOrder[]) {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    
    const completedOrders = orders.filter(o => o.paymentStatus === 'completed')
    
    return {
      daily: this.sumRevenue(completedOrders.filter(o => o.createdAt >= oneDayAgo)),
      weekly: this.sumRevenue(completedOrders.filter(o => o.createdAt >= oneWeekAgo)),
      monthly: this.sumRevenue(completedOrders.filter(o => o.createdAt >= oneMonthAgo)),
      yearly: this.sumRevenue(completedOrders.filter(o => o.createdAt >= oneYearAgo))
    }
  }
  
  private sumRevenue(orders: AppOrder[]): number {
    return orders.reduce((total, order) => total + order.pricing.totalAmount, 0)
  }
  
  private calculatePerformanceMetrics(orders: AppOrder[]) {
    const completedOrders = orders.filter(o => ['delivered', 'completed'].includes(o.status))
    const totalOrders = orders.length
    
    if (totalOrders === 0) {
      return {
        averageGenerationTime: 0,
        successRate: 0,
        revisionRate: 0,
        customerSatisfaction: 0
      }
    }
    
    // Calculate average generation time
    const avgGenerationTime = completedOrders.reduce((total, order) => {
      const generationTime = order.updatedAt.getTime() - order.createdAt.getTime()
      return total + generationTime
    }, 0) / (completedOrders.length || 1)
    
    // Calculate success rate
    const successRate = (completedOrders.length / totalOrders) * 100
    
    // Calculate revision rate
    const ordersWithRevisions = orders.filter(o => 
      ['revision_requested', 'revision_in_progress'].includes(o.status)
    )
    const revisionRate = (ordersWithRevisions.length / totalOrders) * 100
    
    // Mock customer satisfaction (would come from surveys)
    const customerSatisfaction = 4.5 // Out of 5
    
    return {
      averageGenerationTime: Math.round(avgGenerationTime / (1000 * 60 * 60)), // Convert to hours
      successRate: Math.round(successRate * 100) / 100,
      revisionRate: Math.round(revisionRate * 100) / 100,
      customerSatisfaction
    }
  }
  
  private calculateAnalytics(orders: AppOrder[]) {
    // Popular features
    const featureCount = new Map<string, number>()
    orders.forEach(order => {
      order.appSpecification.features.forEach(feature => {
        featureCount.set(feature, (featureCount.get(feature) || 0) + 1)
      })
    })
    
    const popularFeatures = Array.from(featureCount.entries())
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    // Complexity distribution
    const complexityDistribution = orders.reduce((acc, order) => {
      const complexity = order.appSpecification.complexity
      acc[complexity] = (acc[complexity] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Revenue by complexity
    const revenueByComplexity = orders.reduce((acc, order) => {
      const complexity = order.appSpecification.complexity
      acc[complexity] = (acc[complexity] || 0) + order.pricing.totalAmount
      return acc
    }, {} as Record<string, number>)
    
    // Time to completion
    const timeToCompletion = orders
      .filter(o => ['delivered', 'completed'].includes(o.status))
      .reduce((acc, order) => {
        const complexity = order.appSpecification.complexity
        const completionTime = (order.updatedAt.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        
        if (!acc[complexity]) {
          acc[complexity] = []
        }
        acc[complexity].push(completionTime)
        return acc
      }, {} as Record<string, number[]>)
    
    // Calculate averages
    const avgTimeToCompletion = Object.keys(timeToCompletion).reduce((acc, complexity) => {
      const times = timeToCompletion[complexity]
      acc[complexity] = times.reduce((sum, time) => sum + time, 0) / times.length
      return acc
    }, {} as Record<string, number>)
    
    return {
      popularFeatures,
      complexityDistribution,
      revenueByComplexity,
      timeToCompletion: avgTimeToCompletion
    }
  }
  
  private async triggerStatusChangeWebhooks(order: AppOrder, previousStatus: OrderStatus, newStatus: OrderStatus): Promise<void> {
    // Emit real-time updates for admin dashboard
    console.log(`🔔 Status change webhook: ${order.id} ${previousStatus} → ${newStatus}`)
    
    // Would integrate with WebSocket, SSE, or webhook systems
    // this.websocketService.emit('order_status_changed', { orderId: order.id, previousStatus, newStatus })
  }
  
  private getTimeRange(timeframe: string): { start: Date; end: Date } {
    const now = new Date()
    const start = new Date()
    
    switch (timeframe) {
      case 'daily':
        start.setHours(0, 0, 0, 0)
        break
      case 'weekly':
        start.setDate(now.getDate() - 7)
        break
      case 'monthly':
        start.setMonth(now.getMonth() - 1)
        break
      case 'yearly':
        start.setFullYear(now.getFullYear() - 1)
        break
    }
    
    return { start, end: now }
  }
  
  private calculateOrderTrends(orders: AppOrder[], timeRange: { start: Date; end: Date }) {
    // Group orders by date and calculate trends
    const trends = new Map<string, { orders: number; revenue: number }>()
    
    orders
      .filter(o => o.createdAt >= timeRange.start && o.createdAt <= timeRange.end)
      .forEach(order => {
        const dateKey = order.createdAt.toISOString().split('T')[0]
        const existing = trends.get(dateKey) || { orders: 0, revenue: 0 }
        
        trends.set(dateKey, {
          orders: existing.orders + 1,
          revenue: existing.revenue + (order.paymentStatus === 'completed' ? order.pricing.totalAmount : 0)
        })
      })
    
    return Array.from(trends.entries()).map(([date, data]) => ({
      date,
      orders: data.orders,
      revenue: data.revenue
    }))
  }
  
  private calculateComplexityTrends(orders: AppOrder[]) {
    const complexities = ['simple', 'medium', 'complex', 'enterprise']
    
    return complexities.map(complexity => {
      const complexityOrders = orders.filter(o => o.appSpecification.complexity === complexity)
      const avgRevenue = complexityOrders.length > 0 
        ? complexityOrders.reduce((sum, o) => sum + o.pricing.totalAmount, 0) / complexityOrders.length 
        : 0
      
      return {
        complexity,
        count: complexityOrders.length,
        avgRevenue: Math.round(avgRevenue)
      }
    })
  }
  
  private calculateFeatureTrends(orders: AppOrder[]) {
    const featureStats = new Map<string, { count: number; totalPrice: number }>()
    
    orders.forEach(order => {
      order.appSpecification.features.forEach(feature => {
        const existing = featureStats.get(feature) || { count: 0, totalPrice: 0 }
        featureStats.set(feature, {
          count: existing.count + 1,
          totalPrice: existing.totalPrice + order.pricing.totalAmount
        })
      })
    })
    
    return Array.from(featureStats.entries()).map(([feature, stats]) => ({
      feature,
      popularity: stats.count,
      avgPrice: Math.round(stats.totalPrice / stats.count)
    })).sort((a, b) => b.popularity - a.popularity)
  }
  
  private calculateStatusDistribution(orders: AppOrder[]) {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<OrderStatus, number>)
  }
  
  private calculateConversionRates(orders: AppOrder[]) {
    const paidOrders = orders.filter(o => o.paymentStatus === 'completed')
    const generatedOrders = orders.filter(o => 
      ['ready_for_review', 'revision_requested', 'revision_in_progress', 
       'final_approval', 'delivered', 'completed'].includes(o.status)
    )
    const deliveredOrders = orders.filter(o => ['delivered', 'completed'].includes(o.status))
    
    const totalOrders = orders.length
    
    if (totalOrders === 0) {
      return { paymentToGeneration: 0, generationToDelivery: 0, overallSuccess: 0 }
    }
    
    return {
      paymentToGeneration: (generatedOrders.length / paidOrders.length) * 100 || 0,
      generationToDelivery: (deliveredOrders.length / generatedOrders.length) * 100 || 0,
      overallSuccess: (deliveredOrders.length / totalOrders) * 100
    }
  }
}

// Export singleton instance
export const orderService = new OrderService()
