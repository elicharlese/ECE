'use client'

import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown } from 'lucide-react'
import { Navigation } from '../../components/navigation'
import { Footer } from '../../components/footer'
import { Button } from '../../components/ui/button'
import { GlassCard } from '../../components/ui/glass-card'

const plans = [
  {
    name: 'Pro',
    icon: Zap,
    price: '$29',
    description: 'Premium features for serious traders and collectors',
    features: [
      'Early marketplace access to IPOs',
      'Real-time trading alerts & notifications',
      '10 Super Likes & Boosts per month',
      'Enhanced UI with glassmorphism effects',
      'Advanced data reports & analytics',
      '$250 ECE business stipend monthly',
      'AI-powered suggestion engine',
      'Priority customer support',
      'Enhanced portfolio tracking'
    ],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'accent' as const,
    popular: true
  },
  {
    name: 'Enterprise',
    icon: Crown,
    price: '$299',
    description: 'Complete business solution with multi-app access',
    features: [
      'Everything in Pro',
      'Multi-app access (Trading Suite, BI Dashboard)',
      '24/7 priority support with account manager',
      '50 Super Likes & Boosts per month',
      '$1,000 ECE business stipend monthly',
      'Custom integrations & API access',
      'White-label platform options',
      'Custom reporting & analytics',
      'Dedicated enterprise features',
      'SLA guarantees & enterprise security'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'primary' as const,
    popular: false
  }
]

const faqs = [
  {
    question: 'What does a free account include?',
    answer: 'A free ECE account gives you complete access to our platform - discover cards, participate in auctions, buy/sell/trade, and access all community features. No limitations or trial periods.'
  },
  {
    question: 'What makes Pro different from the free account?',
    answer: 'Pro offers an advanced marketplace UI with professional trading tools, enhanced analytics, custom portfolio themes, and priority support - perfect for serious traders who want the best interface.'
  },
  {
    question: 'Who should consider Enterprise?',
    answer: 'Enterprise is ideal for organizations needing bulk card orders, custom app development, white-label solutions, or specialized integrations. Perfect for businesses, agencies, or large-scale operations.'
  },
  {
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Yes! You can upgrade to Pro instantly or contact us for Enterprise solutions. Downgrades take effect at your next billing cycle, and you keep all your cards and data.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum for maximum flexibility.'
  }
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-foreground">Start Trading</span>
              <br />
              <span className="bg-gradient-tide bg-clip-text text-transparent">
                Right Away
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sign up for a free account and get instant access to the entire ECE platform. 
              Discover, trade, and collect digital cards immediately.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard variant="light" className="p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                🚀 <span className="bg-gradient-tide bg-clip-text text-transparent">Get Started in Seconds</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                A free ECE account gives you complete access to our platform. Start discovering, 
                trading, and collecting immediately. No limitations, no trial periods - just full access.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-ocean rounded-lg mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Instant Access</h3>
                  <p className="text-sm text-muted-foreground">Full platform access from day one</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-ocean rounded-lg mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Start Trading</h3>
                  <p className="text-sm text-muted-foreground">Begin buying, selling, and swapping cards</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-ocean rounded-lg mb-3">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Build Collection</h3>
                  <p className="text-sm text-muted-foreground">Discover and collect your favorite cards</p>
                </div>
              </div>
              <Button variant="accent" size="lg" className="px-8">
                Create Free Account
              </Button>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Plans Section Header */}
      <section className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Upgrade Your <span className="bg-gradient-tide bg-clip-text text-transparent">Experience</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose Pro for advanced marketplace features, or Enterprise for bulk orders and custom development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-monokai px-4 py-2 rounded-full text-white text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <GlassCard 
                  variant={plan.popular ? "light" : "dark"} 
                  animation="breathe"
                  className={`p-8 h-full relative ${plan.popular ? 'ring-2 ring-ocean-accent' : ''}`}
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-tide rounded-full mb-4">
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      {plan.price !== 'Free' && plan.price !== 'Custom' && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-ocean-success mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.buttonVariant} 
                    className="w-full"
                  >
                    {plan.buttonText}
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard variant="dark" className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Enterprise <span className="bg-gradient-tide bg-clip-text text-transparent">Solutions</span>
                  </h2>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Perfect for organizations that need bulk card orders, custom app development, 
                    or white-label solutions. We work with you to create exactly what your business needs.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-ocean-accent rounded-full mr-4"></div>
                      <span className="text-foreground font-medium">Bulk ordering system for large quantities</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-ocean-accent rounded-full mr-4"></div>
                      <span className="text-foreground font-medium">Custom app development and revisions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-ocean-accent rounded-full mr-4"></div>
                      <span className="text-foreground font-medium">White-label platform solutions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-ocean-accent rounded-full mr-4"></div>
                      <span className="text-foreground font-medium">Dedicated support and account management</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-ocean rounded-full mb-6">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Scale?</h3>
                  <p className="text-muted-foreground mb-6">
                    Let's discuss your specific needs and create a custom solution that works for your organization.
                  </p>
                  <Button variant="accent" size="lg" className="px-8">
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Questions? <span className="bg-gradient-tide bg-clip-text text-transparent">We've Got Answers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about getting started with ECE and choosing the right plan for your needs.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard variant="light" className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
