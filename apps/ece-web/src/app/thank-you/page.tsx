'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle, 
  Download, 
  Share, 
  Calendar, 
  Clock,
  Star,
  Gift,
  Sparkles,
  ArrowRight,
  Home,
  Package,
  ExternalLink
} from 'lucide-react'
import { GlassCard } from '../../components/ui/glass-card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

export default function ThankYou() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const orderId = searchParams?.get('orderId') ?? null
  const orderType = searchParams?.get('type') ?? null

  useEffect(() => {
    // Simulate fetching order data
    const fetchOrderData = async () => {
      setIsLoading(true)
      // Mock order data based on type
      const mockData = {
        id: orderId || 'ECE-2025-001',
        type: orderType || 'APP_DEVELOPMENT',
        title: orderType === 'CARD_ENHANCEMENT' 
          ? 'Tesla Model S Enhancement Package'
          : orderType === 'CARD_UPGRADE'
          ? 'Epic Card Rarity Upgrades'
          : 'Custom SaaS Dashboard',
        amount: orderType === 'CARD_ENHANCEMENT' ? 2500 : orderType === 'CARD_UPGRADE' ? 3200 : 15000,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        timeline: orderType === 'CARD_ENHANCEMENT' ? '3-5 days' : '2-4 weeks',
        status: 'confirmed',
        bonusRewards: Math.floor(Math.random() * 500) + 100
      }
      
      setTimeout(() => {
        setOrderData(mockData)
        setIsLoading(false)
      }, 1000)
    }

    fetchOrderData()
  }, [orderId, orderType])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ECE Trading Cards - Order Confirmed',
        text: `I just placed an order on ECE Trading Cards! 🎉`,
        url: window.location.href
      })
    }
  }

  const handleDownloadReceipt = () => {
    // Mock download functionality
    console.log('Downloading receipt...')
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
          <p className="text-[#F8EFD6] text-lg">Processing your order...</p>
        </motion.div>
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
            className="text-center"
          >
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#F8EFD6] to-[#66D9EF] bg-clip-text text-transparent">
                  ECE Trading Cards
                </h1>
                <p className="text-[#75715E] text-sm">Elite Card Exchange</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Success Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-[#F8EFD6] mb-4"
            >
              Order Confirmed! 🎉
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-[#75715E] max-w-2xl mx-auto"
            >
              Thank you for choosing ECE Trading Cards! Your order has been successfully placed and our team is already working on it.
            </motion.p>
          </div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <GlassCard variant="dark" className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div>
                  <h3 className="text-2xl font-bold text-[#F8EFD6] mb-6 flex items-center">
                    <Package className="w-6 h-6 mr-3 text-[#66D9EF]" />
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-[#F8EFD6]">{orderData.title}</p>
                        <Badge 
                          variant="secondary" 
                          className="mt-1 bg-[#66D9EF]/20 text-[#66D9EF] border-[#66D9EF]/30"
                        >
                          {orderData.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-[#A6E22E]">
                        {orderData.amount.toLocaleString()} ECE
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-[#75715E]/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#75715E]">Order ID:</span>
                        <span className="text-[#F8EFD6] font-mono">{orderData.id}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-[#75715E]">Status:</span>
                        <span className="text-[#A6E22E] capitalize">{orderData.status}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-[#75715E]">Timeline:</span>
                        <span className="text-[#F8EFD6]">{orderData.timeline}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline & Rewards */}
                <div>
                  <h3 className="text-2xl font-bold text-[#F8EFD6] mb-6 flex items-center">
                    <Gift className="w-6 h-6 mr-3 text-[#E6DB74]" />
                    What's Next
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#A6E22E]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-[#A6E22E]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#F8EFD6]">Order Confirmed</p>
                        <p className="text-[#75715E] text-sm">Your payment has been processed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#66D9EF]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-[#66D9EF]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#F8EFD6]">In Progress</p>
                        <p className="text-[#75715E] text-sm">Our team is working on your order</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#E6DB74]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-[#E6DB74]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#F8EFD6]">Delivery</p>
                        <p className="text-[#75715E] text-sm">Expected by {orderData.estimatedDelivery}</p>
                      </div>
                    </div>

                    {/* Bonus Rewards */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-[#E6DB74]/20 to-[#F92672]/20 rounded-lg border border-[#E6DB74]/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-5 h-5 text-[#E6DB74]" />
                        <span className="font-semibold text-[#F8EFD6]">Bonus Rewards!</span>
                      </div>
                      <p className="text-[#75715E] text-sm">
                        You've earned <span className="text-[#E6DB74] font-bold">{orderData.bonusRewards} ECE tokens</span> for this order!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="flex items-center justify-center space-x-2 border-[#66D9EF]/30 text-[#66D9EF] hover:bg-[#66D9EF]/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Receipt</span>
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex items-center justify-center space-x-2 border-[#A6E22E]/30 text-[#A6E22E] hover:bg-[#A6E22E]/20"
            >
              <Share className="w-4 h-4" />
              <span>Share Order</span>
            </Button>
            
            <Link href="/orders" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-4 py-2 space-x-2 border-[#F92672]/30 text-[#F92672] hover:bg-[#F92672]/20 bg-background">
                <Package className="w-4 h-4" />
                <span>View Orders</span>
            </Link>
            
            <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-4 py-2 space-x-2 border-[#E6DB74]/30 text-[#E6DB74] hover:bg-[#E6DB74]/20 bg-background">
                <Home className="w-4 h-4" />
                <span>Back Home</span>
            </Link>
          </motion.div>

          {/* Additional Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Continue Exploring */}
            <GlassCard variant="light" className="p-6">
              <h4 className="text-lg font-semibold text-[#F8EFD6] mb-3">
                Continue Exploring
              </h4>
              <p className="text-[#75715E] text-sm mb-4">
                Discover more cards and features while you wait for your order.
              </p>
              <Link href="/app/discover" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-[#66D9EF]/20 text-[#66D9EF] hover:bg-[#66D9EF]/30">
                  Discover Cards
                  <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </GlassCard>

            {/* Support */}
            <GlassCard variant="light" className="p-6">
              <h4 className="text-lg font-semibold text-[#F8EFD6] mb-3">
                Need Help?
              </h4>
              <p className="text-[#75715E] text-sm mb-4">
                Our support team is here to help with any questions about your order.
              </p>
              <Link href="/support" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-[#A6E22E]/20 text-[#A6E22E] hover:bg-[#A6E22E]/30">
                  Contact Support
                  <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </GlassCard>
          </motion.div>

          {/* ECE Branding Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 pt-8 border-t border-[#75715E]/30"
          >
            <p className="text-[#75715E] text-sm mb-2">
              Powered by <span className="text-[#66D9EF] font-semibold">ECE Trading Cards</span>
            </p>
            <p className="text-[#75715E] text-xs">
              Elite Card Exchange - Where Digital Meets Value
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
