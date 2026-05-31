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
    <Link href={`/book/${book.id}`} className="shrink-0 w-36 sm:w-40 bg-white rounded-sm overflow-hidden block hover:shadow-md transition-shadow">
      {/* Cover */}
      <div className="relative">
        <BookCover book={book} height={144} />
        <span
          className="absolute top-1.5 right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
          style={{ backgroundColor: 'rgba(255,243,220,0.95)', color: '#c05000' }}
        >
          -{discount}%
        </span>
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-[11px] text-ink font-medium leading-snug line-clamp-2 mb-1 min-h-[2.2em]">
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
