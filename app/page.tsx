import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { waHelpLink } from '@/lib/whatsapp'
import { money } from '@/lib/format'
import { getFeaturedBooks, getEbookBooks, getLatestBlogPosts } from '@/lib/db'
import BookCard from '@/components/BookCard'
import DealOfTheDay from '@/components/DealOfTheDay'
import type { Book, BlogPost } from '@/types'

export const metadata: Metadata = {
  title: 'Sunrise Bookstore — Good books. Great prices. Delivered across Nairobi.',
  description: 'Browse our collection of hardcopy and ebook titles. Order via WhatsApp with cash on delivery anywhere in Nairobi.',
}

const categories = [
  { label: 'Fiction', emoji: '📖', href: '/shop?category=Fiction' },
  { label: 'Business', emoji: '💼', href: '/shop?category=Business' },
  { label: 'Self-Help', emoji: '🌱', href: '/shop?category=Self-Help' },
  { label: 'Children', emoji: '🎨', href: '/shop?category=Children' },
  { label: 'History', emoji: '🏛️', href: '/shop?category=History' },
  { label: 'Science', emoji: '🔬', href: '/shop?category=Science' },
  { label: 'Poetry', emoji: '✍️', href: '/shop?category=Poetry' },
  { label: 'Ebooks', emoji: '⚡', href: '/shop?format=ebook' },
]

