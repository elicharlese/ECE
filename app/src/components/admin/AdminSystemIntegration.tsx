// Admin System Integration - Complete admin features for Patch 4
// /app/src/components/admin/AdminSystemIntegration.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Database,
  Shield,
  Settings,
  Activity,
  Zap,
  Crown,
  MessageSquare,
  FileText,
  Target
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import AlertManager from '@/components/admin/AlertManager';
import { BusinessIntelligence } from '@/components/admin/BusinessIntelligence';
import { UserManagement } from '@/components/admin/UserManagement';

interface AdminSystemStats {
  totalUsers: number;
  activeUsers: number;
  systemHealth: number;
  revenue: number;
  alerts: number;
  uptime: number;
}

interface AdminSystemIntegrationProps {
  className?: string;
}

export const AdminSystemIntegration: React.FC<AdminSystemIntegrationProps> = ({
  className = ''
}) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [systemStats, setSystemStats] = useState<AdminSystemStats>({
    totalUsers: 12847,
    activeUsers: 3456,
    systemHealth: 98.5,
    revenue: 247800,
    alerts: 12,
    uptime: 99.97
  });

  // Real-time stats update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5))),
        revenue: prev.revenue + Math.floor(Math.random() * 1000)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const adminViews = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      component: AdminDashboard,
      description: 'System overview and key metrics'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      component: UserManagement,
      description: 'User management and analytics'
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      component: AlertManager,
      description: 'System alerts and notifications',
      badge: systemStats.alerts
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      component: BusinessIntelligence,
      description: 'Business intelligence and reports'
    }
  ];

  const quickStats = [
    {
      label: 'Total Users',
      value: systemStats.totalUsers.toLocaleString(),
      change: '+12.3%',
      icon: Users,
      color: '#A6E22E'
    },
    {
      label: 'Active Now',
      value: systemStats.activeUsers.toLocaleString(),
      change: '+5.2%',
      icon: Activity,
      color: '#66D9EF'
    },
    {
      label: 'System Health',
      value: `${systemStats.systemHealth.toFixed(1)}%`,
      change: '+0.1%',
      icon: Shield,
      color: systemStats.systemHealth > 95 ? '#A6E22E' : '#F92672'
    },
    {
      label: 'Revenue',
      value: `$${(systemStats.revenue / 1000).toFixed(0)}k`,
      change: '+18.7%',
      icon: TrendingUp,
      color: '#E6DB74'
    }
  ];

  const ActiveViewComponent = adminViews.find(view => view.id === activeView)?.component || AdminDashboard;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Admin Header */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#F8EFD6] flex items-center space-x-3">
              <Crown className="w-8 h-8 text-[#E6DB74]" />
              <span>Admin Control Center</span>
            </h1>
            <p className="text-[#75715E] mt-2">
              Complete administrative dashboard with real-time monitoring and advanced analytics
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[#A6E22E]">
              <div className="w-3 h-3 bg-[#A6E22E] rounded-full animate-pulse" />
              <span className="text-sm font-medium">System Online</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#75715E]">Uptime</div>
              <div className="text-lg font-bold text-[#F8EFD6]">{systemStats.uptime}%</div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-[#272822]/60 rounded-lg p-4 border border-[#75715E]/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#75715E] mb-1">{stat.label}</div>
                  <div className="text-xl font-bold text-[#F8EFD6]">{stat.value}</div>
                  <div className="text-xs text-[#A6E22E]">{stat.change}</div>
                </div>
                <stat.icon 
                  size={24} 
                  style={{ color: stat.color }}
                  className="opacity-80"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Navigation Tabs */}
      <GlassCard variant="dark" className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {adminViews.map((view) => (
            <motion.button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`relative p-4 rounded-lg text-left transition-all ${
                activeView === view.id
                  ? 'bg-[#A6E22E]/20 border-[#A6E22E] text-[#A6E22E]'
                  : 'bg-[#272822]/40 border-[#75715E]/30 text-[#F8EFD6] hover:bg-[#272822]/60'
              } border`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <view.icon size={20} />
                <div className="flex-grow">
                  <div className="font-semibold">{view.label}</div>
                  <div className="text-xs opacity-70">{view.description}</div>
                </div>
                {view.badge && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#F92672] rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {view.badge}
                  </div>
                )}
              </div>
              
              {activeView === view.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A6E22E]"
                  layoutId="activeTab"
                />
              )}
            </motion.button>
          ))}
        </div>
      </GlassCard>

      {/* Active View Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[600px]"
      >
        <ActiveViewComponent />
      </motion.div>

      {/* System Status Footer */}
      <GlassCard variant="dark" className="p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6 text-[#75715E]">
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            <span>Server: ECE-PROD-01</span>
            <span>Version: 5.2.1</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Database size={16} className="text-[#A6E22E]" />
              <span className="text-[#A6E22E] text-xs">DB Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap size={16} className="text-[#E6DB74]" />
              <span className="text-[#E6DB74] text-xs">API Healthy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={16} className="text-[#66D9EF]" />
              <span className="text-[#66D9EF] text-xs">Security Active</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminSystemIntegration;
