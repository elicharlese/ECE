'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Github,
  Globe,
  Download,
  Rocket,
  Activity,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  Code,
  Database,
  Shield,
  Package,
  ExternalLink,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { BottomNavigation } from '@/src/components/bottom-navigation';

interface OrderStatus {
  id: string;
  status: 'pending_payment' | 'paid' | 'building' | 'completed' | 'payment_failed' | 'build_failed' | 'refunded' | 'cancelled';
  progress: number;
  currentBuildStep?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  buildStartedAt?: string;
  completedAt?: string;
  buildLogs: string[];
  deliveryUrl?: string;
  adminUrl?: string;
  githubUrl?: string;
  vercelUrl?: string;
  buildError?: string;
  adminNotes?: Array<{ note: string; timestamp: string; admin: string }>;
  estimatedCompletion?: string;
  
  // Customer and app details
  customerName: string;
  customerEmail: string;
  company?: string;
  phone?: string;
  appName: string;
  appDescription: string;
  framework: string;
  complexity: 'simple' | 'medium' | 'complex';
  timeline: '24h' | '3d' | '1w' | '2w';
  deliveryMethod: 'github' | 'zip' | 'deployed';
  features: string[];
  totalAmount: number;
}

function ProjectDetailsPageContent() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`/api/orders/status?orderId=${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order status');
      }
      const data = await response.json();
      setOrder(data.order);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load project details');
    }
  };

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      await fetchOrderStatus();
      setLoading(false);
    };

    loadOrder();

    // Set up polling for real-time updates during build
    const interval = setInterval(async () => {
      if (order?.status === 'building') {
        await fetchOrderStatus();
      }
    }, 10000); // Poll every 10 seconds during build

    return () => clearInterval(interval);
  }, [params.id, order?.status]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrderStatus();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'building': return 'text-blue-600 bg-blue-50';
      case 'paid': return 'text-purple-600 bg-purple-50';
      case 'pending_payment': return 'text-yellow-600 bg-yellow-50';
      case 'payment_failed':
      case 'build_failed': return 'text-red-600 bg-red-50';
      case 'cancelled':
      case 'refunded': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'building': return <Activity className="w-5 h-5 animate-pulse" />;
      case 'paid': return <CheckCircle className="w-5 h-5" />;
      case 'pending_payment': return <Clock className="w-5 h-5" />;
      case 'payment_failed':
      case 'build_failed': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineText = (timeline: string) => {
    switch (timeline) {
      case '24h': return '24 Hours';
      case '3d': return '3 Days';
      case '1w': return '1 Week';
      case '2w': return '2 Weeks';
      default: return timeline;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The requested project could not be found.'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{order.appName}</h1>
              <p className="text-gray-600">Project ID: {order.id}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                  {order.status.replace('_', ' ')}
                </h2>
                <p className="text-gray-600">
                  {order.status === 'building' ? order.currentBuildStep || 'Building your application...' :
                    order.status === 'completed' ? 'Your project is ready!' :
                   order.status === 'paid' ? 'Payment received, starting build process...' :
                   'Processing your order'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {(order.status === 'building' || order.status === 'completed') && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Build Progress</span>
                <span className="text-sm text-gray-600">{order.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${order.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-600">Created</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            {order.paidAt && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-gray-600">Paid</p>
                  <p className="font-medium">{formatDate(order.paidAt)}</p>
                </div>
              </div>
            )}
            {order.completedAt && (
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-gray-600">Completed</p>
                  <p className="font-medium">{formatDate(order.completedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{order.customerEmail}</span>
              </div>
              {order.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>{order.company}</span>
                </div>
              )}
              {order.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{order.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Technical Specifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-gray-400" />
                <span><strong>Framework:</strong> {order.framework}</span>
              </div>
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-gray-400" />
                <span><strong>Complexity:</strong> {order.complexity}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span><strong>Timeline:</strong> {getTimelineText(order.timeline)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-gray-400" />
                <span><strong>Delivery:</strong> {order.deliveryMethod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Description */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h3>
          <p className="text-gray-700 leading-relaxed">{order.appDescription}</p>
        </div>

        {/* Features */}
        {order.features && order.features.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {order.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Build Logs */}
        {order.buildLogs && order.buildLogs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Build Logs
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
              {order.buildLogs.map((log: string, index: number) => (
                <div key={index} className="text-green-400 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Links */}
        {(order.deliveryUrl || order.githubUrl || order.vercelUrl) && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Project Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.githubUrl && (
                <a
                  href={order.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Github className="w-6 h-6" />
                  <div>
                    <div className="font-medium">GitHub Repository</div>
                    <div className="text-sm text-gray-600">View source code</div>
                  </div>
                </a>
              )}
              {order.vercelUrl && (
                <a
                  href={order.vercelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Globe className="w-6 h-6" />
                  <div>
                    <div className="font-medium">Live Application</div>
                    <div className="text-sm text-gray-600">Access your app</div>
                  </div>
                </a>
              )}
              {order.deliveryUrl && !order.githubUrl && !order.vercelUrl && (
                <a
                  href={order.deliveryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-6 h-6" />
                  <div>
                    <div className="font-medium">Download Project</div>
                    <div className="text-sm text-gray-600">Get your files</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Admin Notes */}
        {order.adminNotes && order.adminNotes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Updates</h3>
            <div className="space-y-3">
              {order.adminNotes.map((note, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                  <p className="text-gray-700">{note.note}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(note.timestamp)} by {note.admin}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {order.buildError && (
          <div className="bg-red-50 rounded-xl border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Build Error
            </h3>
            <p className="text-red-700">{order.buildError}</p>
            <p className="text-sm text-red-600 mt-2">
              Our team has been notified and will resolve this issue shortly.
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}

export default function ProjectDetailsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ProjectDetailsPageContent />
    </Suspense>
  );
}
