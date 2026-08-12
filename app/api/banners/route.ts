import { createServiceClient, requireAdmin } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('banners')
    .select('id, image_url, position')
    .eq('is_active', true)
    .order('position', { ascending: true })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: Request) {
  const user = await requireAdmin()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const serviceClient = createServiceClient()

  // Assign next position
  const { count } = await serviceClient
    .from('banners')
    .select('*', { count: 'exact', head: true })
  const position = (count ?? 0) + 1

  const { data, error } = await serviceClient
    .from('banners')
    .insert({ ...body, position })
    .select()
    .single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
