"use client"

import { useState } from "react"
import { useWallet, type ScheduledDeposit } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format, addDays, addMonths } from "date-fns"
import { CalendarIcon, Plus, Edit, Trash2, PlayCircle, PauseCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function ScheduledDeposits() {
  const {
    scheduledDeposits,
    createScheduledDeposit,
    updateScheduledDeposit,
    deleteScheduledDeposit,
    executeScheduledDeposit,
  } = useWallet()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDeposit, setSelectedDeposit] = useState<ScheduledDeposit | null>(null)

  // Form state
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("ECE")
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "biweekly" | "monthly">("monthly")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)

  // Loading states
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  const resetForm = () => {
    setAmount("")
    setCurrency("ECE")
    setFrequency("monthly")
    setStartDate(new Date())
    setDescription("")
    setIsActive(true)
  }

  const handleAddDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      })
      return
    }

    if (!description) {
      toast({
        title: "Description required",
        description: "Please enter a description for this scheduled deposit.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      await createScheduledDeposit({
        amount: Number(amount),
        currency,
        frequency,
        nextExecutionDate: startDate.toISOString(),
        description,
        isActive,
      })

      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating scheduled deposit:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditDeposit = async () => {
    if (!selectedDeposit) return

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      })
      return
    }

    if (!description) {
      toast({
        title: "Description required",
        description: "Please enter a description for this scheduled deposit.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      await updateScheduledDeposit(selectedDeposit.id, {
        amount: Number(amount),
        currency,
        frequency,
        nextExecutionDate: startDate.toISOString(),
        description,
        isActive,
      })

      setIsEditDialogOpen(false)
      setSelectedDeposit(null)
    } catch (error) {
      console.error("Error updating scheduled deposit:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteDeposit = async () => {
    if (!selectedDeposit) return

    setIsDeleting(true)
    try {
      await deleteScheduledDeposit(selectedDeposit.id)
      setIsDeleteDialogOpen(false)
      setSelectedDeposit(null)
    } catch (error) {
      console.error("Error deleting scheduled deposit:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExecuteDeposit = async (id: string) => {
    setIsExecuting(true)
    try {
      await executeScheduledDeposit(id)
    } catch (error) {
      console.error("Error executing scheduled deposit:", error)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleToggleActive = async (deposit: ScheduledDeposit) => {
    try {
      await updateScheduledDeposit(deposit.id, {
        isActive: !deposit.isActive,
      })
    } catch (error) {
      console.error("Error toggling active state:", error)
    }
  }

  const openEditDialog = (deposit: ScheduledDeposit) => {
    setSelectedDeposit(deposit)
    setAmount(deposit.amount.toString())
    setCurrency(deposit.currency)
    setFrequency(deposit.frequency as "daily" | "weekly" | "biweekly" | "monthly")
    setStartDate(new Date(deposit.nextExecutionDate))
    setDescription(deposit.description)
    setIsActive(deposit.isActive)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (deposit: ScheduledDeposit) => {
    setSelectedDeposit(deposit)
    setIsDeleteDialogOpen(true)
  }

  const getNextExecutionText = (frequency: string, date: string) => {
    try {
      const nextDate = new Date(date)
      const now = new Date()

      if (nextDate < now) {
        return "Due now"
      }

      const days = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (days === 0) {
        return "Today"
      } else if (days === 1) {
        return "Tomorrow"
      } else if (days < 7) {
        return `In ${days} days`
      } else if (days < 30) {
        return `In ${Math.ceil(days / 7)} weeks`
      } else {
        return format(nextDate, "MMM d, yyyy")
      }
    } catch (error) {
      return "Invalid date"
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Daily"
      case "weekly":
        return "Weekly"
      case "biweekly":
        return "Every 2 weeks"
      case "monthly":
        return "Monthly"
      default:
        return frequency
    }
  }

  const getPreviewDates = (frequency: string, startDate: Date) => {
    const dates = []
    let currentDate = new Date(startDate)

    for (let i = 0; i < 3; i++) {
      switch (frequency) {
        case "daily":
          currentDate = addDays(currentDate, 1)
          break
        case "weekly":
          currentDate = addDays(currentDate, 7)
          break
        case "biweekly":
          currentDate = addDays(currentDate, 14)
          break
        case "monthly":
          currentDate = addMonths(currentDate, 1)
          break
      }
      dates.push(format(currentDate, "MMM d, yyyy"))
    }

    return dates
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Scheduled Deposits</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deposit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Scheduled Deposit</DialogTitle>
              <DialogDescription>
                Set up a recurring deposit to automatically add funds to your wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <div className="col-span-3">
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="col-span-3">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                  <SelectTrigger id="frequency" className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="text-right">
                  First Deposit
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Monthly savings"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                  <Label htmlFor="active">{isActive ? "Enabled" : "Disabled"}</Label>
                </div>
              </div>

              {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
                <div className="mt-2 rounded-lg bg-primary/5 p-4">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    {getFrequencyText(frequency)} deposits of {Number(amount).toFixed(2)} {currency}
                  </p>
                  <p className="text-sm text-muted-foreground">Next deposits:</p>
                  <ul className="text-sm text-muted-foreground mt-1">
                    {getPreviewDates(frequency, startDate).map((date, index) => (
                      <li key={index} className="ml-4 list-disc">
                        {date}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDeposit} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Deposit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {scheduledDeposits.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No scheduled deposits</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a scheduled deposit to automatically add funds to your wallet on a recurring basis.
          </p>
          <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Scheduled Deposit
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledDeposits.map((deposit) => (
            <div key={deposit.id} className={cn("rounded-lg border p-4", !deposit.isActive && "opacity-60")}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="font-medium">{deposit.description}</div>
                  {!deposit.isActive && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">Paused</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(deposit)}
                    title={deposit.isActive ? "Pause" : "Resume"}
                  >
                    {deposit.isActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(deposit)} title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(deposit)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount:</span>{" "}
                  <span className="font-medium">
                    {deposit.amount.toFixed(2)} {deposit.currency}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency:</span>{" "}
                  <span className="font-medium">{getFrequencyText(deposit.frequency)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Next deposit:</span>{" "}
                  <span className="font-medium">
                    {getNextExecutionText(deposit.frequency, deposit.nextExecutionDate)}
                  </span>
                </div>
              </div>
              {new Date(deposit.nextExecutionDate) <= new Date() && deposit.isActive && (
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExecuteDeposit(deposit.id)}
                    disabled={isExecuting}
                  >
                    {isExecuting ? "Processing..." : "Process Now"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Scheduled Deposit</DialogTitle>
            <DialogDescription>Update your scheduled deposit settings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-currency" className="text-right">
                Currency
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="edit-currency" className="col-span-3">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-frequency" className="text-right">
                Frequency
              </Label>
              <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                <SelectTrigger id="edit-frequency" className="col-span-3">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-start-date" className="text-right">
                Next Deposit
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input
                id="edit-description"
                placeholder="Monthly savings"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-active" className="text-right">
                Active
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="edit-active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="edit-active">{isActive ? "Enabled" : "Disabled"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDeposit} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Scheduled Deposit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scheduled deposit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDeposit} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
