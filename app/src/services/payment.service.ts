/**
 * Payment Processing Service
 * Handles all payment operations, billing, and financial transactions
 */

import { AppOrder, PaymentStatus } from './app-generation-orchestrator.service'

export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'wire_transfer' | 'crypto'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  billingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export interface PaymentIntent {
  id: string
  orderId: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled'
  paymentMethodId: string
  clientSecret?: string
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  orderId: string
  number: string
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paidAt?: Date
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd?: Date
  createdAt: Date
}

export class PaymentService {
  private paymentIntents: Map<string, PaymentIntent> = new Map()
  private invoices: Map<string, Invoice> = new Map()
  private paymentMethods: Map<string, PaymentMethod[]> = new Map()
  private subscriptions: Map<string, Subscription> = new Map()
  
  // Stripe-like configuration
  private readonly config = {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    taxRates: {
      'US': 0.08, // 8% sales tax
      'CA': 0.13, // 13% HST
      'EU': 0.20, // 20% VAT
      'UK': 0.20, // 20% VAT
    }
  }
  
  /**
   * Create payment intent for order
   */
  async createPaymentIntent(order: AppOrder, paymentMethodId: string): Promise<PaymentIntent> {
    // Calculate final amount with taxes
    const amount = this.calculateTotalAmount(order)
    
    const paymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: order.id,
      amount,
      currency: order.pricing.currency,
      status: 'pending',
      paymentMethodId,
      clientSecret: this.generateClientSecret(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Store payment intent
    this.paymentIntents.set(paymentIntent.id, paymentIntent)
    
    console.log(`💳 Payment intent created: ${paymentIntent.id} for $${amount}`)
    
    // In real implementation, would call Stripe API
    // const stripeIntent = await stripe.paymentIntents.create({
    //   amount: amount * 100, // Convert to cents
    //   currency: order.pricing.currency.toLowerCase(),
    //   payment_method: paymentMethodId,
    //   confirmation_method: 'manual',
    //   confirm: true,
    //   metadata: { orderId: order.id }
    // })
    
    return paymentIntent
  }
  
  /**
   * Confirm payment
   */
  async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId)
    if (!paymentIntent) {
      throw new Error(`Payment intent not found: ${paymentIntentId}`)
    }
    
    // Simulate payment processing
    paymentIntent.status = 'processing'
    paymentIntent.updatedAt = new Date()
    
    // Simulate async payment confirmation
    setTimeout(() => {
      // 95% success rate simulation
      const success = Math.random() > 0.05
      
      if (success) {
        paymentIntent.status = 'succeeded'
        console.log(`✅ Payment confirmed: ${paymentIntentId}`)
        
        // Generate invoice
        this.generateInvoice(paymentIntent.orderId, paymentIntent.amount)
        
        // Update order payment status
        this.updateOrderPaymentStatus(paymentIntent.orderId, 'completed')
      } else {
        paymentIntent.status = 'failed'
        paymentIntent.errorMessage = 'Payment declined by bank'
        console.log(`❌ Payment failed: ${paymentIntentId}`)
        
        this.updateOrderPaymentStatus(paymentIntent.orderId, 'failed')
      }
      
      paymentIntent.updatedAt = new Date()
      this.paymentIntents.set(paymentIntentId, paymentIntent)
    }, 2000) // 2 second delay
    
