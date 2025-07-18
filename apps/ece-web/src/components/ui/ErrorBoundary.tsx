'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryUIProps {
  error: Error;
  reset: () => void;
  type?: 'page' | 'component' | '3d' | 'network';
}

export function ErrorBoundaryUI({ error, reset, type = 'component' }: ErrorBoundaryUIProps) {
  const getErrorDetails = () => {
    switch (type) {
      case 'page':
        return {
          title: 'Page Error',
          description: 'Something went wrong while loading this page.',
          icon: AlertTriangle,
          color: 'text-ece-error'
        };
      case '3d':
        return {
          title: '3D Rendering Error',
          description: 'Unable to load 3D content. Your device may not support this feature.',
          icon: AlertTriangle,
          color: 'text-ece-warning'
        };
      case 'network':
        return {
          title: 'Connection Error',
          description: 'Unable to connect to our servers. Please check your internet connection.',
          icon: AlertTriangle,
          color: 'text-ece-info'
        };
      default:
        return {
          title: 'Something went wrong',
          description: 'An unexpected error occurred.',
          icon: AlertTriangle,
          color: 'text-ece-error'
        };
    }
  };

  const { title, description, icon: Icon, color } = getErrorDetails();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className={`w-16 h-16 mx-auto mb-6 ${color}`}>
          <Icon className="w-full h-full" />
        </div>
        
        <h2 className="text-2xl font-bold text-ece-light mb-4">
          {title}
        </h2>
        
        <p className="text-ece-muted mb-6">
          {description}
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-ece-error/10 border border-ece-error/20 rounded-lg text-left">
            <p className="text-xs text-ece-error font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-ece-accent text-ece-light px-6 py-3 rounded-lg font-medium hover:bg-ece-error transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-ece-info text-ece-info px-6 py-3 rounded-lg font-medium hover:bg-ece-info hover:text-ece-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
        
        {type === '3d' && (
          <p className="text-xs text-ece-muted mt-4">
            Try updating your browser or enabling hardware acceleration in settings.
          </p>
        )}
      </div>
    </div>
  );
}

// Specialized error components
export function PageError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorBoundaryUI error={error} reset={reset} type="page" />;
}

export function ComponentError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorBoundaryUI error={error} reset={reset} type="component" />;
}

export function Scene3DError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorBoundaryUI error={error} reset={reset} type="3d" />;
}

export function NetworkError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorBoundaryUI error={error} reset={reset} type="network" />;
}

// 404 Component
export function NotFoundError() {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-ece-accent mb-4">404</div>
        
        <h2 className="text-2xl font-bold text-ece-light mb-4">
          Page Not Found
        </h2>
        
        <p className="text-ece-muted mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 border border-ece-info text-ece-info px-6 py-3 rounded-lg font-medium hover:bg-ece-info hover:text-ece-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-ece-accent text-ece-light px-6 py-3 rounded-lg font-medium hover:bg-ece-error transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
