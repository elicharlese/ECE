"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useMatcapTexture, Center } from "@react-three/drei"
import type * as THREE from "three"

interface MatcapImageProps {
  shape?: "sphere" | "torus" | "knot" | "teapot"
  matcap?: string
  color?: string
  className?: string
  width?: number
  height?: number
  alt?: string
  rotationSpeed?: number
}

function Shape({ shape, matcap, color, rotationSpeed = 0.005 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [matcapTexture] = useMatcapTexture(matcap || "7B5254_E9DCC7_B19986_C8AC91", 256)

  // Use useRef to store the current rotation values
  const rotationRef = useRef({ x: 0, y: 0, z: 0 })

  // Animation loop
  useEffect(() => {
    let animationId: number

    const animate = () => {
      if (meshRef.current) {
        // Update the rotation values in our ref
        rotationRef.current.x += rotationSpeed
        rotationRef.current.y += rotationSpeed * 0.5

        // Apply the rotation values to the mesh
        meshRef.current.rotation.x = rotationRef.current.x
        meshRef.current.rotation.y = rotationRef.current.y
      }
      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [rotationSpeed])

  let geometry
  switch (shape) {
    case "torus":
      geometry = <torusGeometry args={[1, 0.4, 64, 64]} />
      break
    case "knot":
      geometry = <torusKnotGeometry args={[0.9, 0.3, 128, 64]} />
      break
    default:
      geometry = <sphereGeometry args={[1.2, 64, 64]} />
  }

  return (
    <mesh ref={meshRef}>
      {geometry}
      <meshMatcapMaterial matcap={matcapTexture} color={color || "#0e5f59"} />
    </mesh>
  )
}

export function MatcapImage({
  shape = "sphere",
  matcap,
  color,
  className = "",
  width = 300,
  height = 300,
  alt = "3D Object",
  rotationSpeed = 0.005,
}: MatcapImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for the 3D scene
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        width: width,
        height: height,
      }}
      aria-label={alt}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Center>
          <Shape shape={shape} matcap={matcap} color={color} rotationSpeed={rotationSpeed} />
        </Center>
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
