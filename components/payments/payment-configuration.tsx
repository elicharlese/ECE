"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, Info, Trash2 } from "lucide-react"

type PaymentMethod = "invoice" | "escrow"
type InvoiceType = "fixed" | "hourly"
type EscrowType = "milestone" | "one-time"
type FrequencyType = "weekly" | "biweekly" | "monthly"
type InvoiceDueType = "upon_receipt" | "7_days" | "14_days" | "30_days"

interface Milestone {
  id: string
  name: string
  description: string
  date: Date | undefined
  amount: string
  isInitial?: boolean
}

export function PaymentConfiguration() {
  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("invoice")

  // Invoice settings
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("fixed")
  const [frequency, setFrequency] = useState<FrequencyType>("weekly")
  const [fixedRate, setFixedRate] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [estimatedHours, setEstimatedHours] = useState("0")
  const [invoiceStartDate, setInvoiceStartDate] = useState<Date | undefined>(new Date())
  const [invoiceEndDate, setInvoiceEndDate] = useState<Date | undefined>(undefined)
  const [hasEndDate, setHasEndDate] = useState(false)
  const [invoiceDue, setInvoiceDue] = useState<InvoiceDueType>("upon_receipt")

  // Invoice fixed payment additional fields
  const [invoiceIssueDay, setInvoiceIssueDay] = useState<string>("tuesday")
  const [firstInvoiceDate, setFirstInvoiceDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 13),
  )
  const [firstInvoicePayment, setFirstInvoicePayment] = useState<string>("adjusted")
  const [firstInvoiceAmount, setFirstInvoiceAmount] = useState<string>("0.00")

  // Escrow settings
  const [escrowType, setEscrowType] = useState<EscrowType>("milestone")
  const [totalFee, setTotalFee] = useState("")
  const [upfrontPercentage, setUpfrontPercentage] = useState("0")
  const [escrowStartDate, setEscrowStartDate] = useState<Date | undefined>(new Date())
  const [escrowEndDate, setEscrowEndDate] = useState<Date | undefined>(undefined)

  // Milestone settings
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      name: "",
      description: "",
      date: new Date(),
      amount: "",
      isInitial: true,
    },
    {
      id: "2",
      name: "",
      description: "",
      date: new Date(Date.now() + 86400000), // Next day
      amount: "",
    },
  ])

  // Tax settings
  const [includeTax, setIncludeTax] = useState(false)
  const [taxType, setTaxType] = useState("")
  const [taxId, setTaxId] = useState("")
  const [taxRate, setTaxRate] = useState("20")

  // Add a new milestone
  const addMilestone = () => {
    const newId = (milestones.length + 1).toString()
    const lastMilestoneDate = milestones[milestones.length - 1].date

    const newMilestone: Milestone = {
      id: newId,
      name: "",
      description: "",
      date: lastMilestoneDate ? new Date(lastMilestoneDate.getTime() + 86400000) : new Date(),
      amount: "",
    }

    setMilestones([...milestones, newMilestone])
  }

  // Remove a milestone
  const removeMilestone = (id: string) => {
    if (milestones.length <= 1) return
    setMilestones(milestones.filter((milestone) => milestone.id !== id))
  }

  // Update a milestone
  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    setMilestones(milestones.map((milestone) => (milestone.id === id ? { ...milestone, [field]: value } : milestone)))
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">2. Payment details</h2>
        <div className="flex items-center mb-6">
          <span className="text-sm text-muted-foreground mr-2">Select how you'd like the client to pay</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-auto p-0">
                <Info className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="text-sm">
                <p className="font-medium mb-2">Payment Methods</p>
                <p className="mb-2">
                  Choose the payment method that works best for your project and relationship with the client.
                </p>
                <p className="text-xs text-muted-foreground">
                  Different payment methods offer different levels of security and flexibility.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            className={`border rounded-md p-4 cursor-pointer transition-all ${
              paymentMethod === "invoice" ? "border-primary" : "border-input"
            }`}
            onClick={() => setPaymentMethod("invoice")}
          >
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="invoice" id="invoice" />
                <div className="flex-1">
                  <Label htmlFor="invoice" className="text-base font-medium">
                    Invoice billing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Client gets invoiced regularly, based on a fixed fee or hours worked. Ideal for existing
                    relationships.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div
            className={`border rounded-md p-4 cursor-pointer transition-all ${
              paymentMethod === "escrow" ? "border-primary" : "border-input"
            }`}
            onClick={() => setPaymentMethod("escrow")}
          >
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="escrow" id="escrow" />
                <div className="flex-1">
                  <Label htmlFor="escrow" className="text-base font-medium">
                    Escrow payments
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Client pays upfront with funds held until milestone or project completion. Perfect for new
                    relationships.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Invoice Billing Options */}
        {paymentMethod === "invoice" && (
          <div className="space-y-6">
            <div className="flex items-center mb-2">
              <span className="text-sm text-muted-foreground mr-2">What are the invoice details?</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="text-sm">
                    <p className="font-medium mb-2">Invoice Details</p>
                    <p className="mb-2">Configure how you'll bill your client for the work performed.</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className={`border rounded-md p-3 cursor-pointer transition-all ${
                  invoiceType === "fixed" ? "bg-muted" : ""
                }`}
                onClick={() => setInvoiceType("fixed")}
              >
                <RadioGroup value={invoiceType} onValueChange={(value) => setInvoiceType(value as InvoiceType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed-payments" />
                    <Label htmlFor="fixed-payments">Fixed payments</Label>
                  </div>
                </RadioGroup>
              </div>

              <div
                className={`border rounded-md p-3 cursor-pointer transition-all ${
                  invoiceType === "hourly" ? "bg-muted" : ""
                }`}
                onClick={() => setInvoiceType("hourly")}
              >
                <RadioGroup value={invoiceType} onValueChange={(value) => setInvoiceType(value as InvoiceType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly-payments" />
                    <Label htmlFor="hourly-payments">Hourly payments</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {invoiceType === "fixed" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency issued</Label>
                    <Select value={frequency} onValueChange={(value) => setFrequency(value as FrequencyType)}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Biweekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate</Label>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input
                        id="rate"
                        value={fixedRate}
                        onChange={(e) => setFixedRate(e.target.value)}
                        placeholder="0.00"
                        className="flex-1"
                      />
                      <span className="ml-2">/wk</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center">
                    <Label htmlFor="start-date" className="mr-2">
                      Start date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-auto p-0">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">The date your contract begins.</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="start-date">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {invoiceStartDate ? format(invoiceStartDate, "MM/dd/yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={invoiceStartDate} onSelect={setInvoiceStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="issue-day">Issue invoice on</Label>
                    <Select value={invoiceIssueDay} onValueChange={setInvoiceIssueDay}>
                      <SelectTrigger id="issue-day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="first-invoice-date">First invoice date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="first-invoice-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {firstInvoiceDate ? format(firstInvoiceDate, "MMMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={firstInvoiceDate}
                          onSelect={setFirstInvoiceDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox
                    id="add-end-date"
                    checked={hasEndDate}
                    onCheckedChange={(checked) => setHasEndDate(!!checked)}
                  />
                  <div className="flex items-center">
                    <Label htmlFor="add-end-date" className="text-sm mr-2">
                      Add end date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-auto p-0">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">Add an end date if you know when the project will be completed.</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="first-invoice-payment" className="mr-2">
                        First invoice payment
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <p className="text-sm">Specify how the first invoice payment should be handled.</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select value={firstInvoicePayment} onValueChange={setFirstInvoicePayment}>
                      <SelectTrigger id="first-invoice-payment">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adjusted">Adjusted</SelectItem>
                        <SelectItem value="full">Full payment</SelectItem>
                        <SelectItem value="prorated">Prorated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input
                        id="amount"
                        value={firstInvoiceAmount}
                        onChange={(e) => setFirstInvoiceAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="invoice-due">Invoice due</Label>
                  <Select value={invoiceDue} onValueChange={(value) => setInvoiceDue(value as InvoiceDueType)}>
                    <SelectTrigger id="invoice-due" className="w-full">
                      <SelectValue placeholder="Select when invoice is due" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upon_receipt">Upon receipt</SelectItem>
                      <SelectItem value="7_days">Net 7 - Due in 7 days</SelectItem>
                      <SelectItem value="14_days">Net 14 - Due in 14 days</SelectItem>
                      <SelectItem value="30_days">Net 30 - Due in 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/30 border border-muted rounded-md mb-6">
                  <p className="text-sm">
                    This agreement is valid for up to 1 year (expiring on{" "}
                    {invoiceStartDate
                      ? format(
                          new Date(
                            invoiceStartDate.getFullYear() + 1,
                            invoiceStartDate.getMonth(),
                            invoiceStartDate.getDate(),
                          ),
                          "MM/dd/yyyy",
                        )
                      : "MM/DD/YYYY"}
                    ). Projects can be ended at any time.
                  </p>
                </div>
              </>
            )}

            {invoiceType === "hourly" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={frequency} onValueChange={(value) => setFrequency(value as FrequencyType)}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Biweekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourly-rate">Hourly rate</Label>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input
                        id="hourly-rate"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="0.00"
                        className="flex-1"
                      />
                      <span className="ml-2">/hr</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="estimated-hours" className="mr-2">
                        Estimated hours
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <p className="text-sm">Estimate the number of hours you expect to work per billing period.</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 px-3"
                        onClick={() => setEstimatedHours((prev) => Math.max(0, Number.parseInt(prev) - 1).toString())}
                      >
                        −
                      </Button>
                      <Input
                        id="estimated-hours"
                        value={estimatedHours}
                        onChange={(e) => setEstimatedHours(e.target.value)}
                        className="mx-2 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 px-3"
                        onClick={() => setEstimatedHours((prev) => (Number.parseInt(prev) + 1).toString())}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="start-date">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {invoiceStartDate ? format(invoiceStartDate, "MM/dd/yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={invoiceStartDate} onSelect={setInvoiceStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {hasEndDate && (
                <div className="space-y-2">
                  <Label htmlFor="end-date">End date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="end-date">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {invoiceEndDate ? format(invoiceEndDate, "MM/dd/yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={invoiceEndDate}
                        onSelect={setInvoiceEndDate}
                        initialFocus
                        disabled={(date) => date < (invoiceStartDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="add-end-date"
                checked={hasEndDate}
                onCheckedChange={(checked) => setHasEndDate(!!checked)}
              />
              <Label htmlFor="add-end-date" className="text-sm">
                Add end date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm">Add an end date if you know when the project will be completed.</p>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="invoice-due">Invoice due</Label>
              <Select value={invoiceDue} onValueChange={(value) => setInvoiceDue(value as InvoiceDueType)}>
                <SelectTrigger id="invoice-due" className="w-full">
                  <SelectValue placeholder="Select when invoice is due" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upon_receipt">Upon receipt</SelectItem>
                  <SelectItem value="7_days">Net 7 - Due in 7 days</SelectItem>
                  <SelectItem value="14_days">Net 14 - Due in 14 days</SelectItem>
                  <SelectItem value="30_days">Net 30 - Due in 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
              <div className="flex items-start">
                <div className="mr-2 mt-1">💡</div>
                <div>
                  <p className="font-medium">Please review before proceeding:</p>
                  <p className="text-sm mt-1">
                    For invoice billing projects with hourly submissions, clients will be billed for hours worked. This
                    means that <span className="font-medium">funds are not secured upfront</span> and are{" "}
                    <span className="font-medium">
                      instead paid once the freelancer submits hours for work completed
                    </span>
                    .
                  </p>
                  <p className="text-sm mt-2">
                    For new relationships, we recommend considering an escrow project instead, where funds are held in
                    escrow and paid out at the end of the project.{" "}
                    <button className="text-primary underline" onClick={() => setPaymentMethod("escrow")}>
                      Switch to an escrow project.
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Escrow Payment Options */}
        {paymentMethod === "escrow" && (
          <div className="space-y-6">
            <div className="flex items-center mb-2">
              <span className="text-sm text-muted-foreground mr-2">How do you want to structure escrow payments?</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="text-sm">
                    <p className="font-medium mb-2">Escrow Payment Structure</p>
                    <p className="mb-2">Choose how you want to structure payments for your project.</p>
                    <p className="text-xs text-muted-foreground">
                      Milestone payments allow you to break down the project into smaller deliverables with separate
                      payments.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                className={`border rounded-md p-3 cursor-pointer transition-all ${
                  escrowType === "milestone" ? "bg-muted" : ""
                }`}
                onClick={() => setEscrowType("milestone")}
              >
                <RadioGroup value={escrowType} onValueChange={(value) => setEscrowType(value as EscrowType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="milestone" id="milestone-payments" />
                    <Label htmlFor="milestone-payments">Milestone payments</Label>
                  </div>
                </RadioGroup>
              </div>

              <div
                className={`border rounded-md p-3 cursor-pointer transition-all ${
                  escrowType === "one-time" ? "bg-muted" : ""
                }`}
                onClick={() => setEscrowType("one-time")}
              >
                <RadioGroup value={escrowType} onValueChange={(value) => setEscrowType(value as EscrowType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-time" id="one-time-payment" />
                    <Label htmlFor="one-time-payment">One-time payment</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {escrowType === "one-time" && (
              <>
                <div className="flex items-center mb-2">
                  <span className="text-sm text-muted-foreground mr-2">What are the one-time payment details?</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-md p-3 cursor-pointer transition-all bg-muted" onClick={() => {}}>
                    <RadioGroup value="fixed">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed-payment" />
                        <Label htmlFor="fixed-payment">Fixed payment</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="border rounded-md p-3 cursor-pointer transition-all opacity-50" onClick={() => {}}>
                    <RadioGroup value="fixed">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="hourly-payment" disabled />
                        <Label htmlFor="hourly-payment">Hourly payment</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="total-fee">Total fee</Label>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input
                        id="total-fee"
                        value={totalFee}
                        onChange={(e) => setTotalFee(e.target.value)}
                        placeholder="0.00"
                        className="flex-1"
                      />
                      <span className="ml-2">USD</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upfront-amount">Upfront amount</Label>
                    <div className="flex items-center">
                      <Input
                        id="upfront-amount"
                        value={upfrontPercentage}
                        onChange={(e) => setUpfrontPercentage(e.target.value)}
                        placeholder="0"
                        className="flex-1"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="escrow-start-date">Start date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="escrow-start-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {escrowStartDate ? format(escrowStartDate, "MM/dd/yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={escrowStartDate} onSelect={setEscrowStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="escrow-end-date">End date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="escrow-end-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {escrowEndDate ? format(escrowEndDate, "MM/dd/yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={escrowEndDate}
                          onSelect={setEscrowEndDate}
                          initialFocus
                          disabled={(date) => date < (escrowStartDate || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </>
            )}

            {escrowType === "milestone" && (
              <>
                <div className="flex items-center mb-2">
                  <span className="text-sm text-muted-foreground mr-2">What are the milestone payment details?</span>
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="milestone-start-date">Start date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="milestone-start-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {escrowStartDate ? format(escrowStartDate, "MM/dd/yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={escrowStartDate} onSelect={setEscrowStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Milestone List */}
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="border border-input rounded-md p-4 relative">
                      <div className="absolute left-4 top-4 flex flex-col items-center">
                        <div className="flex items-center justify-center h-6 w-6 text-muted-foreground">
                          <span>::</span>
                        </div>
                      </div>

                      <div className="ml-8 space-y-4">
                        <div className="flex justify-between items-center">
                          <Input
                            placeholder="Name this milestone"
                            value={milestone.name}
                            onChange={(e) => updateMilestone(milestone.id, "name", e.target.value)}
                            className="border-none text-base font-medium p-0 h-auto focus-visible:ring-0"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(milestone.id)}
                            disabled={milestones.length <= 1 || milestone.isInitial}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>

                        <Textarea
                          placeholder="Include specific deliverables and other notes here"
                          value={milestone.description}
                          onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                          className="min-h-[100px] resize-none"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {milestone.date ? format(milestone.date, "MM/dd/yyyy") : "Select date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={milestone.date}
                                  onSelect={(date) => updateMilestone(milestone.id, "date", date)}
                                  initialFocus
                                  disabled={(date) => date < (escrowStartDate || new Date())}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="flex items-center">
                            {milestone.isInitial && (
                              <div className="mr-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-auto p-0">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <p className="text-sm">
                                      This is the initial payment that will be charged when the client accepts the
                                      proposal.
                                    </p>
                                  </PopoverContent>
                                </Popover>
                                <span className="text-xs text-muted-foreground ml-1">Initial payment</span>
                              </div>
                            )}
                            <div className="flex items-center flex-1">
                              <span className="mr-2">$</span>
                              <Input
                                value={milestone.amount}
                                onChange={(e) => updateMilestone(milestone.id, "amount", e.target.value)}
                                placeholder="0.00"
                                className="flex-1"
                              />
                              <span className="ml-2">USD</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addMilestone} className="w-full flex items-center justify-center">
                    <span className="mr-2">+</span> Add another milestone
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tax Settings */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center mb-2">
            <span className="text-sm text-muted-foreground mr-2">Do you want to add inclusive tax?</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="text-sm">
                  <p className="font-medium mb-2">Inclusive Tax</p>
                  <p className="mb-2">If you need to charge tax on your services, you can add it here.</p>
                  <p className="text-xs text-muted-foreground">The tax will be included in the total amount.</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className={`border rounded-md p-3 cursor-pointer transition-all ${includeTax ? "bg-muted" : ""}`}
              onClick={() => setIncludeTax(true)}
            >
              <RadioGroup value={includeTax ? "yes" : "no"} onValueChange={(value) => setIncludeTax(value === "yes")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="tax-yes" />
                  <Label htmlFor="tax-yes">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            <div
              className={`border rounded-md p-3 cursor-pointer transition-all ${!includeTax ? "bg-muted" : ""}`}
              onClick={() => setIncludeTax(false)}
            >
              <RadioGroup value={includeTax ? "yes" : "no"} onValueChange={(value) => setIncludeTax(value === "yes")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="tax-no" />
                  <Label htmlFor="tax-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {includeTax && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax-type">Tax Type</Label>
                <Select value={taxType} onValueChange={setTaxType}>
                  <SelectTrigger id="tax-type">
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vat">VAT</SelectItem>
                    <SelectItem value="gst">GST</SelectItem>
                    <SelectItem value="hst">HST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="sales">Sales Tax</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">e.g. VAT, GST, HST, PST</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax-id">ID/account number</Label>
                <Input
                  id="tax-id"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="Enter tax ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax rate</Label>
                <div className="flex items-center">
                  <Input
                    id="tax-rate"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline">
            <ChevronUp className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button>
            Next
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
