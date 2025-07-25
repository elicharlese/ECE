'use client'

import React from 'react'
import { LinearOrderFlow } from '../../../components/orders/linear-order-flow/LinearOrderFlow'

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      <div className="container mx-auto py-8">
        <LinearOrderFlow />
      </div>
    </div>
  )
}
