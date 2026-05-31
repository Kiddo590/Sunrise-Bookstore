'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, ShoppingCart, UserCircle } from 'lucide-react'
import { useCart } from './CartProvider'
import { waHelpLink } from '@/lib/whatsapp'

const items = [
  { href: '/',        label: 'Home',    icon: Home },
  { href: null,       label: 'Help',    icon: MessageCircle, isWA: true },
  { href: '/cart',    label: 'Cart',    icon: ShoppingCart,  isCart: true },
  { href: '/account', label: 'Account', icon: UserCircle },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { count } = useCart()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-line">
      <div className="grid grid-cols-4 h-14">
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
                <item.icon size={22} />
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
      </div>
    </nav>
  )
}
