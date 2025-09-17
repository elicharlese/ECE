'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock,
  Github,
  Settings,
  CreditCard,
  Rocket
} from 'lucide-react';

// Step Components
import { RepositoryStep } from './steps/RepositoryStep';
import { RequirementsStep } from './steps/RequirementsStep';
import { ConfigurationStep } from './steps/ConfigurationStep';
import { ReviewStep } from './steps/ReviewStep';
import { PaymentStep } from './steps/PaymentStep';

export interface OrderData {
  repository?: {
    url: string;
    provider: 'github' | 'gitlab' | 'bitbucket';
    name: string;
    description: string;
    language: string;
  };
  requirements?: {
    appType: string;
    features: string[];
    description: string;
    timeline: string;
    priority: 'standard' | 'urgent' | 'express';
  };
  configuration?: {
    framework: string;
    deployment: string;
    database: string;
    authentication: string;
    styling: string;
    features: Record<string, any>;
  };
  pricing?: {
    basePrice: number;
    addOns: Array<{ name: string; price: number }>;
    total: number;
    currency: 'ECE' | 'USD';
  };
  payment?: {
    method: 'wallet' | 'card' | 'crypto';
    confirmed: boolean;
    transactionId?: string;
  };
}

const steps = [
  {
    id: 1,
    title: 'Repository',
    description: 'Connect your code repository',
    icon: Github,
    component: RepositoryStep
  },
  {
    id: 2,
    title: 'Requirements',
    description: 'Define your app requirements',
    icon: Settings,
    component: RequirementsStep
  },
  {
    id: 3,
    title: 'Configuration',
    description: 'Technical configuration',
    icon: Settings,
    component: ConfigurationStep
  },
  {
    id: 4,
    title: 'Review',
    description: 'Review your order',
    icon: CheckCircle2,
    component: ReviewStep
  },
  {
    id: 5,
    title: 'Payment',
    description: 'Complete your order',
    icon: CreditCard,
    component: PaymentStep
  }
];

export function OrderWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const updateOrderData = useCallback((stepData: Partial<OrderData>) => {
    setOrderData(prev => ({ ...prev, ...stepData }));
  }, []);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!orderData.repository?.url;
      case 2:
        return !!orderData.requirements?.appType && !!orderData.requirements?.description;
      case 3:
        return !!orderData.configuration?.framework;
      case 4:
        return !!orderData.pricing?.total;
      case 5:
        return !!orderData.payment?.confirmed;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep]);
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Allow navigation to previous steps or next step if current is valid
    if (stepNumber < currentStep || (stepNumber === currentStep + 1 && validateStep(currentStep))) {
      setCurrentStep(stepNumber);
    }
  };

  const getCurrentComponent = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return null;

    const Component = step.component;
    return (
      <Component
        data={orderData}
        onUpdate={updateOrderData}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    );
  };

  const isStepAccessible = (stepNumber: number) => {
    return stepNumber <= currentStep || completedSteps.includes(stepNumber - 1);
  };

  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#383830] to-[#272822] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-[#F8EFD6] mb-2">
            Create Your Application
          </h1>
          <p className="text-[#75715E] text-lg">
            Transform your repository into a professional application
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  {/* Step Circle */}
                  <motion.button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isStepAccessible(step.id)}
                    className={`
                      relative flex items-center justify-center w-12 h-12 rounded-full
                      border-2 transition-all duration-300
                      ${isStepCompleted(step.id)
                        ? 'bg-[#A6E22E] border-[#A6E22E] text-[#272822]'
                        : step.id === currentStep
                        ? 'bg-[#F92672] border-[#F92672] text-white'
                        : isStepAccessible(step.id)
                        ? 'bg-transparent border-[#66D9EF] text-[#66D9EF] hover:bg-[#66D9EF]/10'
                        : 'bg-transparent border-[#75715E] text-[#75715E] cursor-not-allowed'
                      }
                    `}
                    whileHover={isStepAccessible(step.id) ? { scale: 1.05 } : {}}
                    whileTap={isStepAccessible(step.id) ? { scale: 0.95 } : {}}
                  >
                    {isStepCompleted(step.id) ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </motion.button>

                  {/* Step Info */}
                  <div className="ml-3 text-left">
                    <p className={`text-sm font-medium ${
                      step.id === currentStep ? 'text-[#F8EFD6]' : 'text-[#75715E]'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-[#75715E]">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-0.5 mx-4 transition-colors duration-300
                      ${isStepCompleted(step.id + 1) || step.id < currentStep
                        ? 'bg-[#A6E22E]'
                        : 'bg-[#75715E]'
                      }
                    `} />
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-[#75715E]/30 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-[#F92672] to-[#A6E22E] h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${(completedSteps.length / steps.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[#75715E]">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="text-xs text-[#75715E]">
                  {Math.round((completedSteps.length / steps.length) * 100)}% Complete
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getCurrentComponent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-between items-center"
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-[#75715E] text-[#75715E]">
              <Clock size={12} className="mr-1" />
              Est. {10 - currentStep * 2} min remaining
            </Badge>
          </div>

          <Button
            onClick={handleNext}
            disabled={!validateStep(currentStep)}
            className="flex items-center gap-2"
            variant={currentStep === steps.length ? "gradient" : "default"}
          >
            {currentStep === steps.length ? (
              <>
                <Rocket size={16} />
                Launch App
              </>
            ) : (
              <>
                Next
                <ChevronRight size={16} />
              </>
            )}
          </Button>
        </motion.div>

        {/* Order Summary Sidebar (for larger screens) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <GlassCard className="p-4 w-64">
            <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 text-sm">
              {orderData.repository && (
                <div>
                  <p className="text-[#75715E]">Repository:</p>
                  <p className="text-[#F8EFD6] truncate">{orderData.repository.name}</p>
                </div>
              )}
              {orderData.requirements && (
                <div>
                  <p className="text-[#75715E]">App Type:</p>
                  <p className="text-[#F8EFD6]">{orderData.requirements.appType}</p>
                </div>
              )}
              {orderData.pricing && (
                <div className="pt-3 border-t border-[#75715E]/30">
                  <p className="text-[#75715E]">Total:</p>
                  <p className="text-xl font-bold text-[#A6E22E]">
                    {orderData.pricing.total} {orderData.pricing.currency}
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
