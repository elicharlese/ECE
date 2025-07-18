'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Performance3DState {
  deviceCapabilities: {
    isHighEnd: boolean;
    supportsWebGL2: boolean;
    maxTextureSize: number;
    availableMemory: number;
    hardwareConcurrency: number;
  };
  networkConditions: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  currentQuality: 'low' | 'medium' | 'high' | 'ultra';
  isOptimized: boolean;
  fpsTarget: number;
  actualFps: number;
}

interface Performance3DContextType extends Performance3DState {
  updateQuality: (quality: Performance3DState['currentQuality']) => void;
  optimizeForDevice: () => void;
  reportPerformance: (fps: number, loadTime: number) => void;
}

// Create context
const Performance3DContext = createContext<Performance3DContextType | null>(null);

// Custom hook
export const usePerformance3D = () => {
  const context = useContext(Performance3DContext);
  if (!context) {
    throw new Error('usePerformance3D must be used within Performance3DProvider');
  }
  return context;
};

interface Performance3DProviderProps {
  children: ReactNode;
  fallbackQuality?: Performance3DState['currentQuality'];
}

/**
 * Performance 3D Provider for ECE Trading Cards
 * 
 * Comprehensive performance monitoring and optimization system:
 * - Real-time device capability detection
 * - Network condition monitoring
 * - Adaptive quality scaling
 * - Frame rate monitoring and optimization
 * - Memory usage tracking
 * - Automated fallback mechanisms
 */
export function Performance3DProvider({
  children,
  fallbackQuality = 'medium'
}: Performance3DProviderProps) {
  const [state, setState] = useState<Performance3DState>({
    deviceCapabilities: {
      isHighEnd: false,
      supportsWebGL2: false,
      maxTextureSize: 0,
      availableMemory: 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 4
    },
    networkConditions: {
      effectiveType: '4g',
      downlink: 10,
      rtt: 100
    },
    currentQuality: fallbackQuality,
    isOptimized: false,
    fpsTarget: 60,
    actualFps: 0
  });

  // Initialize device capabilities
  useEffect(() => {
    const detectCapabilities = async () => {
      // WebGL detection
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      const gl2 = canvas.getContext('webgl2');
      
      if (!gl) {
        setState(prev => ({
          ...prev,
          currentQuality: 'low',
          deviceCapabilities: {
            ...prev.deviceCapabilities,
            supportsWebGL2: false,
            isHighEnd: false
          }
        }));
        return;
      }

      // Get max texture size
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      
      // Memory estimation
      const estimateMemory = () => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        // Fallback estimation based on other factors
        return maxTextureSize > 4096 ? 8000 : 4000;
      };

      // Device capability scoring
      const deviceScore = calculateDeviceScore({
        maxTextureSize,
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
        memoryEstimate: estimateMemory(),
        supportsWebGL2: !!gl2,
        userAgent: navigator.userAgent
      });

      setState(prev => ({
        ...prev,
        deviceCapabilities: {
          isHighEnd: deviceScore > 75,
          supportsWebGL2: !!gl2,
          maxTextureSize,
          availableMemory: estimateMemory(),
          hardwareConcurrency: navigator.hardwareConcurrency || 4
        },
        currentQuality: deviceScore > 85 ? 'ultra' : 
                       deviceScore > 65 ? 'high' : 
                       deviceScore > 45 ? 'medium' : 'low'
      }));
    };

    detectCapabilities();
  }, []);

  // Network monitoring
  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setState(prev => ({
          ...prev,
          networkConditions: {
            effectiveType: connection.effectiveType || '4g',
            downlink: connection.downlink || 10,
            rtt: connection.rtt || 100
          }
        }));
      }
    };

    updateNetworkInfo();
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setState(prev => ({
          ...prev,
          actualFps: fps,
          // Auto-adjust quality based on performance
          currentQuality: fps < 30 && prev.currentQuality !== 'low' ? 
            prev.currentQuality === 'ultra' ? 'high' :
            prev.currentQuality === 'high' ? 'medium' : 'low' :
            prev.currentQuality
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrame = requestAnimationFrame(measureFPS);
    };

    measureFPS();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const updateQuality = (quality: Performance3DState['currentQuality']) => {
    setState(prev => ({
      ...prev,
      currentQuality: quality,
      fpsTarget: quality === 'ultra' ? 60 : 
                 quality === 'high' ? 60 : 
                 quality === 'medium' ? 45 : 30
    }));
  };

  const optimizeForDevice = () => {
    const { deviceCapabilities, networkConditions } = state;
    
    // Calculate optimal quality based on multiple factors
    let optimalQuality: Performance3DState['currentQuality'] = 'medium';
    
    // Device-based optimization
    if (deviceCapabilities.isHighEnd && deviceCapabilities.supportsWebGL2) {
      optimalQuality = 'ultra';
    } else if (deviceCapabilities.maxTextureSize >= 4096) {
      optimalQuality = 'high';
    } else if (deviceCapabilities.maxTextureSize >= 2048) {
      optimalQuality = 'medium';
    } else {
      optimalQuality = 'low';
    }
    
    // Network-based downgrading
    if (networkConditions.effectiveType === '2g' || networkConditions.downlink < 1) {
      optimalQuality = 'low';
    } else if (networkConditions.effectiveType === '3g' || networkConditions.downlink < 5) {
      optimalQuality = optimalQuality === 'ultra' ? 'high' : 
                      optimalQuality === 'high' ? 'medium' : optimalQuality;
    }
    
    updateQuality(optimalQuality);
    
    setState(prev => ({
      ...prev,
      isOptimized: true
    }));
  };

  const reportPerformance = (fps: number, loadTime: number) => {
    setState(prev => ({
      ...prev,
      actualFps: fps
    }));
    
    // Performance analytics (could integrate with analytics service)
    console.log('3D Performance Report:', {
      fps,
      loadTime,
      quality: state.currentQuality,
      device: state.deviceCapabilities
    });
  };

  const contextValue: Performance3DContextType = {
    ...state,
    updateQuality,
    optimizeForDevice,
    reportPerformance
  };

  return (
    <Performance3DContext.Provider value={contextValue}>
      {children}
    </Performance3DContext.Provider>
  );
}

// Utility function for device scoring
function calculateDeviceScore(params: {
  maxTextureSize: number;
  hardwareConcurrency: number;
  memoryEstimate: number;
  supportsWebGL2: boolean;
  userAgent: string;
}): number {
  let score = 0;
  
  // Texture size scoring (max 30 points)
  score += Math.min(30, (params.maxTextureSize / 8192) * 30);
  
  // CPU cores scoring (max 20 points)
  score += Math.min(20, (params.hardwareConcurrency / 8) * 20);
  
  // Memory scoring (max 25 points)
  score += Math.min(25, (params.memoryEstimate / 8000) * 25);
  
  // WebGL2 support (15 points)
  score += params.supportsWebGL2 ? 15 : 0;
  
  // Device type detection (max 10 points)
  const ua = params.userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android')) {
    score *= 0.7; // Mobile penalty
  } else if (ua.includes('ipad') || ua.includes('tablet')) {
    score *= 0.85; // Tablet slight penalty
  }
  
  return Math.min(100, score);
}

