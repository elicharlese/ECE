'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppCard as AppCardType } from '@/types/profile';
import AppCard from './AppCard';
import { 
  Grid, 
  List, 
  Filter, 
  Search,
  SortAsc,
  Star,
  GitFork,
  Calendar,
  Zap
} from 'lucide-react';

interface AppCardGridProps {
  appCards: AppCardType[];
  title?: string;
  showFilters?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
  onCardClick?: (appCard: AppCardType) => void;
}

type SortOption = 'name' | 'stars' | 'forks' | 'updated' | 'status';
type ViewMode = 'grid' | 'list';

const categoryFilters = [
  { value: 'all', label: 'All Apps' },
  { value: 'web-app', label: 'Web Apps' },
  { value: 'mobile-app', label: 'Mobile Apps' },
  { value: 'game', label: 'Games' },
  { value: 'api', label: 'APIs' },
  { value: 'library', label: 'Libraries' },
  { value: 'tool', label: 'Tools' },
  { value: 'other', label: 'Other' }
];

const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'production', label: 'Production' },
  { value: 'demo', label: 'Demo' },
  { value: 'archived', label: 'Archived' }
];

const sortOptions: { value: SortOption; label: string; icon: React.ComponentType<any> }[] = [
  { value: 'name', label: 'Name', icon: SortAsc },
  { value: 'stars', label: 'Stars', icon: Star },
  { value: 'forks', label: 'Forks', icon: GitFork },
  { value: 'updated', label: 'Updated', icon: Calendar },
  { value: 'status', label: 'Status', icon: Zap }
];

export const AppCardGrid: React.FC<AppCardGridProps> = ({
  appCards,
  title = "App Portfolio",
  showFilters = true,
  gridCols = 3,
  onCardClick
}) => {
  const [filteredCards, setFilteredCards] = useState<AppCardType[]>(appCards);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  // Filter and sort cards
  useEffect(() => {
    let filtered = [...appCards];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(card => card.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(card => card.status === statusFilter);
    }

    // Featured filter
    if (showOnlyFeatured) {
      filtered = filtered.filter(card => card.featured);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stars':
          return b.stats.stars - a.stats.stars;
        case 'forks':
          return b.stats.forks - a.stats.forks;
        case 'updated':
          return new Date(b.stats.lastUpdated).getTime() - new Date(a.stats.lastUpdated).getTime();
        case 'status':
          const statusOrder = { active: 0, production: 1, demo: 2, archived: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    setFilteredCards(filtered);
  }, [appCards, searchTerm, categoryFilter, statusFilter, sortBy, showOnlyFeatured]);

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-[#75715E]">
            {filteredCards.length} {filteredCards.length === 1 ? 'app' : 'apps'}
            {appCards.length !== filteredCards.length && ` of ${appCards.length} total`}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-[#F92672]/20 text-[#F92672] border border-[#F92672]/30' 
                : 'bg-white/5 text-[#75715E] border border-white/10 hover:bg-white/10'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-[#F92672]/20 text-[#F92672] border border-[#F92672]/30' 
                : 'bg-white/5 text-[#75715E] border border-white/10 hover:bg-white/10'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#75715E]" />
            <input
              type="text"
              placeholder="Search apps, tech stack, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#75715E] focus:outline-none focus:ring-2 focus:ring-[#F92672]/50 focus:border-[#F92672]/50 transition-all"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F92672]/50 focus:border-[#F92672]/50 transition-all"
            >
              {categoryFilters.map(option => (
                <option key={option.value} value={option.value} className="bg-[#272822]">
                  {option.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F92672]/50 focus:border-[#F92672]/50 transition-all"
            >
              {statusFilters.map(option => (
                <option key={option.value} value={option.value} className="bg-[#272822]">
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F92672]/50 focus:border-[#F92672]/50 transition-all"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-[#272822]">
                  Sort by {option.label}
                </option>
              ))}
            </select>

            {/* Featured Toggle */}
            <label className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={showOnlyFeatured}
                onChange={(e) => setShowOnlyFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-[#F92672]"
              />
              <span className="text-sm text-white">Featured only</span>
            </label>
          </div>
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#75715E]/20 flex items-center justify-center">
              <Search className="w-8 h-8 text-[#75715E]" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No apps found</h3>
            <p className="text-[#75715E]">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              ${viewMode === 'grid' 
                ? `grid ${gridColsClass[gridCols]} gap-6` 
                : 'space-y-4'
              }
            `}
          >
            {filteredCards.map((appCard, index) => (
              <motion.div
                key={appCard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AppCard
                  appCard={appCard}
                  featured={appCard.featured}
                  onClick={() => onCardClick?.(appCard)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppCardGrid;
