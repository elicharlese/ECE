"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { format, addDays, addMonths } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RecurringPaymentFormProps {
  onSubmit: (formData: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  initialData?: any
  isEditing?: boolean
}

export function RecurringPaymentForm({
  onSubmit,
  onCancel,
  isLoading,
  initialData,
  isEditing = false,
}: RecurringPaymentFormProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState(initialData?.title || "")
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [frequency, setFrequency] = useState(initialData?.frequency || "monthly")
  const [startDate, setStartDate] = useState<Date>(
    initialData?.startDate ? new Date(initialData.startDate) : new Date(),
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.endDate ? new Date(initialData.endDate) : undefined,
  )
  const [hasEndDate, setHasEndDate] = useState(!!initialData?.endDate)
  const [files, setFiles] = useState<File[]>([])
  const [isActive, setIsActive] = useState(initialData?.isActive !== false) // Default to true if not specified

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!title || !amount || !category || !description || !startDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      })
      return
    }

    // Create form data
    const formData = {
      title,
      amount: Number.parseFloat(amount),
      category,
      description,
      frequency,
      startDate: startDate.toISOString(),
      endDate: hasEndDate && endDate ? endDate.toISOString() : null,
      isActive,
      files,
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to save recurring payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const getNextPaymentDates = () => {
    if (!startDate) return []

    const dates = []
    let currentDate = new Date(startDate)

    // If start date is in the past, adjust to next occurrence
    if (currentDate < new Date()) {
      switch (frequency) {
        case "daily":
          while (currentDate < new Date()) {
            currentDate = addDays(currentDate, 1)
          }
          break
        case "weekly":
          while (currentDate < new Date()) {
            currentDate = addDays(currentDate, 7)
          }
          break
        case "biweekly":
          while (currentDate < new Date()) {
            currentDate = addDays(currentDate, 14)
          }
          break
        case "monthly":
          while (currentDate < new Date()) {
            currentDate = addMonths(currentDate, 1)
          }
          break
        case "quarterly":
          while (currentDate < new Date()) {
            currentDate = addMonths(currentDate, 3)
          }
          break
        case "annually":
          while (currentDate < new Date()) {
            currentDate = addMonths(currentDate, 12)
          }
          break
      }
    }

    // Add the next 3 occurrences
    for (let i = 0; i < 3; i++) {
      if (i > 0) {
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
          case "quarterly":
            currentDate = addMonths(currentDate, 3)
            break
          case "annually":
            currentDate = addMonths(currentDate, 12)
            break
        }
      }

      // Check if we've passed the end date
      if (hasEndDate && endDate && currentDate > endDate) {
        break
      }

      dates.push(format(currentDate, "MMM d, yyyy"))
    }

    return dates
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Payment Title</Label>
          <Input
            id="title"
            placeholder="Enter payment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8"
              required
            />
            <div className="absolute left-3 top-2.5 text-muted-foreground">ECE</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Project Payment">Project Payment</SelectItem>
              <SelectItem value="Subscription">Subscription</SelectItem>
              <SelectItem value="Operational Expense">Operational Expense</SelectItem>
              <SelectItem value="Marketing Expense">Marketing Expense</SelectItem>
              <SelectItem value="Capital Expense">Capital Expense</SelectItem>
              <SelectItem value="Training & Development">Training & Development</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency} required>
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal" id="startDate">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="endDate" className="flex items-center gap-2">
              <Switch id="hasEndDate" checked={hasEndDate} onCheckedChange={setHasEndDate} />
              End Date
            </Label>
          </div>
          {hasEndDate && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="endDate">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                  disabled={(date) => date < startDate}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter payment description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px]"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
        <Label htmlFor="isActive">Active</Label>
        <span className="text-sm text-muted-foreground ml-2">
          {isActive
            ? "This recurring payment is active and will be processed automatically."
            : "This recurring payment is paused and won't be processed until activated."}
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments</Label>
        <div className="border border-dashed rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
          <Input id="attachments" type="file" multiple className="hidden" onChange={handleFileChange} />
          <Button type="button" variant="outline" onClick={() => document.getElementById("attachments")?.click()}>
            Browse Files
          </Button>
          {files.length > 0 && (
            <div className="mt-4 text-left">
              <p className="text-sm font-medium mb-2">Selected Files:</p>
              <ul className="text-sm space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-muted-foreground">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Preview of next payment dates */}
      {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
        <div className="rounded-lg bg-primary/5 p-4">
          <h4 className="font-medium mb-2">Payment Schedule Preview</h4>
          <p className="text-sm text-muted-foreground mb-1">
            {frequency.charAt(0).toUpperCase() + frequency.slice(1)} payments of {Number(amount).toFixed(2)} ECE
          </p>
          <p className="text-sm text-muted-foreground">Next payments:</p>
          <ul className="text-sm text-muted-foreground mt-1">
            {getNextPaymentDates().map((date, index) => (
              <li key={index} className="ml-4 list-disc">
                {date}
              </li>
            ))}
          </ul>
          {hasEndDate && endDate && (
            <p className="text-sm text-muted-foreground mt-2">
              This recurring payment will end on {format(endDate, "MMM d, yyyy")}.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Payment" : "Create Recurring Payment"}
        </Button>
      </div>
    </form>
  )
}
