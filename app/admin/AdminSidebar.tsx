'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, BookOpen, ShoppingCart, Star, Newspaper, Inbox, Package, Image, Megaphone, Zap, LogOut } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/books', label: 'Books', icon: BookOpen },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/flashsale', label: 'Flash Sale', icon: Zap },
  { href: '/admin/requests', label: 'Requests', icon: Inbox },
  { href: '/admin/others', label: 'Others', icon: Package },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-ink text-paper flex flex-col shrink-0">
      <div className="p-5 border-b border-paper/10">
        <p className="font-display font-bold text-sm">Sunrise Admin</p>
        <p className="text-paper/50 text-xs">Bookstore dashboard</p>
      </div>
      <nav className="flex-1 py-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
              pathname === href || (href !== '/admin' && pathname.startsWith(href))
                ? 'bg-rust text-white'
                : 'text-paper/70 hover:text-paper hover:bg-paper/5'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-paper/10">
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-paper/50 hover:text-paper text-sm transition-colors w-full"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
