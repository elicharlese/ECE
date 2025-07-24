'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Float, useTexture, Plane, Text } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'
import { 
  Star, 
  Zap, 
  Shield, 
  Crown, 
  Diamond, 
  Flame,
  Eye,
  Heart,
  Share2,
  Download
} from 'lucide-react'

interface CardProps {
  id: string
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  category: string
  stats: {
    power?: number
    defense?: number
    speed?: number
    luck?: number
  }
  imageUrl?: string
  nftData?: {
    tokenId: string
    mintNumber: number
    totalSupply: number
    blockchain: string
    contractAddress: string
  }
  isNFT?: boolean
  price?: number
  owner?: string
  className?: string
}

// 3D Card Component
function Card3D({ imageUrl, rarity, isHovered }: { 
  imageUrl?: string, 
  rarity: string, 
  isHovered: boolean 
}) {
  const rarityColors = {
    common: '#75715E',
    rare: '#66D9EF', 
    epic: '#A6E22E',
    legendary: '#F92672',
    mythic: '#E6DB74'
  }

  return (
    <Float speed={isHovered ? 2 : 1} rotationIntensity={isHovered ? 0.5 : 0.2} floatIntensity={isHovered ? 0.3 : 0.1}>
      <mesh>
        {/* Card Base */}
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial 
          color={rarityColors[rarity as keyof typeof rarityColors]} 
          metalness={0.8} 
          roughness={0.2}
          emissive={rarityColors[rarity as keyof typeof rarityColors]}
          emissiveIntensity={isHovered ? 0.3 : 0.1}
        />
        
        {/* Holographic Effect */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2.3, 3.3]} />
          <meshStandardMaterial 
            color="#F8EFD6" 
            transparent 
            opacity={0.9}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>
        
        {/* Rarity Glow */}
        {isHovered && (
          <mesh position={[0, 0, -0.06]}>
            <planeGeometry args={[3, 4]} />
            <meshStandardMaterial 
              color={rarityColors[rarity as keyof typeof rarityColors]}
              transparent 
              opacity={0.3}
              emissive={rarityColors[rarity as keyof typeof rarityColors]}
              emissiveIntensity={0.5}
            />
          </mesh>
        )}
      </mesh>
    </Float>
  )
}

