'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github, Star, GitFork, Code, Zap, Shield, Activity, Target } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GitHubRepoCard } from '@/data/github-repo-cards'

interface RepositoryCardProps {
  repository: GitHubRepoCard
  onBattle?: (repoId: string) => void
  onBid?: (repoId: string) => void
  onBet?: (repoId: string) => void
  onView?: (repoId: string) => void
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  onBattle,
  onBid,
  onBet,
  onView,
  variant = 'default',
  showActions = true
}) => {
  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600 border-gray-400/50'
      case 'rare': return 'from-blue-400 to-blue-600 border-blue-400/50'
      case 'epic': return 'from-purple-400 to-purple-600 border-purple-400/50'
      case 'legendary': return 'from-yellow-400 to-orange-500 border-yellow-400/50'
      case 'mythic': return 'from-red-400 to-pink-600 border-red-400/50'
      default: return 'from-gray-400 to-gray-600 border-gray-400/50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'majors': return '👑'
      case 'minors': return '⭐'
      case 'mvps': return '🚀'
      default: return '📦'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-400'
      case 'moderate': return 'text-yellow-400'
      case 'complex': return 'text-orange-400'
      case 'enterprise': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const cardVariants = {
    default: 'w-80 h-[520px]',
    compact: 'w-64 h-80',
    detailed: 'w-96 h-[600px]'
  }

  return (
    <motion.div
      className={`relative group cursor-pointer ${cardVariants[variant]}`}
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        z: 50
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      <Card className={`h-full relative overflow-hidden glass-card border-2 ${getRarityColors(repository.rarity).split(' ')[2]} shadow-card-ece hover:shadow-card-ece-hover transition-all duration-300`}>
        {/* Header */}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{getCategoryIcon(repository.category)}</span>
                <h3 className="text-lg font-bold text-foreground text-shadow-soft">
                  {repository.displayName}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {repository.description}
              </p>
            </div>
            
            {/* Rarity Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColors(repository.rarity).split(' ')[0]} ${getRarityColors(repository.rarity).split(' ')[1]} text-white shadow-soft flex items-center gap-1`}>
              {repository.rarity.toUpperCase()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex flex-col h-full">
          {/* Repository Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 bg-background/20 rounded-lg border border-border/30 shadow-soft">
              <div className="text-lg drop-shadow-icon">💡</div>
              <div className="text-xs text-muted-foreground uppercase font-medium">Innovation</div>
              <div className="text-sm font-bold text-monokai-accent">{repository.stats.innovation}</div>
            </div>
            <div className="text-center p-2 bg-background/20 rounded-lg border border-border/30 shadow-soft">
              <div className="text-lg drop-shadow-icon">📈</div>
              <div className="text-xs text-muted-foreground uppercase font-medium">Scale</div>
              <div className="text-sm font-bold text-monokai-success">{repository.stats.scalability}</div>
            </div>
            <div className="text-center p-2 bg-background/20 rounded-lg border border-border/30 shadow-soft">
              <div className="text-lg drop-shadow-icon">🎯</div>
              <div className="text-xs text-muted-foreground uppercase font-medium">Market</div>
              <div className="text-sm font-bold text-monokai-info">{repository.stats.marketPotential}</div>
            </div>
            <div className="text-center p-2 bg-background/20 rounded-lg border border-border/30 shadow-soft">
              <div className="text-lg drop-shadow-icon">🔧</div>
              <div className="text-xs text-muted-foreground uppercase font-medium">Tech</div>
              <div className="text-sm font-bold text-monokai-purple">{repository.stats.technicalDepth}</div>
            </div>
          </div>

          {/* Battle Stats */}
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2 font-medium">BATTLE STATS</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <span className="text-red-400">⚔️</span>
                  ATK
                </span>
                <span className="font-bold">{repository.battleStats.attack}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <span className="text-blue-400">🛡️</span>
                  DEF
                </span>
                <span className="font-bold">{repository.battleStats.defense}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">⚡</span>
                  SPD
                </span>
                <span className="font-bold">{repository.battleStats.speed}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <span className="text-green-400">🔮</span>
                  UTL
                </span>
                <span className="font-bold">{repository.battleStats.utility}</span>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2 font-medium">TECH STACK</div>
            <div className="flex flex-wrap gap-1">
              {repository.techStack.slice(0, 4).map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-1 shadow-soft"
                >
                  {tech}
                </Badge>
              ))}
              {repository.techStack.length > 4 && (
                <Badge variant="outline" className="text-xs px-2 py-1 shadow-soft">
                  +{repository.techStack.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Complexity and Value */}
          <div className="mb-4 p-3 bg-gradient-to-r from-monokai-warning/10 to-monokai-warning/5 rounded-lg border border-monokai-warning/20 shadow-soft">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-muted-foreground">COMPLEXITY</div>
                <div className={`text-sm font-bold ${getComplexityColor(repository.complexity)}`}>
                  {repository.complexity.toUpperCase()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">VALUE</div>
                <div className="text-lg font-bold text-monokai-warning">
                  ${repository.estimatedValue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          {variant === 'detailed' && (
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2 font-medium">KEY FEATURES</div>
              <div className="space-y-1">
                {repository.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-monokai-accent rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="grid grid-cols-2 gap-2 mt-auto">
              {onBattle && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBattle(repository.id)}
                  className="shadow-soft hover:shadow-soft-lg text-xs"
                >
                  <span className="mr-1">⚔️</span>
                  BATTLE
                </Button>
              )}
              
              {onBid && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onBid(repository.id)}
                  className="bg-gradient-to-r from-monokai-info to-monokai-info/80 shadow-soft hover:shadow-soft-lg text-xs"
                >
                  <span className="mr-1">💰</span>
                  BID
                </Button>
              )}
              
              {onBet && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onBet(repository.id)}
                  className="shadow-soft hover:shadow-soft-lg text-xs"
                >
                  <span className="mr-1">🎲</span>
                  BET
                </Button>
              )}
              
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(repository.id)}
                  className="shadow-soft hover:shadow-soft-lg text-xs col-span-full"
                >
                  <Github className="h-3 w-3 mr-1" />
                  VIEW ON GITHUB
                </Button>
              )}
            </div>
          )}

          {/* GitHub Link */}
          <div className="mt-2 pt-2 border-t border-border/30">
            <a
              href={repository.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              <Github className="h-3 w-3" />
              {repository.owner}/{repository.name}
            </a>
          </div>
        </CardContent>

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-foreground shadow-soft border border-border/30">
            {repository.category.toUpperCase()}
          </div>
        </div>

        {/* Trading Status */}
        {repository.isPublicForTrading && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-glow-success animate-pulse" />
          </div>
        )}
      </Card>
    </motion.div>
  )
}
