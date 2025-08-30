'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  ArrowRightLeft, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle,
  XCircle,
  User,
  MessageCircle,
  AlertCircle
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import type { TradeOffer, CardSummary } from '@ece-platform/shared-types'

interface TradeOfferDetailProps {
  tradeOffer: TradeOffer
  currentUserId: string
  onAccept?: (offerId: string) => void
  onReject?: (offerId: string) => void
  onCounter?: (offerId: string, counterOffer: any) => void
  onCancel?: (offerId: string) => void
}

const statusColors: Record<TradeOffer['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
  CANCELED: 'bg-gray-200 text-gray-800',
  EXPIRED: 'bg-gray-100 text-gray-800'
}

export function TradeOfferDetail({ tradeOffer, currentUserId, onAccept, onReject, onCounter, onCancel }: TradeOfferDetailProps) {
  const [counterMessage, setCounterMessage] = useState('')
  const [showCounterForm, setShowCounterForm] = useState(false)
  
  const isOfferingUser = currentUserId === tradeOffer.offeringUserId
  const isReceivingUser = currentUserId === tradeOffer.receivingUserId
  const isPending = tradeOffer.status === 'PENDING'
  const isExpired = new Date(tradeOffer.expiresAt) < new Date()
  
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
  
  const getEstimatedValue = () => {
    let offeredValue = tradeOffer.offeredCard.valuation || 0
    let requestedValue = tradeOffer.requestedCard?.valuation || 0
    
    if (tradeOffer.offeredAmount) {
      offeredValue += tradeOffer.offeredAmount
    }
    
    if (tradeOffer.requestedAmount) {
      requestedValue += tradeOffer.requestedAmount
    }
    
    return { offeredValue, requestedValue }
  }
  
  const { offeredValue, requestedValue } = getEstimatedValue()
  const valueDifference = requestedValue - offeredValue
  
  const handleCounterOffer = () => {
    if (onCounter) {
      onCounter(tradeOffer.id, {
        message: counterMessage
      })
      setShowCounterForm(false)
      setCounterMessage('')
    }
  }
  
  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft className="h-5 w-5" />
              <h2 className="text-xl font-bold">Trade Offer Details</h2>
            </div>
            <p className="text-muted-foreground">
              Review the details of this trade proposal
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={statusColors[tradeOffer.status]}>
              {tradeOffer.status}
            </Badge>
            {isExpired && (
              <Badge variant="destructive" className="text-xs">
                Expired
              </Badge>
            )}
          </div>
        </div>
        
        {/* Trade Participants */}
        <div className="flex items-center justify-between mb-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">{tradeOffer.offeringUserName}</p>
              <p className="text-xs text-muted-foreground">Offering</p>
            </div>
          </div>
          
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">{tradeOffer.receivingUserName}</p>
              <p className="text-xs text-muted-foreground">Receiving</p>
            </div>
          </div>
        </div>
        
        {/* Trade Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Offered Card */}
          <GlassCard>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3">Offering</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded bg-muted relative">
                  {tradeOffer.offeredCard.imageUrl ? (
                    <img 
                      src={tradeOffer.offeredCard.imageUrl} 
                      alt={tradeOffer.offeredCard.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="font-medium">{tradeOffer.offeredCard.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tradeOffer.offeredCard.category} • {tradeOffer.offeredCard.rarity}
                  </p>
                  {tradeOffer.offeredCard.valuation > 0 && (
                    <p className="text-sm font-medium">
                      {tradeOffer.offeredCard.valuation.toFixed(2)} ECE
                    </p>
                  )}
                </div>
              </div>
              
              {tradeOffer.offeredAmount && tradeOffer.offeredAmount > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">+ {tradeOffer.offeredAmount.toFixed(2)} ECE</p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
          
          {/* Requested Card/Amount */}
          <GlassCard>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3">Requesting</h3>
              
              {tradeOffer.requestedCard ? (
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded bg-muted relative">
                    {tradeOffer.requestedCard.imageUrl ? (
                      <img 
                        src={tradeOffer.requestedCard.imageUrl} 
                        alt={tradeOffer.requestedCard.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium">{tradeOffer.requestedCard.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tradeOffer.requestedCard.category} • {tradeOffer.requestedCard.rarity}
                    </p>
                    {tradeOffer.requestedCard.valuation > 0 && (
                      <p className="text-sm font-medium">
                        {tradeOffer.requestedCard.valuation.toFixed(2)} ECE
                      </p>
                    )}
                  </div>
                </div>
              ) : tradeOffer.requestedAmount && tradeOffer.requestedAmount > 0 ? (
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <span className="text-xl font-bold">E</span>
                  </div>
                  <div>
                    <p className="font-medium">ECE Currency</p>
                    <p className="text-sm font-medium">{tradeOffer.requestedAmount.toFixed(2)} ECE</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No specific request</p>
              )}
            </div>
          </GlassCard>
        </div>
        
        {/* Trade Summary */}
        <GlassCard className="mb-6">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-3">Trade Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Offered Value:</span>
                <span className="font-medium">{offeredValue.toFixed(2)} ECE</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested Value:</span>
                <span className="font-medium">{requestedValue.toFixed(2)} ECE</span>
              </div>
              
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground">Value Difference:</span>
                <span className={`font-medium ${valueDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {valueDifference >= 0 ? '+' : ''}{valueDifference.toFixed(2)} ECE
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{formatTimeAgo(tradeOffer.createdAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">
                  {isExpired ? 'Expired' : formatExpiration(tradeOffer.expiresAt)}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
        
        {/* Message */}
        {tradeOffer.message && (
          <GlassCard className="mb-6">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4" />
                <h3 className="font-bold">Message</h3>
              </div>
              <p className="text-sm">{tradeOffer.message}</p>
            </div>
          </GlassCard>
        )}
        
        {/* Counter Offer Form */}
        {showCounterForm && (
          <GlassCard className="mb-6">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRightLeft className="h-4 w-4" />
                <h3 className="font-bold">Counter Offer</h3>
              </div>
              
              <Textarea 
                value={counterMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCounterMessage(e.target.value)}
                placeholder="Add a message to your counter offer..."
                className="mb-3"
                rows={3}
              />
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCounterForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCounterOffer}
                  className="flex items-center gap-2"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Send Counter
                </Button>
              </div>
            </div>
          </GlassCard>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {isReceivingUser && isPending && !isExpired && (
            <>
              <Button 
                onClick={() => onAccept && onAccept(tradeOffer.id)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Accept Offer
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowCounterForm(true)}
                className="flex items-center gap-2"
              >
                <ArrowRightLeft className="h-4 w-4" />
                Counter Offer
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={() => onReject && onReject(tradeOffer.id)}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          
          {isOfferingUser && isPending && !isExpired && (
            <Button 
              variant="destructive" 
              onClick={() => onCancel && onCancel(tradeOffer.id)}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancel Offer
            </Button>
          )}
          
          {isExpired && isPending && (
            <Button 
              variant="outline" 
              disabled
              className="flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Offer Expired
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
