'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AdminSecurityProvider } from './AdminSecurityProvider';
import { AdminDashboard } from './AdminDashboard';
import { AlertManager } from './AlertManager';
import { BusinessIntelligence } from './BusinessIntelligence';
import { UserManagement } from './UserManagement';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  BarChart3, 
  Settings, 
  Database,
  Shield,
  FileText,
  Zap,
  Monitor
} from 'lucide-react';

type AdminTab = 'dashboard' | 'users' | 'alerts' | 'analytics' | 'settings' | 'system' | 'security' | 'reports' | 'automation' | 'monitoring';

export function AdminPanel() {
  const [activeTab, setActiveTab] = React.useState<AdminTab>('dashboard');

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users' as const, label: 'User Management', icon: Users },
    { id: 'alerts' as const, label: 'Alert Manager', icon: Bell },
    { id: 'analytics' as const, label: 'Business Intelligence', icon: BarChart3 },
    { id: 'system' as const, label: 'System Health', icon: Monitor },
    { id: 'security' as const, label: 'Security Center', icon: Shield },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
    { id: 'automation' as const, label: 'Automation', icon: Zap },
    { id: 'settings' as const, label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'alerts':
        return <AlertManager />;
      case 'analytics':
        return <BusinessIntelligence />;
      case 'system':
        return <SystemHealthPanel />;
      case 'security':
        return <SecurityCenterPanel />;
      case 'reports':
        return <ReportsPanel />;
      case 'automation':
        return <AutomationPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminSecurityProvider requireAuth={true} adminLevel="admin">
      <div className="min-h-screen bg-gradient-to-br from-ece-dark via-ece-background to-ece-dark">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 min-h-screen bg-ece-light/5 backdrop-blur-sm border-r border-ece-accent/20">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-ece-accent rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-ece-light">ECE Admin</h1>
                  <p className="text-xs text-ece-muted">Control Panel</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                        ${isActive 
                          ? 'bg-ece-accent/20 text-ece-accent border border-ece-accent/30' 
                          : 'text-ece-muted hover:text-ece-light hover:bg-ece-accent/10'
                        }
                      `}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="p-8">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AdminSecurityProvider>
  );
}

// Placeholder components for additional panels
function SystemHealthPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-ece-light">System Health</h2>
      <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
        <p className="text-ece-muted">System health monitoring panel will be implemented here.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-ece-success/20 p-4 rounded-lg">
            <h4 className="text-ece-success font-medium">Server Status</h4>
            <p className="text-ece-light text-2xl font-bold">Online</p>
          </div>
          <div className="bg-ece-info/20 p-4 rounded-lg">
            <h4 className="text-ece-info font-medium">Database</h4>
            <p className="text-ece-light text-2xl font-bold">Healthy</p>
          </div>
          <div className="bg-ece-warning/20 p-4 rounded-lg">
            <h4 className="text-ece-warning font-medium">API Latency</h4>
            <p className="text-ece-light text-2xl font-bold">145ms</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityCenterPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-ece-light">Security Center</h2>
      <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
        <p className="text-ece-muted">Advanced security monitoring and threat detection will be implemented here.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-ece-success/20 p-4 rounded-lg">
            <h4 className="text-ece-success font-medium">Security Score</h4>
            <p className="text-ece-light text-2xl font-bold">98/100</p>
          </div>
          <div className="bg-ece-error/20 p-4 rounded-lg">
            <h4 className="text-ece-error font-medium">Threats Blocked</h4>
            <p className="text-ece-light text-2xl font-bold">23</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-ece-light">Reports</h2>
      <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
        <p className="text-ece-muted">Automated report generation and custom report builder will be implemented here.</p>
      </div>
    </div>
  );
}

function AutomationPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-ece-light">Automation</h2>
      <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
        <p className="text-ece-muted">Workflow automation and intelligent business process management will be implemented here.</p>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-ece-light">Settings</h2>
      <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
        <p className="text-ece-muted">System configuration and admin preferences will be implemented here.</p>
      </div>
    </div>
  );
}

export default AdminPanel;
