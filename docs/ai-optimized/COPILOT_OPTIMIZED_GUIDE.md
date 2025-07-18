# ECE Trading Cards - AI-Optimized Development Guide

## Overview
This documentation is structured specifically for **GitHub Copilot** and AI-assisted development. Each section uses semantic HTML, standardized terminology, and context-rich examples to maximize AI suggestion accuracy.

## Table of Contents
- [3D Integration Guide](#3d-integration-guide)
- [Component Architecture](#component-architecture)
- [Beach Monokai Theme System](#beach-monokai-theme-system)
- [Performance Optimization](#performance-optimization)
- [API Integration Patterns](#api-integration-patterns)

---

## 3D Integration Guide

### Spline Scene Integration
The ECE platform uses **Spline** for 3D content with performance-optimized loading and fallback mechanisms.

#### Basic Spline Scene Component
```tsx
import { SplineScene } from '@/components/3d';

// Primary 3D scene with automatic quality detection
function MyComponent() {
  return (
    <SplineScene
      scene="https://prod.spline.design/your-scene-url"
      quality="auto"
      interactive={true}
      onLoad={() => console.log('3D scene loaded')}
      fallback={<Fallback2DComponent />}
    />
  );
}
```

#### Advanced Card 3D Integration
```tsx
import { Card3DInteractive, Card3DData } from '@/components/3d';

// Interactive 3D trading cards with Tinder-style mechanics
const cardData: Card3DData = {
  id: 'unique-card-id',
  name: 'Card Name',
  rarity: 'legendary', // 'common' | 'rare' | 'epic' | 'legendary'
  splineUrl: 'https://prod.spline.design/card-model-url',
  stats: { power: 95, defense: 88, speed: 92 },
  description: 'Card description text'
};

function CardShowcase() {
  return (
    <Card3DInteractive
      cards={[cardData]}
      enableSwipe={true}
      showStats={true}
      onCardSelect={(card) => console.log('Selected:', card)}
      onCardSwipe={(direction, card) => console.log('Swiped:', direction, card)}
    />
  );
}
```

#### Performance-Optimized 3D Provider
```tsx
import { Performance3DProvider, usePerformance3D } from '@/components/3d';

// Wrap entire app for performance monitoring and optimization
function App() {
  return (
    <Performance3DProvider fallbackQuality="medium">
      <YourAppContent />
    </Performance3DProvider>
  );
}

// Use performance hook in components
function Component3D() {
  const { currentQuality, actualFps, optimizeForDevice } = usePerformance3D();
  
  useEffect(() => {
    optimizeForDevice(); // Auto-optimize on mount
  }, []);
  
  return <div>Current quality: {currentQuality}</div>;
}
```

---

## Component Architecture

### Beach Monokai Color System
ECE uses a **Beach Monokai** color palette with specific semantic meanings:

#### Primary Colors
```css
/* Background colors */
--beach-dark: #272822;      /* Main background, primary canvas */
--beach-light: #F8EFD6;     /* Light background, text backgrounds */

/* Text colors */
--beach-primary: #F8EFD6;   /* Primary text on dark backgrounds */
--beach-muted: #75715E;     /* Muted text, placeholder content */

/* Accent colors */
--beach-accent: #F92672;    /* Buttons, highlights, alerts */
--beach-success: #A6E22E;   /* Success states, floating elements */
--beach-info: #66D9EF;      /* Info states, links, sky gradients */
--beach-warning: #E6DB74;   /* Warning states, secondary backgrounds */
--beach-error: #FD5C63;     /* Error states, destructive actions */
```

#### Gradient Presets
```css
/* Sunset Horizon */
.gradient-sunset { background: linear-gradient(90deg, #F92672, #FD5C63); }

/* Tide Line */
.gradient-tide { background: linear-gradient(90deg, #66D9EF, #3EBA7C); }

/* Sand to Surf */
.gradient-sand { background: linear-gradient(180deg, #F8EFD6, #819AFF); }
```

#### Usage in Components
```tsx
// Beach Monokai themed button
function BeachButton({ children, variant = 'accent' }: ButtonProps) {
  const variants = {
    accent: 'bg-[#F92672] text-[#F8EFD6] hover:bg-[#FD5C63]',
    success: 'bg-[#A6E22E] text-[#272822] hover:bg-[#3EBA7C]',
    info: 'bg-[#66D9EF] text-[#272822] hover:bg-[#819AFF]'
  };
  
  return (
    <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]}`}>
      {children}
    </button>
  );
}
```

---

## Performance Optimization

### 3D Performance Guidelines
Follow these patterns for optimal 3D performance across devices:

#### Quality Adaptation
```tsx
// Automatic quality detection and adjustment
import { qualityPresets, usePerformance3D } from '@/components/3d';

function Optimized3DComponent() {
  const { currentQuality, deviceCapabilities } = usePerformance3D();
  
  // Get quality settings
  const settings = qualityPresets[currentQuality];
  
  return (
    <SplineScene
      scene="your-scene-url"
      quality={currentQuality}
      renderScale={settings.renderScale}
      interactive={deviceCapabilities.isHighEnd}
    />
  );
}
```

#### Memory Management
```tsx
// Preload and cache 3D scenes
import { scene3DUtils } from '@/components/3d';

async function preloadCriticalScenes() {
  const scenes = [
    'https://prod.spline.design/hero-scene',
    'https://prod.spline.design/card-showcase'
  ];
  
  const loadPromises = scenes.map(scene => scene3DUtils.preloadScene(scene));
  await Promise.all(loadPromises);
}
```

#### Fallback Mechanisms
```tsx
// Progressive enhancement with 2D fallbacks
function Progressive3DHero() {
  const is3DSupported = scene3DUtils.isSupported();
  
  if (!is3DSupported) {
    return <Fallback2DHero />;
  }
  
  return (
    <HeroScene3D
      fallback={<Fallback2DHero />}
      onError={() => console.log('3D failed, using 2D fallback')}
    />
  );
}
```

---

## API Integration Patterns

### Spline API Integration
```tsx
// Dynamic 3D content through Spline API
async function updateSplineScene(sceneId: string, updates: any) {
  const response = await fetch(`/api/spline/${sceneId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  
  return response.json();
}

// React hook for Spline API
function useSplineContent(sceneId: string) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/spline/${sceneId}`)
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      });
  }, [sceneId]);
  
  return { content, loading, updateContent: updateSplineScene };
}
```

### Card Data API
```tsx
// Trading card data structure
interface TradingCard {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  splineUrl: string;
  stats: {
    power: number;
    defense: number;
    speed: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    owner: string;
    marketValue: number;
  };
}

