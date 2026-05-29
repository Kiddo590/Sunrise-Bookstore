import Link from 'next/link'
import type { Book } from '@/types'
import BookCover from './BookCover'
import { money } from '@/lib/format'

type Props = { book: Book }

function mockStock(id: string) {
  const code = id.charCodeAt(0) || 65
  return ((code * 7) % 40) + 5   // 5–44 items left
}

const discounts = [15, 20, 25, 30, 10, 18, 22, 12]

function mockDiscount(id: string) {
  const code = id.charCodeAt(0) || 65
  return discounts[code % discounts.length]
}

export default function FlashCard({ book }: Props) {
  const price = book.price_hard ?? book.price_ebook ?? 0
  const stock = mockStock(book.id)
  const maxStock = 50
  const stockPct = Math.round((stock / maxStock) * 100)
  const discount = mockDiscount(book.id)

  return (
    <Link href={`/book/${book.id}`} className="shrink-0 w-36 sm:w-40 bg-white rounded-sm overflow-hidden block hover:shadow-md transition-shadow">
      {/* Cover */}
      <div className="relative">
        <BookCover book={book} height={144} />
        {/* Discount badge */}
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
        <p className="font-bold text-sm mb-1.5" style={{ color: '#f68b1e' }}>
          {money(price)}
        </p>

        {/* Stock indicator */}
        <p className="text-[10px] text-muted mb-1">{stock} items left</p>
        <div className="w-full bg-line rounded-full overflow-hidden" style={{ height: 5 }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${stockPct}%`,
              backgroundColor: stockPct < 20 ? '#e31837' : '#f68b1e',
            }}
          />
        </div>
      </div>
    </Link>
  )
}
