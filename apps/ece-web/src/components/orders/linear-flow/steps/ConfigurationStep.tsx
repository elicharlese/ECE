'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Settings } from 'lucide-react';
import { OrderData } from '../OrderWizard';

interface ConfigurationStepProps {
  data: OrderData;
  onUpdate: (data: Partial<OrderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function ConfigurationStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isLoading,
  setIsLoading
}: ConfigurationStepProps) {
  // Mock configuration data
  React.useEffect(() => {
    onUpdate({
      configuration: {
        framework: 'Next.js',
        deployment: 'Vercel',
        database: 'PostgreSQL',
        authentication: 'NextAuth',
        styling: 'Tailwind CSS',
        features: {}
      }
    });
  }, [onUpdate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings size={24} className="text-[#66D9EF]" />
          <h2 className="text-2xl font-bold text-[#F8EFD6]">
            Technical Configuration
          </h2>
        </div>
        <p className="text-[#75715E]">
          Configure the technical aspects of your application.
        </p>
        
        <div className="mt-8 text-center">
          <p className="text-[#75715E]">Configuration options coming soon...</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
