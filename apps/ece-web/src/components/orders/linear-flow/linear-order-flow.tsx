'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Github, 
  Zap, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Clock,
  DollarSign,
  Code,
  Rocket,
  User,
  Mail,
  Phone,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RepositorySelector } from '../github-mcp/repository-selector'
import { GitHubRepository, RepositoryAnalysis } from '../github-mcp/github-mcp-client'

interface OrderFormData {
  // Repository Data
  repository: GitHubRepository | null
  analysis: RepositoryAnalysis | null
  
  // Customer Information
  customerInfo: {
    name: string
    email: string
    phone: string
    company?: string
  }
  
  // Project Requirements
  requirements: {
    customFeatures: string[]
    designPreferences: string
    timeline: string
    budget: number
    deploymentPlatform: string
    additionalNotes: string
  }
  
  // Order Details
  orderDetails: {
    packageType: 'basic' | 'professional' | 'enterprise'
    totalCost: number
    estimatedDelivery: string
    includesSourseCode: boolean
    includesDeployment: boolean
    includesSupport: boolean
  }
}

interface LinearOrderFlowProps {
  onOrderComplete?: (orderData: OrderFormData) => void
  onCancel?: () => void
  initialStep?: number
  preselectedRepo?: string
}

type OrderStep = 'repository' | 'requirements' | 'package' | 'customer' | 'payment' | 'confirmation'

