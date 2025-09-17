'use client';

import React from 'react';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { Performance3DProvider } from '@/components/3d/Performance3DProvider';

interface AppLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  className?: string;
}

export function AppLayout({ 
  children, 
  showBreadcrumbs = true, 
  className = '' 
}: AppLayoutProps) {
  return (
    <Performance3DProvider>
      <div className="min-h-screen bg-ece-dark flex flex-col">
        <AppHeader />
        
        <main className={`flex-1 pt-16 ${className}`}>
          {showBreadcrumbs && (
            <div className="container mx-auto px-4 py-4">
              <BreadcrumbNavigation />
            </div>
          )}
          {children}
        </main>
        
        <AppFooter />
      </div>
    </Performance3DProvider>
  );
}
