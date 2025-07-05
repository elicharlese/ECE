'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  TrendingUp, 
  ShoppingCart, 
  Swords,
  Lock,
  Vote,
  Settings,
  BarChart3,
  Zap,
  Shield,
  Users,
  DollarSign,
  Clock,
  Award,
  Activity,
  Database,
  TestTube,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'

const marketplaceFeatures = [
  {
    title: 'Prediction Markets',
    description: 'Prize Picks style betting on company performance metrics with real-time odds',
    icon: TrendingUp,
    color: 'from-[#A6E22E] to-[#3EBA7C]',
    href: '/marketplace?tab=betting',
    status: 'Live',
    features: ['Real-time odds', 'Multiple bet types', 'Automated payouts', 'Community sentiment']
  },
  {
    title: 'Card Auctions',
    description: 'Webull-style auction platform with advanced analytics and bidding features',
    icon: ShoppingCart,
    color: 'from-[#66D9EF] to-[#819AFF]',
    href: '/marketplace?tab=auctions',
    status: 'Live',
    features: ['Live bidding', 'Price analytics', 'Instant buy', 'Rarity filtering']
  },
  {
    title: 'M&A Battles',
    description: 'Tinder-style gamified M&A prediction and community voting platform',
    icon: Swords,
    color: 'from-[#F92672] to-[#FD5C63]',
    href: '/marketplace?tab=battles',
    status: 'Live',
    features: ['Company matching', 'Strategic voting', 'Deal analysis', 'Community rewards']
  },
  {
    title: 'ECE Staking',
    description: 'Stake ECE tokens across multiple pools to earn rewards and governance rights',
    icon: Lock,
    color: 'from-[#E6DB74] to-[#F39C12]',
    href: '/staking',
    status: 'New',
    features: ['15%+ APY', 'Multiple pools', 'Flexible lockup', 'Revenue sharing']
  },
  {
    title: 'Governance',
    description: 'Participate in community governance and shape the marketplace future',
    icon: Vote,
    color: 'from-[#75715E] to-[#95A5A6]',
    href: '/governance',
    status: 'New',
    features: ['Token voting', 'Proposal creation', 'Community decisions', 'Protocol upgrades']
  },
  {
    title: 'Admin Dashboard',
    description: 'Comprehensive marketplace management with automation and analytics',
    icon: Settings,
    color: 'from-[#9B59B6] to-[#8E44AD]',
    href: '/admin/marketplace',
    status: 'Pro',
    features: ['Real-time monitoring', 'Automation controls', 'System logs', 'Performance metrics']
  }
]

const platformStats = [
  { label: 'Total Volume', value: '$2.4M+', icon: DollarSign, color: 'text-[#A6E22E]' },
  { label: 'Active Users', value: '15,000+', icon: Users, color: 'text-[#66D9EF]' },
  { label: 'Markets Created', value: '500+', icon: BarChart3, color: 'text-[#F92672]' },
  { label: 'ECE Staked', value: '8.5M', icon: Lock, color: 'text-[#E6DB74]' }
]

const automationFeatures = [
  {
    title: 'Market Maker Algorithms',
    description: 'Automated odds calculation and liquidity provision',
    icon: Zap,
    status: 'Active'
  },
  {
    title: 'Settlement Systems',
    description: 'Automated payout processing for all marketplace events',
    icon: CheckCircle,
    status: 'Active'
  },
  {
    title: 'Data Seeding',
    description: 'Comprehensive sample data generation for testing',
    icon: Database,
    status: 'Ready'
  },
  {
    title: 'Testing Suite',
    description: 'Complete marketplace functionality testing framework',
    icon: TestTube,
    status: 'Available'
  }
]

