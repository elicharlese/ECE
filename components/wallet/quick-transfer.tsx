"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import { useWallet } from "@/lib/wallet-context"
import { ArrowRight, Plus, ArrowDown } from "lucide-react"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"

export function QuickTransfer() {
  const { addFunds, withdrawFunds, balance, currency } = useWallet()
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "transfer">("deposit")

  const [toast, setToast] = useState<{
    visible: boolean
    title: string
    description: string
    variant: "default" | "destructive" | "success"
  }>({
    visible: false,
    title: "",
    description: "",
    variant: "default",
  })

  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" | "success" = "default",
  ) => {
    setToast({
      visible: true,
      title,
      description,
      variant,
    })

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return
    }

    setIsProcessing(true)
    try {
      await addFunds(Number(amount))
      showToast("Deposit Successful", `${amount} ${currency} has been added to your wallet.`, "success")
      setAmount("")
    } catch (error) {
      console.error("Error adding funds:", error)
      showToast("Deposit Failed", "There was an error processing your deposit.", "destructive")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return
    }

    if (Number(amount) > balance) {
      showToast(
        "Insufficient Funds",
        `Your balance of ${balance} ${currency} is less than the requested amount.`,
        "destructive",
      )
      return
    }

    setIsProcessing(true)
    try {
      await withdrawFunds(Number(amount))
      showToast("Withdrawal Successful", `${amount} ${currency} has been withdrawn from your wallet.`, "success")
      setAmount("")
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      showToast("Withdrawal Failed", "There was an error processing your withdrawal.", "destructive")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTransfer = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return
    }

    if (!recipient.trim()) {
      showToast("Invalid Recipient", "Please enter a valid recipient address.", "destructive")
      return
    }

    if (Number(amount) > balance) {
      showToast(
        "Insufficient Funds",
        `Your balance of ${balance} ${currency} is less than the transfer amount.`,
        "destructive",
      )
      return
    }

    setIsProcessing(true)
    try {
      // In a real app, this would call a transfer function
      // For now, we'll simulate it with a withdrawal
      await withdrawFunds(Number(amount))
      showToast("Transfer Successful", `${amount} ${currency} has been sent to ${recipient}.`, "success")
      setAmount("")
      setRecipient("")
    } catch (error) {
      console.error("Error transferring funds:", error)
      showToast("Transfer Failed", "There was an error processing your transfer.", "destructive")
    } finally {
      setIsProcessing(false)
    }
  }

  // Toast notification
  const renderToast = () => {
    if (!toast.visible) return null

    return (
      <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
        <Toast variant={toast.variant}>
          <div className="flex items-start gap-2">
            {toast.variant === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {toast.variant === "destructive" && <AlertTriangle className="h-5 w-5" />}
            <div>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </div>
          </div>
        </Toast>
      </div>
    )
  }

  return (
    <Card className="col-span-3">
      {renderToast()}
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Quick Transfer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "deposit" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("deposit")}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-1" /> Deposit
          </Button>
          <Button
            variant={activeTab === "withdraw" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("withdraw")}
            className="flex-1"
          >
            <ArrowDown className="h-4 w-4 mr-1" /> Withdraw
          </Button>
          <Button
            variant={activeTab === "transfer" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("transfer")}
            className="flex-1"
          >
            <ArrowRight className="h-4 w-4 mr-1" /> Transfer
          </Button>
        </div>

        <div className="space-y-4">
          {activeTab === "deposit" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount ({currency})</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  min="1"
                  placeholder="Enter amount to deposit"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* Quick ECE Refill Section */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 my-3 border border-green-100 dark:border-green-800/30">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-green-600 dark:text-green-400" />
                  Quick ECE Refill
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 250, 500, 1000].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAmount(value.toString())
                        handleDeposit()
                      }}
                      className="bg-white/80 dark:bg-slate-800/50 border-green-200 dark:border-green-800/30 hover:bg-green-100/50 dark:hover:bg-green-900/30"
                    >
                      {value} ECE
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setAmount("100")}>
                    +100
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount("250")}>
                    +250
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount("500")}>
                    +500
                  </Button>
                </div>
                <LoadingButton
                  onClick={handleDeposit}
                  isLoading={isProcessing}
                  loadingText="Processing..."
                  disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
                >
                  Deposit Funds
                </LoadingButton>
              </div>
            </>
          )}

          {activeTab === "withdraw" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount ({currency})</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  min="1"
                  max={balance.toString()}
                  placeholder="Enter amount to withdraw"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(Math.min(100, balance).toString())}
                    disabled={balance < 100}
                  >
                    100
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(Math.min(250, balance).toString())}
                    disabled={balance < 250}
                  >
                    250
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount(balance.toString())}>
                    Max
                  </Button>
                </div>
                <LoadingButton
                  onClick={handleWithdraw}
                  isLoading={isProcessing}
                  loadingText="Processing..."
                  disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0 || Number(amount) > balance}
                >
                  Withdraw Funds
                </LoadingButton>
              </div>
            </>
          )}

          {activeTab === "transfer" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="Enter recipient address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transfer-amount">Amount ({currency})</Label>
                <Input
                  id="transfer-amount"
                  type="number"
                  min="1"
                  max={balance.toString()}
                  placeholder="Enter amount to transfer"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <LoadingButton
                  onClick={handleTransfer}
                  isLoading={isProcessing}
                  loadingText="Processing..."
                  disabled={
                    !amount ||
                    isNaN(Number(amount)) ||
                    Number(amount) <= 0 ||
                    Number(amount) > balance ||
                    !recipient.trim()
                  }
                >
                  Send Transfer
                </LoadingButton>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
