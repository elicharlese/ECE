'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface ECETokenProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  enableAnimation?: boolean;
  animationSpeed?: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  interactive?: boolean;
  onClick?: () => void;
}

export function ECEToken({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  enableAnimation = true,
  animationSpeed = 1,
  rarity = 'common',
  interactive = true,
  onClick
}: ECETokenProps) {
  // Relax ref typing to avoid mismatched generics between drei components and THREE types
  const groupRef = useRef<any>(null);
  const tokenRef = useRef<any>(null);
  const glowRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Rarity-based configurations
  const getRarityConfig = () => {
    switch (rarity) {
      case 'legendary':
        return {
          color: '#FFD700', // Gold
          glowColor: '#FFA500',
          glowIntensity: 1.5,
          animationMultiplier: 1.5,
          particleCount: 50
        };
      case 'epic':
        return {
          color: '#9932CC', // Purple
          glowColor: '#DA70D6',
          glowIntensity: 1.2,
          animationMultiplier: 1.3,
          particleCount: 30
        };
      case 'rare':
        return {
          color: '#1E90FF', // Blue
          glowColor: '#66D9EF',
          glowIntensity: 1.0,
          animationMultiplier: 1.1,
          particleCount: 20
        };
      default:
        return {
          color: '#A6E22E', // Green
          glowColor: '#90EE90',
          glowIntensity: 0.8,
          animationMultiplier: 1.0,
          particleCount: 10
        };
    }
  };

  const config = getRarityConfig();

  // Animation loop
  useFrame((state, delta) => {
    if (!enableAnimation) return;

    const time = state.clock.elapsedTime;
    const speed = animationSpeed * config.animationMultiplier;

    if (groupRef.current) {
      // Base rotation
      groupRef.current.rotation.y = time * speed * 0.5;
      
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(time * speed) * 0.1;
      
      // Tilt animation
      groupRef.current.rotation.x = Math.sin(time * speed * 0.7) * 0.1;
      groupRef.current.rotation.z = Math.cos(time * speed * 0.5) * 0.05;
    }

    if (tokenRef.current) {
      // Inner token rotation (opposite direction)
      tokenRef.current.rotation.y = -time * speed * 0.8;
    }

    if (glowRef.current) {
      // Pulsing glow effect
      const glowScale = 1 + Math.sin(time * speed * 2) * 0.1;
      glowRef.current.scale.setScalar(glowScale);
      
      // Breathing opacity
      const glowOpacity = 0.3 + Math.sin(time * speed * 1.5) * 0.2;
      if (glowRef.current.material instanceof THREE.Material) {
        (glowRef.current.material as any).opacity = glowOpacity;
      }
    }

    // Hover animation
    if (hovered && groupRef.current) {
      const hoverScale = 1 + Math.sin(time * 5) * 0.05;
      groupRef.current.scale.setScalar(scale * hoverScale);
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);
    }
  });

  // Click animation
  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => setClicked(false), 200);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  const handleClick = () => {
    if (!interactive) return;
    setClicked(true);
    onClick?.();
  };

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation}
      onPointerOver={() => interactive && setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Outer glow ring */}
      <Torus
        ref={glowRef}
        args={[1.2 * scale, 0.1 * scale, 8, 16]}
        position={[0, 0, 0]}
      >
        <meshBasicMaterial
          color={config.glowColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </Torus>

      {/* Main token body */}
      <Cylinder
        ref={tokenRef}
        args={[0.8 * scale, 0.8 * scale, 0.2 * scale, 32]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={config.color}
          metalness={0.8}
          roughness={0.2}
          emissive={config.color}
          emissiveIntensity={0.1}
        />
      </Cylinder>

      {/* ECE Logo Text */}
      <Text
        position={[0, 0, 0.11 * scale]}
        rotation={[0, 0, 0]}
        fontSize={0.3 * scale}
        color="#272822"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        ECE
      </Text>

      {/* Back side text */}
      <Text
        position={[0, 0, -0.11 * scale]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.15 * scale}
        color="#272822"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        ELITE CARD
      </Text>
      
      <Text
        position={[0, -0.2 * scale, -0.11 * scale]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.15 * scale}
        color="#272822"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        EXCHANGE
      </Text>

      {/* Edge details */}
      <Torus
        args={[0.8 * scale, 0.02 * scale, 8, 32]}
        position={[0, 0, 0.1 * scale]}
      >
        <meshStandardMaterial
          color="#272822"
          metalness={0.9}
          roughness={0.1}
        />
      </Torus>
      
      <Torus
        args={[0.8 * scale, 0.02 * scale, 8, 32]}
        position={[0, 0, -0.1 * scale]}
      >
        <meshStandardMaterial
          color="#272822"
          metalness={0.9}
          roughness={0.1}
        />
      </Torus>

      {/* Rarity particles for legendary tokens */}
      {rarity === 'legendary' && (
        <group>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 1.5 * scale,
                0,
                Math.sin((i / 8) * Math.PI * 2) * 1.5 * scale
              ]}
            >
              <sphereGeometry args={[0.02 * scale, 8, 8]} />
              <meshBasicMaterial
                color="#FFD700"
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Click effect */}
      {clicked && (
        <RoundedBox
          args={[2 * scale, 2 * scale, 0.1 * scale]}
          radius={0.1 * scale}
          smoothness={4}
        >
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </RoundedBox>
      )}
    </group>
  );
}
