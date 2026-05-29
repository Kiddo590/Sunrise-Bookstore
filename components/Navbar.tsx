'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Search, User, MapPin } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useCart } from './CartProvider'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'All Books' },
  { href: '/shop?format=hardcopy', label: 'Hardcopy' },
  { href: '/shop?format=ebook', label: 'Ebooks' },
  { href: '/blog', label: 'Blog' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/request', label: 'Request a Book' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { count } = useCart()
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const prevCount = useRef(count)
  const [cartBounce, setCartBounce] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4)
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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push('/shop')
  }

  return (
    <nav
      className="sticky top-0 z-40 transition-shadow duration-200"
      style={{ boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.18)' : 'none' }}
    >
      {/* ── Row 1: Dark header ── */}
      <div style={{ backgroundColor: '#1b1c2b' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center gap-3 sm:gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105"
              style={{ backgroundColor: '#f68b1e' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="1" y="2" width="7" height="16" rx="1.5" fill="white"/>
                <rect x="9.5" y="4" width="5.5" height="13" rx="1.5" fill="rgba(255,255,255,0.8)"/>
                <rect x="16" y="3" width="4" height="14" rx="1" fill="rgba(255,255,255,0.5)"/>
              </svg>
            </div>
            <span className="hidden sm:block font-bold text-white text-[15px] leading-tight">
              Sunrise<br />
              <span style={{ color: '#f68b1e' }} className="font-normal text-xs tracking-wide">Bookstore</span>
            </span>
          </Link>

          {/* ── Search bar ── */}
          <form onSubmit={handleSearch} className="flex-1 flex min-w-0">
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search books, authors, genres…"
              className="flex-1 h-9 sm:h-10 px-3 sm:px-4 text-sm text-ink bg-white outline-none rounded-l min-w-0"
            />
            <button
              type="submit"
              className="h-9 sm:h-10 px-4 sm:px-5 rounded-r font-semibold text-white text-sm flex items-center gap-1.5 shrink-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#f68b1e' }}
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Account + Cart */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Link
              href="/reviews"
              className="hidden md:flex flex-col items-center text-white hover:text-rust transition-colors text-xs gap-0.5 px-1"
            >
              <User size={18} />
              <span className="whitespace-nowrap">Account</span>
            </Link>
            <Link
              href="/cart"
              className="relative flex flex-col items-center text-white hover:text-rust transition-colors text-xs gap-0.5 px-2 py-1 rounded"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                {count > 0 && (
                  <span
                    key={count}
                    className={`absolute -top-1.5 -right-1.5 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none ${
                      cartBounce ? 'animate-badge-pop' : ''
                    }`}
                    style={{ backgroundColor: '#f68b1e' }}
                  >
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline whitespace-nowrap">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 2: Category strip ── */}
      <div className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex overflow-x-auto scrollbar-hide">
          {navLinks.map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={`shrink-0 whitespace-nowrap text-xs sm:text-sm font-medium px-3 sm:px-4 py-2.5 border-b-2 transition-colors ${
                  active
                    ? 'border-rust text-rust'
                    : 'border-transparent text-ink hover:text-rust hover:border-rust/40'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
