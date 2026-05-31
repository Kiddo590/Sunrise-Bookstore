'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Search, LayoutDashboard } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useCart } from './CartProvider'
import AnnouncementBar from './AnnouncementBar'
import DarkModeToggle from './DarkModeToggle'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/shop', label: 'All Books' },
  { href: '/shop?format=hardcopy', label: 'Hardcopy' },
  { href: '/shop?format=ebook', label: 'Ebooks' },
  { href: '/others', label: '🛍️ Others' },
  { href: '/blog', label: 'Blog' },
  { href: '/request', label: 'Request a Book' },
]

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { count } = useCart()
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const prevCount = useRef(count)
  const [cartBounce, setCartBounce] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!ADMIN_EMAIL) return
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(session?.user?.email === ADMIN_EMAIL)
    })
    return () => subscription.unsubscribe()
  }, [])

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
          <Link href="/" className="shrink-0 group">
            <div className="bg-white rounded-lg px-2.5 py-1 transition-opacity duration-150 group-hover:opacity-90">
              <Image
                src="/logo.png"
                alt="The SunRise BookStore"
                width={120}
                height={55}
                className="h-9 w-auto object-contain"
                priority
              />
            </div>
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

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <DarkModeToggle />
            {isAdmin && (
              <Link
                href="/admin"
                className="flex flex-col items-center text-white hover:text-rust transition-colors text-xs gap-0.5 px-1"
              >
                <LayoutDashboard size={24} />
                <span className="whitespace-nowrap">Admin</span>
              </Link>
            )}
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

      {/* ── Announcement bar ── */}
      <AnnouncementBar />

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
