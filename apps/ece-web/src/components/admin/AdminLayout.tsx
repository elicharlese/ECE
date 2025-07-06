'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  BarChart3, 
  Users, 
  Package, 
  Store, 
  Settings, 
  Bell, 
  Lock,
  Menu,
  X,
  Home,
  ChevronRight,
  Search,
  User,
  Activity,
  Server,
  Archive,
  Webhook,
  ExternalLink
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { AdminBreadcrumbs } from './AdminBreadcrumbs'
import { useKeyboardShortcuts, useShortcutIndicator } from '@/hooks/useKeyboardShortcuts'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
  description: string
  badge?: number
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/admin',
    description: 'Overview and quick stats'
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    href: '/admin/users',
    description: 'Manage users and subscriptions',
    badge: 3
  },
  {
    id: 'orders',
    label: 'Order Management',
    icon: Package,
    href: '/admin/orders',
    description: 'Process and fulfill orders',
    badge: 12
  },
  {
    id: 'marketplace',
    label: 'Marketplace Control',
    icon: Store,
    href: '/admin/marketplace',
    description: 'Manage marketplace operations'
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    icon: BarChart3,
    href: '/admin/analytics',
    description: 'Platform insights and reporting'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    href: '/admin/notifications',
    description: 'Communication management',
    badge: 5
  },
  {
    id: 'security',
    label: 'Security & Compliance',
    icon: Lock,
    href: '/admin/security',
    description: 'Safety and compliance tools'
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: Settings,
    href: '/admin/settings',
    description: 'Platform configuration'
  },
  {
    id: 'monitoring',
    label: 'System Monitoring',
    icon: Activity,
    href: '/admin/monitoring',
    description: 'Real-time system health'
  },
  {
    id: 'api',
    label: 'API Dashboard',
    icon: Server,
    href: '/admin/api',
    description: 'API usage and management'
  },
  {
    id: 'maintenance',
    label: 'Backup & Maintenance',
    icon: Archive,
    href: '/admin/maintenance',
    description: 'System maintenance tools'
  },
  {
    id: 'integrations',
    label: 'External Integrations',
    icon: ExternalLink,
    href: '/admin/integrations',
    description: 'Third-party service management'
  },
  {
    id: 'webhooks',
    label: 'Webhook Management',
    icon: Webhook,
    href: '/admin/webhooks',
    description: 'Event handling and automation'
  },
  {
    id: 'preferences',
    label: 'Admin Preferences',
    icon: User,
    href: '/admin/preferences',
    description: 'Customize admin experience'
  },
  {
    id: 'advanced',
    label: 'Advanced Features',
    icon: Settings,
    href: '/admin/advanced',
    description: 'Advanced tools and customization'
  }
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const pathname = usePathname()
  
  // Initialize keyboard shortcuts and theme features
  useKeyboardShortcuts()
  const { showIndicator, indicatorText } = useShortcutIndicator()

  // Enhanced search functionality
  const searchableItems = [
    ...navigationItems,
    { id: 'user-search', label: 'Search Users', icon: Users, href: '/admin/users', description: 'Find specific user accounts' },
    { id: 'order-lookup', label: 'Order Lookup', icon: Package, href: '/admin/orders', description: 'Find orders by ID or customer' },
    { id: 'revenue-reports', label: 'Revenue Reports', icon: BarChart3, href: '/admin/analytics', description: 'View revenue analytics' },
    { id: 'send-notification', label: 'Send Notification', icon: Bell, href: '/admin/notifications', description: 'Create new notification' },
    { id: 'user-permissions', label: 'User Permissions', icon: Lock, href: '/admin/security', description: 'Manage user access levels' }
  ]

  const getSearchResults = () => {
    if (!searchQuery.trim()) return []
    
    return searchableItems.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6) // Limit to 6 results
  }

  const handleSearchResultClick = (result: any) => {
    setSearchQuery('')
    setShowSearchResults(false)
    setSidebarOpen(false)
    // Navigation will happen through the Link component
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false)
    }
    
    if (showSearchResults) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSearchResults])

  // Show search results when typing
  useEffect(() => {
    setShowSearchResults(searchQuery.length > 0)
  }, [searchQuery])

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    if (pathSegments.length === 1 && pathSegments[0] === 'admin') {
      return [{ label: 'Dashboard', href: '/admin' }]
    }
    
    breadcrumbs.push({ label: 'Admin', href: '/admin' })
    
    for (let i = 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i]
      const navItem = navigationItems.find(item => 
        item.href.split('/')[2] === segment
      )
      
      if (navItem) {
        breadcrumbs.push({
          label: navItem.label,
          href: navItem.href
        })
      } else {
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: `/${pathSegments.slice(0, i + 1).join('/')}`
        })
      }
    }
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Filter navigation items based on search
  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%'
        }}
        className="fixed top-0 left-0 z-50 w-80 h-full bg-background/95 backdrop-blur-xl border-r border-border/50 lg:translate-x-0 lg:static lg:z-auto"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-monokai-purple to-monokai-blue rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ECE Admin</h1>
              <p className="text-xs text-muted-foreground">Platform Control</p>
            </div>
          </div>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 lg:hidden"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border/50">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search admin functions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              data-admin-search
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ocean-accent focus:bg-white/10 transition-all"
            />
            
            {/* Enhanced Search Results Dropdown */}
            {showSearchResults && getSearchResults().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-border/30 rounded-lg shadow-lg z-50"
              >
                <div className="p-2 max-h-64 overflow-y-auto">
                  {getSearchResults().map((result, index) => (
                    <Link
                      key={`${result.id}-${index}`}
                      href={result.href}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3"
                    >
                      <result.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{result.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No Results Message */}
            {showSearchResults && searchQuery && getSearchResults().length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-border/30 rounded-lg shadow-lg z-50"
              >
                <div className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No results found for "{searchQuery}"</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {filteredItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-ocean text-white shadow-lg'
                      : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    <div>
                      <p className={`font-medium ${isActive ? 'text-white' : 'text-foreground'}`}>
                        {item.label}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {item.badge && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-ocean-accent/20 text-ocean-accent'
                    }`}>
                      {item.badge}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Admin User Info */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-monokai-green to-monokai-blue rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AD</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@ece.com</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="flex items-center justify-between p-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 lg:hidden"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>

            {/* Enhanced Breadcrumbs */}
            <AdminBreadcrumbs className="hidden sm:flex" />

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-white/10 relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-ocean-accent rounded-full"></div>
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <ThemeToggle className="p-2 rounded-lg hover:bg-white/10" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Keyboard Shortcut Indicator */}
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-background/90 backdrop-blur-xl border border-border/50 rounded-lg px-4 py-2 shadow-lg">
              <p className="text-sm text-foreground font-medium">{indicatorText}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add data-sidebar attribute for keyboard shortcuts */}
      <div data-sidebar data-collapsed={!sidebarOpen} className="hidden"></div>
    </div>
  )
}
