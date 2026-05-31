'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, BookOpen, ShoppingCart, Star, Newspaper, Inbox, Package, Image, Megaphone, Zap, Layers, LogOut, X } from 'lucide-react'

const links = [
  { href: '/admin',              label: 'Dashboard',    icon: LayoutDashboard, group: 'Overview' },
  { href: '/admin/books',        label: 'Books',        icon: BookOpen,        group: 'Content' },
  { href: '/admin/orders',       label: 'Orders',       icon: ShoppingCart,    group: 'Content' },
  { href: '/admin/reviews',      label: 'Reviews',      icon: Star,            group: 'Content' },
  { href: '/admin/requests',     label: 'Requests',     icon: Inbox,           group: 'Content' },
  { href: '/admin/others',       label: 'Others',       icon: Package,         group: 'Content' },
  { href: '/admin/blog',         label: 'Blog',         icon: Newspaper,       group: 'Marketing' },
  { href: '/admin/flashsale',    label: 'Flash Sale',   icon: Zap,             group: 'Marketing' },
  { href: '/admin/hero-slides',  label: 'Hero Slides',  icon: Layers,          group: 'Marketing' },
  { href: '/admin/banners',      label: 'Banners',      icon: Image,           group: 'Marketing' },
  { href: '/admin/announcements',label: 'Announcements',icon: Megaphone,       group: 'Marketing' },
]

const groups = ['Overview', 'Content', 'Marketing']

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 h-screen sticky top-0 flex flex-col shrink-0 overflow-hidden" style={{ backgroundColor: '#12131f' }}>
      {/* Brand header */}
      <div className="px-5 py-4 shrink-0 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #f68b1e 0%, #c05000 100%)' }}>
        <div>
          <p className="font-display font-black text-white text-sm tracking-tight">Sunrise Admin</p>
          <p className="text-white/70 text-[11px] mt-0.5">Bookstore dashboard</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white lg:hidden p-1" aria-label="Close menu">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {groups.map(group => {
          const groupLinks = links.filter(l => l.group === group)
          return (
            <div key={group} className="mb-1">
              <p className="px-5 pt-3 pb-1 text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {group}
              </p>
              {groupLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'text-white'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }`}
                    style={active ? { background: 'linear-gradient(135deg, #f68b1e22, #f68b1e11)', borderLeft: '3px solid #f68b1e', paddingLeft: '9px' } : {}}
                  >
                    <Icon size={15} style={{ color: active ? '#f68b1e' : undefined }} />
                    {label}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
