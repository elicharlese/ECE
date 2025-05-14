"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SimplifiedOrderFlow } from "@/components/project/simplified-order-flow"
import { useWallet } from "@/lib/wallet-context"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderPage() {
  const { balance, currency } = useWallet()
  const router = useRouter()
  const [orderSubmitted, setOrderSubmitted] = useState(false)

  const handleOrderSubmit = (formData: any) => {
    // In a real app, you would submit the order to your backend here
    console.log("Order submitted:", formData)

    // Show success message
    setOrderSubmitted(true)

    // Redirect to projects page after a delay
    setTimeout(() => {
      router.push("/app/projects")
    }, 3000)
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Your App</h1>
        <p className="text-muted-foreground">Create your custom app in just a few simple steps</p>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          {orderSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-bold">Order Submitted Successfully!</h3>
              <p className="text-muted-foreground">
                Thank you for your order. Our team will review your requirements and contact you shortly.
              </p>
              <Button className="mt-4" onClick={() => router.push("/app/projects")}>
                View Your Projects
              </Button>
            </div>
          ) : (
            <SimplifiedOrderFlow onSubmit={handleOrderSubmit} currency={currency} balance={balance} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
