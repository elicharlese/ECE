'use client'

import React from 'react'
import { OrdersDashboard } from '@/components/orders-dashboard'
import { useSubscription } from '@/contexts/subscription-context'

export default function OrdersPage() {
  const { subscription } = useSubscription()
  
  // Mock user data - in production this would come from auth context
  const userId = 'user_pro_001'
  const userBalance = 2500.75 // ECE balance

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <OrdersDashboard 
          userId={userId} 
          userBalance={userBalance}
        />
      </div>
    </div>
  )
}
