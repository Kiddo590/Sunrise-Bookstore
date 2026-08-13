import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  BarChart3,
  Sprout,
  Baby,
  Landmark,
  FlaskConical,
  Feather,
  Zap,
  Package,
  Heart,
  Church,
  User,
  Pill,
} from 'lucide-react'
import { getFeaturedBooks, getEbookBooks, getLatestBlogPosts, getOtherProducts, getTopSellingBooks } from '@/lib/db'
import BookCard from '@/components/BookCard'
import FlashCard from '@/components/FlashCard'
import BannerStrip from '@/components/BannerStrip'
import BookCover from '@/components/BookCover'
import Countdown from '@/components/Countdown'
import OtherProductCard from '@/components/OtherProductCard'
import Notepad from '@/components/Notepad'
import type { Book, BlogPost, OtherProduct } from '@/types'

export const metadata: Metadata = {
  title: 'The Flemela Bookstore — Good books. Great prices. Delivered across Nairobi.',
  description: 'Browse our collection of hardcopy and ebook titles at The Flemela Bookstore. Order via WhatsApp with cash on delivery anywhere in Nairobi.',
}

const categories = [
  { label: 'Fiction',   icon: BookOpen,     href: '/shop?category=Fiction' },
  { label: 'Business',  icon: BarChart3,    href: '/shop?category=Business' },
  { label: 'Self-Help', icon: Sprout,       href: '/shop?category=Self-Help' },
  { label: 'Children',  icon: Baby,         href: '/shop?category=Children' },
  { label: 'History',   icon: Landmark,     href: '/shop?category=History' },
  { label: 'Science',   icon: FlaskConical, href: '/shop?category=Science' },
  { label: 'Poetry',    icon: Feather,      href: '/shop?category=Poetry' },
  { label: 'Ebooks',    icon: Zap,          href: '/shop?format=ebook' },
  { label: 'Other',     icon: Package,      href: '/shop?category=Other' },
  { label: 'Romance',   icon: Heart,        href: '/shop?category=Romance' },
  { label: 'Religion',  icon: Church,       href: '/shop?category=Religion' },
  { label: 'Biography', icon: User,         href: '/shop?category=Biography' },
  { label: 'Health',    icon: Pill,         href: '/shop?category=Health' },
]

