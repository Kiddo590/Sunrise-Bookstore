'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { waRequestLink } from '@/lib/whatsapp'
import type { BookRequest } from '@/types'

export default function RequestPage() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [format, setFormat] = useState<BookRequest['format']>('either')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !phone.trim()) return
    setSubmitting(true)
    try {
      const req: BookRequest = { title, author: author || undefined, format, phone, notes: notes || undefined }
      await fetch('/api/book-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })
      window.open(waRequestLink(req), '_blank')
      toast.success("Request sent! We'll check availability and message you on WhatsApp 📚")
      setTitle('')
      setAuthor('')
      setPhone('')
      setNotes('')
      setFormat('either')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-ink text-3xl mb-2">Can&apos;t find a book?</h1>
      <p className="text-muted text-lg mb-8">Tell us what you&apos;re looking for and we&apos;ll track it down.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-semibold text-ink block mb-1">
            Book title <span className="text-rust">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Weep Not, Child"
            className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink block mb-1">
            Author <span className="text-muted text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="e.g. Ngũgĩ wa Thiong'o"
            className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink block mb-2">Format</label>
          <div className="flex gap-3">
            {(['hardcopy', 'ebook', 'either'] as const).map(f => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={f}
                  checked={format === f}
                  onChange={() => setFormat(f)}
                  className="accent-rust"
                />
                <span className="text-sm capitalize text-ink">
                  {f === 'hardcopy' ? '📕 Hardcopy' : f === 'ebook' ? '⚡ Ebook' : 'Either'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-ink block mb-1">
            Your phone number <span className="text-rust">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="07XX XXX XXX"
            className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink block mb-1">
            Extra notes <span className="text-muted text-xs">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Edition, deadline, anything else we should know"
            rows={3}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-rust text-white font-semibold py-3 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Send request →'}
        </button>
      </form>
    </div>
  )
}
