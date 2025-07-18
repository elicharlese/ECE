'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AdminPanel } from '@/components/admin/AdminPanel'

export default function AdminDashboard() {
  return <AdminPanel />
}
