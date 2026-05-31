import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json()
  const { book_id, reviewer, body: reviewBody, rating } = body

  if (!book_id || !reviewer || !reviewBody || !rating) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .insert({ book_id, reviewer, body: reviewBody, rating, approved: false })
    .select('id')
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ id: data.id })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get('bookId')
  if (!bookId) return Response.json({ error: 'bookId required' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('book_id', bookId)
    .eq('approved', true)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
