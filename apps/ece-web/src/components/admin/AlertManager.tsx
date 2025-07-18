'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  Clock,
  Filter,
  Search,
  Download,
  Settings,
  Zap,
  Shield,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';
export type AlertCategory = 'system' | 'security' | 'business' | 'performance';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
  details?: Record<string, any>;
}

interface AlertManagerProps {
  className?: string;
}

export function AlertManager({ className = '' }: AlertManagerProps) {
  const [alerts, setAlerts] = React.useState<Alert[]>([
    {
      id: '1',
      title: 'High CPU Usage Detected',
      message: 'Server CPU usage has exceeded 85% for the past 5 minutes',
      severity: 'warning',
      category: 'system',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      acknowledged: false,
      source: 'monitoring-system',
      details: { cpuUsage: 87.3, threshold: 85 }
    },
    {
      id: '2',
      title: 'Unusual Trading Activity',
      message: 'Trading volume has increased by 300% in the last hour',
      severity: 'info',
      category: 'business',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: false,
      source: 'business-analytics',
      details: { volumeIncrease: 300, timeframe: '1 hour' }
    },
    {
      id: '3',
      title: 'Security Breach Attempt',
      message: 'Multiple failed login attempts detected from suspicious IP',
      severity: 'critical',
      category: 'security',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      acknowledged: false,
      source: 'security-system',
      details: { ip: '192.168.1.100', attempts: 15, country: 'Unknown' }
    },
    {
      id: '4',
      title: 'Database Backup Completed',
      message: 'Scheduled database backup completed successfully',
      severity: 'success',
      category: 'system',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      acknowledged: true,
      source: 'backup-system',
      details: { size: '2.3GB', duration: '45min' }
    }
  ]);

  const [filter, setFilter] = React.useState<{
    severity: AlertSeverity | 'all';
    category: AlertCategory | 'all';
    acknowledged: 'all' | 'acknowledged' | 'unacknowledged';
  }>({
    severity: 'all',
    category: 'all',
    acknowledged: 'unacknowledged'
  });

  const [searchTerm, setSearchTerm] = React.useState('');

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter.severity !== 'all' && alert.severity !== filter.severity) return false;
    if (filter.category !== 'all' && alert.category !== filter.category) return false;
    if (filter.acknowledged === 'acknowledged' && !alert.acknowledged) return false;
    if (filter.acknowledged === 'unacknowledged' && alert.acknowledged) return false;
    if (searchTerm && !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !alert.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getSeverityConfig = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertTriangle,
          color: 'text-ece-error',
          bgColor: 'bg-ece-error/20',
          borderColor: 'border-ece-error/40'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-ece-warning',
          bgColor: 'bg-ece-warning/20',
          borderColor: 'border-ece-warning/40'
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-ece-info',
          bgColor: 'bg-ece-info/20',
          borderColor: 'border-ece-info/40'
        };
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-ece-success',
          bgColor: 'bg-ece-success/20',
          borderColor: 'border-ece-success/40'
        };
    }
  };

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'system':
        return Settings;
      case 'security':
        return Shield;
      case 'business':
        return TrendingUp;
      case 'performance':
        return Zap;
    }
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-ece-accent" />
          <h2 className="text-2xl font-bold text-ece-light">Alert Manager</h2>
          {unacknowledgedCount > 0 && (
            <span className="bg-ece-error/20 text-ece-error px-2 py-1 rounded-full text-sm font-medium">
              {unacknowledgedCount} unacknowledged
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-ece-accent/20 text-ece-accent rounded-lg hover:bg-ece-accent/30 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-ece-info/20 text-ece-info rounded-lg hover:bg-ece-info/30 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ece-muted" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light placeholder-ece-muted focus:outline-none focus:border-ece-accent"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={filter.severity}
            onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value as any }))}
            className="px-3 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light focus:outline-none focus:border-ece-accent"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
          </select>

          {/* Category Filter */}
          <select
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value as any }))}
            className="px-3 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light focus:outline-none focus:border-ece-accent"
          >
            <option value="all">All Categories</option>
            <option value="system">System</option>
            <option value="security">Security</option>
            <option value="business">Business</option>
            <option value="performance">Performance</option>
          </select>

          {/* Status Filter */}
          <select
            value={filter.acknowledged}
            onChange={(e) => setFilter(prev => ({ ...prev, acknowledged: e.target.value as any }))}
            className="px-3 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light focus:outline-none focus:border-ece-accent"
          >
            <option value="all">All Status</option>
            <option value="unacknowledged">Unacknowledged</option>
            <option value="acknowledged">Acknowledged</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-ece-muted">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No alerts match your current filters</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={() => acknowledgeAlert(alert.id)}
              onDismiss={() => dismissAlert(alert.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: () => void;
  onDismiss: () => void;
}

function AlertCard({ alert, onAcknowledge, onDismiss }: AlertCardProps) {
  const severityConfig = getSeverityConfig(alert.severity);
  const CategoryIcon = getCategoryIcon(alert.category);
  const SeverityIcon = severityConfig.icon;

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        bg-ece-light/5 backdrop-blur-sm border rounded-lg p-4
        ${severityConfig.borderColor} ${alert.acknowledged ? 'opacity-60' : ''}
        transition-all duration-200
      `}
    >
      <div className="flex items-start gap-4">
        {/* Severity Icon */}
        <div className={`flex-shrink-0 ${severityConfig.bgColor} rounded-lg p-2`}>
          <SeverityIcon className={`w-5 h-5 ${severityConfig.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-ece-light font-medium">{alert.title}</h4>
                <CategoryIcon className="w-4 h-4 text-ece-muted" />
                <span className="text-xs text-ece-muted capitalize">{alert.category}</span>
              </div>
              <p className="text-ece-muted text-sm mb-2">{alert.message}</p>
              <div className="flex items-center gap-4 text-xs text-ece-muted">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(alert.timestamp)}
                </div>
                <span>Source: {alert.source}</span>
                {alert.acknowledged && (
                  <span className="text-ece-success">✓ Acknowledged</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!alert.acknowledged && (
                <button
                  onClick={onAcknowledge}
                  className="px-3 py-1 bg-ece-success/20 text-ece-success rounded text-xs hover:bg-ece-success/30 transition-colors"
                >
                  Acknowledge
                </button>
              )}
              <button
                onClick={onDismiss}
                className="p-1 text-ece-muted hover:text-ece-light transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details */}
          {alert.details && (
            <div className="mt-3 p-3 bg-ece-dark/30 rounded-lg">
              <details className="text-sm">
                <summary className="text-ece-accent cursor-pointer hover:text-ece-error">
                  View Details
                </summary>
                <div className="mt-2 space-y-1 text-ece-muted">
                  {Object.entries(alert.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AlertManager;
