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
  AlertCircle,
  Star,
  Zap,
  Shield,
  Target,
  Plus,
  Minus,
  X,
  Search,
  Filter
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

interface OrderTypeOption {
  id: 'APP_DEVELOPMENT' | 'CARD_ENHANCEMENT' | 'CARD_UPGRADE' | 'CUSTOM_BUILD'
  name: string
  description: string
  icon: React.ReactNode
  basePrice: number
  maxItems?: number
}

interface CardEnhancement {
  id: string
  name: string
  description: string
  type: 'STAT_BOOST' | 'RARITY_UPGRADE' | 'VISUAL_ENHANCEMENT' | 'UTILITY_UPGRADE'
  cost: number
  icon: React.ReactNode
  effects: string[]
}

interface SelectedCard {
  id: string
  name: string
  rarity: string
  imageUrl: string
  currentStats: Record<string, number>
  selectedEnhancements: CardEnhancement[]
}

interface TimelineOption {
  id: 'RUSH_2_WEEKS' | 'STANDARD_1_MONTH'
  name: string
  duration: string
  description: string
  icon: React.ReactNode
  baseCost: number
}

const orderTypes: OrderTypeOption[] = [
  {
    id: 'APP_DEVELOPMENT',
    name: 'App Development',
    description: 'Custom full-stack application development',
    icon: <Monitor className="w-6 h-6" />,
    basePrice: 4000
  },
  {
    id: 'CARD_ENHANCEMENT',
    name: 'Card Enhancement',
    description: 'Enhance existing cards with powerups and boosts',
    icon: <Star className="w-6 h-6" />,
    basePrice: 200,
    maxItems: 10
  },
  {
    id: 'CARD_UPGRADE',
    name: 'Card Upgrade',
    description: 'Upgrade card rarity and unlock new abilities',
    icon: <Zap className="w-6 h-6" />,
    basePrice: 500,
    maxItems: 10
  },
  {
    id: 'CUSTOM_BUILD',
    name: 'Custom Build',
    description: 'Specialized development projects and integrations',
    icon: <Target className="w-6 h-6" />,
    basePrice: 3000
  }
]

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

