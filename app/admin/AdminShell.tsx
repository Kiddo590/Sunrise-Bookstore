'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-paper flex">

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, static on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <AdminSidebar onClose={() => setOpen(false)} />
      </div>

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <div
          className="shine lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-12 shrink-0"
          style={{ background: 'linear-gradient(135deg, #f68b1e 0%, #c05000 100%)' }}
        >
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="text-white p-1 -ml-1"
          >
            <Menu size={22} />
          </button>
          <span className="text-white font-bold text-sm tracking-tight">Flemela Admin</span>
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
