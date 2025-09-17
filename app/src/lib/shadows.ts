/**
 * ECE Enhanced Shadow Design System
 * Beach Monokai + Ocean Wave Inspired Shadows
 * Following Batch 2 UI/UX Enhancement Requirements
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Core shadow utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Beach Monokai Shadow Colors
export const shadowColors = {
  // Primary ECE Colors
  primary: 'rgba(249, 38, 114, 0.25)',     // #F92672 - ECE Pink
  secondary: 'rgba(166, 226, 46, 0.25)',   // #A6E22E - ECE Green
  info: 'rgba(102, 217, 239, 0.25)',       // #66D9EF - ECE Blue
  warning: 'rgba(230, 219, 116, 0.25)',    // #E6DB74 - ECE Yellow
  
  // Ocean Wave Colors
  oceanPrimary: 'rgba(0, 139, 139, 0.25)',     // Teal
  oceanSecondary: 'rgba(32, 178, 170, 0.25)',  // Light Sea Green
  oceanAccent: 'rgba(72, 209, 204, 0.25)',     // Medium Turquoise
  
  // Neutral Shadows
  dark: 'rgba(39, 40, 34, 0.25)',          // #272822 - Dark background
  light: 'rgba(248, 239, 214, 0.15)',      // #F8EFD6 - Light background
  muted: 'rgba(117, 113, 94, 0.2)',        // #75715E - Muted text
  
  // Glassmorphism Shadows
  glass: 'rgba(255, 255, 255, 0.1)',
  glassInverse: 'rgba(0, 0, 0, 0.1)',
} as const;

// Shadow intensity levels
export const shadowIntensity = {
  subtle: '0.1',
  light: '0.15', 
  medium: '0.25',
  strong: '0.35',
  intense: '0.5'
} as const;

// Enhanced shadow configurations
export const shadows = {
  // Basic Shadows
  none: 'shadow-none',
  
  // Soft & Smooth Shadows (Beach Monokai)
  soft: {
    sm: 'shadow-[0_1px_2px_rgba(39,40,34,0.1)]',
    md: 'shadow-[0_4px_6px_rgba(39,40,34,0.1),0_2px_4px_rgba(39,40,34,0.06)]',
    lg: 'shadow-[0_10px_15px_rgba(39,40,34,0.1),0_4px_6px_rgba(39,40,34,0.05)]',
    xl: 'shadow-[0_20px_25px_rgba(39,40,34,0.1),0_10px_10px_rgba(39,40,34,0.04)]',
    '2xl': 'shadow-[0_25px_50px_rgba(39,40,34,0.15)]'
  },
  
  // ECE Brand Shadows
  primary: {
    sm: 'shadow-[0_1px_2px_rgba(249,38,114,0.2)]',
    md: 'shadow-[0_4px_6px_rgba(249,38,114,0.2),0_2px_4px_rgba(249,38,114,0.1)]',
    lg: 'shadow-[0_10px_15px_rgba(249,38,114,0.2),0_4px_6px_rgba(249,38,114,0.1)]',
    xl: 'shadow-[0_20px_25px_rgba(249,38,114,0.2),0_10px_10px_rgba(249,38,114,0.1)]',
    glow: 'shadow-[0_0_20px_rgba(249,38,114,0.4)]'
  },
  
  secondary: {
    sm: 'shadow-[0_1px_2px_rgba(166,226,46,0.2)]',
    md: 'shadow-[0_4px_6px_rgba(166,226,46,0.2),0_2px_4px_rgba(166,226,46,0.1)]',
    lg: 'shadow-[0_10px_15px_rgba(166,226,46,0.2),0_4px_6px_rgba(166,226,46,0.1)]',
    xl: 'shadow-[0_20px_25px_rgba(166,226,46,0.2),0_10px_10px_rgba(166,226,46,0.1)]',
    glow: 'shadow-[0_0_20px_rgba(166,226,46,0.4)]'
  },
  
  info: {
    sm: 'shadow-[0_1px_2px_rgba(102,217,239,0.2)]',
    md: 'shadow-[0_4px_6px_rgba(102,217,239,0.2),0_2px_4px_rgba(102,217,239,0.1)]',
    lg: 'shadow-[0_10px_15px_rgba(102,217,239,0.2),0_4px_6px_rgba(102,217,239,0.1)]',
    xl: 'shadow-[0_20px_25px_rgba(102,217,239,0.2),0_10px_10px_rgba(102,217,239,0.1)]',
    glow: 'shadow-[0_0_20px_rgba(102,217,239,0.4)]'
  },
  
  // Ocean Wave Shadows
  ocean: {
    sm: 'shadow-[0_1px_2px_rgba(0,139,139,0.2)]',
    md: 'shadow-[0_4px_6px_rgba(0,139,139,0.2),0_2px_4px_rgba(32,178,170,0.1)]',
    lg: 'shadow-[0_10px_15px_rgba(0,139,139,0.2),0_4px_6px_rgba(32,178,170,0.1)]',
    xl: 'shadow-[0_20px_25px_rgba(0,139,139,0.2),0_10px_10px_rgba(72,209,204,0.1)]',
    wave: 'shadow-[0_8px_32px_rgba(0,139,139,0.3)]'
  },
  
  // Glassmorphism Shadows
  glass: {
    light: 'shadow-[0_8px_32px_rgba(255,255,255,0.1)]',
    dark: 'shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
    primary: 'shadow-[0_8px_32px_rgba(249,38,114,0.15)]',
    ocean: 'shadow-[0_8px_32px_rgba(0,139,139,0.15)]'
  },
  
  // Card Rarity Shadows
  rarity: {
    common: 'shadow-[0_4px_12px_rgba(166,226,46,0.3)]',
    rare: 'shadow-[0_4px_12px_rgba(102,217,239,0.3)]',
    epic: 'shadow-[0_4px_12px_rgba(153,50,204,0.3)]',
    legendary: 'shadow-[0_4px_20px_rgba(255,215,0,0.4),0_0_40px_rgba(255,165,0,0.2)]'
  },
  
  // Interactive Element Shadows
  button: {
    default: 'shadow-[0_2px_4px_rgba(39,40,34,0.1)]',
    hover: 'shadow-[0_4px_8px_rgba(39,40,34,0.15)]',
    active: 'shadow-[0_1px_2px_rgba(39,40,34,0.1)]',
    focus: 'shadow-[0_0_0_2px_rgba(249,38,114,0.3)]'
  },
  
  // 3D Element Shadows
  depth: {
    floating: 'shadow-[0_10px_30px_rgba(39,40,34,0.2)]',
    elevated: 'shadow-[0_15px_35px_rgba(39,40,34,0.25)]',
    lifted: 'shadow-[0_20px_40px_rgba(39,40,34,0.3)]'
  }
} as const;

// Shadow animation classes
export const shadowAnimations = {
  hover: 'transition-shadow duration-300 ease-in-out',
  smooth: 'transition-all duration-200 ease-in-out',
  bounce: 'transition-shadow duration-500 ease-out',
  pulse: 'animate-pulse'
} as const;

// Component-specific shadow utilities
export const componentShadows = {
  // Card components
  card: {
    default: cn(shadows.soft.md, shadowAnimations.hover),
    hover: cn(shadows.soft.lg, 'hover:' + shadows.primary.md),
    glass: cn(shadows.glass.light, shadowAnimations.smooth),
    rarity: (rarity: keyof typeof shadows.rarity) => cn(shadows.rarity[rarity], shadowAnimations.pulse)
  },
  
  // Button components
  button: {
    primary: cn(shadows.primary.sm, shadowAnimations.hover, 'hover:' + shadows.primary.md),
    secondary: cn(shadows.secondary.sm, shadowAnimations.hover, 'hover:' + shadows.secondary.md),
    ocean: cn(shadows.ocean.sm, shadowAnimations.hover, 'hover:' + shadows.ocean.md),
    ghost: cn('shadow-none', shadowAnimations.hover, 'hover:' + shadows.soft.sm)
  },
  
  // Modal and overlay shadows
  modal: {
    backdrop: 'shadow-[0_0_100px_rgba(0,0,0,0.5)]',
    content: cn(shadows.soft['2xl'], shadows.glass.dark)
  },
  
  // Navigation shadows
  nav: {
    header: cn(shadows.soft.sm, 'backdrop-blur-md'),
    sidebar: cn(shadows.soft.lg, shadows.glass.dark)
  },
  
  // Input field shadows
  input: {
    default: cn(shadows.soft.sm, shadowAnimations.smooth),
    focus: cn(shadows.primary.sm, 'focus:' + shadows.primary.md),
    error: cn('shadow-[0_2px_4px_rgba(253,92,99,0.2)]', shadowAnimations.smooth)
  }
} as const;

// Utility functions for dynamic shadow generation
export const generateShadow = (
  color: keyof typeof shadowColors,
  intensity: keyof typeof shadowIntensity,
  blur: number = 8,
  spread: number = 0
) => {
  const shadowColor = shadowColors[color].replace(/0\.\d+/, shadowIntensity[intensity]);
  return `shadow-[0_${blur/2}px_${blur}px_${spread}px_${shadowColor}]`;
};

export const createGlow = (
  color: keyof typeof shadowColors,
  intensity: keyof typeof shadowIntensity = 'medium',
  size: number = 20
) => {
  const shadowColor = shadowColors[color].replace(/0\.\d+/, shadowIntensity[intensity]);
  return `shadow-[0_0_${size}px_${shadowColor}]`;
};

// Beach Monokai + Ocean wave gradient shadows
export const gradientShadows = {
  sunset: 'shadow-[0_8px_32px_rgba(249,38,114,0.2),0_4px_16px_rgba(253,92,99,0.1)]',
  tide: 'shadow-[0_8px_32px_rgba(102,217,239,0.2),0_4px_16px_rgba(62,186,124,0.1)]',
  beach: 'shadow-[0_8px_32px_rgba(248,239,214,0.2),0_4px_16px_rgba(129,154,255,0.1)]',
  wave: 'shadow-[0_12px_40px_rgba(0,139,139,0.25),0_6px_20px_rgba(32,178,170,0.15)]'
} as const;

// Export for Tailwind CSS configuration
export const tailwindShadowConfig = {
  // Add to your tailwind.config.js theme.extend.boxShadow
  'soft-sm': '0 1px 2px rgba(39, 40, 34, 0.1)',
  'soft-md': '0 4px 6px rgba(39, 40, 34, 0.1), 0 2px 4px rgba(39, 40, 34, 0.06)',
  'soft-lg': '0 10px 15px rgba(39, 40, 34, 0.1), 0 4px 6px rgba(39, 40, 34, 0.05)',
  'soft-xl': '0 20px 25px rgba(39, 40, 34, 0.1), 0 10px 10px rgba(39, 40, 34, 0.04)',
  'soft-2xl': '0 25px 50px rgba(39, 40, 34, 0.15)',
  
  'primary-glow': '0 0 20px rgba(249, 38, 114, 0.4)',
  'secondary-glow': '0 0 20px rgba(166, 226, 46, 0.4)',
  'info-glow': '0 0 20px rgba(102, 217, 239, 0.4)',
  'ocean-glow': '0 0 20px rgba(0, 139, 139, 0.4)',
  
  'glass-light': '0 8px 32px rgba(255, 255, 255, 0.1)',
  'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.1)',
  
  'rarity-legendary': '0 4px 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 165, 0, 0.2)',
  
  'gradient-sunset': '0 8px 32px rgba(249, 38, 114, 0.2), 0 4px 16px rgba(253, 92, 99, 0.1)',
  'gradient-tide': '0 8px 32px rgba(102, 217, 239, 0.2), 0 4px 16px rgba(62, 186, 124, 0.1)',
  'gradient-wave': '0 12px 40px rgba(0, 139, 139, 0.25), 0 6px 20px rgba(32, 178, 170, 0.15)'
} as const;
