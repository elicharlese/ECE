'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../lib/button'
import { GlassCard } from '../lib/glass-card'
import { 
  ProjectType, 
  ProjectConstraints, 
  GenerationResult,
  PlatformTarget,
  ClientGenerationEngine
} from '@ece-platform/shared-business-logic'

export interface GenerationEngineUIProps {
  onGenerate?: (result: GenerationResult) => void
  className?: string
}

interface ProjectTypeOption {
  value: ProjectType
  label: string
  description: string
  platforms: PlatformTarget[]
  icon: string
}

const PROJECT_TYPES: ProjectTypeOption[] = [
  {
    value: 'nx-monorepo',
    label: 'Nx Monorepo',
    description: 'Full-stack monorepo with web, mobile, and desktop apps',
    platforms: ['web', 'mobile', 'desktop'],
    icon: '🏗️'
  },
  {
    value: 'nextjs-web',
    label: 'Next.js Web App',
    description: 'Modern React web application with SSR/SSG',
    platforms: ['web'],
    icon: '🌐'
  },
  {
    value: 'expo-mobile',
    label: 'Expo Mobile App',
    description: 'Cross-platform React Native mobile application',
    platforms: ['mobile'],
    icon: '📱'
  },
  {
    value: 'electron-desktop',
    label: 'Electron Desktop App',
    description: 'Cross-platform desktop application',
    platforms: ['desktop'],
    icon: '🖥️'
  },
  {
    value: 'chrome-extension',
    label: 'Chrome Extension',
    description: 'Browser extension with modern tooling',
    platforms: ['web'],
    icon: '🧩'
  },
  {
    value: 'vscode-extension',
    label: 'VS Code Extension',
    description: 'Visual Studio Code extension with TypeScript',
    platforms: ['desktop'],
    icon: '⚡'
  },
  {
    value: 'cli-tool',
    label: 'CLI Tool',
    description: 'Command-line interface tool with Node.js',
    platforms: ['server'],
    icon: '⌨️'
  },
  {
    value: 'shopify-app',
    label: 'Shopify App',
    description: 'E-commerce application for Shopify platform',
    platforms: ['web'],
    icon: '🛍️'
  },
  {
    value: 'discord-bot',
    label: 'Discord Bot',
    description: 'Discord bot with slash commands and events',
    platforms: ['server'],
    icon: '🤖'
  }
]

