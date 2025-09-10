'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Zap, Github, DollarSign } from 'lucide-react';
import { Button } from '../../lib/button';
import { GlassCard } from '../../lib/glass-card';
import { useECEWallet } from '../../hooks/use-ece-wallet';

interface CardGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardGenerated?: (card: any) => void;
}

export function CardGenerationModal({ isOpen, onClose, onCardGenerated }: CardGenerationModalProps) {
  const { address, eceBalance } = useECEWallet();
  const [generationType, setGenerationType] = useState<'CODE_UPLOAD' | 'CARD_ORDER' | 'CODEBASE_ENHANCE'>('CODE_UPLOAD');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    category: 'TECHNOLOGY',
    sourceCodeUrl: '',
    preferences: {
      bidding: true,
      buying: true,
      battling: true,
      minimumBid: 0,
      fixedPrice: 0,
      battleStake: 0
    }
  });

  const generationCosts = {
    CODE_UPLOAD: 50,
    CARD_ORDER: 100,
    CODEBASE_ENHANCE: 150
  };

  const handleGenerate = async () => {
    if (!address || eceBalance < generationCosts[generationType]) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/cards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          generationType,
          companyName: formData.companyName,
          description: formData.description,
          category: formData.category,
          sourceCodeUrl: formData.sourceCodeUrl,
          preferences: formData.preferences
        })
      });

      const result = await response.json();

      if (result.success) {
        onCardGenerated?.(result.card);
        onClose();
        // Reset form
        setFormData({
          companyName: '',
          description: '',
          category: 'TECHNOLOGY',
          sourceCodeUrl: '',
          preferences: {
            bidding: true,
            buying: true,
            battling: true,
            minimumBid: 0,
            fixedPrice: 0,
            battleStake: 0
          }
        });
      } else {
        console.error('Generation failed:', result.error);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = () => {
    if (!formData.companyName) return false;
    if ((generationType === 'CODE_UPLOAD' || generationType === 'CODEBASE_ENHANCE') && !formData.sourceCodeUrl) return false;
    if (eceBalance < generationCosts[generationType]) return false;
    return true;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Generate ECE Card
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Generation Type Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Choose Generation Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                      generationType === 'CODE_UPLOAD'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setGenerationType('CODE_UPLOAD')}
                  >
                    <Upload className="w-8 h-8 mb-2 text-blue-400" />
                    <h4 className="font-semibold text-white">Upload Code</h4>
                    <p className="text-sm text-gray-400">Upload existing codebase</p>
                    <p className="text-xs text-green-400 mt-1">{generationCosts.CODE_UPLOAD} ECE</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                      generationType === 'CARD_ORDER'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setGenerationType('CARD_ORDER')}
                  >
                    <Plus className="w-8 h-8 mb-2 text-purple-400" />
                    <h4 className="font-semibold text-white">Order New Card</h4>
                    <p className="text-sm text-gray-400">Create from concept</p>
                    <p className="text-xs text-green-400 mt-1">{generationCosts.CARD_ORDER} ECE</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                      generationType === 'CODEBASE_ENHANCE'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setGenerationType('CODEBASE_ENHANCE')}
                  >
                    <Zap className="w-8 h-8 mb-2 text-yellow-400" />
                    <h4 className="font-semibold text-white">Enhance Code</h4>
                    <p className="text-sm text-gray-400">AI-enhance existing code</p>
                    <p className="text-xs text-green-400 mt-1">{generationCosts.CODEBASE_ENHANCE} ECE</p>
                  </motion.div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your company name"
                  />
                </div>

                {(generationType === 'CODE_UPLOAD' || generationType === 'CODEBASE_ENHANCE') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Github className="w-4 h-4 inline mr-1" />
                      Repository URL *
                    </label>
                    <input
                      type="url"
                      value={formData.sourceCodeUrl}
                      onChange={(e) => setFormData({ ...formData, sourceCodeUrl: e.target.value })}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="https://github.com/username/repository"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    rows={3}
                    placeholder="Describe your company or product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="TECHNOLOGY">Technology</option>
                    <option value="AUTOMOTIVE">Automotive</option>
                    <option value="REAL_ESTATE">Real Estate</option>
                    <option value="LUXURY">Luxury</option>
                    <option value="GAMING">Gaming</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                  </select>
                </div>
              </div>

              {/* Card Preferences */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Card Interaction Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.preferences.bidding}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, bidding: e.target.checked }
                      })}
                      className="rounded bg-gray-800 border-gray-600"
                    />
                    <span className="text-white">Available for Bidding</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.preferences.buying}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, buying: e.target.checked }
                      })}
                      className="rounded bg-gray-800 border-gray-600"
                    />
                    <span className="text-white">Available for Buying</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.preferences.battling}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, battling: e.target.checked }
                      })}
                      className="rounded bg-gray-800 border-gray-600"
                    />
                    <span className="text-white">Available for Battling</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Minimum Bid (ECE)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.preferences.minimumBid}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, minimumBid: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Fixed Buy Price (ECE)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.preferences.fixedPrice}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, fixedPrice: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Battle Stake (ECE)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.preferences.battleStake}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, battleStake: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Balance Check and Generate Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                <div className="text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Your ECE Balance: {eceBalance}</span>
                  </div>
                  <div className="mt-1">
                    <span className={eceBalance >= generationCosts[generationType] ? 'text-green-400' : 'text-red-400'}>
                      Cost: {generationCosts[generationType]} ECE
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate() || isGenerating}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : `Generate Card (${generationCosts[generationType]} ECE)`}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
