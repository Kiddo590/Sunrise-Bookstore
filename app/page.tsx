import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { waHelpLink } from '@/lib/whatsapp'
import { money } from '@/lib/format'
import { getFeaturedBooks, getEbookBooks, getLatestBlogPosts, getLatestEbook } from '@/lib/db'
import BookCard from '@/components/BookCard'
import BookCover from '@/components/BookCover'
import FormatBadge from '@/components/FormatBadge'
import DealOfTheDay from '@/components/DealOfTheDay'
import AdBanner from '@/components/AdBanner'
import QuoteBlock from '@/components/QuoteBlock'
import SectionHeading from '@/components/SectionHeading'
import type { Book, BlogPost } from '@/types'

export const metadata: Metadata = {
  title: 'Sunrise Bookstore — Good books. Great prices. Delivered across Nairobi.',
  description: 'Browse our collection of hardcopy and ebook titles. Order via WhatsApp with cash on delivery anywhere in Nairobi.',
}

export default async function HomePage() {
  const [featuredBooks, ebookBooks, blogPosts, featuredEbook] = await Promise.all([
    getFeaturedBooks(),
    getEbookBooks(),
    getLatestBlogPosts(3),
    getLatestEbook(),
  ])

  return (
    <div>
      {/* Announcement bar with shimmer */}
      <div className="shimmer-bar relative bg-grove text-paper text-sm py-2.5 text-center px-4 font-medium">
        🚚 Free delivery within Nairobi CBD on orders over KSh 2,000 &nbsp;·&nbsp; Order via WhatsApp
      </div>

      {/* Hero section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(245,237,224,0) 0%, rgba(245,237,224,1) 60%)',
        }}
      >
        {/* Ambient decorative background circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute rounded-full"
            style={{
              width: 500,
              height: 500,
              top: -100,
              right: -120,
              background: 'radial-gradient(circle, rgba(192,92,32,0.08) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 340,
              height: 340,
              bottom: -60,
              left: -80,
              background: 'radial-gradient(circle, rgba(30,58,43,0.08) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Hero text */}
            <div>
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-1.5 bg-rust/10 text-rust text-xs font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-5">
                  ✦ New arrivals this week
                </span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-ink leading-[1.08] mb-5 animate-fade-up-1">
                Find your next{' '}
                <em className="text-rust not-italic relative">
                  great read.
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                    style={{ background: 'linear-gradient(to right, #c05c20, rgba(192,92,32,0))' }}
                  />
                </em>
              </h1>
              <p className="text-muted text-lg mb-8 leading-relaxed max-w-md animate-fade-up-2">
                Good books. Great prices. Delivered across Nairobi. Browse our collection and order directly via WhatsApp.
              </p>
              <div className="flex gap-3 flex-wrap animate-fade-up-3">
                <Link
                  href="/shop"
                  className="bg-rust text-white font-semibold px-7 py-3.5 rounded-full hover:bg-rust-d transition-colors text-sm"
                  style={{ boxShadow: '0 4px 16px rgba(192,92,32,0.35)' }}
                >
                  Browse the Shop →
                </Link>
                <a
                  href={waHelpLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity text-sm"
                  style={{ backgroundColor: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
                >
                  💬 Help me order
                </a>
              </div>
            </div>

            {/* Featured ebook highlight */}
            {featuredEbook && (
              <div
                className="relative bg-paper2 border border-line rounded-2xl overflow-hidden animate-fade-up-2"
                style={{ boxShadow: '0 8px 40px rgba(37,28,20,0.12)' }}
              >
                <span className="absolute top-3 right-3 z-10 bg-grove text-paper text-xs font-bold px-3 py-1 rounded-full">
                  ⚡ Instant download
                </span>
                <BookCover book={featuredEbook} height={240} />
                <div className="p-5">
                  <FormatBadge format="ebook" />
                  <h2 className="font-display font-bold text-ink text-xl mt-2 mb-1 leading-tight">
                    {featuredEbook.title}
                  </h2>
                  <p className="text-muted text-sm mb-3 line-clamp-2">
                    {featuredEbook.description?.slice(0, 100)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-rust font-display font-bold text-xl">
                      {money(featuredEbook.price_ebook!)}
                    </span>
                    <Link
                      href={`/book/${featuredEbook.id}`}
                      className="bg-rust text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-rust-d transition-colors"
                    >
                      Get the Ebook
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Deal of the Day */}
        <section className="mb-14">
          <DealOfTheDay />
        </section>

        {/* Ad banner */}
        <section className="mb-14 max-w-2xl mx-auto">
          <AdBanner />
        </section>

        {/* Featured books */}
        <section className="mb-14">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured books"
            action={{ label: 'See all', href: '/shop' }}
          />
          {featuredBooks && featuredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {(featuredBooks as Book[]).map(book => (
                <Link key={book.id} href={`/book/${book.id}`} className="group">
                  <BookCard book={book} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted">No featured books yet. Check back soon!</p>
          )}
        </section>

        {/* Ebook spotlight */}
        {ebookBooks && ebookBooks.length > 0 && (
          <section className="mb-14">
            <SectionHeading
              eyebrow="Instant download"
              title="Available as Ebooks"
            />
            {/* Gradient mask on scroll edges */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #f5ede0, transparent)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #f5ede0, transparent)' }} />
              <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
                {(ebookBooks as Book[]).map(book => (
                  <Link key={book.id} href={`/book/${book.id}`} className="shrink-0 w-40 group">
                    <BookCard book={book} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quote block */}
        <QuoteBlock />

        {/* Latest blog posts */}
        {blogPosts && blogPosts.length > 0 && (
          <section className="mb-14 mt-4">
            <SectionHeading
              eyebrow="Reading list"
              title="From the blog"
              action={{ label: 'All posts', href: '/blog' }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(blogPosts as BlogPost[]).map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div
                    className="rounded-2xl bg-paper2 border border-line overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {post.cover_url ? (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.cover_url}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-grove relative overflow-hidden">
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 16px)' }}
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-muted text-xs mb-2">
                        {new Date(post.created_at).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <h3 className="font-display font-semibold text-ink leading-snug mb-2 text-base">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-muted text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      )}
                      <p className="text-rust text-sm font-semibold mt-4 group-hover:underline">
                        Read →
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
