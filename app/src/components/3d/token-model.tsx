'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, RoundedBox, Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface TokenModelProps {
  autoRotate?: boolean
  size?: number
  showControls?: boolean
  className?: string
}

function Token({ autoRotate = true, size = 1 }: { autoRotate?: boolean; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)

  // Create a metallic material for the token
  const tokenMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#FFD700', // Gold color
      metalness: 0.8,
      roughness: 0.2,
      emissive: '#FF6B35',
      emissiveIntensity: 0.1,
    }),
    []
  )

  // Create a glowing ring material
  const ringMaterial = useMaterial(
    () => new THREE.MeshStandardMaterial({
      color: '#66D9EF',
      metalness: 0.5,
      roughness: 0.3,
      emissive: '#66D9EF',
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7,
    }),
    []
  )

  useFrame((state) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05)
    }
  })

  return (
    <group scale={size}>
      {/* Main token body */}
      <mesh ref={meshRef} material={tokenMaterial}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        {/* ECE Text on token */}
        <Text
          position={[0, 0, 0.11]}
          fontSize={0.3}
          color="#272822"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          ECE
        </Text>
      </mesh>

      {/* Glowing ring around token */}
      <mesh ref={ringRef} material={ringMaterial}>
        <torusGeometry args={[1.3, 0.05, 16, 100]} />
      </mesh>

      {/* Particle effects */}
      <group>
        {Array.from({ length: 20 }).map((_, i) => (
          <Sphere
            key={i}
            args={[0.02]}
            position={[
              Math.sin((i / 20) * Math.PI * 2) * 2,
              Math.cos((i / 20) * Math.PI * 2) * 0.5,
              Math.sin((i / 20) * Math.PI * 4) * 2,
            ]}
          >
            <meshStandardMaterial
              color="#A6E22E"
              emissive="#A6E22E"
              emissiveIntensity={0.5}
            />
          </Sphere>
        ))}
      </group>
    </group>
  )
}

export function TokenModel({ autoRotate = true, size = 1, showControls = true, className }: TokenModelProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} color="#66D9EF" intensity={0.5} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#F92672"
        />

        {/* Token */}
        <Token autoRotate={autoRotate} size={size} />

        {/* Controls */}
        {showControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            maxDistance={10}
            minDistance={2}
          />
        )}
      </Canvas>
    </div>
  )
}

// Fix the useMemo issue
function useMaterial<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps)
}
