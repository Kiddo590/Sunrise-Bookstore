'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import BookCover from '@/components/BookCover'
import type { Book } from '@/types'

export default function BookFormClient({ book, isNew }: { book: Book | null; isNew: boolean }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: book?.title ?? '',
    author: book?.author ?? '',
    category: book?.category ?? '',
    description: book?.description ?? '',
    price_hard: book?.price_hard != null ? String(book.price_hard) : '',
    price_ebook: book?.price_ebook != null ? String(book.price_ebook) : '',
    cover_url: book?.cover_url ?? '',
    cover_public_id: book?.cover_public_id ?? '',
    is_featured: book?.is_featured ?? false,
    is_deal: book?.is_deal ?? false,
    in_stock: book?.in_stock ?? true,
  })

  const previewBook: Book = {
    id: book?.id ?? '',
    ...form,
    price_hard: form.price_hard ? parseFloat(form.price_hard) : null,
    price_ebook: form.price_ebook ? parseFloat(form.price_ebook) : null,
    cover_url: form.cover_url || null,
    cover_public_id: form.cover_public_id || null,
    category: form.category || null,
    description: form.description || null,
    created_at: book?.created_at ?? '',
  }

  async function uploadCover() {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setForm(f => ({ ...f, cover_url: data.url, cover_public_id: data.public_id }))
        toast.success('Cover uploaded!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title: form.title,
      author: form.author,
      category: form.category || null,
      description: form.description || null,
      price_hard: form.price_hard ? parseFloat(form.price_hard) : null,
      price_ebook: form.price_ebook ? parseFloat(form.price_ebook) : null,
      cover_url: form.cover_url || null,
      cover_public_id: form.cover_public_id || null,
      is_featured: form.is_featured,
      is_deal: form.is_deal,
      in_stock: form.in_stock,
    }

    try {
      let res: Response
      if (isNew) {
        res = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/api/books/${book!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      if (res.ok) {
        toast.success(isNew ? 'Book added!' : 'Book updated!')
        router.push('/admin/books')
        router.refresh()
      } else {
        const errData = await res.json().catch(() => ({}))
        toast.error(errData.error || `Failed to save book (${res.status})`)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div key={key}>
      <label className="text-sm font-semibold text-ink block mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {field('Title *', 'title', 'text', 'e.g. Weep Not, Child')}
      {field('Author *', 'author', 'text', 'e.g. Ngũgĩ wa Thiong\'o')}
      {field('Category', 'category', 'text', 'e.g. Fiction')}

      <div>
        <label className="text-sm font-semibold text-ink block mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={4}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('Hardcopy price (KSh)', 'price_hard', 'number', 'Leave blank if N/A')}
        {field('Ebook price (KSh)', 'price_ebook', 'number', 'Leave blank if N/A')}
      </div>

      {/* Cover upload */}
      <div>
        <label className="text-sm font-semibold text-ink block mb-2">Cover image</label>
        <div className="flex gap-4 items-start">
          <div className="w-24 rounded overflow-hidden">
            <BookCover book={previewBook} height={120} />
          </div>
          <div className="flex flex-col gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="text-sm text-muted" />
            <button
              type="button"
              onClick={uploadCover}
              disabled={uploading}
              className="bg-ink text-paper text-xs font-semibold px-4 py-2 rounded-full hover:bg-grove transition-colors disabled:opacity-50 w-fit"
            >
              {uploading ? 'Uploading…' : 'Upload cover'}
            </button>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6 flex-wrap">
        {(['is_featured', 'is_deal', 'in_stock'] as const).map(key => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form[key] as boolean}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
              className="accent-rust w-4 h-4"
            />
            <span className="text-sm text-ink capitalize">{key.replace('_', ' ')}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-rust text-white font-semibold px-6 py-2.5 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : isNew ? 'Add book' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/books')}
          className="border border-line text-ink font-semibold px-6 py-2.5 rounded-full hover:bg-paper2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
