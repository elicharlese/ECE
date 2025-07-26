'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Code, 
  Zap, 
  Shield, 
  Target,
  Crown,
  Star,
  Gem,
  Github,
  Globe,
  Download,
  Heart,
  Sword,
  Gauge,
  AlertCircle
} from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'

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
  weaknesses?: string[]
  evolutionPath?: string[]
}

interface AppCardGeneratorProps {
  generatedApp: {
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
  onCardGenerated?: (card: AppCard) => void
  onError?: (error: Error) => void
}

interface CardGenerationStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed'
  progress: number
}

const CARD_GENERATION_STEPS: CardGenerationStep[] = [
  { id: 'analysis', name: 'Analyzing App Complexity', status: 'pending', progress: 0 },
  { id: 'stats', name: 'Calculating Battle Stats', status: 'pending', progress: 0 },
  { id: 'rarity', name: 'Determining Rarity Level', status: 'pending', progress: 0 },
  { id: 'abilities', name: 'Generating Special Abilities', status: 'pending', progress: 0 },
  { id: 'artwork', name: 'Creating Card Artwork', status: 'pending', progress: 0 },
  { id: 'finalize', name: 'Finalizing Trading Card', status: 'pending', progress: 0 }
]

const RARITY_CONFIG = {
  common: {
    color: '#75715E',
    bgGradient: 'from-gray-800 to-gray-700',
    borderColor: '#75715E',
    icon: Star,
    minStats: 40,
    maxStats: 60,
    specialAbilitiesCount: 1
  },
  rare: {
    color: '#66D9EF',
    bgGradient: 'from-blue-800 to-blue-600',
    borderColor: '#66D9EF',
    icon: Gem,
    minStats: 55,
    maxStats: 75,
    specialAbilitiesCount: 2
  },
  epic: {
    color: '#E6DB74',
    bgGradient: 'from-yellow-800 to-yellow-600',
    borderColor: '#E6DB74',
    icon: Crown,
    minStats: 70,
    maxStats: 85,
    specialAbilitiesCount: 3
  },
  legendary: {
    color: '#F92672',
    bgGradient: 'from-pink-800 to-pink-600',
    borderColor: '#F92672',
    icon: Crown,
    minStats: 80,
    maxStats: 95,
    specialAbilitiesCount: 4
  }
}

const SPECIAL_ABILITIES = {
  web: [
    'Lightning Fast Loading',
    'SEO Mastery',
    'Responsive Adaptation',
    'PWA Transformation',
    'Code Splitting Magic',
    'Lighthouse Perfect Score'
  ],
  mobile: [
    'Cross Platform Unity',
    'Native Performance',
    'Push Notification Power',
    'Offline Fortress',
    'Biometric Shield',
    'App Store Approval'
  ],
  desktop: [
    'Multi-OS Compatibility',
    'Hardware Acceleration',
    'Auto-Update System',
    'System Integration',
    'Performance Optimization',
    'Native File Access'
  ],
  backend: [
    'Infinite Scalability',
    'Database Mastery',
    'API Rate Limiting',
    'Security Fortress',
    'Microservice Architecture',
    'Real-time Processing'
  ],
  ai: [
    'Machine Learning Power',
    'Neural Network Integration',
    'Predictive Analytics',
    'Natural Language Processing',
    'Computer Vision',
    'Deep Learning Acceleration'
  ],
  blockchain: [
    'Smart Contract Integration',
    'Cryptocurrency Support',
    'Decentralized Architecture',
    'NFT Marketplace',
    'DeFi Protocol',
    'Web3 Connectivity'
  ]
}

