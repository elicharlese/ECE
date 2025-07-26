'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Github, 
  GitBranch, 
  Cloud, 
  Database,
  Plus,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
  Star,
  GitFork,
  Code,
  Shield,
  Zap
} from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { RepoCardGeneratorService, ProviderRepo } from '../../services/repo-card-generator.service'
import { GitHubRepoCard } from '../../data/github-repo-cards'
import { addCardToUser, connectProviderToUser } from '../../data/user-profiles'

interface ConnectRepoModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  onCardsGenerated: (cards: GitHubRepoCard[]) => void
}

const PROVIDERS = [
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    color: '#F8EFD6',
    description: 'Connect your GitHub repositories',
    authUrl: 'https://github.com/login/oauth/authorize',
    popular: true
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    icon: GitBranch,
    color: '#F92672',
    description: 'Import GitLab projects',
    authUrl: 'https://gitlab.com/oauth/authorize',
    popular: true
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    icon: GitBranch,
    color: '#66D9EF',
    description: 'Sync Bitbucket repositories',
    authUrl: 'https://bitbucket.org/site/oauth2/authorize',
    popular: true
  },
  {
    id: 'azure',
    name: 'Azure DevOps',
    icon: Cloud,
    color: '#66D9EF',
    description: 'Sync Azure DevOps repositories',
    authUrl: 'https://app.vssps.visualstudio.com/oauth2/authorize',
    popular: false
  },
  {
    id: 'aws',
    name: 'AWS CodeCommit',
    icon: Database,
    color: '#E6DB74',
    description: 'Import AWS CodeCommit repos',
    authUrl: '#',
    popular: false
  },
  {
    id: 'sourcehut',
    name: 'SourceHut',
    icon: Code,
    color: '#A6E22E',
    description: 'Connect SourceHut repositories',
    authUrl: 'https://meta.sr.ht/oauth/authorize',
    popular: false
  },
  {
    id: 'codeberg',
    name: 'Codeberg',
    icon: GitBranch,
    color: '#75715E',
    description: 'Import Codeberg repositories',
    authUrl: 'https://codeberg.org/login/oauth/authorize',
    popular: false
  },
  {
    id: 'gitea',
    name: 'Gitea',
    icon: GitBranch,
    color: '#819AFF',
    description: 'Connect self-hosted Gitea',
    authUrl: '#',
    popular: false
  }
]

