'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingUp, Users, Shield } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'

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

const stats = [
  { value: '100K+', label: 'Active Collectors' },
  { value: '1M+', label: 'Cards Traded' },
  { value: '$50M+', label: 'Total Volume' },
  { value: '99.9%', label: 'Uptime' }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
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
              <Button variant="ghost" size="lg">
                Explore Cards
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
      </section>

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
    </div>
  )
}
