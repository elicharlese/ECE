// Utility functions for 3D integration - SSR safe
export const scene3DUtils = {
  // Check if device supports 3D
  isSupported: (): boolean => {
    if (typeof window === "undefined") return false;
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
    if (typeof window === "undefined") return 'low';
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
