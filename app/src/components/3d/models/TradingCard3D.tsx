'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text, RoundedBox, Plane, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface TradingCard3DProps {
  cardData: {
    id: string;
    name: string;
    image: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    type: string;
    stats?: {
      attack?: number;
      defense?: number;
      speed?: number;
    };
  };
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  enableAnimation?: boolean;
  animationSpeed?: number;
  interactive?: boolean;
  onClick?: () => void;
  showStats?: boolean;
}

export function TradingCard3D({
  cardData,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  enableAnimation = true,
  animationSpeed = 1,
  interactive = true,
  onClick,
  showStats = true
}: TradingCard3DProps) {
  // Relax ref typing to avoid mismatched generics between drei components and THREE types
  const groupRef = useRef<any>(null);
  const cardRef = useRef<any>(null);
  const glowRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);

  // Rarity-based configurations
  const getRarityConfig = () => {
    switch (cardData.rarity) {
      case 'legendary':
        return {
          frameColor: '#FFD700',
          glowColor: '#FFA500',
          glowIntensity: 1.5,
          particles: true,
          holographic: true,
          edgeGlow: '#FFD700'
        };
      case 'epic':
        return {
          frameColor: '#9932CC',
          glowColor: '#DA70D6',
          glowIntensity: 1.2,
          particles: true,
          holographic: true,
          edgeGlow: '#9932CC'
        };
      case 'rare':
        return {
          frameColor: '#1E90FF',
          glowColor: '#66D9EF',
          glowIntensity: 1.0,
          particles: false,
          holographic: false,
          edgeGlow: '#1E90FF'
        };
      default:
        return {
          frameColor: '#A6E22E',
          glowColor: '#90EE90',
          glowIntensity: 0.8,
          particles: false,
          holographic: false,
          edgeGlow: '#A6E22E'
        };
    }
  };

  const config = getRarityConfig();

  // Animation loop
  useFrame((state, delta) => {
    if (!enableAnimation) return;

    const time = state.clock.elapsedTime;
    const speed = animationSpeed;

    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(time * speed) * 0.02;
      
      // Subtle rotation when hovered
      if (hovered) {
        groupRef.current.rotation.y = rotation[1] + Math.sin(time * speed * 2) * 0.1;
      }
    }

    if (cardRef.current && config.holographic) {
      // Holographic shimmer effect
      const material = cardRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.1 + Math.sin(time * speed * 3) * 0.05;
      }
    }

    if (glowRef.current) {
      // Pulsing glow effect
      const glowScale = 1 + Math.sin(time * speed * 2) * 0.05;
      glowRef.current.scale.setScalar(glowScale);
      
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      if (material.opacity !== undefined) {
        material.opacity = 0.3 + Math.sin(time * speed * 1.5) * 0.1;
      }
    }
  });

  const handleClick = () => {
    if (!interactive) return;
    setFlipped(!flipped);
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
      {/* Glow effect */}
      <RoundedBox
        ref={glowRef}
        args={[2.6 * scale, 3.8 * scale, 0.05 * scale]}
        radius={0.1 * scale}
        smoothness={4}
        position={[0, 0, -0.01]}
      >
        <meshBasicMaterial
          color={config.glowColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* Main card body */}
      <RoundedBox
        ref={cardRef}
        args={[2.5 * scale, 3.7 * scale, 0.1 * scale]}
        radius={0.1 * scale}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#F8EFD6"
          metalness={config.holographic ? 0.6 : 0.1}
          roughness={config.holographic ? 0.1 : 0.8}
          emissive={config.holographic ? config.frameColor : '#000000'}
          emissiveIntensity={config.holographic ? 0.1 : 0}
        />
      </RoundedBox>

      {/* Card frame */}
      <RoundedBox
        args={[2.4 * scale, 3.6 * scale, 0.02 * scale]}
        radius={0.08 * scale}
        smoothness={4}
        position={[0, 0, 0.06 * scale]}
      >
        <meshStandardMaterial
          color={config.frameColor}
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Card image area */}
      <RoundedBox
        args={[2.0 * scale, 2.0 * scale, 0.01 * scale]}
        radius={0.05 * scale}
        smoothness={4}
        position={[0, 0.5 * scale, 0.07 * scale]}
      >
        <meshStandardMaterial
          color="#272822"
          roughness={0.1}
        />
      </RoundedBox>

      {/* Card name */}
      <Text
        position={[0, -0.5 * scale, 0.08 * scale]}
        fontSize={0.15 * scale}
        color="#272822"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        maxWidth={2 * scale}
      >
        {cardData.name}
      </Text>

      {/* Card type */}
      <Text
        position={[0, -0.8 * scale, 0.08 * scale]}
        fontSize={0.1 * scale}
        color="#75715E"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        {cardData.type}
      </Text>

      {/* Rarity indicator */}
      <RoundedBox
        args={[0.6 * scale, 0.2 * scale, 0.01 * scale]}
        radius={0.02 * scale}
        position={[0.8 * scale, 1.5 * scale, 0.08 * scale]}
      >
        <meshStandardMaterial
          color={config.frameColor}
          emissive={config.frameColor}
          emissiveIntensity={0.3}
        />
      </RoundedBox>

      <Text
        position={[0.8 * scale, 1.5 * scale, 0.09 * scale]}
        fontSize={0.08 * scale}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {cardData.rarity.toUpperCase()}
      </Text>

      {/* Stats display */}
      {showStats && cardData.stats && (
        <group position={[0, -1.4 * scale, 0.08 * scale]}>
          {cardData.stats.attack && (
            <group position={[-0.6 * scale, 0, 0]}>
              <Text
                fontSize={0.08 * scale}
                color="#F92672"
                anchorX="center"
                anchorY="middle"
              >
                ATK: {cardData.stats.attack}
              </Text>
            </group>
          )}
          {cardData.stats.defense && (
            <group position={[0, 0, 0]}>
              <Text
                fontSize={0.08 * scale}
                color="#66D9EF"
                anchorX="center"
                anchorY="middle"
              >
                DEF: {cardData.stats.defense}
              </Text>
            </group>
          )}
          {cardData.stats.speed && (
            <group position={[0.6 * scale, 0, 0]}>
              <Text
                fontSize={0.08 * scale}
                color="#A6E22E"
                anchorX="center"
                anchorY="middle"
              >
                SPD: {cardData.stats.speed}
              </Text>
            </group>
          )}
        </group>
      )}

      {/* Legendary particles */}
      {config.particles && (
        <group>
          {Array.from({ length: 12 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 12) * Math.PI * 2) * 2 * scale,
                Math.sin(Date.now() * 0.001 + i) * 0.5 * scale,
                Math.sin((i / 12) * Math.PI * 2) * 0.5 * scale
              ]}
            >
              <sphereGeometry args={[0.02 * scale, 8, 8]} />
              <meshBasicMaterial
                color={config.frameColor}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Hover effect */}
      {hovered && (
        <RoundedBox
          args={[2.8 * scale, 4.0 * scale, 0.02 * scale]}
          radius={0.12 * scale}
          smoothness={4}
          position={[0, 0, -0.02]}
        >
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </RoundedBox>
      )}
    </group>
  );
}
