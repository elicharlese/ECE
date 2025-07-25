'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Rocket, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Settings,
  User,
  BarChart3,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useToast } from '../ui/use-toast'
import AppGenerator from './app-generator'
import AppCardGenerator from './app-card-generator'
import GeneratedAppsDashboard from '../admin/generated-apps-dashboard'
import UserGeneratedAppsProfile from '../profile/user-generated-apps'

interface GeneratedApp {
  id: string
  projectName: string
  projectDescription: string
  template: any
  techStack: string[]
  features: string[]
  githubRepo?: string
  vercelUrl?: string
  downloadUrl?: string
}

interface AppCard {
  id: string
  name: string
  description: string
  template: string
  techStack: string[]
  features: string[]
  battleStats: {
    power: number
    speed: number
    innovation: number
    scalability: number
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  thumbnail: string
  creator: string
  githubRepo?: string
  vercelUrl?: string
  downloadUrl?: string
  createdAt: Date
  category: 'web' | 'mobile' | 'desktop' | 'backend' | 'ai' | 'blockchain'
  specialAbilities?: string[]
}

interface AppGenerationPipelineProps {
  userRole?: 'user' | 'admin'
  userId?: string
  className?: string
}

// Available app templates
const APP_TEMPLATES = {
  'trading-dashboard': {
    id: 'trading-dashboard',
    name: 'Trading Dashboard',
    description: 'Advanced trading interface with ECE branding and 3D card displays',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Spline 3D'],
    features: ['Real-time Data', '3D Card Views', 'Analytics', 'ECE Wallet Integration', 'Beach Monokai Theme'],
    complexity: 'complex' as const,
    estimatedTime: '4-6 weeks'
  },
  'mobile-app': {
    id: 'mobile-app',
    name: 'Mobile Trading App',
    description: 'React Native app with ECE branding and cross-platform compatibility',
    techStack: ['React Native', 'TypeScript', 'React Navigation', 'AsyncStorage', 'ECE API'],
    features: ['Native Performance', 'Push Notifications', 'Biometric Auth', 'Offline Support', 'ECE Integration'],
    complexity: 'complex' as const,
    estimatedTime: '6-8 weeks'
  },
  'landing-page': {
    id: 'landing-page',
    name: 'Marketing Landing Page',
    description: 'High-converting landing page with ECE branding and 3D hero sections',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Spline 3D', 'Framer Motion'],
    features: ['3D Hero Section', 'Conversion Optimization', 'SEO Ready', 'Performance Optimized', 'ECE Branding'],
    complexity: 'medium' as const,
    estimatedTime: '2-3 weeks'
  },
  'admin-panel': {
    id: 'admin-panel',
    name: 'Admin Management Panel',
    description: 'Comprehensive admin interface with ECE security and branding standards',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'NextAuth', 'Radix UI'],
    features: ['User Management', 'Analytics Dashboard', 'Content Management', 'Security Controls', 'ECE Integration'],
    complexity: 'complex' as const,
    estimatedTime: '5-7 weeks'
  },
  'api-service': {
    id: 'api-service',
    name: 'Backend API Service',
    description: 'Scalable API service with ECE authentication and database integration',
    techStack: ['Node.js', 'TypeScript', 'Express', 'Prisma', 'JWT'],
    features: ['RESTful API', 'GraphQL Support', 'Authentication', 'Rate Limiting', 'ECE Database'],
    complexity: 'complex' as const,
    estimatedTime: '4-5 weeks'
  }
}

