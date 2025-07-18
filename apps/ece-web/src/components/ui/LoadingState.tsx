'use client';

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  type?: 'default' | 'page' | 'card' | '3d';
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ 
  message = 'Loading...', 
  type = 'default',
  size = 'md' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = {
    default: 'flex items-center justify-center p-4',
    page: 'flex items-center justify-center min-h-[400px]',
    card: 'flex items-center justify-center aspect-[3/4] bg-ece-muted/10 rounded-xl',
    '3d': 'flex flex-col items-center justify-center min-h-[300px] bg-gradient-tide/10 rounded-xl'
  };

  return (
    <div className={containerClasses[type]}>
      <div className="flex flex-col items-center space-y-4">
        {type === '3d' ? (
          <div className="relative">
            <Sparkles className={`${sizeClasses[size]} text-ece-accent animate-pulse`} />
            <div className="absolute inset-0 animate-spin">
              <Loader2 className={`${sizeClasses[size]} text-ece-info`} />
            </div>
          </div>
        ) : (
          <Loader2 className={`${sizeClasses[size]} text-ece-accent animate-spin`} />
        )}
        
        <div className="text-center">
          <p className="text-ece-muted font-medium">{message}</p>
          
          {type === '3d' && (
            <p className="text-xs text-ece-muted/70 mt-1">
              Preparing your 3D experience...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Specialized loading components
export function PageLoading({ message = 'Loading page...' }: { message?: string }) {
  return <LoadingState type="page" message={message} size="lg" />;
}

export function CardLoading({ message = 'Loading card...' }: { message?: string }) {
  return <LoadingState type="card" message={message} />;
}

export function Scene3DLoading({ message = 'Loading 3D scene...' }: { message?: string }) {
  return <LoadingState type="3d" message={message} size="lg" />;
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="aspect-[3/4] bg-ece-muted/10 rounded-xl animate-pulse">
      <div className="p-4 h-full flex flex-col">
        <div className="flex-1 bg-ece-muted/20 rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-ece-muted/20 rounded w-3/4"></div>
          <div className="h-3 bg-ece-muted/20 rounded w-1/2"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-ece-muted/20 rounded w-1/4"></div>
            <div className="h-3 bg-ece-muted/20 rounded w-1/4"></div>
            <div className="h-3 bg-ece-muted/20 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={`h-4 bg-ece-muted/20 rounded ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}
