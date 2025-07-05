'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Clock, 
  DollarSign, 
  Rocket, 
  Globe, 
  Smartphone, 
  Monitor, 
  Store,
  User,
  FileText,
  Calendar,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react'
import { GlassCard } from './glass-card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { AppOrder } from '@/lib/db/schema'

interface OrderFormProps {
  onSubmit: (orderData: Partial<AppOrder>) => Promise<void>
  onClose: () => void
  isOpen: boolean
  userBalance: number
}

interface ProjectTypeOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  complexity: number
  features: string[]
}

interface TimelineOption {
  id: 'RUSH_2_WEEKS' | 'STANDARD_1_MONTH'
  name: string
  duration: string
  description: string
  icon: React.ReactNode
  baseCost: number
}

const projectTypes: ProjectTypeOption[] = [
  {
    id: 'SAAS_DASHBOARD',
    name: 'SaaS Dashboard',
    description: 'Complete dashboard with user management, analytics, and billing',
    icon: <Monitor className="w-6 h-6" />,
    complexity: 1.2,
    features: ['User Authentication', 'Dashboard Analytics', 'Billing Integration', 'Admin Panel']
  },
  {
    id: 'ECOMMERCE_STORE',
    name: 'eCommerce Store',
    description: 'Full-featured online store with payment processing',
    icon: <Store className="w-6 h-6" />,
    complexity: 1.3,
    features: ['Product Catalog', 'Shopping Cart', 'Payment Processing', 'Order Management']
  },
  {
    id: 'MOBILE_APP',
    name: 'Mobile App',
    description: 'Native or cross-platform mobile application',
    icon: <Smartphone className="w-6 h-6" />,
    complexity: 1.4,
    features: ['Cross-Platform', 'Push Notifications', 'Offline Support', 'App Store Ready']
  },
  {
    id: 'WEB_APP',
    name: 'Web Application',
    description: 'Custom web application with advanced functionality',
    icon: <Globe className="w-6 h-6" />,
    complexity: 1.2,
    features: ['Custom Backend', 'Database Design', 'API Integration', 'Responsive Design']
  },
  {
    id: 'PORTFOLIO_SITE',
    name: 'Portfolio Site',
    description: 'Professional portfolio with CMS and contact forms',
    icon: <User className="w-6 h-6" />,
    complexity: 0.8,
    features: ['CMS Integration', 'Contact Forms', 'SEO Optimized', 'Fast Loading']
  },
  {
    id: 'LANDING_PAGE',
    name: 'Landing Page',
    description: 'High-converting landing page with analytics',
    icon: <FileText className="w-6 h-6" />,
    complexity: 0.6,
    features: ['Conversion Optimized', 'A/B Testing', 'Analytics', 'Lead Capture']
  }
]

const timelineOptions: TimelineOption[] = [
  {
    id: 'RUSH_2_WEEKS',
    name: 'Rush Delivery',
    duration: '2 Weeks',
    description: 'Premium priority development with dedicated team',
    icon: <Rocket className="w-5 h-5" />,
    baseCost: 8000
  },
  {
    id: 'STANDARD_1_MONTH',
    name: 'Standard Delivery',
    duration: '1 Month',
    description: 'Thorough development cycle with regular updates',
    icon: <Calendar className="w-5 h-5" />,
    baseCost: 4000
  }
]

