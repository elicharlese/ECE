'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { Camera } from './Camera';
import { Lighting } from './Lighting';
import { Performance } from './Performance';

interface SceneProps {
  children: React.ReactNode;
  enableControls?: boolean;
  enablePerformanceMonitor?: boolean;
  environment?: 'studio' | 'sunset' | 'forest' | 'city' | 'warehouse';
  shadows?: boolean;
  antialias?: boolean;
  dpr?: [number, number];
  className?: string;
  onPerformanceDetected?: (mode: 'high' | 'medium' | 'low') => void;
}

export function Scene({
  children,
  enableControls = true,
  enablePerformanceMonitor = false,
  environment = 'studio',
  shadows = true,
  antialias = true,
  dpr = [1, 2],
  className = '',
  onPerformanceDetected,
}: SceneProps) {
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('medium');

  // Detect device performance on mount
  const detectDevicePerformance = (): 'high' | 'medium' | 'low' => {
    if (typeof window === 'undefined') return 'medium';

    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 4;
    
    // Check memory (if available)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Check for mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Performance classification
    if (cores >= 8 && memory >= 8 && !isMobile) return 'high';
    if (cores >= 4 && memory >= 4) return 'medium';
    return 'low';
  };

  useEffect(() => {
    const performance = detectDevicePerformance();
    setPerformanceMode(performance);
    onPerformanceDetected?.(performance);
  }, [onPerformanceDetected]);

  // Performance-based settings
  const getPerformanceSettings = () => {
    switch (performanceMode) {
      case 'low':
        return {
          shadows: false,
          antialias: false,
          dpr: [1, 1] as [number, number],
        };
      case 'medium':
        return {
          shadows: true,
          antialias: true,
          dpr: [1, 1.5] as [number, number],
        };
      case 'high':
        return {
          shadows: true,
          antialias: true,
          dpr: [1, 2] as [number, number],
        };
    }
  };

  const settings = getPerformanceSettings();

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows={shadows && settings.shadows}
        dpr={settings.dpr}
        gl={{
          antialias: antialias && settings.antialias,
          alpha: true,
          powerPreference: performanceMode === 'high' ? 'high-performance' : 'default',
        }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        className="w-full h-full"
      >
        {enablePerformanceMonitor && (
          <Perf position="top-left" />
        )}

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Camera />
        <Lighting />
        <Environment preset={environment} />

        {enableControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            dampingFactor={0.05}
            enableDamping={true}
          />
        )}

        <Performance onPerformanceChange={setPerformanceMode} />

        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}