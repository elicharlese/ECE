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
      color: 'text-muted-foreground bg-muted', 
      icon: Star, 
      glow: 'shadow-lg hover:shadow-xl' 
    },
    rare: { 
      color: 'text-info bg-info/20', 
      icon: Zap, 
      glow: 'shadow-lg hover:shadow-info/20' 
    },
    epic: { 
      color: 'text-success bg-success/20', 
      icon: Shield, 
      glow: 'shadow-lg hover:shadow-success/20' 
    },
    legendary: { 
      color: 'text-accent bg-accent/20', 
      icon: Crown, 
      glow: 'shadow-lg hover:shadow-accent/20' 
    },
    mythic: { 
      color: 'text-warning bg-warning/20', 
      icon: Diamond, 
      glow: 'shadow-lg hover:shadow-warning/20' 
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
        className={`overflow-hidden transition-all duration-500 ${
          isHovered ? rarityConfig[rarity].glow : 'shadow-md'
        } ${isNFT ? 'border-2 border-accent/50' : 'border border-border'} rounded-2xl`}
      >
        {/* 3D Card Display - Larger for better focus */}
        <div className="h-80 relative bg-gradient-to-br from-muted/20 to-muted/5 rounded-t-xl">
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
          
          {/* NFT Badge - Cleaner */}
          {isNFT && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-accent/20 text-accent border-0 shadow-lg backdrop-blur-sm">
                <Diamond className="w-3 h-3 mr-1" />
                NFT
              </Badge>
            </div>
          )}
          
          {/* Rarity Badge - Better positioning */}
          <div className="absolute top-4 left-4">
            <Badge className={`${rarityConfig[rarity].color} border-0 shadow-lg backdrop-blur-sm`}>
              <RarityIcon className="w-3 h-3 mr-1" />
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Card Info - Clean & Spacious */}
        <div className="p-8 space-y-6">
          {/* Header - Better typography */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-foreground">{name}</h3>
            <p className="text-muted-foreground text-sm uppercase tracking-wide">{category}</p>
            {price && (
              <div className="inline-block px-4 py-2 bg-accent/10 rounded-full">
                <span className="text-accent font-bold text-lg">{price} ECE</span>
              </div>
            )}
          </div>

          {/* Single Action Button */}
          <Button 
            size="lg"
            className="w-full h-12 text-base font-medium rounded-xl"
            onClick={() => setShowDetails(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>

          {/* Minimal Stats - Only on hover/expand */}
          {isHovered && stats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-4 pt-4 border-t border-border"
            >
              {Object.entries(stats).slice(0, 2).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground uppercase">{key}</div>
                </div>
              ))}
            </motion.div>
          )}
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