export function NFTCard({ 
  id, 
  name, 
  description, 
  rarity, 
  category, 
  stats, 
  imageUrl, 
  nftData, 
  isNFT = false, 
  price, 
  owner,
  className = "" 
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const rarityConfig = {
    common: { 
      color: 'text-[#75715E] bg-[#75715E]/20', 
      icon: Star, 
      glow: 'shadow-[0_0_20px_#75715E]' 
    },
    rare: { 
      color: 'text-[#66D9EF] bg-[#66D9EF]/20', 
      icon: Zap, 
      glow: 'shadow-[0_0_20px_#66D9EF]' 
    },
    epic: { 
      color: 'text-[#A6E22E] bg-[#A6E22E]/20', 
      icon: Shield, 
      glow: 'shadow-[0_0_20px_#A6E22E]' 
    },
    legendary: { 
      color: 'text-[#F92672] bg-[#F92672]/20', 
      icon: Crown, 
      glow: 'shadow-[0_0_20px_#F92672]' 
    },
    mythic: { 
      color: 'text-[#E6DB74] bg-[#E6DB74]/20', 
      icon: Diamond, 
      glow: 'shadow-[0_0_20px_#E6DB74]' 
    }
  }

  const RarityIcon = rarityConfig[rarity].icon

  return (
    <motion.div
      className={`relative group ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <GlassCard 
        variant="dark" 
        className={`overflow-hidden transition-all duration-300 ${
          isHovered ? rarityConfig[rarity].glow : 'shadow-lg'
        } ${isNFT ? 'border-2 border-[#F92672]/50' : ''}`}
      >
        {/* 3D Card Display */}
        <div className="h-64 relative bg-gradient-to-br from-[#272822] to-[#3E3D32]">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            style={{ height: '100%', width: '100%' }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-5, -5, -5]} color={rarityConfig[rarity].color.split(' ')[0].slice(5, -1)} intensity={0.5} />
            
            <Suspense fallback={null}>
              <Card3D imageUrl={imageUrl} rarity={rarity} isHovered={isHovered} />
            </Suspense>
            
            <OrbitControls 
              enablePan={false}
              enableZoom={false}
              autoRotate={isHovered}
              autoRotateSpeed={2}
            />
            <Environment preset="studio" />
          </Canvas>
          
          {/* NFT Badge */}
          {isNFT && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30">
                <Diamond className="w-3 h-3 mr-1" />
                NFT
              </Badge>
            </div>
          )}
          
          {/* Rarity Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={rarityConfig[rarity].color}>
              <RarityIcon className="w-3 h-3 mr-1" />
              {rarity.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-1">{name}</h3>
              <p className="text-[#75715E] text-sm">{category}</p>
            </div>
            {price && (
              <div className="text-right">
                <p className="text-[#A6E22E] font-bold">${price}</p>
                <p className="text-[#75715E] text-xs">ECE</p>
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-[#75715E] text-sm capitalize">{key}:</span>
                  <span className="text-[#F8EFD6] text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* NFT Data */}
          {isNFT && nftData && (
            <div className="border-t border-[#75715E]/30 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#75715E] text-xs">Token ID:</span>
                <span className="text-[#F8EFD6] text-xs font-mono">{nftData.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75715E] text-xs">Edition:</span>
                <span className="text-[#A6E22E] text-xs font-medium">
                  {nftData.mintNumber}/{nftData.totalSupply}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75715E] text-xs">Blockchain:</span>
                <span className="text-[#66D9EF] text-xs">{nftData.blockchain}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button 
              size="sm" 
              className="flex-1 bg-[#F92672]/20 text-[#F92672] hover:bg-[#F92672]/30 border-[#F92672]/30"
              onClick={() => setShowDetails(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="border-[#A6E22E]/30 text-[#A6E22E] hover:bg-[#A6E22E]/10"
            >
              <Heart className="w-4 h-4" />
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="border-[#66D9EF]/30 text-[#66D9EF] hover:bg-[#66D9EF]/10"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <GlassCard variant="dark" className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-[#F8EFD6] mb-2">{name}</h2>
                      <p className="text-[#75715E]">{description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetails(false)}
                      className="border-[#75715E]/30"
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <div className="h-96">
                    <Canvas
                      camera={{ position: [0, 0, 6], fov: 60 }}
                      style={{ height: '100%', width: '100%' }}
                      gl={{ alpha: true, antialias: true }}
                    >
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[5, 5, 5]} intensity={1} />
                      <pointLight position={[-5, -5, -5]} color={rarityConfig[rarity].color.split(' ')[0].slice(5, -1)} intensity={0.7} />
                      
                      <Suspense fallback={null}>
                        <Card3D imageUrl={imageUrl} rarity={rarity} isHovered={true} />
                      </Suspense>
                      
                      <OrbitControls autoRotate autoRotateSpeed={1} />
                      <Environment preset="studio" />
                    </Canvas>
                  </div>
                  
                  {isNFT && nftData && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-[#F8EFD6]">NFT Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[#75715E]">Contract:</span>
                            <span className="text-[#66D9EF] font-mono text-xs">
                              {nftData.contractAddress.slice(0, 8)}...{nftData.contractAddress.slice(-6)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#75715E]">Owner:</span>
                            <span className="text-[#A6E22E]">{owner || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-[#F8EFD6]">Rarity Stats</h4>
                        <div className="space-y-2">
                          {stats && Object.entries(stats).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-[#75715E] capitalize">{key}:</span>
                              <span className="text-[#F8EFD6] font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
