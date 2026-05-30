import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedBooks, getEbookBooks, getLatestBlogPosts } from '@/lib/db'
import BookCard from '@/components/BookCard'
import FlashCard from '@/components/FlashCard'
import HeroBanner from '@/components/HeroBanner'
import Countdown from '@/components/Countdown'
import type { Book, BlogPost } from '@/types'

export const metadata: Metadata = {
  title: 'The Sunrise BookStore — Good books. Great prices. Delivered across Nairobi.',
  description: 'Browse our collection of hardcopy and ebook titles at The Sunrise BookStore. Order via WhatsApp with cash on delivery anywhere in Nairobi.',
}

const categories = [
  { label: 'Fiction',   emoji: '📖', href: '/shop?category=Fiction' },
  { label: 'Business',  emoji: '💼', href: '/shop?category=Business' },
  { label: 'Self-Help', emoji: '🌱', href: '/shop?category=Self-Help' },
  { label: 'Children',  emoji: '🎨', href: '/shop?category=Children' },
  { label: 'History',   emoji: '🏛️',  href: '/shop?category=History' },
  { label: 'Science',   emoji: '🔬', href: '/shop?category=Science' },
  { label: 'Poetry',    emoji: '✍️',  href: '/shop?category=Poetry' },
  { label: 'Ebooks',    emoji: '⚡', href: '/shop?format=ebook' },
  { label: 'Romance',   emoji: '💕', href: '/shop?category=Romance' },
  { label: 'Religion',  emoji: '✝️',  href: '/shop?category=Religion' },
  { label: 'Biography', emoji: '👤', href: '/shop?category=Biography' },
  { label: 'Health',    emoji: '💊', href: '/shop?category=Health' },
]

export default async function HomePage() {
  const [featuredBooks, ebookBooks, blogPosts] = await Promise.all([
    getFeaturedBooks(),
    getEbookBooks(),
    getLatestBlogPosts(3),
  ])

  return (
    <div className="bg-paper2">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">

        {/* ── Desktop: sidebar + main; Mobile: stacked ── */}
        <div className="lg:flex lg:gap-2 lg:items-start">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0 self-start mt-2 rounded overflow-hidden bg-white">
            <div className="px-4 py-2.5" style={{ backgroundColor: '#1b1c2b' }}>
              <span className="text-white text-xs font-bold uppercase tracking-wide">All Categories</span>
            </div>
            <nav className="py-1">
              {categories.map(cat => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-rust/10 hover:text-rust transition-colors group"
                >
                  <span className="w-5 text-center text-base">{cat.emoji}</span>
                  <span className="flex-1 font-medium">{cat.label}</span>
                  <span className="text-muted text-xs group-hover:text-rust transition-colors">›</span>
                </Link>
              ))}
              <div className="border-t border-line mt-1 pt-1">
                <Link
                  href="/shop"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-rust/10 transition-colors"
                  style={{ color: '#f68b1e' }}
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

            {/* 1. Hero banner */}
            <div className="mt-2">
              <HeroBanner />
            </div>

            {/* 2. Category tiles — mobile/tablet only (sidebar handles desktop) */}
            <section className="mt-2 bg-white rounded lg:hidden">
              <div className="flex overflow-x-auto scrollbar-hide px-3 py-4 gap-2">
                {categories.slice(0, 8).map(cat => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="flex flex-col items-center gap-1.5 shrink-0 group"
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-colors group-hover:bg-rust/10 border border-line group-hover:border-rust/30"
                      style={{ backgroundColor: '#f9f9f9' }}
                    >
                      {cat.emoji}
                    </div>
                    <span className="text-[10px] text-ink font-medium text-center w-16 leading-tight">
                      {cat.label}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 3. Flash Sales */}
            {featuredBooks && featuredBooks.length > 0 && (
              <section className="mt-2">
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-t"
                  style={{ backgroundColor: '#e31837' }}
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
                <div className="bg-white rounded-b p-3">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {(featuredBooks as Book[]).map(book => (
                      <FlashCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 4. Featured Books */}
            {featuredBooks && featuredBooks.length > 0 && (
              <section className="mt-2 bg-white rounded overflow-hidden">
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '3px solid #f68b1e' }}
                >
                  <h2 className="font-bold text-ink text-base sm:text-lg">⭐ Featured Books</h2>
                  <Link href="/shop" className="text-sm font-semibold hover:underline" style={{ color: '#f68b1e' }}>
                    See All →
                  </Link>
                </div>
                <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(featuredBooks as Book[]).map(book => (
                    <Link key={book.id} href={`/book/${book.id}`} className="group">
                      <BookCard book={book} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Ebooks */}
            {ebookBooks && ebookBooks.length > 0 && (
              <section className="mt-2 bg-white rounded overflow-hidden">
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '3px solid #f68b1e' }}
                >
                  <h2 className="font-bold text-ink text-base sm:text-lg">⚡ Instant Ebooks</h2>
                  <Link href="/shop?format=ebook" className="text-sm font-semibold hover:underline" style={{ color: '#f68b1e' }}>
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

            {/* 6. Blog */}
            {blogPosts && blogPosts.length > 0 && (
              <section className="mt-2 bg-white rounded overflow-hidden mb-4">
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '3px solid #f68b1e' }}
                >
                  <h2 className="font-bold text-ink text-base sm:text-lg">📝 Reading List</h2>
                  <Link href="/blog" className="text-sm font-semibold hover:underline" style={{ color: '#f68b1e' }}>
                    All Posts →
                  </Link>
                </div>
                <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(blogPosts as BlogPost[]).map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                      <div className="rounded overflow-hidden border border-line hover:border-rust/30 transition-colors">
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
        </div>{/* end flex */}
      </div>{/* end container */}
    </div>
  )
}
