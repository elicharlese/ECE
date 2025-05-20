"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ShoppingCart, ChevronUp, ChevronDown, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/lib/wallet-context"
import { cn } from "@/lib/utils"
import type { BettingProject } from "./betting-project-card"

interface BettingSlipProps {
  bets: BettingProject[]
  onRemoveBet: (id: number) => void
  onClearSlip: () => void
  onPlaceBets: () => void
  className?: string
}

export function BettingSlip({ bets, onRemoveBet, onClearSlip, onPlaceBets, className }: BettingSlipProps) {
  const { toast } = useToast()
  const { balance = 0, withdrawFunds } = useWallet() || {}
  const [minimized, setMinimized] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate totals
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0)
  const totalPotentialReturn = bets.reduce((sum, bet) => sum + bet.amount * (bet.potentialReturn / 100), 0)

  // Check if we have enough balance
  const hasEnoughBalance = totalBetAmount <= balance

  // Place all bets
  const handlePlaceBets = async () => {
    if (bets.length === 0 || !hasEnoughBalance || !withdrawFunds) return

    setIsSubmitting(true)

    try {
      // Withdraw funds from wallet
      await withdrawFunds(totalBetAmount)

      // Success toast
      toast({
        title: "Bets Placed!",
        description: `Successfully backed ${bets.length} project${bets.length > 1 ? "s" : ""}`,
        variant: "success",
      })

      // Clear betting slip
      onPlaceBets()
    } catch (error) {
      console.error("Error placing bets:", error)
      toast({
        title: "Failed to Place Bets",
        description: "There was an error processing your bets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn("border-amber-500/30", className)}>
      <CardHeader
        className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setMinimized(!minimized)}
      >
        <CardTitle className="text-sm font-medium flex items-center">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Betting Slip
          <span className="ml-2 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {bets.length}
          </span>
        </CardTitle>
        <div className="flex">
          {bets.length > 0 && !minimized && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 mr-1"
              onClick={(e) => {
                e.stopPropagation()
                onClearSlip()
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear slip</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {minimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">{minimized ? "Expand" : "Minimize"}</span>
          </Button>
        </div>
      </CardHeader>

      {!minimized && (
        <>
          <CardContent className="p-0 max-h-[30vh] overflow-y-auto">
            {bets.length > 0 ? (
              <div className="divide-y divide-border/30">
                {bets.map((bet) => (
                  <div key={bet.id} className="p-3 flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{bet.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">{bet.odds}</div>
                        <div className="text-xs text-muted-foreground">
                          Potential:{" "}
                          <span className="text-green-600">
                            +{(bet.amount * (bet.potentialReturn / 100)).toFixed(2)} ECE
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start ml-2">
                      <div className="font-medium text-sm mr-2">{bet.amount} ECE</div>
                      <Button variant="ghost" size="icon" className="h-5 w-5 -mt-1" onClick={() => onRemoveBet(bet.id)}>
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">Your betting slip is empty</div>
            )}
          </CardContent>

          {bets.length > 0 && (
            <CardFooter className="flex-col p-3 gap-2 border-t border-border/30">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Total Stake:</div>
                <div className="font-semibold">{totalBetAmount} ECE</div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Potential Return:</div>
                <div className="font-semibold text-green-600 dark:text-green-500">
                  +{totalPotentialReturn.toFixed(2)} ECE
                </div>
              </div>

              {!hasEnoughBalance && (
                <div className="text-xs text-red-500 mt-1">Insufficient balance ({balance} ECE available)</div>
              )}

              <Button
                className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                disabled={bets.length === 0 || !hasEnoughBalance || isSubmitting}
                onClick={handlePlaceBets}
              >
                {isSubmitting ? "Processing..." : "Place Bets"}
              </Button>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  )
}