// Quality preset configurations
export const qualityPresets = {
  low: {
    shadows: false,
    antialiasing: false,
    textureQuality: 0.5,
    modelComplexity: 0.3,
    particleCount: 50,
    maxLights: 2,
    renderScale: 0.75
  },
  medium: {
    shadows: true,
    antialiasing: false,
    textureQuality: 0.75,
    modelComplexity: 0.6,
    particleCount: 100,
    maxLights: 4,
    renderScale: 1.0
  },
  high: {
    shadows: true,
    antialiasing: true,
    textureQuality: 1.0,
    modelComplexity: 0.8,
    particleCount: 200,
    maxLights: 6,
    renderScale: 1.0
  },
  ultra: {
    shadows: true,
    antialiasing: true,
    textureQuality: 1.0,
    modelComplexity: 1.0,
    particleCount: 300,
    maxLights: 8,
    renderScale: 1.25
  }
};

// Performance monitoring component
interface Performance3DMonitorProps {
  onThresholdReached?: (metric: string, value: number) => void;
  showDebugInfo?: boolean;
}

export function Performance3DMonitor({ 
  onThresholdReached, 
  showDebugInfo = false 
}: Performance3DMonitorProps) {
  const { 
    actualFps, 
    currentQuality, 
    deviceCapabilities, 
    networkConditions 
  } = usePerformance3D();

  useEffect(() => {
    // Monitor performance thresholds
    if (actualFps < 30) {
      onThresholdReached?.('fps', actualFps);
    }
  }, [actualFps, onThresholdReached]);

  if (!showDebugInfo) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-[#272822]/90 backdrop-blur-md text-[#F8EFD6] p-3 rounded-lg text-xs font-mono border border-[#75715E]/30 z-50">
      <div className="grid grid-cols-2 gap-2">
        <div>FPS: <span className={actualFps < 30 ? 'text-[#FD5C63]' : 'text-[#A6E22E]'}>{actualFps}</span></div>
        <div>Quality: <span className="text-[#66D9EF]">{currentQuality}</span></div>
        <div>WebGL2: <span className={deviceCapabilities.supportsWebGL2 ? 'text-[#A6E22E]' : 'text-[#FD5C63]'}>
          {deviceCapabilities.supportsWebGL2 ? 'Yes' : 'No'}
        </span></div>
        <div>Network: <span className="text-[#E6DB74]">{networkConditions.effectiveType}</span></div>
      </div>
    </div>
  );
}