export function AppCardGenerator({ generatedApp, onCardGenerated, onError }: AppCardGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [steps, setSteps] = useState<CardGenerationStep[]>(CARD_GENERATION_STEPS)
  const [currentStep, setCurrentStep] = useState(0)
  const [generatedCard, setGeneratedCard] = useState<AppCard | null>(null)
  const [previewMode, setPreviewMode] = useState<'card' | 'stats'>('card')

  const updateStep = (stepIndex: number, updates: Partial<CardGenerationStep>) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, ...updates } : step
    ))
  }

  const determineCategory = (techStack: string[], features: string[]): AppCard['category'] => {
    if (techStack.some(tech => tech.includes('React Native') || tech.includes('Flutter'))) {
      return 'mobile'
    }
    if (techStack.some(tech => tech.includes('Electron') || tech.includes('Tauri'))) {
      return 'desktop'
    }
    if (techStack.some(tech => tech.includes('Express') || tech.includes('FastAPI') || tech.includes('GraphQL'))) {
      return 'backend'
    }
    if (features.some(feature => feature.toLowerCase().includes('ai') || feature.toLowerCase().includes('ml'))) {
      return 'ai'
    }
    if (features.some(feature => feature.toLowerCase().includes('blockchain') || feature.toLowerCase().includes('web3'))) {
      return 'blockchain'
    }
    return 'web'
  }

  const calculateBattleStats = (
    template: any, 
    techStack: string[], 
    features: string[], 
    category: AppCard['category']
  ) => {
    // Base stats from template complexity
    const complexityMultipliers: { [key: string]: number } = {
      simple: 0.7,
      medium: 0.85,
      complex: 1.0
    }
    const complexityMultiplier = complexityMultipliers[template.complexity] || 0.8

    // Category-specific stat bonuses
    const categoryBonuses = {
      web: { power: 10, speed: 15, innovation: 5, scalability: 10 },
      mobile: { power: 15, speed: 10, innovation: 10, scalability: 5 },
      desktop: { power: 20, speed: 5, innovation: 5, scalability: 10 },
      backend: { power: 5, speed: 5, innovation: 10, scalability: 20 },
      ai: { power: 25, speed: 0, innovation: 20, scalability: 5 },
      blockchain: { power: 15, speed: -5, innovation: 25, scalability: 15 }
    }

    const bonus = categoryBonuses[category]
    const baseStats = {
      power: Math.round((60 + bonus.power + (techStack.length * 2)) * complexityMultiplier),
      speed: Math.round((65 + bonus.speed + (features.includes('Performance Optimized') ? 10 : 0)) * complexityMultiplier),
      innovation: Math.round((55 + bonus.innovation + (features.length * 3)) * complexityMultiplier),
      scalability: Math.round((50 + bonus.scalability + (techStack.includes('Next.js') ? 15 : 0)) * complexityMultiplier)
    }

    // Ensure stats are within reasonable bounds
    return {
      power: Math.min(100, Math.max(30, baseStats.power)),
      speed: Math.min(100, Math.max(30, baseStats.speed)),
      innovation: Math.min(100, Math.max(30, baseStats.innovation)),
      scalability: Math.min(100, Math.max(30, baseStats.scalability))
    }
  }

  const determineRarity = (battleStats: AppCard['battleStats']): AppCard['rarity'] => {
    const totalStats = Object.values(battleStats).reduce((sum, stat) => sum + stat, 0)
    const average = totalStats / 4

    if (average >= 85) return 'legendary'
    if (average >= 70) return 'epic'
    if (average >= 55) return 'rare'
    return 'common'
  }

  const generateSpecialAbilities = (
    category: AppCard['category'], 
    rarity: AppCard['rarity'],
    techStack: string[],
    features: string[]
  ): string[] => {
    const categoryAbilities = SPECIAL_ABILITIES[category] || SPECIAL_ABILITIES.web
    const abilityCount = RARITY_CONFIG[rarity].specialAbilitiesCount
    
    // Prioritize abilities based on tech stack and features
    const relevantAbilities = categoryAbilities.filter(ability => {
      return techStack.some(tech => ability.toLowerCase().includes(tech.toLowerCase())) ||
             features.some(feature => ability.toLowerCase().includes(feature.toLowerCase()))
    })

    // Fill remaining slots with random abilities
    const remainingAbilities = categoryAbilities.filter(ability => !relevantAbilities.includes(ability))
    const selectedAbilities = [
      ...relevantAbilities.slice(0, Math.min(abilityCount, relevantAbilities.length)),
      ...remainingAbilities.slice(0, Math.max(0, abilityCount - relevantAbilities.length))
    ]

    return selectedAbilities.slice(0, abilityCount)
  }

  const generateWeaknesses = (category: AppCard['category'], battleStats: AppCard['battleStats']): string[] => {
    const weaknessMap = {
      web: battleStats.speed < 60 ? ['Slow Loading Times'] : [],
      mobile: battleStats.power < 60 ? ['Battery Drain'] : [],
      desktop: battleStats.scalability < 60 ? ['Platform Limitations'] : [],
      backend: battleStats.speed < 60 ? ['High Latency'] : [],
      ai: battleStats.speed < 70 ? ['Processing Delays'] : [],
      blockchain: battleStats.speed < 50 ? ['Transaction Delays'] : []
    }

    return weaknessMap[category] || []
  }

  const generateCard = async () => {
    if (isGenerating) return

    setIsGenerating(true)
    setCurrentStep(0)

    try {
      // Step 1: Analyze App Complexity
      setCurrentStep(0)
      updateStep(0, { status: 'running', progress: 0 })
      
      const category = determineCategory(generatedApp.techStack, generatedApp.features)
      
      // Simulate analysis
      for (let progress = 0; progress <= 100; progress += 20) {
        updateStep(0, { progress })
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      updateStep(0, { status: 'completed', progress: 100 })

      // Step 2: Calculate Battle Stats
      setCurrentStep(1)
      updateStep(1, { status: 'running', progress: 0 })
      
      const battleStats = calculateBattleStats(
        generatedApp.template,
        generatedApp.techStack,
        generatedApp.features,
        category
      )

      for (let progress = 0; progress <= 100; progress += 25) {
        updateStep(1, { progress })
        await new Promise(resolve => setTimeout(resolve, 150))
      }
      updateStep(1, { status: 'completed', progress: 100 })

      // Step 3: Determine Rarity
      setCurrentStep(2)
      updateStep(2, { status: 'running', progress: 0 })
      
      const rarity = determineRarity(battleStats)

      for (let progress = 0; progress <= 100; progress += 33) {
        updateStep(2, { progress })
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      updateStep(2, { status: 'completed', progress: 100 })

      // Step 4: Generate Special Abilities
      setCurrentStep(3)
      updateStep(3, { status: 'running', progress: 0 })
      
      const specialAbilities = generateSpecialAbilities(
        category,
        rarity,
        generatedApp.techStack,
        generatedApp.features
      )
      const weaknesses = generateWeaknesses(category, battleStats)

      for (let progress = 0; progress <= 100; progress += 20) {
        updateStep(3, { progress })
        await new Promise(resolve => setTimeout(resolve, 120))
      }
      updateStep(3, { status: 'completed', progress: 100 })

      // Step 5: Create Card Artwork
      setCurrentStep(4)
      updateStep(4, { status: 'running', progress: 0 })
      
      // Simulate artwork generation
      for (let progress = 0; progress <= 100; progress += 10) {
        updateStep(4, { progress })
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      updateStep(4, { status: 'completed', progress: 100 })

      // Step 6: Finalize Trading Card
      setCurrentStep(5)
      updateStep(5, { status: 'running', progress: 0 })

      const card: AppCard = {
        id: `card_${generatedApp.id}`,
        name: generatedApp.projectName,
        description: generatedApp.projectDescription,
        template: generatedApp.template.name || 'Custom App',
        techStack: generatedApp.techStack,
        features: generatedApp.features,
        battleStats,
        rarity,
        thumbnail: `/api/cards/${generatedApp.id}/thumbnail`,
        creator: 'ECE AI Generator',
        githubRepo: generatedApp.githubRepo,
        vercelUrl: generatedApp.vercelUrl,
        downloadUrl: generatedApp.downloadUrl,
        createdAt: new Date(),
        category,
        specialAbilities,
        weaknesses,
        evolutionPath: generateEvolutionPath(category, rarity)
      }

      for (let progress = 0; progress <= 100; progress += 25) {
        updateStep(5, { progress })
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      updateStep(5, { status: 'completed', progress: 100 })

      setGeneratedCard(card)
      onCardGenerated?.(card)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Card generation failed'
      console.error('Card generation error:', errorMessage)
      onError?.(error instanceof Error ? error : new Error(errorMessage))
    } finally {
      setIsGenerating(false)
    }
  }

  const generateEvolutionPath = (category: AppCard['category'], rarity: AppCard['rarity']): string[] => {
    const evolutionPaths = {
      web: ['Static Site', 'Dynamic Web App', 'PWA', 'Full-Stack Platform'],
      mobile: ['Prototype', 'MVP', 'Production App', 'Platform Leader'],
      desktop: ['Simple Tool', 'Feature-Rich App', 'Professional Suite', 'Industry Standard'],
      backend: ['API Service', 'Microservice', 'Platform Backend', 'Enterprise Infrastructure'],
      ai: ['Basic ML', 'Advanced AI', 'Neural Network', 'AGI System'],
      blockchain: ['Simple DApp', 'Smart Contract', 'DeFi Protocol', 'Web3 Ecosystem']
    }

    const path = evolutionPaths[category] || evolutionPaths.web
    const currentIndex = ['common', 'rare', 'epic', 'legendary'].indexOf(rarity)
    
    return path.slice(0, currentIndex + 1)
  }

  const getRarityIcon = (rarity: AppCard['rarity']) => {
    const IconComponent = RARITY_CONFIG[rarity].icon
    return <IconComponent className="w-5 h-5" />
  }

  const getRarityColor = (rarity: AppCard['rarity']) => {
    return RARITY_CONFIG[rarity].color
  }

  const getStatIcon = (statName: string) => {
    const icons = {
      power: Sword,
      speed: Gauge,
      innovation: Sparkles,
      scalability: Target
    }
    const IconComponent = icons[statName as keyof typeof icons] || Star
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Card Generation Header */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#F8EFD6] flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-[#E6DB74]" />
              App Card Generator
            </h3>
            <p className="text-[#75715E] mt-1">
              Transform your generated app into a collectible trading card
            </p>
          </div>
          
          {!isGenerating && !generatedCard && (
            <Button
              onClick={generateCard}
              className="bg-gradient-to-r from-[#E6DB74] to-[#F8EFD6] text-[#272822] px-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate Card
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[#75715E]">App Name:</span>
            <p className="text-[#F8EFD6] font-medium">{generatedApp.projectName}</p>
          </div>
          <div>
            <span className="text-[#75715E]">Template:</span>
            <p className="text-[#F8EFD6] font-medium">{generatedApp.template.name}</p>
          </div>
          <div>
            <span className="text-[#75715E]">Tech Stack:</span>
            <p className="text-[#F8EFD6] font-medium">{generatedApp.techStack.length} technologies</p>
          </div>
        </div>
      </GlassCard>

      {/* Generation Steps */}
      {isGenerating && (
        <GlassCard variant="dark" className="p-6">
          <h4 className="text-lg font-bold text-[#F8EFD6] mb-4">Card Generation Progress</h4>
          
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`
                  flex items-center space-x-4 p-3 rounded-lg transition-colors
                  ${index === currentStep ? 'bg-[#E6DB74]/10 border border-[#E6DB74]/30' : 'bg-[#272822]/30'}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${step.status === 'completed' 
                    ? 'bg-[#A6E22E] text-[#272822]' 
                    : step.status === 'running'
                    ? 'bg-[#E6DB74] text-[#272822]'
                    : 'bg-[#75715E] text-[#F8EFD6]'
                  }
                `}>
                  {step.status === 'completed' ? '✓' : index + 1}
                </div>
                
                <div className="flex-1">
                  <span className="text-[#F8EFD6] font-medium">{step.name}</span>
                  {step.status === 'running' && (
                    <Progress value={step.progress} className="h-1 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Generated Card Display */}
      <AnimatePresence>
        {generatedCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Preview Mode Toggle */}
            <div className="flex justify-center">
              <div className="flex bg-[#272822]/50 rounded-lg p-1">
                <Button
                 
                  variant={previewMode === 'card' ? 'primary' : 'ghost'}
                  onClick={() => setPreviewMode('card')}
                  className={previewMode === 'card' ? 'bg-[#F92672] text-white' : 'text-[#75715E]'}
                >
                  Card View
                </Button>
                <Button
                 
                  variant={previewMode === 'stats' ? 'primary' : 'ghost'}
                  onClick={() => setPreviewMode('stats')}
                  className={previewMode === 'stats' ? 'bg-[#F92672] text-white' : 'text-[#75715E]'}
                >
                  Stats View
                </Button>
              </div>
            </div>

            {previewMode === 'card' ? (
              /* Trading Card View */
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    className={`
                      w-80 h-96 rounded-2xl relative overflow-hidden
                      bg-gradient-to-br ${RARITY_CONFIG[generatedCard.rarity].bgGradient}
                      border-2 shadow-2xl
                    `}
                    style={{ borderColor: getRarityColor(generatedCard.rarity) }}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Card Header */}
                    <div className="p-4 text-center border-b border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: getRarityColor(generatedCard.rarity) + '20',
                            color: getRarityColor(generatedCard.rarity),
                            borderColor: getRarityColor(generatedCard.rarity)
                          }}
                        >
                          {getRarityIcon(generatedCard.rarity)}
                          <span className="ml-1">{generatedCard.rarity.toUpperCase()}</span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {generatedCard.category.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-white font-bold text-lg truncate">
                        {generatedCard.name}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {generatedCard.template}
                      </p>
                    </div>

                    {/* Card Artwork */}
                    <div className="h-32 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                      <Code className="w-16 h-16 text-white/60" />
                    </div>

                    {/* Battle Stats */}
                    <div className="p-4 space-y-2">
                      {Object.entries(generatedCard.battleStats).map(([stat, value]) => (
                        <div key={stat} className="flex items-center justify-between text-white text-sm">
                          <div className="flex items-center">
                            {getStatIcon(stat)}
                            <span className="ml-1 capitalize">{stat}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-black/30 rounded-full mr-2">
                              <div 
                                className="h-2 bg-white rounded-full transition-all duration-500"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs w-8 text-right">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Special Abilities */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/50">
                      <div className="text-white text-xs">
                        <strong>Special Abilities:</strong>
                        <div className="mt-1 space-y-1">
                          {generatedCard.specialAbilities?.slice(0, 2).map((ability) => (
                            <div key={ability} className="flex items-center">
                              <Star className="w-3 h-3 mr-1 text-yellow-400" />
                              <span>{ability}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Rarity Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
                      style={{ 
                        boxShadow: `inset 0 0 20px ${getRarityColor(generatedCard.rarity)}`
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            ) : (
              /* Stats View */
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Detailed Stats */}
                <GlassCard variant="dark" className="p-6">
                  <h4 className="text-lg font-bold text-[#F8EFD6] mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-[#E6DB74]" />
                    Battle Statistics
                  </h4>
                  
                  <div className="space-y-4">
                    {Object.entries(generatedCard.battleStats).map(([stat, value]) => (
                      <div key={stat} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[#F8EFD6] capitalize flex items-center">
                            {getStatIcon(stat)}
                            <span className="ml-2">{stat}</span>
                          </span>
                          <span className="text-[#66D9EF] font-mono">{value}/100</span>
                        </div>
                        <Progress value={value} className="h-3" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#75715E]/30">
                    <div className="text-center">
                      <span className="text-[#75715E] text-sm">Overall Power Level</span>
                      <div className="text-2xl font-bold text-[#F92672] mt-1">
                        {Math.round(Object.values(generatedCard.battleStats).reduce((a, b) => a + b, 0) / 4)}
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Abilities & Info */}
                <GlassCard variant="dark" className="p-6">
                  <h4 className="text-lg font-bold text-[#F8EFD6] mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-[#A6E22E]" />
                    Card Information
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[#75715E] text-sm">Rarity Level:</span>
                      <div className="flex items-center mt-1">
                        <Badge 
                          className="text-sm"
                          style={{ 
                            backgroundColor: getRarityColor(generatedCard.rarity) + '20',
                            color: getRarityColor(generatedCard.rarity)
                          }}
                        >
                          {getRarityIcon(generatedCard.rarity)}
                          <span className="ml-1">{generatedCard.rarity.toUpperCase()}</span>
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <span className="text-[#75715E] text-sm">Special Abilities:</span>
                      <div className="mt-2 space-y-1">
                        {generatedCard.specialAbilities?.map((ability) => (
                          <div key={ability} className="flex items-center text-[#F8EFD6] text-sm">
                            <Star className="w-3 h-3 mr-2 text-[#E6DB74]" />
                            {ability}
                          </div>
                        ))}
                      </div>
                    </div>

                    {generatedCard.weaknesses && generatedCard.weaknesses.length > 0 && (
                      <div>
                        <span className="text-[#75715E] text-sm">Weaknesses:</span>
                        <div className="mt-2 space-y-1">
                          {generatedCard.weaknesses.map((weakness) => (
                            <div key={weakness} className="flex items-center text-[#FD5C63] text-sm">
                              <AlertCircle className="w-3 h-3 mr-2" />
                              {weakness}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-[#75715E] text-sm">Tech Stack:</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {generatedCard.techStack.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {generatedCard.evolutionPath && (
                      <div>
                        <span className="text-[#75715E] text-sm">Evolution Path:</span>
                        <div className="mt-2 flex items-center space-x-2">
                          {generatedCard.evolutionPath.map((stage, index) => (
                            <React.Fragment key={stage}>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  index === generatedCard.evolutionPath!.length - 1 
                                    ? 'border-[#F92672] text-[#F92672]' 
                                    : 'border-[#75715E] text-[#75715E]'
                                }`}
                              >
                                {stage}
                              </Badge>
                              {generatedCard.evolutionPath && index < generatedCard.evolutionPath.length - 1 && (
                                <span className="text-[#75715E]">→</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Card Actions */}
            <div className="flex justify-center space-x-4">
              {generatedCard.githubRepo && (
                <Button
                  variant="outline"
                  className="border-[#66D9EF]/30 text-[#66D9EF] hover:bg-[#66D9EF]/20"
                  onClick={() => window.open(generatedCard.githubRepo, '_blank')}
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </Button>
              )}
              
              {generatedCard.vercelUrl && (
                <Button
                  variant="outline"
                  className="border-[#A6E22E]/30 text-[#A6E22E] hover:bg-[#A6E22E]/20"
                  onClick={() => window.open(generatedCard.vercelUrl, '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              )}
              
              <Button
                className="bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white"
              >
                <Heart className="w-4 h-4 mr-2" />
                Add to Collection
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AppCardGenerator
