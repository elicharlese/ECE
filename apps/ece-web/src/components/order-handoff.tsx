'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Github, 
  Globe, 
  Download, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Package,
  Sparkles,
  Rocket,
  X
} from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

interface OrderHandoffProps {
  orderId: string
  orderTitle: string
  orderType: string
  status: 'READY_FOR_HANDOFF' | 'PROCESSING' | 'COMPLETED'
  onInitiateHandoff?: () => void
}

interface HandoffStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  icon: React.ReactNode
  estimatedTime: string
}

const OrderHandoff: React.FC<OrderHandoffProps> = ({
  orderId,
  orderTitle,
  orderType,
  status,
  onInitiateHandoff
}) => {
  const [handoffSteps, setHandoffSteps] = useState<HandoffStep[]>([
    {
      id: 'github_repo',
      title: 'Create GitHub Repository',
      description: 'Setting up private repository with your project code',
      status: 'pending',
      icon: <Github className="w-5 h-5" />,
      estimatedTime: '30s'
    },
    {
      id: 'vercel_deploy',
      title: 'Deploy to Vercel',
      description: 'Creating live deployment with custom domain',
      status: 'pending',
      icon: <Globe className="w-5 h-5" />,
      estimatedTime: '2min'
    },
    {
      id: 'assets_package',
      title: 'Package Assets',
      description: 'Creating downloadable ZIP with source code and documentation',
      status: 'pending',
      icon: <Package className="w-5 h-5" />,
      estimatedTime: '45s'
    },
    {
      id: 'portfolio_card',
      title: 'Generate Portfolio Card',
      description: 'Adding interactive card to your dashboard',
      status: 'pending',
      icon: <Sparkles className="w-5 h-5" />,
      estimatedTime: '15s'
    }
  ])

  const [deliverables, setDeliverables] = useState<{
    githubUrl?: string
    vercelUrl?: string
    downloadUrl?: string
    portfolioCardId?: string
  }>({})

  const [handoffInProgress, setHandoffInProgress] = useState(false)

  const simulateHandoffProcess = async () => {
    setHandoffInProgress(true)
    
    for (let i = 0; i < handoffSteps.length; i++) {
      const step = handoffSteps[i]
      
      // Update step to in_progress
      setHandoffSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'in_progress' } : s
      ))
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, parseInt(step.estimatedTime) * 100))
      
      // Update step to completed and add deliverable
      setHandoffSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'completed' } : s
      ))
      
      // Mock deliverable URLs
      switch (step.id) {
        case 'github_repo':
          setDeliverables(prev => ({ 
            ...prev, 
            githubUrl: `https://github.com/ece-platform/${orderTitle.toLowerCase().replace(/\s+/g, '-')}`
          }))
          break
        case 'vercel_deploy':
          setDeliverables(prev => ({ 
            ...prev, 
            vercelUrl: `https://${orderTitle.toLowerCase().replace(/\s+/g, '-')}.vercel.app`
          }))
          break
        case 'assets_package':
          setDeliverables(prev => ({ 
            ...prev, 
            downloadUrl: `/api/orders/${orderId}/download`
          }))
          break
        case 'portfolio_card':
          setDeliverables(prev => ({ 
            ...prev, 
            portfolioCardId: `card_${orderId}`
          }))
          break
      }
    }
    
    setHandoffInProgress(false)
    
    // Call completion callback
    if (onInitiateHandoff) {
      onInitiateHandoff()
    }
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-monokai-success'
      case 'in_progress': return 'text-ocean-accent'
      case 'error': return 'text-monokai-accent'
      default: return 'text-ocean-muted'
    }
  }

  const getStepStatusIcon = (step: HandoffStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-monokai-success" />
      case 'in_progress':
        return (
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-5 h-5 text-ocean-accent" />
          </motion.div>
        )
      case 'error':
        return <X className="w-5 h-5 text-monokai-accent" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-ocean-muted" />
    }
  }

  const allStepsCompleted = handoffSteps.every(step => step.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <Card className="p-6 glass-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-ocean-dark dark:text-ocean-light">
              Order Handoff
            </h3>
            <p className="text-ocean-muted">{orderTitle}</p>
          </div>
          <Badge variant="outline" className="bg-monokai-success/10 text-monokai-success border-monokai-success/30">
            {orderType}
          </Badge>
        </div>

        {status === 'READY_FOR_HANDOFF' && !handoffInProgress && !allStepsCompleted && (
          <div className="text-center p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6"
            >
              <Rocket className="w-16 h-16 mx-auto text-ocean-accent mb-4" />
              <h4 className="text-lg font-semibold text-ocean-dark dark:text-ocean-light mb-2">
                Ready for Delivery!
              </h4>
              <p className="text-ocean-muted">
                Your project is complete and ready for automated handoff. 
                This will create all deliverables and make them available on your dashboard.
              </p>
            </motion.div>
            
            <Button
              onClick={simulateHandoffProcess}
              className="bg-gradient-sunset text-white hover:opacity-90 px-8 py-3"
              size="lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Initiate Handoff Process
            </Button>
          </div>
        )}
      </Card>

      {/* Handoff Steps */}
      {(handoffInProgress || allStepsCompleted) && (
        <Card className="p-6 glass-card">
          <h4 className="text-lg font-semibold text-ocean-dark dark:text-ocean-light mb-6">
            Handoff Progress
          </h4>
          
          <div className="space-y-4">
            {handoffSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-lg bg-white/30 dark:bg-ocean-dark/30"
              >
                <div className="flex-shrink-0">
                  {getStepStatusIcon(step)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className={`font-medium ${getStepStatusColor(step.status)}`}>
                      {step.title}
                    </h5>
                    <span className="text-xs text-ocean-muted">
                      ~{step.estimatedTime}
                    </span>
                  </div>
                  <p className="text-sm text-ocean-muted mt-1">
                    {step.description}
                  </p>
                </div>
                
                <div className={`text-2xl ${getStepStatusColor(step.status)}`}>
                  {step.icon}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Deliverables */}
      {allStepsCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-6 glass-card border-monokai-success/30">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-monokai-success mr-2" />
              <h4 className="text-lg font-semibold text-ocean-dark dark:text-ocean-light">
                Handoff Complete!
              </h4>
            </div>
            
            <p className="text-ocean-muted mb-6">
              All deliverables have been successfully created and are ready for access.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliverables.githubUrl && (
                <div className="p-4 bg-white/20 dark:bg-ocean-dark/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Github className="w-5 h-5 text-ocean-dark dark:text-ocean-light mr-2" />
                      <span className="font-medium">GitHub Repository</span>
                    </div>
                    <Button
                      variant="ghost"
                     
                      onClick={() => window.open(deliverables.githubUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-ocean-muted mt-1">
                    Private repository with full source code
                  </p>
                </div>
              )}
              
              {deliverables.vercelUrl && (
                <div className="p-4 bg-white/20 dark:bg-ocean-dark/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-ocean-accent mr-2" />
                      <span className="font-medium">Live Deployment</span>
                    </div>
                    <Button
                      variant="ghost"
                     
                      onClick={() => window.open(deliverables.vercelUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-ocean-muted mt-1">
                    Production deployment on Vercel
                  </p>
                </div>
              )}
              
              {deliverables.downloadUrl && (
                <div className="p-4 bg-white/20 dark:bg-ocean-dark/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Download className="w-5 h-5 text-monokai-info mr-2" />
                      <span className="font-medium">Source Download</span>
                    </div>
                    <Button
                      variant="ghost"
                     
                      onClick={() => window.open(deliverables.downloadUrl, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-ocean-muted mt-1">
                    ZIP file with code and documentation
                  </p>
                </div>
              )}
              
              {deliverables.portfolioCardId && (
                <div className="p-4 bg-white/20 dark:bg-ocean-dark/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5 text-monokai-warning mr-2" />
                      <span className="font-medium">Portfolio Card</span>
                    </div>
                    <Button
                      variant="ghost"
                     
                      onClick={() => window.location.href = '/app'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-ocean-muted mt-1">
                    Added to your dashboard portfolio
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default OrderHandoff
