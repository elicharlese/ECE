'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { CreditCard } from 'lucide-react';
import { OrderData } from '../OrderWizard';

interface PaymentStepProps {
  data: OrderData;
  onUpdate: (data: Partial<OrderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function PaymentStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isLoading,
  setIsLoading
}: PaymentStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={24} className="text-[#FD5C63]" />
          <h2 className="text-2xl font-bold text-[#F8EFD6]">
            Payment & Checkout
          </h2>
        </div>
        <p className="text-[#75715E]">
          Complete your payment to start the development process.
        </p>
        
        <div className="mt-8 text-center">
          <p className="text-[#75715E]">Payment processing coming soon...</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
