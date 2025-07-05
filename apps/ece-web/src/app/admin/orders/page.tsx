'use client'

import { AdminOrders } from '@/components/admin-orders'
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    )
  }

  return <AdminOrders isAdmin={isAdmin} />
}
