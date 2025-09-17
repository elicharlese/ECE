'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, User, Mail, Key, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface AdminSecurityProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminLevel?: 'user' | 'admin' | 'superadmin';
}

interface SecurityAuditLog {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'warning' | 'error';
}

// Mock security context
const useAdminSecurity = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  const logSecurityEvent = (action: string, status: 'success' | 'warning' | 'error') => {
    const log: SecurityAuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      action,
      userId: user?.id || 'anonymous',
      ipAddress: '192.168.1.1', // Mock IP
      userAgent: navigator.userAgent,
      status
    };
    setAuditLogs(prev => [log, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  return {
    isAuthenticated,
    user,
    auditLogs,
    logSecurityEvent,
    setIsAuthenticated,
    setUser
  };
};

export function AdminSecurityProvider({ 
  children, 
  requireAuth = true, 
  adminLevel = 'admin' 
}: AdminSecurityProviderProps) {
  const { isAuthenticated, logSecurityEvent } = useAdminSecurity();

  React.useEffect(() => {
    if (requireAuth) {
      logSecurityEvent('admin_access_attempt', 'warning');
    }
  }, [requireAuth, logSecurityEvent]);

  if (requireAuth && !isAuthenticated) {
    return <AdminLoginGate onAuthenticate={() => {}} />;
  }

  return (
    <div className="admin-security-context">
      <SecurityHeader adminLevel={adminLevel} />
      {children}
    </div>
  );
}

function SecurityHeader({ adminLevel }: { adminLevel: string }) {
  return (
    <div className="bg-ece-dark/90 backdrop-blur-sm border-b border-ece-accent/20 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-ece-accent" />
          <span className="text-ece-light font-medium">Admin Panel</span>
          <span className="bg-ece-accent/20 text-ece-accent px-2 py-1 rounded text-xs uppercase">
            {adminLevel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-ece-muted">
          <Lock className="w-4 h-4" />
          Secure Session Active
        </div>
      </div>
    </div>
  );
}

function AdminLoginGate({ onAuthenticate }: { onAuthenticate: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock authentication
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        onAuthenticate();
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ece-dark via-ece-background to-ece-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-ece-light/5 backdrop-blur-lg border border-ece-accent/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-ece-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-ece-accent" />
            </div>
            <h1 className="text-2xl font-bold text-ece-light mb-2">Admin Access</h1>
            <p className="text-ece-muted">Secure authentication required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ece-light mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ece-muted" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light placeholder-ece-muted focus:outline-none focus:border-ece-accent"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ece-light mb-2">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ece-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light placeholder-ece-muted focus:outline-none focus:border-ece-accent"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ece-muted hover:text-ece-light"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-ece-error/20 border border-ece-error/40 rounded-lg text-ece-error text-sm">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ece-accent text-ece-light py-3 rounded-lg font-medium hover:bg-ece-error transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-ece-warning/10 border border-ece-warning/20 rounded-lg">
            <p className="text-xs text-ece-muted">
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Security monitoring component
export function SecurityMonitor() {
  const { auditLogs } = useAdminSecurity();

  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-ece-light mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-ece-accent" />
        Security Audit Log
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {auditLogs.length === 0 ? (
          <p className="text-ece-muted text-sm">No security events recorded</p>
        ) : (
          auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-2 bg-ece-dark/30 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  log.status === 'success' ? 'bg-ece-success' :
                  log.status === 'warning' ? 'bg-ece-warning' : 'bg-ece-error'
                }`} />
                <span className="text-ece-light">{log.action}</span>
              </div>
              <span className="text-ece-muted">
                {log.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminSecurityProvider;
