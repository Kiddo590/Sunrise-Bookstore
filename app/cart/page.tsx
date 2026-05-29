'use client'

import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import BookCover from '@/components/BookCover'
import FormatBadge from '@/components/FormatBadge'
import { money } from '@/lib/format'
import type { Book } from '@/types'

export default function CartPage() {
  const { cart, removeItem, total } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="font-display text-ink text-2xl mb-4">Your cart is empty</p>
        <p className="text-muted mb-8">Browse our collection and add some books.</p>
        <Link
          href="/shop"
          className="bg-rust text-white font-semibold px-6 py-3 rounded-full hover:bg-rust-d transition-colors"
        >
          Browse books
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-ink text-3xl mb-8">Your cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Items */}
        <div className="flex flex-col gap-3">
          {cart.map(item => (
            <div
              key={item.uid}
              className="flex gap-4 bg-paper2 border border-line rounded-xl p-4 items-start"
            >
              <div className="w-16 shrink-0 rounded overflow-hidden">
                <BookCover
                  book={{
                    id: item.bookId,
                    title: item.title,
                    author: '',
                    cover_url: item.coverUrl ?? null,
                    cover_public_id: null,
                    category: null,
                    description: null,
                    price_hard: null,
                    price_ebook: null,
                    is_deal: false,
                    is_featured: false,
                    in_stock: true,
                    created_at: '',
                  } as Book}
                  height={80}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-sm leading-tight mb-1 line-clamp-2">{item.title}</p>
                <FormatBadge format={item.format} />
                <p className="text-rust font-semibold mt-1">{money(item.price)}</p>
              </div>
              <button
                onClick={() => removeItem(item.uid)}
                className="text-muted hover:text-ink transition-colors text-lg shrink-0"
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-paper2 border border-line rounded-xl p-6 h-fit sticky top-20">
          <h2 className="font-display font-semibold text-ink text-xl mb-4">Order summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">Subtotal</span>
            <span className="text-ink">{money(total)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-muted">Delivery</span>
            <span className="text-ink">Confirmed on WhatsApp</span>
          </div>
          <div className="border-t border-line pt-4 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-display font-bold text-rust text-2xl">{money(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-rust text-white font-semibold text-center py-3 rounded-full hover:bg-rust-d transition-colors"
          >
            Proceed to Checkout →
          </Link>
          <Link
            href="/shop"
            className="block w-full text-center text-muted text-sm mt-3 hover:text-ink transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
