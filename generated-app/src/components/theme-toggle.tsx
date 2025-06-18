'use client';

import React from 'react';
import { useTheme } from '../lib/theme-context';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'switch';
}

export function ThemeToggle({ className = '', size = 'md', variant = 'icon' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const switchSizeClasses = {
    sm: 'w-10 h-5',
    md: 'w-12 h-6',
    lg: 'w-14 h-7'
  };

  const switchThumbClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative inline-flex ${switchSizeClasses[size]} rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
          theme === 'dark' ? 'bg-accent' : 'bg-gray-300'
        } ${className}`}
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span
          className={`${switchThumbClasses[size]} inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            theme === 'dark' ? `translate-x-${size === 'sm' ? '5' : size === 'md' ? '6' : '7'}` : 'translate-x-0.5'
          } top-0.5`}
        />
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${className}`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>
    );
  }

  // Default icon variant
  return (
    <button
      onClick={toggleTheme}
      className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <span className="text-2xl">🌙</span>
      ) : (
        <span className="text-2xl">☀️</span>
      )}
    </button>
  );
}
