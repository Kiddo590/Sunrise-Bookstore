import { createServiceClient } from '@/lib/supabase/server'
import AdminBannersClient from './AdminBannersClient'

export default async function AdminBannersPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('banners')
    .select('*')
    .order('position', { ascending: true })

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-ink text-2xl">Banner Images</h1>
        <p className="text-muted text-sm mt-1">
          Up to 10 images. Each rotates every 5 seconds on the storefront. Recommended size: 1200 × 120 px or wider.
        </p>
      </div>
      <AdminBannersClient banners={data ?? []} />
    </div>
  )
}