export function OrderForm({ onSubmit, onClose, isOpen, userBalance }: OrderFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectTypeOption | null>(null)
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineOption | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate cost when project type or timeline changes
  React.useEffect(() => {
    if (selectedProjectType && selectedTimeline) {
      const cost = Math.round(selectedTimeline.baseCost * selectedProjectType.complexity)
      setEstimatedCost(cost)
    }
  }, [selectedProjectType, selectedTimeline])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!selectedProjectType) {
          newErrors.projectType = 'Please select a project type'
        }
        break
      case 2:
        if (!selectedTimeline) {
          newErrors.timeline = 'Please select a timeline'
        }
        break
      case 3:
        if (!projectTitle.trim()) {
          newErrors.title = 'Project title is required'
        }
        if (!projectDescription.trim()) {
          newErrors.description = 'Project description is required'
        }
        break
      case 4:
        if (userBalance < estimatedCost) {
          newErrors.balance = `Insufficient ECE balance. Required: ${estimatedCost} ECE, Available: ${userBalance} ECE`
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)
    try {
      const orderData: Partial<AppOrder> = {
        projectType: selectedProjectType!.id as any,
        title: projectTitle,
        description: projectDescription,
        timeline: selectedTimeline!.id,
        estimatedCost,
        requirements: {
          details: requirements,
          features: selectedProjectType!.features,
          complexity: selectedProjectType!.complexity
        }
      }

      await onSubmit(orderData)
      onClose()
    } catch (error) {
      console.error('Order submission error:', error)
      setErrors({ submit: 'Failed to submit order. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Project Type', description: 'Choose your app type' },
    { number: 2, title: 'Timeline', description: 'Select delivery speed' },
    { number: 3, title: 'Details', description: 'Describe your project' },
    { number: 4, title: 'Review', description: 'Confirm and pay' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <GlassCard className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-monokai-pink/20">
                      <ShoppingCart className="w-6 h-6 text-monokai-pink" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Order Custom App</h2>
                      <p className="text-muted-foreground">Professional full-stack development</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={onClose}>
                    ✕
                  </Button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                          ${currentStep >= step.number 
                            ? 'bg-monokai-pink text-white' 
                            : 'bg-muted text-muted-foreground'
                          }
                        `}>
                          {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-xs font-medium text-foreground">{step.title}</p>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`
                          flex-1 h-0.5 mx-4 mt-[-20px]
                          ${currentStep > step.number ? 'bg-monokai-pink' : 'bg-muted'}
                        `} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Step 1: Project Type */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Select Project Type</h3>
                          <p className="text-muted-foreground mb-6">Choose the type of application you'd like us to build</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {projectTypes.map((type) => (
                            <motion.div
                              key={type.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`
                                p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${selectedProjectType?.id === type.id
                                  ? 'border-monokai-pink bg-monokai-pink/10'
                                  : 'border-border hover:border-monokai-pink/50'
                                }
                              `}
                              onClick={() => setSelectedProjectType(type)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="p-2 rounded-lg bg-monokai-blue/20">
                                  {type.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground">{type.name}</h4>
                                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {type.features.slice(0, 3).map((feature) => (
                                      <Badge key={feature} variant="secondary" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                    {type.features.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{type.features.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {errors.projectType && (
                          <div className="flex items-center space-x-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.projectType}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 2: Timeline */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Choose Timeline</h3>
                          <p className="text-muted-foreground mb-6">Select your preferred delivery timeline</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {timelineOptions.map((timeline) => (
                            <motion.div
                              key={timeline.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`
                                p-6 rounded-lg border-2 cursor-pointer transition-all relative
                                ${selectedTimeline?.id === timeline.id
                                  ? 'border-monokai-pink bg-monokai-pink/10'
                                  : 'border-border hover:border-monokai-pink/50'
                                }
                              `}
                              onClick={() => setSelectedTimeline(timeline)}
                            >
                              {timeline.id === 'RUSH_2_WEEKS' && (
                                <div className="absolute -top-2 -right-2">
                                  <Badge className="bg-monokai-orange text-white">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                </div>
                              )}

                              <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 rounded-lg bg-monokai-blue/20">
                                  {timeline.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">{timeline.name}</h4>
                                  <p className="text-sm text-muted-foreground">{timeline.duration}</p>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-4">{timeline.description}</p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="w-4 h-4 text-monokai-green" />
                                  <span className="font-bold text-lg">{timeline.baseCost.toLocaleString()} ECE</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <span>{timeline.duration}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {errors.timeline && (
                          <div className="flex items-center space-x-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.timeline}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3: Project Details */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Project Details</h3>
                          <p className="text-muted-foreground mb-6">Tell us more about your vision</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Project Title</label>
                            <Input
                              placeholder="e.g., My Awesome SaaS Dashboard"
                              value={projectTitle}
                              onChange={(e) => setProjectTitle(e.target.value)}
                              className={errors.title ? 'border-red-500' : ''}
                            />
                            {errors.title && (
                              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Project Description</label>
                            <Textarea
                              placeholder="Describe your project goals, target audience, and key features..."
                              value={projectDescription}
                              onChange={(e) => setProjectDescription(e.target.value)}
                              rows={4}
                              className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && (
                              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Additional Requirements <span className="text-muted-foreground">(Optional)</span>
                            </label>
                            <Textarea
                              placeholder="Any specific requirements, integrations, or features you'd like to include..."
                              value={requirements}
                              onChange={(e) => setRequirements(e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Review & Payment */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                          <p className="text-muted-foreground mb-6">Review your order before confirmation</p>
                        </div>

                        <GlassCard variant="dark" className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{projectTitle}</h4>
                                <p className="text-sm text-muted-foreground">{selectedProjectType?.name}</p>
                              </div>
                              <Badge variant="secondary">{selectedTimeline?.name}</Badge>
                            </div>

                            <p className="text-sm text-muted-foreground">{projectDescription}</p>

                            <div className="pt-4 border-t border-border">
                              <div className="flex justify-between items-center mb-2">
                                <span>Base Cost ({selectedTimeline?.name})</span>
                                <span>{selectedTimeline?.baseCost.toLocaleString()} ECE</span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span>Complexity Multiplier ({selectedProjectType?.complexity}x)</span>
                                <span>
                                  {selectedProjectType && selectedTimeline 
                                    ? `+${(selectedTimeline.baseCost * (selectedProjectType.complexity - 1)).toLocaleString()}`
                                    : '0'
                                  } ECE
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-2">
                                <span>Total Cost</span>
                                <span className="text-monokai-green">{estimatedCost.toLocaleString()} ECE</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <span className="text-sm">Your ECE Balance</span>
                              <span className={`font-medium ${userBalance >= estimatedCost ? 'text-monokai-green' : 'text-red-500'}`}>
                                {userBalance.toLocaleString()} ECE
                              </span>
                            </div>
                          </div>
                        </GlassCard>

                        {errors.balance && (
                          <div className="flex items-center space-x-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.balance}</span>
                          </div>
                        )}

                        {errors.submit && (
                          <div className="flex items-center space-x-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.submit}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    {currentStep < 4 ? (
                      <Button onClick={handleNextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || userBalance < estimatedCost}
                        className="bg-monokai-pink hover:bg-monokai-pink/90"
                      >
                        {isSubmitting ? 'Processing...' : `Confirm Order (${estimatedCost.toLocaleString()} ECE)`}
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
