'use client'

import React from 'react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#2c2d24] to-[#1e1f1a]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-screen bg-[#272822]/95 backdrop-blur-xl border-r border-white/10">
          <div className="p-6">
            <h1 className="text-xl font-bold text-[#F8EFD6]">ECE Admin</h1>
            <p className="text-xs text-[#75715E]">Platform Control</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              <a href="/admin" className="block p-3 rounded-lg bg-gradient-to-r from-[#F92672] to-[#66D9EF] text-white">
                Dashboard
              </a>
              <a href="/admin/advanced" className="block p-3 rounded-lg text-[#F8EFD6] hover:bg-white/10">
                Advanced Features
              </a>
              <a href="/admin/users" className="block p-3 rounded-lg text-[#F8EFD6] hover:bg-white/10">
                User Management
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export { AdminLayout as AdminLayoutSimple }
