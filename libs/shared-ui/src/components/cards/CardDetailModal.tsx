'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, DollarSign, Zap, TrendingUp, Code2, ExternalLink } from 'lucide-react';
import { Button } from '../../lib/button';
import { GlassCard } from '../../lib/glass-card';

interface CardDetailModalProps {
  card: any;
  isOpen: boolean;
  onClose: () => void;
  onBid?: (amount: number) => void;
  onBuy?: () => void;
  onBattle?: () => void;
  onLike?: () => void;
  currentUserAddress?: string;
}

export function CardDetailModal({ 
  card, 
  isOpen, 
  onClose, 
  onBid, 
  onBuy, 
  onBattle, 
  onLike,
  currentUserAddress 
}: CardDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'financial' | 'market'>('overview');
  const [bidAmount, setBidAmount] = useState(card?.minimumBidAmount || 0);

  if (!card) return null;

  const isOwnCard = currentUserAddress?.toLowerCase() === card.owner?.walletAddress?.toLowerCase();
  const canInteract = !isOwnCard;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'technical', label: 'Technical', icon: Code2 },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'market', label: 'Market', icon: TrendingUp }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Card Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{card.name}</h1>
        <p className="text-gray-300 text-lg mb-4">{card.description}</p>
        
        {/* Rarity Badge */}
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
          card.rarity === 'MYTHIC' ? 'bg-gradient-to-r from-pink-500 to-purple-500' :
          card.rarity === 'LEGENDARY' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
          card.rarity === 'EPIC' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
          card.rarity === 'RARE' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
          'bg-gradient-to-r from-gray-500 to-gray-600'
        } text-white`}>
          {card.rarity}
        </div>
      </div>

      {/* Owner Info */}
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Owner</h3>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {card.owner?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{card.owner?.username}</p>
            <p className="text-gray-400 text-sm">{card.owner?.walletAddress?.slice(0, 8)}...{card.owner?.walletAddress?.slice(-4)}</p>
          </div>
        </div>
      </GlassCard>

      {/* Battle Stats */}
      {card.stats && (
        <GlassCard className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Battle Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{card.stats.attack}</div>
              <div className="text-sm text-gray-400">Attack</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{card.stats.defense}</div>
              <div className="text-sm text-gray-400">Defense</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{card.stats.speed}</div>
              <div className="text-sm text-gray-400">Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{card.stats.special}</div>
              <div className="text-sm text-gray-400">Special</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{card.stats.overall}</div>
              <div className="text-sm text-gray-400">Overall Rating</div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Generation Info */}
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Generation Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Type:</span>
            <span className="text-white">{card.generationType?.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Enhancement Level:</span>
            <span className="text-white">{card.enhancementLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Generation Cost:</span>
            <span className="text-green-400">{card.generationCost} ECE</span>
          </div>
          {card.sourceCodeUrl && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Source Code:</span>
              <a 
                href={card.sourceCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <span>View</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );

  const renderTechnical = () => (
    <div className="space-y-6">
      {/* Technical Metrics */}
      {card.technicalMetrics && (
        <GlassCard className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Technical Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Code Quality</div>
              <div className="flex items-center mt-1">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${card.technicalMetrics.quality}%` }}
                  />
                </div>
                <span className="ml-2 text-white text-sm">{Math.round(card.technicalMetrics.quality)}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Complexity</div>
              <div className="flex items-center mt-1">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${card.technicalMetrics.complexity}%` }}
                  />
                </div>
                <span className="ml-2 text-white text-sm">{Math.round(card.technicalMetrics.complexity)}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Security</div>
              <div className="flex items-center mt-1">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${card.technicalMetrics.security}%` }}
                  />
                </div>
                <span className="ml-2 text-white text-sm">{Math.round(card.technicalMetrics.security)}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Scalability</div>
              <div className="flex items-center mt-1">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${card.technicalMetrics.scalability}%` }}
                  />
                </div>
                <span className="ml-2 text-white text-sm">{Math.round(card.technicalMetrics.scalability)}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Codebase Stats */}
      {card.codebaseStats && (
        <GlassCard className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Codebase Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Lines of Code:</span>
              <span className="text-white">{card.codebaseStats.linesOfCode?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Files:</span>
              <span className="text-white">{card.codebaseStats.filesCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Test Coverage:</span>
              <span className="text-white">{card.codebaseStats.testCoverage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Documentation:</span>
              <span className="text-white">{card.codebaseStats.documentationScore}%</span>
            </div>
          </div>
          
          {card.codebaseStats.languages && (
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-2">Languages:</div>
              <div className="flex flex-wrap gap-2">
                {card.codebaseStats.languages.map((lang: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs text-white">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {card.codebaseStats.dependencies && (
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-2">Key Dependencies:</div>
              <div className="flex flex-wrap gap-2">
                {card.codebaseStats.dependencies.slice(0, 6).map((dep: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs text-white">
                    {dep}
                  </span>
                ))}
                {card.codebaseStats.dependencies.length > 6 && (
                  <span className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
                    +{card.codebaseStats.dependencies.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-6">
      {card.businessMetrics && (
        <>
          {/* Valuation */}
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Business Valuation</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Market Size</div>
                <div className="text-2xl font-bold text-green-400">
                  ${(card.businessMetrics.marketSize / 1000000).toFixed(1)}M
                </div>
              </div>
              <div>
                <div className="text-gray-400">Revenue Projection</div>
                <div className="text-2xl font-bold text-blue-400">
                  ${(card.businessMetrics.revenueProjection / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <div className="text-gray-400">Growth Rate</div>
                <div className="text-2xl font-bold text-purple-400">
                  {card.businessMetrics.growthRate}%
                </div>
              </div>
              <div>
                <div className="text-gray-400">Opportunity Score</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {card.businessMetrics.opportunityScore}/100
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Business Model */}
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Business Model</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-400">Target Market:</div>
                <div className="text-white">{card.businessMetrics.targetMarket}</div>
              </div>
              <div>
                <div className="text-gray-400">Business Model:</div>
                <div className="text-white">{card.businessMetrics.businessModel}</div>
              </div>
              <div>
                <div className="text-gray-400">Competitive Advantage:</div>
                <div className="text-white">{card.businessMetrics.competitiveAdvantage}</div>
              </div>
            </div>

            {card.businessMetrics.monetizationStrategy && (
              <div className="mt-4">
                <div className="text-gray-400 text-sm mb-2">Monetization Strategy:</div>
                <div className="flex flex-wrap gap-2">
                  {card.businessMetrics.monetizationStrategy.map((strategy: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-green-900/30 border border-green-500/30 rounded text-xs text-green-300">
                      {strategy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {card.businessMetrics.riskFactors && (
              <div className="mt-4">
                <div className="text-gray-400 text-sm mb-2">Risk Factors:</div>
                <ul className="list-disc list-inside text-xs text-red-300 space-y-1">
                  {card.businessMetrics.riskFactors.map((risk: string, idx: number) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-6">
      {/* Current Market Data */}
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Market Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{card.currentPrice}</div>
            <div className="text-sm text-gray-400">Current Price (ECE)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{card.marketCap || 'N/A'}</div>
            <div className="text-sm text-gray-400">Market Cap (ECE)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{card.tradingVolume || 0}</div>
            <div className="text-sm text-gray-400">24h Volume (ECE)</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${card.metrics?.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {card.metrics?.priceChange24h > 0 ? '+' : ''}{card.metrics?.priceChange24h?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-400">24h Change</div>
          </div>
        </div>
      </GlassCard>

      {/* Interaction Options */}
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Interaction Status</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded-lg text-center ${
            card.availableForBidding ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-700/30 border border-gray-500/30'
          }`}>
            <div className="text-lg mb-1">🏷️</div>
            <div className={card.availableForBidding ? 'text-green-300' : 'text-gray-400'}>
              {card.availableForBidding ? 'Bidding Open' : 'No Bidding'}
            </div>
            {card.availableForBidding && card.minimumBidAmount && (
              <div className="text-xs mt-1 text-gray-300">Min: {card.minimumBidAmount} ECE</div>
            )}
          </div>

          <div className={`p-3 rounded-lg text-center ${
            card.availableForBuying ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-gray-700/30 border border-gray-500/30'
          }`}>
            <div className="text-lg mb-1">💰</div>
            <div className={card.availableForBuying ? 'text-blue-300' : 'text-gray-400'}>
              {card.availableForBuying ? 'Available to Buy' : 'Not for Sale'}
            </div>
            {card.availableForBuying && card.fixedBuyPrice && (
              <div className="text-xs mt-1 text-gray-300">Price: {card.fixedBuyPrice} ECE</div>
            )}
          </div>

          <div className={`p-3 rounded-lg text-center ${
            card.availableForBattling ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-gray-700/30 border border-gray-500/30'
          }`}>
            <div className="text-lg mb-1">⚔️</div>
            <div className={card.availableForBattling ? 'text-purple-300' : 'text-gray-400'}>
              {card.availableForBattling ? 'Battle Ready' : 'No Battles'}
            </div>
            {card.availableForBattling && card.battleStakeAmount && (
              <div className="text-xs mt-1 text-gray-300">Stake: {card.battleStakeAmount} ECE</div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );

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
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <GlassCard className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-600">
                <div className="flex space-x-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'technical' && renderTechnical()}
                {activeTab === 'financial' && renderFinancial()}
                {activeTab === 'market' && renderMarket()}
              </div>

              {/* Action Bar */}
              {canInteract && (
                <div className="border-t border-gray-600 p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <Button
                      onClick={onLike}
                      variant="ghost"
                      className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Like
                    </Button>

                    <div className="flex space-x-3">
                      {card.availableForBidding && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min={card.minimumBidAmount || 0}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
                            className="w-24 p-2 bg-gray-800/50 border border-gray-600 rounded text-white text-sm"
                            placeholder="Bid"
                          />
                          <Button
                            onClick={() => onBid?.(bidAmount)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black"
                            disabled={bidAmount < (card.minimumBidAmount || 0)}
                          >
                            Place Bid
                          </Button>
                        </div>
                      )}

                      {card.availableForBuying && card.fixedBuyPrice && (
                        <Button
                          onClick={onBuy}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Buy Now ({card.fixedBuyPrice} ECE)
                        </Button>
                      )}

                      {card.availableForBattling && (
                        <Button
                          onClick={onBattle}
                          className="bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Challenge
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
