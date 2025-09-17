'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Settings,
  Database,
  Cloud,
  Code,
  Palette
} from 'lucide-react';

interface BatchItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  phase: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  progress: number;
  icon: React.ElementType;
  features: string[];
  estimatedTime: string;
  completedAt?: Date;
}

const batch2Items: BatchItem[] = [
  // Phase 1: 3D Environment & Core Features
  {
    id: 'patch-6-3d-token',
    title: '3D Token Model & Visualization',
    description: 'Interactive 3D ECE token with multiple rarities and animations',
    status: 'completed',
    priority: 'critical',
    phase: 1,
    progress: 100,
    icon: Star,
    features: ['3D Models', 'Interactive Controls', 'Rarity System', 'Performance Optimization'],
    estimatedTime: '2 hours',
    completedAt: new Date()
  },
  {
    id: 'patch-6-3d-cards',
    title: '3D NFT Card System',
    description: 'Enhanced 3D trading cards with holographic effects',
    status: 'completed',
    priority: 'high',
    phase: 1,
    progress: 100,
    icon: Zap,
    features: ['3D Card Models', 'Holographic Effects', 'Gallery View', 'Trading Animations'],
    estimatedTime: '3 hours',
    completedAt: new Date()
  },
  {
    id: 'patch-6-shadows',
    title: 'Enhanced Shadow Design System',
    description: 'Comprehensive shadow system for UI components',
    status: 'completed',
    priority: 'medium',
    phase: 1,
    progress: 100,
    icon: Palette,
    features: ['Floating Shadows', 'Strong Shadows', 'Soft Shadows', 'Button Enhancements'],
    estimatedTime: '1 hour',
    completedAt: new Date()
  },
  
  // Phase 2: Enterprise Integration
  {
    id: 'patch-7-sso',
    title: 'Single Sign-On Implementation',
    description: 'Enterprise SSO with Azure AD, Google Workspace, and SAML',
    status: 'completed',
    priority: 'critical',
    phase: 2,
    progress: 100,
    icon: Shield,
    features: ['Azure AD', 'Google Workspace', 'SAML 2.0', 'LDAP Support'],
    estimatedTime: '4 hours',
    completedAt: new Date()
  },
  {
    id: 'patch-7-api-gateway',
    title: 'Enterprise API Gateway',
    description: 'Rate limiting, API keys, webhooks, and audit logging',
    status: 'completed',
    priority: 'critical',
    phase: 2,
    progress: 100,
    icon: Database,
    features: ['Rate Limiting', 'API Keys', 'Webhooks', 'Audit Logs', 'Metrics'],
    estimatedTime: '4 hours',
    completedAt: new Date()
  },
  {
    id: 'patch-7-compliance',
    title: 'Security & Compliance Framework',
    description: 'SOC 2, GDPR compliance, and security monitoring',
    status: 'in_progress',
    priority: 'critical',
    phase: 2,
    progress: 75,
    icon: Shield,
    features: ['SOC 2 Type II', 'GDPR Compliance', 'Data Encryption', 'Security Audits'],
    estimatedTime: '3 hours'
  },
  
  // Phase 3: Social & Community Features
  {
    id: 'patch-9-social',
    title: 'Enhanced Social Features',
    description: 'User profiles, connections, and community platform',
    status: 'completed',
    priority: 'high',
    phase: 3,
    progress: 100,
    icon: Users,
    features: ['Social Profiles', 'Connections', 'Trading Groups', 'Activity Feeds'],
    estimatedTime: '5 hours',
    completedAt: new Date()
  },
  {
    id: 'patch-9-trading',
    title: 'Social Trading Features',
    description: 'Trading signals, copy trading, and performance tracking',
    status: 'in_progress',
    priority: 'high',
    phase: 3,
    progress: 60,
    icon: Zap,
    features: ['Trading Signals', 'Copy Trading', 'Leaderboards', 'Challenges'],
    estimatedTime: '4 hours'
  },
  
  // Phase 4: Order Flow & MCP Integration
  {
    id: 'patch-11-mcp',
    title: 'GitHub MCP Server Integration',
    description: 'Model Context Protocol for GitHub repository integration',
    status: 'completed',
    priority: 'critical',
    phase: 4,
    progress: 100,
    icon: Code,
    features: ['Repository Analysis', 'App Generation', 'CI/CD Setup', 'Order Integration'],
    estimatedTime: '6 hours',
    completedAt: new Date()
  },
  {
    id: 'patch-11-order-flow',
    title: 'Linear Order Flow',
    description: 'Streamlined 5-step order process with MCP integration',
    status: 'in_progress',
    priority: 'critical',
    phase: 4,
    progress: 80,
    icon: Settings,
    features: ['Repository Selection', 'Requirements', 'Configuration', 'Review', 'Payment'],
    estimatedTime: '3 hours'
  },
  
  // Phase 5: UI/UX Enhancement
  {
    id: 'patch-12-buttons',
    title: 'Button System Enhancement',
    description: 'Fix shadows, variants, and consistency across all components',
    status: 'in_progress',
    priority: 'medium',
    phase: 5,
    progress: 90,
    icon: Palette,
    features: ['Shadow Fixes', 'Variant Cleanup', 'Hover States', 'Accessibility'],
    estimatedTime: '2 hours'
  },
  {
    id: 'patch-12-icons',
    title: 'Icon System Standardization',
    description: 'Consistent icons across light and dark themes',
    status: 'pending',
    priority: 'medium',
    phase: 5,
    progress: 0,
    icon: Star,
    features: ['Theme-aware Icons', 'Icon Library', 'Consistency Check'],
    estimatedTime: '2 hours'
  },
  
  // Phase 6: QA & Testing
  {
    id: 'patch-13-testing',
    title: 'Comprehensive Testing Suite',
    description: 'End-to-end testing for all batch 2 features',
    status: 'pending',
    priority: 'high',
    phase: 6,
    progress: 0,
    icon: CheckCircle,
    features: ['E2E Tests', '3D Performance Tests', 'Security Tests', 'Load Tests'],
    estimatedTime: '4 hours'
  },
  
  // Phase 7: Documentation & Deployment
  {
    id: 'patch-14-docs',
    title: 'Technical Documentation',
    description: 'Complete documentation for all enterprise features',
    status: 'pending',
    priority: 'medium',
    phase: 7,
    progress: 0,
    icon: Database,
    features: ['API Docs', '3D Development Guide', 'Security Docs', 'User Guides'],
    estimatedTime: '3 hours'
  },
  {
    id: 'patch-15-deployment',
    title: 'Production Deployment',
    description: 'Deploy all batch 2 features to production',
    status: 'pending',
    priority: 'critical',
    phase: 7,
    progress: 0,
    icon: Cloud,
    features: ['Production Setup', 'Monitoring', 'Performance Validation'],
    estimatedTime: '2 hours'
  }
];

