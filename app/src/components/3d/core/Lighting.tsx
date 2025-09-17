'use client';

import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface LightingProps {
  performanceMode?: 'high' | 'medium' | 'low';
  enableDynamicLighting?: boolean;
  intensity?: number;
  color?: string;
}

export function Lighting({
  performanceMode = 'high',
  enableDynamicLighting = true,
  intensity = 1,
  color = '#ffffff'
}: LightingProps) {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Dynamic lighting animation
  useFrame((state) => {
    if (enableDynamicLighting && directionalLightRef.current) {
      // Subtle breathing effect on the main light
      const breathingIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      directionalLightRef.current.intensity = intensity * breathingIntensity;
    }

    if (enableDynamicLighting && pointLightRef.current) {
      // Gentle oscillation for accent lighting
      const oscillation = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
      pointLightRef.current.position.x = 2 + oscillation;
      pointLightRef.current.position.z = 2 + oscillation * 0.5;
    }
  });

  // Performance-based lighting setup
  const getLightingConfig = () => {
    switch (performanceMode) {
      case 'low':
        return {
          ambientIntensity: 0.6,
          directionalIntensity: 0.8,
          pointLightCount: 0,
          shadowMapSize: 512,
          enableShadows: false
        };
      case 'medium':
        return {
          ambientIntensity: 0.4,
          directionalIntensity: 1.0,
          pointLightCount: 1,
          shadowMapSize: 1024,
          enableShadows: true
        };
      default:
        return {
          ambientIntensity: 0.3,
          directionalIntensity: 1.2,
          pointLightCount: 2,
          shadowMapSize: 2048,
          enableShadows: true
        };
    }
  };

  const config = getLightingConfig();

  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight 
        intensity={config.ambientIntensity} 
        color={color}
      />
      
      {/* Main directional light (key light) */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={config.directionalIntensity}
        color={color}
        castShadow={config.enableShadows}
        shadow-mapSize-width={config.shadowMapSize}
        shadow-mapSize-height={config.shadowMapSize}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      
      {/* Fill light for softer shadows */}
      {config.pointLightCount >= 1 && (
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.4}
          color="#66D9EF" // ECE blue accent
        />
      )}
      
      {/* Accent point light */}
      {config.pointLightCount >= 2 && (
        <pointLight
          ref={pointLightRef}
          position={[2, 3, 2]}
          intensity={0.6}
          color="#F92672" // ECE pink accent
          distance={10}
          decay={2}
        />
      )}
      
      {/* Rim light for edge definition */}
      {performanceMode === 'high' && (
        <directionalLight
          position={[0, -10, -5]}
          intensity={0.3}
          color="#A6E22E" // ECE green accent
        />
      )}
    </>
  );
}