const STEPS: { key: OrderStep; title: string; icon: React.ReactNode }[] = [
  { key: 'repository', title: 'Repository', icon: <Github className="h-5 w-5" /> },
  { key: 'requirements', title: 'Requirements', icon: <FileText className="h-5 w-5" /> },
  { key: 'package', title: 'Package', icon: <Zap className="h-5 w-5" /> },
  { key: 'customer', title: 'Information', icon: <User className="h-5 w-5" /> },
  { key: 'payment', title: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
  { key: 'confirmation', title: 'Confirmation', icon: <CheckCircle className="h-5 w-5" /> }
]

export const LinearOrderFlow: React.FC<LinearOrderFlowProps> = ({
  onOrderComplete,
  onCancel,
  initialStep = 0,
  preselectedRepo
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep)
  const [orderData, setOrderData] = useState<OrderFormData>({
    repository: null,
    analysis: null,
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      company: ''
    },
    requirements: {
      customFeatures: [],
      designPreferences: '',
      timeline: '',
      budget: 0,
      deploymentPlatform: '',
      additionalNotes: ''
    },
    orderDetails: {
      packageType: 'basic',
      totalCost: 0,
      estimatedDelivery: '',
      includesSourseCode: true,
      includesDeployment: false,
      includesSupport: false
    }
  })

  const currentStep = STEPS[currentStepIndex]

  const goToNext = useCallback(() => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }, [currentStepIndex])

  const goToPrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }, [currentStepIndex])

  const updateOrderData = useCallback((updates: Partial<OrderFormData>) => {
    setOrderData(prev => ({ ...prev, ...updates }))
  }, [])

  const handleRepositorySelect = useCallback((repository: GitHubRepository, analysis: RepositoryAnalysis) => {
    updateOrderData({
      repository,
      analysis,
      requirements: {
        ...orderData.requirements,
        budget: analysis.estimatedCost
      },
      orderDetails: {
        ...orderData.orderDetails,
        totalCost: analysis.estimatedCost,
        estimatedDelivery: analysis.developmentTime
      }
    })
    goToNext()
  }, [orderData.requirements, orderData.orderDetails, updateOrderData, goToNext])

  const canProceed = useCallback(() => {
    switch (currentStep.key) {
      case 'repository':
        return orderData.repository && orderData.analysis
      case 'requirements':
        return orderData.requirements.designPreferences && orderData.requirements.timeline
      case 'package':
        return orderData.orderDetails.packageType && orderData.orderDetails.totalCost > 0
      case 'customer':
        return orderData.customerInfo.name && orderData.customerInfo.email
      case 'payment':
        return true // Payment validation would go here
      case 'confirmation':
        return true
      default:
        return false
    }
  }, [currentStep.key, orderData])

  const handleComplete = useCallback(() => {
    if (onOrderComplete) {
      onOrderComplete(orderData)
    }
  }, [orderData, onOrderComplete])

  const StepIndicator = () => (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border">
          <motion.div
            className="h-full bg-gradient-to-r from-monokai-accent to-monokai-purple"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Circles */}
        {STEPS.map((step, index) => (
          <div key={step.key} className="relative z-10">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-soft ${
                index <= currentStepIndex
                  ? 'bg-gradient-to-r from-monokai-accent to-monokai-purple text-white'
                  : 'bg-background border border-border text-muted-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {index < currentStepIndex ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                step.icon
              )}
            </motion.div>
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-center">
              <div className={`text-sm font-medium ${
                index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const RepositoryStep = () => (
    <div className="space-y-6">
      <RepositorySelector
        onRepositorySelect={handleRepositorySelect}
        preselectedUrl={preselectedRepo}
      />
    </div>
  )

  const RequirementsStep = () => (
    <Card className="glass-card shadow-card-ece max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>📋 Project Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Design Preferences */}
        <div>
          <label className="block text-sm font-medium mb-2">Design Style Preference</label>
          <select
            value={orderData.requirements.designPreferences}
            onChange={(e) => updateOrderData({
              requirements: { ...orderData.requirements, designPreferences: e.target.value }
            })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 text-foreground shadow-soft"
          >
            <option value="">Select design style...</option>
            <option value="modern">Modern & Minimalist</option>
            <option value="classic">Classic & Professional</option>
            <option value="creative">Creative & Artistic</option>
            <option value="corporate">Corporate & Clean</option>
            <option value="playful">Playful & Colorful</option>
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Timeline</label>
          <select
            value={orderData.requirements.timeline}
            onChange={(e) => updateOrderData({
              requirements: { ...orderData.requirements, timeline: e.target.value }
            })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 text-foreground shadow-soft"
          >
            <option value="">Select timeline...</option>
            <option value="rush">Rush (1-3 days) - +50% cost</option>
            <option value="standard">Standard (as estimated)</option>
            <option value="flexible">Flexible (+20% longer) - -15% cost</option>
          </select>
        </div>

        {/* Custom Features */}
        <div>
          <label className="block text-sm font-medium mb-2">Additional Features</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'User Authentication',
              'Payment Processing',
              'Admin Dashboard',
              'Real-time Features',
              'Mobile App',
              'API Integration',
              'Advanced Analytics',
              'Multi-language Support'
            ].map((feature) => (
              <label key={feature} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={orderData.requirements.customFeatures.includes(feature)}
                  onChange={(e) => {
                    const features = orderData.requirements.customFeatures
                    if (e.target.checked) {
                      updateOrderData({
                        requirements: {
                          ...orderData.requirements,
                          customFeatures: [...features, feature]
                        }
                      })
                    } else {
                      updateOrderData({
                        requirements: {
                          ...orderData.requirements,
                          customFeatures: features.filter(f => f !== feature)
                        }
                      })
                    }
                  }}
                  className="rounded border-border"
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Additional Notes</label>
          <textarea
            value={orderData.requirements.additionalNotes}
            onChange={(e) => updateOrderData({
              requirements: { ...orderData.requirements, additionalNotes: e.target.value }
            })}
            placeholder="Any specific requirements or preferences..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 text-foreground shadow-soft resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )

  const PackageStep = () => {
    const packages = [
      {
        type: 'basic' as const,
        name: 'Basic Package',
        price: orderData.analysis?.estimatedCost || 0,
        features: [
          'Source code generation',
          'Basic responsive design',
          'Core functionality',
          '7 days support'
        ]
      },
      {
        type: 'professional' as const,
        name: 'Professional Package',
        price: Math.round((orderData.analysis?.estimatedCost || 0) * 1.5),
        features: [
          'Everything in Basic',
          'Advanced UI/UX design',
          'Additional features',
          'Deployment setup',
          '30 days support'
        ]
      },
      {
        type: 'enterprise' as const,
        name: 'Enterprise Package',
        price: Math.round((orderData.analysis?.estimatedCost || 0) * 2.5),
        features: [
          'Everything in Professional',
          'Custom integrations',
          'Advanced security',
          'Load balancing setup',
          '90 days support',
          'Priority support'
        ]
      }
    ]

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">🎯 Choose Your Package</h3>
          <p className="text-muted-foreground">Select the package that best fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all shadow-card-ece hover:shadow-card-ece-hover ${
                  orderData.orderDetails.packageType === pkg.type
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                }`}
                onClick={() => updateOrderData({
                  orderDetails: {
                    ...orderData.orderDetails,
                    packageType: pkg.type,
                    totalCost: pkg.price
                  }
                })}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-monokai-accent">
                    ${pkg.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-monokai-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {orderData.orderDetails.packageType === pkg.type && (
                    <div className="mt-4 text-center">
                      <Badge className="bg-accent text-accent-foreground">
                        Selected
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const CustomerStep = () => (
    <Card className="glass-card shadow-card-ece max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>👤 Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              value={orderData.customerInfo.name}
              onChange={(e) => updateOrderData({
                customerInfo: { ...orderData.customerInfo, name: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 text-foreground shadow-soft"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email Address *</label>
            <input
              type="email"
              value={orderData.customerInfo.email}
              onChange={(e) => updateOrderData({
                customerInfo: { ...orderData.customerInfo, email: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 text-foreground shadow-soft"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={orderData.customerInfo.phone}
              onChange={(e) => updateOrderData({
                customerInfo: { ...orderData.customerInfo, phone: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 text-foreground shadow-soft"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company (Optional)</label>
            <input
              type="text"
              value={orderData.customerInfo.company}
              onChange={(e) => updateOrderData({
                customerInfo: { ...orderData.customerInfo, company: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 text-foreground shadow-soft"
              placeholder="Your company name"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const PaymentStep = () => (
    <Card className="glass-card shadow-card-ece max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>💳 Payment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="p-4 bg-background/50 rounded-lg shadow-soft">
          <h4 className="font-semibold mb-3">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Package: {orderData.orderDetails.packageType}</span>
              <span>${orderData.orderDetails.totalCost}</span>
            </div>
            <div className="flex justify-between">
              <span>Custom Features</span>
              <span>+${orderData.requirements.customFeatures.length * 50}</span>
            </div>
            <div className="border-t border-border pt-2 font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${orderData.orderDetails.totalCost + (orderData.requirements.customFeatures.length * 50)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-semibold mb-3">Payment Method</h4>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
              { id: 'paypal', name: 'PayPal', icon: '🅿️' },
              { id: 'crypto', name: 'Cryptocurrency', icon: '₿' }
            ].map((method) => (
              <label key={method.id} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors shadow-soft">
                <input type="radio" name="payment" value={method.id} className="sr-only" />
                <div className="text-xl">{method.icon}</div>
                <span>{method.name}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ConfirmationStep = () => (
    <Card className="glass-card shadow-card-ece max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-monokai-success to-monokai-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl">🎉 Order Confirmed!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <p className="text-muted-foreground">
          Thank you for your order! We'll begin work on your project shortly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-background/50 rounded-lg shadow-soft">
            <div className="text-2xl font-bold text-monokai-accent">{orderData.analysis?.developmentTime}</div>
            <div className="text-sm text-muted-foreground">Estimated Delivery</div>
          </div>
          <div className="p-4 bg-background/50 rounded-lg shadow-soft">
            <div className="text-2xl font-bold text-monokai-success">
              ${orderData.orderDetails.totalCost + (orderData.requirements.customFeatures.length * 50)}
            </div>
            <div className="text-sm text-muted-foreground">Total Cost</div>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          className="w-full bg-gradient-to-r from-monokai-accent to-monokai-purple shadow-soft hover:shadow-soft-lg"
        >
          <Rocket className="h-4 w-4 mr-2" />
          Start Development
        </Button>
      </CardContent>
    </Card>
  )

  const renderCurrentStep = () => {
    switch (currentStep.key) {
      case 'repository': return <RepositoryStep />
      case 'requirements': return <RequirementsStep />
      case 'package': return <PackageStep />
      case 'customer': return <CustomerStep />
      case 'payment': return <PaymentStep />
      case 'confirmation': return <ConfirmationStep />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-monokai-accent via-monokai-purple to-monokai-info bg-clip-text text-transparent mb-4">
            🚀 Create Your App
          </h1>
          <p className="text-xl text-muted-foreground">
            Transform your GitHub repository into a fully functional application
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Step Content */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep.key !== 'confirmation' && (
          <div className="flex justify-between max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={currentStepIndex === 0 ? onCancel : goToPrevious}
              disabled={currentStepIndex === 0 && !onCancel}
              className="shadow-soft hover:shadow-soft-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStepIndex === 0 ? 'Cancel' : 'Previous'}
            </Button>

            <Button
              onClick={goToNext}
              disabled={!canProceed()}
              className="shadow-soft hover:shadow-soft-lg"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