// API hooks for cards
function useCardCollection() {
  // Implementation details...
}

function useCardMarketplace() {
  // Implementation details...
}
```

---

## Animation and Interaction Patterns

### GSAP Integration
```tsx
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

// GSAP timeline for entrance animations
function AnimatedComponent() {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(elementRef.current, 
      { opacity: 0, y: 50, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1.2, 
        ease: "power3.out" 
      }
    );
    
    return () => tl.kill();
  }, []);
  
  return <div ref={elementRef}>Animated content</div>;
}
```

### Framer Motion Integration
```tsx
import { motion, AnimatePresence } from 'framer-motion';

// Beach-themed animations
const waveAnimation = {
  scale: [1, 1.05, 1],
  rotate: [0, 2, -2, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

function WaveElement() {
  return (
    <motion.div
      animate={waveAnimation}
      className="bg-gradient-tide rounded-full"
    >
      Wave content
    </motion.div>
  );
}
```

---

## Testing and Quality Assurance

### 3D Component Testing
```tsx
import { render, screen } from '@testing-library/react';
import { Performance3DProvider } from '@/components/3d';

// Test 3D components with performance provider
function renderWith3DProvider(component: React.ReactNode) {
  return render(
    <Performance3DProvider fallbackQuality="low">
      {component}
    </Performance3DProvider>
  );
}

test('3D scene loads with fallback', async () => {
  renderWith3DProvider(<SplineScene scene="test-url" />);
  // Test implementation...
});
```

### Performance Testing
```tsx
// Monitor 3D performance in tests
import { qualityPresets } from '@/components/3d';

test('quality presets are valid', () => {
  Object.values(qualityPresets).forEach(preset => {
    expect(preset.renderScale).toBeGreaterThan(0);
    expect(preset.renderScale).toBeLessThanOrEqual(2);
  });
});
```

---

## Deployment and Build Optimization

### Next.js Configuration for 3D
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline', 'three'],
  },
  webpack: (config) => {
    // Optimize 3D library bundles
    config.resolve.alias = {
      ...config.resolve.alias,
      'three/examples/jsm': 'three/examples/jsm',
    };
    return config;
  },
};
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SPLINE_API_KEY=your_spline_api_key
NEXT_PUBLIC_3D_QUALITY_OVERRIDE=auto
NEXT_PUBLIC_ENABLE_3D_DEBUG=false
```

---

## Accessibility and Fallbacks

### 3D Accessibility
```tsx
// Accessible 3D components
function Accessible3DScene({ scene, alt }: { scene: string; alt: string }) {
  return (
    <div role="img" aria-label={alt}>
      <SplineScene
        scene={scene}
        fallback={
          <div 
            className="flex items-center justify-center h-full text-[#F8EFD6]"
            aria-label={alt}
          >
            {alt}
          </div>
        }
      />
    </div>
  );
}
```

### Reduced Motion Support
```tsx
// Respect user's motion preferences
function MotionSensitive3D() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  return (
    <SplineScene
      scene="scene-url"
      autoplay={!prefersReducedMotion}
      interactive={!prefersReducedMotion}
    />
  );
}
```

---

## Keywords for AI Assistance
<!-- 
These keywords help GitHub Copilot provide better suggestions:
3D integration, Spline scenes, trading cards, Beach Monokai theme,
performance optimization, GSAP animations, Framer Motion,
accessibility, fallback mechanisms, quality adaptation,
React hooks, TypeScript interfaces, Next.js configuration
-->

## Troubleshooting Common Issues

### 3D Scene Not Loading
1. **Check WebGL support**: Use `scene3DUtils.isSupported()`
2. **Verify Spline URLs**: Ensure scenes are published and accessible
3. **Monitor performance**: Use `Performance3DMonitor` for debugging

### Performance Issues
1. **Lower quality settings**: Use `qualityPresets.low` for older devices
2. **Enable fallbacks**: Always provide 2D alternatives
3. **Monitor FPS**: Target 30+ FPS for smooth experience

### Theme Color Issues
1. **Use CSS variables**: Reference Beach Monokai color system
2. **Check contrast ratios**: Ensure accessibility compliance
3. **Test dark/light modes**: Verify theme switching works correctly

---

*Last updated: July 18, 2025*
*AI Optimization Level: Advanced*
*Copilot Compatibility: ✅ Optimized*
