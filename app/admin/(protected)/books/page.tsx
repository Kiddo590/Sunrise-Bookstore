import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import BookCover from '@/components/BookCover'
import AdminBooksClient from './AdminBooksClient'
import type { Book } from '@/types'

export default async function AdminBooksPage() {
  const supabase = createServiceClient()
  const { data: books } = await supabase.from('books').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-ink text-2xl">Books</h1>
        <Link
          href="/admin/books/new"
          className="bg-rust text-white font-semibold px-5 py-2 rounded-full hover:bg-rust-d transition-colors text-sm"
        >
          + Add Book
        </Link>
      </div>
      <AdminBooksClient books={(books as Book[]) ?? []} />
    </div>
  )
}
