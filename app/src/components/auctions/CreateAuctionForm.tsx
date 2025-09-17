'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Gavel, 
  Calendar, 
  DollarSign, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CardSelector } from './CardSelector'
import type { CardSummary } from '@ece-platform/shared-types'

interface CreateAuctionFormProps {
  userCards: CardSummary[]
  onSubmit: (auctionData: any) => void
  onCancel: () => void
}

export function CreateAuctionForm({ userCards, onSubmit, onCancel }: CreateAuctionFormProps) {
  const [selectedCard, setSelectedCard] = useState<CardSummary | null>(null)
  const [auctionType, setAuctionType] = useState<'timed' | 'reserve' | 'dutch'>('timed')
  const [startingPrice, setStartingPrice] = useState(100)
  const [reservePrice, setReservePrice] = useState(0)
  const [instantBuyPrice, setInstantBuyPrice] = useState(0)
  const [duration, setDuration] = useState(7) // days
  const [minBidIncrement, setMinBidIncrement] = useState(10)
  const [allowInstantBuy, setAllowInstantBuy] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCard) {
      alert('Please select a card to auction')
      return
    }
    
    const auctionData = {
      cardId: selectedCard.id,
      auctionType,
      startingPrice,
      reservePrice: auctionType === 'reserve' ? reservePrice : 0,
      instantBuyPrice: allowInstantBuy ? instantBuyPrice : 0,
      duration,
      minBidIncrement
    }
    
    onSubmit(auctionData)
  }
  
  const calculateEndDate = () => {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + duration)
    return endDate.toLocaleDateString()
  }
  
  const getMinInstantBuyPrice = () => {
    if (auctionType === 'reserve' && reservePrice > 0) {
      return reservePrice * 1.1 // 10% above reserve
    }
    return startingPrice * 1.5 // 50% above starting price
  }
  
  return (
    <GlassCard>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gavel className="h-5 w-5" />
          <h2 className="text-xl font-bold">Create New Auction</h2>
        </div>
        <p className="text-muted-foreground">
          Set up an auction for your app card and start receiving bids
        </p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Card Selection */}
          <div>
            <Label className="text-base font-medium mb-2 block">Select Card</Label>
            <CardSelector 
              cards={userCards} 
              selectedCard={selectedCard} 
              onCardSelect={setSelectedCard} 
            />
          </div>
          
          {selectedCard && (
            <>
              {/* Auction Type */}
              <div>
                <Label className="text-base font-medium mb-2 block">Auction Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button 
                    type="button"
                    variant={auctionType === 'timed' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24"
                    onClick={() => setAuctionType('timed')}
                  >
                    <Clock className="h-5 w-5 mb-1" />
                    <span>Timed Auction</span>
                    <p className="text-xs text-muted-foreground mt-1">Bids until time ends</p>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant={auctionType === 'reserve' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24"
                    onClick={() => setAuctionType('reserve')}
                  >
                    <CheckCircle className="h-5 w-5 mb-1" />
                    <span>Reserve Auction</span>
                    <p className="text-xs text-muted-foreground mt-1">Minimum price required</p>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant={auctionType === 'dutch' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24"
                    onClick={() => setAuctionType('dutch')}
                  >
                    <AlertCircle className="h-5 w-5 mb-1" />
                    <span>Dutch Auction</span>
                    <p className="text-xs text-muted-foreground mt-1">Price decreases over time</p>
                  </Button>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startingPrice" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Starting Price (ECE)
                  </Label>
                  <Input 
                    id="startingPrice"
                    type="number" 
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="10"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Suggested: {selectedCard.valuation && selectedCard.valuation > 0 ? `~${selectedCard.valuation.toFixed(2)} ECE` : 'Set your own price'}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="minBidIncrement" className="flex items-center gap-2">
                    <Gavel className="h-4 w-4" />
                    Minimum Bid Increment (ECE)
                  </Label>
                  <Input 
                    id="minBidIncrement"
                    type="number" 
                    value={minBidIncrement}
                    onChange={(e) => setMinBidIncrement(parseFloat(e.target.value) || 0)}
                    min="1"
                    step="5"
                    className="mt-1"
                  />
                </div>
              </div>
              
              {/* Reserve Price (for reserve auctions) */}
              {auctionType === 'reserve' && (
                <div>
                  <Label htmlFor="reservePrice" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Reserve Price (ECE)
                  </Label>
                  <Input 
                    id="reservePrice"
                    type="number" 
                    value={reservePrice}
                    onChange={(e) => setReservePrice(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="10"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Auction won't end unless this price is met
                  </p>
                </div>
              )}
              
              {/* Instant Buy Option */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Enable Instant Buy
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allow buyers to purchase immediately at a fixed price
                  </p>
                </div>
                <Switch 
                  checked={allowInstantBuy} 
                  onCheckedChange={setAllowInstantBuy} 
                />
              </div>
              
              {allowInstantBuy && (
                <div>
                  <Label htmlFor="instantBuyPrice" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Instant Buy Price (ECE)
                  </Label>
                  <Input 
                    id="instantBuyPrice"
                    type="number" 
                    value={instantBuyPrice}
                    onChange={(e) => setInstantBuyPrice(parseFloat(e.target.value) || 0)}
                    min={getMinInstantBuyPrice()}
                    step="10"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum: {getMinInstantBuyPrice().toFixed(2)} ECE
                  </p>
                </div>
              )}
              
              {/* Duration */}
              <div>
                <Label className="text-base font-medium mb-2 block">Auction Duration</Label>
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
              
              {/* Auction Summary */}
              <GlassCard>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Auction Summary
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Card:</span>
                      <span className="font-medium">{selectedCard.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Auction Type:</span>
                      <span className="font-medium">
                        {auctionType === 'timed' && 'Timed Auction'}
                        {auctionType === 'reserve' && 'Reserve Auction'}
                        {auctionType === 'dutch' && 'Dutch Auction'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Starting Price:</span>
                      <span className="font-medium">{startingPrice.toFixed(2)} ECE</span>
                    </div>
                    {auctionType === 'reserve' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reserve Price:</span>
                        <span className="font-medium">{reservePrice.toFixed(2)} ECE</span>
                      </div>
                    )}
                    {allowInstantBuy && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Instant Buy:</span>
                        <span className="font-medium">{instantBuyPrice.toFixed(2)} ECE</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ends:</span>
                      <span className="font-medium">{calculateEndDate()}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!selectedCard}
            className="flex items-center gap-2"
          >
            <Gavel className="h-4 w-4" />
            Create Auction
          </Button>
        </CardFooter>
      </form>
    </GlassCard>
  )
}
