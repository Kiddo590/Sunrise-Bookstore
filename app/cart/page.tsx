'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/CartProvider'
import BookCover from '@/components/BookCover'
import FormatBadge from '@/components/FormatBadge'
import { money } from '@/lib/format'
import type { Book } from '@/types'

export default function CartPage() {
  const { cart, removeItem, total } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5"
          style={{ background: 'linear-gradient(135deg, rgba(246,139,30,0.15), rgba(246,139,30,0.05))' }}
        >
          🛒
        </div>
        <p className="font-display font-bold text-ink text-2xl mb-2">Your cart is empty</p>
        <p className="text-muted text-sm mb-8 max-w-xs">Browse our collection and add some books to get started.</p>
        <Link
          href="/shop"
          className="inline-block text-white font-bold px-8 py-3 rounded-full transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f68b1e, #d97b18)' }}
        >
          Browse books →
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-paper2 min-h-screen">
      {/* Header */}
      <div className="py-5 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, #1b1c2b 0%, #2d1f3d 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="font-bold text-white text-xl sm:text-2xl">Your Cart</h1>
          <p className="text-white/50 text-sm mt-1">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Items */}
          <div className="flex flex-col gap-3">
            {cart.map(item => (
              <div
                key={item.uid}
                className="flex gap-4 bg-white border border-line rounded-xl p-4 items-start hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden shadow-sm">
                  {item.kind === 'other' ? (
                    item.coverUrl ? (
                      <div className="relative w-full h-full bg-paper2">
                        <Image src={item.coverUrl} alt={item.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-paper2 flex items-center justify-center text-2xl">🛍️</div>
                    )
                  ) : (
                    <BookCover
                      book={{
                        id: item.bookId ?? '',
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
                        is_top_seller: false,
                        in_stock: true,
                        created_at: '',
                      } as Book}
                      height={80}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm leading-tight mb-1.5 line-clamp-2">{item.title}</p>
                  {item.format ? <FormatBadge format={item.format} /> : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border bg-paper2 text-muted border-line">
                      🛍️ Add-on
                    </span>
                  )}
                  <p className="font-bold mt-2 text-base" style={{ color: '#f68b1e' }}>{money(item.price)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.uid)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:bg-red-50 hover:text-red-500 transition-colors text-lg shrink-0"
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white border border-line rounded-xl overflow-hidden h-fit sticky top-20 shadow-sm">
            <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #1b1c2b 0%, #2d1f3d 100%)' }}>
              <h2 className="font-bold text-white text-base">Order Summary</h2>
            </div>
            <div className="p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                <span className="text-rust font-medium">{money(total)}</span>
              </div>
              <div className="flex justify-between text-sm mb-5">
                <span className="text-muted">Delivery</span>
                <span className="text-ink font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t border-line pt-4 mb-5 flex justify-between items-baseline">
                <span className="font-bold text-ink">Total</span>
                <span className="font-display font-bold text-2xl" style={{ color: '#f68b1e' }}>{money(total)}</span>
              </div>
              <Link
                href="/checkout"
                className="block w-full text-white font-bold text-center py-3 rounded-full transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #f68b1e, #d97b18)' }}
              >
                Proceed to Checkout →
              </Link>
              <Link
                href="/shop"
                className="block w-full text-center text-muted text-sm mt-3 hover:text-ink transition-colors"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
