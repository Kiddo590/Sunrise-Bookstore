import { createServiceClient } from '@/lib/supabase/server'
import AdminAnnouncementsClient from './AdminAnnouncementsClient'

export default async function AdminAnnouncementsPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('position', { ascending: true })

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-ink text-2xl">Announcements</h1>
        <p className="text-muted text-sm mt-1">
          Text messages that rotate every 5 seconds in the strip below the search bar. Shown to all visitors.
        </p>
      </div>
      <AdminAnnouncementsClient announcements={data ?? []} />
    </div>
  )
}
