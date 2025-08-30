'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { GitHubMCPClient } from '@/lib/mcp/github-client'
import { 
  Github, 
  Search, 
  Star, 
  GitFork, 
  Calendar, 
  Code, 
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Filter,
  SortDesc
} from 'lucide-react'

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  size: number
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  topics: string[]
  license: {
    key: string
    name: string
  } | null
  owner: {
    login: string
    avatar_url: string
    type: string
  }
}

interface GitHubRepoSelectorProps {
  onRepositorySelect: (repo: Repository) => void
  onUrlImport?: (url: string) => void
  selectedRepository?: Repository | null
  githubToken?: string
}

const CARD_TIER_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600', 
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
  mythic: 'from-red-400 to-pink-600'
}

const CATEGORY_ICONS = {
  web: '🌐',
  mobile: '📱',
  desktop: '💻',
  api: '🔌',
  library: '📚',
  other: '🔧'
}

export const GitHubRepoSelector: React.FC<GitHubRepoSelectorProps> = ({
  onRepositorySelect,
  onUrlImport,
  selectedRepository,
  githubToken
}) => {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [importUrl, setImportUrl] = useState('')
  const [importLoading, setImportLoading] = useState(false)
  const [filterLanguage, setFilterLanguage] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'name'>('stars')
  const [user, setUser] = useState<any>(null)
  const [mcpClient] = useState(() => new GitHubMCPClient({ githubToken }))

  useEffect(() => {
    if (githubToken) {
      loadUserRepositories()
    }
  }, [githubToken])

  useEffect(() => {
    filterAndSortRepositories()
  }, [repositories, searchTerm, filterLanguage, sortBy])

  const loadUserRepositories = async () => {
    if (!githubToken) return

    setLoading(true)
    try {
      const authenticatedUser = await mcpClient.authenticateUser(githubToken)
      setUser(authenticatedUser)
      
      const repos = await mcpClient.getUserRepositories()
      setRepositories(repos)
    } catch (error) {
      console.error('Failed to load repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortRepositories = () => {
    let filtered = repositories.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (repo.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLanguage = filterLanguage === 'all' || repo.language === filterLanguage
      return matchesSearch && matchesLanguage
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredRepos(filtered)
  }

  const handleRepositorySelect = async (repo: Repository) => {
    setAnalyzing(repo.id.toString())
    try {
      // Add a small delay to show analysis state
      await new Promise(resolve => setTimeout(resolve, 1000))
      onRepositorySelect(repo)
    } finally {
      setAnalyzing(null)
    }
  }

  const handleUrlImport = async () => {
    if (!importUrl.trim() || !onUrlImport) return

    setImportLoading(true)
    try {
      const urlData = await mcpClient.validateRepositoryUrl(importUrl)
      if (urlData) {
        const repo = await mcpClient.getRepository(urlData.owner, urlData.repo)
        onRepositorySelect(repo)
        setImportUrl('')
      } else {
        throw new Error('Invalid repository URL')
      }
    } catch (error) {
      console.error('Failed to import repository:', error)
      // You might want to show an error toast here
    } finally {
      setImportLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getLanguages = (): string[] => {
    const languages = repositories
      .map(repo => repo.language)
      .filter((lang): lang is string => typeof lang === 'string' && lang.length > 0)
    return Array.from(new Set(languages)).sort()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5 drop-shadow-icon" />
            GitHub Repository Selector
          </CardTitle>
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img 
                src={user.avatar_url} 
                alt={user.login}
                className="w-6 h-6 rounded-full"
              />
              <span>Connected as {user.login}</span>
              <Badge variant="outline" className="text-xs">
                {repositories.length} repositories
              </Badge>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Import by URL */}
      <Card className="glass-card shadow-soft">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Import Repository by URL</h3>
            <div className="flex gap-2">
              <Input
                placeholder="https://github.com/owner/repository"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="shadow-soft focus:shadow-soft-lg"
              />
              <Button
                onClick={handleUrlImport}
                disabled={!importUrl.trim() || importLoading}
                className="shadow-soft hover:shadow-soft-lg"
              >
                {importLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      {repositories.length > 0 && (
        <Card className="glass-card shadow-soft">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 shadow-soft focus:shadow-soft-lg"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg shadow-soft focus:shadow-soft-lg"
                >
                  <option value="all">All Languages</option>
                  {getLanguages().map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'stars' | 'updated' | 'name')}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg shadow-soft focus:shadow-soft-lg"
                >
                  <option value="stars">Sort by Stars</option>
                  <option value="updated">Sort by Updated</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Repository List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="glass-card shadow-soft">
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading repositories...</p>
            </CardContent>
          </Card>
        ) : filteredRepos.length === 0 && repositories.length > 0 ? (
          <Card className="glass-card shadow-soft">
            <CardContent className="py-12 text-center">
              <Search className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No repositories match your search criteria</p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredRepos.map((repo) => (
              <motion.div
                key={repo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className={`glass-card shadow-soft hover:shadow-soft-lg cursor-pointer transition-all duration-300 ${
                    selectedRepository?.id === repo.id ? 'ring-2 ring-accent' : ''
                  }`}
                  onClick={() => handleRepositorySelect(repo)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {repo.name}
                          </h3>
                          {analyzing === repo.id.toString() && (
                            <Loader2 className="h-4 w-4 animate-spin text-accent" />
                          )}
                          {selectedRepository?.id === repo.id && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        
                        {repo.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {repo.language && (
                            <Badge variant="outline" className="text-xs">
                              <Code className="h-3 w-3 mr-1" />
                              {repo.language}
                            </Badge>
                          )}
                          {repo.topics.slice(0, 3).map(topic => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {repo.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{repo.topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            <span>{repo.forks_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Updated {formatDate(repo.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 text-right">
                        <Button
                          variant="ghost"
                         
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(repo.html_url, '_blank')
                          }}
                          className="shadow-soft hover:shadow-soft-lg"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* No GitHub Token State */}
      {!githubToken && (
        <Card className="glass-card shadow-soft">
          <CardContent className="py-12 text-center">
            <Github className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Connect GitHub Account</h3>
            <p className="text-muted-foreground mb-4">
              Connect your GitHub account to browse and select your repositories
            </p>
            <Button className="shadow-soft hover:shadow-soft-lg">
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
