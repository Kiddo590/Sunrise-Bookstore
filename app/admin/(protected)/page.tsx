import { createServiceClient } from '@/lib/supabase/server'
import { money } from '@/lib/format'

export default async function AdminDashboard() {
  const supabase = await createServiceClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: totalBooks },
    { count: pendingOrders },
    { count: pendingReviews },
    { count: monthOrders },
    { data: recentOrders },
    { data: allRevData },
    { data: monthRevData },
  ] = await Promise.all([
    supabase.from('books').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('approved', false),
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('orders').select('total_kes'),
    supabase.from('orders').select('total_kes').gte('created_at', startOfMonth),
  ])

  const totalRevenue = (allRevData ?? []).reduce((s: number, o: any) => s + (o.total_kes ?? 0), 0)
  const monthRevenue = (monthRevData ?? []).reduce((s: number, o: any) => s + (o.total_kes ?? 0), 0)

  return (
    <div>
      <h1 className="font-display font-bold text-ink text-2xl mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Books', value: totalBooks ?? 0, format: 'number' },
          { label: 'Pending Orders', value: pendingOrders ?? 0, format: 'number' },
          { label: 'Pending Reviews', value: pendingReviews ?? 0, format: 'number' },
          { label: 'Orders This Month', value: monthOrders ?? 0, format: 'number' },
          { label: 'Revenue This Month', value: monthRevenue, format: 'money' },
          { label: 'Total Revenue', value: totalRevenue, format: 'money' },
        ].map(({ label, value, format }) => (
          <div key={label} className="bg-paper2 border border-line rounded-xl p-5">
            <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
            <p className="font-display font-bold text-ink text-2xl">
              {format === 'money' ? money(value as number) : value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-paper2 border border-line rounded-xl overflow-hidden">
        <div className="p-5 border-b border-line">
          <h2 className="font-display font-semibold text-ink text-lg">Recent orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper">
                <th className="text-left p-3 text-muted font-semibold">Name</th>
                <th className="text-left p-3 text-muted font-semibold">Phone</th>
                <th className="text-left p-3 text-muted font-semibold">Items</th>
                <th className="text-left p-3 text-muted font-semibold">Total</th>
                <th className="text-left p-3 text-muted font-semibold">Status</th>
                <th className="text-left p-3 text-muted font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order: any) => (
                <tr key={order.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                  <td className="p-3 font-medium text-ink">{order.customer_name}</td>
                  <td className="p-3 text-muted">{order.customer_phone}</td>
                  <td className="p-3 text-muted">{Array.isArray(order.items) ? order.items.length : '—'}</td>
                  <td className="p-3 font-semibold text-ink">{money(order.total_kes)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                      order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted">
                    {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
