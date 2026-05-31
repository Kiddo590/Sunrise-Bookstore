import { createServiceClient } from '@/lib/supabase/server'
import AdminReviewsClient from './AdminReviewsClient'

export default async function AdminReviewsPage() {
  const supabase = createServiceClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, books(id, title)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-display font-bold text-ink text-2xl mb-6">Reviews</h1>
      <AdminReviewsClient reviews={reviews ?? []} />
    </div>
  )
}
