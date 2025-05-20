"use client"

import { useState, useRef, useEffect } from "react"
import { WalletIcon, Plus, ArrowDown, ArrowUp, RefreshCw, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { useDemo } from "@/lib/demo-context"
import { useAuth } from "@/lib/auth-context"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LoadingButton } from "@/components/ui/loading-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { Badge } from "@/components/ui/badge"

export function WalletDropdown() {
  const {
    balance = 0,
    currency = "ECE",
    transactions = [],
    addFunds,
    withdrawFunds,
    isLoading = false,
    refreshWallet,
  } = useWallet() || {}
  const { isDemoMode } = useDemo() || {}
  const { user } = useAuth() || {}
  const [isOpen, setIsOpen] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showQuickWithdraw, setShowQuickWithdraw] = useState(false)
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [persistentBalance, setPersistentBalance] = useState(0)
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
  const [mounted, setMounted] = useState(false)
  const [persistentAuthState, setPersistentAuthState] = useState(false)

  // Add this useEffect to check for persistent auth state
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const persistentAuth = localStorage.getItem("eceAuthState")
        if (persistentAuth) {
          const authState = JSON.parse(persistentAuth)
          if (authState.timestamp && Date.now() - authState.timestamp < 24 * 60 * 60 * 1000) {
            setPersistentAuthState(true)
          }
        }
      } catch (e) {
        console.error("Error parsing persistent auth state:", e)
      }
    }
  }, [])

  // Load persistent wallet state
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedWalletState = localStorage.getItem("walletState")
        if (storedWalletState) {
          const parsedState = JSON.parse(storedWalletState)
          if (parsedState && parsedState.balance) {
            setPersistentBalance(parsedState.balance)
          }
        }
      } catch (e) {
        console.error("Error parsing wallet state from localStorage:", e)
      }
    }
    setMounted(true)
  }, [])

  // Update persistent state when balance changes
  useEffect(() => {
    if (typeof window !== "undefined" && balance > 0) {
      try {
        localStorage.setItem(
          "walletState",
          JSON.stringify({
            balance,
            currency,
            lastUpdated: new Date().toISOString(),
          }),
        )
        setPersistentBalance(balance)
      } catch (e) {
        console.error("Error storing wallet state:", e)
      }
    }
  }, [balance, currency])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowQuickAdd(false)
        setShowQuickWithdraw(false)
        setAmount("")
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen])

  // Get recent transactions
  const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 3) : []

  const handleQuickAdd = async (presetAmount?: string) => {
    const amountToAdd = presetAmount || amount

    if (!amountToAdd || isNaN(Number(amountToAdd)) || Number(amountToAdd) <= 0 || !addFunds) {
      return
    }

    setIsProcessing(true)
    try {
      await addFunds(Number(amountToAdd))
      showToast("Funds Added", `${amountToAdd} ${currency} has been added to your wallet.`, "success")
      setAmount("")
      setShowQuickAdd(false)
    } catch (error) {
      console.error("Error adding funds:", error)
      showToast("Transaction Failed", "There was an error adding funds to your wallet.", "destructive")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !withdrawFunds) {
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
      showToast("Funds Withdrawn", `${amount} ${currency} has been withdrawn from your wallet.`, "success")
      setAmount("")
      setShowQuickWithdraw(false)
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      showToast("Transaction Failed", "There was an error withdrawing funds from your wallet.", "destructive")
    } finally {
      setIsProcessing(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "scheduled_deposit":
        return <Plus className="h-3 w-3 text-green-500" />
      case "withdrawal":
      case "purchase":
        return <ArrowUp className="h-3 w-3 text-red-500" />
      case "conversion":
        return <RefreshCw className="h-3 w-3 text-blue-500" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

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

  // Use persistent balance if the actual balance is still loading
  const displayBalance = isLoading ? persistentBalance : balance

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

  if (!mounted) return null
  if (!user && !isDemoMode && !persistentAuthState) return null

  return (
    <div ref={dropdownRef}>
      {renderToast()}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild onClick={() => setIsOpen(!isOpen)}>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full"
            aria-label="Open wallet"
            title="Wallet"
          >
            <WalletIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
              {displayBalance > 9999 ? "9k+" : displayBalance}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Wallet</h3>
              <Button variant="ghost" size="icon" onClick={() => refreshWallet?.()} title="Refresh wallet">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <Card className="mt-2 bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <Badge variant="outline" className="text-xs px-2 py-0 h-5 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Verified
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {isLoading ? (
                      <span className="inline-block h-6 w-16 animate-pulse rounded bg-muted"></span>
                    ) : (
                      `${balance} ${currency}`
                    )}
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => refreshWallet?.()}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setShowQuickAdd(true)
                      setShowQuickWithdraw(false)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Funds
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowQuickWithdraw(true)
                      setShowQuickAdd(false)
                    }}
                  >
                    <ArrowDown className="h-4 w-4 mr-1" /> Withdraw
                  </Button>
                </div>

                {/* Quick ECE Refill Buttons */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2 text-xs bg-green-100/50 hover:bg-green-200/60 dark:bg-green-900/20 dark:hover:bg-green-800/30"
                    onClick={() => handleQuickAdd("100")}
                  >
                    +100 ECE
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2 text-xs bg-green-100/50 hover:bg-green-200/60 dark:bg-green-900/20 dark:hover:bg-green-800/30"
                    onClick={() => handleQuickAdd("250")}
                  >
                    +250 ECE
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2 text-xs bg-green-100/50 hover:bg-green-200/60 dark:bg-green-900/20 dark:hover:bg-green-800/30"
                    onClick={() => handleQuickAdd("500")}
                  >
                    +500 ECE
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2 text-xs bg-green-100/50 hover:bg-green-200/60 dark:bg-green-900/20 dark:hover:bg-green-800/30"
                    onClick={() => handleQuickAdd("1000")}
                  >
                    +1000 ECE
                  </Button>
                </div>
              </CardContent>
            </Card>

            {showQuickAdd && (
              <Card className="mt-2 border-primary/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Quick Add Funds</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="add-amount">Amount ({currency})</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="add-amount"
                          type="number"
                          min="1"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <LoadingButton
                          size="sm"
                          onClick={() => handleQuickAdd()}
                          isLoading={isProcessing}
                          loadingText="Adding..."
                          disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
                        >
                          Add
                        </LoadingButton>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => handleQuickAdd("100")}
                      >
                        +100
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => handleQuickAdd("250")}
                      >
                        +250
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => handleQuickAdd("500")}
                      >
                        +500
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => handleQuickAdd("1000")}
                      >
                        +1000
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {showQuickWithdraw && (
              <Card className="mt-2 border-primary/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Quick Withdraw</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="withdraw-amount">Amount ({currency})</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="withdraw-amount"
                          type="number"
                          min="1"
                          max={balance.toString()}
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <LoadingButton
                          size="sm"
                          onClick={handleQuickWithdraw}
                          isLoading={isProcessing}
                          loadingText="Processing..."
                          disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0 || Number(amount) > balance}
                        >
                          Withdraw
                        </LoadingButton>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => setAmount(Math.min(50, balance).toString())}
                        disabled={balance < 50}
                      >
                        50
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => setAmount(Math.min(100, balance).toString())}
                        disabled={balance < 100}
                      >
                        100
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => setAmount(Math.min(250, balance).toString())}
                        disabled={balance < 250}
                      >
                        250
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => setAmount(balance.toString())}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator className="my-2" />

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Recent Transactions</h4>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                          <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                      <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-1">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted rounded-full p-1">{getTransactionIcon(transaction.type)}</div>
                        <div>
                          <div className="text-sm font-medium truncate max-w-[150px]">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          transaction.type === "deposit" || transaction.type === "scheduled_deposit"
                            ? "text-green-600 dark:text-green-400"
                            : transaction.type === "withdrawal" || transaction.type === "purchase"
                              ? "text-red-600 dark:text-red-400"
                              : ""
                        }`}
                      >
                        {transaction.type === "deposit" || transaction.type === "scheduled_deposit"
                          ? "+"
                          : transaction.type === "withdrawal" || transaction.type === "purchase"
                            ? "-"
                            : ""}
                        {transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-sm text-muted-foreground">No transactions yet</div>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false)
                setShowQuickAdd(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Add ECE</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false)
                setShowQuickWithdraw(true)
              }}
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              <span>Withdraw ECE</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
