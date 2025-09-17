'use client';

import React, { Component, ReactNode, Suspense } from 'react';
import { ErrorBoundaryUI } from '../ui/ErrorBoundary';

interface Safe3DWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

interface Safe3DWrapperState {
  hasError: boolean;
  error?: Error;
}

/**
 * Safe 3D Wrapper Component
 * 
 * Handles Three.js version conflicts and ReactCurrentOwner errors
 * by providing a safe boundary around 3D components.
 */
class Safe3DWrapper extends Component<Safe3DWrapperProps, Safe3DWrapperState> {
  constructor(props: Safe3DWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Safe3DWrapperState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.error('3D Component Error:', error, errorInfo);
    
    // Check if it's the ReactCurrentOwner error we're trying to fix
    if (error.message.includes('ReactCurrentOwner') || 
        error.message.includes('Cannot read properties of undefined')) {
      console.warn('Detected ReactCurrentOwner error - likely due to Three.js version conflicts');
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI for 3D errors
      return (
        <div className={`${this.props.className || ''} flex items-center justify-center min-h-[400px]`}>
          <ErrorBoundaryUI 
            error={this.state.error || new Error('3D rendering failed')}
            reset={() => this.setState({ hasError: false, error: undefined })}
            type="3d"
          />
        </div>
      );
    }

    // Wrap children in Suspense for better loading handling
    return (
      <Suspense 
        fallback={
          this.props.fallback || (
            <div className={`${this.props.className || ''} flex items-center justify-center min-h-[400px]`}>
              <div className="animate-pulse text-ece-primary">Loading 3D content...</div>
            </div>
          )
        }
      >
        {this.props.children}
      </Suspense>
    );
  }
}

export default Safe3DWrapper;
