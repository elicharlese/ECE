'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  GitBranch, 
  Star, 
  Eye, 
  Download,
  ExternalLink,
  Search,
  Loader2
} from 'lucide-react';
import { OrderData } from '../OrderWizard';

interface RepositoryStepProps {
  data: OrderData;
  onUpdate: (data: Partial<OrderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  size: number;
  lastUpdated: string;
  isPrivate: boolean;
  topics: string[];
}

// Mock repository data (in real app, this would come from GitHub API)
const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'trading-dashboard',
    fullName: 'user/trading-dashboard',
    description: 'A comprehensive trading dashboard with real-time data visualization',
    url: 'https://github.com/user/trading-dashboard',
    language: 'TypeScript',
    stars: 234,
    forks: 45,
    size: 1240,
    lastUpdated: '2 days ago',
    isPrivate: false,
    topics: ['trading', 'dashboard', 'react', 'typescript']
  },
  {
    id: '2',
    name: 'mobile-wallet',
    fullName: 'user/mobile-wallet',
    description: 'Secure mobile wallet application for cryptocurrency management',
    url: 'https://github.com/user/mobile-wallet',
    language: 'React Native',
    stars: 156,
    forks: 23,
    size: 890,
    lastUpdated: '5 days ago',
    isPrivate: true,
    topics: ['mobile', 'wallet', 'crypto', 'react-native']
  },
  {
    id: '3',
    name: 'api-server',
    fullName: 'user/api-server',
    description: 'RESTful API server with authentication and rate limiting',
    url: 'https://github.com/user/api-server',
    language: 'Node.js',
    stars: 89,
    forks: 12,
    size: 456,
    lastUpdated: '1 week ago',
    isPrivate: false,
    topics: ['api', 'nodejs', 'express', 'authentication']
  }
];

export function RepositoryStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isLoading,
  setIsLoading
}: RepositoryStepProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Simulate loading repositories
    setIsLoading(true);
    setTimeout(() => {
      setRepositories(mockRepositories);
      setIsLoading(false);
    }, 1000);
  }, [setIsLoading]);

  useEffect(() => {
    if (data.repository) {
      const repo = repositories.find(r => r.url === data.repository?.url);
      setSelectedRepo(repo || null);
    }
  }, [data.repository, repositories]);

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepo(repo);
    onUpdate({
      repository: {
        url: repo.url,
        provider: 'github',
        name: repo.name,
        description: repo.description,
        language: repo.language
      }
    });
  };

  const handleUrlConnect = async () => {
    if (!repoUrl) return;

    setIsConnecting(true);
    // Simulate API call to validate and fetch repository info
    setTimeout(() => {
      const repoName = repoUrl.split('/').pop() || 'repository';
      const mockRepo: Repository = {
        id: 'custom',
        name: repoName,
        fullName: `user/${repoName}`,
        description: 'Repository connected via URL',
        url: repoUrl,
        language: 'JavaScript',
        stars: 0,
        forks: 0,
        size: 0,
        lastUpdated: 'now',
        isPrivate: false,
        topics: []
      };
      
      setSelectedRepo(mockRepo);
      onUpdate({
        repository: {
          url: mockRepo.url,
          provider: 'github',
          name: mockRepo.name,
          description: mockRepo.description,
          language: mockRepo.language
        }
      });
      setIsConnecting(false);
    }, 2000);
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'TypeScript': '#3178c6',
      'JavaScript': '#f1e05a',
      'React Native': '#61dafb',
      'Node.js': '#68a063',
      'Python': '#3572A5',
      'Java': '#b07219',
      'Go': '#00ADD8'
    };
    return colors[language] || '#75715E';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Github size={24} className="text-[#66D9EF]" />
            <h2 className="text-2xl font-bold text-[#F8EFD6]">
              Connect Your Repository
            </h2>
          </div>
          <p className="text-[#75715E]">
            Choose a repository to transform into a professional application, or connect one manually.
          </p>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repository Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-4">
              Your Repositories
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75715E]" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#272822] border border-[#75715E] rounded-lg text-[#F8EFD6] placeholder-[#75715E] focus:border-[#F92672] outline-none"
              />
            </div>

            {/* Repository List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-[#66D9EF]" />
                  <span className="ml-2 text-[#75715E]">Loading repositories...</span>
                </div>
              ) : filteredRepositories.length === 0 ? (
                <div className="text-center py-8 text-[#75715E]">
                  No repositories found
                </div>
              ) : (
                filteredRepositories.map((repo) => (
                  <motion.div
                    key={repo.id}
                    whileHover={{ scale: 1.02 }}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all duration-200
                      ${selectedRepo?.id === repo.id
                        ? 'border-[#F92672] bg-[#F92672]/10'
                        : 'border-[#75715E] hover:border-[#66D9EF] hover:bg-[#66D9EF]/5'
                      }
                    `}
                    onClick={() => handleRepoSelect(repo)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-[#F8EFD6] font-medium flex items-center gap-2">
                          {repo.name}
                          {repo.isPrivate && (
                            <Badge variant="outline" className="text-xs border-[#75715E] text-[#75715E]">
                              Private
                            </Badge>
                          )}
                        </h4>
                        <p className="text-[#75715E] text-sm">{repo.fullName}</p>
                      </div>
                      <ExternalLink size={16} className="text-[#75715E]" />
                    </div>
                    
                    <p className="text-[#F8EFD6] text-sm mb-3">
                      {repo.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-[#75715E]">
                        <div className="flex items-center gap-1">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          {repo.language}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={12} />
                          {repo.stars}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitBranch size={12} />
                          {repo.forks}
                        </div>
                      </div>
                      <span className="text-xs text-[#75715E]">
                        Updated {repo.lastUpdated}
                      </span>
                    </div>

                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="text-xs border-[#75715E] text-[#75715E]"
                          >
                            {topic}
                          </Badge>
                        ))}
                        {repo.topics.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-[#75715E] text-[#75715E]"
                          >
                            +{repo.topics.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Manual URL Connection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-4">
              Connect by URL
            </h3>
            <p className="text-[#75715E] text-sm mb-4">
              Enter a repository URL to connect manually
            </p>

            <div className="space-y-4">
              <input
                type="url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full px-4 py-2 bg-[#272822] border border-[#75715E] rounded-lg text-[#F8EFD6] placeholder-[#75715E] focus:border-[#F92672] outline-none"
              />
              
              <Button
                onClick={handleUrlConnect}
                disabled={!repoUrl || isConnecting}
                className="w-full"
                variant="outline"
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Github size={16} className="mr-2" />
                    Connect Repository
                  </>
                )}
              </Button>
            </div>
          </GlassCard>

          {/* Selected Repository Preview */}
          {selectedRepo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-[#F8EFD6] mb-4">
                  Selected Repository
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Github size={16} className="text-[#66D9EF]" />
                    <span className="text-[#F8EFD6] font-medium">{selectedRepo.name}</span>
                    <Badge 
                      variant="outline" 
                      className="border-[#A6E22E] text-[#A6E22E]"
                    >
                      Connected
                    </Badge>
                  </div>
                  
                  <p className="text-[#75715E] text-sm">
                    {selectedRepo.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-[#75715E]">
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getLanguageColor(selectedRepo.language) }}
                      />
                      {selectedRepo.language}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={12} />
                      {selectedRepo.size} KB
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      Public
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(selectedRepo.url, '_blank')}
                    className="text-[#66D9EF] hover:text-[#F8EFD6]"
                  >
                    <ExternalLink size={14} className="mr-2" />
                    View on GitHub
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
