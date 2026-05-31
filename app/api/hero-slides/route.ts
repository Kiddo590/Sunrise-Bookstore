import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('position', { ascending: true })
  if (error) return Response.json([], { status: 200 })
  return Response.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const serviceClient = createServiceClient()
  const { count } = await serviceClient
    .from('hero_slides')
    .select('*', { count: 'exact', head: true })
  const position = (count ?? 0) + 1

  const { data, error } = await serviceClient
    .from('hero_slides')
    .insert({ ...body, position })
    .select()
    .single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
