import type { Metadata } from 'next'
import { getAllBooks } from '@/lib/db'
import ShopGrid from './ShopGrid'

export const metadata: Metadata = {
  title: 'Shop — The Sunrise BookStore',
  description: 'Browse our full collection of hardcopy and ebook titles at The Sunrise BookStore.',
}

export default async function ShopPage() {
  const books = await getAllBooks()

  return (
    <div className="bg-paper2 min-h-screen">
      {/* Page header */}
      <div style={{ backgroundColor: '#1b1c2b' }} className="py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-bold text-white text-xl sm:text-2xl">All Books</h1>
          <p className="text-white/50 text-sm mt-1">{books.length} books available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <ShopGrid books={books} />
      </div>
    </div>
  )
}
