'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  DollarSign,
  Server,
  Database,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  description?: string;
}

interface DashboardData {
  systemHealth: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    uptime: string;
    status: 'healthy' | 'warning' | 'critical';
  };
  businessMetrics: {
    totalRevenue: number;
    totalUsers: number;
    activeUsers: number;
    transactionVolume: number;
    conversionRate: number;
  };
  realtimeData: {
    currentUsers: number;
    tradesPerMinute: number;
    responseTime: number;
    errorRate: number;
  };
}

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = React.useState<DashboardData>({
    systemHealth: {
      cpuUsage: 45,
      memoryUsage: 67,
      diskUsage: 32,
      uptime: '15d 8h 23m',
      status: 'healthy'
    },
    businessMetrics: {
      totalRevenue: 1234567.89,
      totalUsers: 45692,
      activeUsers: 8934,
      transactionVolume: 23456,
      conversionRate: 3.45
    },
    realtimeData: {
      currentUsers: 1247,
      tradesPerMinute: 23,
      responseTime: 145,
      errorRate: 0.02
    }
  });

  // Simulate real-time data updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        realtimeData: {
          currentUsers: Math.floor(Math.random() * 200) + 1000,
          tradesPerMinute: Math.floor(Math.random() * 10) + 20,
          responseTime: Math.floor(Math.random() * 50) + 120,
          errorRate: Math.random() * 0.05
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-ece-success';
      case 'warning':
        return 'text-ece-warning';
      case 'critical':
        return 'text-ece-error';
      default:
        return 'text-ece-muted';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ece-light">Admin Dashboard</h1>
          <p className="text-ece-muted mt-1">Real-time analytics and system monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            dashboardData.systemHealth.status === 'healthy' ? 'bg-ece-success' :
            dashboardData.systemHealth.status === 'warning' ? 'bg-ece-warning' : 'bg-ece-error'
          }`} />
          <span className={getStatusColor(dashboardData.systemHealth.status)}>
            System {dashboardData.systemHealth.status.charAt(0).toUpperCase() + dashboardData.systemHealth.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Online Users"
          value={formatNumber(dashboardData.realtimeData.currentUsers)}
          change="+5.2%"
          changeType="positive"
          icon={Users}
          description="Currently active users"
        />
        <MetricCard
          title="Trades/Min"
          value={dashboardData.realtimeData.tradesPerMinute}
          change="+12.1%"
          changeType="positive"
          icon={TrendingUp}
          description="Real-time trading activity"
        />
        <MetricCard
          title="Response Time"
          value={`${dashboardData.realtimeData.responseTime}ms`}
          change="-8.3%"
          changeType="positive"
          icon={Clock}
          description="Average API response time"
        />
        <MetricCard
          title="Error Rate"
          value={`${(dashboardData.realtimeData.errorRate * 100).toFixed(2)}%`}
          change="-15.7%"
          changeType="positive"
          icon={AlertTriangle}
          description="System error rate"
        />
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(dashboardData.businessMetrics.totalRevenue)}
          change="+23.5%"
          changeType="positive"
          icon={DollarSign}
          description="Total platform revenue"
        />
        <MetricCard
          title="Total Users"
          value={formatNumber(dashboardData.businessMetrics.totalUsers)}
          change="+18.2%"
          changeType="positive"
          icon={Users}
          description="Registered users"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${dashboardData.businessMetrics.conversionRate}%`}
          change="+2.1%"
          changeType="positive"
          icon={BarChart3}
          description="Visitor to user conversion"
        />
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthCard data={dashboardData.systemHealth} />
        <RecentActivityCard />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChartCard />
        <UserActivityChartCard />
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  description 
}: MetricCardProps) {
  const changeColor = changeType === 'positive' ? 'text-ece-success' : 
                     changeType === 'negative' ? 'text-ece-error' : 'text-ece-muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ece-accent/20 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-ece-accent" />
          </div>
          <div>
            <p className="text-sm text-ece-muted">{title}</p>
            <p className="text-2xl font-bold text-ece-light">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`text-sm font-medium ${changeColor}`}>
            {change}
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-ece-muted mt-2">{description}</p>
      )}
    </motion.div>
  );
}

function SystemHealthCard({ data }: { data: DashboardData['systemHealth'] }) {
  const healthItems = [
    { label: 'CPU Usage', value: data.cpuUsage, max: 100, unit: '%', color: 'ece-accent' },
    { label: 'Memory Usage', value: data.memoryUsage, max: 100, unit: '%', color: 'ece-info' },
    { label: 'Disk Usage', value: data.diskUsage, max: 100, unit: '%', color: 'ece-success' }
  ];

  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Server className="w-6 h-6 text-ece-accent" />
        <h3 className="text-lg font-semibold text-ece-light">System Health</h3>
      </div>

      <div className="space-y-4">
        {healthItems.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ece-muted">{item.label}</span>
              <span className="text-ece-light">{item.value}{item.unit}</span>
            </div>
            <div className="w-full bg-ece-dark/50 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / item.max) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-ece-accent/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ece-muted">Uptime</span>
            <span className="text-sm font-medium text-ece-success">{data.uptime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentActivityCard() {
  const activities = [
    { action: 'User registration spike detected', time: '2 min ago', type: 'info' },
    { action: 'Database backup completed', time: '15 min ago', type: 'success' },
    { action: 'High trading volume alert', time: '23 min ago', type: 'warning' },
    { action: 'New admin user created', time: '1 hour ago', type: 'info' },
    { action: 'System update deployed', time: '2 hours ago', type: 'success' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-ece-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-ece-warning" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-ece-error" />;
      default:
        return <Activity className="w-4 h-4 text-ece-info" />;
    }
  };

  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-ece-accent" />
        <h3 className="text-lg font-semibold text-ece-light">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-ece-accent/10 transition-colors"
          >
            {getActivityIcon(activity.type)}
            <div className="flex-1">
              <p className="text-sm text-ece-light">{activity.action}</p>
              <p className="text-xs text-ece-muted">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RevenueChartCard() {
  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <LineChart className="w-6 h-6 text-ece-accent" />
        <h3 className="text-lg font-semibold text-ece-light">Revenue Trend</h3>
      </div>
      <div className="h-48 flex items-center justify-center text-ece-muted">
        <p>Revenue chart visualization will be implemented here</p>
      </div>
    </div>
  );
}

function UserActivityChartCard() {
  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <PieChart className="w-6 h-6 text-ece-accent" />
        <h3 className="text-lg font-semibold text-ece-light">User Activity</h3>
      </div>
      <div className="h-48 flex items-center justify-center text-ece-muted">
        <p>User activity chart visualization will be implemented here</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
