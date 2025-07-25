'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { GitHubRepoSelector } from '../github-mcp/GitHubRepoSelector'
import { GitHubMCPClient } from '@/lib/mcp/github-client'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Loader2,
  Github,
  Sparkles,
  CreditCard,
  Package,
  Star,
  Code,
  Zap,
  Shield,
  Globe
} from 'lucide-react'

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  owner: {
    login: string
    avatar_url: string
  }
}

interface RepositoryAnalysis {
  repository: Repository
  complexity: number
  quality: number
  languages: Record<string, number>
  framework: string | null
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'library' | 'other'
  deploymentReady: boolean
  cardTier: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  estimatedValue: number
}

interface OrderConfiguration {
  tier: 'basic' | 'premium' | 'enterprise'
  features: string[]
  hosting: boolean
  analytics: boolean
  customDomain: boolean
  support: string
  price: number
}

type OrderStep = 'repository' | 'analysis' | 'configuration' | 'summary' | 'payment' | 'confirmation'

const STEP_TITLES = {
  repository: 'Select Repository',
  analysis: 'Repository Analysis',
  configuration: 'Order Configuration',
  summary: 'Order Summary',
  payment: 'Payment',
  confirmation: 'Confirmation'
}

const CARD_TIER_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600', 
  legendary: 'from-yellow-400 to-orange-500',
  mythic: 'from-red-400 to-pink-600'
}

const TIER_CONFIGS: Record<string, OrderConfiguration> = {
  basic: {
    tier: 'basic',
    features: ['App Card Generation', 'Basic 3D Model', 'Repository Stats'],
    hosting: false,
    analytics: false,
    customDomain: false,
    support: 'Community',
    price: 49
  },
  premium: {
    tier: 'premium',
    features: [
      'App Card Generation', 
      'Advanced 3D Model', 
      'Repository Stats',
      'Custom Animations',
      'Enhanced Analytics',
      'Priority Support'
    ],
    hosting: true,
    analytics: true,
    customDomain: false,
    support: 'Email & Chat',
    price: 149
  },
  enterprise: {
    tier: 'enterprise',
    features: [
      'App Card Generation',
      'Premium 3D Model',
      'Advanced Repository Stats',
      'Custom Animations',
      'Full Analytics Suite',
      'Custom Domain',
      'White-label Options',
      'Dedicated Support'
    ],
    hosting: true,
    analytics: true,
    customDomain: true,
    support: 'Dedicated Manager',
    price: 499
  }
}

