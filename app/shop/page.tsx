import type { Metadata } from 'next'
import { getAllBooks } from '@/lib/db'
import ShopGrid from './ShopGrid'

export const metadata: Metadata = {
  title: 'Shop — The Sunrise BookStore',
  description: 'Browse our full collection of hardcopy and ebook titles at The Sunrise BookStore.',
}

type Props = {
  searchParams: Promise<{ search?: string; format?: string; category?: string }>
}

export default async function ShopPage({ searchParams }: Props) {
  const books = await getAllBooks()
  const params = await searchParams

  return (
    <div className="bg-paper2 min-h-screen">
      {/* Page header */}
      <div className="py-6 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, #1b1c2b 0%, #2d1f3d 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">The Sunrise BookStore</p>
          <h1 className="font-bold text-white text-2xl sm:text-3xl">📚 All Books</h1>
          <p className="text-white/50 text-sm mt-1">{books.length} titles available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <ShopGrid
          books={books}
          initialSearch={params.search ?? ''}
          initialFormat={params.format === 'hardcopy' || params.format === 'ebook' ? params.format : 'all'}
          initialCategory={params.category ?? 'all'}
        />
      </div>
    </div>
  )
}
