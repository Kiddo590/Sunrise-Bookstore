'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { MessageCircle } from 'lucide-react'
import { money } from '@/lib/format'
import { waHelpLink } from '@/lib/whatsapp'
import type { Order } from '@/types'

const statuses = ['pending', 'confirmed', 'delivered', 'cancelled']
const filters = ['all', 'pending', 'confirmed', 'delivered', 'cancelled'] as const

export default function AdminOrdersClient({ orders: initial }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initial)
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>('all')
  const [search, setSearch] = useState('')

  const visible = useMemo(() => {
    let list = orders
    if (activeFilter !== 'all') list = list.filter(o => o.status === activeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
      )
    }
    return list
  }, [orders, activeFilter, search])

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } else {
      toast.error('Failed to update status')
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length }
    statuses.forEach(s => { c[s] = orders.filter(o => o.status === s).length })
    return c
  }, [orders])

  return (
    <div>
      {/* Filter + search bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                activeFilter === f
                  ? 'bg-rust text-white'
                  : 'bg-paper2 border border-line text-muted hover:text-ink'
              }`}
            >
              {f === 'all' ? 'All' : f}{' '}
              <span className="opacity-70">({counts[f] ?? 0})</span>
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search name or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="ml-auto border border-line rounded-xl px-3 py-1.5 text-sm bg-paper focus:outline-none focus:border-rust w-52"
        />
      </div>

      <div className="bg-paper2 border border-line rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper">
                <th className="text-left p-3 text-muted font-semibold">ID</th>
                <th className="text-left p-3 text-muted font-semibold">Name</th>
                <th className="text-left p-3 text-muted font-semibold">Phone</th>
                <th className="text-left p-3 text-muted font-semibold">Items</th>
                <th className="text-left p-3 text-muted font-semibold">Total</th>
                <th className="text-left p-3 text-muted font-semibold">Status</th>
                <th className="text-left p-3 text-muted font-semibold">Date</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted">No orders found.</td>
                </tr>
              ) : visible.map(order => (
                <tr key={order.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                  <td className="p-3 text-muted font-mono text-xs">{order.id.slice(0, 8)}</td>
                  <td className="p-3 font-medium text-ink">{order.customer_name}</td>
                  <td className="p-3 text-muted">{order.customer_phone}</td>
                  <td className="p-3 text-muted">{Array.isArray(order.items) ? order.items.length : '—'}</td>
                  <td className="p-3 font-semibold text-ink">{money(order.total_kes)}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="border border-line rounded-lg px-2 py-1 text-xs bg-paper focus:outline-none focus:border-rust"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-muted text-xs">
                    {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="p-3">
                    <a
                      href={waHelpLink(`Hi ${order.customer_name}, your Sunrise Bookstore order is ready!`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:opacity-80"
                      title="WhatsApp customer"
                    >
                      <MessageCircle size={18} />
                    </a>
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
