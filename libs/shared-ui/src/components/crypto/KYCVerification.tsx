'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '../../lib/button';
import { GlassCard } from '../../lib/glass-card';
import { KYCData } from '@ece-platform/shared-types';
import {
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Camera,
  User,
  MapPin,
  CreditCard,
  Eye,
  X
} from 'lucide-react';

interface KYCVerificationProps {
  userId: string;
  currentLevel?: 'none' | 'basic' | 'intermediate' | 'advanced';
  onLevelChange?: (level: string) => void;
  className?: string;
}

const KYC_LEVELS = {
  none: {
    name: 'No Verification',
    limits: { daily: 100, monthly: 1000 },
    requirements: [],
    color: 'text-gray-500'
  },
  basic: {
    name: 'Basic Verification',
    limits: { daily: 1000, monthly: 10000 },
    requirements: ['Email verification', 'Phone verification'],
    color: 'text-blue-500'
  },
  intermediate: {
    name: 'Intermediate Verification',
    limits: { daily: 10000, monthly: 100000 },
    requirements: ['Government ID', 'Selfie verification', 'Address proof'],
    color: 'text-yellow-500'
  },
  advanced: {
    name: 'Advanced Verification',
    limits: { daily: 100000, monthly: 1000000 },
    requirements: ['Enhanced due diligence', 'Source of funds', 'Bank statements'],
    color: 'text-green-500'
  }
};

const DOCUMENT_TYPES = [
  { id: 'passport', name: 'Passport', icon: FileText },
  { id: 'drivers_license', name: "Driver's License", icon: CreditCard },
  { id: 'id_card', name: 'National ID Card', icon: User },
  { id: 'proof_of_address', name: 'Proof of Address', icon: MapPin }
];

export const KYCVerification: React.FC<KYCVerificationProps> = ({
  userId,
  currentLevel = 'none',
  onLevelChange,
  className = ''
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>(currentLevel);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>({});
  const [documentPreviews, setDocumentPreviews] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'submitted' | 'reviewing' | 'approved' | 'rejected'>('idle');
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const handleFileUpload = useCallback((documentType: string, file: File) => {
    setUploadedDocuments(prev => ({ ...prev, [documentType]: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setDocumentPreviews(prev => ({ 
          ...prev, 
          [documentType]: e.target!.result as string 
        }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const removeDocument = useCallback((documentType: string) => {
    setUploadedDocuments(prev => {
      const newDocs = { ...prev };
      delete newDocs[documentType];
      return newDocs;
    });
    setDocumentPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[documentType];
      return newPreviews;
    });
  }, []);

  const submitVerification = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Mock submission process
      setVerificationStatus('submitted');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStatus('reviewing');
      
      if (onLevelChange) {
        onLevelChange(selectedLevel);
      }
    } catch (error) {
      console.error('KYC submission failed:', error);
      setVerificationStatus('rejected');
      setRejectionReason('Document validation failed. Please ensure all documents are clear and valid.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLevel, onLevelChange]);

  const getRequiredDocuments = () => {
    switch (selectedLevel) {
      case 'basic':
        return ['passport'];
      case 'intermediate':
        return ['passport', 'proof_of_address'];
      case 'advanced':
        return ['passport', 'drivers_license', 'proof_of_address'];
      default:
        return [];
    }
  };

  const isLevelComplete = () => {
    const required = getRequiredDocuments();
    return required.every(doc => uploadedDocuments[doc]);
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'submitted':
      case 'reviewing':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Shield className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'submitted':
        return 'Documents submitted successfully';
      case 'reviewing':
        return 'Under review - typically takes 1-3 business days';
      case 'approved':
        return 'Verification approved! Your limits have been increased.';
      case 'rejected':
        return rejectionReason;
      default:
        return 'Complete verification to increase your trading limits';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Status Overview */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              KYC Verification
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {/* Current Level */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Level</p>
              <p className={`text-lg font-semibold ${KYC_LEVELS[currentLevel as keyof typeof KYC_LEVELS]?.color}`}>
                {KYC_LEVELS[currentLevel as keyof typeof KYC_LEVELS]?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily Limit</p>
              <p className="text-lg font-semibold">
                ${KYC_LEVELS[currentLevel as keyof typeof KYC_LEVELS]?.limits.daily.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Level Selection */}
        {verificationStatus === 'idle' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Choose Verification Level
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(KYC_LEVELS).slice(1).map(([level, config]) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedLevel === level
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`font-semibold ${config.color}`}>{config.name}</h5>
                    {selectedLevel === level && <CheckCircle className="w-5 h-5 text-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Up to ${config.limits.daily.toLocaleString()}/day
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {config.requirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Document Upload */}
      {selectedLevel !== 'none' && verificationStatus === 'idle' && (
        <GlassCard className="p-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Upload Required Documents
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getRequiredDocuments().map(docType => {
              const docConfig = DOCUMENT_TYPES.find(d => d.id === docType);
              if (!docConfig) return null;
              
              const Icon = docConfig.icon;
              const hasDocument = uploadedDocuments[docType];
              
              return (
                <div key={docType} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium">{docConfig.name}</span>
                    {hasDocument && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  
                  {hasDocument ? (
                    <div className="relative">
                      <div className="border-2 border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900 dark:text-green-100">
                                {uploadedDocuments[docType].name}
                              </p>
                              <p className="text-sm text-green-600 dark:text-green-400">
                                {Math.round(uploadedDocuments[docType].size / 1024)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {documentPreviews[docType] && (
                              <button
                                onClick={() => window.open(documentPreviews[docType], '_blank')}
                                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-800 rounded"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => removeDocument(docType)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-800 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(docType, file);
                        }}
                        className="hidden"
                        id={`upload-${docType}`}
                      />
                      <label
                        htmlFor={`upload-${docType}`}
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Click to upload {docConfig.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Guidelines */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Document Guidelines
            </h5>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Ensure documents are clear and all text is readable</li>
              <li>• Documents must be valid and not expired</li>
              <li>• Photos should be well-lit with no glare or shadows</li>
              <li>• Personal information must match your account details</li>
            </ul>
          </div>

          {/* Submit Button */}
          {isLevelComplete() && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={submitVerification}
                disabled={isSubmitting}
                size="lg"
                className="px-8"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Submit for Verification
                  </>
                )}
              </Button>
            </div>
          )}
        </GlassCard>
      )}

      {/* Verification Status */}
      {verificationStatus !== 'idle' && (
        <GlassCard className="p-6">
          <div className="text-center">
            <div className="mb-4">
              {getStatusIcon()}
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {verificationStatus === 'submitted' && 'Documents Submitted'}
              {verificationStatus === 'reviewing' && 'Under Review'}
              {verificationStatus === 'approved' && 'Verification Approved'}
              {verificationStatus === 'rejected' && 'Verification Rejected'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {getStatusMessage()}
            </p>
            
            {verificationStatus === 'rejected' && (
              <Button
                onClick={() => {
                  setVerificationStatus('idle');
                  setRejectionReason('');
                }}
                variant="outline"
              >
                Try Again
              </Button>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
