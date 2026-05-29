'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useCart } from './CartProvider'

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/request', label: 'Request a Book' },
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
      className="sticky top-0 z-40 border-b border-line transition-shadow duration-300"
      style={{
        backgroundColor: 'rgba(245,237,224,0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: scrolled ? '0 2px 16px rgba(37,28,20,0.10)' : '0 1px 0 rgba(37,28,20,0.06)',
      }}
    >
      {/* Top bar: Logo + Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="w-8 h-8 rounded-xl bg-rust flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ boxShadow: '0 2px 8px rgba(192,92,32,0.35)' }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="7" height="16" rx="1.5" fill="white"/>
              <rect x="9.5" y="4" width="5.5" height="13" rx="1.5" fill="rgba(255,255,255,0.75)"/>
              <rect x="16" y="3" width="4" height="14" rx="1" fill="rgba(255,255,255,0.45)"/>
            </svg>
          </div>
          <span className="flex flex-col leading-none">
            <span className="font-display font-bold text-ink text-[15px]">Sunrise Bookstore</span>
            <span className="text-muted text-[10px] tracking-wide">Bookshop · Nairobi</span>
          </span>
        </Link>

        <Link href="/cart" className="relative p-2 rounded-lg hover:bg-paper2 transition-colors">
          <ShoppingCart size={20} className="text-ink" />
          {count > 0 && (
            <span
              key={count}
              className={`absolute -top-1 -right-1 bg-rust text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                cartBounce ? 'animate-badge-pop' : ''
              }`}
            >
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Link>
      </div>

      {/* Nav links strip — always visible on all screen sizes */}
      <div
        className="border-t border-line"
        style={{ borderColor: 'rgba(221,208,188,0.5)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-0.5 py-1 scrollbar-hide">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative shrink-0 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  active
                    ? 'text-rust bg-rust/8'
                    : 'text-ink hover:text-rust hover:bg-rust/5'
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[2.5px] bg-rust rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
