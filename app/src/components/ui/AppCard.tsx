'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AppCard as AppCardType } from '@/types/profile';
import { 
  Star, 
  GitFork, 
  ExternalLink, 
  Github, 
  Calendar,
  Tag,
  Zap,
  Globe,
  Book,
  Play
} from 'lucide-react';

interface AppCardProps {
  appCard: AppCardType;
  featured?: boolean;
  onClick?: () => void;
}

const statusColors = {
  active: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
  production: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
  demo: 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30',
  archived: 'from-gray-500/20 to-slate-500/20 border-gray-400/30'
};

const categoryIcons = {
  'web-app': Globe,
  'mobile-app': Zap,
  game: Play,
  api: Book,
  library: Book,
  tool: Zap,
  other: Tag
};

export const AppCard: React.FC<AppCardProps> = ({ 
  appCard, 
  featured = false, 
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const CategoryIcon = categoryIcons[appCard.category];
  const statusColorClass = statusColors[appCard.status];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const shimmerAnimation = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 3
    }
  };

  return (
    <motion.div
      className={`relative group cursor-pointer ${featured ? 'md:col-span-2' : ''}`}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      layout
    >
      {/* Shimmer Effect for Featured Cards */}
      {featured && (
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            {...shimmerAnimation}
          />
        </div>
      )}

      {/* Main Card */}
      <div className={`
        relative h-full bg-gradient-to-br ${statusColorClass} 
        backdrop-blur-md border rounded-lg overflow-hidden
        transition-all duration-300 ease-out
        ${isHovered ? 'shadow-2xl shadow-black/20' : 'shadow-lg shadow-black/10'}
        ${featured ? 'ring-2 ring-[#F92672]/30' : ''}
      `}>
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            bg-gradient-to-r ${statusColorClass} backdrop-blur-sm
            border border-white/20
          `}>
            {appCard.status}
          </div>
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3 z-10">
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#F92672]/90 to-[#FD5C63]/90 text-white border border-white/20 backdrop-blur-sm">
              ✨ Featured
            </div>
          </div>
        )}

        {/* App Image */}
        <div className="relative h-48 bg-gradient-to-br from-[#272822] to-[#75715E] overflow-hidden">
          {!imageError && appCard.imageUrl ? (
            <Image
              src={appCard.imageUrl}
              alt={appCard.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CategoryIcon className="w-16 h-16 text-[#66D9EF]/60" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Quick Links */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-3 left-3 flex gap-2"
              >
                <Link
                  href={appCard.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-4 h-4 text-white" />
                </Link>
                
                {appCard.links?.live && (
                  <Link
                    href={appCard.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CategoryIcon className="w-5 h-5 text-[#66D9EF]" />
              <h3 className="text-lg font-semibold text-white truncate">
                {appCard.name}
              </h3>
            </div>
            
            <p className="text-sm text-[#F8EFD6]/80 line-clamp-2">
              {appCard.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-[#75715E]">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{appCard.stats.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              <span>{appCard.stats.forks}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(appCard.stats.lastUpdated)}</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1">
            {appCard.techStack.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-[#A6E22E]/10 text-[#A6E22E] border border-[#A6E22E]/20"
              >
                {tech}
              </span>
            ))}
            {appCard.techStack.length > 4 && (
              <span className="px-2 py-1 text-xs rounded-full bg-[#66D9EF]/10 text-[#66D9EF] border border-[#66D9EF]/20">
                +{appCard.techStack.length - 4}
              </span>
            )}
          </div>

          {/* Tags */}
          {appCard.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-white/10">
              {appCard.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-[#E6DB74]/10 text-[#E6DB74] border border-[#E6DB74]/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#F92672]/5 to-[#66D9EF]/5 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AppCard;
