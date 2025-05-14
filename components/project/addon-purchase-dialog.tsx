"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import type { ProjectAddOn } from "./project-tracker"

interface AddonPurchaseDialogProps {
  addon: ProjectAddOn | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  walletBalance: number
}

export function AddonPurchaseDialog({ addon, open, onOpenChange, onConfirm, walletBalance }: AddonPurchaseDialogProps) {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseComplete, setPurchaseComplete] = useState(false)

  if (!addon) return null

  const handlePurchase = () => {
    setIsPurchasing(true)
    // Simulate API call
    setTimeout(() => {
      setIsPurchasing(false)
      setPurchaseComplete(true)
      // Reset and close after showing success
      setTimeout(() => {
        setPurchaseComplete(false)
        onConfirm()
        onOpenChange(false)
      }, 1500)
    }, 1500)
  }

  const hasSufficientFunds = walletBalance >= addon.price

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Add-on</DialogTitle>
          <DialogDescription>Confirm your purchase of this add-on for your project</DialogDescription>
        </DialogHeader>

        {purchaseComplete ? (
          <div className="py-6 text-center space-y-2">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-lg font-medium">Purchase Complete!</h3>
            <p className="text-muted-foreground">The add-on has been added to your project and is ready to use.</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">{addon.name}</h3>
              <p className="text-muted-foreground">{addon.description}</p>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-md">
              <span className="font-medium">Price</span>
              <span className="text-lg font-bold">{addon.price} ECE</span>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-md">
              <span className="font-medium">Your Balance</span>
              <span className={`text-lg font-bold ${!hasSufficientFunds ? "text-red-500" : ""}`}>
                {walletBalance} ECE
              </span>
            </div>

            {!hasSufficientFunds && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 rounded-md">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Insufficient funds</p>
                  <p className="text-sm">You need {addon.price - walletBalance} more ECE to purchase this add-on.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {purchaseComplete ? null : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPurchasing}>
                Cancel
              </Button>
              <Button onClick={handlePurchase} disabled={!hasSufficientFunds || isPurchasing}>
                <CreditCard className="mr-2 h-4 w-4" />
                {isPurchasing ? "Processing..." : "Confirm Purchase"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
