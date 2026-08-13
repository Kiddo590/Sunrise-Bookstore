import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getOrdersByUserId } from '@/lib/db'
import SignOutButton from './SignOutButton'
import { money } from '@/lib/format'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const orders = await getOrdersByUserId(user.id)
  const meta = user.user_metadata as { full_name?: string; phone?: string }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Profile card */}
      <div className="bg-paper rounded-2xl border border-line p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="bg-rust w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg font-display"
            >
              {(meta.full_name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
            </div>
            <div>
              <h1 className="font-display font-bold text-ink text-xl leading-tight">
                {meta.full_name ?? 'My Account'}
              </h1>
              <p className="text-muted text-xs">{user.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-line">
          <div>
            <p className="text-[11px] text-muted uppercase tracking-wide mb-0.5">Full name</p>
            <p className="font-medium text-ink text-sm">{meta.full_name ?? '—'}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted uppercase tracking-wide mb-0.5">Email</p>
            <p className="font-medium text-ink text-sm">{user.email}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted uppercase tracking-wide mb-0.5">Phone</p>
            <p className="font-medium text-ink text-sm">{meta.phone ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Order history */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-ink text-xl">Order History</h2>
        <Link href="/shop" className="text-rust text-sm font-semibold">
          Shop more →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-paper rounded-2xl border border-line p-10 text-center">
          <p className="text-3xl mb-3">📦</p>
          <p className="font-semibold text-ink mb-1">No orders yet</p>
          <p className="text-muted text-sm mb-4">Your order history will appear here.</p>
          <Link
            href="/shop"
            className="bg-rust inline-block text-sm font-semibold text-white px-5 py-2 rounded-full"
          >
            Browse books
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <div key={order.id} className="bg-paper rounded-xl border border-line p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted mb-1">
                    {new Date(order.created_at).toLocaleDateString('en-KE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-ink font-medium line-clamp-1">
                    {order.items.map(i => i.title).join(', ')}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {order.delivery_address}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm" style={{ color: '#f68b1e' }}>{money(order.total_kes)}</p>
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
