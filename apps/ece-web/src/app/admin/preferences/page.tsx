'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminPreferences } from '@/components/admin/AdminPreferences'

export default function AdminPreferencesPage() {
  const handleSavePreferences = (preferences: any) => {
    console.log('Preferences saved:', preferences)
    // Here you could send to an API endpoint if needed
  }

  const handleResetPreferences = () => {
    console.log('Preferences reset to defaults')
  }

  return (
    <AdminLayout>
      <AdminPreferences 
        onSave={handleSavePreferences}
        onReset={handleResetPreferences}
      />
    </AdminLayout>
  )
}
