'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import BookCard from '@/components/BookCard'
import type { Book } from '@/types'

type Props = {
  books: Book[]
  initialSearch?: string
  initialFormat?: 'all' | 'hardcopy' | 'ebook'
  initialCategory?: string
}

export default function ShopGrid({ books, initialSearch = '', initialFormat = 'all', initialCategory = 'all' }: Props) {
  const router = useRouter()
  const [format, setFormat] = useState<'all' | 'hardcopy' | 'ebook'>(initialFormat)
  const [category, setCategory] = useState<string>(initialCategory)
  const [search, setSearch] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setDebouncedSearch(search), 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [search])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(books.map(b => b.category).filter(Boolean))) as string[]
    return cats.sort()
  }, [books])

  const filtered = useMemo(() => {
    return books.filter(b => {
      if (format === 'hardcopy' && b.price_hard == null) return false
      if (format === 'ebook' && b.price_ebook == null) return false
      if (category !== 'all' && b.category !== category) return false
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase()
        if (!b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [books, format, category, debouncedSearch])

  return (
    <div>
      {/* Sticky filter bar */}
      <div
        className="sticky top-[108px] z-30 bg-white rounded mb-4 p-3 sm:p-4"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        {/* Search */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="search"
              placeholder="Search by title or author…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-line rounded pl-9 pr-4 py-2 text-sm bg-paper2 focus:outline-none focus:border-rust transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 text-muted">
            <SlidersHorizontal size={15} />
            <span className="text-xs hidden sm:block">Filters</span>
          </div>
        </div>

        {/* Format tabs */}
        <div className="flex gap-1.5 flex-wrap mb-2.5">
          {(['all', 'hardcopy', 'ebook'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                format === f
                  ? 'text-white border-rust'
                  : 'bg-paper2 text-ink border-line hover:border-rust/50'
              }`}
              style={format === f ? { backgroundColor: '#074C17', borderColor: '#074C17' } : {}}
            >
              {f === 'all' ? 'All Formats' : f === 'hardcopy' ? '📕 Hardcopy' : '⚡ Ebook'}
            </button>
          ))}
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                category === 'all'
                  ? 'text-white border-grove'
                  : 'bg-paper2 text-ink border-line hover:border-grove/50'
              }`}
              style={category === 'all' ? { backgroundColor: '#013909', borderColor: '#013909' } : {}}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  category === c
                    ? 'text-white'
                    : 'bg-paper2 text-ink border-line hover:border-grove/50'
                }`}
                style={category === c ? { backgroundColor: '#013909', borderColor: '#013909' } : {}}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-muted text-xs mb-3">
        Showing <strong className="text-ink">{filtered.length}</strong> of {books.length} books
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded p-16 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-bold text-ink text-lg mb-1">No books found</p>
          <p className="text-muted text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {filtered.map(book => (
            <div key={book.id} className="group">
              <BookCard
                book={book}
                onClick={() => router.push(`/book/${book.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
