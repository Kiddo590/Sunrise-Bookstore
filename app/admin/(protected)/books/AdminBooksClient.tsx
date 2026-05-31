'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import BookCover from '@/components/BookCover'
import { money } from '@/lib/format'
import type { Book } from '@/types'

export default function AdminBooksClient({ books: initial }: { books: Book[] }) {
  const [books, setBooks] = useState(initial)
  const router = useRouter()

  async function toggle(id: string, field: 'is_featured' | 'is_deal' | 'in_stock', value: boolean) {
    const res = await fetch(`/api/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    if (res.ok) {
      setBooks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b))
    } else {
      toast.error('Failed to update')
    }
  }

  async function deleteBook(id: string) {
    if (!confirm('Delete this book? This cannot be undone.')) return
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setBooks(prev => prev.filter(b => b.id !== id))
      toast.success('Book deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="bg-paper2 border border-line rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left p-3 text-muted font-semibold">Cover</th>
              <th className="text-left p-3 text-muted font-semibold">Title / Author</th>
              <th className="text-left p-3 text-muted font-semibold">Formats</th>
              <th className="text-center p-3 text-muted font-semibold">Featured</th>
              <th className="text-center p-3 text-muted font-semibold">Deal</th>
              <th className="text-center p-3 text-muted font-semibold">In Stock</th>
              <th className="text-left p-3 text-muted font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                <td className="p-3">
                  <div className="w-12 rounded overflow-hidden">
                    <BookCover book={book} height={60} />
                  </div>
                </td>
                <td className="p-3">
                  <p className="font-medium text-ink line-clamp-1">{book.title}</p>
                  <p className="text-muted text-xs">{book.author}</p>
                </td>
                <td className="p-3 text-muted">
                  {[
                    book.price_hard != null && `📕 ${money(book.price_hard)}`,
                    book.price_ebook != null && `⚡ ${money(book.price_ebook)}`,
                  ].filter(Boolean).join(' · ')}
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={book.is_featured}
                    onChange={e => toggle(book.id, 'is_featured', e.target.checked)}
                    className="accent-rust w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={book.is_deal}
                    onChange={e => toggle(book.id, 'is_deal', e.target.checked)}
                    className="accent-rust w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={book.in_stock}
                    onChange={e => toggle(book.id, 'in_stock', e.target.checked)}
                    className="accent-rust w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/books/${book.id}`}
                    className="text-xs font-semibold text-ink border border-line px-2.5 py-1 rounded-full hover:bg-paper2 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="text-xs font-semibold text-red-600 border border-red-200 px-2.5 py-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
