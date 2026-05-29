'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useCart } from '@/components/CartProvider'
import { money } from '@/lib/format'
import { waHelpLink } from '@/lib/whatsapp'
import type { Book } from '@/types'

export default function FormatSelector({ book }: { book: Book }) {
  const { addItem } = useCart()
  const defaultFormat = book.price_hard != null ? 'hardcopy' : 'ebook'
  const [format, setFormat] = useState<'hardcopy' | 'ebook'>(defaultFormat)

  const price = format === 'hardcopy' ? book.price_hard : book.price_ebook

  const handleAddToCart = () => {
    addItem(book, format)
    toast.success('Added to cart!')
  }

  const waMsg = `Hi! I'd like to order: ${book.title} (${format}) — ${price ? money(price) : ''}`

  return (
    <div className="flex flex-col gap-4">
      {/* Format toggle */}
      {book.price_hard != null && book.price_ebook != null && (
        <div className="flex gap-2">
          <button
            onClick={() => setFormat('hardcopy')}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              format === 'hardcopy'
                ? 'bg-rust text-white border-rust'
                : 'bg-paper2 text-ink border-line hover:border-rust'
            }`}
          >
            📕 Hardcopy — {money(book.price_hard)}
          </button>
          <button
            onClick={() => setFormat('ebook')}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              format === 'ebook'
                ? 'bg-rust text-white border-rust'
                : 'bg-paper2 text-ink border-line hover:border-rust'
            }`}
          >
            ⚡ Ebook — {money(book.price_ebook)}
          </button>
        </div>
      )}

      {/* Price */}
      {price != null && (
        <p className="font-display font-bold text-rust text-4xl">{money(price)}</p>
      )}

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleAddToCart}
          disabled={price == null}
          className="bg-rust text-white font-semibold px-6 py-3 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
        >
          Add to Cart
        </button>
        <a
          href={waHelpLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#25D366' }}
        >
          💬 Order on WhatsApp
        </a>
      </div>

      {/* Delivery note */}
      <p className="text-muted text-sm">
        {format === 'ebook'
          ? '⚡ Sent to your WhatsApp after order confirmation.'
          : '📕 Delivered across Nairobi & Kiambu. Cash on delivery.'}
      </p>
    </div>
  )
}