export function Batch2Dashboard() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const totalItems = batch2Items.length;
    const completedProgress = batch2Items.reduce((sum, item) => sum + item.progress, 0);
    setOverallProgress(Math.round(completedProgress / totalItems));
  }, []);

  const getStatusIcon = (status: BatchItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-[#A6E22E]" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-[#66D9EF]" />;
      case 'blocked':
        return <AlertCircle className="w-5 h-5 text-[#F92672]" />;
      default:
        return <Clock className="w-5 h-5 text-[#75715E]" />;
    }
  };

  const getStatusColor = (status: BatchItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#A6E22E]/20 text-[#A6E22E]';
      case 'in_progress':
        return 'bg-[#66D9EF]/20 text-[#66D9EF]';
      case 'blocked':
        return 'bg-[#F92672]/20 text-[#F92672]';
      default:
        return 'bg-[#75715E]/20 text-[#75715E]';
    }
  };

  const getPriorityColor = (priority: BatchItem['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-[#F92672] text-white';
      case 'high':
        return 'bg-[#FD5C63] text-white';
      case 'medium':
        return 'bg-[#66D9EF] text-white';
      default:
        return 'bg-[#75715E] text-white';
    }
  };

  const phaseStats = Array.from({ length: 7 }, (_, i) => {
    const phaseItems = batch2Items.filter(item => item.phase === i + 1);
    const completed = phaseItems.filter(item => item.status === 'completed').length;
    const inProgress = phaseItems.filter(item => item.status === 'in_progress').length;
    const pending = phaseItems.filter(item => item.status === 'pending').length;
    const progress = phaseItems.reduce((sum, item) => sum + item.progress, 0) / phaseItems.length;
    
    return {
      phase: i + 1,
      total: phaseItems.length,
      completed,
      inProgress,
      pending,
      progress: Math.round(progress)
    };
  });

  const filteredItems = selectedPhase 
    ? batch2Items.filter(item => item.phase === selectedPhase)
    : batch2Items;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#383830] to-[#272822] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#F8EFD6] mb-2">
            Batch 2 Implementation Dashboard
          </h1>
          <p className="text-[#75715E] text-lg">
            Complete ECE Platform Implementation - Patches 6-15
          </p>
          
          {/* Overall Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#F8EFD6] font-medium">Overall Progress</span>
              <span className="text-[#A6E22E] font-bold">{overallProgress}%</span>
            </div>
            <div className="w-full bg-[#75715E]/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-[#A6E22E] to-[#66D9EF] h-3 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Phase Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-[#F8EFD6] mb-4">Phase Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {phaseStats.map((phase) => (
              <motion.div
                key={phase.phase}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlassCard 
                  className={`p-4 cursor-pointer transition-all ${
                    selectedPhase === phase.phase 
                      ? 'ring-2 ring-[#66D9EF]' 
                      : ''
                  }`}
                  onClick={() => setSelectedPhase(selectedPhase === phase.phase ? null : phase.phase)}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-[#F8EFD6] mb-2">
                      Phase {phase.phase}
                    </h3>
                    <div className="mb-3">
                      <div className="w-full bg-[#75715E]/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#A6E22E] to-[#66D9EF] h-2 rounded-full"
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                      <span className="text-[#A6E22E] text-sm font-bold">
                        {phase.progress}%
                      </span>
                    </div>
                    <div className="text-sm text-[#75715E]">
                      <div>✅ {phase.completed} completed</div>
                      <div>🔄 {phase.inProgress} in progress</div>
                      <div>⏳ {phase.pending} pending</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Items List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#F8EFD6]">
              {selectedPhase ? `Phase ${selectedPhase} Items` : 'All Items'}
            </h2>
            {selectedPhase && (
              <Button
                variant="ghost"
                onClick={() => setSelectedPhase(null)}
                className="text-[#75715E] hover:text-[#F8EFD6]"
              >
                Show All Phases
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 p-2 bg-[#75715E]/20 rounded-lg">
                        <item.icon className="w-6 h-6 text-[#66D9EF]" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-[#F8EFD6]">
                            {item.title}
                          </h3>
                          {getStatusIcon(item.status)}
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge className="bg-[#75715E]/20 text-[#75715E]">
                            Phase {item.phase}
                          </Badge>
                        </div>
                        
                        <p className="text-[#75715E] mb-3">
                          {item.description}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-[#75715E]">Progress</span>
                            <span className="text-sm font-bold text-[#A6E22E]">
                              {item.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-[#75715E]/20 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className="bg-gradient-to-r from-[#A6E22E] to-[#66D9EF] h-2 rounded-full"
                            />
                          </div>
                        </div>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.features.map((feature) => (
                            <Badge
                              key={feature}
                              className="bg-[#66D9EF]/20 text-[#66D9EF] text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Metadata */}
                        <div className="flex items-center space-x-4 text-sm text-[#75715E]">
                          <span>⏱️ {item.estimatedTime}</span>
                          {item.completedAt && (
                            <span>✅ Completed {item.completedAt.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-[#A6E22E] mb-2">
              {batch2Items.filter(item => item.status === 'completed').length}
            </div>
            <div className="text-[#75715E]">Completed</div>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-[#66D9EF] mb-2">
              {batch2Items.filter(item => item.status === 'in_progress').length}
            </div>
            <div className="text-[#75715E]">In Progress</div>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-[#F92672] mb-2">
              {batch2Items.filter(item => item.status === 'blocked').length}
            </div>
            <div className="text-[#75715E]">Blocked</div>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-[#75715E] mb-2">
              {batch2Items.filter(item => item.status === 'pending').length}
            </div>
            <div className="text-[#75715E]">Pending</div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
