'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Box, Torus } from '@react-three/drei'
import * as THREE from 'three'

function FloatingElements() {
  const group = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.001
      group.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5
        child.rotation.x += 0.005
        child.rotation.z += 0.003
      })
    }
  })

  return (
    <group ref={group}>
      {/* Floating spheres */}
      <Sphere args={[0.3]} position={[-4, 2, -5]}>
        <meshStandardMaterial
          color="#66D9EF"
          emissive="#66D9EF"
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </Sphere>
      
      <Sphere args={[0.2]} position={[4, -1, -3]}>
        <meshStandardMaterial
          color="#A6E22E"
          emissive="#A6E22E"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </Sphere>

      <Sphere args={[0.15]} position={[-2, -3, -4]}>
        <meshStandardMaterial
          color="#F92672"
          emissive="#F92672"
          emissiveIntensity={0.25}
          transparent
          opacity={0.5}
        />
      </Sphere>

      {/* Floating boxes */}
      <Box args={[0.4, 0.4, 0.4]} position={[3, 3, -6]}>
        <meshStandardMaterial
          color="#E6DB74"
          emissive="#E6DB74"
          emissiveIntensity={0.1}
          transparent
          opacity={0.4}
        />
      </Box>

      <Box args={[0.3, 0.3, 0.3]} position={[-3, -1, -2]}>
        <meshStandardMaterial
          color="#819AFF"
          emissive="#819AFF"
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </Box>

      {/* Floating torus */}
      <Torus args={[0.3, 0.1, 16, 100]} position={[0, 1, -4]}>
        <meshStandardMaterial
          color="#FD5C63"
          emissive="#FD5C63"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </Torus>

      <Torus args={[0.4, 0.08, 16, 100]} position={[2, -2, -5]}>
        <meshStandardMaterial
          color="#3EBA7C"
          emissive="#3EBA7C"
          emissiveIntensity={0.2}
          transparent
          opacity={0.4}
        />
      </Torus>
    </group>
  )
}

function ParticleField() {
  const mesh = useRef<THREE.Points>(null!)
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(200 * 3)
    const colors = new Float32Array(200 * 3)
    
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      const color = new THREE.Color()
      color.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.5)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return [positions, colors]
  }, [])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.0005
      mesh.current.rotation.x += 0.0003
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={200}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={200}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

interface AuthScene3DProps {
  className?: string
}

export function AuthScene3D({ className }: AuthScene3DProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />
        
        {/* Directional lights */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5}
          color="#66D9EF"
        />
        <directionalLight
          position={[-10, -10, -5]}
          intensity={0.3}
          color="#F92672"
        />
        
        {/* Point lights */}
        <pointLight
          position={[0, 5, 2]}
          intensity={0.4}
          color="#A6E22E"
        />
        <pointLight
          position={[0, -5, -2]}
          intensity={0.3}
          color="#E6DB74"
        />

        {/* 3D Elements */}
        <FloatingElements />
        <ParticleField />
      </Canvas>
    </div>
  )
}
