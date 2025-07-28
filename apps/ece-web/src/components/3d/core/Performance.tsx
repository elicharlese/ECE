'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PerformanceProps {
  onPerformanceChange?: (mode: 'high' | 'medium' | 'low') => void;
  isLowPerformance?: boolean;
  targetFPS?: number;
  sampleSize?: number;
}

export function Performance({
  onPerformanceChange,
  isLowPerformance = false,
  targetFPS = 60,
  sampleSize = 60
}: PerformanceProps) {
  const performanceRef = useRef({
    frameCount: 0,
    lastTime: performance.now(),
    frameTimes: [] as number[],
    averageFPS: 60,
    lastPerformanceMode: 'high' as 'high' | 'medium' | 'low'
  });

  const { gl } = useThree();

  useFrame(() => {
    const current = performanceRef.current;
    const now = performance.now();
    const delta = now - current.lastTime;
    
    current.frameCount++;
    current.frameTimes.push(delta);
    
    // Keep only the last N frame times for rolling average
    if (current.frameTimes.length > sampleSize) {
      current.frameTimes.shift();
    }
    
    // Calculate average FPS every 30 frames
    if (current.frameCount % 30 === 0 && current.frameTimes.length > 10) {
      const averageFrameTime = current.frameTimes.reduce((a, b) => a + b, 0) / current.frameTimes.length;
      current.averageFPS = 1000 / averageFrameTime;
      
      // Determine performance mode based on FPS
      let newMode: 'high' | 'medium' | 'low' = 'high';
      
      if (current.averageFPS < 25) {
        newMode = 'low';
      } else if (current.averageFPS < 45) {
        newMode = 'medium';
      }
      
      // Only trigger callback if mode changed
      if (newMode !== current.lastPerformanceMode && onPerformanceChange) {
        onPerformanceChange(newMode);
        current.lastPerformanceMode = newMode;
        
        // Adjust renderer settings based on performance
        adjustRendererSettings(gl, newMode);
      }
    }
    
    current.lastTime = now;
  });

  const adjustRendererSettings = (
    renderer: THREE.WebGLRenderer, 
    mode: 'high' | 'medium' | 'low'
  ) => {
    switch (mode) {
      case 'low':
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        renderer.shadowMap.enabled = false;
        // Antialiasing is set during renderer creation, cannot be changed at runtime
        break;
      case 'medium':
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;
        break;
      default:
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        break;
    }
  };

  // Monitor memory usage
  useEffect(() => {
    if (isLowPerformance) return;

    const checkMemory = () => {
      // @ts-ignore - Performance memory is experimental
      if (performance.memory) {
        // @ts-ignore
        const memoryInfo = performance.memory;
        const usedMemoryMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
        const totalMemoryMB = memoryInfo.totalJSHeapSize / 1024 / 1024;
        
        // If using more than 80% of available memory, switch to low performance
        if (usedMemoryMB / totalMemoryMB > 0.8 && onPerformanceChange) {
          onPerformanceChange('low');
        }
      }
    };

    const interval = setInterval(checkMemory, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [isLowPerformance, onPerformanceChange]);

  // This component doesn't render anything visible
  return null;
}
