'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TokenModel } from '@/components/3d/token-model'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coins, TrendingUp, Users, Shield, Zap, Globe } from 'lucide-react'

const tokenStats = [
  { label: 'Total Supply', value: '1,000,000,000', icon: Coins, color: 'text-ocean-primary' },
  { label: 'Market Cap', value: '$50,000,000', icon: TrendingUp, color: 'text-green-500' },
  { label: 'Holders', value: '15,247', icon: Users, color: 'text-blue-500' },
  { label: 'Staked', value: '65%', icon: Shield, color: 'text-purple-500' },
]

const features = [
  {
    icon: Zap,
    title: 'Fast Transactions',
    description: 'Lightning-fast transactions with minimal fees on our optimized blockchain infrastructure.'
  },
  {
    icon: Shield,
    title: 'Secure & Audited',
    description: 'Smart contracts audited by leading security firms to ensure maximum protection.'
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Trade and use ECE tokens anywhere in the world with our decentralized platform.'
  },
  {
    icon: Users,
    title: 'Community Governed',
    description: 'Token holders participate in governance decisions for the future of the platform.'
  }
]

export default function TokenPage() {
  const [autoRotate, setAutoRotate] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-dark via-ocean-primary to-ocean-success pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            ECE Token
          </h1>
          <p className="text-xl md:text-2xl text-ocean-light max-w-3xl mx-auto">
            The native utility token powering the ECE trading card ecosystem, 
            enabling governance, staking rewards, and exclusive platform benefits.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* 3D Token Model */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlassCard className="p-8 h-96">
              <div className="h-full relative">
                <TokenModel 
                  autoRotate={autoRotate} 
                  size={1.2} 
                  showControls={true}
                  className="h-full"
                />
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAutoRotate(!autoRotate)}
                    className="bg-white/10 hover:bg-white/20"
                  >
                    {autoRotate ? 'Pause' : 'Rotate'}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Token Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Token Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              {tokenStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <GlassCard className="p-6 text-center">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-ocean-light text-sm">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <Button className="w-full bg-gradient-tide hover:bg-gradient-sunset text-white font-semibold py-3">
                <Coins className="w-5 h-5 mr-2" />
                Buy ECE Token
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                View on Explorer
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Why Choose ECE Token?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              >
                <GlassCard className="p-6 h-full text-center hover:scale-105 transition-transform duration-300">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-ocean-success" />
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-ocean-light text-sm">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Token Utility Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <GlassCard className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Token Utility & Use Cases
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Badge variant="secondary" className="mb-4 bg-gradient-tide text-white">
                  Governance
                </Badge>
                <h3 className="text-xl font-semibold text-white mb-3">Platform Governance</h3>
                <p className="text-ocean-light">
                  Vote on platform upgrades, fee structures, and new feature implementations.
                </p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-4 bg-gradient-sunset text-white">
                  Staking
                </Badge>
                <h3 className="text-xl font-semibold text-white mb-3">Staking Rewards</h3>
                <p className="text-ocean-light">
                  Stake ECE tokens to earn rewards and participate in the platform's growth.
                </p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-4 bg-gradient-ocean text-white">
                  Trading
                </Badge>
                <h3 className="text-xl font-semibold text-white mb-3">Trading Benefits</h3>
                <p className="text-ocean-light">
                  Reduced fees, exclusive access to premium cards, and priority trading.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
