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
    <div className="bg-white rounded overflow-hidden">
      {/* Flash sale header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '3px solid #f68b1e' }}
      >
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-ink text-base sm:text-lg">⚡ Deal of the Day</h2>
          <span
            className="animate-pulse-soft text-white text-xs font-bold px-2.5 py-1 rounded"
            style={{ backgroundColor: '#e31837' }}
          >
            LIMITED TIME
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted text-xs hidden sm:block">Ends in:</span>
          <Countdown />
        </div>
      </div>

      {/* Deal content */}
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Cover */}
        <div className="sm:w-44 shrink-0">
          <BookCover book={book} height={220} />
        </div>

        {/* Info */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center gap-3">
          <div>
            {book.category && (
              <span className="text-xs font-bold uppercase tracking-widest text-muted">{book.category}</span>
            )}
            <h3 className="font-bold text-ink text-xl sm:text-2xl leading-tight mt-1">{book.title}</h3>
            <p className="text-muted text-sm mt-0.5">{book.author}</p>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-bold text-3xl" style={{ color: '#f68b1e' }}>{money(price)}</span>
            <span className="text-muted line-through text-base">{money(original)}</span>
            <span
              className="text-white text-xs font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: '#e31837' }}
            >
              Save {money(500)}
            </span>
          </div>

          <p className="text-xs font-medium" style={{ color: '#3bb77e' }}>
            ✓ Free Delivery in Nairobi CBD
          </p>

          <Link
            href={`/book/${book.id}`}
            className="inline-block text-white font-bold text-sm px-6 py-3 rounded text-center w-fit transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#f68b1e' }}
          >
            Grab the Deal →
          </Link>
        </div>
      </div>
    </div>
  )
}