export function GenerationEngineUI({ onGenerate, className }: GenerationEngineUIProps) {
  const [step, setStep] = useState<'type' | 'config' | 'generating' | 'complete'>('type')
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null)
  const [projectName, setProjectName] = useState('')
  const [customRequirements, setCustomRequirements] = useState('')
  const [requirements, setRequirements] = useState({
    authentication: false,
    database: false,
    realtime: false,
    payments: false,
    analytics: false,
    testing: true,
    cicd: false,
    docker: false,
    monitoring: false
  })
  const [architecture, setArchitecture] = useState({
    monorepo: false,
    microservices: false,
    serverless: false,
    spa: true,
    ssr: false,
    static: false
  })
  const [compliance, setCompliance] = useState({
    accessibility: false,
    security: true,
    performance: true,
    seo: false
  })
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const selectedProjectType = PROJECT_TYPES.find(pt => pt.value === selectedType)

  const handleGenerate = async () => {
    if (!selectedType || !projectName) return

    setIsGenerating(true)
    setStep('generating')
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90))
    }, 500)

    try {
      const constraints: ProjectConstraints = {
        projectType: selectedType,
        platforms: selectedProjectType?.platforms || ['web'],
        techStack: {
          frontend: [],
          backend: [],
          database: [],
          deployment: [],
          testing: [],
          styling: [],
          stateManagement: [],
          bundler: [],
          runtime: []
        },
        requirements,
        architecture,
        compliance
      }

      const response = await fetch('/api/engine/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          projectType: selectedType,
          platforms: selectedProjectType?.platforms,
          requirements,
          architecture,
          compliance,
          customRequirements
        })
      })

      const result = await response.json()
      
      clearInterval(progressInterval)
      setProgress(100)
      
      setTimeout(() => {
        setGenerationResult(result)
        setStep('complete')
        setIsGenerating(false)
        onGenerate?.(result)
      }, 500)

    } catch (error) {
      console.error('Generation failed:', error)
      clearInterval(progressInterval)
      setIsGenerating(false)
      setStep('config')
    }
  }

  const resetFlow = () => {
    setStep('type')
    setSelectedType(null)
    setProjectName('')
    setCustomRequirements('')
    setGenerationResult(null)
    setProgress(0)
  }

  if (step === 'type') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Your Project Type
          </h2>
          <p className="text-gray-600">
            Select the type of software you want to generate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECT_TYPES.map((projectType) => (
            <GlassCard
              key={projectType.value}
              className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                selectedType === projectType.value
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedType(projectType.value)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{projectType.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {projectType.label}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {projectType.description}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {projectType.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setStep('config')}
            disabled={!selectedType}
            className="px-8 py-2"
          >
            Continue
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'config') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Configure Your {selectedProjectType?.label}
            </h2>
            <p className="text-gray-600">
              Customize the project settings and requirements
            </p>
          </div>
          <Button variant="secondary" onClick={() => setStep('type')}>
            Back
          </Button>
        </div>

        <GlassCard className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-awesome-project"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Requirements
            </label>
            <textarea
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              placeholder="Describe any specific features, integrations, or requirements..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(requirements).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setRequirements(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Architecture</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(architecture).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setArchitecture(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(compliance).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setCompliance(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-center">
          <Button
            onClick={handleGenerate}
            disabled={!projectName.trim()}
            className="px-8 py-2"
          >
            Generate Project
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'generating') {
    return (
      <div className={`space-y-6 text-center ${className}`}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Generating Your Project
          </h2>
          <p className="text-gray-600">
            AI developers are building your {selectedProjectType?.label}...
          </p>
        </div>

        <GlassCard className="p-8">
          <div className="space-y-4">
            <div className="text-4xl mb-4">🤖</div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-600">
              {progress < 30 && "Analyzing requirements..."}
              {progress >= 30 && progress < 60 && "Generating project structure..."}
              {progress >= 60 && progress < 90 && "Creating files and configurations..."}
              {progress >= 90 && "Finalizing and validating..."}
            </p>
          </div>
        </GlassCard>
      </div>
    )
  }

  if (step === 'complete' && generationResult) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">
            {generationResult.success ? '🎉' : '⚠️'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {generationResult.success ? 'Project Generated!' : 'Generation Issues'}
          </h2>
          <p className="text-gray-600">
            {generationResult.success 
              ? `Your ${selectedProjectType?.label} has been created successfully`
              : 'There were some issues during generation'
            }
          </p>
        </div>

        <GlassCard className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
            <p className="text-sm text-gray-600">
              <strong>Path:</strong> {generationResult.projectPath}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Files Generated:</strong> {generationResult.filesGenerated.length}
            </p>
          </div>

          {generationResult.nextSteps && generationResult.nextSteps.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
              <ol className="list-decimal list-inside space-y-1">
                {generationResult.nextSteps.map((step, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {generationResult.errors && generationResult.errors.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 mb-2">Errors</h3>
              <ul className="space-y-1">
                {generationResult.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-600">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {generationResult.warnings && generationResult.warnings.length > 0 && (
            <div>
              <h3 className="font-semibold text-yellow-700 mb-2">Warnings</h3>
              <ul className="space-y-1">
                {generationResult.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-600">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>

        <div className="flex justify-center space-x-4">
          <Button onClick={resetFlow} variant="secondary">
            Generate Another
          </Button>
          {generationResult.success && (
            <Button onClick={() => window.open(generationResult.projectPath, '_blank')}>
              Open Project
            </Button>
          )}
        </div>
      </div>
    )
  }

  return null
}
