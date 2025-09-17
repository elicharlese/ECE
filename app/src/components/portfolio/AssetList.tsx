'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  ArrowRightLeft,
  Star,
  MoreHorizontal
} from 'lucide-react'

interface PortfolioAsset {
  id: string
  cardId: string
  cardName: string
  cardCategory: string
  cardRarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'
  cardImageUrl: string
  acquisitionPrice: number
  currentValue: number
  quantity: number
  acquisitionDate: string
  lastUpdated: string
}

interface AssetListProps {
  assets: PortfolioAsset[]
  onViewAsset?: (assetId: string) => void
  onTradeAsset?: (assetId: string) => void
}

const rarityColors = {
  COMMON: 'bg-gray-200 text-gray-800',
  RARE: 'bg-blue-200 text-blue-800',
  EPIC: 'bg-purple-200 text-purple-800',
  LEGENDARY: 'bg-yellow-200 text-yellow-800',
  MYTHIC: 'bg-red-200 text-red-800'
}

export function AssetList({ assets, onViewAsset, onTradeAsset }: AssetListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
  
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }
  
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }
  
  const getRarityColor = (rarity: string) => {
    return rarityColors[rarity as keyof typeof rarityColors] || 'bg-gray-200 text-gray-800'
  }
  
  return (
    <div className="space-y-3">
      {assets.length > 0 ? (
        assets.map((asset, index) => {
          const gainLoss = asset.currentValue - asset.acquisitionPrice
          const gainLossPercentage = ((asset.currentValue - asset.acquisitionPrice) / asset.acquisitionPrice) * 100
          
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                {/* Asset Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded bg-muted relative">
                    {asset.cardImageUrl ? (
                      <img 
                        src={asset.cardImageUrl} 
                        alt={asset.cardName}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Star className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Rarity Badge */}
                    <Badge className={`absolute -top-2 -left-2 ${getRarityColor(asset.cardRarity)}`}>
                      {asset.cardRarity}
                    </Badge>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{asset.cardName}</h4>
                      {asset.quantity > 1 && (
                        <Badge variant="secondary" className="text-xs">
                          x{asset.quantity}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">
                      {asset.cardCategory}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Purchased: {new Date(asset.acquisitionDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated: {formatTimeAgo(asset.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Value Info */}
                <div className="text-right mr-4">
                  <p className="font-bold">{formatCurrency(asset.currentValue)}</p>
                  <div className="flex items-center justify-end gap-1">
                    {gainLoss >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(gainLossPercentage)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(asset.acquisitionPrice)} → {formatCurrency(asset.currentValue)}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewAsset && onViewAsset(asset.id)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => onTradeAsset && onTradeAsset(asset.id)}
                    className="flex items-center gap-2"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    Trade
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No assets found</h3>
          <p className="text-sm">
            You don't have any assets in your portfolio yet
          </p>
        </div>
      )}
    </div>
  )
}
