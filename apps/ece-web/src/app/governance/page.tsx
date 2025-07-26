'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Textarea } from '../../components/ui/textarea'
import { Input } from '../../components/ui/input'
import { 
  Vote, 
  Plus, 
  Clock,
  Users,
  CheckCircle,
  XCircle,
  BarChart3,
  AlertCircle,
  Settings,
  DollarSign,
  Shield,
  Zap,
  TrendingUp,
  Eye,
  MessageCircle,
  Calendar,
  Info
} from 'lucide-react'

interface GovernanceProposal {
  id: string
  title: string
  description: string
  proposalType: 'MARKETPLACE_PARAMETERS' | 'FEE_ADJUSTMENT' | 'NEW_FEATURE' | 'SECURITY_UPDATE' | 'TREASURY_ALLOCATION' | 'GENERAL'
  proposer: string
  status: 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED' | 'EXPIRED'
  votingStartsAt: Date
  votingEndsAt: Date
  minQuorum: number
  minApproval: number
  totalVotes: number
  yesVotes: number
  noVotes: number
  abstainVotes: number
  userVote?: 'YES' | 'NO' | 'ABSTAIN'
  userVotingPower?: number
  createdAt: Date
}

const proposals: GovernanceProposal[] = [
  {
    id: 'prop-001',
    title: 'Reduce Marketplace Trading Fees',
    description: 'Proposal to reduce trading fees from 2.5% to 2.0% to increase trading volume and user adoption. This change would affect all marketplace transactions including betting, auctions, and M&A battles.',
    proposalType: 'FEE_ADJUSTMENT',
    proposer: 'Community Council',
    status: 'ACTIVE',
    votingStartsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    votingEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    minQuorum: 0.15,
    minApproval: 0.51,
    totalVotes: 450000,
    yesVotes: 285000,
    noVotes: 135000,
    abstainVotes: 30000,
    userVote: 'YES',
    userVotingPower: 2500,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'prop-002',
    title: 'Implement Advanced Options Trading',
    description: 'Add sophisticated derivatives trading including card options (calls/puts), futures contracts, and synthetic instruments to the marketplace platform.',
    proposalType: 'NEW_FEATURE',
    proposer: 'Development Team',
    status: 'ACTIVE',
    votingStartsAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    votingEndsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    minQuorum: 0.20,
    minApproval: 0.66,
    totalVotes: 320000,
    yesVotes: 240000,
    noVotes: 65000,
    abstainVotes: 15000,
    userVotingPower: 2500,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'prop-003',
    title: 'Allocate Treasury for Marketing Campaign',
    description: 'Allocate 500,000 ECE from community treasury for a comprehensive marketing campaign to drive user acquisition and platform growth.',
    proposalType: 'TREASURY_ALLOCATION',
    proposer: 'Marketing Committee',
    status: 'PASSED',
    votingStartsAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    votingEndsAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    minQuorum: 0.12,
    minApproval: 0.51,
    totalVotes: 680000,
    yesVotes: 425000,
    noVotes: 195000,
    abstainVotes: 60000,
    userVote: 'YES',
    userVotingPower: 2500,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'prop-004',
    title: 'Security Audit and Bug Bounty Program',
    description: 'Implement comprehensive security auditing process and establish ongoing bug bounty program with 100,000 ECE reward pool.',
    proposalType: 'SECURITY_UPDATE',
    proposer: 'Security Council',
    status: 'EXECUTED',
    votingStartsAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    votingEndsAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    minQuorum: 0.18,
    minApproval: 0.75,
    totalVotes: 890000,
    yesVotes: 720000,
    noVotes: 125000,
    abstainVotes: 45000,
    userVote: 'YES',
    userVotingPower: 2500,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
  }
]

