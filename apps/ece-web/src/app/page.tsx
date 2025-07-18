'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingUp, Users, Shield, Target, Gavel, Sword, Play, Eye } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { 
  HeroScene3D, 
  Card3DInteractive, 
  Performance3DProvider, 
  Performance3DMonitor,
  Card3DData,
  scene3DUtils 
} from '@/components/3d'
import { useState, useEffect } from 'react'

const features = [
  {
    icon: Sparkles,
    title: 'Collect Unique Cards',
    description: 'Discover rare and exclusive digital trading cards from your favorite brands and creators.'
  },
  {
    icon: TrendingUp,
    title: 'Trade & Invest',
    description: 'Build your portfolio by trading cards with other collectors and watching their value grow.'
  },
  {
    icon: Users,
    title: 'Join the Community',
    description: 'Connect with fellow collectors, participate in events, and build lasting friendships.'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your cards and transactions are protected by industry-leading security measures.'
  }
]

const marketplaceFeatures = [
  {
    icon: Target,
    title: 'Prediction Markets',
    description: 'Bet on company performance metrics with Prize Picks style prediction markets.',
    href: '/marketplace?tab=betting',
    color: 'from-[#F92672] to-[#FD5C63]',
    bgColor: 'from-[#F92672]/20 to-[#FD5C63]/20'
  },
  {
    icon: Gavel,
    title: 'Card Auctions',
    description: 'Trade rare cards with Webull-style analytics and real-time bidding.',
    href: '/marketplace?tab=auctions',
    color: 'from-[#A6E22E] to-[#3EBA7C]',
    bgColor: 'from-[#A6E22E]/20 to-[#3EBA7C]/20'
  },
  {
    icon: Sword,
    title: 'M&A Battles',
    description: 'Tinder-style company matching for epic merger & acquisition battles.',
    href: '/marketplace?tab=battles',
    color: 'from-[#66D9EF] to-[#819AFF]',
    bgColor: 'from-[#66D9EF]/20 to-[#819AFF]/20'
  }
]

// Sample 3D cards for demonstration
const demoCards: Card3DData[] = [
  {
    id: 'demo-1',
    name: 'Tesla Cybertruck',
    rarity: 'legendary',
    splineUrl: 'https://prod.spline.design/placeholder-tesla-card',
    stats: { power: 95, defense: 88, speed: 92 },
    description: 'Revolutionary electric vehicle design that changed the automotive industry forever.'
  },
  {
    id: 'demo-2',
    name: 'Apple Vision Pro',
    rarity: 'epic',
    splineUrl: 'https://prod.spline.design/placeholder-apple-card',
    stats: { power: 89, defense: 85, speed: 87 },
    description: 'Cutting-edge mixed reality headset introducing spatial computing to the masses.'
  },
  {
    id: 'demo-3',
    name: 'SpaceX Falcon 9',
    rarity: 'rare',
    splineUrl: 'https://prod.spline.design/placeholder-spacex-card',
    stats: { power: 93, defense: 79, speed: 96 },
    description: 'Reusable rocket technology that revolutionized space exploration and satellite deployment.'
  },
  {
    id: 'demo-4',
    name: 'NVIDIA H100',
    rarity: 'epic',
    splineUrl: 'https://prod.spline.design/placeholder-nvidia-card',
    stats: { power: 97, defense: 84, speed: 88 },
    description: 'AI supercomputing chip powering the next generation of artificial intelligence applications.'
  }
]

const stats = [
  { value: '100K+', label: 'Active Collectors' },
  { value: '1M+', label: 'Cards Traded' },
  { value: '$50M+', label: 'Total Volume' },
  { value: '99.9%', label: 'Uptime' }
]

