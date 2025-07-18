'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href: string
  isActive: boolean
}

interface AdminBreadcrumbsProps {
  className?: string
}

const routeLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/analytics': 'Analytics',
  '/admin/notifications': 'Notifications',
  '/admin/security': 'Security Center',
  '/admin/settings': 'System Settings',
  '/admin/monitoring': 'System Monitoring',
  '/admin/api': 'API Dashboard',
  '/admin/maintenance': 'Backup & Maintenance',
  '/admin/preferences': 'Admin Preferences',
  '/admin/orders': 'Order Management',
  '/admin/marketplace': 'Marketplace Control'
}

export function AdminBreadcrumbs({ className = '' }: AdminBreadcrumbsProps) {
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [navigationHistory, setNavigationHistory] = useState<string[]>([])

  useEffect(() => {
    // Add current path to navigation history
    setNavigationHistory(prev => {
      const newHistory = [...prev]
      if (!newHistory.includes(pathname)) {
        newHistory.push(pathname)
        // Keep only last 10 paths
        if (newHistory.length > 10) {
          newHistory.shift()
        }
      }
      return newHistory
    })

    // Generate breadcrumbs
    const pathSegments = pathname.split('/').filter(Boolean)
    const crumbs: BreadcrumbItem[] = []

    // Add home/dashboard
    crumbs.push({
      label: 'Admin',
      href: '/admin',
      isActive: pathname === '/admin'
    })

    // Build breadcrumbs from path segments
    let currentPath = ''
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`
      
      if (currentPath !== '/admin') {
        const label = routeLabels[currentPath] || pathSegments[i].charAt(0).toUpperCase() + pathSegments[i].slice(1)
        crumbs.push({
          label,
          href: currentPath,
          isActive: i === pathSegments.length - 1
        })
      }
    }

    setBreadcrumbs(crumbs)
  }, [pathname])

  const handleBreadcrumbClick = (href: string) => {
    // Track breadcrumb navigation for analytics
    console.log('Breadcrumb navigation:', href)
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-2"
      >
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center space-x-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-[#75715E]" />
            )}
            
            {crumb.isActive ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#F8EFD6] font-medium flex items-center"
              >
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                {crumb.label}
              </motion.span>
            ) : (
              <Link
                href={crumb.href}
                onClick={() => handleBreadcrumbClick(crumb.href)}
                className="text-[#75715E] hover:text-[#F8EFD6] transition-colors flex items-center group"
              >
                {index === 0 && <Home className="w-4 h-4 mr-1 group-hover:text-primary transition-colors" />}
                <span className="group-hover:text-primary transition-colors">
                  {crumb.label}
                </span>
              </Link>
            )}
          </div>
        ))}
      </motion.div>

      {/* Quick navigation dropdown for history */}
      {navigationHistory.length > 1 && (
        <div className="ml-4 relative group">
          <button className="text-xs text-[#75715E] hover:text-[#F8EFD6] transition-colors px-2 py-1 rounded bg-white/5 hover:bg-white/10">
            Quick Nav
          </button>
          
          <div className="absolute top-full left-0 mt-1 w-48 bg-gradient-to-br from-[#272822] via-[#2c2d24] to-[#1e1f1a] backdrop-blur-xl border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="p-2">
              <p className="text-xs text-[#75715E] mb-2">Recent Pages</p>
              {navigationHistory.slice(-5).reverse().map((path, index) => (
                <Link
                  key={`${path}-${index}`}
                  href={path}
                  className="block px-2 py-1 text-sm text-[#F8EFD6] hover:bg-white/10 rounded transition-colors"
                >
                  {routeLabels[path] || path.split('/').pop()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
