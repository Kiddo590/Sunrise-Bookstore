'use client'

import type { Book } from '@/types'
import BookCover from './BookCover'
import { money } from '@/lib/format'

type Props = {
  book: Book
  onClick?: () => void
}

export default function BookCard({ book, onClick }: Props) {
  const hasBoth = book.price_hard != null && book.price_ebook != null
  const price = book.price_hard ?? book.price_ebook ?? 0
  const isEbookOnly = book.price_hard == null && book.price_ebook != null

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-line rounded-xl cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-paper2" style={{ aspectRatio: '3/4' }}>
        <BookCover book={book} height={220} />

        {isEbookOnly && (
          <span
            className="absolute top-2 left-2 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wide uppercase"
            style={{ background: 'linear-gradient(135deg, #f68b1e, #d97b18)' }}
          >
            Ebook
          </span>
        )}

        {!book.in_stock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-bold text-muted uppercase tracking-widest">Out of stock</span>
          </div>
        )}

        {/* Gradient hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end pointer-events-none">
          <div
            className="w-full py-2.5 text-white text-xs font-bold text-center"
            style={{ background: 'linear-gradient(0deg, rgba(246,139,30,0.95) 0%, rgba(246,139,30,0) 100%)' }}
          >
            View Book →
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-2 sm:p-3">
        {book.category && (
          <span className="text-[9px] font-black uppercase tracking-widest text-muted">{book.category}</span>
        )}
        <h3 className="text-xs sm:text-sm text-ink font-semibold leading-snug line-clamp-2 mt-0.5 min-h-[2.5em]">
          {book.title}
        </h3>
        <p className="text-[10px] text-muted truncate mt-0.5">{book.author}</p>
        {hasBoth ? (
          <div className="flex flex-col mt-1.5 leading-tight">
            <span className="font-bold text-sm sm:text-base" style={{ color: '#f68b1e' }}>
              Hardcopy: {money(book.price_hard!)}
            </span>
            <span className="font-bold text-sm sm:text-base" style={{ color: '#f68b1e' }}>
              eBook: {money(book.price_ebook!)}
            </span>
          </div>
        ) : (
          <p className="font-bold text-base sm:text-lg mt-1.5 leading-none" style={{ color: '#f68b1e' }}>
            {money(price)}
          </p>
        )}
        {book.price_hard && (
          <p className="text-[10px] font-medium mt-1" style={{ color: '#3bb77e' }}>
            ✓ Free Delivery in Nairobi
          </p>
        )}
      </div>
    </div>
  )
}
