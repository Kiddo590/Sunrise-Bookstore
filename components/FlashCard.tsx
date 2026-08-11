import Link from 'next/link'
import type { Book } from '@/types'
import BookCover from './BookCover'
import { money } from '@/lib/format'

type Props = { book: Book }

export default function FlashCard({ book }: Props) {
  const originalPrice = book.price_hard ?? book.price_ebook ?? 0
  const discount = book.discount_pct ?? 10
  const salePrice = Math.round(originalPrice * (1 - discount / 100))

  return (
    <Link
      href={`/book/${book.id}`}
      className="shrink-0 w-36 sm:w-40 bg-white rounded-xl overflow-hidden block hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Cover */}
      <div className="relative">
        <BookCover book={book} height={152} />
        {/* Corner badge */}
        <div
          className="absolute top-0 right-0 w-11 h-11 flex items-center justify-center text-white font-black text-[11px] leading-tight text-center"
          style={{
            background: 'linear-gradient(135deg, #e31837 0%, #c01020 100%)',
            borderBottomLeftRadius: '0.75rem',
          }}
        >
          -{discount}%
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-[11px] text-ink font-semibold leading-snug line-clamp-2 mb-1.5 min-h-[2.2em]">
          {book.title}
        </p>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <p className="font-bold text-sm" style={{ color: '#f68b1e' }}>
            {money(salePrice)}
          </p>
          {originalPrice > 0 && (
            <p className="text-[10px] text-muted line-through">
              {money(originalPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
