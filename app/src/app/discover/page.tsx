'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp, Users, Star, Sparkles, Trophy, Target, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RepositoryCollection } from '@/components/repository-collection'
import { RepositoryCard } from '@/components/repository-card'
import { ELICHARLESE_REPO_CARDS, getRepositoriesByCategory } from '@/data/github-repo-cards'
import toast from 'react-hot-toast'

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState('all')

  // Get featured repositories for each category
  const featuredMajors = getRepositoriesByCategory('majors').slice(0, 3)
  const featuredMinors = getRepositoriesByCategory('minors').slice(0, 3)
  const featuredMVPs = getRepositoriesByCategory('mvps').slice(0, 3)
  const trendingRepos = ELICHARLESE_REPO_CARDS
    .sort((a, b) => b.estimatedValue - a.estimatedValue)
    .slice(0, 6)

  const handleBattle = (repoId: string) => {
    const repo = ELICHARLESE_REPO_CARDS.find(r => r.id === repoId)
    toast.success(`⚔️ ${repo?.displayName} enters the battle arena!`, {
      duration: 3000,
      style: {
        background: 'rgba(39, 40, 34, 0.9)',
        color: '#F8EFD6',
        border: '1px solid #F92672'
      }
    })
  }

  const handleBid = (repoId: string) => {
    const repo = ELICHARLESE_REPO_CARDS.find(r => r.id === repoId)
    toast.success(`💰 Bidding war started for ${repo?.displayName}!`, {
      duration: 3000,
      style: {
        background: 'rgba(39, 40, 34, 0.9)',
        color: '#F8EFD6',
        border: '1px solid #66D9EF'
      }
    })
  }

  const handleBet = (repoId: string) => {
    const repo = ELICHARLESE_REPO_CARDS.find(r => r.id === repoId)
    toast.success(`🎲 Placing your bet on ${repo?.displayName}!`, {
      duration: 3000,
      style: {
        background: 'rgba(39, 40, 34, 0.9)',
        color: '#F8EFD6',
        border: '1px solid #A6E22E'
      }
    })
  }

  const handleView = (repoId: string) => {
    const repo = ELICHARLESE_REPO_CARDS.find(r => r.id === repoId)
    if (repo) {
      window.open(repo.githubUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-monokai-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-monokai-info/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-monokai-success/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-monokai-accent via-monokai-info to-monokai-success bg-clip-text text-transparent text-shadow-strong">
            Discover Arena
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Battle, bid, and bet on the most innovative GitHub repositories. 
            Discover legendary codebases and rare development gems in our trading card universe.
          </p>
        </motion.div>

        {/* Quick Stats removed */}

        {/* Main Content Tabs (header removed) */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">

          {/* All Cards */}
          <TabsContent value="all">
            <RepositoryCollection
              title="Complete Repository Collection"
              subtitle="Explore all 48 GitHub repository trading cards with advanced filtering and search"
              showSearch={true}
              showFilters={true}
              showStats={true}
              defaultCategory="all"
              variant="grid"
              cardSize="default"
              onBattle={handleBattle}
              onBid={handleBid}
              onBet={handleBet}
              onView={handleView}
            />
          </TabsContent>

          {/* Trending Cards */}
          <TabsContent value="trending">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2 text-shadow-soft">🔥 Trending Repositories</h2>
                <p className="text-muted-foreground">The most valuable and sought-after repository cards right now</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingRepos.map((repo, index) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <RepositoryCard
                      repository={repo}
                      variant="default"
                      onBattle={handleBattle}
                      onBid={handleBid}
                      onBet={handleBet}
                      onView={handleView}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Majors Category */}
          <TabsContent value="majors">
            <RepositoryCollection
              title="👑 Major League Repositories"
              subtitle="Enterprise-grade, complex systems that power the modern web"
              showSearch={true}
              showFilters={true}
              showStats={true}
              defaultCategory="majors"
              variant="grid"
              cardSize="detailed"
              onBattle={handleBattle}
              onBid={handleBid}
              onBet={handleBet}
              onView={handleView}
            />
          </TabsContent>

          {/* Minors Category */}
          <TabsContent value="minors">
            <RepositoryCollection
              title="⭐ Minor League Gems"
              subtitle="Specialized tools and libraries that enhance development workflows"
              showSearch={true}
              showFilters={true}
              showStats={true}
              defaultCategory="minors"
              variant="grid"
              cardSize="default"
              onBattle={handleBattle}
              onBid={handleBid}
              onBet={handleBet}
              onView={handleView}
            />
          </TabsContent>

          {/* MVPs Category */}
          <TabsContent value="mvps">
            <RepositoryCollection
              title="🚀 MVP Prototypes"
              subtitle="Rapid prototypes and proof-of-concept implementations"
              showSearch={true}
              showFilters={true}
              showStats={true}
              defaultCategory="mvps"
              variant="grid"
              cardSize="compact"
              onBattle={handleBattle}
              onBid={handleBid}
              onBet={handleBet}
              onView={handleView}
            />
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16 glass-card p-8 shadow-card-ece"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-shadow-soft">Ready to Start Trading?</h3>
          <p className="text-muted-foreground mb-6">
            Build your collection, battle other traders, and discover the next big thing in tech
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              variant="default" 
              size="lg" 
              className="shadow-soft hover:shadow-soft-lg"
              onClick={() => toast.success('Welcome to the marketplace! 🎉', {
                duration: 3000,
                style: {
                  background: 'rgba(39, 40, 34, 0.9)',
                  color: '#F8EFD6',
                  border: '1px solid #66D9EF'
                }
              })}
            >
              <Trophy className="h-5 w-5 mr-2" />
              Go to Marketplace
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="shadow-soft hover:shadow-soft-lg"
              onClick={() => toast.success('Battle arena loading! ⚔️', {
                duration: 3000,
                style: {
                  background: 'rgba(39, 40, 34, 0.9)',
                  color: '#F8EFD6',
                  border: '1px solid #F92672'
                }
              })}
            >
              <Target className="h-5 w-5 mr-2" />
              Enter Battle Arena
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
