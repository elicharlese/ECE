'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Star, TrendingUp, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { GlassCard } from './ui/glass-card'

interface Toast {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
}

interface ToastProviderProps {
  children: React.ReactNode
}

const toastIcons = {
  info: <Bell className="w-5 h-5 text-[#66D9EF]" />,
  success: <Star className="w-5 h-5 text-[#A6E22E]" />,
  warning: <TrendingUp className="w-5 h-5 text-[#E6DB74]" />,
  error: <AlertCircle className="w-5 h-5 text-[#F92672]" />
}

let toastId = 0
const toastListeners: Array<(toast: Toast) => void> = []

export const addToast = (toast: Omit<Toast, 'id'>) => {
  const newToast = { ...toast, id: `toast-${++toastId}` }
  toastListeners.forEach(listener => listener(newToast))
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const addToastHandler = (toast: Toast) => {
      setToasts(prev => [...prev, toast])

      // Auto remove after duration
      const duration = toast.duration || 5000
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, duration)
    }

    toastListeners.push(addToastHandler)

    return () => {
      const index = toastListeners.indexOf(addToastHandler)
      if (index > -1) {
        toastListeners.splice(index, 1)
      }
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[9999] space-y-2 max-w-sm w-full">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              layout
            >
              <GlassCard variant="dark" className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {toastIcons[toast.type]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground">
                      {toast.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {toast.message}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                   
                    className="p-1 h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => removeToast(toast.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
