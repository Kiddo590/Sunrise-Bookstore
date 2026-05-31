import { createServiceClient } from '@/lib/supabase/server'
import BookFormClient from './BookFormClient'
import type { Book } from '@/types'

type Props = { params: Promise<{ id: string }> }

export default async function AdminBookFormPage({ params }: Props) {
  const { id } = await params
  const isNew = id === 'new'

  let book: Book | null = null
  if (!isNew) {
    const supabase = await createServiceClient()
    const { data } = await supabase.from('books').select('*').eq('id', id).single()
    book = data as Book | null
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-bold text-ink text-2xl mb-6">
        {isNew ? 'Add Book' : 'Edit Book'}
      </h1>
      <BookFormClient book={book} isNew={isNew} />
    </div>
  )
}