export default function GovernancePage() {
  const [selectedProposal, setSelectedProposal] = useState<GovernanceProposal | null>(null)
  const [voteChoice, setVoteChoice] = useState<'YES' | 'NO' | 'ABSTAIN' | null>(null)
  const [selectedTab, setSelectedTab] = useState('active')
  const [showCreateProposal, setShowCreateProposal] = useState(false)
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    type: 'GENERAL' as const
  })

  const userStakedBalance = 8500.50 // User's staked ECE (voting power)
  const totalVotingPower = 2500000 // Total staked ECE in governance

  const getProposalIcon = (type: string) => {
    switch (type) {
      case 'MARKETPLACE_PARAMETERS': return Settings
      case 'FEE_ADJUSTMENT': return DollarSign
      case 'NEW_FEATURE': return Zap
      case 'SECURITY_UPDATE': return Shield
      case 'TREASURY_ALLOCATION': return BarChart3
      default: return Vote
    }
  }

  const getProposalColor = (type: string) => {
    switch (type) {
      case 'MARKETPLACE_PARAMETERS': return 'from-[#75715E] to-[#75715E]'
      case 'FEE_ADJUSTMENT': return 'from-[#E6DB74] to-[#F39C12]'
      case 'NEW_FEATURE': return 'from-[#66D9EF] to-[#819AFF]'
      case 'SECURITY_UPDATE': return 'from-[#F92672] to-[#FD5C63]'
      case 'TREASURY_ALLOCATION': return 'from-[#A6E22E] to-[#3EBA7C]'
      default: return 'from-[#75715E] to-[#75715E]'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30'
      case 'PASSED': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      case 'REJECTED': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'EXECUTED': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'EXPIRED': return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total * 100).toFixed(1) : '0.0'
  }

  const getQuorumPercentage = (totalVotes: number) => {
    return (totalVotes / totalVotingPower * 100).toFixed(1)
  }

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const handleVote = async (proposalId: string, choice: 'YES' | 'NO' | 'ABSTAIN') => {
    // Simulate voting API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update proposal with user vote
    const proposal = proposals.find(p => p.id === proposalId)
    if (proposal) {
      proposal.userVote = choice
      proposal.userVotingPower = userStakedBalance
      
      // Update vote counts (simplified)
      switch (choice) {
        case 'YES':
          proposal.yesVotes += userStakedBalance
          break
        case 'NO':
          proposal.noVotes += userStakedBalance
          break
        case 'ABSTAIN':
          proposal.abstainVotes += userStakedBalance
          break
      }
      proposal.totalVotes += userStakedBalance
    }
    
    setSelectedProposal(null)
    setVoteChoice(null)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const activeProposals = proposals.filter(p => p.status === 'ACTIVE')
  const completedProposals = proposals.filter(p => ['PASSED', 'REJECTED', 'EXECUTED', 'EXPIRED'].includes(p.status))

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#272822] to-[#1a1a15] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent mb-4">
            ECE Governance
          </h1>
          <p className="text-lg text-[#75715E] mb-6">
            Participate in community governance and shape the future of the marketplace
          </p>

          {/* Governance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#75715E]">Your Voting Power</p>
                  <p className="text-2xl font-bold text-[#F8EFD6]">{formatNumber(userStakedBalance)}</p>
                </div>
                <Vote className="h-8 w-8 text-[#66D9EF]" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#75715E]">Active Proposals</p>
                  <p className="text-2xl font-bold text-[#A6E22E]">{activeProposals.length}</p>
                </div>
                <Clock className="h-8 w-8 text-[#A6E22E]" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#75715E]">Total Voting Power</p>
                  <p className="text-2xl font-bold text-[#F92672]">{formatNumber(totalVotingPower)}</p>
                </div>
                <Users className="h-8 w-8 text-[#F92672]" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#75715E]">Participation Rate</p>
                  <p className="text-2xl font-bold text-[#E6DB74]">
                    {((userStakedBalance / totalVotingPower) * 100).toFixed(2)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#E6DB74]" />
              </div>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setShowCreateProposal(true)}
              className="bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822] font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </Button>
          </div>
        </motion.div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#272822]/50 border border-[#75715E]/30 mb-8">
            <TabsTrigger 
              value="active"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#66D9EF] data-[state=active]:to-[#819AFF] data-[state=active]:text-[#272822]"
            >
              <Clock className="h-4 w-4 mr-2" />
              Active Proposals ({activeProposals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F92672] data-[state=active]:to-[#FD5C63] data-[state=active]:text-[#F8EFD6]"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed ({completedProposals.length})
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="active" className="mt-0">
              <motion.div
                key="active"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {activeProposals.map((proposal) => {
                  const ProposalIcon = getProposalIcon(proposal.proposalType)
                  const daysRemaining = getDaysRemaining(proposal.votingEndsAt)
                  const quorumReached = proposal.totalVotes / totalVotingPower >= proposal.minQuorum
                  const approvalRate = proposal.yesVotes / proposal.totalVotes
                  
                  return (
                    <Card key={proposal.id} className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30 hover:border-[#66D9EF]/50 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 bg-gradient-to-r ${getProposalColor(proposal.proposalType)} rounded-lg`}>
                            <ProposalIcon className="h-6 w-6 text-[#272822]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-[#F8EFD6]">{proposal.title}</h3>
                              <Badge className={getStatusColor(proposal.status)}>
                                {proposal.status}
                              </Badge>
                            </div>
                            <p className="text-[#75715E] mb-4 line-clamp-2">{proposal.description}</p>
                            
                            <div className="flex items-center gap-6 text-sm text-[#75715E]">
                              <span>By: {proposal.proposer}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {daysRemaining} days remaining
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {formatNumber(proposal.totalVotes)} votes
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#A6E22E]">
                              {getVotePercentage(proposal.yesVotes, proposal.totalVotes)}%
                            </p>
                            <p className="text-xs text-[#75715E]">Approval</p>
                          </div>
                          
                          {proposal.userVote ? (
                            <Badge className="text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30">
                              Voted {proposal.userVote}
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => setSelectedProposal(proposal)}
                             
                              className="bg-gradient-to-r from-[#66D9EF] to-[#819AFF] hover:from-[#66D9EF]/80 hover:to-[#819AFF]/80 text-[#272822] font-semibold"
                            >
                              <Vote className="h-4 w-4 mr-2" />
                              Vote
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Voting Progress */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#75715E]">Progress</span>
                          <div className="flex items-center gap-2">
                            {quorumReached ? (
                              <CheckCircle className="h-4 w-4 text-[#A6E22E]" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-[#E6DB74]" />
                            )}
                            <span className="text-sm text-[#F8EFD6]">
                              {getQuorumPercentage(proposal.totalVotes)}% Quorum
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {/* Yes Votes */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 text-sm text-[#A6E22E]">YES</div>
                            <div className="flex-1 bg-[#272822]/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getVotePercentage(proposal.yesVotes, proposal.totalVotes)}%` }}
                              />
                            </div>
                            <div className="w-16 text-sm text-[#F8EFD6] text-right">
                              {getVotePercentage(proposal.yesVotes, proposal.totalVotes)}%
                            </div>
                          </div>
                          
                          {/* No Votes */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 text-sm text-[#F92672]">NO</div>
                            <div className="flex-1 bg-[#272822]/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-[#F92672] to-[#FD5C63] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getVotePercentage(proposal.noVotes, proposal.totalVotes)}%` }}
                              />
                            </div>
                            <div className="w-16 text-sm text-[#F8EFD6] text-right">
                              {getVotePercentage(proposal.noVotes, proposal.totalVotes)}%
                            </div>
                          </div>
                          
                          {/* Abstain Votes */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 text-sm text-[#75715E]">ABS</div>
                            <div className="flex-1 bg-[#272822]/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-[#75715E] to-[#75715E] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getVotePercentage(proposal.abstainVotes, proposal.totalVotes)}%` }}
                              />
                            </div>
                            <div className="w-16 text-sm text-[#F8EFD6] text-right">
                              {getVotePercentage(proposal.abstainVotes, proposal.totalVotes)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </motion.div>
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <motion.div
                key="completed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {completedProposals.map((proposal) => {
                  const ProposalIcon = getProposalIcon(proposal.proposalType)
                  
                  return (
                    <Card key={proposal.id} className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 bg-gradient-to-r ${getProposalColor(proposal.proposalType)} rounded-lg opacity-75`}>
                            <ProposalIcon className="h-6 w-6 text-[#272822]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-semibold text-[#F8EFD6]">{proposal.title}</h3>
                              <Badge className={getStatusColor(proposal.status)}>
                                {proposal.status}
                              </Badge>
                              {proposal.userVote && (
                                <Badge className="text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30">
                                  You voted {proposal.userVote}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-6 text-sm text-[#75715E]">
                              <span>Final: {getVotePercentage(proposal.yesVotes, proposal.totalVotes)}% approval</span>
                              <span>{formatNumber(proposal.totalVotes)} total votes</span>
                              <span>Ended {Math.abs(getDaysRemaining(proposal.votingEndsAt))} days ago</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                         
                          className="border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Voting Modal */}
        <AnimatePresence>
          {selectedProposal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
              onClick={() => setSelectedProposal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#272822] to-[#1a1a15] border border-[#75715E]/30 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 bg-gradient-to-r ${getProposalColor(selectedProposal.proposalType)} rounded-lg`}>
                    {React.createElement(getProposalIcon(selectedProposal.proposalType), { className: "h-6 w-6 text-[#272822]" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F8EFD6]">{selectedProposal.title}</h3>
                    <p className="text-sm text-[#75715E]">Your voting power: {formatNumber(userStakedBalance)} ECE</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-[#F8EFD6] mb-2">Proposal Details</h4>
                    <p className="text-[#75715E] leading-relaxed">{selectedProposal.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      onClick={() => setVoteChoice('YES')}
                      variant={voteChoice === 'YES' ? 'primary' : 'outline'}
                      className={voteChoice === 'YES' 
                        ? 'bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] text-[#272822] font-semibold'
                        : 'border-[#A6E22E]/30 text-[#A6E22E] hover:bg-[#A6E22E]/10'
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      YES
                    </Button>
                    
                    <Button
                      onClick={() => setVoteChoice('NO')}
                      variant={voteChoice === 'NO' ? 'primary' : 'outline'}
                      className={voteChoice === 'NO' 
                        ? 'bg-gradient-to-r from-[#F92672] to-[#FD5C63] text-[#F8EFD6] font-semibold'
                        : 'border-[#F92672]/30 text-[#F92672] hover:bg-[#F92672]/10'
                      }
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      NO
                    </Button>
                    
                    <Button
                      onClick={() => setVoteChoice('ABSTAIN')}
                      variant={voteChoice === 'ABSTAIN' ? 'primary' : 'outline'}
                      className={voteChoice === 'ABSTAIN' 
                        ? 'bg-gradient-to-r from-[#75715E] to-[#75715E] text-[#F8EFD6] font-semibold'
                        : 'border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10'
                      }
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      ABSTAIN
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedProposal(null)
                        setVoteChoice(null)
                      }}
                      className="flex-1 border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => voteChoice && handleVote(selectedProposal.id, voteChoice)}
                      disabled={!voteChoice}
                      className="flex-1 bg-gradient-to-r from-[#66D9EF] to-[#819AFF] hover:from-[#66D9EF]/80 hover:to-[#819AFF]/80 text-[#272822] font-semibold"
                    >
                      Submit Vote
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Proposal Modal */}
        <AnimatePresence>
          {showCreateProposal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
              onClick={() => setShowCreateProposal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#272822] to-[#1a1a15] border border-[#75715E]/30 rounded-2xl p-8 max-w-2xl w-full"
              >
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Create New Proposal</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F8EFD6] mb-2">Title</label>
                    <Input
                      value={newProposal.title}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter proposal title"
                      className="bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#F8EFD6] mb-2">Description</label>
                    <Textarea
                      value={newProposal.description}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of your proposal"
                      rows={4}
                      className="bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]"
                    />
                  </div>

                  <div className="p-3 bg-[#66D9EF]/20 border border-[#66D9EF]/30 rounded-lg flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#66D9EF] mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-[#66D9EF] font-medium">Proposal Requirements</p>
                      <p className="text-[#F8EFD6]">
                        You need at least 1,000 ECE staked to create a proposal. Proposals require a minimum 15% quorum to pass.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateProposal(false)}
                      className="flex-1 border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!newProposal.title || !newProposal.description}
                      className="flex-1 bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822] font-semibold"
                    >
                      Create Proposal
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
