import { getBookRequests } from '@/lib/db'
import AdminRequestsClient from './AdminRequestsClient'

export default async function AdminRequestsPage() {
  const requests = await getBookRequests()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-ink text-2xl">Book Requests</h1>
          <p className="text-muted text-sm mt-0.5">Books customers couldn&apos;t find and asked you to source</p>
        </div>
      </div>
      <AdminRequestsClient requests={requests} />
    </div>
  )
}
