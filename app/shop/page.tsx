import type { Metadata } from 'next'
import { getAllBooks } from '@/lib/db'
import ShopGrid from './ShopGrid'

export const metadata: Metadata = {
  title: 'Shop — Sunrise Bookstore',
  description: 'Browse our full collection of hardcopy and ebook titles. Filter by format, category, or search by title and author.',
}

export default async function ShopPage() {
  const books = await getAllBooks()

  return (
    <div>
      {/* Page header banner */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a2b 0%, #251c14 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-rust text-xs font-bold uppercase tracking-[0.15em] mb-3">Sunrise Bookstore</p>
          <h1 className="font-display font-bold text-paper text-4xl sm:text-5xl mb-3 leading-tight">
            Browse the shop
          </h1>
          <p className="text-paper/60 text-lg max-w-lg leading-relaxed">
            Hardcopy books delivered across Nairobi. Ebooks available for instant download.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ShopGrid books={books} />
      </div>
    </div>
  )
}
