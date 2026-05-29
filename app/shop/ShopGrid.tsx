'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import BookCard from '@/components/BookCard'
import type { Book } from '@/types'

type Props = { books: Book[] }

export default function ShopGrid({ books }: Props) {
  const router = useRouter()
  const [format, setFormat] = useState<'all' | 'hardcopy' | 'ebook'>('all')
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
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
      <div className="sticky top-[100px] z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 py-3 mb-6"
        style={{
          backgroundColor: 'rgba(245,237,224,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(221,208,188,0.6)',
        }}
      >
        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search by title or author…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md border border-line rounded-full pl-10 pr-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust focus:ring-2 transition-all"
            style={{ '--tw-ring-color': 'rgba(192,92,32,0.15)' } as React.CSSProperties}
          />
        </div>

        {/* Format filter */}
        <div className="flex gap-2 flex-wrap mb-2">
          {(['all', 'hardcopy', 'ebook'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                format === f
                  ? 'bg-rust text-white border-rust shadow-sm'
                  : 'bg-paper text-ink border-line hover:border-rust hover:text-rust'
              }`}
            >
              {f === 'all' ? 'All formats' : f === 'hardcopy' ? '📕 Hardcopy' : '⚡ Ebook'}
            </button>
          ))}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                category === 'all'
                  ? 'bg-grove text-paper border-grove'
                  : 'bg-paper text-muted border-line hover:border-grove hover:text-grove'
              }`}
            >
              All categories
            </button>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  category === c
                    ? 'bg-grove text-paper border-grove'
                    : 'bg-paper text-muted border-line hover:border-grove hover:text-grove'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-muted text-sm mb-5">
        {filtered.length === books.length
          ? `${books.length} books`
          : `${filtered.length} of ${books.length} books`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <p className="font-display font-semibold text-ink text-xl mb-2">No books found</p>
          <p className="text-muted text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
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
