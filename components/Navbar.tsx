'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Search, LayoutDashboard, LogIn } from 'lucide-react'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useCart } from './CartProvider'
import AnnouncementBar from './AnnouncementBar'
import { createClient } from '@/lib/supabase/client'
import { waHelpLink } from '@/lib/whatsapp'

const navLinks = [
  { href: '/shop', label: '📚 All Books' },
  { href: '/shop?format=hardcopy', label: '📕 Hardcopy' },
  { href: '/shop?format=ebook', label: '⚡ eBooks' },
  { href: '/request', label: '🔎 Request a Book' },
  { href: '/others', label: '🛍️ Other Products' },
  { href: '/blog', label: '📝 Blog' },
  { href: waHelpLink(), label: '☎️ Contact Us', external: true },
]

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

type BookSuggestion = { id: string; title: string; author: string; cover_url: string | null }

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { count } = useCart()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const [spacerHeight, setSpacerHeight] = useState<number | null>(null)
  const lastScrollY = useRef(0)
  const prevCount = useRef(count)
  const [cartBounce, setCartBounce] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email
      setIsAdmin(!!ADMIN_EMAIL && email === ADMIN_EMAIL)
      if (session?.user) {
        const meta = session.user.user_metadata as { full_name?: string }
        const fallback = email ? email.split('@')[0] : null
        setUserName(meta.full_name?.trim().split(' ')[0] || fallback)
      } else {
        setUserName(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  useEffect(() => {
    let ticking = false
    const handler = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 4)
        const goingDown = y > lastScrollY.current
        if (goingDown && y > 140) {
          setCollapsed(true)
        } else if (!goingDown && y < 80) {
          setCollapsed(false)
        }
        lastScrollY.current = y
        ticking = false
      })
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Keeps the page-flow spacer (and dependent pages' sticky offsets) pinned to the
  // navbar's *collapsed* height, since the nav itself is `position: fixed` and no
  // longer pushes content around. The taller, announcement-bar-visible state is only
  // ever shown near the top of the page, where it's fine for it to briefly overlay
  // content instead of shoving it down — that overlay is what used to read as a jump/bounce.
  useLayoutEffect(() => {
    const el = navRef.current
    if (!el) return

    function applyMeasuredHeight() {
      const h = el!.offsetHeight
      setSpacerHeight(h)
      document.documentElement.style.setProperty('--nav-height', `${h}px`)
    }

    if (collapsed) {
      const t = setTimeout(applyMeasuredHeight, 320) // wait out the 300ms shrink transition
      return () => clearTimeout(t)
    }

    if (spacerHeight === null) {
      applyMeasuredHeight() // first paint fallback so content isn't hidden under the nav
    }
    // spacerHeight intentionally omitted: this only needs to re-run when `collapsed`
    // flips, and each run already sees the current spacerHeight via closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed])

  useEffect(() => {
    function onResize() {
      if (!collapsed || !navRef.current) return
      const h = navRef.current.offsetHeight
      setSpacerHeight(h)
      document.documentElement.style.setProperty('--nav-height', `${h}px`)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [collapsed])

  useEffect(() => {
    if (count !== prevCount.current) {
      prevCount.current = count
      setCartBounce(true)
      const t = setTimeout(() => setCartBounce(false), 400)
      return () => clearTimeout(t)
    }
  }, [count])

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    const q = query.trim()
    if (q.length < 3) {
      setSuggestions([])
      return
    }
    searchTimerRef.current = setTimeout(() => {
      fetch(`/api/books/search?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then((data: BookSuggestion[]) => {
          if (Array.isArray(data)) {
            setSuggestions(data)
            setShowSuggestions(data.length > 0)
          }
        })
        .catch(() => {})
    }, 250)
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current) }
  }, [query])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setShowSuggestions(false)
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`)
  }

  function goToSuggestion(id: string) {
    setShowSuggestions(false)
    router.push(`/book/${id}`)
  }

  return (
    <>
    <nav
      ref={navRef}
      className="fixed top-0 inset-x-0 z-40 transition-shadow duration-200 [overflow-anchor:none]"
      style={{ boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.18)' : 'none' }}
    >
      {/* ── Announcement bar ── */}
      <div
        className={`transition-[max-height,opacity] duration-300 overflow-hidden ${collapsed ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}
        style={{ backgroundColor: '#1e7a4d', padding: '4px' }}
      >
        <AnnouncementBar />
      </div>

      {/* ── Row 1: Header ── */}
      <div className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div
          className={`flex items-center gap-2 sm:gap-3 transition-[padding] duration-300 ${
            collapsed ? 'py-0.5' : 'py-0.5 sm:py-1'
          }`}
        >

          {/* Logo */}
          <Link href="/" className="shrink-0 transition-opacity duration-150 hover:opacity-90">
            <Image
              src="/logo.png"
              alt="The Flemela Bookstore"
              width={280}
              height={280}
              className={`w-auto object-contain transition-[height] duration-300 ${collapsed ? 'h-24' : 'h-36'}`}
              priority
            />
          </Link>

          {/* ── Search bar ── */}
          <div className="relative flex-1 min-w-0">
            <form onSubmit={handleSearch} className="flex min-w-0">
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                onBlur={() => { setTimeout(() => setShowSuggestions(false), 150) }}
                placeholder="Search books, authors, genres…"
                className="flex-1 h-9 sm:h-10 px-3 sm:px-4 text-sm text-ink bg-white border border-line rounded-l outline-none min-w-0"
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

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-lg overflow-hidden z-50">
                {suggestions.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onMouseDown={() => goToSuggestion(s.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-paper2 transition-colors border-b border-line last:border-0"
                  >
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-ink truncate">{s.title}</span>
                      <span className="block text-xs text-muted truncate">{s.author}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {userName ? (
              <span
                className="hidden sm:block font-display font-bold text-sm whitespace-nowrap px-1"
                style={{ color: '#1e7a4d' }}
              >
                {getGreeting()}, {userName}
              </span>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1 text-ink hover:text-rust transition-colors text-xs font-bold whitespace-nowrap px-1"
              >
                <LogIn size={15} color="#1e7a4d" />
                Login
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex flex-col items-center text-ink hover:text-rust transition-colors text-xs gap-0.5 px-1"
              >
                <LayoutDashboard size={24} color="#1e7a4d" />
                <span className="whitespace-nowrap">Admin</span>
              </Link>
            )}
            <Link
              href="/cart"
              className="relative flex flex-col items-center text-ink hover:text-rust transition-colors text-xs gap-0.5 px-2 py-1 rounded"
            >
              <div className="relative">
                <ShoppingCart size={22} color="#1e7a4d" />
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

        {/* ── Mobile-only greeting/login line ── */}
        <div className="sm:hidden pb-0.5 text-center">
          {userName ? (
            <span className="font-display font-bold text-sm" style={{ color: '#1e7a4d' }}>
              {getGreeting()}, {userName}
            </span>
          ) : (
            <Link href="/login" className="inline-flex items-center gap-1 text-ink hover:text-rust transition-colors text-xs font-bold">
              <LogIn size={15} color="#1e7a4d" />
              Login
            </Link>
          )}
        </div>

        {/* ── Nav links ── */}
        <div className="flex justify-start sm:justify-center gap-1 overflow-x-auto scrollbar-hide pb-1 sm:pb-1.5 [-webkit-overflow-scrolling:touch]">
          {navLinks.map(l => {
            const active = pathname === l.href
            const linkClass = 'shrink-0 whitespace-nowrap text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full text-white transition-opacity hover:opacity-85'
            const linkStyle = { backgroundColor: active ? '#145c39' : '#1e7a4d' }
            if (l.external) {
              return (
                <a key={l.href + l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass} style={linkStyle}>
                  {l.label}
                </a>
              )
            }
            return (
              <Link key={l.href + l.label} href={l.href} className={linkClass} style={linkStyle}>
                {l.label}
              </Link>
            )
          })}
        </div>
        </div>
      </div>
    </nav>
    <div aria-hidden style={{ height: spacerHeight ?? undefined }} />
    </>
  )
}
