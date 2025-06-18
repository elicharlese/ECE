'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/src/lib/theme-context';
import { Home, Zap, Store, BarChart3 } from 'lucide-react';

export function BottomNavigation() {
  const { theme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: <Home className="w-5 h-5" />
    },
    {
      href: '/swipe',
      label: 'Discover',
      icon: <Zap className="w-5 h-5" />
    },
    {
      href: '/marketplace',
      label: 'Browse',
      icon: <Store className="w-5 h-5" />
    },
    {
      href: '/dashboard',
      label: 'Portfolio',
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-theme-surface/95 backdrop-blur-sm border-t border-theme-border z-30">
      <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg bottom-nav-item ${
                isActive
                  ? 'text-theme-accent bg-theme-accent/10 active'
                  : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-background'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
