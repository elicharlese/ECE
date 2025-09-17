'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus,
  X,
  Edit3,
  Save,
  ExternalLink,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Twitch,
  MessageCircle,
  Globe,
  Link as LinkIcon
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SocialLink {
  id: string
  platform: string
  url: string
  icon: React.ComponentType<any>
  color: string
  isVisible: boolean
}

interface SocialProfileLinksProps {
  className?: string
}

export function SocialProfileLinks({ className = '' }: SocialProfileLinksProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: '1',
      platform: 'Twitter',
      url: 'https://twitter.com/alexrivera',
      icon: Twitter,
      color: '#1DA1F2',
      isVisible: true
    },
    {
      id: '2',
      platform: 'GitHub',
      url: 'https://github.com/alexrivera',
      icon: Github,
      color: '#333',
      isVisible: true
    },
    {
      id: '3',
      platform: 'Discord',
      url: 'alexrivera#1234',
      icon: MessageCircle,
      color: '#5865F2',
      isVisible: true
    }
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [newLink, setNewLink] = useState({ platform: '', url: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  const availablePlatforms = [
    { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { name: 'GitHub', icon: Github, color: '#333' },
    { name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
    { name: 'YouTube', icon: Youtube, color: '#FF0000' },
    { name: 'Twitch', icon: Twitch, color: '#9146FF' },
    { name: 'Discord', icon: MessageCircle, color: '#5865F2' },
    { name: 'Website', icon: Globe, color: '#66D9EF' }
  ]

  const addSocialLink = () => {
    if (newLink.platform && newLink.url) {
      const platform = availablePlatforms.find(p => p.name === newLink.platform)
      if (platform) {
        const newSocialLink: SocialLink = {
          id: Date.now().toString(),
          platform: newLink.platform,
          url: newLink.url,
          icon: platform.icon,
          color: platform.color,
          isVisible: true
        }
        setSocialLinks(prev => [...prev, newSocialLink])
        setNewLink({ platform: '', url: '' })
      }
    }
  }

  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id))
  }

  const toggleVisibility = (id: string) => {
    setSocialLinks(prev => prev.map(link =>
      link.id === id ? { ...link, isVisible: !link.isVisible } : link
    ))
  }

  const updateLink = (id: string, url: string) => {
    setSocialLinks(prev => prev.map(link =>
      link.id === id ? { ...link, url } : link
    ))
    setEditingId(null)
  }

  const validateUrl = (url: string, platform: string) => {
    if (platform === 'Discord') {
      return url.includes('#') // Discord username format
    }
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('www.')
  }

  const formatDisplayUrl = (url: string, platform: string) => {
    if (platform === 'Discord') {
      return url // Display Discord username as-is
    }
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-xl font-bold text-[#F8EFD6] mb-2 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2" />
            Social Links
          </h3>
          <p className="text-[#75715E]">
            Connect your external profiles and social media accounts
          </p>
        </div>
        <Button
          variant={isEditing ? 'default' : 'ghost'}
         
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Done
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </motion.div>

      {/* Social Links Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard variant="dark" className="p-6">
          <div className="space-y-4">
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon
              
              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    link.isVisible 
                      ? 'bg-[#272822]/30 border-[#75715E]/30' 
                      : 'bg-[#272822]/10 border-[#75715E]/10 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-grow">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${link.color}20` }}
                    >
                      <IconComponent 
                        className="w-5 h-5" 
                        style={{ color: link.color }}
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h4 className="font-semibold text-[#F8EFD6]">
                        {link.platform}
                      </h4>
                      {editingId === link.id ? (
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="text"
                            defaultValue={link.url}
                            className="text-sm bg-[#272822]/50"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateLink(link.id, e.currentTarget.value)
                              } else if (e.key === 'Escape') {
                                setEditingId(null)
                              }
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-[#75715E]">
                          {formatDisplayUrl(link.url, link.platform)}
                        </p>
                      )}
                    </div>

                    {link.isVisible && link.platform !== 'Discord' && (
                      <Button
                        variant="ghost"
                       
                        onClick={() => window.open(link.url, '_blank')}
                        className="text-[#66D9EF] hover:text-[#66D9EF]/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                       
                        onClick={() => setEditingId(editingId === link.id ? null : link.id)}
                        className="text-[#E6DB74] hover:text-[#E6DB74]/80"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                       
                        onClick={() => toggleVisibility(link.id)}
                        className={link.isVisible ? 'text-[#A6E22E]' : 'text-[#75715E]'}
                      >
                        {link.isVisible ? 'Show' : 'Hide'}
                      </Button>
                      <Button
                        variant="ghost"
                       
                        onClick={() => removeSocialLink(link.id)}
                        className="text-[#F92672] hover:text-[#F92672]/80"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )
            })}

            {socialLinks.length === 0 && (
              <div className="text-center py-8">
                <LinkIcon className="w-12 h-12 text-[#75715E] mx-auto mb-4" />
                <p className="text-[#75715E]">No social links added yet</p>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Add New Link */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard variant="dark" className="p-6">
            <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4">
              Add Social Link
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#F8EFD6] mb-2">
                  Platform
                </label>
                <select
                  value={newLink.platform}
                  onChange={(e) => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full p-3 bg-[#272822]/50 border border-[#75715E]/30 rounded-lg text-[#F8EFD6] focus:border-[#A6E22E]/50"
                >
                  <option value="">Select platform</option>
                  {availablePlatforms.map(platform => (
                    <option key={platform.name} value={platform.name}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#F8EFD6] mb-2">
                  URL or Username
                </label>
                <Input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  placeholder={newLink.platform === 'Discord' ? 'username#1234' : 'https://...'}
                  className="bg-[#272822]/50"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="gradient"
                  onClick={addSocialLink}
                  disabled={!newLink.platform || !newLink.url}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Available Platforms Preview */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard variant="dark" className="p-6">
            <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4">
              Available Platforms
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availablePlatforms.map(platform => {
                const IconComponent = platform.icon
                const isAdded = socialLinks.some(link => link.platform === platform.name)
                
                return (
                  <div
                    key={platform.name}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      isAdded 
                        ? 'bg-[#A6E22E]/10 border-[#A6E22E]/30' 
                        : 'bg-[#272822]/30 border-[#75715E]/30'
                    }`}
                  >
                    <IconComponent 
                      className="w-6 h-6 mx-auto mb-2" 
                      style={{ color: platform.color }}
                    />
                    <p className={`text-sm font-medium ${
                      isAdded ? 'text-[#A6E22E]' : 'text-[#F8EFD6]'
                    }`}>
                      {platform.name}
                    </p>
                    {isAdded && (
                      <p className="text-xs text-[#A6E22E] mt-1">Added</p>
                    )}
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
