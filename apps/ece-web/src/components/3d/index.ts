// ECE Trading Cards 3D Components
// Advanced 3D integration for Patch 3 implementation

export { default as SplineScene } from './SplineScene';
export { default as HeroScene3D, heroAnimations } from './HeroScene3D';
export { default as Card3DInteractive } from './Card3DInteractive';
export { AuthScene3D } from './auth-scene';
export { NFTCard3DModel } from './nft-card-3d';
export { NFTCard3DGallery } from './nft-card-gallery';
export { 
  Performance3DProvider, 
  Performance3DMonitor, 
  usePerformance3D,
  qualityPresets 
} from './Performance3DProvider';

// Re-export utility hooks
export { useSplineInteraction } from './SplineScene';

// Type definitions for 3D components
export interface SplineSceneProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  interactive?: boolean;
  autoplay?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'auto';
}

export interface Card3DData {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  splineUrl: string;
  stats: {
    power: number;
    defense: number;
    speed: number;
  };
  description: string;
  imageUrl?: string;
}

export interface HeroScene3DProps {
  className?: string;
  onInteraction?: (type: string, data?: any) => void;
}

// 3D Component Configuration
export const scene3DConfig = {
  // Spline scene URLs (to be replaced with actual Spline URLs)
  scenes: {
    hero: 'https://prod.spline.design/ece-hero-main',
    cardShowcase: 'https://prod.spline.design/ece-card-showcase',
    marketplace: 'https://prod.spline.design/ece-marketplace',
    trading: 'https://prod.spline.design/ece-trading-interface'
  },
  
  // Performance presets
  quality: {
    auto: true,
    fallback: 'medium' as const,
    adaptiveThreshold: 30 // FPS threshold for auto quality adjustment
  },
  
  // Animation settings
  animations: {
    enableParallax: true,
    enableGSAP: true,
    enableFramerMotion: true,
    waveIntensity: 0.8,
    transitionDuration: 0.6
  }
};

// Utility functions for 3D integration
export const scene3DUtils = {
  // Check if device supports 3D
  isSupported: (): boolean => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  },
  
  // Preload 3D scenes
  preloadScene: async (sceneUrl: string): Promise<boolean> => {
    try {
      // Implementation would depend on Spline API
      console.log(`Preloading scene: ${sceneUrl}`);
      return true;
    } catch (error) {
      console.error('Failed to preload scene:', error);
      return false;
    }
  },
  
  // Get optimal quality for device
  getOptimalQuality: (): 'low' | 'medium' | 'high' | 'ultra' => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    if (!gl) return 'low';
    
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const cores = navigator.hardwareConcurrency || 4;
    
    if (maxTextureSize >= 8192 && cores >= 8) return 'ultra';
    if (maxTextureSize >= 4096 && cores >= 6) return 'high';
    if (maxTextureSize >= 2048 && cores >= 4) return 'medium';
    return 'low';
  }
};