const cardEnhancements: CardEnhancement[] = [
  {
    id: 'STAT_BOOST_BASIC',
    name: 'Basic Stat Boost',
    description: 'Increase all card stats by 10%',
    type: 'STAT_BOOST',
    cost: 150,
    icon: <Shield className="w-4 h-4" />,
    effects: ['+10% All Stats', 'Permanent Upgrade', 'Stack Compatible']
  },
  {
    id: 'STAT_BOOST_PREMIUM',
    name: 'Premium Stat Boost',
    description: 'Increase all card stats by 25%',
    type: 'STAT_BOOST',
    cost: 350,
    icon: <Shield className="w-4 h-4" />,
    effects: ['+25% All Stats', 'Permanent Upgrade', 'Stack Compatible']
  },
  {
    id: 'RARITY_UPGRADE',
    name: 'Rarity Upgrade',
    description: 'Upgrade card to next rarity tier',
    type: 'RARITY_UPGRADE',
    cost: 800,
    icon: <Star className="w-4 h-4" />,
    effects: ['Next Rarity Tier', 'Improved Visuals', 'Enhanced Abilities']
  },
  {
    id: 'VISUAL_ENHANCEMENT',
    name: 'Visual Enhancement',
    description: 'Add special visual effects and animations',
    type: 'VISUAL_ENHANCEMENT',
    cost: 200,
    icon: <Sparkles className="w-4 h-4" />,
    effects: ['Animated Effects', 'Holographic Shine', 'Particle Systems']
  },
  {
    id: 'UTILITY_UPGRADE',
    name: 'Utility Upgrade',
    description: 'Add special abilities and utility functions',
    type: 'UTILITY_UPGRADE',
    cost: 450,
    icon: <Zap className="w-4 h-4" />,
    effects: ['Special Abilities', 'Enhanced Trading', 'Bonus Features']
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

// Mock user cards - in real app, this would come from API
const mockUserCards = [
  {
    id: 'card_1',
    name: 'Tesla Model S',
    rarity: 'epic',
    imageUrl: '/api/placeholder/200/300',
    currentStats: { power: 85, efficiency: 92, innovation: 88, market: 90 }
  },
  {
    id: 'card_2',
    name: 'Apple iPhone Pro',
    rarity: 'legendary',
    imageUrl: '/api/placeholder/200/300',
    currentStats: { power: 95, efficiency: 89, innovation: 96, market: 94 }
  },
  {
    id: 'card_3',
    name: 'SpaceX Falcon 9',
    rarity: 'mythic',
    imageUrl: '/api/placeholder/200/300',
    currentStats: { power: 98, efficiency: 87, innovation: 99, market: 85 }
  },
  {
    id: 'card_4',
    name: 'Google Pixel',
    rarity: 'rare',
    imageUrl: '/api/placeholder/200/300',
    currentStats: { power: 78, efficiency: 85, innovation: 82, market: 80 }
  },
  {
    id: 'card_5',
    name: 'Meta Quest',
    rarity: 'uncommon',
    imageUrl: '/api/placeholder/200/300',
    currentStats: { power: 72, efficiency: 76, innovation: 88, market: 75 }
  }
]

export function OrderForm({ onSubmit, onClose, isOpen, userBalance }: OrderFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedOrderType, setSelectedOrderType] = useState<OrderTypeOption | null>(null)
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectTypeOption | null>(null)
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineOption | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Card enhancement states
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])
  const [cardSearchTerm, setCardSearchTerm] = useState('')
  const [filteredCards, setFilteredCards] = useState(mockUserCards)

  React.useEffect(() => {
    const filtered = mockUserCards.filter(card =>
      card.name.toLowerCase().includes(cardSearchTerm.toLowerCase())
    )
    setFilteredCards(filtered)
  }, [cardSearchTerm])

  // Calculate cost based on order type
  React.useEffect(() => {
    let cost = 0
    
    if (selectedOrderType?.id === 'APP_DEVELOPMENT') {
      if (selectedProjectType && selectedTimeline) {
        cost = Math.round(selectedTimeline.baseCost * selectedProjectType.complexity)
      }
    } else if (selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE') {
      cost = selectedOrderType.basePrice
      selectedCards.forEach(card => {
        card.selectedEnhancements.forEach(enhancement => {
          cost += enhancement.cost
        })
      })
    } else if (selectedOrderType?.id === 'CUSTOM_BUILD') {
      cost = selectedOrderType.basePrice
      if (selectedTimeline) {
        cost = selectedTimeline.baseCost * 0.75 // Custom builds get 25% discount
      }
    }
    
    setEstimatedCost(cost)
  }, [selectedOrderType, selectedProjectType, selectedTimeline, selectedCards])

  const addCardToSelection = (card: typeof mockUserCards[0]) => {
    if (selectedCards.length >= 10) {
      setErrors({ cards: 'Maximum 10 cards allowed per order' })
      return
    }
    
    if (selectedCards.find(c => c.id === card.id)) {
      setErrors({ cards: 'Card already selected' })
      return
    }
    
    setSelectedCards(prev => [...prev, {
      ...card,
      selectedEnhancements: []
    }])
    setErrors({ ...errors, cards: '' })
  }

  const removeCardFromSelection = (cardId: string) => {
    setSelectedCards(prev => prev.filter(card => card.id !== cardId))
  }

  const addEnhancementToCard = (cardId: string, enhancement: CardEnhancement) => {
    setSelectedCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? {
              ...card,
              selectedEnhancements: card.selectedEnhancements.find(e => e.id === enhancement.id)
                ? card.selectedEnhancements
                : [...card.selectedEnhancements, enhancement]
            }
          : card
      )
    )
  }

  const removeEnhancementFromCard = (cardId: string, enhancementId: string) => {
    setSelectedCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? {
              ...card,
              selectedEnhancements: card.selectedEnhancements.filter(e => e.id !== enhancementId)
            }
          : card
      )
    )
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!selectedOrderType) {
          newErrors.orderType = 'Please select an order type'
        }
        break
      case 2:
        if (selectedOrderType?.id === 'APP_DEVELOPMENT') {
          if (!selectedProjectType) {
            newErrors.projectType = 'Please select a project type'
          }
        } else if (selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE') {
          if (selectedCards.length === 0) {
            newErrors.cards = 'Please select at least one card'
          }
          if (selectedCards.some(card => card.selectedEnhancements.length === 0)) {
            newErrors.enhancements = 'Please select enhancements for all cards'
          }
        }
        break
      case 3:
        if (selectedOrderType?.id === 'APP_DEVELOPMENT' || selectedOrderType?.id === 'CUSTOM_BUILD') {
          if (!selectedTimeline) {
            newErrors.timeline = 'Please select a timeline'
          }
        }
        break
      case 4:
        if (!projectTitle.trim()) {
          newErrors.title = 'Project title is required'
        }
        if (!projectDescription.trim()) {
          newErrors.description = 'Project description is required'
        }
        break
      case 5:
        if (userBalance < estimatedCost) {
          newErrors.balance = `Insufficient ECE balance. Required: ${estimatedCost} ECE, Available: ${userBalance} ECE`
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getStepsForOrderType = (): Array<{ number: number; title: string; description: string }> => {
    const baseSteps = [
      { number: 1, title: 'Order Type', description: 'Choose order category' }
    ]

    if (selectedOrderType?.id === 'APP_DEVELOPMENT') {
      return [
        ...baseSteps,
        { number: 2, title: 'Project Type', description: 'Choose app type' },
        { number: 3, title: 'Timeline', description: 'Select delivery speed' },
        { number: 4, title: 'Details', description: 'Describe your project' },
        { number: 5, title: 'Review', description: 'Confirm and pay' }
      ]
    } else if (selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE') {
      return [
        ...baseSteps,
        { number: 2, title: 'Select Cards', description: 'Choose cards to enhance' },
        { number: 3, title: 'Enhancements', description: 'Pick upgrades' },
        { number: 4, title: 'Details', description: 'Add specifications' },
        { number: 5, title: 'Review', description: 'Confirm and pay' }
      ]
    } else {
      return [
        ...baseSteps,
        { number: 2, title: 'Timeline', description: 'Select delivery speed' },
        { number: 3, title: 'Details', description: 'Describe your project' },
        { number: 4, title: 'Review', description: 'Confirm and pay' }
      ]
    }
  }

  const steps = getStepsForOrderType()
  const maxSteps = steps.length

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, maxSteps))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(maxSteps)) return

    setIsSubmitting(true)
    try {
      const orderData: Partial<AppOrder> = {
        title: projectTitle,
        description: projectDescription,
        estimatedCost,
        requirements: {
          details: requirements,
          orderType: selectedOrderType!.id,
          ...(selectedOrderType?.id === 'APP_DEVELOPMENT' && {
            projectType: selectedProjectType!.id,
            features: selectedProjectType!.features,
            complexity: selectedProjectType!.complexity
          }),
          ...((selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE') && {
            cards: selectedCards.map(card => ({
              id: card.id,
              name: card.name,
              rarity: card.rarity,
              enhancements: card.selectedEnhancements.map(e => ({
                id: e.id,
                name: e.name,
                type: e.type,
                cost: e.cost
              }))
            }))
          }),
          ...(selectedTimeline && { timeline: selectedTimeline.id })
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
            <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <GlassCard className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-monokai-pink/20">
                      <ShoppingCart className="w-6 h-6 text-monokai-pink" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Create Order</h2>
                      <p className="text-muted-foreground">
                        {selectedOrderType?.name || 'Select your order type'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={onClose}>
                    ✕
                  </Button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 overflow-x-auto">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center min-w-0">
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
                          flex-1 h-0.5 mx-4 mt-[-20px] min-w-[20px]
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
                    {/* Step 1: Order Type */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Select Order Type</h3>
                          <p className="text-muted-foreground mb-6">Choose what you'd like to order</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {orderTypes.map((type) => (
                            <motion.div
                              key={type.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`
                                p-6 rounded-lg border-2 cursor-pointer transition-all
                                ${selectedOrderType?.id === type.id
                                  ? 'border-monokai-pink bg-monokai-pink/10'
                                  : 'border-border hover:border-monokai-pink/50'
                                }
                              `}
                              onClick={() => setSelectedOrderType(type)}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-lg bg-monokai-blue/20">
                                  {type.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground mb-1">{type.name}</h4>
                                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-monokai-green">
                                      From {type.basePrice.toLocaleString()} ECE
                                    </span>
                                    {type.maxItems && (
                                      <Badge variant="secondary">
                                        Max {type.maxItems} items
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {errors.orderType && (
                          <div className="flex items-center space-x-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.orderType}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 2: Project Type (for app development) or Card Selection */}
                    {currentStep === 2 && selectedOrderType?.id === 'APP_DEVELOPMENT' && (
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

                    {/* Step 2: Card Selection (for card enhancement/upgrade) */}
                    {currentStep === 2 && (selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE') && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Select Cards</h3>
                            <p className="text-muted-foreground">Choose up to 10 cards to enhance (Currently: {selectedCards.length}/10)</p>
                          </div>
                          <Badge variant="secondary">
                            {selectedCards.length} Selected
                          </Badge>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              placeholder="Search your cards..."
                              value={cardSearchTerm}
                              onChange={(e) => setCardSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                          </Button>
                        </div>

                        {/* Selected Cards */}
                        {selectedCards.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">Selected Cards</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {selectedCards.map((card) => (
                                <GlassCard key={card.id} className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h5 className="font-medium">{card.name}</h5>
                                      <Badge variant="secondary" className="text-xs mt-1">
                                        {card.rarity}
                                      </Badge>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeCardFromSelection(card.id)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {card.selectedEnhancements.length} enhancements selected
                                  </div>
                                </GlassCard>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Available Cards */}
                        <div>
                          <h4 className="font-semibold mb-3">Your Cards</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                            {filteredCards.map((card) => {
                              const isSelected = selectedCards.find(c => c.id === card.id)
                              return (
                                <motion.div
                                  key={card.id}
                                  whileHover={{ scale: 1.02 }}
                                  className={`
                                    p-4 rounded-lg border-2 cursor-pointer transition-all
                                    ${isSelected
                                      ? 'border-monokai-green bg-monokai-green/10'
                                      : 'border-border hover:border-monokai-pink/50'
                                    }
                                  `}
                                  onClick={() => !isSelected && addCardToSelection(card)}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                                      <Monitor className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium text-sm">{card.name}</h5>
                                      <Badge variant="secondary" className="text-xs mt-1">
                                        {card.rarity}
                                      </Badge>
                                      <div className="mt-2 space-y-1">
                                        {Object.entries(card.currentStats).map(([stat, value]) => (
                                          <div key={stat} className="flex justify-between text-xs">
                                            <span className="capitalize">{stat}:</span>
                                            <span>{value}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <Check className="w-5 h-5 text-monokai-green" />
                                    )}
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>

                        {errors.cards && (
                          <div className="flex items-center space-x-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.cards}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3: Enhancements (for card orders) or Timeline (for app development) */}
                    {currentStep === 3 && (selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE') && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Select Enhancements</h3>
                          <p className="text-muted-foreground mb-6">Choose enhancements for each selected card</p>
                        </div>

                        {selectedCards.map((card) => (
                          <GlassCard key={card.id} className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold">{card.name}</h4>
                                <Badge variant="secondary" className="mt-1">
                                  {card.rarity}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {card.selectedEnhancements.length} enhancements
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {cardEnhancements.map((enhancement) => {
                                const isSelected = card.selectedEnhancements.find(e => e.id === enhancement.id)
                                return (
                                  <motion.div
                                    key={enhancement.id}
                                    whileHover={{ scale: 1.02 }}
                                    className={`
                                      p-4 rounded-lg border cursor-pointer transition-all
                                      ${isSelected
                                        ? 'border-monokai-pink bg-monokai-pink/10'
                                        : 'border-border hover:border-monokai-pink/50'
                                      }
                                    `}
                                    onClick={() => 
                                      isSelected 
                                        ? removeEnhancementFromCard(card.id, enhancement.id)
                                        : addEnhancementToCard(card.id, enhancement)
                                    }
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div className="p-2 rounded bg-monokai-blue/20">
                                        {enhancement.icon}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <h5 className="font-medium text-sm">{enhancement.name}</h5>
                                          <span className="text-sm font-bold text-monokai-green">
                                            {enhancement.cost} ECE
                                          </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">
                                          {enhancement.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {enhancement.effects.map((effect) => (
                                            <Badge key={effect} variant="outline" className="text-xs">
                                              {effect}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </GlassCard>
                        ))}

                        {errors.enhancements && (
                          <div className="flex items-center space-x-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.enhancements}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3: Timeline (for app development and custom build) */}
                    {currentStep === 3 && (selectedOrderType?.id === 'APP_DEVELOPMENT' || selectedOrderType?.id === 'CUSTOM_BUILD') && (
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

                    {/* Step 4: Project Details */}
                    {currentStep === maxSteps - 1 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                          <p className="text-muted-foreground mb-6">Provide details about your order</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Order Title</label>
                            <Input
                              placeholder={
                                selectedOrderType?.id === 'CARD_ENHANCEMENT' 
                                  ? "e.g., Tesla Model S Enhancement Package"
                                  : selectedOrderType?.id === 'CARD_UPGRADE'
                                  ? "e.g., Epic Card Rarity Upgrades"
                                  : "e.g., My Awesome SaaS Dashboard"
                              }
                              value={projectTitle}
                              onChange={(e) => setProjectTitle(e.target.value)}
                              className={errors.title ? 'border-red-500' : ''}
                            />
                            {errors.title && (
                              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <Textarea
                              placeholder={
                                selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE'
                                  ? "Describe your enhancement goals, desired outcomes, and any specific requirements..."
                                  : "Describe your project goals, target audience, and key features..."
                              }
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
                              placeholder={
                                selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE'
                                  ? "Any specific enhancement preferences, timing requirements, or special requests..."
                                  : "Any specific requirements, integrations, or features you'd like to include..."
                              }
                              value={requirements}
                              onChange={(e) => setRequirements(e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Final Step: Review & Payment */}
                    {currentStep === maxSteps && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                          <p className="text-muted-foreground mb-6">Review your order before confirmation</p>
                        </div>

                        <GlassCard variant="modal" className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{projectTitle}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {selectedOrderType?.name}
                                  {selectedProjectType && ` - ${selectedProjectType.name}`}
                                </p>
                              </div>
                              {selectedTimeline && (
                                <Badge variant="secondary">{selectedTimeline.name}</Badge>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground">{projectDescription}</p>

                            {/* Card Enhancement Summary */}
                            {(selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE') && (
                              <div className="pt-4 border-t border-border">
                                <h5 className="font-medium mb-3">Selected Cards & Enhancements</h5>
                                {selectedCards.map((card) => (
                                  <div key={card.id} className="mb-3 p-3 bg-muted/50 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">{card.name}</span>
                                      <Badge variant="secondary">{card.rarity}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                      {card.selectedEnhancements.map((enhancement) => (
                                        <div key={enhancement.id} className="flex justify-between text-sm">
                                          <span>{enhancement.name}</span>
                                          <span>{enhancement.cost} ECE</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="pt-4 border-t border-border">
                              <div className="flex justify-between items-center mb-2">
                                <span>Base Cost</span>
                                <span>{selectedOrderType?.basePrice.toLocaleString()} ECE</span>
                              </div>
                              
                              {selectedProjectType && selectedTimeline && (
                                <>
                                  <div className="flex justify-between items-center mb-2">
                                    <span>Timeline ({selectedTimeline.name})</span>
                                    <span>{selectedTimeline.baseCost.toLocaleString()} ECE</span>
                                  </div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span>Complexity Multiplier ({selectedProjectType.complexity}x)</span>
                                    <span>
                                      {selectedTimeline && selectedProjectType 
                                        ? `+${(selectedTimeline.baseCost * (selectedProjectType.complexity - 1)).toLocaleString()}`
                                        : '0'
                                      } ECE
                                    </span>
                                  </div>
                                </>
                              )}

                              {(selectedOrderType?.id === 'CARD_ENHANCEMENT' || selectedOrderType?.id === 'CARD_UPGRADE') && (
                                <div className="flex justify-between items-center mb-2">
                                  <span>Enhancements</span>
                                  <span>
                                    +{selectedCards.reduce((total, card) => 
                                      total + card.selectedEnhancements.reduce((sum, e) => sum + e.cost, 0), 0
                                    ).toLocaleString()} ECE
                                  </span>
                                </div>
                              )}

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
                    {currentStep < maxSteps ? (
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
