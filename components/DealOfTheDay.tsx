import Link from 'next/link'
import { getDealBook } from '@/lib/db'
import BookCover from './BookCover'
import { money } from '@/lib/format'
import Countdown from './Countdown'

export default async function DealOfTheDay() {
  const book = await getDealBook()

  if (!book) return null

  const price = book.price_hard ?? book.price_ebook ?? 0
  const original = price + 500

  return (
    <div className="relative bg-grove text-paper rounded-2xl overflow-hidden">
      {/* Diagonal stripe texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 16px)',
        }}
      />

      {/* Watermark "DEAL" behind content */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display font-bold text-white leading-none"
          style={{ fontSize: '11rem', opacity: 0.04, letterSpacing: '-0.02em' }}
        >
          DEAL
        </span>
      </div>

      <div className="relative flex flex-col sm:flex-row">
        {/* Cover */}
        <div className="sm:w-52 shrink-0 rounded-tl-2xl rounded-bl-2xl overflow-hidden"
          style={{ boxShadow: '4px 0 20px rgba(0,0,0,0.3)' }}>
          <BookCover book={book} height={280} />
        </div>

        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-4">
          {/* Badge row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="animate-pulse-soft bg-rust text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              ⏰ Deal of the Day
            </span>
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full">
              Save {money(500)}
            </span>
          </div>

          {/* Book info */}
          <div>
            <h2 className="font-display font-bold text-paper text-2xl sm:text-3xl leading-tight mb-1">
              {book.title}
            </h2>
            <p className="text-paper/60 text-sm">{book.author}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-paper/40 line-through text-base">{money(original)}</span>
            <span
              className="font-display font-bold text-4xl"
              style={{ color: '#f5ede0', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              {money(price)}
            </span>
          </div>

          <Countdown />

          <Link
            href={`/book/${book.id}`}
            className="inline-block bg-rust text-white font-semibold px-6 py-3 rounded-full hover:bg-rust-d transition-colors text-sm w-fit"
            style={{ boxShadow: '0 4px 12px rgba(192,92,32,0.4)' }}
          >
            Grab the deal →
          </Link>
        </div>
      </div>
    </div>
  )
}
