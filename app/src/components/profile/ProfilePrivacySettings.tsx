'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Users, 
  Globe, 
  Lock,
  Settings,
  Info,
  Check,
  X
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

interface PrivacySetting {
  id: string
  title: string
  description: string
  category: 'profile' | 'collection' | 'activity' | 'trading'
  isEnabled: boolean
  level: 'public' | 'friends' | 'private'
  icon: React.ComponentType<any>
}

interface ProfilePrivacySettingsProps {
  className?: string
}

export function ProfilePrivacySettings({ className = '' }: ProfilePrivacySettingsProps) {
  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: 'profile-visibility',
      title: 'Profile Visibility',
      description: 'Control who can view your profile page',
      category: 'profile',
      isEnabled: true,
      level: 'public',
      icon: Globe
    },
    {
      id: 'collection-visibility',
      title: 'Collection Visibility',
      description: 'Show your card collection to other users',
      category: 'collection',
      isEnabled: true,
      level: 'friends',
      icon: Eye
    },
    {
      id: 'statistics-visibility',
      title: 'Statistics Visibility',
      description: 'Display your trading stats and performance metrics',
      category: 'profile',
      isEnabled: false,
      level: 'private',
      icon: Shield
    },
    {
      id: 'activity-feed',
      title: 'Activity Feed',
      description: 'Show your recent trading activity',
      category: 'activity',
      isEnabled: true,
      level: 'friends',
      icon: Users
    },
    {
      id: 'trading-history',
      title: 'Trading History',
      description: 'Allow others to see your past trades',
      category: 'trading',
      isEnabled: false,
      level: 'private',
      icon: Lock
    },
    {
      id: 'achievement-display',
      title: 'Achievement Display',
      description: 'Show your badges and achievements',
      category: 'profile',
      isEnabled: true,
      level: 'public',
      icon: Check
    },
    {
      id: 'wishlist-visibility',
      title: 'Wishlist Visibility',
      description: 'Let others see cards you want to acquire',
      category: 'collection',
      isEnabled: false,
      level: 'friends',
      icon: EyeOff
    },
    {
      id: 'contact-information',
      title: 'Contact Information',
      description: 'Display contact details for trading purposes',
      category: 'profile',
      isEnabled: false,
      level: 'private',
      icon: Info
    }
  ])

  const [hasChanges, setHasChanges] = useState(false)

  const toggleSetting = (settingId: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, isEnabled: !setting.isEnabled }
        : setting
    ))
    setHasChanges(true)
  }

  const updatePrivacyLevel = (settingId: string, level: 'public' | 'friends' | 'private') => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, level }
        : setting
    ))
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    console.log('Saving privacy settings:', settings)
    setHasChanges(false)
  }

  const resetToDefaults = () => {
    // Reset to default privacy settings
    setSettings(prev => prev.map(setting => ({
      ...setting,
      isEnabled: setting.id === 'profile-visibility' || setting.id === 'collection-visibility' || setting.id === 'activity-feed' || setting.id === 'achievement-display',
      level: setting.id === 'profile-visibility' || setting.id === 'achievement-display' ? 'public' : 'friends'
    })))
    setHasChanges(true)
  }

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'public':
        return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      case 'friends':
        return 'text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30'
      case 'private':
        return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      default:
        return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getPrivacyLevelIcon = (level: string) => {
    switch (level) {
      case 'public':
        return Globe
      case 'friends':
        return Users
      case 'private':
        return Lock
      default:
        return Shield
    }
  }

  const categorySettings = {
    profile: settings.filter(s => s.category === 'profile'),
    collection: settings.filter(s => s.category === 'collection'),
    activity: settings.filter(s => s.category === 'activity'),
    trading: settings.filter(s => s.category === 'trading')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2 flex items-center justify-center">
          <Shield className="w-6 h-6 mr-2" />
          Privacy Settings
        </h2>
        <p className="text-[#75715E]">
          Control what information is visible to other users
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center space-x-4"
      >
        <Button
          variant="ghost"
         
          onClick={resetToDefaults}
          className="text-[#66D9EF]"
        >
          <Settings className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        {hasChanges && (
          <Button
            variant="gradient"
           
            onClick={handleSaveChanges}
          >
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </motion.div>

      {/* Privacy Settings by Category */}
      <div className="space-y-6">
        {Object.entries(categorySettings).map(([category, categoryItems], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + categoryIndex * 0.1 }}
          >
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 capitalize">
                {category} Privacy
              </h3>
              
              <div className="space-y-4">
                {categoryItems.map((setting, index) => {
                  const IconComponent = setting.icon
                  const PrivacyIcon = getPrivacyLevelIcon(setting.level)
                  
                  return (
                    <div
                      key={setting.id}
                      className="flex items-center justify-between p-4 bg-[#272822]/30 rounded-lg border border-[#75715E]/20 hover:border-[#75715E]/40 transition-colors"
                    >
                      <div className="flex items-start space-x-4 flex-grow">
                        <div className="p-2 bg-[#272822]/50 rounded-lg">
                          <IconComponent className="w-5 h-5 text-[#66D9EF]" />
                        </div>
                        
                        <div className="flex-grow">
                          <h4 className="font-semibold text-[#F8EFD6] mb-1">
                            {setting.title}
                          </h4>
                          <p className="text-sm text-[#75715E]">
                            {setting.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Privacy Level Selector */}
                        <div className="flex space-x-1">
                          {(['public', 'friends', 'private'] as const).map((level) => {
                            const LevelIcon = getPrivacyLevelIcon(level)
                            return (
                              <button
                                key={level}
                                onClick={() => updatePrivacyLevel(setting.id, level)}
                                className={`p-2 rounded-lg border transition-colors ${
                                  setting.level === level
                                    ? getPrivacyLevelColor(level)
                                    : 'text-[#75715E] bg-[#75715E]/10 border-[#75715E]/20 hover:bg-[#75715E]/20'
                                }`}
                                title={`Set to ${level}`}
                              >
                                <LevelIcon className="w-4 h-4" />
                              </button>
                            )
                          })}
                        </div>

                        {/* Enable/Disable Toggle */}
                        <Switch
                          checked={setting.isEnabled}
                          onCheckedChange={() => toggleSetting(setting.id)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Privacy Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard variant="dark" className="p-6">
          <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4">
            Privacy Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E] mb-1">
                {settings.filter(s => s.level === 'public' && s.isEnabled).length}
              </div>
              <div className="text-sm text-[#75715E]">Public Settings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF] mb-1">
                {settings.filter(s => s.level === 'friends' && s.isEnabled).length}
              </div>
              <div className="text-sm text-[#75715E]">Friends Only</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F92672] mb-1">
                {settings.filter(s => s.level === 'private' || !s.isEnabled).length}
              </div>
              <div className="text-sm text-[#75715E]">Private/Disabled</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