    return paymentIntent
  }
  
  /**
   * Process refund
   */
  async processRefund(paymentIntentId: string, amount?: number, reason?: string): Promise<{
    id: string
    amount: number
    status: 'pending' | 'succeeded' | 'failed'
    reason?: string
  }> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId)
    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      throw new Error('Invalid payment intent for refund')
    }
    
    const refundAmount = amount || paymentIntent.amount
    
    if (refundAmount > paymentIntent.amount) {
      throw new Error('Refund amount cannot exceed original payment amount')
    }
    
    const refund = {
      id: `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: refundAmount,
      status: 'pending' as const,
      reason
    }
    
    console.log(`💰 Processing refund: ${refund.id} for $${refundAmount}`)
    
    // Simulate refund processing
    setTimeout(() => {
      refund.status = 'succeeded'
      console.log(`✅ Refund processed: ${refund.id}`)
      
      // Update order payment status
      if (refundAmount === paymentIntent.amount) {
        this.updateOrderPaymentStatus(paymentIntent.orderId, 'refunded')
      } else {
        this.updateOrderPaymentStatus(paymentIntent.orderId, 'partial_refund')
      }
    }, 1000)
    
    return refund
  }
  
  /**
   * Add payment method for user
   */
  async addPaymentMethod(userId: string, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const method: PaymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...paymentMethod
    }
    
    const userMethods = this.paymentMethods.get(userId) || []
    
    // If this is set as default, remove default from others
    if (method.isDefault) {
      userMethods.forEach(m => m.isDefault = false)
    }
    
    userMethods.push(method)
    this.paymentMethods.set(userId, userMethods)
    
    console.log(`💳 Payment method added for user: ${userId}`)
    
    return method
  }
  
  /**
   * Get user payment methods
   */
  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return this.paymentMethods.get(userId) || []
  }
  
  /**
   * Remove payment method
   */
  async removePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    const userMethods = this.paymentMethods.get(userId) || []
    const filteredMethods = userMethods.filter(m => m.id !== paymentMethodId)
    
    this.paymentMethods.set(userId, filteredMethods)
    
    console.log(`🗑️ Payment method removed: ${paymentMethodId}`)
  }
  
  /**
   * Generate invoice
   */
  async generateInvoice(orderId: string, amount: number): Promise<Invoice> {
    const invoice: Invoice = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      amount,
      currency: 'USD',
      status: 'paid',
      dueDate: new Date(),
      lineItems: [
        {
          description: 'App Generation Service',
          quantity: 1,
          unitPrice: amount,
          total: amount
        }
      ],
      taxAmount: this.calculateTax(amount, 'US'),
      discountAmount: 0,
      totalAmount: amount + this.calculateTax(amount, 'US'),
      paidAt: new Date(),
      createdAt: new Date()
    }
    
    this.invoices.set(invoice.id, invoice)
    
    console.log(`📄 Invoice generated: ${invoice.number}`)
    
    return invoice
  }
  
  /**
   * Get invoice
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = this.invoices.get(invoiceId)
    if (!invoice) {
      throw new Error(`Invoice not found: ${invoiceId}`)
    }
    return invoice
  }
  
  /**
   * Get invoices for order
   */
  async getOrderInvoices(orderId: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values())
      .filter(invoice => invoice.orderId === orderId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
  
  /**
   * Create subscription for user
   */
  async createSubscription(userId: string, planId: string): Promise<Subscription> {
    const subscription: Subscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      planId,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      cancelAtPeriodEnd: false,
      createdAt: new Date()
    }
    
    this.subscriptions.set(subscription.id, subscription)
    
    console.log(`📋 Subscription created: ${subscription.id} for user: ${userId}`)
    
    return subscription
  }
  
  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId)
    if (!subscription) {
      throw new Error(`Subscription not found: ${subscriptionId}`)
    }
    
    if (immediately) {
      subscription.status = 'cancelled'
      subscription.currentPeriodEnd = new Date()
    } else {
      subscription.cancelAtPeriodEnd = true
    }
    
    this.subscriptions.set(subscriptionId, subscription)
    
    console.log(`❌ Subscription cancelled: ${subscriptionId}`)
  }
  
  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(timeframe: 'daily' | 'weekly' | 'monthly'): Promise<{
    totalRevenue: number
    successfulPayments: number
    failedPayments: number
    refundAmount: number
    averageOrderValue: number
    paymentMethodDistribution: Record<string, number>
    revenueByDay: Array<{ date: string; revenue: number }>
  }> {
    const payments = Array.from(this.paymentIntents.values())
    const timeRange = this.getTimeRange(timeframe)
    
    const recentPayments = payments.filter(p => 
      p.createdAt >= timeRange.start && p.createdAt <= timeRange.end
    )
    
    const successfulPayments = recentPayments.filter(p => p.status === 'succeeded')
    const failedPayments = recentPayments.filter(p => p.status === 'failed')
    
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0)
    const averageOrderValue = successfulPayments.length > 0 
      ? totalRevenue / successfulPayments.length 
      : 0
    
    // Calculate payment method distribution
    const methodDistribution = successfulPayments.reduce((acc, payment) => {
      const methods = Array.from(this.paymentMethods.values()).flat()
      const method = methods.find(m => m.id === payment.paymentMethodId)
      const type = method?.type || 'unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Calculate daily revenue
    const revenueByDay = this.calculateDailyRevenue(successfulPayments, timeRange)
    
    return {
      totalRevenue,
      successfulPayments: successfulPayments.length,
      failedPayments: failedPayments.length,
      refundAmount: 0, // Would calculate from refund records
      averageOrderValue,
      paymentMethodDistribution: methodDistribution,
      revenueByDay
    }
  }
  
  // Private helper methods
  
  private calculateTotalAmount(order: AppOrder): number {
    const baseAmount = order.pricing.totalAmount
    const taxAmount = this.calculateTax(baseAmount, order.customerInfo.country || 'US')
    return baseAmount + taxAmount
  }
  
  private calculateTax(amount: number, country: string): number {
    const taxRate = this.config.taxRates[country] || this.config.taxRates['US']
    return Math.round(amount * taxRate)
  }
  
  private generateClientSecret(): string {
    return `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 16)}`
  }
  
  private async updateOrderPaymentStatus(orderId: string, status: PaymentStatus): Promise<void> {
    // Would integrate with order service
    console.log(`📊 Order ${orderId} payment status updated to: ${status}`)
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
    }
    
    return { start, end: now }
  }
  
  private calculateDailyRevenue(payments: PaymentIntent[], timeRange: { start: Date; end: Date }) {
    const dailyRevenue = new Map<string, number>()
    
    payments.forEach(payment => {
      const dateKey = payment.createdAt.toISOString().split('T')[0]
      const existing = dailyRevenue.get(dateKey) || 0
      dailyRevenue.set(dateKey, existing + payment.amount)
    })
    
    return Array.from(dailyRevenue.entries()).map(([date, revenue]) => ({
      date,
      revenue
    }))
  }
  
  /**
   * Webhook handler for payment events
   */
  async handleWebhook(payload: any, signature: string): Promise<void> {
    // Verify webhook signature
    if (!this.verifyWebhookSignature(payload, signature)) {
      throw new Error('Invalid webhook signature')
    }
    
    const event = payload
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object)
        break
      case 'invoice.payment_succeeded':
        await this.handleInvoicePayment(event.data.object)
        break
      default:
        console.log(`Unhandled webhook event: ${event.type}`)
    }
  }
  
  private verifyWebhookSignature(payload: any, signature: string): boolean {
    // Would implement actual signature verification
    return true
  }
  
  private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
    console.log(`✅ Webhook: Payment succeeded for ${paymentIntent.id}`)
    // Update internal records
  }
  
  private async handlePaymentFailure(paymentIntent: any): Promise<void> {
    console.log(`❌ Webhook: Payment failed for ${paymentIntent.id}`)
    // Handle payment failure
  }
  
  private async handleInvoicePayment(invoice: any): Promise<void> {
    console.log(`📄 Webhook: Invoice paid ${invoice.id}`)
    // Update invoice status
  }
}

// Export singleton instance
export const paymentService = new PaymentService()
