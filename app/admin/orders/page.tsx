import { createServiceClient } from '@/lib/supabase/server'
import { money } from '@/lib/format'
import { waHelpLink } from '@/lib/whatsapp'
import AdminOrdersClient from './AdminOrdersClient'

export default async function AdminOrdersPage() {
  const supabase = await createServiceClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-display font-bold text-ink text-2xl mb-6">Orders</h1>
      <AdminOrdersClient orders={orders ?? []} />
    </div>
  )
}
