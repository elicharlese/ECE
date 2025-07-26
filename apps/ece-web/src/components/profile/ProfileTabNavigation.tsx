'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Star, 
  Activity, 
  Trophy, 
  Settings,
  ChevronDown,
  Menu,
  X,
  Wallet,
  Heart,
  Eye,
  Gavel,
  TrendingUp,
  Sword,
  Target,
  Zap
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

interface ProfileTab {
  id: string
  label: string
  icon: React.ComponentType<any>
  badge?: number
  description: string
}

interface ProfileTabNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function ProfileTabNavigation({ 
  activeTab, 
  onTabChange, 
  className = '' 
}: ProfileTabNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const tabs: ProfileTab[] = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: User,
      description: 'Profile summary and quick stats'
    },
    { 
      id: 'collection', 
      label: 'Collection', 
      icon: Star,
      badge: 247,
      description: 'Card collection and tier progress'
    },
    { 
      id: 'activity', 
      label: 'Activity', 
      icon: Activity,
      badge: 12,
      description: 'Recent trades and interactions'
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: Trophy,
      badge: 28,
      description: 'Badges and milestones'
    },
    { 
      id: 'performance', 
      label: 'Performance', 
      icon: Wallet,
      description: 'ECE balance and performance tracking'
    },
    { 
      id: 'wishlist', 
      label: 'Wishlist', 
      icon: Heart,
      badge: 15,
      description: 'Wanted cards and price alerts'
    },
    { 
      id: '3d-viewer', 
      label: '3D Viewer', 
      icon: Eye,
      description: 'Interactive 3D card viewing'
    },
    { 
      id: 'trading', 
      label: 'Trading', 
      icon: Target,
      description: 'Trading controls and automation'
    },
    { 
      id: 'battles', 
      label: 'Battles', 
      icon: Sword,
      badge: 3,
      description: 'Card battles and tournaments'
    },
    { 
      id: 'betting', 
      label: 'Betting', 
      icon: TrendingUp,
      badge: 8,
      description: 'Market predictions and bets'
    },
    { 
      id: 'auctions', 
      label: 'Auctions', 
      icon: Gavel,
      badge: 5,
      description: 'Card auctions and bidding'
    },
    { 
      id: 'powerups', 
      label: 'Powerups', 
      icon: Zap,
      badge: 12,
      description: 'Card enhancement powerups'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      description: 'Profile and privacy settings'
    }
  ]

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId)
    setIsMobileMenuOpen(false)
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div className={className}>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard variant="dark" className="p-2">
            <div className="flex space-x-1">
              {tabs.map((tab, index) => {
                const IconComponent = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleTabSelect(tab.id)}
                    className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 flex-1 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 text-[#F8EFD6] border border-[#A6E22E]/30'
                        : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/30'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#A6E22E]' : ''}`} />
                    <span className="font-medium">{tab.label}</span>
                    
                    {tab.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isActive 
                          ? 'bg-[#A6E22E] text-[#272822]' 
                          : 'bg-[#75715E]/30 text-[#75715E]'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-[#A6E22E]/10 to-[#66D9EF]/10 rounded-lg border border-[#A6E22E]/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard variant="dark" className="p-4">
            {/* Mobile Tab Selector */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                {activeTabData && (
                  <>
                    <activeTabData.icon className="w-5 h-5 text-[#A6E22E]" />
                    <div>
                      <div className="font-medium text-[#F8EFD6]">{activeTabData.label}</div>
                      <div className="text-sm text-[#75715E]">{activeTabData.description}</div>
                    </div>
                    {activeTabData.badge && (
                      <span className="text-xs px-2 py-1 rounded-full bg-[#A6E22E] text-[#272822]">
                        {activeTabData.badge}
                      </span>
                    )}
                  </>
                )}
              </div>
              
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-[#75715E]" />
              </motion.div>
            </button>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-[#75715E]/30"
                >
                  <div className="space-y-2">
                    {tabs.map((tab, index) => {
                      const IconComponent = tab.icon
                      const isActive = activeTab === tab.id
                      
                      return (
                        <motion.button
                          key={tab.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleTabSelect(tab.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 text-[#F8EFD6] border border-[#A6E22E]/30'
                              : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/30'
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#A6E22E]' : ''}`} />
                          <div className="flex-grow text-left">
                            <div className="font-medium">{tab.label}</div>
                            <div className="text-sm opacity-75">{tab.description}</div>
                          </div>
                          
                          {tab.badge && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isActive 
                                ? 'bg-[#A6E22E] text-[#272822]' 
                                : 'bg-[#75715E]/30 text-[#75715E]'
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>

      {/* Tab Description (Desktop Only) */}
      <div className="hidden md:block mt-4">
        {activeTabData && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-[#75715E] text-sm">{activeTabData.description}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Loading skeleton component for responsive design
export function ProfileTabSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="hidden md:block">
        <GlassCard variant="dark" className="p-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 px-4 py-3 rounded-lg bg-[#272822]/30 animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-[#75715E]/30 rounded" />
                  <div className="w-16 h-4 bg-[#75715E]/30 rounded" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      
      <div className="md:hidden">
        <GlassCard variant="dark" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-[#75715E]/30 rounded animate-pulse" />
              <div>
                <div className="w-20 h-4 bg-[#75715E]/30 rounded mb-1 animate-pulse" />
                <div className="w-32 h-3 bg-[#75715E]/30 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-5 h-5 bg-[#75715E]/30 rounded animate-pulse" />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

// Error boundary component for tab navigation
export function ProfileTabError({ 
  onRetry, 
  className = '' 
}: { 
  onRetry: () => void
  className?: string 
}) {
  return (
    <div className={className}>
      <GlassCard variant="dark" className="p-6 text-center">
        <div className="text-[#F92672] mb-4">
          <X className="w-12 h-12 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Navigation Error</h3>
          <p className="text-sm text-[#75715E] mt-1">
            Failed to load profile navigation
          </p>
        </div>
        
        <Button
          variant="accent"
         
          onClick={onRetry}
        >
          Try Again
        </Button>
      </GlassCard>
    </div>
  )
}
