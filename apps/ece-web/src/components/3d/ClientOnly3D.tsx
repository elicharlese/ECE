'use client'

import dynamic from 'next/dynamic'

// Dynamically import 3D components with SSR disabled
export const HeroScene3D = dynamic(() => import('./HeroScene3D').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-gradient-to-br from-monokai-blue/20 to-monokai-accent/20 flex items-center justify-center"><div className="text-monokai-accent">Loading 3D Hero...</div></div>
})

export const Card3DInteractive = dynamic(() => import('./Card3DInteractive').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-monokai-bg to-monokai-bg-dark rounded-lg flex items-center justify-center">
    <div className="text-monokai-accent">Loading 3D Card...</div>
  </div>
})

export const Performance3DProvider = dynamic(() => import('./Performance3DProvider').then(mod => ({ 
  default: mod.Performance3DProvider 
})), {
  ssr: false,
  loading: () => null
})

export const Performance3DMonitor = dynamic(() => import('./Performance3DProvider').then(mod => ({ 
  default: mod.Performance3DMonitor 
})), {
  ssr: false,
  loading: () => null
})

export const Safe3DWrapper = dynamic(() => import('./Safe3DWrapper').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gradient-to-br from-monokai-blue/20 to-monokai-accent/20 rounded-lg flex items-center justify-center"><div className="text-monokai-accent">Loading 3D Card...</div></div>
})

export const AuthScene3D = dynamic(() => import('./auth-scene').then(mod => ({ default: mod.AuthScene3D })), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gradient-to-br from-monokai-blue/20 to-monokai-accent/20 rounded-lg flex items-center justify-center"><div className="text-monokai-accent">Loading 3D Card...</div></div>
})

export const NFTCard3DModel = dynamic(() => import('./nft-card-3d').then(mod => ({ default: mod.NFTCard3DModel })), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gradient-to-br from-monokai-blue/20 to-monokai-accent/20 rounded-lg flex items-center justify-center"><div className="text-monokai-accent">Loading 3D Card...</div></div>
})

export const NFTCard3DGallery = dynamic(() => import('./nft-card-gallery').then(mod => ({ default: mod.NFTCard3DGallery })), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gradient-to-br from-monokai-blue/20 to-monokai-accent/20 rounded-lg flex items-center justify-center"><div className="text-monokai-accent">Loading 3D Gallery...</div></div>
})

// Re-export utilities
export { scene3DUtils } from './index'