export default function MarketplaceOverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#272822] to-[#1a1a15] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 border border-[#A6E22E]/30 rounded-full text-sm text-[#A6E22E] mb-6">
            <Activity className="h-4 w-4" />
            80% Complete - Advanced DeFi Features Live
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent mb-6">
            ECE Marketplace
          </h1>
          
          <p className="text-xl text-[#75715E] max-w-3xl mx-auto mb-8">
            The world's first comprehensive trading card financial ecosystem. 
            Combining prediction markets, auctions, M&A battles, staking, and governance 
            powered by ECE tokens and Solana blockchain.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/marketplace">
              <Button className="bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822] font-semibold text-lg px-8 py-3">
                Enter Marketplace
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/test/marketplace">
              <Button variant="outline" className="border-[#66D9EF]/30 text-[#66D9EF] hover:bg-[#66D9EF]/10 text-lg px-8 py-3">
                <TestTube className="h-5 w-5 mr-2" />
                Test Features
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {platformStats.map((stat, index) => (
            <Card key={index} className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30 text-center">
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-[#F8EFD6] mb-1">{stat.value}</div>
              <div className="text-sm text-[#75715E]">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#F8EFD6] text-center mb-12">
            Complete Trading Ecosystem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketplaceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30 hover:border-[#66D9EF]/50 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg`}>
                      <feature.icon className="h-6 w-6 text-[#272822]" />
                    </div>
                    <Badge className={
                      feature.status === 'Live' ? 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30' :
                      feature.status === 'New' ? 'text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30' :
                      'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
                    }>
                      {feature.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-[#F8EFD6] mb-2">{feature.title}</h3>
                  <p className="text-[#75715E] mb-4">{feature.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {feature.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[#75715E]">
                        <CheckCircle className="h-3 w-3 text-[#A6E22E]" />
                        {feat}
                      </div>
                    ))}
                  </div>
                  
                  <Link href={feature.href}>
                    <Button className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-80 text-[#272822] font-semibold`}>
                      Explore
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Automation & Infrastructure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#F8EFD6] text-center mb-12">
            Advanced Infrastructure
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {automationFeatures.map((feature, index) => (
              <Card key={index} className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#66D9EF]/20 rounded-lg">
                    <feature.icon className="h-5 w-5 text-[#66D9EF]" />
                  </div>
                  <Badge className="text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30">
                    {feature.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-[#F8EFD6] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#75715E]">{feature.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <Card className="p-8 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
            <h2 className="text-3xl font-bold text-[#F8EFD6] text-center mb-8">
              Built on Cutting-Edge Technology
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-[#A6E22E] mb-2">Next.js 15</div>
                <div className="text-sm text-[#75715E]">React Framework</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#66D9EF] mb-2">Solana</div>
                <div className="text-sm text-[#75715E]">Blockchain Layer</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#F92672] mb-2">Prisma</div>
                <div className="text-sm text-[#75715E]">Database ORM</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#E6DB74] mb-2">ECE Token</div>
                <div className="text-sm text-[#75715E]">Native Currency</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <Card className="p-12 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
            <Star className="h-12 w-12 text-[#E6DB74] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#F8EFD6] mb-4">
              Ready to Experience the Future of Trading?
            </h2>
            <p className="text-lg text-[#75715E] mb-8 max-w-2xl mx-auto">
              Join thousands of traders already using the most advanced trading card marketplace. 
              Start with betting, explore auctions, participate in M&A battles, stake your ECE, and help govern the platform.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/marketplace">
                <Button className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] hover:from-[#F92672]/80 hover:to-[#66D9EF]/80 text-[#F8EFD6] font-semibold text-lg px-8 py-3">
                  Start Trading Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/staking">
                <Button variant="outline" className="border-[#A6E22E]/30 text-[#A6E22E] hover:bg-[#A6E22E]/10 text-lg px-8 py-3">
                  <Lock className="h-5 w-5 mr-2" />
                  Stake & Earn
                </Button>
              </Link>
              
              <Link href="/governance">
                <Button variant="outline" className="border-[#E6DB74]/30 text-[#E6DB74] hover:bg-[#E6DB74]/10 text-lg px-8 py-3">
                  <Vote className="h-5 w-5 mr-2" />
                  Join Governance
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
