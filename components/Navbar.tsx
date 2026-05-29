'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useCart } from './CartProvider'

const links = [
  { href: '/', label: 'Home', short: 'Home' },
  { href: '/shop', label: 'Shop', short: 'Shop' },
  { href: '/blog', label: 'Blog', short: 'Blog' },
  { href: '/reviews', label: 'Reviews', short: 'Reviews' },
  { href: '/request', label: 'Request a Book', short: 'Request' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { count } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const prevCount = useRef(count)
  const [cartBounce, setCartBounce] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (count !== prevCount.current) {
      prevCount.current = count
      setCartBounce(true)
      const t = setTimeout(() => setCartBounce(false), 400)
      return () => clearTimeout(t)
    }
  }, [count])

  return (
    <nav
      className="sticky top-0 z-40 transition-shadow duration-300"
      style={{
        backgroundColor: 'rgba(245,237,224,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: scrolled
          ? '0 2px 20px rgba(37,28,20,0.12)'
          : '0 1px 0 rgba(37,28,20,0.08)',
      }}
    >
      {/* ── Top bar: Logo + Cart ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group min-w-0">
          <div
            className="w-8 h-8 shrink-0 rounded-xl bg-rust flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ boxShadow: '0 2px 8px rgba(192,92,32,0.35)' }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="7" height="16" rx="1.5" fill="white"/>
              <rect x="9.5" y="4" width="5.5" height="13" rx="1.5" fill="rgba(255,255,255,0.75)"/>
              <rect x="16" y="3" width="4" height="14" rx="1" fill="rgba(255,255,255,0.45)"/>
            </svg>
          </div>
          <div className="min-w-0 leading-none">
            <p className="font-display font-bold text-ink text-sm sm:text-[15px] truncate">
              Sunrise Bookstore
            </p>
            <p className="hidden sm:block text-muted text-[10px] tracking-wide mt-0.5">
              Bookshop · Nairobi
            </p>
          </div>
        </Link>

        <Link
          href="/cart"
          className="relative shrink-0 p-2.5 rounded-xl hover:bg-paper2 transition-colors"
          aria-label="Cart"
        >
          <ShoppingCart size={20} className="text-ink" />
          {count > 0 && (
            <span
              key={count}
              className={`absolute -top-0.5 -right-0.5 bg-rust text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none ${
                cartBounce ? 'animate-badge-pop' : ''
              }`}
            >
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Link>
      </div>

      {/* ── Nav links strip ── */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(221,208,188,0.6)', backgroundColor: 'rgba(236,226,208,0.4)' }}
      >
        {/* Scroll-mask wrapper */}
        <div className="relative">
          {/* Right fade — hints that the strip scrolls */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10"
            style={{ background: 'linear-gradient(to left, rgba(245,237,224,0.9), transparent)' }}
          />

          <div className="flex overflow-x-auto scrollbar-hide px-3 sm:px-6 gap-1 py-1.5">
            {links.map(l => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`shrink-0 whitespace-nowrap font-medium transition-all duration-200 rounded-full ${
                    active
                      ? 'bg-rust text-white text-xs sm:text-sm px-4 py-2'
                      : 'text-ink text-xs sm:text-sm px-3.5 py-2 hover:bg-rust/8 hover:text-rust'
                  }`}
                  style={active ? { boxShadow: '0 2px 8px rgba(192,92,32,0.3)' } : {}}
                >
                  {/* Short label on mobile, full label on sm+ */}
                  <span className="sm:hidden">{l.short}</span>
                  <span className="hidden sm:inline">{l.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
