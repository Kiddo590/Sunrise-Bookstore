import Image from 'next/image'
import { money } from '@/lib/format'
import type { OtherProduct } from '@/types'

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

export default function OtherProductCard({ product }: { product: OtherProduct }) {
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi Sunrise Bookstore! I'd like to order: ${product.name} — ${money(product.price_kes)}`
  )}`

  return (
    <div className="group bg-white border border-line rounded overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="relative bg-paper2 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
        {product.cover_url ? (
          <Image
            src={product.cover_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <span className="text-5xl">🛍️</span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-muted uppercase tracking-wide">Out of stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 sm:p-3">
        {product.category && (
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted">{product.category}</span>
        )}
        <h3 className="text-xs sm:text-sm font-medium text-ink leading-snug line-clamp-2 mt-0.5 min-h-[2.5em]">
          {product.name}
        </h3>
        <p className="font-bold text-base sm:text-lg mt-1 leading-none" style={{ color: '#f68b1e' }}>
          {money(product.price_kes)}
        </p>
        {product.in_stock && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center text-xs font-semibold text-white py-1.5 rounded-full transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#25D366' }}
          >
            Order on WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
