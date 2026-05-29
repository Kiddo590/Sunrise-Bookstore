import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBookById, getApprovedReviewsForBook } from '@/lib/db'
import type { Review } from '@/types'
import BookCover from '@/components/BookCover'
import ReviewCard from '@/components/ReviewCard'
import StarRating from '@/components/StarRating'
import SectionHeading from '@/components/SectionHeading'
import FormatSelector from './FormatSelector'
import ReviewFormClient from './ReviewFormClient'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const book = await getBookById(id)
  if (!book) return { title: 'Book not found — Sunrise Bookstore' }
  return {
    title: `${book.title} by ${book.author} — Sunrise Bookstore`,
    description: book.description ?? undefined,
  }
}

export default async function BookPage({ params }: Props) {
  const { id } = await params

  const [book, reviews] = await Promise.all([
    getBookById(id),
    getApprovedReviewsForBook(id),
  ])

  if (!book) notFound()

  const avgRating =
    reviews.length > 0
      ? Math.round(reviews.reduce((sum, r: Review) => sum + r.rating, 0) / reviews.length)
      : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-rust transition-colors">Home</Link>
        <span className="text-line">/</span>
        <Link href="/shop" className="hover:text-rust transition-colors">Shop</Link>
        <span className="text-line">/</span>
        <span className="text-ink font-medium truncate max-w-[200px]">{book.title}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 mb-16">

        {/* Cover with 3D shadow effect */}
        <div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              boxShadow: '8px 12px 40px rgba(37,28,20,0.2), 2px 4px 12px rgba(37,28,20,0.12)',
              transform: 'perspective(600px) rotateY(-2deg)',
            }}
          >
            <BookCover book={book} height={420} />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {book.category && (
            <Link
              href={`/shop?category=${encodeURIComponent(book.category)}`}
              className="text-rust text-xs font-bold uppercase tracking-widest hover:underline w-fit"
            >
              {book.category}
            </Link>
          )}
          <h1 className="font-display font-bold text-ink text-4xl leading-tight">{book.title}</h1>
          <p className="text-muted text-lg">{book.author}</p>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} />
              <span className="text-muted text-sm">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}

          {book.description && (
            <p className="text-ink leading-relaxed max-w-prose">{book.description}</p>
          )}

          <div
            className="rounded-xl p-4 border border-line"
            style={{ background: 'rgba(192,92,32,0.04)' }}
          >
            <FormatSelector book={book} />
          </div>

          <div className="flex items-center gap-2 text-muted text-sm">
            <span>📦</span>
            <span>Delivered across Nairobi &amp; Kiambu. Cash on delivery.</span>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <section>
        <div
          className="h-px mb-10"
          style={{ background: 'linear-gradient(to right, #c05c20, rgba(192,92,32,0.1), transparent)' }}
        />
        <SectionHeading
          title={`Reader reviews${reviews.length > 0 ? ` (${reviews.length})` : ''}`}
          eyebrow="What readers say"
        />

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {reviews.map(r => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        ) : (
          <p className="text-muted mb-8">Be the first to review this book.</p>
        )}

        <ReviewFormClient bookId={id} />
      </section>
    </div>
  )
}
