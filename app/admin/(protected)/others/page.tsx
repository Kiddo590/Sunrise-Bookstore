import { createServiceClient } from '@/lib/supabase/server'
import AdminOthersClient from './AdminOthersClient'
import type { OtherProduct } from '@/types'

export default async function AdminOthersPage() {
  const supabase = await createServiceClient()
  const { data } = await supabase
    .from('other_products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-ink text-2xl">Other Products</h1>
          <p className="text-muted text-sm mt-0.5">Stationery, electronics, and other non-book items</p>
        </div>
      </div>
      <AdminOthersClient products={(data as OtherProduct[]) ?? []} />
    </div>
  )
}