export function AppGenerationPipeline({ 
  userRole = 'user', 
  userId = 'user_123',
  className 
}: AppGenerationPipelineProps) {
  const [currentStep, setCurrentStep] = useState<'select' | 'configure' | 'generate' | 'card' | 'complete'>('select')
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof APP_TEMPLATES | null>(null)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [customFeatures, setCustomFeatures] = useState<string[]>([])
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null)
  const [generatedCard, setGeneratedCard] = useState<AppCard | null>(null)
  const [activeTab, setActiveTab] = useState('generator')
  const { toast } = useToast()

  const handleTemplateSelect = useCallback((templateId: keyof typeof APP_TEMPLATES) => {
    setSelectedTemplate(templateId)
    setCurrentStep('configure')
  }, [])

  const handleProjectConfig = useCallback((name: string, description: string, features: string[]) => {
    setProjectName(name)
    setProjectDescription(description)
    setCustomFeatures(features)
    setCurrentStep('generate')
  }, [])

  const handleGenerationComplete = useCallback((result: any) => {
    const app: GeneratedApp = {
      id: result.id,
      projectName: result.projectName,
      projectDescription: projectDescription,
      template: selectedTemplate ? APP_TEMPLATES[selectedTemplate] : null,
      techStack: result.appCardData.techStack,
      features: result.appCardData.features,
      githubRepo: result.githubRepo,
      vercelUrl: result.vercelUrl,
      downloadUrl: result.downloadUrl
    }
    
    setGeneratedApp(app)
    setCurrentStep('card')
    
    toast({
      title: "App Generated Successfully! 🎉",
      description: `${projectName} is ready for card generation`,
    })
  }, [projectName, projectDescription, selectedTemplate])

  const handleCardGenerated = useCallback((card: AppCard) => {
    setGeneratedCard(card)
    setCurrentStep('complete')
    
    toast({
      title: "Trading Card Created! 🎴",
      description: `Your ${card.rarity} rarity card is ready`,
    })
  }, [])

  const handleGenerationError = useCallback((error: Error) => {
    toast({
      title: "Generation Failed",
      description: error.message,
      variant: "destructive"
    })
  }, [toast])

  const resetPipeline = useCallback(() => {
    setCurrentStep('select')
    setSelectedTemplate(null)
    setProjectName('')
    setProjectDescription('')
    setCustomFeatures([])
    setGeneratedApp(null)
    setGeneratedCard(null)
  }, [])

  const renderStepIndicator = () => {
    const steps = [
      { id: 'select', name: 'Select Template', icon: Settings },
      { id: 'configure', name: 'Configure Project', icon: User },
      { id: 'generate', name: 'Generate App', icon: Rocket },
      { id: 'card', name: 'Create Card', icon: Sparkles },
      { id: 'complete', name: 'Complete', icon: CheckCircle }
    ]

    const currentStepIndex = steps.findIndex(step => step.id === currentStep)

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const IconComponent = step.icon
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex
          
          return (
            <React.Fragment key={step.id}>
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${isCompleted 
                  ? 'bg-[#A6E22E] text-[#272822]' 
                  : isActive
                  ? 'bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white'
                  : 'bg-[#75715E]/30 text-[#75715E]'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  w-20 h-1 mx-2 transition-colors
                  ${isCompleted 
                    ? 'bg-[#A6E22E]' 
                    : 'bg-[#75715E]/30'
                  }
                `} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Pipeline Header */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#F8EFD6] flex items-center">
              <Zap className="w-8 h-8 mr-3 text-[#E6DB74]" />
              ECE App Generation Pipeline
            </h1>
            <p className="text-[#75715E] mt-2">
              Create professional applications with AI assistance and convert them into tradeable cards
            </p>
          </div>
          
          {currentStep !== 'select' && (
            <Button
              variant="outline"
              onClick={resetPipeline}
              className="border-[#75715E]/30 text-[#75715E]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          )}
        </div>

        {renderStepIndicator()}
      </GlassCard>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {(currentStep === 'select' || currentStep === 'configure') && (
          <motion.div
            key="template-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {currentStep === 'select' && (
              <GlassCard variant="dark" className="p-6">
                <h2 className="text-2xl font-bold text-[#F8EFD6] mb-6 text-center">
                  Choose Your App Template
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(APP_TEMPLATES).map(([key, template]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                      onClick={() => handleTemplateSelect(key as keyof typeof APP_TEMPLATES)}
                    >
                      <GlassCard variant="dark" className="p-6 h-full border-2 border-transparent hover:border-[#F92672]/50 transition-all">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-[#66D9EF]/20 to-[#66D9EF]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="w-8 h-8 text-[#66D9EF]" />
                          </div>
                          <h3 className="text-lg font-bold text-[#F8EFD6] mb-2">{template.name}</h3>
                          <p className="text-[#75715E] text-sm">{template.description}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-[#F8EFD6] font-medium text-sm">Tech Stack:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.techStack.slice(0, 3).map((tech) => (
                                <span key={tech} className="text-xs bg-[#272822]/50 text-[#75715E] px-2 py-1 rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#75715E]">Complexity: {template.complexity}</span>
                            <span className="text-[#66D9EF]">{template.estimatedTime}</span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}

            {currentStep === 'configure' && selectedTemplate && (
              <GlassCard variant="dark" className="p-6">
                <h2 className="text-2xl font-bold text-[#F8EFD6] mb-6 text-center">
                  Configure Your Project
                </h2>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <label className="block text-[#F8EFD6] font-medium mb-2">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter your project name..."
                      className="w-full p-3 bg-[#272822]/50 border border-[#75715E]/30 rounded-lg text-[#F8EFD6] placeholder-[#75715E]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#F8EFD6] font-medium mb-2">Project Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe what your application will do..."
                      rows={4}
                      className="w-full p-3 bg-[#272822]/50 border border-[#75715E]/30 rounded-lg text-[#F8EFD6] placeholder-[#75715E]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#F8EFD6] font-medium mb-2">Selected Template</label>
                    <div className="p-4 bg-[#272822]/30 rounded-lg border border-[#75715E]/20">
                      <h4 className="text-[#66D9EF] font-semibold">{APP_TEMPLATES[selectedTemplate].name}</h4>
                      <p className="text-[#75715E] text-sm mt-1">{APP_TEMPLATES[selectedTemplate].description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('select')}
                      className="border-[#75715E]/30 text-[#75715E]"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => handleProjectConfig(projectName, projectDescription, customFeatures)}
                      disabled={!projectName || !projectDescription}
                      className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white px-8"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}

        {currentStep === 'generate' && selectedTemplate && (
          <motion.div
            key="app-generation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AppGenerator
              template={{
                id: selectedTemplate,
                name: APP_TEMPLATES[selectedTemplate].name,
                description: APP_TEMPLATES[selectedTemplate].description,
                techStack: APP_TEMPLATES[selectedTemplate].techStack,
                features: APP_TEMPLATES[selectedTemplate].features,
                complexity: APP_TEMPLATES[selectedTemplate].complexity,
                estimatedTime: APP_TEMPLATES[selectedTemplate].estimatedTime
              }}
              projectName={projectName}
              projectDescription={projectDescription}
              customFeatures={customFeatures}
              onGenerationComplete={handleGenerationComplete}
              onGenerationError={handleGenerationError}
            />
          </motion.div>
        )}

        {currentStep === 'card' && generatedApp && (
          <motion.div
            key="card-generation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AppCardGenerator
              generatedApp={generatedApp}
              onCardGenerated={handleCardGenerated}
              onError={handleGenerationError}
            />
          </motion.div>
        )}

        {currentStep === 'complete' && generatedCard && (
          <motion.div
            key="completion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard variant="dark" className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-[#F8EFD6] mb-4">
                Pipeline Complete! 🎉
              </h2>
              
              <p className="text-[#75715E] mb-6 max-w-2xl mx-auto">
                Your application "{projectName}" has been successfully generated and converted into a 
                <span className="text-[#F92672] font-semibold"> {generatedCard.rarity} rarity</span> trading card!
              </p>
              
              <div className="flex justify-center space-x-4 mb-8">
                <Button
                  variant="outline"
                  className="border-[#66D9EF]/30 text-[#66D9EF]"
                  onClick={() => setActiveTab('profile')}
                >
                  View in Profile
                </Button>
                <Button
                  variant="outline"
                  className="border-[#A6E22E]/30 text-[#A6E22E]"
                  onClick={() => setActiveTab('admin')}
                >
                  Admin Dashboard
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white"
                  onClick={resetPipeline}
                >
                  Generate Another App
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Management Tabs */}
      {userRole === 'admin' && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#272822]/50">
            <TabsTrigger value="generator" className="text-[#F8EFD6]">
              App Generator
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-[#F8EFD6]">
              Admin Dashboard
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-[#F8EFD6]">
              User Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-0">
            {/* Generator content is handled above */}
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <GeneratedAppsDashboard />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <UserGeneratedAppsProfile userId={userId} />
          </TabsContent>
        </Tabs>
      )}

      {/* Success Toast Integration */}
      {generatedCard && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <GlassCard variant="dark" className="p-4 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#A6E22E] rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-[#F8EFD6] font-semibold">App Card Ready!</h4>
                <p className="text-[#75715E] text-sm">
                  {generatedCard.name} - {generatedCard.rarity} rarity
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

export default AppGenerationPipeline
