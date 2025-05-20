"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { format } from "date-fns"

type PaymentMethod = "invoice" | "escrow"
type InvoiceType = "fixed" | "hourly"
type EscrowType = "milestone" | "one-time"

interface Milestone {
  id: string
  name: string
  description: string
  date: string
  amount: string
  isInitial?: boolean
}

export default function PaymentOptionsForm() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("invoice")
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("fixed")
  const [escrowType, setEscrowType] = useState<EscrowType>("milestone")
  const [includeTax, setIncludeTax] = useState(false)
  const [frequency, setFrequency] = useState("Weekly")
  const [invoiceDay, setInvoiceDay] = useState("Tuesday")
  const [invoiceDue, setInvoiceDue] = useState("Upon receipt")
  const [firstPayment, setFirstPayment] = useState("Adjusted")
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      name: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      amount: "",
      isInitial: true,
    },
    {
      id: "2",
      name: "",
      description: "",
      date: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
      amount: "",
    },
  ])

  const addMilestone = () => {
    const newId = (milestones.length + 1).toString()
    const lastDate = new Date(milestones[milestones.length - 1].date)
    const newDate = new Date(lastDate)
    newDate.setDate(newDate.getDate() + 1)

    setMilestones([
      ...milestones,
      {
        id: newId,
        name: "",
        description: "",
        date: format(newDate, "yyyy-MM-dd"),
        amount: "",
      },
    ])
  }

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id))
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">2. Payment details</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select how you'd like the client to pay</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("invoice")}
              className={`p-4 border rounded-md text-left ${
                paymentMethod === "invoice" ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <div className="font-medium">Invoice billing</div>
              <div className="text-sm text-gray-500">
                Client gets invoiced regularly, based on a fixed fee or hours worked. Ideal for existing relationships.
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("escrow")}
              className={`p-4 border rounded-md text-left ${
                paymentMethod === "escrow" ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <div className="font-medium">Escrow payments</div>
              <div className="text-sm text-gray-500">
                Client pays upfront with funds held until milestone or project completion. Perfect for new
                relationships.
              </div>
            </button>
          </div>
        </div>

        {paymentMethod === "invoice" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">What are the invoice details?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceType("fixed")}
                  className={`py-2 px-4 border rounded-md text-center ${
                    invoiceType === "fixed" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
                  }`}
                >
                  Fixed payments
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceType("hourly")}
                  className={`py-2 px-4 border rounded-md text-center ${
                    invoiceType === "hourly" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
                  }`}
                >
                  Hourly payments
                </button>
              </div>
            </div>

            {invoiceType === "fixed" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency issued</label>
                    <div className="relative">
                      <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                      >
                        <option>Weekly</option>
                        <option>Bi-weekly</option>
                        <option>Monthly</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rate</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        $
                      </span>
                      <input type="text" className="flex-1 p-2 border border-gray-300 rounded-r-md" placeholder="USD" />
                      <span className="ml-2 inline-flex items-center text-gray-500">/wk</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      defaultValue={format(new Date(), "yyyy-MM-dd")}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Issue invoice on</label>
                    <div className="relative">
                      <select
                        value={invoiceDay}
                        onChange={(e) => setInvoiceDay(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                      >
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">First invoice date</label>
                    <div className="relative">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                        defaultValue="May 13, 2025"
                      >
                        <option>May 13, 2025</option>
                        <option>May 20, 2025</option>
                        <option>May 27, 2025</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input id="add-end-date" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="add-end-date" className="ml-2 text-sm text-gray-600">
                    Add end date
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First invoice payment</label>
                    <div className="relative">
                      <select
                        value={firstPayment}
                        onChange={(e) => setFirstPayment(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                      >
                        <option>Adjusted</option>
                        <option>Full amount</option>
                        <option>Prorated</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        $
                      </span>
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-r-md"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Invoice due</label>
                  <div className="relative">
                    <select
                      value={invoiceDue}
                      onChange={(e) => setInvoiceDue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                    >
                      <option>Upon receipt</option>
                      <option>Net 15</option>
                      <option>Net 30</option>
                      <option>Net 45</option>
                      <option>Net 60</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {invoiceType === "hourly" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <div className="relative">
                      <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                      >
                        <option>Weekly</option>
                        <option>Bi-weekly</option>
                        <option>Monthly</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly rate</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        $
                      </span>
                      <input type="text" className="flex-1 p-2 border border-gray-300 rounded-r-md" placeholder="USD" />
                      <span className="ml-2 inline-flex items-center text-gray-500">/hr</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Estimated hours</label>
                    <div className="flex">
                      <input
                        type="number"
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        placeholder="0"
                        min="0"
                      />
                      <button type="button" className="ml-2 p-2 border border-gray-300 rounded-md">
                        −
                      </button>
                      <button type="button" className="ml-2 p-2 border border-gray-300 rounded-md">
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue={format(new Date(), "yyyy-MM-dd")}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="yyyy-mm-dd"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="add-end-date-hourly"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="add-end-date-hourly" className="ml-2 text-sm text-gray-600">
                    Add end date
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Invoice due</label>
                  <div className="relative">
                    <select
                      value={invoiceDue}
                      onChange={(e) => setInvoiceDue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                    >
                      <option>Upon receipt</option>
                      <option>Net 15</option>
                      <option>Net 30</option>
                      <option>Net 45</option>
                      <option>Net 60</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-amber-400 text-xl">💡</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Please review before proceeding:</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          For invoice billing projects with hourly submissions, clients will be billed for hours worked.
                          This means that <strong>funds are not secured upfront</strong> and are{" "}
                          <strong>instead paid once the freelancer submits hours for work completed</strong>. For new
                          relationships, we recommend considering an escrow project instead, where funds are held in
                          escrow and paid out at the end of the project.{" "}
                          <a href="#" className="font-medium underline">
                            Switch to an escrow project.
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {paymentMethod === "escrow" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">How do you want to structure escrow payments?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEscrowType("milestone")}
                  className={`py-2 px-4 border rounded-md text-center ${
                    escrowType === "milestone" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
                  }`}
                >
                  Milestone payments
                </button>
                <button
                  type="button"
                  onClick={() => setEscrowType("one-time")}
                  className={`py-2 px-4 border rounded-md text-center ${
                    escrowType === "one-time" ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
                  }`}
                >
                  One-time payment
                </button>
              </div>
            </div>

            {escrowType === "milestone" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">What are the milestone payment details?</label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      defaultValue={format(new Date(), "yyyy-MM-dd")}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="p-4 border border-gray-200 rounded-md relative">
                    <div className="absolute left-0 top-4 bottom-4 flex items-center">
                      <div className="w-6 flex justify-center">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="ml-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          placeholder="Name this milestone"
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          value={milestone.name}
                          onChange={(e) => updateMilestone(milestone.id, "name", e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeMilestone(milestone.id)}
                          className="ml-2 text-gray-400 hover:text-gray-500"
                          disabled={milestones.length <= 1}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <textarea
                        placeholder="Include specific deliverables and other notes here"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                        value={milestone.description}
                        onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="relative">
                            <input
                              type="date"
                              className="w-full p-2 border border-gray-300 rounded-md"
                              value={milestone.date}
                              onChange={(e) => updateMilestone(milestone.id, "date", e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <Calendar className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {milestone.isInitial && (
                            <div className="mr-2 text-xs text-gray-500 flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Initial payment
                            </div>
                          )}
                          <div className="flex flex-1">
                            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                              $
                            </span>
                            <input
                              type="text"
                              className="flex-1 p-2 border border-gray-300 rounded-r-md"
                              placeholder="USD"
                              value={milestone.amount}
                              onChange={(e) => updateMilestone(milestone.id, "amount", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add another milestone
                </button>
              </div>
            )}

            {escrowType === "one-time" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">What are the one-time payment details?</label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className="py-2 px-4 border rounded-md text-center bg-gray-100 border-gray-300">
                    Fixed payment
                  </button>
                  <button type="button" className="py-2 px-4 border rounded-md text-center bg-white border-gray-200">
                    Hourly payment
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total fee</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        $
                      </span>
                      <input type="text" className="flex-1 p-2 border border-gray-300 rounded-r-md" placeholder="USD" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upfront amount</label>
                    <div className="flex">
                      <input
                        type="number"
                        className="flex-1 p-2 border border-gray-300 rounded-l-md"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                      <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue={format(new Date(), "yyyy-MM-dd")}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="mm/dd/yyyy"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium mb-2">Do you want to add inclusive tax?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIncludeTax(true)}
                className={`py-2 px-4 border rounded-md text-center ${
                  includeTax ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIncludeTax(false)}
                className={`py-2 px-4 border rounded-md text-center ${
                  !includeTax ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {includeTax && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tax Type</label>
                <div className="relative">
                  <select className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8">
                    <option>Tax Type</option>
                    <option>VAT</option>
                    <option>GST</option>
                    <option>HST</option>
                    <option>PST</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">e.g. VAT, GST, HST, PST</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ID/account number</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="ID/account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tax rate</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    placeholder="20"
                    defaultValue="20"
                    min="0"
                    max="100"
                  />
                  <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                    %
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
