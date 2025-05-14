"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, isToday, isTomorrow, addDays } from "date-fns"
import { Calendar, Clock } from "lucide-react"

interface UpcomingPayment {
  id: string
  title: string
  amount: number
  date: string
  isRecurring: boolean
  frequency?: string
}

interface UpcomingPaymentsProps {
  payments: UpcomingPayment[]
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  const getDateLabel = (date: string) => {
    const paymentDate = new Date(date)
    if (isToday(paymentDate)) return "Today"
    if (isTomorrow(paymentDate)) return "Tomorrow"

    const nextWeek = addDays(new Date(), 7)
    if (paymentDate <= nextWeek) {
      return format(paymentDate, "EEEE") // Day name
    }

    return format(paymentDate, "MMM d, yyyy")
  }

  const groupedPayments = payments.reduce(
    (groups, payment) => {
      const date = new Date(payment.date)
      const dateStr = format(date, "yyyy-MM-dd")

      if (!groups[dateStr]) {
        groups[dateStr] = {
          date,
          payments: [],
        }
      }

      groups[dateStr].payments.push(payment)
      return groups
    },
    {} as Record<string, { date: Date; payments: UpcomingPayment[] }>,
  )

  // Sort dates chronologically
  const sortedDates = Object.values(groupedPayments).sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDates.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">No upcoming payments scheduled.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((group) => (
              <div key={format(group.date, "yyyy-MM-dd")}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">{getDateLabel(group.date.toISOString())}</h3>
                  {isToday(group.date) && (
                    <Badge variant="outline" className="ml-2 bg-primary/10">
                      Today
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  {group.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-2 rounded-md bg-primary/5">
                      <div>
                        <div className="font-medium">{payment.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          {payment.isRecurring && (
                            <>
                              <Clock className="h-3.5 w-3.5" />
                              <span>Recurring</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="font-medium">{payment.amount.toFixed(2)} ECE</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
