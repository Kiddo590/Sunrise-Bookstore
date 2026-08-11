'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, ShoppingCart, UserCircle, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from './CartProvider'
import { waHelpLink } from '@/lib/whatsapp'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

const items = [
  { href: '/',        label: 'Home',    icon: Home },
  { href: null,       label: 'Help',    icon: MessageCircle, isWA: true },
  { href: '/cart',    label: 'Cart',    icon: ShoppingCart,  isCart: true },
  { href: '/account', label: 'Account', icon: UserCircle },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { count } = useCart()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!ADMIN_EMAIL) return
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(session?.user?.email === ADMIN_EMAIL)
    })
    return () => subscription.unsubscribe()
  }, [])

  const cols = isAdmin ? 'grid-cols-5' : 'grid-cols-4'

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-line">
      <div className={`grid ${cols} h-14`}>
        {items.map(item => {
          if (item.isWA) {
            return (
              <a
                key="wa"
                href={waHelpLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-0.5 text-muted"
              >
                <item.icon size={22} style={{ color: '#25D366' }} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </a>
            )
          }

          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-rust' : 'text-muted'
              }`}
            >
              <div className="relative">
                <item.icon size={22} color="#1e7a4d" />
                {item.isCart && count > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
                    style={{ backgroundColor: '#f68b1e' }}
                  >
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              pathname.startsWith('/admin') ? 'text-rust' : 'text-muted'
            }`}
          >
            <LayoutDashboard size={22} color="#1e7a4d" />
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
