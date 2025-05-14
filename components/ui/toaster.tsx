"use client"

import { ToastProvider, ToastViewport } from "@/components/ui/toast"

export function Toaster() {
  // Disabled automatic toast notifications
  // const { toasts } = useToast()

  return (
    <ToastProvider>
      {/* Removed automatic toast rendering */}
      <ToastViewport />
    </ToastProvider>
  )
}
