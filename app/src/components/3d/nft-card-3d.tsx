'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, RoundedBox, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface NFTCard3DProps {
  cardType: 'common' | 'rare' | 'epic' | 'legendary'
  cardName: string
  cardImage?: string
  animated?: boolean
  size?: number
  showControls?: boolean
  className?: string
}

function NFTCard3D({ 
  cardType = 'common', 
  cardName,
  cardImage,
  animated = true, 
  size = 1,
  showControls = true 
}: Omit<NFTCard3DProps, 'className'>) {
  const cardRef = useRef<THREE.Group>(null!)
  const hologramRef = useRef<THREE.Mesh>(null!)

  // Rarity-based materials and effects
  const rarityConfig = useMemo(() => {
    switch (cardType) {
      case 'legendary':
        return {
          color: '#FFD700',
          emissive: '#FF6B35',
          emissiveIntensity: 0.3,
          hologramColor: '#FFD700',
          particleCount: 50,
          glowIntensity: 0.8
        }
      case 'epic':
        return {
          color: '#9966CC',
          emissive: '#9966CC',
          emissiveIntensity: 0.25,
          hologramColor: '#9966CC',
          particleCount: 30,
          glowIntensity: 0.6
        }
      case 'rare':
        return {
          color: '#66D9EF',
          emissive: '#66D9EF',
          emissiveIntensity: 0.2,
          hologramColor: '#66D9EF',
          particleCount: 15,
          glowIntensity: 0.4
        }
      default: // common
        return {
          color: '#A6E22E',
          emissive: '#A6E22E',
          emissiveIntensity: 0.1,
          hologramColor: '#A6E22E',
          particleCount: 5,
          glowIntensity: 0.2
        }
    }
  }, [cardType])

  // Card material with rarity effects
  const cardMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: rarityConfig.color,
      metalness: 0.8,
      roughness: 0.1,
      emissive: rarityConfig.emissive,
      emissiveIntensity: rarityConfig.emissiveIntensity,
      transparent: true,
      opacity: 0.9,
    }),
    [rarityConfig]
  )

  // Holographic effect material
  const hologramMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: rarityConfig.hologramColor,
      metalness: 0.3,
      roughness: 0.7,
      emissive: rarityConfig.hologramColor,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.3,
    }),
    [rarityConfig]
  )

  useFrame((state) => {
    if (animated && cardRef.current) {
      // Floating animation
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Gentle rotation
      cardRef.current.rotation.y += 0.005
      cardRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
      
      // Hologram effect
      if (hologramRef.current) {
        hologramRef.current.rotation.y += 0.02
        hologramRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05)
      }
    }
  })

  // Generate floating particles for higher rarities
  const particles = useMemo(() => {
    const particlePositions = []
    for (let i = 0; i < rarityConfig.particleCount; i++) {
      particlePositions.push([
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ])
    }
    return particlePositions
  }, [rarityConfig.particleCount])

  return (
    <group ref={cardRef} scale={size}>
      {/* Main Card */}
      <RoundedBox args={[2, 3, 0.1]} radius={0.1} smoothness={4}>
        <primitive object={cardMaterial} attach="material" />
      </RoundedBox>

      {/* Card Border Glow */}
      <RoundedBox args={[2.1, 3.1, 0.05]} radius={0.1} smoothness={4} position={[0, 0, -0.06]}>
        <meshStandardMaterial
          color={rarityConfig.color}
          emissive={rarityConfig.emissive}
          emissiveIntensity={rarityConfig.glowIntensity}
          transparent
          opacity={0.6}
        />
      </RoundedBox>

      {/* Holographic Effect (for epic and legendary) */}
      {(cardType === 'epic' || cardType === 'legendary') && (
        <mesh ref={hologramRef} position={[0, 0, 0.06]}>
          <planeGeometry args={[1.8, 2.8]} />
          <primitive object={hologramMaterial} attach="material" />
        </mesh>
      )}

      {/* Card Name Text */}
      <Text
        position={[0, -1.2, 0.06]}
        fontSize={0.2}
        color="#F8EFD6"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {cardName}
      </Text>

      {/* Rarity Badge */}
      <Text
        position={[0, 1.2, 0.06]}
        fontSize={0.15}
        color={rarityConfig.color}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {cardType.toUpperCase()}
      </Text>

      {/* Floating Particles */}
      {particles.map((position, index) => (
        <Sphere key={index} args={[0.02]} position={position as [number, number, number]}>
          <meshStandardMaterial
            color={rarityConfig.hologramColor}
            emissive={rarityConfig.hologramColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}

      {/* Distortion Effect for Legendary */}
      {cardType === 'legendary' && (
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshDistortMaterial
            color={rarityConfig.hologramColor}
            transparent
            opacity={0.1}
            distort={0.1}
            speed={2}
          />
        </mesh>
      )}
    </group>
  )
}

function NFTCard3DEnvironment() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Additional accent lights for rarity effects */}
      <pointLight position={[-5, 0, 0]} intensity={0.3} color="#66D9EF" />
      <pointLight position={[5, 0, 0]} intensity={0.3} color="#F92672" />
      <pointLight position={[0, 5, 0]} intensity={0.2} color="#A6E22E" />
    </>
  )
}

export function NFTCard3DModel({ 
  cardType = 'common', 
  cardName = 'Sample Card',
  cardImage,
  animated = true,
  size = 1,
  showControls = true,
  className = "h-64"
}: NFTCard3DProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <NFTCard3DEnvironment />
        <NFTCard3D 
          cardType={cardType}
          cardName={cardName}
          cardImage={cardImage}
          animated={animated}
          size={size}
          showControls={showControls}
        />
        {showControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={8}
            autoRotate={animated}
            autoRotateSpeed={1}
          />
        )}
      </Canvas>
    </div>
  )
}

export default NFTCard3DModel
