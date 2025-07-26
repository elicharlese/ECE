/**
 * AI Generated Media Gallery
 * Displays all AI-generated media assets for a generated app
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Image as ImageIcon,
  Video,
  Box,
  Play,
  Download,
  ZoomIn,
  Grid3X3,
  List,
  Filter,
  Star,
  Clock,
  FileType,
  Maximize2
} from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface MediaGalleryProps {
  mediaAssets: {
    images: {
      hero: string[]
      screenshots: string[]
      icons: string[]
      backgrounds: string[]
      thumbnails: string[]
    }
    videos: {
      hero: string
      demo: string
      tutorial: string
      loading: string[]
      transitions: string[]
    }
    assets3D: {
      scenes: string[]
      models: string[]
      environments: string[]
      animations: string[]
    }
    metadata: {
      totalSize: number
      optimizationRatio: number
      processingTime: number
      qualityScore: number
    }
  }
}

export function MediaGallery({ mediaAssets }: MediaGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'images' | 'videos' | '3d'>('all')
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)

  // Combine all assets for unified display
  const allAssets = [
    ...mediaAssets.images.hero.map(url => ({ type: 'image', category: 'hero', url })),
    ...mediaAssets.images.screenshots.map(url => ({ type: 'image', category: 'screenshot', url })),
    ...mediaAssets.images.icons.map(url => ({ type: 'image', category: 'icon', url })),
    ...mediaAssets.images.backgrounds.map(url => ({ type: 'image', category: 'background', url })),
    ...Object.entries(mediaAssets.videos).flatMap(([category, urls]) => 
      Array.isArray(urls) 
        ? urls.map(url => ({ type: 'video', category, url }))
        : urls ? [{ type: 'video', category, url: urls }] : []
    ),
    ...Object.entries(mediaAssets.assets3D).flatMap(([category, urls]) => 
      urls.map(url => ({ type: '3d', category, url }))
    )
  ].filter(asset => asset.url)

  const filteredAssets = selectedCategory === 'all' 
    ? allAssets 
    : allAssets.filter(asset => 
        selectedCategory === 'images' ? asset.type === 'image' :
        selectedCategory === 'videos' ? asset.type === 'video' :
        selectedCategory === '3d' ? asset.type === '3d' : true
      )

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case '3d': return <Box className="w-4 h-4" />
      default: return <FileType className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      hero: 'bg-gradient-to-r from-pink-500/20 to-red-500/20 border-pink-500/30',
      screenshot: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      icon: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30',
      background: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-500/30',
      demo: 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500/30',
      tutorial: 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/30',
      scene: 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
      model: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30'
    }
    return colors[category as keyof typeof colors] || 'bg-slate-500/20 border-slate-500/30'
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8EFD6] mb-2">Generated Media Assets</h3>
          <div className="flex items-center gap-4 text-sm text-[#E6DB74]">
            <div className="flex items-center gap-1">
              <FileType className="w-4 h-4" />
              {allAssets.length} assets
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {formatFileSize(mediaAssets.metadata.totalSize)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(mediaAssets.metadata.processingTime)}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {mediaAssets.metadata.qualityScore}/100
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
           
            onClick={() => setViewMode('grid')}
            className="bg-[#2A3F5F]/80 border-[#66D9EF]/30"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
           
            onClick={() => setViewMode('list')}
            className="bg-[#2A3F5F]/80 border-[#66D9EF]/30"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
        <TabsList className="bg-[#2A3F5F]/50 border border-[#66D9EF]/20">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#F92672]/20">
            All ({allAssets.length})
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-[#A6E22E]/20">
            <ImageIcon className="w-4 h-4 mr-1" />
            Images ({allAssets.filter(a => a.type === 'image').length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-[#66D9EF]/20">
            <Video className="w-4 h-4 mr-1" />
            Videos ({allAssets.filter(a => a.type === 'video').length})
          </TabsTrigger>
          <TabsTrigger value="3d" className="data-[state=active]:bg-[#E6DB74]/20">
            <Box className="w-4 h-4 mr-1" />
            3D ({allAssets.filter(a => a.type === '3d').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={`${asset.type}-${asset.category}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard 
                    className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${getCategoryColor(asset.category)}`}
                    onClick={() => setSelectedAsset(asset.url)}
                  >
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      {asset.type === 'image' ? (
                        <img 
                          src={asset.url} 
                          alt={`${asset.category} asset`}
                          className="w-full h-full object-cover"
                        />
                      ) : asset.type === 'video' ? (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white/60" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                          <Box className="w-12 h-12 text-white/60" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${getCategoryColor(asset.category)} text-xs`}>
                          {getAssetIcon(asset.type)}
                          <span className="ml-1 capitalize">{asset.category}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-[#E6DB74] truncate">
                        {asset.url.split('/').pop()?.replace(/\.(jpg|png|mp4|gltf)$/, '') || 'Asset'}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={`${asset.type}-${asset.category}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <GlassCard 
                    className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/5 ${getCategoryColor(asset.category)}`}
                    onClick={() => setSelectedAsset(asset.url)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        {asset.type === 'image' ? (
                          <img 
                            src={asset.url} 
                            alt={`${asset.category} asset`}
                            className="w-full h-full object-cover"
                          />
                        ) : asset.type === 'video' ? (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white/60" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                            <Box className="w-6 h-6 text-white/60" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getAssetIcon(asset.type)}
                          <span className="text-[#F8EFD6] font-medium capitalize">{asset.category}</span>
                          <Badge className={`${getCategoryColor(asset.category)} text-xs`}>
                            {asset.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#E6DB74] truncate">
                          {asset.url.split('/').pop()?.replace(/\.(jpg|png|mp4|gltf)$/, '') || 'Asset'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="bg-[#2A3F5F]/80 border-[#66D9EF]/30">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="bg-[#2A3F5F]/80 border-[#66D9EF]/30">
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal for selected asset */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-[#F8EFD6]">Asset Preview</h4>
                  <Button
                    variant="outline"
                   
                    onClick={() => setSelectedAsset(null)}
                    className="bg-[#2A3F5F]/80 border-[#66D9EF]/30"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="relative">
                  {selectedAsset.includes('.mp4') ? (
                    <video 
                      src={selectedAsset} 
                      controls 
                      className="w-full max-h-[70vh] rounded-lg"
                    />
                  ) : selectedAsset.includes('.gltf') ? (
                    <div className="w-full h-96 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Box className="w-16 h-16 mx-auto mb-4" />
                        <p>3D Asset Preview</p>
                        <p className="text-sm opacity-60">Click to view in 3D viewer</p>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={selectedAsset} 
                      alt="Asset preview"
                      className="w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      <GlassCard className="p-6 bg-gradient-to-r from-[#2A3F5F]/30 to-[#1A2B4C]/30 border-[#66D9EF]/20">
        <h4 className="text-lg font-bold text-[#F8EFD6] mb-4">Generation Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F92672]">{mediaAssets.metadata.qualityScore}</div>
            <div className="text-sm text-[#E6DB74]">Quality Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#A6E22E]">{(mediaAssets.metadata.optimizationRatio * 100).toFixed(0)}%</div>
            <div className="text-sm text-[#E6DB74]">Size Reduction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#66D9EF]">{allAssets.length}</div>
            <div className="text-sm text-[#E6DB74]">Total Assets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E6DB74]">{formatTime(mediaAssets.metadata.processingTime)}</div>
            <div className="text-sm text-[#E6DB74]">Processing Time</div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