export default async function HomePage() {
  const [featuredBooks, ebookBooks, blogPosts] = await Promise.all([
    getFeaturedBooks(),
    getEbookBooks(),
    getLatestBlogPosts(3),
  ])

  return (
    <div className="bg-paper2">

      {/* ── Announcement bar ── */}
      <div
        className="shimmer-bar text-white text-xs sm:text-sm py-2 text-center px-4 font-medium"
        style={{ backgroundColor: '#1b1c2b' }}
      >
        🚚 Free delivery in Nairobi CBD on orders over KSh 2,000 &nbsp;·&nbsp;
        <a href={waHelpLink()} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline" style={{ color: '#f68b1e' }}>
          Order via WhatsApp
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">

        {/* ── Hero banner ── */}
        <section className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-3">
          {/* Main banner */}
          <div
            className="relative rounded overflow-hidden flex items-center"
            style={{
              minHeight: 220,
              background: 'linear-gradient(120deg, #1b1c2b 0%, #2d2040 60%, #1b1c2b 100%)',
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #f68b1e 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #f68b1e 0%, transparent 70%)', transform: 'translate(-20%, 30%)' }} />

            <div className="relative z-10 p-6 sm:p-10">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4"
                style={{ backgroundColor: '#f68b1e', color: 'white' }}
              >
                New Arrivals
              </span>
              <h1 className="font-display font-bold text-white text-3xl sm:text-5xl leading-tight mb-4">
                Your next great<br />
                <span style={{ color: '#f68b1e' }}>read awaits.</span>
              </h1>
              <p className="text-white/60 text-sm sm:text-base mb-6 max-w-sm">
                Hardcopy books delivered across Nairobi. Ebooks available instantly.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/shop"
                  className="text-white text-sm font-bold px-6 py-2.5 rounded transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#f68b1e' }}
                >
                  Shop Now →
                </Link>
                <a
                  href={waHelpLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm font-bold px-6 py-2.5 rounded border border-white/30 hover:bg-white/10 transition-colors"
                >
                  💬 WhatsApp Order
                </a>
              </div>
            </div>
          </div>

          {/* Side banners */}
          <div className="hidden md:flex flex-col gap-3">
            <div
              className="flex-1 rounded overflow-hidden flex items-center p-5"
              style={{ background: 'linear-gradient(135deg, #f68b1e 0%, #d97b18 100%)', minHeight: 100 }}
            >
              <div className="text-white">
                <p className="text-xs font-semibold opacity-80 uppercase tracking-widest mb-1">Instant Access</p>
                <p className="font-display font-bold text-xl leading-tight">Ebooks</p>
                <p className="text-xs opacity-80 mt-1">Download in seconds</p>
                <Link href="/shop?format=ebook" className="inline-block mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded font-semibold transition-colors">
                  Browse →
                </Link>
              </div>
              <div className="ml-auto text-5xl opacity-80">⚡</div>
            </div>
            <div
              className="flex-1 rounded overflow-hidden flex items-center p-5"
              style={{ background: 'linear-gradient(135deg, #1a3a2b 0%, #0d2018 100%)', minHeight: 100 }}
            >
              <div className="text-white">
                <p className="text-xs font-semibold opacity-80 uppercase tracking-widest mb-1">Kenyan Authors</p>
                <p className="font-display font-bold text-xl leading-tight">Local Voices</p>
                <p className="text-xs opacity-80 mt-1">Stories from Nairobi</p>
                <Link href="/shop" className="inline-block mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded font-semibold transition-colors">
                  Discover →
                </Link>
              </div>
              <div className="ml-auto text-5xl opacity-80">📚</div>
            </div>
          </div>
        </section>

        {/* ── Category icons ── */}
        <section className="mt-3 bg-white rounded p-4 sm:p-5">
          <h2 className="font-bold text-ink text-base sm:text-lg mb-4">Shop by Category</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-paper2 flex items-center justify-center text-xl sm:text-2xl group-hover:bg-rust/10 transition-colors border border-line group-hover:border-rust/30"
                >
                  {cat.emoji}
                </div>
                <span className="text-[10px] sm:text-xs text-ink text-center leading-tight font-medium">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Flash Deal / Deal of the Day ── */}
        <section className="mt-3">
          <DealOfTheDay />
        </section>

        {/* ── Featured books ── */}
        {featuredBooks && featuredBooks.length > 0 && (
          <section className="mt-3 bg-white rounded overflow-hidden">
            {/* Section header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '3px solid #f68b1e' }}
            >
              <h2 className="font-bold text-ink text-base sm:text-lg">
                ⭐ Featured Books
              </h2>
              <Link href="/shop" className="text-sm font-semibold hover:underline" style={{ color: '#f68b1e' }}>
                See All →
              </Link>
            </div>
            <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(featuredBooks as Book[]).map(book => (
                <Link key={book.id} href={`/book/${book.id}`} className="group">
                  <BookCard book={book} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Ebooks ── */}
        {ebookBooks && ebookBooks.length > 0 && (
          <section className="mt-3 bg-white rounded overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '3px solid #f68b1e' }}
            >
              <h2 className="font-bold text-ink text-base sm:text-lg">
                ⚡ Instant Ebooks
              </h2>
              <Link href="/shop?format=ebook" className="text-sm font-semibold hover:underline" style={{ color: '#f68b1e' }}>
                See All →
              </Link>
            </div>
            <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(ebookBooks as Book[]).map(book => (
                <Link key={book.id} href={`/book/${book.id}`} className="group">
                  <BookCard book={book} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Promo strip ── */}
        <section className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '🚚', title: 'Free Delivery', body: 'On orders over KSh 2,000 in Nairobi CBD' },
            { icon: '💬', title: 'WhatsApp Orders', body: 'Chat with us to place your order instantly' },
            { icon: '⚡', title: 'Instant Ebooks', body: 'Get your ebook link within minutes' },
          ].map(p => (
            <div key={p.title} className="bg-white rounded p-4 flex items-start gap-3">
              <span className="text-2xl shrink-0">{p.icon}</span>
              <div>
                <p className="font-bold text-ink text-sm">{p.title}</p>
                <p className="text-muted text-xs mt-0.5 leading-snug">{p.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Blog posts ── */}
        {blogPosts && blogPosts.length > 0 && (
          <section className="mt-3 bg-white rounded overflow-hidden mb-4">
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
                      <div className="relative h-36 overflow-hidden">
                        <Image
                          src={post.cover_url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-36" style={{ background: 'linear-gradient(135deg, #1b1c2b, #2d2040)' }} />
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

      </div>
    </div>
  )
}
