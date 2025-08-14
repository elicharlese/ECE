'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  ArrowRightLeft
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

interface TradeOffer {
  id: string
  offeringUserId: string
  offeringUserName: string
  offeringUserAvatar?: string
  receivingUserId: string
  receivingUserName: string
  receivingUserAvatar?: string
  offeredCard: {
    id: string
    name: string
    category: string
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'
    imageUrl: string
    valuation: number
  }
  requestedCard?: {
    id: string
    name: string
    category: string
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'
    imageUrl: string
    valuation: number
  }
  offeredAmount?: number
  requestedAmount?: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  createdAt: string
  expiresAt: string
}

interface TradeOfferListProps {
  tradeOffers: TradeOffer[]
  userType: 'incoming' | 'outgoing'
  onAccept?: (offerId: string) => void
  onReject?: (offerId: string) => void
  onCounter?: (offerId: string) => void
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800'
}

export function TradeOfferList({ tradeOffers, userType, onAccept, onReject, onCounter }: TradeOfferListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Filter trade offers based on search and filters
  const filteredOffers = tradeOffers.filter(offer => {
    const matchesSearch = 
      offer.offeringUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.receivingUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.offeredCard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.requestedCard?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }
  
  const formatExpiration = (expiresAt: string) => {
    const now = new Date()
    const expiration = new Date(expiresAt)
    const diffInSeconds = Math.floor((expiration.getTime() - now.getTime()) / 1000)
    
    if (diffInSeconds < 0) return 'Expired'
    if (diffInSeconds < 60) return `Expires in ${diffInSeconds} seconds`
    if (diffInSeconds < 3600) return `Expires in ${Math.floor(diffInSeconds / 60)} minutes`
    if (diffInSeconds < 86400) return `Expires in ${Math.floor(diffInSeconds / 3600)} hours`
    return `Expires in ${Math.floor(diffInSeconds / 86400)} days`
  }
  
  const getTradeType = (offer: TradeOffer) => {
    if (offer.requestedCard) return 'card-for-card'
    if (offer.offeredAmount && offer.requestedAmount) return 'card-for-currency'
    return 'card-only'
  }
  
  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {userType === 'incoming' ? 'Incoming Trade Offers' : 'Outgoing Trade Offers'}
            </h2>
            <p className="text-muted-foreground">
              {userType === 'incoming' 
                ? 'Trade offers from other users for your cards' 
                : 'Trade offers you have sent to other users'}
            </p>
          </div>
          
          <Badge variant="secondary" className="text-sm">
            {tradeOffers.length} {tradeOffers.length === 1 ? 'Offer' : 'Offers'}
          </Badge>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search trade offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
        
        {/* Trade Offers List */}
        <div className="space-y-4">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer, index) => {
              const tradeType = getTradeType(offer)
              const isPending = offer.status === 'PENDING'
              const isExpired = new Date(offer.expiresAt) < new Date()
              
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Offer Details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[offer.status]}>
                            {offer.status}
                          </Badge>
                          {isExpired && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{formatTimeAgo(offer.createdAt)}</p>
                          {isPending && !isExpired && (
                            <p className="text-xs">{formatExpiration(offer.expiresAt)}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* User Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {userType === 'incoming' 
                                  ? offer.offeringUserName 
                                  : offer.receivingUserName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {userType === 'incoming' ? 'Offering' : 'Receiving from'}
                              </p>
                            </div>
                          </div>
                          
                          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                          
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {userType === 'incoming' 
                                  ? offer.receivingUserName 
                                  : offer.offeringUserName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {userType === 'incoming' ? 'Receiving' : 'Offering'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trade Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Offered Card */}
                        <div className="border rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-2">Offering</p>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-muted relative">
                              {offer.offeredCard.imageUrl ? (
                                <img 
                                  src={offer.offeredCard.imageUrl} 
                                  alt={offer.offeredCard.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{offer.offeredCard.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {offer.offeredCard.category} • {offer.offeredCard.rarity}
                              </p>
                              {offer.offeredCard.valuation > 0 && (
                                <p className="text-xs font-medium">
                                  {offer.offeredCard.valuation.toFixed(2)} ECE
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {offer.offeredAmount && offer.offeredAmount > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-muted-foreground">+ {offer.offeredAmount.toFixed(2)} ECE</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Requested Card/Amount */}
                        <div className="border rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-2">
                            {userType === 'incoming' ? 'You give' : 'You receive'}
                          </p>
                          
                          {offer.requestedCard ? (
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded bg-muted relative">
                                {offer.requestedCard.imageUrl ? (
                                  <img 
                                    src={offer.requestedCard.imageUrl} 
                                    alt={offer.requestedCard.name}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{offer.requestedCard.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {offer.requestedCard.category} • {offer.requestedCard.rarity}
                                </p>
                                {offer.requestedCard.valuation > 0 && (
                                  <p className="text-xs font-medium">
                                    {offer.requestedCard.valuation.toFixed(2)} ECE
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : offer.requestedAmount && offer.requestedAmount > 0 ? (
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                <span className="text-lg font-bold">E</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">ECE Currency</p>
                                <p className="text-xs font-medium">{offer.requestedAmount.toFixed(2)} ECE</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No specific request</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {userType === 'incoming' && isPending && !isExpired && (
                      <div className="flex flex-col gap-2 md:justify-center">
                        <Button 
                          size="sm" 
                          onClick={() => onAccept && onAccept(offer.id)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onCounter && onCounter(offer.id)}
                          className="flex items-center gap-2"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                          Counter
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => onReject && onReject(offer.id)}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {userType === 'outgoing' && isPending && !isExpired && (
                      <div className="flex flex-col gap-2 md:justify-center">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onCounter && onCounter(offer.id)}
                          className="flex items-center gap-2"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                          Modify
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => onReject && onReject(offer.id)}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No trade offers found</h3>
              <p className="text-sm">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : userType === 'incoming' 
                    ? 'You don\'t have any incoming trade offers yet' 
                    : 'You haven\'t sent any trade offers yet'}
              </p>
            </div>
          )
        </div>
      </div>
    </GlassCard>
  )
}