export const LinearOrderFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OrderStep>('repository')
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null)
  const [repositoryAnalysis, setRepositoryAnalysis] = useState<RepositoryAnalysis | null>(null)
  const [orderConfig, setOrderConfig] = useState<OrderConfiguration>(TIER_CONFIGS.basic)
  const [analyzing, setAnalyzing] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [mcpClient] = useState(() => new GitHubMCPClient())

  const steps: OrderStep[] = ['repository', 'analysis', 'configuration', 'summary', 'payment', 'confirmation']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleRepositorySelect = async (repo: Repository) => {
    setSelectedRepository(repo)
    setAnalyzing(true)
    
    try {
      const analysis = await mcpClient.analyzeRepository(repo.owner.login, repo.name)
      setRepositoryAnalysis(analysis)
      
      // Auto-suggest tier based on analysis
      const suggestedTier = analysis.cardTier === 'mythic' || analysis.cardTier === 'legendary' 
        ? 'enterprise'
        : analysis.cardTier === 'epic' || analysis.cardTier === 'rare'
        ? 'premium'
        : 'basic'
      
      setOrderConfig(TIER_CONFIGS[suggestedTier])
      setCurrentStep('analysis')
    } catch (error) {
      console.error('Failed to analyze repository:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleNextStep = () => {
    const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1)
    setCurrentStep(steps[nextIndex])
  }

  const handlePreviousStep = () => {
    const prevIndex = Math.max(currentStepIndex - 1, 0)
    setCurrentStep(steps[prevIndex])
  }

  const handleConfigurationChange = (config: OrderConfiguration) => {
    setOrderConfig(config)
  }

  const handlePayment = async () => {
    setProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate order ID
      const newOrderId = `ECE-${Date.now().toString(36).toUpperCase()}`
      setOrderId(newOrderId)
      setCurrentStep('confirmation')
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'repository':
        return (
          <GitHubRepoSelector
            onRepositorySelect={handleRepositorySelect}
            selectedRepository={selectedRepository}
          />
        )
        
      case 'analysis':
        return (
          <RepositoryAnalysisStep 
            repository={selectedRepository!}
            analysis={repositoryAnalysis!}
            analyzing={analyzing}
          />
        )
        
      case 'configuration':
        return (
          <ConfigurationStep
            analysis={repositoryAnalysis!}
            config={orderConfig}
            onConfigChange={handleConfigurationChange}
          />
        )
        
      case 'summary':
        return (
          <OrderSummaryStep
            repository={selectedRepository!}
            analysis={repositoryAnalysis!}
            config={orderConfig}
          />
        )
        
      case 'payment':
        return (
          <PaymentStep
            config={orderConfig}
            processing={processing}
            onPayment={handlePayment}
          />
        )
        
      case 'confirmation':
        return (
          <ConfirmationStep
            orderId={orderId!}
            repository={selectedRepository!}
            config={orderConfig}
          />
        )
        
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card className="glass-card shadow-soft">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Create App Card Order</h1>
              <Badge variant="outline" className="text-sm">
                Step {currentStepIndex + 1} of {steps.length}
              </Badge>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between text-sm">
              {steps.map((step, index) => (
                <div 
                  key={step}
                  className={`text-center ${
                    index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                    index < currentStepIndex 
                      ? 'bg-green-500 text-white'
                      : index === currentStepIndex
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index < currentStepIndex ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="text-xs">{STEP_TITLES[step]}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {currentStep !== 'repository' && currentStep !== 'confirmation' && (
        <Card className="glass-card shadow-soft">
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStepIndex === 0}
                className="shadow-soft hover:shadow-soft-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={currentStep === 'payment' ? handlePayment : handleNextStep}
                disabled={
                  !selectedRepository ||
                  (currentStep === 'analysis' && analyzing) ||
                  (currentStep === 'payment' && processing)
                }
                className="shadow-soft hover:shadow-soft-lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === 'payment' ? (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Order
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Step Components
const RepositoryAnalysisStep: React.FC<{
  repository: Repository
  analysis: RepositoryAnalysis
  analyzing: boolean
}> = ({ repository, analysis, analyzing }) => {
  if (analyzing) {
    return (
      <Card className="glass-card shadow-soft">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
          <h3 className="text-lg font-semibold mb-2">Analyzing Repository</h3>
          <p className="text-muted-foreground">
            Our AI is analyzing {repository.name} to determine the best card configuration...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 drop-shadow-icon" />
            Repository Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Repository Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Framework:</span>
                  <Badge variant="outline">{analysis.framework || 'Not detected'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <Badge variant="secondary">{analysis.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Deployment Ready:</span>
                  <Badge variant={analysis.deploymentReady ? 'default' : 'destructive'}>
                    {analysis.deploymentReady ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Quality Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Complexity Score</span>
                    <span>{analysis.complexity}/100</span>
                  </div>
                  <Progress value={analysis.complexity} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quality Score</span>
                    <span>{analysis.quality}/100</span>
                  </div>
                  <Progress value={analysis.quality} className="h-2" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r ${CARD_TIER_COLORS[analysis.cardTier]} rounded-lg">
            <div className="flex items-center justify-between text-white">
              <div>
                <h4 className="font-bold text-lg">Recommended Card Tier</h4>
                <p className="text-sm opacity-90">
                  Based on complexity, quality, and popularity metrics
                </p>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                {analysis.cardTier.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const ConfigurationStep: React.FC<{
  analysis: RepositoryAnalysis
  config: OrderConfiguration
  onConfigChange: (config: OrderConfiguration) => void
}> = ({ analysis, config, onConfigChange }) => {
  return (
    <div className="space-y-6">
      <Card className="glass-card shadow-soft">
        <CardHeader>
          <CardTitle>Choose Your Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(TIER_CONFIGS).map(([key, tierConfig]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all duration-200 shadow-soft hover:shadow-soft-lg ${
                  config.tier === key ? 'ring-2 ring-accent' : ''
                }`}
                onClick={() => onConfigChange(tierConfig)}
              >
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-2 capitalize">{key}</h3>
                  <div className="text-3xl font-bold mb-4">${tierConfig.price}</div>
                  <ul className="space-y-2 text-sm text-left">
                    {tierConfig.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const OrderSummaryStep: React.FC<{
  repository: Repository
  analysis: RepositoryAnalysis
  config: OrderConfiguration
}> = ({ repository, analysis, config }) => {
  return (
    <div className="space-y-6">
      <Card className="glass-card shadow-soft">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Github className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">{repository.name}</h3>
                <p className="text-sm text-muted-foreground">{repository.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Package Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <Badge className="capitalize">{config.tier}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Card Tier:</span>
                    <Badge className="capitalize">{analysis.cardTier}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Value:</span>
                    <span>${analysis.estimatedValue}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Included Features</h4>
                <ul className="space-y-1 text-sm">
                  {config.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${config.price}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const PaymentStep: React.FC<{
  config: OrderConfiguration
  processing: boolean
  onPayment: () => void
}> = ({ config, processing, onPayment }) => {
  return (
    <Card className="glass-card shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 drop-shadow-icon" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order Total:</span>
              <span className="text-2xl font-bold">${config.price}</span>
            </div>
          </div>
          
          <div className="text-center py-8">
            {processing ? (
              <div>
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
                <p className="text-lg font-semibold">Processing Payment...</p>
                <p className="text-sm text-muted-foreground">Please wait while we process your order</p>
              </div>
            ) : (
              <div>
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">Ready to Process Payment</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Click the Complete Order button to finalize your purchase
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ConfirmationStep: React.FC<{
  orderId: string
  repository: Repository
  config: OrderConfiguration
}> = ({ orderId, repository, config }) => {
  return (
    <Card className="glass-card shadow-soft">
      <CardContent className="py-12 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Your app card for <strong>{repository.name}</strong> is being created
        </p>
        
        <div className="bg-muted rounded-lg p-4 mb-6 inline-block">
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="font-mono text-lg font-semibold">{orderId}</p>
        </div>
        
        <div className="space-y-4">
          <Button size="lg" className="shadow-soft hover:shadow-soft-lg">
            <Package className="h-4 w-4 mr-2" />
            View Order Status
          </Button>
          <div>
            <Button variant="outline" className="shadow-soft hover:shadow-soft-lg">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