export default function Home() {
  const [show3DDemo, setShow3DDemo] = useState(false);
  const [is3DSupported, setIs3DSupported] = useState(false);
  const [heroInteractionCount, setHeroInteractionCount] = useState(0);

  useEffect(() => {
    // Check 3D support on mount
    setIs3DSupported(scene3DUtils.isSupported());
  }, []);

  const handle3DInteraction = (type: string, data?: any) => {
    setHeroInteractionCount(prev => prev + 1);
    console.log('3D Interaction:', type, data);
    
    if (type === 'explore-marketplace') {
      setShow3DDemo(true);
    }
  };

  const handleCardInteraction = (card: Card3DData) => {
    console.log('Card selected:', card);
  };

  const handleCardSwipe = (direction: 'left' | 'right', card: Card3DData) => {
    console.log(`Card swiped ${direction}:`, card);
  };

  return (
    <Performance3DProvider fallbackQuality="medium">
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* 3D Hero Section */}
        <section className="relative min-h-screen overflow-hidden">
          {is3DSupported ? (
            <HeroScene3D 
              className="absolute inset-0"
              onInteraction={handle3DInteraction}
            />
          ) : (
            // Fallback 2D Hero for unsupported devices
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {/* Original animated background */}
              <div className="absolute inset-0">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                    x: [0, 100, 0]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-20 left-20 w-96 h-96 bg-beach-info/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    rotate: [0, -10, 0],
                    x: [0, -100, 0]
                  }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-20 right-20 w-96 h-96 bg-beach-accent/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{ 
                    y: [0, -50, 0],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-beach-success/10 rounded-full blur-3xl"
                />
              </div>

              <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                  >
                    <h1 className="text-6xl md:text-8xl font-bold mb-6">
                      <span className="bg-gradient-tide bg-clip-text text-transparent">
                        Trade the
                      </span>
                      <br />
                      <span className="text-foreground">Future</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Discover, collect, and trade unique digital cards in the most advanced trading platform ever built.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                  >
                    <Button variant="accent" size="lg" className="group">
                      Start Trading
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="lg"
                      onClick={() => setShow3DDemo(true)}
                      className="group"
                    >
                      <Eye className="mr-2 w-5 h-5" />
                      View 3D Demo
                    </Button>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                  >
                    {stats.map((stat, index) => (
                      <GlassCard key={stat.label} variant="light" animation="breathe" className="p-6">
                        <div className="text-2xl md:text-3xl font-bold text-beach-primary mb-2">
                          {stat.value}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {stat.label}
                        </div>
                      </GlassCard>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3D Card Demo Section */}
        {show3DDemo && (
          <section className="py-32 bg-gradient-to-br from-[#272822] to-[#3E3D32] relative">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-[#F8EFD6] mb-6">
                  Experience <span className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent">3D Trading Cards</span>
                </h2>
                <p className="text-xl text-[#75715E] max-w-3xl mx-auto">
                  Swipe through our collection with Tinder-like mechanics. Each card features stunning 3D models and real-time interactions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-lg mx-auto h-[600px]"
              >
                <Card3DInteractive
                  cards={demoCards}
                  onCardSelect={handleCardInteraction}
                  onCardSwipe={handleCardSwipe}
                  enableSwipe={true}
                  showStats={true}
                  className="w-full h-full"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center mt-12"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-[#66D9EF] text-[#66D9EF] hover:bg-[#66D9EF] hover:text-[#272822]"
                  onClick={() => setShow3DDemo(false)}
                >
                  Back to Overview
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Why Choose <span className="bg-gradient-tide bg-clip-text text-transparent">ECE Cards</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the next generation of trading cards with cutting-edge features designed for collectors.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <GlassCard variant="light" animation="float" className="p-8 h-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-ocean rounded-full mb-6">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketplace Preview Section */}
        <section className="py-32 bg-gradient-to-br from-[#272822]/50 to-[#272822]/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent">
                  Advanced Trading
                </span>
                <br />
                <span className="text-foreground">Marketplace</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience next-generation trading with prediction markets, auctions, and M&A battles. 
                Trade smarter with advanced analytics and social features.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {marketplaceFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Link href={feature.href}>
                    <GlassCard 
                      variant="dark" 
                      animation="float" 
                      className={`p-8 h-full text-center cursor-pointer group hover:scale-105 transition-all duration-300 bg-gradient-to-br ${feature.bgColor} border border-[#75715E]/30 hover:border-opacity-60`}
                    >
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#F8EFD6] mb-4 group-hover:text-white transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-[#75715E] group-hover:text-[#F8EFD6]/80 transition-colors">
                        {feature.description}
                      </p>
                      <div className="mt-6">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`border-[#75715E]/30 text-[#75715E] hover:bg-gradient-to-r hover:${feature.color} hover:text-white hover:border-transparent group-hover:translate-y-[-2px] transition-all duration-300`}
                        >
                          Try Now
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard variant="dark" className="p-12 md:p-16 text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                  Ready to Start Your <br />
                  <span className="bg-gradient-tide bg-clip-text text-transparent">Collection?</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of collectors already trading on ECE Cards. Your next rare find is waiting.
                </p>
                <Button variant="accent" size="lg" className="group">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <Footer />
        
        {/* Performance Monitor for 3D (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <Performance3DMonitor showDebugInfo={true} />
        )}
      </div>
    </Performance3DProvider>
  )
}
