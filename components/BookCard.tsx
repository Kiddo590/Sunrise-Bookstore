'use client'

import type { Book } from '@/types'
import BookCover from './BookCover'
import FormatBadge from './FormatBadge'
import StarRating from './StarRating'
import { money } from '@/lib/format'

type Props = {
  book: Book
  onClick?: () => void
}

export default function BookCard({ book, onClick }: Props) {
  const price = book.price_hard ?? book.price_ebook ?? 0
  const initial = book.author.charAt(0).toUpperCase()

  return (
    <div
      onClick={onClick}
      className="group rounded-xl bg-paper2 border border-line cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
          'var(--shadow-lift), var(--shadow-glow-rust)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)'
      }}
    >
      {/* Cover with gradient fade into card body */}
      <div className="relative">
        <BookCover book={book} height={210} />
        {/* Gradient bleed from cover into card body */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-paper2 to-transparent pointer-events-none" />
      </div>

      <div className="p-3 flex flex-col gap-1.5">
        {/* Format badges */}
        <div className="flex gap-1 flex-wrap">
          {book.price_hard != null && <FormatBadge format="hardcopy" />}
          {book.price_ebook != null && <FormatBadge format="ebook" />}
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-ink text-sm leading-tight line-clamp-2 mt-0.5">
          {book.title}
        </h3>

        {/* Author with initial avatar */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 text-white"
            style={{ backgroundColor: '#7a6a57' }}
          >
            {initial}
          </span>
          <p className="text-muted text-xs truncate">{book.author}</p>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-1">
          <StarRating rating={0} />
          <span className="font-display font-bold text-rust text-base">{money(price)}</span>
        </div>
      </div>
    </div>
  )
}
