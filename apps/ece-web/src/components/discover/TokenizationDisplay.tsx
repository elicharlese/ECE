'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { GlassCard } from '../ui/glass-card'
import { Badge } from '../ui/badge'
import { 
  Coins, 
  Shield, 
  TrendingUp, 
  DollarSign, 
  Zap,
  Lock,
  Unlock,
  BarChart3,
  Users,
  Globe,
  Star,
  Crown,
  Wallet,
  ArrowUpDown,
  Timer,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

interface TokenizationData {
  cardId: string
  isTokenized: boolean
  isNFTMinted: boolean
  stockTokenAddress?: string
  nftTokenAddress?: string
  stockTokenSymbol: string
  totalSupply: number
  circulatingSupply: number
  currentStockPrice: number
  eceStabilizationRate: number
  marketCap: number
  holders: number
  nftOwner?: string
  nftRoyalties: number
  tradingVolume24h: number
  priceStability: 'stable' | 'volatile' | 'highly_volatile'
  stabilizationMechanism: 'active' | 'inactive'
}

interface TokenizationDisplayProps {
  cardData: {
    id: string
    name: string
    company: string
    category: string
    baseValue: number
    rarity: string
  }
  tokenizationData: TokenizationData
  ecePrice: number
  onTokenizeCard: () => void
  onMintNFT: () => void
  onManageTokens: () => void
  onViewOnExplorer: (address: string) => void
  className?: string
}

interface StabilizationMetrics {
  eceReserve: number
  volatilityBuffer: number
  lastAdjustment: Date
  adjustmentFrequency: number
  targetStability: number
  currentStability: number
}

export function TokenizationDisplay({
  cardData,
  tokenizationData,
  ecePrice,
  onTokenizeCard,
  onMintNFT,
  onManageTokens,
  onViewOnExplorer,
  className = ''
}: TokenizationDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [stabilizationMetrics, setStabilizationMetrics] = useState<StabilizationMetrics>({
    eceReserve: 50000,
    volatilityBuffer: 15.5,
    lastAdjustment: new Date(Date.now() - 3600000),
    adjustmentFrequency: 4,
    targetStability: 95,
    currentStability: 92.3
  })

  // Simulate real-time price and stability updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStabilizationMetrics(prev => ({
        ...prev,
        currentStability: Math.max(85, Math.min(99, prev.currentStability + (Math.random() - 0.5) * 2)),
        volatilityBuffer: Math.max(5, Math.min(25, prev.volatilityBuffer + (Math.random() - 0.5) * 3)),
        eceReserve: Math.max(10000, prev.eceReserve + (Math.random() - 0.5) * 1000)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toFixed(2)
  }

  const getStabilityColor = (stability: number) => {
    if (stability >= 95) return 'text-[#A6E22E]'
    if (stability >= 85) return 'text-[#E6DB74]'
    if (stability >= 75) return 'text-[#FD5C63]'
    return 'text-[#F92672]'
  }

  const getStabilityBadge = (mechanism: string) => {
    return mechanism === 'active' 
      ? 'bg-[#A6E22E]/20 text-[#A6E22E]' 
      : 'bg-[#F92672]/20 text-[#F92672]'
  }

  const getRarityMultiplier = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 1.0
      case 'uncommon': return 1.2
      case 'rare': return 1.5
      case 'epic': return 2.0
      case 'legendary': return 3.0
      case 'mythic': return 5.0
      default: return 1.0
    }
  }

  const calculateTokenValue = () => {
    const baseValue = cardData.baseValue * getRarityMultiplier(cardData.rarity)
    const stabilizedValue = baseValue * (tokenizationData.eceStabilizationRate / 100)
    return stabilizedValue
  }

  const calculateECEEquivalent = () => {
    return calculateTokenValue() / ecePrice
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tokenization Status */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Coins className="h-6 w-6 text-[#E6DB74]" />
            <div>
              <h3 className="text-lg font-semibold text-[#F8EFD6]">Token & NFT Status</h3>
              <p className="text-sm text-[#75715E]">{cardData.name} - {cardData.company}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Badge className={tokenizationData.isTokenized ? 'bg-[#A6E22E]/20 text-[#A6E22E]' : 'bg-[#75715E]/20 text-[#75715E]'}>
              {tokenizationData.isTokenized ? <CheckCircle className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
              {tokenizationData.isTokenized ? 'Tokenized' : 'Not Tokenized'}
            </Badge>
            
            <Badge className={tokenizationData.isNFTMinted ? 'bg-[#66D9EF]/20 text-[#66D9EF]' : 'bg-[#75715E]/20 text-[#75715E]'}>
              {tokenizationData.isNFTMinted ? <Shield className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
              {tokenizationData.isNFTMinted ? 'NFT Minted' : 'NFT Pending'}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F8EFD6]">
              {formatPrice(calculateTokenValue())}
            </div>
            <div className="text-sm text-[#75715E]">Token Value</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E6DB74]">
              {calculateECEEquivalent().toFixed(2)} ECE
            </div>
            <div className="text-sm text-[#75715E]">ECE Equivalent</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStabilityColor(stabilizationMetrics.currentStability)}`}>
              {stabilizationMetrics.currentStability.toFixed(1)}%
            </div>
            <div className="text-sm text-[#75715E]">Price Stability</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[#66D9EF]">
              {formatNumber(tokenizationData.holders)}
            </div>
            <div className="text-sm text-[#75715E]">Token Holders</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!tokenizationData.isTokenized ? (
            <Button
              onClick={onTokenizeCard}
              className="flex-1 bg-gradient-to-r from-[#E6DB74] to-[#F8EFD6] text-[#272822] hover:from-[#E6DB74]/80 hover:to-[#F8EFD6]/80"
            >
              <Coins className="h-4 w-4 mr-2" />
              Tokenize Card
            </Button>
          ) : (
            <Button
              onClick={onManageTokens}
              className="flex-1 bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] text-[#272822] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Manage Tokens
            </Button>
          )}
          
          {!tokenizationData.isNFTMinted ? (
            <Button
              onClick={onMintNFT}
              disabled={!tokenizationData.isTokenized}
              className="flex-1 bg-gradient-to-r from-[#66D9EF] to-[#819AFF] text-[#F8EFD6] hover:from-[#66D9EF]/80 hover:to-[#819AFF]/80 disabled:opacity-50"
            >
              <Shield className="h-4 w-4 mr-2" />
              Mint NFT
            </Button>
          ) : (
            <Button
              onClick={() => onViewOnExplorer(tokenizationData.nftTokenAddress!)}
              className="flex-1 bg-gradient-to-r from-[#819AFF] to-[#66D9EF] text-[#F8EFD6] hover:from-[#819AFF]/80 hover:to-[#66D9EF]/80"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View NFT
            </Button>
          )}
          
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="ghost"
            className="text-[#75715E] hover:text-[#F8EFD6]"
          >
            {showDetails ? 'Hide' : 'Details'}
          </Button>
        </div>
      </GlassCard>

      {/* Detailed Information */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* ECE Stabilization Mechanism */}
            <GlassCard variant="dark" className="p-4">
              <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                ECE Price Stabilization
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#75715E]">ECE Reserve Pool</span>
                    <span className="text-[#F8EFD6]">{formatNumber(stabilizationMetrics.eceReserve)} ECE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75715E]">Volatility Buffer</span>
                    <span className="text-[#F8EFD6]">{stabilizationMetrics.volatilityBuffer.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75715E]">Target Stability</span>
                    <span className="text-[#F8EFD6]">{stabilizationMetrics.targetStability}%</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#75715E]">Last Adjustment</span>
                    <span className="text-[#F8EFD6]">
                      {Math.floor((Date.now() - stabilizationMetrics.lastAdjustment.getTime()) / (1000 * 60))}m ago
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75715E]">Daily Adjustments</span>
                    <span className="text-[#F8EFD6]">{stabilizationMetrics.adjustmentFrequency}/24h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75715E]">Mechanism Status</span>
                    <Badge className={getStabilityBadge(tokenizationData.stabilizationMechanism)}>
                      {tokenizationData.stabilizationMechanism.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-[#272822]/50 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-[#E6DB74] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-[#E6DB74] mb-1">
                      Automatic Price Stabilization
                    </div>
                    <div className="text-xs text-[#75715E]">
                      ECE tokens are automatically bought/sold to maintain stable card values. The system uses a {stabilizationMetrics.volatilityBuffer.toFixed(1)}% buffer to prevent excessive volatility while allowing organic price discovery.
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Token Details */}
            {tokenizationData.isTokenized && (
              <GlassCard variant="dark" className="p-4">
                <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                  <Coins className="h-5 w-5 mr-2" />
                  Stock Token Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Token Symbol</span>
                      <span className="text-[#F8EFD6] font-mono">{tokenizationData.stockTokenSymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Current Price</span>
                      <span className="text-[#F8EFD6]">{formatPrice(tokenizationData.currentStockPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Total Supply</span>
                      <span className="text-[#F8EFD6]">{formatNumber(tokenizationData.totalSupply)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Circulating</span>
                      <span className="text-[#F8EFD6]">{formatNumber(tokenizationData.circulatingSupply)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Market Cap</span>
                      <span className="text-[#F8EFD6]">{formatNumber(tokenizationData.marketCap)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">24h Volume</span>
                      <span className="text-[#F8EFD6]">{formatNumber(tokenizationData.tradingVolume24h)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Holders</span>
                      <span className="text-[#F8EFD6]">{formatNumber(tokenizationData.holders)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Price Stability</span>
                      <Badge className={
                        tokenizationData.priceStability === 'stable' ? 'bg-[#A6E22E]/20 text-[#A6E22E]' :
                        tokenizationData.priceStability === 'volatile' ? 'bg-[#E6DB74]/20 text-[#E6DB74]' :
                        'bg-[#F92672]/20 text-[#F92672]'
                      }>
                        {tokenizationData.priceStability.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {tokenizationData.stockTokenAddress && (
                  <div className="mt-4 pt-4 border-t border-[#75715E]/20">
                    <Button
                      onClick={() => onViewOnExplorer(tokenizationData.stockTokenAddress!)}
                      variant="ghost"
                      className="w-full text-[#66D9EF] hover:text-[#F8EFD6]"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Blockchain Explorer
                    </Button>
                  </div>
                )}
              </GlassCard>
            )}

            {/* NFT Details */}
            {tokenizationData.isNFTMinted && (
              <GlassCard variant="dark" className="p-4">
                <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  NFT Ownership Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Owner</span>
                      <span className="text-[#F8EFD6] font-mono text-sm">
                        {tokenizationData.nftOwner ? 
                          `${tokenizationData.nftOwner.slice(0, 6)}...${tokenizationData.nftOwner.slice(-4)}` : 
                          'You'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Royalties</span>
                      <span className="text-[#F8EFD6]">{tokenizationData.nftRoyalties}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Rarity Multiplier</span>
                      <span className="text-[#F8EFD6]">{getRarityMultiplier(cardData.rarity)}x</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Card Category</span>
                      <span className="text-[#F8EFD6]">{cardData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Base Value</span>
                      <span className="text-[#F8EFD6]">{formatPrice(cardData.baseValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#75715E]">Current Value</span>
                      <span className="text-[#F8EFD6]">{formatPrice(calculateTokenValue())}</span>
                    </div>
                  </div>
                </div>

                {tokenizationData.nftTokenAddress && (
                  <div className="mt-4 pt-4 border-t border-[#75715E]/20">
                    <Button
                      onClick={() => onViewOnExplorer(tokenizationData.nftTokenAddress!)}
                      variant="ghost"
                      className="w-full text-[#66D9EF] hover:text-[#F8EFD6]"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View NFT on OpenSea
                    </Button>
                  </div>
                )}
              </GlassCard>
            )}

            {/* Benefits & Features */}
            <GlassCard variant="dark" className="p-4">
              <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Tokenization Benefits
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-[#A6E22E] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#F8EFD6]">Fractional Ownership</div>
                      <div className="text-xs text-[#75715E]">Trade partial ownership of high-value cards</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-[#E6DB74] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#F8EFD6]">Stable Value</div>
                      <div className="text-xs text-[#75715E]">ECE-backed price stabilization</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-[#66D9EF] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#F8EFD6]">Global Trading</div>
                      <div className="text-xs text-[#75715E]">24/7 worldwide market access</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#819AFF] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#F8EFD6]">Proof of Ownership</div>
                      <div className="text-xs text-[#75715E]">Immutable blockchain verification</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-[#F92672] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#F8EFD6]">Instant Liquidity</div>
                      <div className="text-xs text-[#75715E]">Convert to ECE anytime</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-[#FD5C63] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#F8EFD6]">Royalty Earnings</div>
                      <div className="text-xs text-[#75715E]">Earn from secondary sales</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TokenizationDisplay
