"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { useDemo } from "./demo-context"
import { demoTransactions, demoScheduledDeposits } from "./demo-data"
import { supabase } from "./supabase-client"
import { v4 as uuidv4 } from "uuid"

export type Transaction = {
  id: string
  type: "purchase" | "funding" | "deposit" | "withdrawal" | "conversion" | "scheduled_deposit"
  amount: number
  currency: string
  description: string
  date: string
  status: "pending" | "completed" | "failed"
  targetCurrency?: string
  conversionRate?: number
  scheduledDepositId?: string
}

export type ScheduledDeposit = {
  id: string
  amount: number
  currency: string
  frequency: "daily" | "weekly" | "biweekly" | "monthly"
  nextExecutionDate: string
  description: string
  isActive: boolean
  createdAt: string
}

export type WalletNotification = {
  id: string
  type: "deposit_reminder" | "deposit_executed" | "low_balance" | "large_transaction" | "activity_summary"
  title: string
  message: string
  date: string
  read: boolean
  snoozedUntil?: string // Timestamp when the notification should reappear
  snoozeCount?: number // How many times the notification has been snoozed
  data?: any
}

export type SnoozeOption = "30min" | "1hour" | "3hours" | "tomorrow" | "nextweek"

type WalletContextType = {
  balance: number
  currency: string
  transactions: Transaction[]
  scheduledDeposits: ScheduledDeposit[]
  walletNotifications: WalletNotification[]
  isLoading: boolean
  addFunds: (amount: number) => Promise<void>
  withdrawFunds: (amount: number) => Promise<void>
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => Promise<void>
  refreshWallet: () => Promise<void>
  createScheduledDeposit: (deposit: Omit<ScheduledDeposit, "id" | "createdAt">) => Promise<void>
  updateScheduledDeposit: (id: string, deposit: Partial<ScheduledDeposit>) => Promise<void>
  deleteScheduledDeposit: (id: string) => Promise<void>
  executeScheduledDeposit: (id: string) => Promise<void>
  markNotificationAsRead: (id: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  deleteAllNotifications: () => Promise<void>
  snoozeNotification: (id: string, duration: SnoozeOption) => Promise<void>
  cancelSnooze: (id: string) => Promise<void>
  notificationSettings: {
    depositReminders: boolean
    depositExecutions: boolean
    lowBalanceAlerts: boolean
    largeTransactions: boolean
    activitySummaries: boolean
  }
  updateNotificationSettings: (settings: Partial<WalletContextType["notificationSettings"]>) => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  balance: 0,
  currency: "ECE",
  transactions: [],
  scheduledDeposits: [],
  walletNotifications: [],
  isLoading: true,
  addFunds: async () => {},
  withdrawFunds: async () => {},
  convertCurrency: async () => {},
  refreshWallet: async () => {},
  createScheduledDeposit: async () => {},
  updateScheduledDeposit: async () => {},
  deleteScheduledDeposit: async () => {},
  executeScheduledDeposit: async () => {},
  markNotificationAsRead: async () => {},
  markAllNotificationsAsRead: async () => {},
  deleteNotification: async () => {},
  deleteAllNotifications: async () => {},
  snoozeNotification: async () => {},
  cancelSnooze: async () => {},
  notificationSettings: {
    depositReminders: true,
    depositExecutions: true,
    lowBalanceAlerts: true,
    largeTransactions: true,
    activitySummaries: true,
  },
  updateNotificationSettings: async () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { isDemoMode } = useDemo()
  const [balance, setBalance] = useState(0)
  const [currency, setCurrency] = useState("ECE")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [scheduledDeposits, setScheduledDeposits] = useState<ScheduledDeposit[]>([])
  const [walletNotifications, setWalletNotifications] = useState<WalletNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notificationSettings, setNotificationSettings] = useState({
    depositReminders: true,
    depositExecutions: true,
    lowBalanceAlerts: true,
    largeTransactions: true,
    activitySummaries: true,
  })

  // Load wallet data
  useEffect(() => {
    if (user || isDemoMode) {
      refreshWallet()
    }
  }, [user, isDemoMode])

  // Check for scheduled deposits that need to be executed
  useEffect(() => {
    if (scheduledDeposits.length > 0) {
      const checkScheduledDeposits = async () => {
        const now = new Date()

        // Check for deposits that need reminders (24 hours before execution)
        if (notificationSettings.depositReminders) {
          const depositsNeedingReminders = scheduledDeposits.filter((deposit) => {
            const executionDate = new Date(deposit.nextExecutionDate)
            const timeDiff = executionDate.getTime() - now.getTime()
            const hoursDiff = timeDiff / (1000 * 60 * 60)

            // Send reminder if deposit is between 24 and 25 hours away
            return deposit.isActive && hoursDiff > 23 && hoursDiff < 25
          })

          for (const deposit of depositsNeedingReminders) {
            const existingReminder = walletNotifications.find(
              (n) =>
                n.type === "deposit_reminder" &&
                n.data?.depositId === deposit.id &&
                new Date(n.date).toDateString() === now.toDateString(),
            )

            if (!existingReminder) {
              createNotification({
                type: "deposit_reminder",
                title: "Upcoming Scheduled Deposit",
                message: `Your scheduled deposit of ${deposit.amount} ${deposit.currency} (${deposit.description}) will be executed tomorrow.`,
                data: { depositId: deposit.id },
              })
            }
          }
        }

        // Check for deposits that need to be executed
        const depositsToExecute = scheduledDeposits.filter(
          (deposit) => deposit.isActive && new Date(deposit.nextExecutionDate) <= now,
        )

        for (const deposit of depositsToExecute) {
          await executeScheduledDeposit(deposit.id)
        }
      }

      checkScheduledDeposits()

      // Set up interval to check every minute (in a real app, this would be handled by a server-side scheduler)
      const interval = setInterval(checkScheduledDeposits, 60000)
      return () => clearInterval(interval)
    }
  }, [scheduledDeposits, walletNotifications, notificationSettings.depositReminders])

  // Check for low balance
  useEffect(() => {
    if (notificationSettings.lowBalanceAlerts && balance < 100 && balance > 0) {
      // Check if we already sent a low balance alert today
      const today = new Date().toDateString()
      const existingAlert = walletNotifications.find(
        (n) => n.type === "low_balance" && new Date(n.date).toDateString() === today,
      )

      if (!existingAlert) {
        createNotification({
          type: "low_balance",
          title: "Low Balance Alert",
          message: `Your wallet balance is below 100 ${currency}. Consider adding funds to avoid issues with scheduled payments.`,
        })
      }
    }
  }, [balance, currency, walletNotifications, notificationSettings.lowBalanceAlerts])

  // Weekly activity summary
  useEffect(() => {
    if (notificationSettings.activitySummaries && transactions.length > 0) {
      const checkForWeeklySummary = () => {
        const now = new Date()
        // If it's Sunday and we haven't sent a summary today
        if (now.getDay() === 0) {
          const today = now.toDateString()
          const existingSummary = walletNotifications.find(
            (n) => n.type === "activity_summary" && new Date(n.date).toDateString() === today,
          )

          if (!existingSummary) {
            // Get transactions from the past week
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

            const weeklyTransactions = transactions.filter((tx) => new Date(tx.date) >= oneWeekAgo)

            if (weeklyTransactions.length > 0) {
              // Calculate total deposits and withdrawals
              const deposits = weeklyTransactions
                .filter((tx) => tx.type === "deposit" || tx.type === "scheduled_deposit")
                .reduce((sum, tx) => sum + tx.amount, 0)

              const withdrawals = weeklyTransactions
                .filter((tx) => tx.type === "withdrawal" || tx.type === "purchase")
                .reduce((sum, tx) => sum + tx.amount, 0)

              createNotification({
                type: "activity_summary",
                title: "Weekly Wallet Summary",
                message: `This week: +${deposits} ${currency} deposits, -${withdrawals} ${currency} spent. Current balance: ${balance} ${currency}.`,
                data: {
                  weeklyTransactions: weeklyTransactions.length,
                  deposits,
                  withdrawals,
                },
              })
            }
          }
        }
      }

      checkForWeeklySummary()

      // Check daily at midnight
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const timeUntilMidnight = tomorrow.getTime() - now.getTime()

      const timeout = setTimeout(checkForWeeklySummary, timeUntilMidnight)
      return () => clearTimeout(timeout)
    }
  }, [transactions, walletNotifications, balance, currency, notificationSettings.activitySummaries])

  // Check for snoozed notifications that need to be resurfaced
  useEffect(() => {
    const checkSnoozedNotifications = () => {
      const now = new Date()

      // Filter notifications that are snoozed and should be resurfaced
      const notificationsToResurface = walletNotifications.filter(
        (notification) => notification.snoozedUntil && new Date(notification.snoozedUntil) <= now,
      )

      if (notificationsToResurface.length > 0) {
        // Update the notifications to remove the snooze
        setWalletNotifications((prev) =>
          prev.map((notification) => {
            if (notification.snoozedUntil && new Date(notification.snoozedUntil) <= now) {
              // Create a copy of the notification without the snoozedUntil property
              const { snoozedUntil, ...rest } = notification

              return {
                ...rest,
                date: new Date().toISOString(), // Update the date to now
                read: false, // Mark as unread
              }
            }
            return notification
          }),
        )
      }
    }

    // Check immediately
    checkSnoozedNotifications()

    // Set up interval to check every minute
    const interval = setInterval(checkSnoozedNotifications, 60000)
    return () => clearInterval(interval)
  }, [walletNotifications])

  const refreshWallet = async () => {
    setIsLoading(true)

    try {
      if (isDemoMode) {
        // Load demo data
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        setBalance(1250)
        setCurrency("ECE")
        setTransactions(demoTransactions)
        setScheduledDeposits(demoScheduledDeposits)

        // Load demo wallet notifications
        const demoNotifications = [
          {
            id: "wn1",
            type: "deposit_reminder" as const,
            title: "Upcoming Scheduled Deposit",
            message: "Your weekly savings deposit of 100 ECE will be executed tomorrow.",
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            read: false,
            data: { depositId: "sd1" },
          },
          {
            id: "wn2",
            type: "deposit_executed" as const,
            title: "Scheduled Deposit Executed",
            message: "Your biweekly emergency fund deposit of 50 ECE has been successfully executed.",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            read: true,
            data: { depositId: "sd3", transactionId: "tx6" },
          },
          {
            id: "wn3",
            type: "activity_summary" as const,
            title: "Weekly Wallet Summary",
            message: "This week: +250 ECE deposits, -135 ECE spent. Current balance: 1250 ECE.",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            read: false,
            data: {
              weeklyTransactions: 8,
              deposits: 250,
              withdrawals: 135,
            },
          },
          {
            id: "wn4",
            type: "low_balance" as const,
            title: "Low Balance Alert",
            message: "Your wallet balance is getting low. Consider adding funds.",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            read: false,
            snoozedUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Snoozed for 30 minutes
            snoozeCount: 1,
          },
        ]

        setWalletNotifications(demoNotifications)
      } else if (user) {
        // Load real data from Supabase
        // This would be replaced with actual Supabase queries
        const { data: walletData, error: walletError } = await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (walletError && walletError.code !== "PGRST116") {
          throw walletError
        }

        if (walletData) {
          setBalance(walletData.balance)
          setCurrency(walletData.currency)

          // Load notification settings if available
          if (walletData.notification_settings) {
            setNotificationSettings(walletData.notification_settings)
          }
        } else {
          // Create a new wallet if one doesn't exist
          const { data: newWallet, error: createError } = await supabase
            .from("wallets")
            .insert([
              {
                user_id: user.id,
                balance: 0,
                currency: "ECE",
                notification_settings: notificationSettings,
              },
            ])
            .select()
            .single()

          if (createError) throw createError

          if (newWallet) {
            setBalance(newWallet.balance)
            setCurrency(newWallet.currency)
          }
        }

        // Get transactions
        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })

        if (txError) throw txError

        if (txData) {
          setTransactions(txData)
        }

        // Get scheduled deposits
        const { data: scheduledData, error: scheduledError } = await supabase
          .from("scheduled_deposits")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (scheduledError) throw scheduledError

        if (scheduledData) {
          setScheduledDeposits(scheduledData)
        }

        // Get wallet notifications
        const { data: notifData, error: notifError } = await supabase
          .from("wallet_notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })

        if (notifError) throw notifError

        if (notifData) {
          setWalletNotifications(notifData)
        }
      }
    } catch (error) {
      console.error("Error loading wallet data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addFunds = async (amount: number) => {
    if (amount <= 0) {
      return
    }

    try {
      if (isDemoMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Create a new transaction
        const newTransaction: Transaction = {
          id: `tx${Date.now()}`,
          type: "deposit",
          amount: amount,
          currency: currency,
          description: `Deposit to wallet`,
          date: new Date().toISOString(),
          status: "completed",
        }

        // Update state
        setBalance((prevBalance) => prevBalance + amount)
        setTransactions((prev) => [newTransaction, ...prev])

        // Check for large transaction notification
        if (notificationSettings.largeTransactions && amount >= 500) {
          createNotification({
            type: "large_transaction",
            title: "Large Deposit Detected",
            message: `A deposit of ${amount} ${currency} was added to your wallet.`,
            data: { transactionId: newTransaction.id },
          })
        }
      } else if (user) {
        // Start a transaction in Supabase
        const { data: walletData, error: walletError } = await supabase.rpc("add_funds", {
          p_user_id: user.id,
          p_amount: amount,
          p_currency: currency,
          p_description: `Deposit to wallet`,
        })

        if (walletError) throw walletError

        // Refresh wallet data
        await refreshWallet()

        // Check for large transaction notification
        if (notificationSettings.largeTransactions && amount >= 500) {
          const { data: txData } = await supabase
            .from("transactions")
            .select("id")
            .eq("user_id", user.id)
            .eq("type", "deposit")
            .order("date", { ascending: false })
            .limit(1)

          if (txData && txData.length > 0) {
            await supabase.from("wallet_notifications").insert([
              {
                user_id: user.id,
                type: "large_transaction",
                title: "Large Deposit Detected",
                message: `A deposit of ${amount} ${currency} was added to your wallet.`,
                date: new Date().toISOString(),
                read: false,
                data: { transactionId: txData[0].id },
              },
            ])
          }
        }
      }
    } catch (error) {
      console.error("Error adding funds:", error)
      throw error
    }
  }

  const withdrawFunds = async (amount: number) => {
    if (amount <= 0) {
      return
    }

    if (amount > balance) {
      return
    }

    try {
      if (isDemoMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Create a new transaction
        const newTransaction: Transaction = {
          id: `tx${Date.now()}`,
          type: "withdrawal",
          amount: amount,
          currency: currency,
          description: `Withdrawal from wallet`,
          date: new Date().toISOString(),
          status: "completed",
        }

        // Update state
        setBalance((prevBalance) => prevBalance - amount)
        setTransactions((prev) => [newTransaction, ...prev])

        // Check for large transaction notification
        if (notificationSettings.largeTransactions && amount >= 500) {
          createNotification({
            type: "large_transaction",
            title: "Large Withdrawal Detected",
            message: `A withdrawal of ${amount} ${currency} was made from your wallet.`,
            data: { transactionId: newTransaction.id },
          })
        }
      } else if (user) {
        // Start a transaction in Supabase
        const { data: walletData, error: walletError } = await supabase.rpc("withdraw_funds", {
          p_user_id: user.id,
          p_amount: amount,
          p_currency: currency,
          p_description: `Withdrawal from wallet`,
        })

        if (walletError) throw walletError

        // Refresh wallet data
        await refreshWallet()

        // Check for large transaction notification
        if (notificationSettings.largeTransactions && amount >= 500) {
          const { data: txData } = await supabase
            .from("transactions")
            .select("id")
            .eq("user_id", user.id)
            .eq("type", "withdrawal")
            .order("date", { ascending: false })
            .limit(1)

          if (txData && txData.length > 0) {
            await supabase.from("wallet_notifications").insert([
              {
                user_id: user.id,
                type: "large_transaction",
                title: "Large Withdrawal Detected",
                message: `A withdrawal of ${amount} ${currency} was made from your wallet.`,
                date: new Date().toISOString(),
                read: false,
                data: { transactionId: txData[0].id },
              },
            ])
          }
        }
      }
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      throw error
    }
  }

  const convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string) => {
    if (amount <= 0) {
      return
    }

    if (amount > balance) {
      return
    }

    if (fromCurrency === toCurrency) {
      return
    }

    try {
      if (isDemoMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock conversion rate
        const conversionRate = 1.2 // Example rate
        const convertedAmount = amount * conversionRate

        // Create a new transaction
        const newTransaction: Transaction = {
          id: `tx${Date.now()}`,
          type: "conversion",
          amount: amount,
          currency: fromCurrency,
          targetCurrency: toCurrency,
          conversionRate: conversionRate,
          description: `Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}`,
          date: new Date().toISOString(),
          status: "completed",
        }

        // Update state
        setBalance((prevBalance) => prevBalance - amount + convertedAmount)
        setTransactions((prev) => [newTransaction, ...prev])
        setCurrency(toCurrency)

        // Check for large transaction notification
        if (notificationSettings.largeTransactions && amount >= 500) {
          createNotification({
            type: "large_transaction",
            title: "Large Currency Conversion",
            message: `Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}.`,
            data: { transactionId: newTransaction.id },
          })
        }
      } else if (user) {
        // Start a transaction in Supabase
        const { data: conversionData, error: conversionError } = await supabase.rpc("convert_currency", {
          p_user_id: user.id,
          p_amount: amount,
          p_from_currency: fromCurrency,
          p_to_currency: toCurrency,
        })

        if (conversionError) throw conversionError

        // Refresh wallet data
        await refreshWallet()

        // Check for large transaction notification
        if (notificationSettings.largeTransactions && amount >= 500) {
          const { data: txData } = await supabase
            .from("transactions")
            .select("id")
            .eq("user_id", user.id)
            .eq("type", "conversion")
            .order("date", { ascending: false })
            .limit(1)

          if (txData && txData.length > 0) {
            await supabase.from("wallet_notifications").insert([
              {
                user_id: user.id,
                type: "large_transaction",
                title: "Large Currency Conversion",
                message: `A large currency conversion was performed in your wallet.`,
                date: new Date().toISOString(),
                read: false,
                data: { transactionId: txData[0].id },
              },
            ])
          }
        }
      }
    } catch (error) {
      console.error("Error converting currency:", error)
    }
  }

  const createScheduledDeposit = async (deposit: Omit<ScheduledDeposit, "id" | "createdAt">) => {
    if (deposit.amount <= 0) {
      return
    }

    try {
      if (isDemoMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Create a new scheduled deposit
        const newDeposit: ScheduledDeposit = {
          id: `sd${Date.now()}`,
          ...deposit,
          createdAt: new Date().toISOString(),
        }

        // Update state
        setScheduledDeposits((prev) => [newDeposit, ...prev])

        // Create notification for new scheduled deposit
        createNotification({
          type: "deposit_reminder",
          title: "New Scheduled Deposit Created",
          message: `Your ${deposit.frequency} deposit of ${deposit.amount} ${deposit.currency} has been scheduled to start on ${new Date(deposit.nextExecutionDate).toLocaleDateString()}.`,
          data: { depositId: newDeposit.id },
        })
      } else if (user) {
        // Insert into Supabase
        const { data: newDeposit, error } = await supabase
          .from("scheduled_deposits")
          .insert([
            {
              user_id: user.id,
              amount: deposit.amount,
              currency: deposit.currency,
              frequency: deposit.frequency,
              next_execution_date: deposit.nextExecutionDate,
              description: deposit.description,
              is_active: deposit.isActive,
            },
          ])
          .select()
          .single()

        if (error) throw error

        // Create notification for new scheduled deposit
        await supabase.from("wallet_notifications").insert([
          {
            user_id: user.id,
            type: "deposit_reminder",
            title: "New Scheduled Deposit Created",
            message: `Your ${deposit.frequency} deposit of ${deposit.amount} ${deposit.currency} has been scheduled to start on ${new Date(deposit.nextExecutionDate).toLocaleDateString()}.`,
            date: new Date().toISOString(),
            read: false,
            data: { depositId: newDeposit.id },
          },
        ])

        // Refresh wallet data
        await refreshWallet()
      }
    } catch (error) {
      console.error("Error creating scheduled deposit:", error)
    }
  }

  const updateScheduledDeposit = async (id: string, deposit: Partial<ScheduledDeposit>) => {
    if (deposit.amount !== undefined && deposit.amount <= 0) {
      return
    }

    try {
      if (isDemoMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get the original deposit
        const originalDeposit = scheduledDeposits.find((d) => d.id === id)

        // Update the scheduled deposit
        setScheduledDeposits((prev) => prev.map((item) => (item.id === id ? { ...item, ...deposit } : item)))

        // Create notification for updated scheduled deposit if significant changes were made
        if (
          (deposit.amount && originalDeposit && deposit.amount !== originalDeposit.amount) ||
          (deposit.frequency && originalDeposit && deposit.frequency !== originalDeposit.frequency) ||
          (deposit.isActive === true && originalDeposit && originalDeposit.isActive === false)
        ) {
          createNotification({
            type: "deposit_reminder",
            title: "Scheduled Deposit Updated",
            message: `Your scheduled deposit has been updated. Next execution: ${new Date(deposit.nextExecutionDate || originalDeposit?.nextExecutionDate || "").toLocaleDateString()}.`,
            data: { depositId: id },
          })
        }
      } else if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from("scheduled_deposits")
          .update({
            amount: deposit.amount,
            currency: deposit.currency,
            frequency: deposit.frequency,
            next_execution_date: deposit.nextExecutionDate,
            description: deposit.description,
            is_active: deposit.isActive,
          })
          .eq("id", id)
          .eq("user_id", user.id)

        if (error) throw error

        // Get the original deposit
        const { data: originalDeposit } = await supabase.from("scheduled_deposits").select("*").eq("id", id).single()

        // Create notification for updated scheduled deposit if significant changes were made
        if (
          (deposit.amount && originalDeposit && deposit.amount !== originalDeposit.amount) ||
          (deposit.frequency && originalDeposit && deposit.frequency !== originalDeposit.frequency) ||
          (deposit.isActive === true && originalDeposit && originalDeposit.is_active === false)
        ) {
          await supabase.from("wallet_notifications").insert([
            {
              user_id: user.id,
              type: "deposit_reminder",
              title: "Scheduled Deposit Updated",
              message: `Your scheduled deposit has been updated. Next execution: ${new Date(deposit.nextExecutionDate || originalDeposit?.next_execution_date || "").toLocaleDateString()}.`,
              date: new Date().toISOString(),
              read: false,
              data: { depositId: id },
            },
          ])
        }

        // Refresh wallet data
        await refreshWallet()
      }
    } catch (error) {
      console.error("Error updating scheduled deposit:", error)
    }
  }

  const deleteScheduledDeposit = async (id: string) => {
    try {
      if (isDemoMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Delete the scheduled deposit
        setScheduledDeposits((prev) => prev.filter((item) => item.id !== id))
      } else if (user) {
        // Delete from Supabase
        const { error } = await supabase.from("scheduled_deposits").delete().eq("id", id).eq("user_id", user.id)

        if (error) throw error

        // Refresh wallet data
        await refreshWallet()
      }
    } catch (error) {
      console.error("Error deleting scheduled deposit:", error)
    }
  }

  const executeScheduledDeposit = async (id: string) => {
    try {
      const deposit = scheduledDeposits.find((d) => d.id === id)
      if (!deposit) {
        throw new Error("Scheduled deposit not found")
      }

      if (isDemoMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Create a new transaction
        const newTransaction: Transaction = {
          id: `tx${Date.now()}`,
          type: "scheduled_deposit",
          amount: deposit.amount,
          currency: deposit.currency,
          description: `Scheduled deposit: ${deposit.description}`,
          date: new Date().toISOString(),
          status: "completed",
          scheduledDepositId: deposit.id,
        }

        // Update balance
        setBalance((prevBalance) => prevBalance + deposit.amount)

        // Add transaction
        setTransactions((prev) => [newTransaction, ...prev])

        // Calculate next execution date
        const nextDate = calculateNextExecutionDate(deposit.frequency, new Date())

        // Update scheduled deposit
        setScheduledDeposits((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  nextExecutionDate: nextDate.toISOString(),
                }
              : item,
          ),
        )

        // Create notification for executed deposit
        if (notificationSettings.depositExecutions) {
          createNotification({
            type: "deposit_executed",
            title: "Scheduled Deposit Executed",
            message: `Your scheduled deposit of ${deposit.amount} ${deposit.currency} (${deposit.description}) has been successfully executed.`,
            data: {
              depositId: deposit.id,
              transactionId: newTransaction.id,
            },
          })
        }
      } else if (user) {
        // Execute in Supabase
        const { error } = await supabase.rpc("execute_scheduled_deposit", {
          p_deposit_id: id,
          p_user_id: user.id,
        })

        if (error) throw error

        // Create notification for executed deposit
        if (notificationSettings.depositExecutions) {
          // Get the transaction ID
          const { data: txData } = await supabase
            .from("transactions")
            .select("id")
            .eq("user_id", user.id)
            .eq("scheduled_deposit_id", id)
            .order("date", { ascending: false })
            .limit(1)

          await supabase.from("wallet_notifications").insert([
            {
              user_id: user.id,
              type: "deposit_executed",
              title: "Scheduled Deposit Executed",
              message: `Your scheduled deposit of ${deposit.amount} ${deposit.currency} (${deposit.description}) has been successfully executed.`,
              date: new Date().toISOString(),
              read: false,
              data: {
                depositId: id,
                transactionId: txData?.[0]?.id,
              },
            },
          ])
        }

        // Refresh wallet data
        await refreshWallet()
      }
    } catch (error) {
      console.error("Error executing scheduled deposit:", error)
    }
  }

  // Notification functions
  const createNotification = (notification: Omit<WalletNotification, "id" | "date" | "read">) => {
    const newNotification: WalletNotification = {
      id: `wn${uuidv4()}`,
      ...notification,
      date: new Date().toISOString(),
      read: false,
    }

    setWalletNotifications((prev) => [newNotification, ...prev])
  }

  const markNotificationAsRead = async (id: string) => {
    try {
      if (isDemoMode) {
        setWalletNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      } else if (user) {
        const { error } = await supabase
          .from("wallet_notifications")
          .update({ read: true })
          .eq("id", id)
          .eq("user_id", user.id)

        if (error) throw error

        await refreshWallet()
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      if (isDemoMode) {
        setWalletNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      } else if (user) {
        const { error } = await supabase
          .from("wallet_notifications")
          .update({ read: true })
          .eq("user_id", user.id)
          .eq("read", false)

        if (error) throw error

        await refreshWallet()
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      if (isDemoMode) {
        setWalletNotifications((prev) => prev.filter((n) => n.id !== id))
      } else if (user) {
        const { error } = await supabase.from("wallet_notifications").delete().eq("id", id).eq("user_id", user.id)

        if (error) throw error

        await refreshWallet()
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const deleteAllNotifications = async () => {
    try {
      if (isDemoMode) {
        setWalletNotifications([])
      } else if (user) {
        const { error } = await supabase.from("wallet_notifications").delete().eq("user_id", user.id)

        if (error) throw error

        await refreshWallet()
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error)
    }
  }

  // Snooze notification
  const snoozeNotification = async (id: string, duration: SnoozeOption) => {
    try {
      // Calculate the snooze until date based on the duration
      const now = new Date()
      let snoozedUntil: Date

      switch (duration) {
        case "30min":
          snoozedUntil = new Date(now.getTime() + 30 * 60 * 1000)
          break
        case "1hour":
          snoozedUntil = new Date(now.getTime() + 60 * 60 * 1000)
          break
        case "3hours":
          snoozedUntil = new Date(now.getTime() + 3 * 60 * 60 * 1000)
          break
        case "tomorrow":
          snoozedUntil = new Date(now)
          snoozedUntil.setDate(snoozedUntil.getDate() + 1)
          snoozedUntil.setHours(9, 0, 0, 0) // 9 AM tomorrow
          break
        case "nextweek":
          snoozedUntil = new Date(now)
          snoozedUntil.setDate(snoozedUntil.getDate() + 7)
          snoozedUntil.setHours(9, 0, 0, 0) // 9 AM next week
          break
        default:
          snoozedUntil = new Date(now.getTime() + 60 * 60 * 1000) // Default to 1 hour
      }

      if (isDemoMode) {
        // Update the notification with snooze information
        setWalletNotifications((prev) =>
          prev.map((notification) => {
            if (notification.id === id) {
              const snoozeCount = notification.snoozeCount ? notification.snoozeCount + 1 : 1
              return {
                ...notification,
                snoozedUntil: snoozedUntil.toISOString(),
                snoozeCount,
                read: true, // Mark as read when snoozed
              }
            }
            return notification
          }),
        )
      } else if (user) {
        // Get the current notification to update the snooze count
        const { data: currentNotification } = await supabase
          .from("wallet_notifications")
          .select("snooze_count")
          .eq("id", id)
          .eq("user_id", user.id)
          .single()

        const snoozeCount = currentNotification?.snooze_count ? currentNotification.snooze_count + 1 : 1

        // Update in Supabase
        const { error } = await supabase
          .from("wallet_notifications")
          .update({
            snoozed_until: snoozedUntil.toISOString(),
            snooze_count: snoozeCount,
            read: true,
          })
          .eq("id", id)
          .eq("user_id", user.id)

        if (error) throw error

        await refreshWallet()
      }
    } catch (error) {
      console.error("Error snoozing notification:", error)
    }
  }

  // Cancel snooze
  const cancelSnooze = async (id: string) => {
    try {
      if (isDemoMode) {
        // Remove the snooze from the notification
        setWalletNotifications((prev) =>
          prev.map((notification) => {
            if (notification.id === id) {
              // Create a new object without the snoozedUntil property
              const { snoozedUntil, ...rest } = notification
              return rest
            }
            return notification
          }),
        )
      } else if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from("wallet_notifications")
          .update({
            snoozed_until: null,
          })
          .eq("id", id)
          .eq("user_id", user.id)

        if (error) throw error

        await refreshWallet()
      }
    } catch (error) {
      console.error("Error canceling snooze:", error)
    }
  }

  // Helper function to format snooze time for user-friendly messages
  const formatSnoozeTime = (duration: SnoozeOption): string => {
    switch (duration) {
      case "30min":
        return "in 30 minutes"
      case "1hour":
        return "in 1 hour"
      case "3hours":
        return "in 3 hours"
      case "tomorrow":
        return "tomorrow at 9 AM"
      case "nextweek":
        return "next week"
      default:
        return "later"
    }
  }

  const updateNotificationSettings = async (settings: Partial<WalletContextType["notificationSettings"]>) => {
    try {
      const updatedSettings = { ...notificationSettings, ...settings }

      if (isDemoMode) {
        setNotificationSettings(updatedSettings)
      } else if (user) {
        const { error } = await supabase
          .from("wallets")
          .update({ notification_settings: updatedSettings })
          .eq("user_id", user.id)

        if (error) throw error

        setNotificationSettings(updatedSettings)
      }
    } catch (error) {
      console.error("Error updating notification settings:", error)
    }
  }

  // Helper function to calculate the next execution date based on frequency
  const calculateNextExecutionDate = (frequency: string, fromDate: Date): Date => {
    const nextDate = new Date(fromDate)

    switch (frequency) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + 1)
        break
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case "biweekly":
        nextDate.setDate(nextDate.getDate() + 14)
        break
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      default:
        nextDate.setMonth(nextDate.getMonth() + 1) // Default to monthly
    }

    return nextDate
  }

  const value = {
    balance,
    currency,
    transactions,
    scheduledDeposits,
    walletNotifications,
    isLoading,
    addFunds,
    withdrawFunds,
    convertCurrency,
    refreshWallet,
    createScheduledDeposit,
    updateScheduledDeposit,
    deleteScheduledDeposit,
    executeScheduledDeposit,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
    snoozeNotification,
    cancelSnooze,
    notificationSettings,
    updateNotificationSettings,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export const useWallet = () => {
  return useContext(WalletContext)
}
