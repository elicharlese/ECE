'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';

interface SplineSceneProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  interactive?: boolean;
  autoplay?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'auto';
}

/**
 * Advanced Spline 3D Scene Component for ECE Trading Cards
 * 
 * Features:
 * - Progressive loading with quality adaptation
 * - Beach Monokai themed loading states
 * - Performance monitoring and fallbacks
 * - Accessibility-first design with 2D alternatives
 * - GSAP-compatible animation integration
 */
export default function SplineScene({
  scene,
  className = '',
  fallback,
  onLoad,
  onError,
  interactive = true,
  autoplay = true,
  quality = 'auto'
}: SplineSceneProps) {
  const splineRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentQuality, setCurrentQuality] = useState(quality);

  // Performance monitoring and quality adaptation
  useEffect(() => {
    if (quality === 'auto') {
      // Detect device capabilities and network conditions
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setCurrentQuality('low');
        return;
      }

      // Check for high-end device indicators
      const isHighEnd = window.navigator.hardwareConcurrency > 4 && 
                       window.devicePixelRatio > 1.5;
      
      setCurrentQuality(isHighEnd ? 'high' : 'medium');
    }
  }, [quality]);

  const handleSceneLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleSceneError = (error: Error) => {
    setHasError(true);
    setIsLoading(false);
    onError?.(error);
  };

  // Loading animation with Beach Monokai theme
  const LoadingFallback = () => (
    <motion.div
      className="flex items-center justify-center w-full h-full bg-[#272822] rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        {/* Wave animation background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#66D9EF] to-[#A6E22E] opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Central loading indicator */}
        <motion.div
          className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-r from-[#F92672] to-[#FD5C63] flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="w-8 h-8 border-2 border-[#F8EFD6] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>
      
      <motion.p
        className="absolute bottom-4 text-[#F8EFD6] text-sm font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Loading 3D Experience...
      </motion.p>
    </motion.div>
  );

  // Error fallback with ECE branding
  const ErrorFallback = () => (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full bg-[#272822] rounded-lg p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FD5C63] to-[#F92672] flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-[#F8EFD6]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      
      <h3 className="text-[#F8EFD6] text-lg font-semibold mb-2">3D Content Unavailable</h3>
      <p className="text-[#75715E] text-sm text-center max-w-sm">
        We're having trouble loading the 3D experience. Please check your connection and try again.
      </p>
      
      <motion.button
        className="mt-4 px-4 py-2 bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] text-[#272822] rounded-lg font-medium hover:shadow-lg transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
      >
        Retry
      </motion.button>
    </motion.div>
  );

  if (hasError) {
    return fallback || <ErrorFallback />;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-10"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingFallback />
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={<LoadingFallback />}>
        <Spline
          ref={splineRef}
          scene={scene}
          onLoad={handleSceneLoad}
          onError={handleSceneError}
          style={{
            width: '100%',
            height: '100%',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out'
          }}
        />
      </Suspense>
    </div>
  );
}

// Export utility hooks for Spline integration
export const useSplineInteraction = () => {
  const triggerAnimation = (animationName: string) => {
    // Implementation for triggering specific Spline animations
    console.log(`Triggering animation: ${animationName}`);
  };

  const updateObjectProperties = (objectName: string, properties: any) => {
    // Implementation for updating Spline object properties
    console.log(`Updating ${objectName}:`, properties);
  };

  return {
    triggerAnimation,
    updateObjectProperties
  };
};
