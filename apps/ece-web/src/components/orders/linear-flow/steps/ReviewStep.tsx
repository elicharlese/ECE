'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { CheckCircle } from 'lucide-react';
import { OrderData } from '../OrderWizard';

interface ReviewStepProps {
  data: OrderData;
  onUpdate: (data: Partial<OrderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function ReviewStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isLoading,
  setIsLoading
}: ReviewStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle size={24} className="text-[#A6E22E]" />
          <h2 className="text-2xl font-bold text-[#F8EFD6]">
            Review Your Order
          </h2>
        </div>
        <p className="text-[#75715E]">
          Review all the details before proceeding to payment.
        </p>
        
        <div className="mt-8 text-center">
          <p className="text-[#75715E]">Order review coming soon...</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
