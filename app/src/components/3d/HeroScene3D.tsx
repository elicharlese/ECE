'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import SplineScene from './SplineScene';
import { gsap } from 'gsap';

interface HeroScene3DProps {
  className?: string;
  onInteraction?: (type: string, data?: any) => void;
}

/**
 * ECE Trading Cards 3D Hero Scene
 * 
 * Advanced 3D hero section featuring:
 * - Immersive Spline 3D environments
 * - Parallax scrolling effects with GSAP
 * - Interactive trading card demonstrations
 * - Beach Monokai themed overlays and controls
 * - Performance-optimized progressive loading
 * - Accessibility-first design with fallbacks
 */
export default function HeroScene3D({ 
  className = '',
  onInteraction 
}: HeroScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [currentScene, setCurrentScene] = useState('hero-main');
  const [showControls, setShowControls] = useState(false);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  // GSAP timeline for entrance animations
  useEffect(() => {
    if (!containerRef.current || !overlayRef.current) return;

    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.fromTo(overlayRef.current, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.95
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
      }
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Scene configurations for different 3D experiences
  const scenes = {
    'hero-main': {
      url: 'https://prod.spline.design/your-main-hero-scene-url',
      title: 'Welcome to ECE Trading Cards',
      description: 'Experience the future of digital collectibles with immersive 3D environments'
    },
    'card-showcase': {
      url: 'https://prod.spline.design/your-card-showcase-url',
      title: 'Interactive Card Collection',
      description: 'Explore your trading cards in stunning 3D detail'
    },
    'marketplace-preview': {
      url: 'https://prod.spline.design/your-marketplace-url',
      title: 'Marketplace Experience',
      description: 'Discover, trade, and collect in our immersive marketplace'
    }
  };

  const currentSceneData = scenes[currentScene as keyof typeof scenes];

  const handleSceneChange = (sceneKey: string) => {
    setCurrentScene(sceneKey);
    onInteraction?.('scene-change', { scene: sceneKey });
  };

  const handle3DInteraction = (type: string, data?: any) => {
    setIsInteractive(true);
    onInteraction?.(type, data);
    
    // Show controls after first interaction
    if (!showControls) {
      setShowControls(true);
    }
  };

  // Fallback 2D hero for accessibility and performance
  const Fallback2DHero = () => (
    <div className="w-full h-full bg-gradient-to-br from-[#272822] via-[#3E3D32] to-[#272822] flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #66D9EF 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #A6E22E 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, #F92672 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #66D9EF 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Central content */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-[#F8EFD6] mb-6"
          animate={{ 
            textShadow: [
              '0 0 10px rgba(249, 38, 114, 0.3)',
              '0 0 20px rgba(166, 226, 46, 0.3)',
              '0 0 10px rgba(102, 217, 239, 0.3)',
              '0 0 10px rgba(249, 38, 114, 0.3)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ECE Trading Cards
        </motion.h1>
        
        <motion.p
          className="text-xl text-[#75715E] max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Experience the future of digital collectibles with cutting-edge 3D environments and immersive trading experiences.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-[#F92672] to-[#FD5C63] text-[#F8EFD6] rounded-lg font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(249, 38, 114, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Start Collecting
          </motion.button>
          
          <motion.button
            className="px-8 py-3 border-2 border-[#66D9EF] text-[#66D9EF] rounded-lg font-semibold hover:bg-[#66D9EF] hover:text-[#272822] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore 3D Demo
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Floating card elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-24 bg-gradient-to-br from-[#A6E22E]/20 to-[#66D9EF]/20 rounded-lg border border-[#75715E]/30"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden ${className}`}
      style={{ y: yTransform, opacity: opacityTransform }}
    >
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <SplineScene
          scene={currentSceneData.url}
          className="w-full h-full"
          onLoad={() => handle3DInteraction('scene-loaded')}
          onError={() => console.log('3D scene failed to load')}
          fallback={<Fallback2DHero />}
          quality="auto"
          interactive={true}
        />
      </div>

      {/* Content Overlay */}
      <motion.div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none"
        style={{ opacity: opacityTransform }}
      >
        <div className="text-center px-6 pointer-events-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-[#F8EFD6] mb-6 drop-shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "power3.out" }}
          >
            {currentSceneData.title}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-[#75715E] max-w-3xl mx-auto mb-8 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {currentSceneData.description}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[#F92672] to-[#FD5C63] text-[#F8EFD6] rounded-lg font-semibold shadow-2xl backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 15px 35px rgba(249, 38, 114, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handle3DInteraction('start-collecting')}
            >
              Enter 3D Experience
            </motion.button>
            
            <motion.button
              className="px-8 py-4 bg-[#272822]/80 backdrop-blur-sm border-2 border-[#66D9EF] text-[#66D9EF] rounded-lg font-semibold hover:bg-[#66D9EF] hover:text-[#272822] transition-colors shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handle3DInteraction('explore-marketplace')}
            >
              Explore Marketplace
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scene Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-2 bg-[#272822]/90 backdrop-blur-md rounded-full p-2 border border-[#75715E]/30">
              {Object.keys(scenes).map((sceneKey) => (
                <motion.button
                  key={sceneKey}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentScene === sceneKey
                      ? 'bg-[#F92672] text-[#F8EFD6]'
                      : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#75715E]/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSceneChange(sceneKey)}
                >
                  {sceneKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance indicator */}
      <div className="absolute top-4 right-4 z-20">
        <motion.div
          className={`w-3 h-3 rounded-full ${
            isInteractive ? 'bg-[#A6E22E]' : 'bg-[#75715E]'
          }`}
          animate={{ 
            scale: isInteractive ? [1, 1.2, 1] : 1,
            opacity: isInteractive ? [1, 0.6, 1] : 0.6
          }}
          transition={{ 
            duration: 2, 
            repeat: isInteractive ? Infinity : 0,
            ease: "easeInOut" 
          }}
        />
      </div>
    </motion.div>
  );
}

// Export animation presets for GSAP integration
export const heroAnimations = {
  entrance: (element: HTMLElement) => {
    return gsap.fromTo(element, 
      { opacity: 0, scale: 0.8, y: 50 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 1.5, 
        ease: "power3.out" 
      }
    );
  },
  
  waveBackground: (element: HTMLElement) => {
    return gsap.to(element, {
      backgroundPosition: "200% 0%",
      duration: 8,
      repeat: -1,
      ease: "none"
    });
  }
};
