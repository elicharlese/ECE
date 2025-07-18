'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Layers, 
  Sparkles, 
  Zap, 
  Globe,
  Smartphone,
  Monitor,
  Cpu,
  Download,
  Star
} from 'lucide-react';
import { Spline } from '@splinetool/react-spline';

interface Feature3DIconProps {
  type: 'trading' | 'discover' | 'marketplace' | 'profile' | 'wallet' | 'mobile' | 'desktop' | 'ai' | 'rewards' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export function Feature3DIcon({ 
  type, 
  size = 'md', 
  animated = true, 
  className = '' 
}: Feature3DIconProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const getFeatureConfig = () => {
    switch (type) {
      case 'trading':
        return {
          icon: Box,
          color: 'text-ece-accent',
          bgColor: 'bg-ece-accent/20',
          splineUrl: 'https://prod.spline.design/6Wq1Q5V8KjIdea0H/scene.splinecode',
          fallbackGradient: 'from-ece-accent to-ece-error'
        };
      case 'discover':
        return {
          icon: Layers,
          color: 'text-ece-success',
          bgColor: 'bg-ece-success/20',
          splineUrl: 'https://prod.spline.design/2KjIdea0H6Wq1Q5V8/scene.splinecode',
          fallbackGradient: 'from-ece-success to-ece-info'
        };
      case 'marketplace':
        return {
          icon: Globe,
          color: 'text-ece-info',
          bgColor: 'bg-ece-info/20',
          splineUrl: 'https://prod.spline.design/8KjIdea0H6Wq1Q5V2/scene.splinecode',
          fallbackGradient: 'from-ece-info to-ece-accent'
        };
      case 'profile':
        return {
          icon: Star,
          color: 'text-ece-warning',
          bgColor: 'bg-ece-warning/20',
          splineUrl: 'https://prod.spline.design/4KjIdea0H6Wq1Q5V9/scene.splinecode',
          fallbackGradient: 'from-ece-warning to-ece-success'
        };
      case 'wallet':
        return {
          icon: Zap,
          color: 'text-ece-accent',
          bgColor: 'bg-ece-accent/20',
          splineUrl: 'https://prod.spline.design/5KjIdea0H6Wq1Q5V3/scene.splinecode',
          fallbackGradient: 'from-ece-accent to-ece-warning'
        };
      case 'mobile':
        return {
          icon: Smartphone,
          color: 'text-ece-info',
          bgColor: 'bg-ece-info/20',
          splineUrl: 'https://prod.spline.design/7KjIdea0H6Wq1Q5V1/scene.splinecode',
          fallbackGradient: 'from-ece-info to-ece-success'
        };
      case 'desktop':
        return {
          icon: Monitor,
          color: 'text-ece-success',
          bgColor: 'bg-ece-success/20',
          splineUrl: 'https://prod.spline.design/3KjIdea0H6Wq1Q5V6/scene.splinecode',
          fallbackGradient: 'from-ece-success to-ece-accent'
        };
      case 'ai':
        return {
          icon: Cpu,
          color: 'text-ece-error',
          bgColor: 'bg-ece-error/20',
          splineUrl: 'https://prod.spline.design/9KjIdea0H6Wq1Q5V4/scene.splinecode',
          fallbackGradient: 'from-ece-error to-ece-info'
        };
      case 'rewards':
        return {
          icon: Sparkles,
          color: 'text-ece-warning',
          bgColor: 'bg-ece-warning/20',
          splineUrl: 'https://prod.spline.design/1KjIdea0H6Wq1Q5V7/scene.splinecode',
          fallbackGradient: 'from-ece-warning to-ece-error'
        };
      case 'premium':
        return {
          icon: Download,
          color: 'text-ece-accent',
          bgColor: 'bg-ece-accent/20',
          splineUrl: 'https://prod.spline.design/0KjIdea0H6Wq1Q5V8/scene.splinecode',
          fallbackGradient: 'from-ece-accent to-ece-success'
        };
      default:
        return {
          icon: Box,
          color: 'text-ece-muted',
          bgColor: 'bg-ece-muted/20',
          splineUrl: null,
          fallbackGradient: 'from-ece-muted to-ece-dark'
        };
    }
  };

  const config = getFeatureConfig();
  const IconComponent = config.icon;

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* 3D Spline Scene */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <Spline3DIcon 
          splineUrl={config.splineUrl} 
          fallbackGradient={config.fallbackGradient}
          animated={animated}
        />
      </div>
      
      {/* Fallback Icon Overlay */}
      <div className={`
        absolute inset-0 flex items-center justify-center
        ${config.bgColor} rounded-xl backdrop-blur-sm
        transition-opacity duration-300
      `}>
        <IconComponent className={`w-1/2 h-1/2 ${config.color}`} />
      </div>
      
      {/* Animated Glow Effect */}
      {animated && (
        <motion.div
          className={`
            absolute inset-0 rounded-xl opacity-50
            bg-gradient-to-r ${config.fallbackGradient}
          `}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
}

interface Spline3DIconProps {
  splineUrl: string | null;
  fallbackGradient: string;
  animated: boolean;
}

function Spline3DIcon({ splineUrl, fallbackGradient, animated }: Spline3DIconProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  if (!splineUrl || hasError) {
    return (
      <motion.div
        className={`w-full h-full bg-gradient-to-br ${fallbackGradient} rounded-xl`}
        animate={animated ? {
          background: [
            `linear-gradient(45deg, var(--ece-accent), var(--ece-success))`,
            `linear-gradient(45deg, var(--ece-success), var(--ece-info))`,
            `linear-gradient(45deg, var(--ece-info), var(--ece-accent))`
          ]
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className={`w-full h-full bg-gradient-to-br ${fallbackGradient} rounded-xl animate-pulse`} />
      )}
      
      <Spline
        scene={splineUrl}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full rounded-xl transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

// Feature Grid Component
export function Feature3DGrid() {
  const features = [
    { type: 'trading' as const, title: 'Trading Cards', description: 'Collect and trade digital cards' },
    { type: 'discover' as const, title: 'Discover', description: 'Find new cards and collections' },
    { type: 'marketplace' as const, title: 'Marketplace', description: 'Buy and sell with confidence' },
    { type: 'profile' as const, title: 'Profile', description: 'Showcase your collection' },
    { type: 'wallet' as const, title: 'ECE Wallet', description: 'Secure digital wallet' },
    { type: 'rewards' as const, title: 'Rewards', description: 'Earn tokens and badges' },
    { type: 'mobile' as const, title: 'Mobile App', description: 'Trade on the go' },
    { type: 'ai' as const, title: 'AI Powered', description: 'Smart recommendations' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {features.map((feature, index) => (
        <motion.div
          key={feature.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center group cursor-pointer"
        >
          <div className="mb-3 flex justify-center">
            <Feature3DIcon 
              type={feature.type} 
              size="lg" 
              animated={true}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h3 className="text-ece-light font-semibold mb-1">{feature.title}</h3>
          <p className="text-ece-muted text-sm">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default Feature3DIcon;
