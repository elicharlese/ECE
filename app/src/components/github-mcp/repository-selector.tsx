'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, GitFork, Clock, ExternalLink, Code, Zap, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { githubMCP, GitHubRepository, RepositoryAnalysis } from './github-mcp-client'

interface RepositorySelectorProps {
  onRepositorySelect: (repository: GitHubRepository, analysis: RepositoryAnalysis) => void
  onClose?: () => void
  preselectedUrl?: string
}

export const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  onRepositorySelect,
  onClose,
  preselectedUrl
}) => {
  const [searchQuery, setSearchQuery] = useState(preselectedUrl || '')
  const [repositories, setRepositories] = useState<GitHubRepository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null)
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [searchType, setSearchType] = useState<'url' | 'search' | 'user'>('url')

  useEffect(() => {
    if (preselectedUrl) {
      handleUrlSearch(preselectedUrl)
    }
  }, [preselectedUrl])

  const handleUrlSearch = async (url: string) => {
    if (!url.trim()) return

    setLoading(true)
    try {
      const repository = await githubMCP.fetchRepository(url)
      if (repository) {
        setRepositories([repository])
        setSelectedRepo(repository)
        await analyzeRepository(repository)
      } else {
        setRepositories([])
        setSelectedRepo(null)
        setAnalysis(null)
      }
    } catch (error) {
      console.error('Error fetching repository:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchRepositories = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const results = await githubMCP.searchRepositories(query, {
        sort: 'stars',
        order: 'desc',
        per_page: 10
      })
      setRepositories(results)
    } catch (error) {
      console.error('Error searching repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserRepositories = async (username: string) => {
    if (!username.trim()) return

    setLoading(true)
    try {
      const results = await githubMCP.getUserRepositories(username)
      setRepositories(results)
    } catch (error) {
      console.error('Error fetching user repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeRepository = async (repository: GitHubRepository) => {
    setAnalyzing(true)
    try {
      const repoAnalysis = await githubMCP.analyzeRepository(repository)
      setAnalysis(repoAnalysis)
    } catch (error) {
      console.error('Error analyzing repository:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleRepositoryClick = async (repository: GitHubRepository) => {
    setSelectedRepo(repository)
    await analyzeRepository(repository)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchType === 'url') {
      handleUrlSearch(searchQuery)
    } else if (searchType === 'search') {
      handleSearchRepositories(searchQuery)
    } else if (searchType === 'user') {
      handleUserRepositories(searchQuery)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-500'
      case 'moderate': return 'text-yellow-500'
      case 'complex': return 'text-orange-500'
      case 'enterprise': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getComplexityBadgeVariant = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'moderate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'complex': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'enterprise': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-monokai-accent to-monokai-purple bg-clip-text text-transparent mb-2">
          🔍 Repository Selector
        </h2>
        <p className="text-muted-foreground">
          Import a GitHub repository to generate your app
        </p>
      </div>

      {/* Search Form */}
      <Card className="glass-card shadow-card-ece">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Repository
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Search Type Tabs */}
            <div className="flex gap-2">
              {[
                { key: 'url', label: '🔗 Repository URL', placeholder: 'https://github.com/owner/repo' },
                { key: 'search', label: '🔍 Search Repos', placeholder: 'Search repositories...' },
                { key: 'user', label: '👤 User Repos', placeholder: 'Username' }
              ].map((type) => (
                <Button
                  key={type.key}
                  type="button"
                  variant={searchType === type.key ? 'default' : 'outline'}
                 
                  onClick={() => setSearchType(type.key as any)}
                  className="shadow-soft hover:shadow-soft-lg"
                >
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === 'url' ? 'https://github.com/owner/repo' :
                  searchType === 'search' ? 'Search repositories...' :
                  'Username'
                }
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent shadow-soft"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="shadow-soft hover:shadow-soft-lg"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Repository Results */}
      {repositories.length > 0 && (
        <Card className="glass-card shadow-card-ece">
          <CardHeader>
            <CardTitle>📚 Repository Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repositories.map((repo) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer shadow-soft hover:shadow-soft-lg ${
                    selectedRepo?.id === repo.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => handleRepositoryClick(repo)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-monokai-accent to-monokai-purple flex items-center justify-center">
                      <Code className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {repo.owner.login}
                      </p>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {repo.forks_count}
                        </span>
                        {repo.language && (
                          <Badge variant="outline" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ExternalLink
                      className="h-4 w-4 text-muted-foreground hover:text-accent cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(repo.html_url, '_blank')
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Repository Analysis */}
      <AnimatePresence>
        {selectedRepo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-card shadow-card-ece">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Repository Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyzing ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full"
                    />
                    <span className="ml-3 text-muted-foreground">Analyzing repository...</span>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    {/* Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-background/50 shadow-soft">
                        <div className={`text-2xl font-bold ${getComplexityColor(analysis.complexity)}`}>
                          {analysis.complexity.toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">Complexity</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-background/50 shadow-soft">
                        <div className="text-2xl font-bold text-monokai-success">
                          ${analysis.estimatedCost}
                        </div>
                        <div className="text-sm text-muted-foreground">Estimated Cost</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-background/50 shadow-soft">
                        <div className="text-2xl font-bold text-monokai-info">
                          {analysis.developmentTime}
                        </div>
                        <div className="text-sm text-muted-foreground">Development Time</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-background/50 shadow-soft">
                        <div className="text-2xl font-bold text-monokai-warning">
                          {analysis.techStack.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Technologies</div>
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h4 className="font-semibold mb-3">🛠️ Technology Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.frameworks.map((framework, index) => (
                          <Badge key={index} className="shadow-soft">
                            {framework}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-3">✨ Detected Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {analysis.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-monokai-success" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold mb-3">📋 Requirements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {analysis.requirements.map((requirement, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-monokai-accent rounded-full" />
                            {requirement}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deployment Options */}
                    <div>
                      <h4 className="font-semibold mb-3">🚀 Deployment Options</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.deploymentOptions.map((option, index) => (
                          <Badge key={index} variant="outline" className="shadow-soft">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-border">
                      <Button
                        onClick={() => analysis && onRepositorySelect(selectedRepo, analysis)}
                        className="flex-1 bg-gradient-to-r from-monokai-accent to-monokai-purple shadow-soft hover:shadow-soft-lg"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Use This Repository
                      </Button>
                      {onClose && (
                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="shadow-soft hover:shadow-soft-lg"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a repository to view analysis
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
