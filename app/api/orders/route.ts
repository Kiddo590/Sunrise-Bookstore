import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json()
  const { customer_name, customer_phone, delivery_address, items, total_kes } = body

  if (!customer_name || !customer_phone || !delivery_address || !items || total_kes == null) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name,
      customer_phone,
      customer_email: body.customer_email ?? null,
      delivery_address,
      items,
      total_kes,
      payment_method: 'cod',
      status: 'pending',
      user_id: body.user_id ?? null,
    })
    .select('id')
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ id: data.id })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
