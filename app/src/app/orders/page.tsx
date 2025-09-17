'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LinearOrderFlow } from '@/components/orders/linear-flow/linear-order-flow'
import { toast } from 'react-hot-toast'

interface OrderFormData {
  repository: any
  analysis: any
  customerInfo: {
    name: string
    email: string
    phone: string
    company?: string
  }
  requirements: {
    customFeatures: string[]
    designPreferences: string
    timeline: string
    budget: number
    deploymentPlatform: string
    additionalNotes: string
  }
  orderDetails: {
    packageType: 'basic' | 'professional' | 'enterprise'
    totalCost: number
    estimatedDelivery: string
    includesSourseCode: boolean
    includesDeployment: boolean
    includesSupport: boolean
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleOrderComplete = async (orderData: OrderFormData) => {
    setIsProcessing(true)
    
    try {
      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryUrl: orderData.repository?.html_url,
          repositoryData: orderData.repository,
          analysisData: orderData.analysis,
          customerInfo: orderData.customerInfo,
          requirements: orderData.requirements,
          orderDetails: orderData.orderDetails,
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const result = await response.json()
      
      // Show success message
      toast.success('🎉 Order created successfully! You will receive a confirmation email shortly.')
      
      // Redirect to order tracking page
      router.push(`/orders/${result.orderId}`)
      
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Failed to create order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    // Redirect back to home or previous page
    router.push('/')
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Processing Your Order</h2>
          <p className="text-muted-foreground">Please wait while we set up your project...</p>
        </div>
      </div>
    )
  }

  return (
    <LinearOrderFlow
      onOrderComplete={handleOrderComplete}
      onCancel={handleCancel}
      initialStep={0}
    />
  )
}
