'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Rocket, 
  Eye, 
  Settings, 
  Download,
  Github,
  Globe,
  Zap,
  BarChart3,
  Users,
  Brain,
  Code,
  Palette,
  Gem
} from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { AppGenerator } from '../app-generation/app-generator'
import { GeneratedAppsDashboard } from './generated-apps-dashboard'

const appTemplates = [
  {
    id: 'social-platform',
    name: 'Social Trading Platform',
    description: 'Community-driven trading with social features',
    category: 'Social',
    complexity: 'Advanced',
    estimatedTime: '8-12 minutes',
    features: ['User Profiles', 'Social Feed', 'Trading Chat', 'Leaderboards'],
    techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'],
    icon: Users,
    gradient: 'from-[#F92672] to-[#FD5C63]'
  },
  {
    id: 'ai-analytics',
    name: 'AI Analytics Dashboard',
    description: 'Advanced analytics with AI-powered insights',
    category: 'Analytics',
    complexity: 'Expert',
    estimatedTime: '10-15 minutes',
    features: ['Real-time Analytics', 'AI Predictions', 'Custom Reports', 'Data Visualization'],
    techStack: ['React', 'TypeScript', 'D3.js', 'Python API'],
    icon: Brain,
    gradient: 'from-[#66D9EF] to-[#819AFF]'
  },
  {
    id: 'marketplace',
    name: 'NFT Marketplace',
    description: 'Decentralized marketplace for digital assets',
    category: 'Blockchain',
    complexity: 'Expert',
    estimatedTime: '12-18 minutes',
    features: ['NFT Trading', 'Wallet Integration', 'Auction System', 'Collection Management'],
    techStack: ['Next.js', 'Web3.js', 'Solidity', 'IPFS'],
    icon: Gem,
    gradient: 'from-[#A6E22E] to-[#3EBA7C]'
  },
  {
    id: 'portfolio-tracker',
    name: 'Investment Portfolio Tracker',
    description: 'Track and analyze investment performance',
    category: 'Finance',
    complexity: 'Intermediate',
    estimatedTime: '6-10 minutes',
    features: ['Portfolio Overview', 'Performance Analytics', 'Asset Allocation', 'Risk Assessment'],
    techStack: ['Vue.js', 'Chart.js', 'Node.js', 'MongoDB'],
    icon: BarChart3,
    gradient: 'from-[#E6DB74] to-[#F8EFD6]'
  },
  {
    id: 'design-system',
    name: 'Component Design System',
    description: 'Comprehensive UI component library',
    category: 'Design',
    complexity: 'Advanced',
    estimatedTime: '8-12 minutes',
    features: ['Component Library', 'Documentation', 'Theme System', 'Playground'],
    techStack: ['Storybook', 'React', 'Styled Components', 'TypeScript'],
    icon: Palette,
    gradient: 'from-[#9966CC] to-[#75715E]'
  },
  {
    id: 'api-platform',
    name: 'REST API Platform',
    description: 'Scalable API with documentation',
    category: 'Backend',
    complexity: 'Advanced',
    estimatedTime: '10-14 minutes',
    features: ['REST API', 'GraphQL', 'Documentation', 'Rate Limiting', 'Authentication'],
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    icon: Code,
    gradient: 'from-[#66D9EF] to-[#272822]'
  }
]

interface AdminAppGenerationProps {
  onAppGenerated?: (app: any) => void
}

export function AdminAppGeneration({ onAppGenerated }: AdminAppGenerationProps) {
  const [activeView, setActiveView] = useState<'templates' | 'generator' | 'dashboard'>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [generatingApps, setGeneratingApps] = useState<any[]>([])

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setActiveView('generator')
  }

  const handleGenerationComplete = (result: any) => {
    setGeneratingApps(prev => [...prev, result])
    onAppGenerated?.(result)
    setActiveView('dashboard')
  }

  const handleBack = () => {
    if (activeView === 'generator') {
      setActiveView('templates')
      setSelectedTemplate(null)
    } else if (activeView === 'dashboard') {
      setActiveView('templates')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#F8EFD6]">App Generation Center</h2>
          <p className="text-[#75715E]">Create powerful applications with AI-assisted development</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={activeView === 'templates' ? 'primary' : 'ghost'}
            onClick={() => setActiveView('templates')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New App
          </Button>
          <Button
            variant={activeView === 'dashboard' ? 'primary' : 'ghost'}
            onClick={() => setActiveView('dashboard')}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Apps
          </Button>
        </div>
      </div>

      {/* Content Based on Active View */}
      {activeView === 'templates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appTemplates.map((template) => {
              const Icon = template.icon
              return (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <GlassCard className="p-6 hover:bg-white/5 transition-all duration-300">
                      <div className="space-y-4">
                        {/* Template Header */}
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${template.gradient}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              template.complexity === 'Expert' ? 'bg-[#F92672]/20 text-[#F92672]' :
                              template.complexity === 'Advanced' ? 'bg-[#E6DB74]/20 text-[#E6DB74]' :
                              'bg-[#A6E22E]/20 text-[#A6E22E]'
                            }`}
                        >
                          {template.complexity}
                        </Badge>
                      </div>

                      {/* Template Info */}
                      <div>
                        <h3 className="text-xl font-bold text-[#F8EFD6] mb-2">{template.name}</h3>
                        <p className="text-[#75715E] text-sm mb-3">{template.description}</p>
                        
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className="text-[#66D9EF]">{template.category}</span>
                          <span className="text-[#A6E22E]">{template.estimatedTime}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <div className="text-xs text-[#75715E] mb-2">Key Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <div className="text-xs text-[#75715E] mb-2">Tech Stack:</div>
                        <div className="flex flex-wrap gap-1">
                          {template.techStack.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {template.techStack.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.techStack.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Generate Button */}
                      <Button className="w-full mt-4 bg-gradient-to-r from-[#66D9EF] to-[#819AFF] hover:from-[#819AFF] hover:to-[#66D9EF]">
                        <Rocket className="w-4 h-4 mr-2" />
                        Generate App
                      </Button>
                    </div>
                  </GlassCard>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {activeView === 'generator' && selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            <Button variant="ghost" onClick={handleBack}>
              ← Back to Templates
            </Button>
            <AppGenerator
              template={selectedTemplate}
              projectName={`${selectedTemplate.name} - ${new Date().toLocaleDateString()}`}
              projectDescription={selectedTemplate.description}
              customFeatures={selectedTemplate.features}
              onGenerationComplete={handleGenerationComplete}
              onGenerationError={(error) => {
                console.error('Generation failed:', error)
                setActiveView('templates')
              }}
            />
          </div>
        </motion.div>
      )}

      {activeView === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GeneratedAppsDashboard />
        </motion.div>
      )}
    </div>
  )
}