export function ConnectRepoModal({ isOpen, onClose, userEmail, onCardsGenerated }: ConnectRepoModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedRepos, setConnectedRepos] = useState<ProviderRepo[]>([])
  const [generatedCards, setGeneratedCards] = useState<GitHubRepoCard[]>([])
  const [step, setStep] = useState<'select' | 'connect' | 'repos' | 'generate' | 'complete'>('select')
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleProviderConnect = async (providerId: string) => {
    setSelectedProvider(providerId)
    setIsConnecting(true)
    setError(null)
    setStep('connect')

    try {
      // In a real app, this would redirect to OAuth flow
      // For demo, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock access token - in real app this comes from OAuth callback
      const mockToken = 'mock_access_token'
      
      // Fetch repositories from provider
      const repos = await RepoCardGeneratorService.connectProvider(providerId, mockToken)
      
      if (repos.length === 0) {
        setError('No repositories found or access denied')
        setStep('select')
        return
      }

      setConnectedRepos(repos)
      setStep('repos')
      
      // Connect provider to user profile
      connectProviderToUser(userEmail, providerId)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to provider')
      setStep('select')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleGenerateCards = async () => {
    setStep('generate')
    
    try {
      const cards = connectedRepos.map(repo => 
        RepoCardGeneratorService.generateCardFromRepo(repo, userEmail)
      )
      
      // Add cards to user profile
      cards.forEach(card => addCardToUser(userEmail, card))
      
      setGeneratedCards(cards)
      setStep('complete')
      onCardsGenerated(cards)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cards')
      setStep('repos')
    }
  }

  const handleClose = () => {
    setStep('select')
    setSelectedProvider(null)
    setConnectedRepos([])
    setGeneratedCards([])
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard variant="dark" className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#F8EFD6]">
              Connect Your Repositories
            </h2>
            <Button variant="ghost" onClick={handleClose}>
              ✕
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#F92672]/10 border border-[#F92672]/30 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-[#F92672] mr-2" />
              <span className="text-[#F92672]">{error}</span>
            </div>
          )}

          {/* Step 1: Select Provider */}
          {step === 'select' && (
            <div className="space-y-6">
              <p className="text-[#75715E] text-lg">
                Choose a repository provider to import your projects and generate trading cards automatically.
              </p>
              
              {/* Popular Providers */}
              <div>
                <h3 className="text-lg font-semibold text-[#F8EFD6] mb-3">Popular Providers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PROVIDERS.filter(p => p.popular).map((provider) => (
                    <motion.div
                      key={provider.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GlassCard 
                        variant="light" 
                        className="p-6 cursor-pointer hover:border-[#66D9EF]/50 transition-colors"
                        onClick={() => handleProviderConnect(provider.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-[#272822]/80 to-[#272822]/40">
                            <provider.icon className="w-8 h-8" style={{ color: provider.color }} />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-[#F8EFD6]">
                              {provider.name}
                            </h3>
                            <p className="text-[#75715E] text-sm">
                              {provider.description}
                            </p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-[#66D9EF]" />
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Other Providers */}
              <div>
                <h3 className="text-lg font-semibold text-[#F8EFD6] mb-3">Other Providers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PROVIDERS.filter(p => !p.popular).map((provider) => (
                    <motion.div
                      key={provider.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <GlassCard 
                        variant="light" 
                        className="p-4 cursor-pointer hover:border-[#66D9EF]/30 transition-colors"
                        onClick={() => handleProviderConnect(provider.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-[#272822]/60 to-[#272822]/20">
                            <provider.icon className="w-5 h-5" style={{ color: provider.color }} />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-semibold text-[#F8EFD6]">
                              {provider.name}
                            </h4>
                            <p className="text-[#75715E] text-xs">
                              {provider.description}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[#66D9EF]" />
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Connecting */}
          {step === 'connect' && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-[#66D9EF] animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#F8EFD6] mb-2">
                Connecting to {PROVIDERS.find(p => p.id === selectedProvider)?.name}
              </h3>
              <p className="text-[#75715E]">
                Please authorize ECE to access your repositories...
              </p>
            </div>
          )}

          {/* Step 3: Repository Selection */}
          {step === 'repos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#F8EFD6]">
                  Found {connectedRepos.length} Repositories
                </h3>
                <Button onClick={handleGenerateCards} variant="accent">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate All Cards
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {connectedRepos.map((repo) => (
                  <GlassCard key={repo.id} variant="light" className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-grow">
                        <h4 className="font-semibold text-[#F8EFD6] mb-1">
                          {repo.name}
                        </h4>
                        <p className="text-[#75715E] text-sm line-clamp-2">
                          {repo.analysis.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-[#75715E] mb-3">
                      {repo.analysis.stars > 0 && (
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          {repo.analysis.stars}
                        </div>
                      )}
                      {repo.analysis.forks > 0 && (
                        <div className="flex items-center">
                          <GitFork className="w-3 h-3 mr-1" />
                          {repo.analysis.forks}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Code className="w-3 h-3 mr-1" />
                        {repo.analysis.language}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" size="sm">
                        {repo.analysis.complexity}
                      </Badge>
                      {repo.analysis.isPublic && (
                        <Badge variant="outline" size="sm">
                          Public
                        </Badge>
                      )}
                      {repo.analysis.hasTests && (
                        <Badge variant="outline" size="sm">
                          Tests
                        </Badge>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Generating Cards */}
          {step === 'generate' && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-[#A6E22E] animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#F8EFD6] mb-2">
                Generating Trading Cards
              </h3>
              <p className="text-[#75715E]">
                Creating cards from {connectedRepos.length} repositories...
              </p>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 'complete' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A6E22E]/20 to-[#A6E22E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#A6E22E]" />
                </div>
                <h3 className="text-2xl font-bold text-[#F8EFD6] mb-2">
                  Cards Generated Successfully!
                </h3>
                <p className="text-[#75715E]">
                  {generatedCards.length} trading cards have been added to your collection
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                {generatedCards.slice(0, 6).map((card) => (
                  <GlassCard key={card.id} variant="light" className="p-4">
                    <div className="text-center">
                      <h4 className="font-semibold text-[#F8EFD6] mb-2">
                        {card.displayName}
                      </h4>
                      <Badge 
                        variant="outline" 
                        size="sm"
                        className={`mb-2 ${
                          card.rarity === 'mythic' ? 'border-[#F92672] text-[#F92672]' :
                          card.rarity === 'legendary' ? 'border-[#E6DB74] text-[#E6DB74]' :
                          card.rarity === 'epic' ? 'border-[#A6E22E] text-[#A6E22E]' :
                          card.rarity === 'rare' ? 'border-[#66D9EF] text-[#66D9EF]' :
                          'border-[#75715E] text-[#75715E]'
                        }`}
                      >
                        {card.rarity}
                      </Badge>
                      <p className="text-[#75715E] text-xs mb-2">
                        ${card.estimatedValue}
                      </p>
                      <div className="text-xs text-[#75715E]">
                        Attack: {card.battleStats.attack} | Defense: {card.battleStats.defense}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {generatedCards.length > 6 && (
                <p className="text-center text-[#75715E]">
                  ...and {generatedCards.length - 6} more cards
                </p>
              )}

              <div className="flex justify-center space-x-4">
                <Button onClick={handleClose} variant="accent">
                  <Shield className="w-4 h-4 mr-2" />
                  View My Collection
                </Button>
                <Button onClick={() => setStep('select')} variant="ghost">
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Another Provider
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}
