"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/lib/wallet-context"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpDown, Plus, Minus, RefreshCw, Calendar, Clock, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WalletSummary } from "@/components/wallet/wallet-summary"

export function WalletForm() {
  const { toast } = useToast()
  const {
    balance,
    currency,
    transactions,
    scheduledDeposits,
    isLoading,
    addFunds,
    withdrawFunds,
    convertCurrency,
    createScheduledDeposit,
    updateScheduledDeposit,
    deleteScheduledDeposit,
    executeScheduledDeposit,
    notificationSettings,
    updateNotificationSettings,
  } = useWallet()

  // Deposit state
  const [depositAmount, setDepositAmount] = useState("")
  const [isDepositing, setIsDepositing] = useState(false)

  // Withdrawal state
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  // Conversion state
  const [conversionAmount, setConversionAmount] = useState("")
  const [targetCurrency, setTargetCurrency] = useState("BTC")
  const [isConverting, setIsConverting] = useState(false)

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      })
      return
    }

    setIsDepositing(true)
    try {
      await addFunds(Number(depositAmount))
      setDepositAmount("")
    } catch (error) {
      console.error("Error depositing funds:", error)
    } finally {
      setIsDepositing(false)
    }
  }

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || isNaN(Number(withdrawalAmount)) || Number(withdrawalAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      })
      return
    }

    if (Number(withdrawalAmount) > balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough funds for this withdrawal.",
        variant: "destructive",
      })
      return
    }

    setIsWithdrawing(true)
    try {
      await withdrawFunds(Number(withdrawalAmount))
      setWithdrawalAmount("")
    } catch (error) {
      console.error("Error withdrawing funds:", error)
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleConversion = async () => {
    if (!conversionAmount || isNaN(Number(conversionAmount)) || Number(conversionAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to convert.",
        variant: "destructive",
      })
      return
    }

    if (Number(conversionAmount) > balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough funds for this conversion.",
        variant: "destructive",
      })
      return
    }

    if (currency === targetCurrency) {
      toast({
        title: "Same currency",
        description: "Cannot convert to the same currency.",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)
    try {
      await convertCurrency(Number(conversionAmount), currency, targetCurrency)
      setConversionAmount("")
    } catch (error) {
      console.error("Error converting currency:", error)
    } finally {
      setIsConverting(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Plus className="h-4 w-4 text-green-500" />
      case "scheduled_deposit":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <Minus className="h-4 w-4 text-red-500" />
      case "purchase":
        return <Minus className="h-4 w-4 text-red-500" />
      case "conversion":
        return <ArrowUpDown className="h-4 w-4 text-blue-500" />
      case "funding":
        return <Minus className="h-4 w-4 text-orange-500" />
      default:
        return <RefreshCw className="h-4 w-4" />
    }
  }

  return (
    <>
      <WalletSummary />

      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="scheduled" className="hidden md:block">
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="notifications" className="hidden md:block">
            Notifications
          </TabsTrigger>
        </TabsList>

        <div className="md:hidden grid grid-cols-2 gap-2 mb-4">
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </div>

        <TabsContent value="balance">
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
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="md:block flex justify-between items-center">
              <CardTitle>Transaction History</CardTitle>
              <CardDescription className="md:mt-1.5 mt-0">View your recent transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions yet.</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="mt-0.5 bg-muted rounded-full p-1.5 hidden sm:block">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="bg-muted rounded-full p-1 sm:hidden">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <p className="font-medium text-sm sm:text-base">{transaction.description}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                            </p>
                            <p
                              className={`font-medium text-sm sm:text-base ${
                                transaction.type === "deposit" || transaction.type === "scheduled_deposit"
                                  ? "text-green-600 dark:text-green-400"
                                  : transaction.type === "withdrawal" ||
                                      transaction.type === "purchase" ||
                                      transaction.type === "funding"
                                    ? "text-red-600 dark:text-red-400"
                                    : ""
                              }`}
                            >
                              {transaction.type === "deposit" || transaction.type === "scheduled_deposit"
                                ? "+"
                                : transaction.type === "withdrawal" ||
                                    transaction.type === "purchase" ||
                                    transaction.type === "funding"
                                  ? "-"
                                  : ""}
                              {transaction.amount} {transaction.currency}
                              {transaction.targetCurrency
                                ? ` → ${(transaction.amount * (transaction.conversionRate || 1)).toFixed(2)} ${transaction.targetCurrency}`
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader className="md:block flex justify-between items-center">
              <CardTitle>Scheduled Deposits</CardTitle>
              <CardDescription className="md:mt-1.5 mt-0">Manage your automatic recurring deposits.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledDeposits.map((deposit) => (
                  <div key={deposit.id} className={`p-4 border rounded-lg ${deposit.isActive ? "" : "opacity-60"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">{deposit.description}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {deposit.amount} {deposit.currency} • {deposit.frequency}
                          </p>
                          <div className="flex items-center mt-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <p className="text-xs text-muted-foreground">
                              Next: {new Date(deposit.nextExecutionDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateScheduledDeposit(deposit.id, { isActive: !deposit.isActive })}
                        >
                          {deposit.isActive ? "Pause" : "Resume"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteScheduledDeposit(deposit.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>

                    {new Date(deposit.nextExecutionDate) <= new Date() && deposit.isActive && (
                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">This deposit is due for execution</span>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => executeScheduledDeposit(deposit.id)}>
                          Execute Now
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {scheduledDeposits.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No scheduled deposits</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Set up automatic recurring deposits to grow your wallet.
                    </p>
                    <Button>Create Scheduled Deposit</Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create New Scheduled Deposit</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader className="md:block flex justify-between items-center">
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription className="md:mt-1.5 mt-0">Manage your wallet notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Deposit Reminders</div>
                    <div className="text-sm text-muted-foreground">Get notified before scheduled deposits</div>
                  </div>
                  <Switch
                    checked={notificationSettings.depositReminders}
                    onCheckedChange={(checked) => updateNotificationSettings({ depositReminders: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Deposit Executions</div>
                    <div className="text-sm text-muted-foreground">Get notified when deposits are executed</div>
                  </div>
                  <Switch
                    checked={notificationSettings.depositExecutions}
                    onCheckedChange={(checked) => updateNotificationSettings({ depositExecutions: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Low Balance Alerts</div>
                    <div className="text-sm text-muted-foreground">Get notified when your balance is low</div>
                  </div>
                  <Switch
                    checked={notificationSettings.lowBalanceAlerts}
                    onCheckedChange={(checked) => updateNotificationSettings({ lowBalanceAlerts: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Large Transactions</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified about large deposits or withdrawals
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.largeTransactions}
                    onCheckedChange={(checked) => updateNotificationSettings({ largeTransactions: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Activity Summaries</div>
                    <div className="text-sm text-muted-foreground">Get weekly summaries of your wallet activity</div>
                  </div>
                  <Switch
                    checked={notificationSettings.activitySummaries}
                    onCheckedChange={(checked) => updateNotificationSettings({ activitySummaries: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Button variant="outline" className="w-full sm:w-auto">
                Reset to Defaults
              </Button>
              <Button className="w-full sm:w-auto">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
