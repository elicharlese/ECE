'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Smartphone, 
  Globe, 
  Database,
  Shield,
  Zap,
  Clock,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { OrderData } from '../OrderWizard';

interface RequirementsStepProps {
  data: OrderData;
  onUpdate: (data: Partial<OrderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const appTypes = [
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'Modern responsive web application',
    icon: Globe,
    features: ['Responsive Design', 'SEO Optimized', 'PWA Ready'],
    basePrice: 2500
  },
  {
    id: 'mobile-app',
    name: 'Mobile Application',
    description: 'Native or cross-platform mobile app',
    icon: Smartphone,
    features: ['iOS & Android', 'Push Notifications', 'Offline Support'],
    basePrice: 3500
  },
  {
    id: 'dashboard',
    name: 'Analytics Dashboard',
    description: 'Data visualization and analytics platform',
    icon: Database,
    features: ['Real-time Data', 'Interactive Charts', 'Export Tools'],
    basePrice: 3000
  },
  {
    id: 'api',
    name: 'API Service',
    description: 'RESTful API with documentation',
    icon: Settings,
    features: ['REST API', 'Documentation', 'Rate Limiting'],
    basePrice: 2000
  }
];

const availableFeatures = [
  { id: 'auth', name: 'User Authentication', price: 500, icon: Shield },
  { id: 'payments', name: 'Payment Processing', price: 800, icon: Database },
  { id: 'realtime', name: 'Real-time Updates', price: 600, icon: Zap },
  { id: 'notifications', name: 'Push Notifications', price: 400, icon: AlertCircle },
  { id: 'analytics', name: 'Analytics Integration', price: 300, icon: Database },
  { id: 'social', name: 'Social Login', price: 200, icon: Shield },
  { id: 'search', name: 'Advanced Search', price: 350, icon: Settings },
  { id: 'chat', name: 'Live Chat', price: 700, icon: Settings }
];

const priorities = [
  {
    id: 'standard',
    name: 'Standard',
    description: '14-21 days delivery',
    multiplier: 1,
    icon: Clock,
    color: 'text-[#A6E22E]'
  },
  {
    id: 'urgent',
    name: 'Urgent',
    description: '7-10 days delivery',
    multiplier: 1.5,
    icon: Zap,
    color: 'text-[#66D9EF]'
  },
  {
    id: 'express',
    name: 'Express',
    description: '3-5 days delivery',
    multiplier: 2,
    icon: AlertCircle,
    color: 'text-[#F92672]'
  }
];

export function RequirementsStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isLoading,
  setIsLoading
}: RequirementsStepProps) {
  const [selectedAppType, setSelectedAppType] = useState(data.requirements?.appType || '');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(data.requirements?.features || []);
  const [description, setDescription] = useState(data.requirements?.description || '');
  const [priority, setPriority] = useState(data.requirements?.priority || 'standard');
  const [customFeature, setCustomFeature] = useState('');

  useEffect(() => {
    onUpdate({
      requirements: {
        appType: selectedAppType,
        features: selectedFeatures,
        description,
        timeline: priorities.find(p => p.id === priority)?.description || '',
        priority: priority as 'standard' | 'urgent' | 'express'
      }
    });
  }, [selectedAppType, selectedFeatures, description, priority, onUpdate]);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const addCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature)) {
      setSelectedFeatures(prev => [...prev, customFeature]);
      setCustomFeature('');
    }
  };

  const removeCustomFeature = (feature: string) => {
    setSelectedFeatures(prev => prev.filter(f => f !== feature));
  };

  const calculatePrice = () => {
    const selectedType = appTypes.find(type => type.id === selectedAppType);
    const basePrice = selectedType?.basePrice || 0;
    
    const featuresPrice = selectedFeatures.reduce((total, featureId) => {
      const feature = availableFeatures.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);
    
    const selectedPriority = priorities.find(p => p.id === priority);
    const multiplier = selectedPriority?.multiplier || 1;
    
    return Math.round((basePrice + featuresPrice) * multiplier);
  };

  const isCustomFeature = (featureId: string) => {
    return !availableFeatures.some(f => f.id === featureId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={24} className="text-[#66D9EF]" />
            <h2 className="text-2xl font-bold text-[#F8EFD6]">
              Define Requirements
            </h2>
          </div>
          <p className="text-[#75715E]">
            Specify what type of application you want to build and its key features.
          </p>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* App Type Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-4">
              Application Type
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appTypes.map((type) => (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all duration-200
                    ${selectedAppType === type.id
                      ? 'border-[#F92672] bg-[#F92672]/10'
                      : 'border-[#75715E] hover:border-[#66D9EF] hover:bg-[#66D9EF]/5'
                    }
                  `}
                  onClick={() => setSelectedAppType(type.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <type.icon size={24} className="text-[#66D9EF]" />
                    <div>
                      <h4 className="text-[#F8EFD6] font-medium">{type.name}</h4>
                      <p className="text-[#75715E] text-sm">{type.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {type.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="text-xs border-[#75715E] text-[#75715E]"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#A6E22E] font-medium">
                        From {type.basePrice} ECE
                      </span>
                      {selectedAppType === type.id && (
                        <Badge className="bg-[#F92672] text-white">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Features Selection */}
          <GlassCard className="p-6 mt-6">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-4">
              Additional Features
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {availableFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between
                    ${selectedFeatures.includes(feature.id)
                      ? 'border-[#A6E22E] bg-[#A6E22E]/10'
                      : 'border-[#75715E] hover:border-[#66D9EF] hover:bg-[#66D9EF]/5'
                    }
                  `}
                  onClick={() => toggleFeature(feature.id)}
                >
                  <div className="flex items-center gap-3">
                    <feature.icon size={16} className="text-[#66D9EF]" />
                    <span className="text-[#F8EFD6]">{feature.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#A6E22E] text-sm">+{feature.price} ECE</span>
                    {selectedFeatures.includes(feature.id) && (
                      <Badge className="bg-[#A6E22E] text-[#272822]">
                        ✓
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Custom Feature Input */}
            <div className="border-t border-[#75715E]/30 pt-4">
              <h4 className="text-lg font-medium text-[#F8EFD6] mb-3">
                Custom Features
              </h4>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add custom feature..."
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#272822] border border-[#75715E] rounded-lg text-[#F8EFD6] placeholder-[#75715E] focus:border-[#F92672] outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
                />
                <Button
                  onClick={addCustomFeature}
                  disabled={!customFeature.trim()}
                  variant="outline"
                  size="sm"
                >
                  <Plus size={16} />
                </Button>
              </div>

              {/* Selected Custom Features */}
              {selectedFeatures.filter(isCustomFeature).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.filter(isCustomFeature).map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="border-[#66D9EF] text-[#66D9EF] flex items-center gap-1"
                    >
                      {feature}
                      <button
                        onClick={() => removeCustomFeature(feature)}
                        className="ml-1 hover:text-[#F92672]"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Project Description */}
          <GlassCard className="p-6 mt-6">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-4">
              Project Description
            </h3>
            <textarea
              placeholder="Describe your application goals, target audience, and specific requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-[#272822] border border-[#75715E] rounded-lg text-[#F8EFD6] placeholder-[#75715E] focus:border-[#F92672] outline-none resize-none"
            />
            <p className="text-[#75715E] text-sm mt-2">
              {description.length}/500 characters
            </p>
          </GlassCard>
        </motion.div>

        {/* Priority & Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Priority Selection */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-4">
              Priority Level
            </h3>
            
            <div className="space-y-3">
              {priorities.map((priorityOption) => (
                <motion.div
                  key={priorityOption.id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all duration-200
                    ${priority === priorityOption.id
                      ? 'border-[#F92672] bg-[#F92672]/10'
                      : 'border-[#75715E] hover:border-[#66D9EF] hover:bg-[#66D9EF]/5'
                    }
                  `}
                  onClick={() => setPriority(priorityOption.id as 'standard' | 'urgent' | 'express')}
                >
                  <div className="flex items-center gap-3">
                    <priorityOption.icon size={16} className={priorityOption.color} />
                    <div className="flex-1">
                      <h4 className="text-[#F8EFD6] font-medium">
                        {priorityOption.name}
                      </h4>
                      <p className="text-[#75715E] text-sm">
                        {priorityOption.description}
                      </p>
                    </div>
                    {priority === priorityOption.id && (
                      <Badge className="bg-[#F92672] text-white">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-[#A6E22E] text-sm">
                      {priorityOption.multiplier}x pricing
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Price Summary */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-4">
              Price Estimate
            </h3>
            
            <div className="space-y-3">
              {selectedAppType && (
                <div className="flex justify-between">
                  <span className="text-[#75715E]">Base Price:</span>
                  <span className="text-[#F8EFD6]">
                    {appTypes.find(t => t.id === selectedAppType)?.basePrice} ECE
                  </span>
                </div>
              )}
              
              {selectedFeatures.filter(f => !isCustomFeature(f)).map((featureId) => {
                const feature = availableFeatures.find(f => f.id === featureId);
                return feature ? (
                  <div key={featureId} className="flex justify-between">
                    <span className="text-[#75715E]">{feature.name}:</span>
                    <span className="text-[#F8EFD6]">+{feature.price} ECE</span>
                  </div>
                ) : null;
              })}
              
              {priority !== 'standard' && (
                <div className="flex justify-between">
                  <span className="text-[#75715E]">Priority Multiplier:</span>
                  <span className="text-[#66D9EF]">
                    {priorities.find(p => p.id === priority)?.multiplier}x
                  </span>
                </div>
              )}
              
              <div className="border-t border-[#75715E]/30 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#F8EFD6] font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-[#A6E22E]">
                    {calculatePrice()} ECE
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Selected Features Summary */}
          {selectedFeatures.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-[#F8EFD6] mb-3">
                Selected Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedFeatures.map((featureId) => {
                  const feature = availableFeatures.find(f => f.id === featureId);
                  return (
                    <Badge
                      key={featureId}
                      variant="outline"
                      className={`${
                        isCustomFeature(featureId)
                          ? 'border-[#66D9EF] text-[#66D9EF]'
                          : 'border-[#A6E22E] text-[#A6E22E]'
                      }`}
                    >
                      {feature?.name || featureId}
                    </Badge>
                  );
                })}
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}
