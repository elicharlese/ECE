'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { GlassCard } from '@/components/ui/glass-card'
import { Feature3DIcon, Feature3DGrid } from '@/components/3d/Feature3DIcon'
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap, 
  Heart,
  Target,
  Gamepad2,
  Wallet,
  Trophy,
  MessageSquare,
  Globe
} from 'lucide-react'

const mainFeatures = [
  {
    icon: Sparkles,
    type: 'trading' as const,
    title: 'Unique Card Collection',
    description: 'Discover thousands of rare and exclusive digital trading cards from top brands, artists, and creators.',
    details: [
      'Limited edition releases',
      'Artist collaborations',
      'Brand partnerships',
      'Animated card effects'
    ]
  },
  {
    icon: TrendingUp,
    type: 'marketplace' as const,
    title: 'Advanced Trading',
    description: 'Trade with confidence using our sophisticated marketplace with real-time pricing and analytics.',
    details: [
      'Real-time market data',
      'Price history charts',
      'Trade suggestions',
      'Portfolio tracking'
    ]
  },
  {
    icon: Users,
    type: 'profile' as const,
    title: 'Social Features',
    description: 'Connect with collectors worldwide, join communities, and participate in exclusive events.',
    details: [
      'Friend system',
      'Community groups',
      'Live chat',
      'Social feeds'
    ]
  },
  {
    icon: Shield,
    type: 'wallet' as const,
    title: 'Enterprise Security',
    description: 'Your collection is protected by military-grade security and blockchain verification.',
    details: [
      'Blockchain verification',
      'Two-factor authentication',
      'Cold storage',
      'Insurance coverage'
    ]
  }
]

const additionalFeatures = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant trades and real-time updates powered by cutting-edge infrastructure.'
  },
  {
    icon: Heart,
    title: 'Wishlist System',
    description: 'Track cards you want and get notified when they become available.'
  },
  {
    icon: Target,
    title: 'Smart Matching',
    description: 'AI-powered recommendations based on your collection and preferences.'
  },
  {
    icon: Gamepad2,
    title: 'Gamification',
    description: 'Earn rewards, unlock achievements, and level up your collector status.'
  },
  {
    icon: Wallet,
    title: 'ECE Wallet',
    description: 'Secure digital wallet with multi-currency support and instant transfers.'
  },
  {
    icon: Trophy,
    title: 'Competitions',
    description: 'Participate in tournaments and contests to win exclusive prizes.'
  },
  {
    icon: MessageSquare,
    title: 'Live Support',
    description: '24/7 customer support with dedicated account managers for premium users.'
  },
  {
    icon: Globe,
    title: 'Global Marketplace',
    description: 'Trade with collectors from around the world in multiple currencies.'
  }
]

export default function Features() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-tide bg-clip-text text-transparent">
                Powerful Features
              </span>
              <br />
              <span className="text-foreground">for Modern Collectors</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover everything ECE Cards has to offer. From advanced trading tools to social features, 
              we've built the ultimate platform for digital card collectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <GlassCard variant="light" animation="breathe" className="p-8 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Feature3DIcon 
                        type={feature.type} 
                        size="lg" 
                        animated={true}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-center text-muted-foreground">
                            <div className="w-2 h-2 bg-beach-success rounded-full mr-3" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 3D Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Experience Our Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interactive 3D preview of all ECE features and capabilities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlassCard variant="dark" className="p-8">
              <Feature3DGrid />
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              And Much More
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore additional features designed to enhance your collecting experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <GlassCard variant="dark" animation="float" className="p-6 h-full text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-ocean rounded-lg mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard variant="dark" className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Built with <span className="bg-gradient-tide bg-clip-text text-transparent">Cutting-Edge Technology</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our platform leverages the latest technologies to provide a seamless, 
                secure, and lightning-fast trading experience.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {['Blockchain', 'AI/ML', 'Real-time', 'Cloud Native'].map((tech) => (
                  <div key={tech} className="text-beach-primary font-semibold">
                    {tech}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
