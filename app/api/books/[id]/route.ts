import { createClient, createServiceClient } from '@/lib/supabase/server'
import cloudinary from '@/lib/cloudinary'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const serviceClient = await createServiceClient()
  const { error } = await serviceClient.from('books').update(body).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const serviceClient = await createServiceClient()

  const { data: book } = await serviceClient.from('books').select('cover_public_id').eq('id', id).single()
  if (book?.cover_public_id) {
    await cloudinary.uploader.destroy(book.cover_public_id)
  }

  const { error } = await serviceClient.from('books').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
