'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Text, Float } from '@react-three/drei'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coins, TrendingUp, Users, Zap, Download, Share2 } from 'lucide-react'

// 3D ECE Token Component
function ECEToken({ rotation = [0, 0, 0] }: { rotation?: [number, number, number] }) {
  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={0.5}>
      <mesh rotation={rotation}>
        {/* Token Base */}
        <cylinderGeometry args={[2, 2, 0.3, 32]} />
        <meshStandardMaterial 
          color="#F92672" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#F92672"
          emissiveIntensity={0.1}
        />
        
        {/* ECE Text */}
        <Text
          position={[0, 0, 0.16]}
          fontSize={0.5}
          color="#F8EFD6"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          ECE
        </Text>
        
        {/* Token Ring */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.2, 0.1, 8, 32]} />
          <meshStandardMaterial 
            color="#66D9EF" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#66D9EF"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Particle Effects */}
        {[...Array(12)].map((_, i) => (
          <mesh key={i} position={[
            Math.cos(i * Math.PI / 6) * 3,
            Math.sin(i * Math.PI / 6) * 0.5,
            Math.sin(i * Math.PI / 6) * 3
          ]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial 
              color="#A6E22E" 
              emissive="#A6E22E"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </mesh>
    </Float>
  )
}

// Token Scene Component
function TokenScene() {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 60 }}
      style={{ height: '500px' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#66D9EF" intensity={0.5} />
      
      <ECEToken />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={10}
      />
      
      <Environment preset="studio" />
    </Canvas>
  )
}

export default function TokenPage() {
  const [tokenStats, setTokenStats] = useState({
    totalSupply: '1,000,000,000',
    currentPrice: '$0.0042',
    marketCap: '$4,200,000',
    holders: '15,847',
    volume24h: '$156,234'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#3E3D32] to-[#272822]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge className="bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30">
                  Official ECE Token
                </Badge>
                <h1 className="text-5xl font-bold text-[#F8EFD6] leading-tight">
                  ECE Token
                </h1>
                <p className="text-xl text-[#75715E] leading-relaxed">
                  The native utility token powering the Elite Card Exchange ecosystem. 
                  Trade, stake, and govern with ECE tokens.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <GlassCard variant="dark" className="p-4">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-8 h-8 text-[#F92672]" />
                    <div>
                      <p className="text-sm text-[#75715E]">Current Price</p>
                      <p className="text-lg font-bold text-[#F8EFD6]">{tokenStats.currentPrice}</p>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard variant="dark" className="p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-[#A6E22E]" />
                    <div>
                      <p className="text-sm text-[#75715E]">24h Volume</p>
                      <p className="text-lg font-bold text-[#F8EFD6]">{tokenStats.volume24h}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-[#F92672] to-[#FD5C63] hover:from-[#FD5C63] hover:to-[#F92672] text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
                  <Download className="w-5 h-5 mr-2" />
                  Buy ECE Token
                </Button>
                <Button variant="outline" className="border-[#66D9EF] text-[#66D9EF] hover:bg-[#66D9EF]/10 px-8 py-3 rounded-lg">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>

            {/* Right 3D Token */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <GlassCard variant="dark" className="p-8 h-[600px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#272822]/50 to-[#3E3D32]/50 backdrop-blur-xl rounded-lg"></div>
                <div className="relative z-10 h-full">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#F92672] border-t-transparent"></div>
                    </div>
                  }>
                    <TokenScene />
                  </Suspense>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Token Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid md:grid-cols-4 gap-6"
          >
            <GlassCard variant="light" className="p-6 text-center">
              <Users className="w-12 h-12 text-[#66D9EF] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#F8EFD6] mb-2">{tokenStats.holders}</h3>
              <p className="text-[#75715E]">Token Holders</p>
            </GlassCard>

            <GlassCard variant="light" className="p-6 text-center">
              <Coins className="w-12 h-12 text-[#F92672] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#F8EFD6] mb-2">{tokenStats.totalSupply}</h3>
              <p className="text-[#75715E]">Total Supply</p>
            </GlassCard>

            <GlassCard variant="light" className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-[#A6E22E] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#F8EFD6] mb-2">{tokenStats.marketCap}</h3>
              <p className="text-[#75715E]">Market Cap</p>
            </GlassCard>

            <GlassCard variant="light" className="p-6 text-center">
              <Zap className="w-12 h-12 text-[#E6DB74] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#F8EFD6] mb-2">{tokenStats.volume24h}</h3>
              <p className="text-[#75715E]">24h Volume</p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Token Utility */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#F8EFD6] mb-4">Token Utility</h2>
            <p className="text-xl text-[#75715E] max-w-3xl mx-auto">
              ECE tokens power the entire ecosystem with multiple use cases and benefits
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Trading & Marketplace',
                description: 'Use ECE tokens to buy, sell, and trade cards on the marketplace',
                icon: '🏪',
                color: '#F92672'
              },
              {
                title: 'Staking Rewards',
                description: 'Stake ECE tokens to earn passive rewards and governance rights',
                icon: '💎',
                color: '#66D9EF'
              },
              {
                title: 'Premium Features',
                description: 'Access exclusive features, tournaments, and early card releases',
                icon: '⭐',
                color: '#A6E22E'
              }
            ].map((utility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
              >
                <GlassCard variant="dark" className="p-8 h-full text-center hover:scale-105 transition-transform duration-300">
                  <div 
                    className="text-6xl mb-6"
                    style={{ filter: `drop-shadow(0 0 20px ${utility.color})` }}
                  >
                    {utility.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">{utility.title}</h3>
                  <p className="text-[#75715E] leading-relaxed">{utility.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
