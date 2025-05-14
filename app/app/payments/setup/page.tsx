"use client"

import { PaymentConfiguration } from "@/components/payments/payment-configuration"

export default function PaymentSetupPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Create Payment Agreement</h1>
      <PaymentConfiguration />
    </div>
  )
}
