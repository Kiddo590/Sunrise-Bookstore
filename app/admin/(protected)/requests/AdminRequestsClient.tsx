'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { MessageCircle } from 'lucide-react'
import type { BookRequestRecord } from '@/types'

const tabs = ['all', 'pending', 'sourced', 'unavailable'] as const

const formatLabel: Record<string, string> = {
  hardcopy: '📕 Hardcopy',
  ebook: '⚡ Ebook',
  either: 'Either',
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  sourced: 'bg-green-100 text-green-700',
  unavailable: 'bg-red-100 text-red-700',
}

export default function AdminRequestsClient({ requests: initial }: { requests: BookRequestRecord[] }) {
  const [requests, setRequests] = useState(initial)
  const [tab, setTab] = useState<typeof tabs[number]>('all')

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: requests.length }
    tabs.forEach(t => { if (t !== 'all') c[t] = requests.filter(r => r.status === t).length })
    return c
  }, [requests])

  const visible = useMemo(
    () => tab === 'all' ? requests : requests.filter(r => r.status === tab),
    [requests, tab]
  )

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: status as BookRequestRecord['status'] } : r))
      toast.success(`Marked as ${status}`)
    } else {
      toast.error('Failed to update')
    }
  }

  async function deleteRequest(id: string) {
    if (!confirm('Delete this request?')) return
    const res = await fetch(`/api/admin/requests/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setRequests(prev => prev.filter(r => r.id !== id))
      toast.success('Deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              tab === t ? 'bg-rust text-white' : 'bg-paper2 border border-line text-muted hover:text-ink'
            }`}
          >
            {t === 'all' ? 'All' : t}{' '}
            <span className="opacity-70">({counts[t] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="bg-paper2 border border-line rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper">
                <th className="text-left p-3 text-muted font-semibold">Book</th>
                <th className="text-left p-3 text-muted font-semibold">Format</th>
                <th className="text-left p-3 text-muted font-semibold">Customer Phone</th>
                <th className="text-left p-3 text-muted font-semibold">Notes</th>
                <th className="text-left p-3 text-muted font-semibold">Status</th>
                <th className="text-left p-3 text-muted font-semibold">Date</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted">No requests found.</td>
                </tr>
              ) : visible.map(req => (
                <tr key={req.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                  <td className="p-3">
                    <p className="font-medium text-ink">{req.title}</p>
                    {req.author && <p className="text-muted text-xs">{req.author}</p>}
                  </td>
                  <td className="p-3 text-muted text-xs">{formatLabel[req.format] ?? req.format}</td>
                  <td className="p-3 text-muted">{req.phone}</td>
                  <td className="p-3 text-muted text-xs max-w-[180px] truncate">{req.notes ?? '—'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${statusColors[req.status] ?? ''}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted text-xs">
                    {new Date(req.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {/* WhatsApp the customer directly */}
                      <a
                        href={`https://wa.me/${req.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! About your request for "${req.title}" at Sunrise Bookstore:`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:opacity-80"
                        title="WhatsApp customer"
                      >
                        <MessageCircle size={16} />
                      </a>
                      {req.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(req.id, 'sourced')}
                          className="text-xs font-semibold text-green-700 border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-50 transition-colors"
                        >
                          Sourced
                        </button>
                      )}
                      {req.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(req.id, 'unavailable')}
                          className="text-xs font-semibold text-muted border border-line px-2.5 py-1 rounded-full hover:bg-paper transition-colors"
                        >
                          N/A
                        </button>
                      )}
                      <button
                        onClick={() => deleteRequest(req.id)}
                        className="text-xs font-semibold text-red-600 border border-red-200 px-2.5 py-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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
