import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { title, phone } = body

  if (!title || !phone) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('book_requests')
    .insert({
      title,
      author: body.author ?? null,
      format: body.format ?? 'either',
      phone,
      notes: body.notes ?? null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ id: data.id })
}
