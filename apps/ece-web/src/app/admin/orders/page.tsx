'use client'

import { AdminOrders } from '@/components/admin-orders'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useState, useEffect } from 'react'

// Mock admin authentication - in production, this would check actual user roles
function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock admin check - in production, verify JWT token and role
    const checkAdminStatus = () => {
      // For demo purposes, always return true
      // In production: verify token, check user roles, etc.
      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAdminStatus()
  }, [])

  return { isAdmin, isLoading }
}

export default function AdminOrdersPage() {
  const { isAdmin, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-ocean-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking admin access...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminOrders isAdmin={isAdmin} />
    </AdminLayout>
  )
}
