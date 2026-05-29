'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import StarRating from '@/components/StarRating'

export default function ReviewFormClient({ bookId }: { bookId: string }) {
  const [reviewer, setReviewer] = useState('')
  const [body, setBody] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reviewer.trim() || !body.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: bookId, reviewer, body, rating }),
      })
      if (res.ok) {
        setSubmitted(true)
        toast.success('Review submitted! It will appear after approval.')
      } else {
        toast.error('Failed to submit review. Please try again.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-paper2 border border-line rounded-xl p-6 text-center">
        <p className="text-grove font-semibold">Thank you for your review!</p>
        <p className="text-muted text-sm mt-1">It will appear after we review it.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-paper2 border border-line rounded-xl p-6 max-w-lg">
      <h3 className="font-display font-semibold text-ink text-lg mb-4">Leave a review</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-ink block mb-1">Your name</label>
          <input
            type="text"
            required
            value={reviewer}
            onChange={e => setReviewer(e.target.value)}
            placeholder="e.g. Amina K."
            className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:border-rust"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink block mb-1">Rating</label>
          <StarRating rating={rating} interactive onChange={setRating} />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink block mb-1">Your review</label>
          <textarea
            required
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="What did you think of this book?"
            rows={4}
            className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:border-rust resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-rust text-white font-semibold px-6 py-2.5 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50 self-start"
        >
          {submitting ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  )
}
