'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Users, 
  Headphones, 
  Settings, 
  BarChart3,
  Zap,
  Building,
  Globe,
  Shield,
  ArrowRight,
  Check
} from 'lucide-react'
import { AppLayout } from '@/components/app-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { FeatureLock, ProEnhancedCard, SubscriptionBadge } from '@/components/subscription-ui'

const enterpriseApps = [
  {
    id: 'trading-suite',
    name: 'Professional Trading Suite',
    description: 'Advanced analytics, automated trading, and portfolio management tools',
    icon: BarChart3,
    status: 'available',
    features: ['Real-time market data', 'Advanced charting', 'Risk management', 'API access']
  },
  {
    id: 'business-dashboard',
    name: 'Business Intelligence Dashboard',
    description: 'Comprehensive reporting and analytics for enterprise decision making',
    icon: Building,
    status: 'available',
    features: ['Custom reports', 'Data visualization', 'Export capabilities', 'Team collaboration']
  },
  {
    id: 'white-label',
    name: 'White-Label Platform',
    description: 'Fully customizable trading platform with your branding',
    icon: Globe,
    status: 'development',
    features: ['Custom branding', 'Domain mapping', 'Custom features', 'Dedicated support']
  },
  {
    id: 'api-suite',
    name: 'Enterprise API Suite',
    description: 'Complete API access for custom integrations and development',
    icon: Zap,
    status: 'available',
    features: ['REST API', 'WebSocket feeds', 'Custom endpoints', 'Rate limiting']
  }
]

export default function EnterprisePage() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  // Mock subscription state for landing page (no provider needed)
  const subscription = { plan: 'free' as const }
  const isEnterprise = false
  const hasFeature = (_feature: string) => false
  const showUpgradePrompt = (_message: string) => {}

  const handleAppAccess = (appId: string) => {
    if (!hasFeature('multiAppAccess')) {
      showUpgradePrompt('Multi-App Access')
      return
    }
    
    setSelectedApp(appId)
    // In a real app, this would navigate to the app or open it in a new tab
    alert(`Accessing ${enterpriseApps.find(app => app.id === appId)?.name}...`)
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Crown className="w-10 h-10 text-monokai-purple" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              <span className="bg-gradient-to-r from-monokai-purple to-monokai-blue bg-clip-text text-transparent">
                Enterprise Suite
              </span>
            </h1>
          </div>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access powerful business tools, custom integrations, and dedicated support 
            designed for enterprise-level trading operations.
          </p>

          {subscription && (
            <div className="flex justify-center">
              <SubscriptionBadge plan={subscription.plan} />
            </div>
          )}
        </motion.div>

        {/* Enterprise Features Overview */}
        {isEnterprise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProEnhancedCard 
              isPro={false} 
              isEnterprise={isEnterprise}
              className="p-6 rounded-xl"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-monokai-purple/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-monokai-purple" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Dedicated Support</h3>
                  <p className="text-sm text-muted-foreground">24/7 priority support with dedicated account manager</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-monokai-blue/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-monokai-blue" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">Custom reporting and business intelligence tools</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-monokai-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-monokai-green" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Custom Integrations</h3>
                  <p className="text-sm text-muted-foreground">API access and white-label solutions</p>
                </div>
              </div>
            </ProEnhancedCard>
          </motion.div>
        )}

        {/* Apps Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {enterpriseApps.map((app, index) => {
            const Icon = app.icon
            const canAccess = hasFeature('multiAppAccess')
            
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {!canAccess ? (
                  <FeatureLock
                    feature={app.name}
                    requiredPlan="enterprise"
                    currentPlan={subscription?.plan || 'free'}
                    onUpgrade={() => showUpgradePrompt('Multi-App Access')}
                  >
                    <AppCard app={app} onAccess={() => {}} disabled />
                  </FeatureLock>
                ) : (
                  <AppCard 
                    app={app} 
                    onAccess={() => handleAppAccess(app.id)} 
                    disabled={app.status === 'development'}
                  />
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Support Section */}
        {isEnterprise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-monokai-purple to-monokai-blue rounded-full flex items-center justify-center mx-auto">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-foreground">24/7 Priority Support</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Get immediate assistance from your dedicated account manager. 
                  We're here to help you maximize your trading potential.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button variant="primary" size="lg">
                    <Headphones className="w-5 h-5 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="ghost" size="lg">
                    <Settings className="w-5 h-5 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Upgrade CTA for non-Enterprise users */}
        {!isEnterprise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-8 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <Crown className="w-16 h-16 text-monokai-purple mx-auto" />
                <h2 className="text-2xl font-bold text-foreground">Unlock Enterprise Features</h2>
                <p className="text-muted-foreground">
                  Get access to advanced trading tools, custom integrations, 
                  and dedicated support designed for serious traders.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="text-left space-y-2">
                    <h3 className="font-semibold text-foreground">Enterprise Features:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-monokai-green" />
                        <span>Multi-app access</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-monokai-green" />
                        <span>24/7 priority support</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-monokai-green" />
                        <span>Custom integrations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-monokai-green" />
                        <span>White-label solutions</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-left space-y-2">
                    <h3 className="font-semibold text-foreground">Business Benefits:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-monokai-green" />
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-monokai-green" />
                        <span>Custom reporting</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-monokai-green" />
                        <span>Dedicated account manager</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-monokai-green" />
                        <span>Enterprise SLA</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <Button size="lg" className="bg-gradient-to-r from-monokai-purple to-monokai-blue text-white">
                  Upgrade to Enterprise
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}

interface AppCardProps {
  app: typeof enterpriseApps[0]
  onAccess: () => void
  disabled?: boolean
}

function AppCard({ app, onAccess, disabled = false }: AppCardProps) {
  const Icon = app.icon
  
  return (
    <GlassCard className="p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-start space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            app.status === 'available' 
              ? 'bg-monokai-purple/20' 
              : 'bg-muted'
          }`}>
            <Icon className={`w-6 h-6 ${
              app.status === 'available' 
                ? 'text-monokai-purple' 
                : 'text-muted-foreground'
            }`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground">{app.name}</h3>
              {app.status === 'development' && (
                <span className="px-2 py-1 bg-monokai-orange/20 text-monokai-orange text-xs rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{app.description}</p>
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium text-foreground mb-2">Features:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {app.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Check className="w-3 h-3 text-monokai-green" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button 
          onClick={onAccess}
          disabled={disabled}
          className="w-full mt-4"
          variant={app.status === 'available' ? 'primary' : 'ghost'}
        >
          {app.status === 'available' ? 'Access App' : 'Coming Soon'}
          {app.status === 'available' && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </GlassCard>
  )
}
