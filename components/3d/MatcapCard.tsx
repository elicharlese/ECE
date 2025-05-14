"use client"

import type React from "react"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useMatcapTexture, Center, Text } from "@react-three/drei"
import * as THREE from "three"

// Simple error boundary component
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  try {
    return <>{children}</>
  } catch (error) {
    console.error("Error in 3D rendering:", error)
    return <>{fallback}</>
  }
}

interface MatcapCardProps {
  title: string
  icon?: React.ReactNode
  description?: string
  shape?: "cube" | "rounded" | "cylinder" | "torus" | "sphere"
  color?: string
  className?: string
  width?: number | string
  height?: number | string
  rotationSpeed?: number
  iconScale?: number
  panoramic?: boolean
  fixedScroll?: boolean
}

// Camera controller for panoramic view
function PanoramicCamera({ panoramic = false }) {
  const { camera } = useThree()
  const initialPosition = useRef(new THREE.Vector3(0, 0, 3))

  useEffect(() => {
    if (panoramic) {
      // Set initial camera position for panoramic view
      camera.position.copy(initialPosition.current)
      camera.lookAt(0, 0, 0)
    }
  }, [camera, panoramic])

  return null
}

function CardShape({ shape, color, title, rotationSpeed = 0.002, panoramic = false }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [matcapTexture] = useMatcapTexture("7B5254_E9DCC7_B19986_C8AC91", 256)

  // Use useRef to store the current rotation values
  const rotationRef = useRef({ x: 0, y: 0, z: 0 })

  // For scroll-based rotation
  const scrollY = useRef(0)
  const lastScrollY = useRef(0)

  useEffect(() => {
    // Track scroll position for panoramic effect
    if (panoramic) {
      const handleScroll = () => {
        scrollY.current = window.scrollY
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [panoramic])

  // Animation loop with scroll-based rotation
  useFrame(() => {
    if (meshRef.current) {
      if (panoramic) {
        // Calculate scroll delta
        const scrollDelta = scrollY.current - lastScrollY.current
        lastScrollY.current = scrollY.current

        // Apply subtle rotation based on scroll
        meshRef.current.rotation.y += scrollDelta * 0.001
      } else {
        // Regular auto-rotation
        meshRef.current.rotation.y += rotationSpeed
      }
    }
  })

  let geometry
  switch (shape) {
    case "rounded":
      return (
        <group ref={meshRef}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2, 1.2, 0.2]} />
            <meshMatcapMaterial matcap={matcapTexture} color={color || "#0e5f59"} />
          </mesh>
          <mesh position={[0, 0, 0.1]} castShadow>
            <Text
              position={[0, 0, 0.11]}
              fontSize={0.2}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.8}
              textAlign="center"
            >
              {title}
            </Text>
          </mesh>
        </group>
      )
    case "cylinder":
      return (
        <group ref={meshRef}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1, 1, 0.2, 32]} />
            <meshMatcapMaterial matcap={matcapTexture} color={color || "#0e5f59"} />
          </mesh>
          <Text
            position={[0, 0, 0.11]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.5}
            textAlign="center"
          >
            {title}
          </Text>
        </group>
      )
    case "torus":
      return (
        <group ref={meshRef}>
          <mesh castShadow receiveShadow>
            <torusGeometry args={[0.8, 0.3, 16, 32]} />
            <meshMatcapMaterial matcap={matcapTexture} color={color || "#0e5f59"} />
          </mesh>
          <Text
            position={[0, 0, 0.5]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.5}
            textAlign="center"
          >
            {title}
          </Text>
        </group>
      )
    case "sphere":
      return (
        <group ref={meshRef}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1, 32, 32]} />
            <meshMatcapMaterial matcap={matcapTexture} color={color || "#0e5f59"} />
          </mesh>
          <Text
            position={[0, 0, 1.1]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.5}
            textAlign="center"
          >
            {title}
          </Text>
        </group>
      )
    default: // cube
      return (
        <group ref={meshRef}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.5, 0.2]} />
            <meshMatcapMaterial matcap={matcapTexture} color={color || "#0e5f59"} />
          </mesh>
          <Text
            position={[0, 0, 0.11]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.3}
            textAlign="center"
          >
            {title}
          </Text>
        </group>
      )
  }
}

export function MatcapCard({
  title,
  icon,
  description,
  shape = "cube",
  color = "#0e5f59",
  className = "",
  width = 300,
  height = 200,
  rotationSpeed = 0.002,
  iconScale = 1,
  panoramic = false,
  fixedScroll = false,
}: MatcapCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [containerRect, setContainerRect] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading time for the 3D scene
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Handle fixed scroll positioning
  useEffect(() => {
    if (!fixedScroll || !containerRef.current) return

    // Get initial position of the container
    const updateContainerRect = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerRect({
          top: rect.top + window.scrollY,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })
      }
    }

    // Initial measurement
    updateContainerRect()

    // Update on resize
    window.addEventListener("resize", updateContainerRect)

    return () => {
      window.removeEventListener("resize", updateContainerRect)
    }
  }, [fixedScroll])

  // Fallback content if there's an error
  const fallbackContent = (
    <div className="w-full h-full flex items-center justify-center bg-primary/10 rounded-lg">
      <div className="text-center p-4">
        <p className="font-medium text-primary">{title}</p>
        <p className="text-sm text-muted-foreground mt-2">3D visualization unavailable</p>
      </div>
    </div>
  )

  // Determine if we should use fixed positioning
  const useFixedPosition = fixedScroll && containerRect.width > 0

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        width: width,
        height: height,
      }}
    >
      {/* Placeholder div to maintain layout space when using fixed positioning */}
      {useFixedPosition && <div style={{ width: "100%", height: "100%" }} aria-hidden="true" />}

      {/* Actual content with conditional fixed positioning */}
      <div
        className={`overflow-hidden rounded-lg ${useFixedPosition ? "fixed z-10" : "relative"}`}
        style={
          useFixedPosition
            ? {
                top: containerRect.top,
                left: containerRect.left,
                width: containerRect.width,
                height: containerRect.height,
              }
            : { width: "100%", height: "100%" }
        }
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {hasError ? (
          fallbackContent
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              }
            >
              <ErrorBoundary fallback={fallbackContent}>
                <Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
                  <PanoramicCamera panoramic={panoramic} />
                  <ambientLight intensity={0.5} />
                  <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} castShadow />
                  <Center>
                    <CardShape
                      shape={shape}
                      color={color}
                      title={title}
                      rotationSpeed={rotationSpeed}
                      panoramic={panoramic}
                    />
                  </Center>
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    rotateSpeed={0.5}
                    enableRotate={!panoramic} // Disable rotation controls in panoramic mode
                  />
                </Canvas>
              </ErrorBoundary>
            </Suspense>
          </div>
        )}

        {description && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-sm">{description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
