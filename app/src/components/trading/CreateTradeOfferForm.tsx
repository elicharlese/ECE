'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  ArrowRightLeft, 
  Calendar, 
  DollarSign, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Info,
  User
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CardSelector } from '@/components/auctions/CardSelector'
import type { CardSummary } from '@ece-platform/shared-types'

interface CreateTradeOfferFormProps {
  userCards: CardSummary[]
  targetUser?: {
    id: string
    name: string
    avatar?: string
  }
  targetCard?: CardSummary
  onSubmit: (tradeData: any) => void
  onCancel: () => void
}

export function CreateTradeOfferForm({ userCards, targetUser, targetCard, onSubmit, onCancel }: CreateTradeOfferFormProps) {
  const [offeredCard, setOfferedCard] = useState<CardSummary | null>(null)
  const [requestedCard, setRequestedCard] = useState<CardSummary | null>(targetCard || null)
  const [offeredAmount, setOfferedAmount] = useState(0)
  const [requestedAmount, setRequestedAmount] = useState(0)
  const [includeCurrency, setIncludeCurrency] = useState(false)
  const [duration, setDuration] = useState(7) // days
  const [message, setMessage] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!offeredCard) {
      alert('Please select a card to offer')
      return
    }
    
    if (!requestedCard && !requestedAmount) {
      alert('Please specify what you want in return')
      return
    }
    
    const tradeData = {
      offeredCardId: offeredCard.id,
      requestedCardId: requestedCard?.id,
      offeredAmount: includeCurrency ? offeredAmount : 0,
      requestedAmount: requestedAmount || 0,
      duration,
      message,
      targetUserId: targetUser?.id
    }
    
    onSubmit(tradeData)
  }
  
  const calculateEndDate = () => {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + duration)
    return endDate.toLocaleDateString()
  }
  
  const getEstimatedValue = () => {
    let offeredValue = offeredCard?.valuation || 0
    let requestedValue = requestedCard?.valuation || 0
    
    if (includeCurrency) {
      offeredValue += offeredAmount
    }
    
    if (requestedAmount > 0) {
      requestedValue += requestedAmount
    }
    
    return { offeredValue, requestedValue }
  }
  
  const { offeredValue, requestedValue } = getEstimatedValue()
  const valueDifference = requestedValue - offeredValue
  
  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRightLeft className="h-5 w-5" />
          <h2 className="text-xl font-bold">Create Trade Offer</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Propose a trade with another user for their app cards
        </p>
        
        {targetUser && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-6">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Trading with {targetUser.name}</p>
              <p className="text-xs text-muted-foreground">Specify what you want in return</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Offered Card Selection */}
          <div>
            <Label className="text-base font-medium mb-2 block">Your Card to Offer</Label>
            <CardSelector 
              cards={userCards} 
              selectedCard={offeredCard} 
              onCardSelect={setOfferedCard} 
            />
          </div>
          
          {offeredCard && (
            <>
              {/* Requested Items */}
              <div>
                <Label className="text-base font-medium mb-2 block">What You Want in Return</Label>
                
                {/* Request Card Option */}
                <div className="mb-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-3">
                    <div>
                      <Label className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Request Specific Card
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Trade for a specific card from another user
                      </p>
                    </div>
                    <Switch 
                      checked={!!requestedCard} 
                      onCheckedChange={(checked: boolean) => {
                        if (!checked) setRequestedCard(null)
                      }} 
                    />
                  </div>
                  
                  {requestedCard && (
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Select card to request:</p>
                      <CardSelector 
                        cards={[]} 
                        selectedCard={requestedCard} 
                        onCardSelect={setRequestedCard} 
                      />
                    </div>
                  )}
                </div>
                
                {/* Request Currency Option */}
                <div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-3">
                    <div>
                      <Label className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Request ECE Currency
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Trade for ECE tokens instead of or in addition to cards
                      </p>
                    </div>
                    <Switch 
                      checked={requestedAmount > 0} 
                      onCheckedChange={(checked: boolean) => {
                        if (!checked) setRequestedAmount(0)
                      }} 
                    />
                  </div>
                  
                  {requestedAmount > 0 && (
                    <div className="p-3 border rounded-lg">
                      <Label htmlFor="requestedAmount" className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4" />
                        Amount (ECE)
                      </Label>
                      <Input 
                        id="requestedAmount"
                        type="number" 
                        value={requestedAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestedAmount(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="10"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Include Currency Option */}
              <div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Include ECE Currency with Your Offer
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add ECE tokens to make your offer more attractive
                    </p>
                  </div>
                  <Switch 
                    checked={includeCurrency} 
                    onCheckedChange={setIncludeCurrency} 
                  />
                </div>
                
                {includeCurrency && (
                  <div className="p-3 border rounded-lg mt-3">
                    <Label htmlFor="offeredAmount" className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4" />
                      Amount (ECE)
                    </Label>
                    <Input 
                      id="offeredAmount"
                      type="number" 
                      value={offeredAmount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOfferedAmount(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="10"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
              
              {/* Duration */}
              <div>
                <Label className="text-base font-medium mb-2 block">Trade Duration</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[1, 3, 7, 14].map((days) => (
                    <Button 
                      key={days}
                      type="button"
                      variant={duration === days ? 'default' : 'outline'}
                      onClick={() => setDuration(days)}
                      className="flex flex-col h-16"
                    >
                      <span className="font-medium">{days} day{days > 1 ? 's' : ''}</span>
                      <span className="text-xs text-muted-foreground">
                        Ends {new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Message */}
              <div>
                <Label htmlFor="message" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Message (Optional)
                </Label>
                <Textarea 
                  id="message"
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  placeholder="Add a personal message to the recipient..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              {/* Trade Summary */}
              <GlassCard>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Trade Summary
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">You Offer:</span>
                      <div className="text-right">
                        <p className="font-medium">{offeredCard.name}</p>
                        {includeCurrency && offeredAmount > 0 && (
                          <p className="text-xs text-muted-foreground">+ {offeredAmount.toFixed(2)} ECE</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">You Receive:</span>
                      <div className="text-right">
                        {requestedCard ? (
                          <p className="font-medium">{requestedCard.name}</p>
                        ) : (
                          <p className="font-medium">No specific card</p>
                        )}
                        {requestedAmount > 0 && (
                          <p className="text-xs text-muted-foreground">{requestedAmount.toFixed(2)} ECE</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{duration} days</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ends:</span>
                      <span className="font-medium">{calculateEndDate()}</span>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Value:</span>
                        <div className="text-right">
                          <p className="font-medium">{offeredValue.toFixed(2)} ECE → {requestedValue.toFixed(2)} ECE</p>
                          <p className={`text-xs ${valueDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {valueDifference >= 0 ? '+' : ''}{valueDifference.toFixed(2)} ECE
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </>
          )}
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!offeredCard}
              className="flex items-center gap-2"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Send Trade Offer
            </Button>
          </div>
        </form>
      </div>
    </GlassCard>
  )
}
