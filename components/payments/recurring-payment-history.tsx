"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Calendar, Clock, DollarSign, Edit, Pause, Play, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RecurringPayment {
  id: string
  title: string
  amount: number
  category: string
  description: string
  frequency: string
  startDate: string
  endDate: string | null
  isActive: boolean
  nextPaymentDate: string
  lastPaymentDate: string | null
  createdAt: string
}

interface RecurringPaymentHistoryProps {
  payments: RecurringPayment[]
  onEdit: (payment: RecurringPayment) => void
  onDelete: (id: string) => Promise<void>
  onToggleActive: (id: string, isActive: boolean) => Promise<void>
  isLoading: boolean
}

export function RecurringPaymentHistory({
  payments,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading,
}: RecurringPaymentHistoryProps) {
  const { toast } = useToast()
  const [selectedPayment, setSelectedPayment] = useState<RecurringPayment | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Daily"
      case "weekly":
        return "Weekly"
      case "biweekly":
        return "Every 2 Weeks"
      case "monthly":
        return "Monthly"
      case "quarterly":
        return "Quarterly"
      case "annually":
        return "Annually"
      default:
        return frequency
    }
  }

  const handleToggleActive = async (payment: RecurringPayment) => {
    try {
      await onToggleActive(payment.id, !payment.isActive)
      toast({
        title: payment.isActive ? "Payment paused" : "Payment activated",
        description: payment.isActive
          ? `${payment.title} has been paused and won't be processed automatically.`
          : `${payment.title} has been activated and will be processed automatically.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedPayment) return

    try {
      await onDelete(selectedPayment.id)
      setIsDeleteDialogOpen(false)
      setSelectedPayment(null)
      toast({
        title: "Payment deleted",
        description: `${selectedPayment.title} has been deleted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openDeleteDialog = (payment: RecurringPayment) => {
    setSelectedPayment(payment)
    setIsDeleteDialogOpen(true)
  }

  const openDetailsDialog = (payment: RecurringPayment) => {
    setSelectedPayment(payment)
    setIsDetailsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      {payments.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No recurring payments found.</p>
        </div>
      ) : (
        payments.map((payment) => (
          <Card key={payment.id} className={payment.isActive ? "" : "opacity-70"}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{payment.title}</h3>
                    {!payment.isActive && <Badge variant="outline">Paused</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>{payment.amount.toFixed(2)} ECE</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{getFrequencyText(payment.frequency)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Next: {format(new Date(payment.nextPaymentDate), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(payment)}
                    disabled={isLoading}
                    title={payment.isActive ? "Pause" : "Activate"}
                  >
                    {payment.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(payment)} disabled={isLoading} title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(payment)}
                    disabled={isLoading}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openDetailsDialog(payment)} className="ml-2">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Payment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        {selectedPayment && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedPayment.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">Amount:</div>
                <div className="col-span-2 font-medium">{selectedPayment.amount.toFixed(2)} ECE</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">Category:</div>
                <div className="col-span-2">{selectedPayment.category}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">Frequency:</div>
                <div className="col-span-2">{getFrequencyText(selectedPayment.frequency)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">Start Date:</div>
                <div className="col-span-2">{format(new Date(selectedPayment.startDate), "MMM d, yyyy")}</div>
              </div>
              {selectedPayment.endDate && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-muted-foreground">End Date:</div>
                  <div className="col-span-2">{format(new Date(selectedPayment.endDate), "MMM d, yyyy")}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">Next Payment:</div>
                <div className="col-span-2">{format(new Date(selectedPayment.nextPaymentDate), "MMM d, yyyy")}</div>
              </div>
              {selectedPayment.lastPaymentDate && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-muted-foreground">Last Payment:</div>
                  <div className="col-span-2">{format(new Date(selectedPayment.lastPaymentDate), "MMM d, yyyy")}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">Status:</div>
                <div className="col-span-2">
                  {selectedPayment.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-muted-foreground">Paused</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">Created:</div>
                <div className="col-span-2">{format(new Date(selectedPayment.createdAt), "MMM d, yyyy")}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">Description:</div>
                <div className="col-span-2 whitespace-pre-wrap">{selectedPayment.description}</div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsDetailsDialogOpen(false)
                  onEdit(selectedPayment)
                }}
              >
                Edit Payment
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recurring Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recurring payment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
