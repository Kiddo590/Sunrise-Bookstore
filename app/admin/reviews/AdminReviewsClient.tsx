'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import StarRating from '@/components/StarRating'

type ReviewWithBook = {
  id: string
  reviewer: string
  body: string
  rating: number
  approved: boolean
  created_at: string
  books?: { id: string; title: string } | null
}

export default function AdminReviewsClient({ reviews: initial }: { reviews: ReviewWithBook[] }) {
  const [reviews, setReviews] = useState(initial)
  const [tab, setTab] = useState<'pending' | 'approved'>('pending')

  const filtered = reviews.filter(r => tab === 'pending' ? !r.approved : r.approved)

  async function approve(id: string) {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true }),
    })
    if (res.ok) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r))
      toast.success('Review approved')
    } else {
      toast.error('Failed to approve')
    }
  }

  async function deleteReview(id: string) {
    if (!confirm('Delete this review?')) return
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setReviews(prev => prev.filter(r => r.id !== id))
      toast.success('Review deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === t ? 'bg-rust text-white' : 'bg-paper2 text-ink border border-line hover:border-rust'
            }`}
          >
            {t === 'pending' ? `Pending (${reviews.filter(r => !r.approved).length})` : `Approved (${reviews.filter(r => r.approved).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">No {tab} reviews.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(r => (
            <div key={r.id} className="bg-paper2 border border-line rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {r.books && (
                    <p className="text-rust text-xs font-semibold mb-1">{r.books.title}</p>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={r.rating} />
                    <span className="font-semibold text-ink text-sm">{r.reviewer}</span>
                    <span className="text-muted text-xs">
                      {new Date(r.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-ink text-sm">{r.body}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!r.approved && (
                    <button
                      onClick={() => approve(r.id)}
                      className="text-xs font-semibold text-grove border border-grove px-3 py-1 rounded-full hover:bg-grove/10 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="text-xs font-semibold text-red-600 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
