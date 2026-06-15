'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { MessageCircle, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { money } from '@/lib/format'
import { waHelpLink } from '@/lib/whatsapp'
import type { Book } from '@/types'

type Props = {
  book: Book
  showFormat?: boolean
  showWhatsApp?: boolean
  showNote?: boolean
  buttonClassName?: string
}

export default function FormatSelector({
  book,
  showFormat = true,
  showWhatsApp = true,
  showNote = true,
  buttonClassName = 'h-12',
}: Props) {
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
    <div className="flex flex-col gap-3">
      {showFormat && book.price_hard != null && book.price_ebook != null && (
        <div className="flex gap-2">
          <button
            onClick={() => setFormat('hardcopy')}
            className={`flex-1 px-3 py-2 rounded border text-xs font-semibold transition-colors ${
              format === 'hardcopy'
                ? 'bg-rust text-white border-rust'
                : 'bg-paper2 text-ink border-line hover:border-rust'
            }`}
          >
            📕 Hardcopy — {money(book.price_hard)}
          </button>
          <button
            onClick={() => setFormat('ebook')}
            className={`flex-1 px-3 py-2 rounded border text-xs font-semibold transition-colors ${
              format === 'ebook'
                ? 'bg-rust text-white border-rust'
                : 'bg-paper2 text-ink border-line hover:border-rust'
            }`}
          >
            ⚡ Ebook — {money(book.price_ebook)}
          </button>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={price == null}
        className={`w-full bg-rust text-white font-bold rounded shadow-sm hover:bg-rust-d transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm ${buttonClassName}`}
      >
        <ShoppingCart size={18} />
        Add to cart
      </button>

      {showWhatsApp && (
        <a
          href={waHelpLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-11 text-[#25D366] bg-white border border-[#25D366]/40 font-bold rounded hover:bg-[#25D366]/5 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <MessageCircle size={18} />
          Order on WhatsApp
        </a>
      )}

      {showNote && (
        <p className="text-muted text-sm">
          {format === 'ebook'
            ? 'Sent to your WhatsApp after order confirmation.'
            : 'Delivered across Nairobi & Kiambu. Cash on delivery.'}
        </p>
      )}
    </div>
  )
}
