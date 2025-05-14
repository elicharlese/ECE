"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingButton } from "@/components/ui/loading-button"
import { Plus, RefreshCw, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface WalletFormProps {
  balance?: number
  currency?: string
  onDeposit?: (amount: number) => Promise<void>
  onWithdrawal?: (amount: number) => Promise<void>
  onConversion?: (amount: number, targetCurrency: string) => Promise<void>
}

export function WalletForm({
  balance = 5000,
  currency = "ECE",
  onDeposit = async () => {},
  onWithdrawal = async () => {},
  onConversion = async () => {},
}: WalletFormProps) {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [conversionAmount, setConversionAmount] = useState("")
  const [targetCurrency, setTargetCurrency] = useState("BTC")
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [scheduleAmount, setScheduleAmount] = useState("500")
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly")
  const [scheduledRefills, setScheduledRefills] = useState<
    Array<{ amount: number; frequency: string; nextDate: string }>
  >([])

  const handleDeposit = async () => {
    try {
      setIsDepositing(true)
      await onDeposit(Number(depositAmount))
      setDepositAmount("")
    } catch (error) {
      console.error("Deposit failed:", error)
    } finally {
      setIsDepositing(false)
    }
  }

  const handleWithdrawal = async () => {
    try {
      setIsWithdrawing(true)
      await onWithdrawal(Number(withdrawalAmount))
      setWithdrawalAmount("")
    } catch (error) {
      console.error("Withdrawal failed:", error)
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleConversion = async () => {
    try {
      setIsConverting(true)
      await onConversion(Number(conversionAmount), targetCurrency)
      setConversionAmount("")
    } catch (error) {
      console.error("Conversion failed:", error)
    } finally {
      setIsConverting(false)
    }
  }

  const handleScheduleRefill = () => {
    // Calculate next date based on frequency
    const nextDate = new Date()
    if (scheduleFrequency === "daily") {
      nextDate.setDate(nextDate.getDate() + 1)
    } else if (scheduleFrequency === "weekly") {
      nextDate.setDate(nextDate.getDate() + 7)
    } else if (scheduleFrequency === "monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1)
    }

    // Add new scheduled refill
    setScheduledRefills([
      ...scheduledRefills,
      {
        amount: Number(scheduleAmount),
        frequency: scheduleFrequency,
        nextDate: nextDate.toLocaleDateString(),
      },
    ])

    // Close dialog
    setShowScheduleDialog(false)
  }

  return (
    <Card>
      <CardHeader className="md:block flex justify-between items-center">
        <CardTitle>Wallet Balance</CardTitle>
        <CardDescription className="md:mt-1.5 mt-0">Manage your funds and currency conversions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-2xl font-bold">
            {balance.toLocaleString()} {currency}
          </h3>
          <p className="text-sm text-muted-foreground">Current balance</p>
        </div>

        {/* Quick ECE Refill Section */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
              Quick ECE Refill
            </h3>
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Automatic Refills</DialogTitle>
                  <DialogDescription>
                    Set up recurring ECE refills to ensure your wallet is always funded.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="refill-amount">Refill Amount</Label>
                    <Input
                      id="refill-amount"
                      type="number"
                      value={scheduleAmount}
                      onChange={(e) => setScheduleAmount(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Frequency</Label>
                    <RadioGroup value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Weekly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleRefill}>Schedule Refill</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[100, 250, 500, 1000, 2500, 5000, 10000, 25000].map((value) => (
              <Button
                key={value}
                variant="outline"
                onClick={() => {
                  setDepositAmount(value.toString())
                  handleDeposit()
                }}
                className="bg-white/80 dark:bg-slate-800/50 border-green-200 dark:border-green-800/30 hover:bg-green-100/50 dark:hover:bg-green-900/30 h-12"
              >
                <Plus className="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400" />
                {value.toLocaleString()} ECE
              </Button>
            ))}
          </div>
        </div>

        {/* Scheduled Refills Section */}
        {scheduledRefills.length > 0 && (
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Scheduled Refills
            </h3>
            <div className="space-y-3">
              {scheduledRefills.map((refill, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <div>
                    <p className="font-medium">{refill.amount.toLocaleString()} ECE</p>
                    <p className="text-sm text-muted-foreground capitalize">{refill.frequency} refill</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Next refill:</p>
                    <p className="text-sm font-medium">{refill.nextDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-medium">Deposit Funds</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <LoadingButton
                onClick={handleDeposit}
                isLoading={isDepositing}
                loadingText="Depositing..."
                disabled={!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0}
              >
                Deposit
              </LoadingButton>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Withdraw Funds</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                />
              </div>
              <LoadingButton
                onClick={handleWithdrawal}
                isLoading={isWithdrawing}
                loadingText="Withdrawing..."
                disabled={
                  !withdrawalAmount ||
                  isNaN(Number(withdrawalAmount)) ||
                  Number(withdrawalAmount) <= 0 ||
                  Number(withdrawalAmount) > balance
                }
              >
                Withdraw
              </LoadingButton>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium">Convert Currency</h3>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={conversionAmount}
                  onChange={(e) => setConversionAmount(e.target.value)}
                />
              </div>
              <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <LoadingButton
              onClick={handleConversion}
              isLoading={isConverting}
              loadingText="Converting..."
              disabled={
                !conversionAmount ||
                isNaN(Number(conversionAmount)) ||
                Number(conversionAmount) <= 0 ||
                Number(conversionAmount) > balance ||
                currency === targetCurrency
              }
              className="w-full"
            >
              Convert from {currency} to {targetCurrency}
            </LoadingButton>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
