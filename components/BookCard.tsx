'use client'

import type { Book } from '@/types'
import BookCover from './BookCover'
import StarRating from './StarRating'
import { money } from '@/lib/format'

type Props = {
  book: Book
  onClick?: () => void
}

export default function BookCard({ book, onClick }: Props) {
  const price = book.price_hard ?? book.price_ebook ?? 0
  const hasBoth = book.price_hard != null && book.price_ebook != null
  const isEbookOnly = book.price_hard == null && book.price_ebook != null

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-line rounded cursor-pointer overflow-hidden transition-shadow duration-200 hover:shadow-lg"
    >
      {/* Product image area */}
      <div className="relative overflow-hidden bg-paper2" style={{ aspectRatio: '3/4' }}>
        <BookCover book={book} height={220} />

        {/* Discount / format badge — top left */}
        {hasBoth && (
          <span
            className="absolute top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
            style={{ backgroundColor: '#e31837' }}
          >
            -15% OFF
          </span>
        )}
        {isEbookOnly && (
          <span
            className="absolute top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
            style={{ backgroundColor: '#f68b1e' }}
          >
            EBOOK
          </span>
        )}

        {/* Quick-view overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-rust py-1.5 text-white text-xs font-semibold text-center translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          View Book
        </div>
      </div>

      {/* Product info */}
      <div className="p-2 sm:p-3">
        <h3 className="text-xs sm:text-sm text-ink font-medium leading-snug line-clamp-2 mb-1 min-h-[2.5em]">
          {book.title}
        </h3>
        <p className="text-[11px] text-muted mb-1.5 truncate">{book.author}</p>

        <div className="flex items-center gap-1 mb-1.5">
          <StarRating rating={4} />
          <span className="text-[10px] text-muted">(24)</span>
        </div>

        <p className="font-bold text-base sm:text-lg leading-none" style={{ color: '#f68b1e' }}>
          {money(price)}
        </p>

        {book.price_hard && (
          <p className="text-[10px] font-medium mt-1" style={{ color: '#3bb77e' }}>
            + Free Delivery in Nairobi
          </p>
        )}
      </div>
    </div>
  )
}