export default async function HomePage() {
  const [featuredBooks, ebookBooks, blogPosts, otherProducts, topSellingBooks] = await Promise.all([
    getFeaturedBooks(),
    getEbookBooks(),
    getLatestBlogPosts(3),
    getOtherProducts(),
    getTopSellingBooks(),
  ])

  return (
    <div className="bg-paper2">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">

        {/* ── Desktop: sidebar + main; Mobile: stacked ── */}
        <div className="lg:flex lg:gap-2 lg:items-start">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0 self-start mt-2 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="shine px-4 py-3" style={{ background: 'linear-gradient(135deg, #1b1c2b 0%, #2d1f3d 100%)' }}>
              <span className="text-white/50 text-[10px] font-black uppercase tracking-widest block mb-0.5">Browse</span>
              <span className="text-white text-sm font-bold">All Categories</span>
            </div>
            <nav className="py-1">
              {categories.map(cat => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-rust/10 hover:text-rust transition-colors group"
                >
                  <span className="w-5 flex items-center justify-center shrink-0">
                    <cat.icon size={16} color="#1e7a4d" />
                  </span>
                  <span className="flex-1 font-medium">{cat.label}</span>
                  <span className="text-muted text-xs group-hover:text-rust transition-colors">›</span>
                </Link>
              ))}
              <div className="border-t border-line mt-1 pt-1">
                <Link
                  href="/shop"
                  className="text-rust flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-rust/10 transition-colors"
                >
                  <span className="flex-1">See All Books</span>
                  <span>›</span>
                </Link>
                <Link
                  href="/request"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-rust/10 hover:text-rust transition-colors group"
                >
                  <span className="w-5 text-center text-base">🔍</span>
                  <span className="flex-1 font-medium">Request a Book</span>
                </Link>
              </div>
            </nav>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* 1. Category tiles — mobile/tablet only (sidebar handles desktop) */}
            <section className="mt-2 bg-white rounded lg:hidden">
              <div className="flex overflow-x-auto scrollbar-hide px-2 py-3 gap-1.5">
                {categories.slice(0, 9).map(cat => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="flex flex-col items-center gap-1 shrink-0 group"
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors bg-white shadow-card group-hover:bg-rust/10 border border-line group-hover:border-rust/30">
                      <cat.icon size={22} color="#1e7a4d" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-ink font-medium text-center w-14 leading-tight">
                      {cat.label}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 2. Banner */}
            <BannerStrip />

            {/* 3. Flash Sales */}
            {featuredBooks && featuredBooks.length > 0 && (
              <section className="mt-2">
                <div
                  className="shine flex items-center justify-between px-4 py-3 rounded-t"
                  style={{ background: 'linear-gradient(135deg, #e31837 0%, #b01020 100%)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white text-lg">⚡</span>
                    <span className="text-white font-bold text-base sm:text-lg">Flash Sales</span>
                    <span className="text-white/70 text-xs hidden sm:block font-medium ml-1">
                      TIME LEFT:
                    </span>
                    <span className="text-white font-bold text-xs">
                      <Countdown />
                    </span>
                  </div>
                  <Link href="/shop" className="text-white text-sm font-semibold hover:underline">
                    See All
                  </Link>
                </div>
                <div className="bg-white rounded-b-xl p-3 shadow-sm">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                    {(featuredBooks as Book[]).map(book => (
                      <FlashCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 5. Ebooks */}
            {ebookBooks && ebookBooks.length > 0 && (
              <section className="mt-2 bg-white rounded-xl overflow-hidden shadow-sm">
                <div
                  className="shine flex items-center justify-between px-4 py-3"
                  style={{ background: 'linear-gradient(135deg, #1b1c2b 0%, #2d1f3d 100%)' }}
                >
                  <h2 className="font-bold text-white text-base sm:text-lg">⚡ Instant Ebooks</h2>
                  <Link href="/shop?format=ebook" className="text-white/80 text-sm font-semibold hover:text-white transition-colors">
                    See All →
                  </Link>
                </div>
                <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(ebookBooks as Book[]).map(book => (
                    <Link key={book.id} href={`/book/${book.id}`} className="group">
                      <BookCard book={book} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Other Products */}
            {otherProducts && otherProducts.length > 0 && (
              <section className="mt-2 bg-white rounded-xl overflow-hidden shadow-sm">
                <div
                  className="shine flex items-center justify-between px-4 py-3"
                  style={{ background: 'linear-gradient(135deg, #0d6e4b 0%, #0a5238 100%)' }}
                >
                  <h2 className="font-bold text-white text-base sm:text-lg">🛍️ Other Products</h2>
                  <Link href="/others" className="text-white/80 text-sm font-semibold hover:text-white transition-colors">
                    See All →
                  </Link>
                </div>
                <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(otherProducts as OtherProduct[]).slice(0, 8).map(p => (
                    <OtherProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {/* 7. Blog */}
            {blogPosts && blogPosts.length > 0 && (
              <section className="mt-2 bg-white rounded-xl overflow-hidden shadow-sm mb-4">
                <div
                  className="shine flex items-center justify-between px-4 py-3"
                  style={{ background: 'linear-gradient(135deg, #1a2810 0%, #2d3a1a 100%)' }}
                >
                  <h2 className="font-bold text-white text-base sm:text-lg">📝 Reading List</h2>
                  <Link href="/blog" className="text-white/80 text-sm font-semibold hover:text-white transition-colors">
                    All Posts →
                  </Link>
                </div>
                <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(blogPosts as BlogPost[]).map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                      <div className="rounded-lg overflow-hidden border border-line hover:border-rust/30 transition-colors hover:shadow-md">
                        {post.cover_url ? (
                          <div className="relative h-32 overflow-hidden">
                            <Image
                              src={post.cover_url}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="h-32" style={{ background: 'linear-gradient(135deg, #1b1c2b, #2d2040)' }} />
                        )}
                        <div className="p-3">
                          <p className="text-muted text-[11px] mb-1">
                            {new Date(post.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <h3 className="font-semibold text-ink text-sm leading-snug line-clamp-2">{post.title}</h3>
                          <p className="text-xs font-semibold mt-2 group-hover:underline" style={{ color: '#f68b1e' }}>
                            Read more →
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>{/* end main */}

          {/* ── Right column: Top Selling + Notepad ── */}
          <div className="hidden lg:flex lg:flex-col lg:gap-2 w-56 shrink-0 self-start mt-2">
            {topSellingBooks && topSellingBooks.length > 0 && (
              <aside className="rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="shine px-4 py-3" style={{ background: 'linear-gradient(135deg, #1b1c2b 0%, #2d1f3d 100%)' }}>
                  <span className="text-white/50 text-[10px] font-black uppercase tracking-widest block mb-0.5">Trending</span>
                  <span className="text-white text-sm font-bold">Top Selling</span>
                </div>
                <nav className="py-1">
                  {(topSellingBooks as Book[]).map(book => (
                    <Link
                      key={book.id}
                      href={`/book/${book.id}`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-rust/10 hover:text-rust transition-colors group"
                    >
                      <div className="w-9 h-9 rounded overflow-hidden shrink-0 border border-line">
                        <BookCover book={book} height={36} />
                      </div>
                      <span className="flex-1 font-medium line-clamp-1">{book.title}</span>
                      <span className="text-muted text-xs group-hover:text-rust transition-colors">›</span>
                    </Link>
                  ))}
                </nav>
              </aside>
            )}

            <Notepad />
          </div>
        </div>{/* end flex */}
      </div>{/* end container */}
    </div>
  )
}
