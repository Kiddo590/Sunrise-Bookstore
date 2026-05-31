'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react'

type Banner = {
  id: string
  image_url: string
  public_id: string | null
  position: number
  is_active: boolean
}

export default function AdminBannersClient({ banners: initial }: { banners: Banner[] }) {
  const [banners, setBanners] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const MAX = 10

  async function handleUpload(file: File) {
    if (banners.length >= MAX) {
      toast.error(`Maximum ${MAX} banners allowed`)
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const upRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const upData = await upRes.json()
      if (!upData.url) {
        toast.error(upData.error || 'Upload failed')
        return
      }

      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: upData.url, public_id: upData.public_id, is_active: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save banner')
        return
      }
      setBanners(prev => [...prev, data])
      toast.success('Banner added')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function toggleActive(id: string, value: boolean) {
    const res = await fetch(`/api/banners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: value }),
    })
    if (res.ok) {
      setBanners(prev => prev.map(b => b.id === id ? { ...b, is_active: value } : b))
    } else {
      toast.error('Failed to update')
    }
  }

  async function deleteBanner(id: string) {
    if (!confirm('Delete this banner?')) return
    const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setBanners(prev => prev.filter(b => b.id !== id))
      toast.success('Banner deleted')
    } else {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error || 'Failed to delete')
    }
  }

  async function move(index: number, dir: 'up' | 'down') {
    const newBanners = [...banners]
    const swapIdx = dir === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= newBanners.length) return
    ;[newBanners[index], newBanners[swapIdx]] = [newBanners[swapIdx], newBanners[index]]

    // Update positions in DB
    await Promise.all([
      fetch(`/api/banners/${newBanners[index].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: index + 1 }),
      }),
      fetch(`/api/banners/${newBanners[swapIdx].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: swapIdx + 1 }),
      }),
    ])
    setBanners(newBanners)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Upload button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading || banners.length >= MAX}
          className="flex items-center gap-2 bg-rust text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
        >
          <Plus size={15} />
          {uploading ? 'Uploading…' : 'Add Banner Image'}
        </button>
        <span className="text-sm text-muted">{banners.length} / {MAX}</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>

      {/* Banner list */}
      {banners.length === 0 ? (
        <div className="bg-paper2 border border-line rounded-xl p-10 text-center text-muted text-sm">
          No banners yet. Click "Add Banner Image" to upload your first one.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {banners.map((b, i) => (
            <div
              key={b.id}
              className="bg-paper2 border border-line rounded-xl overflow-hidden flex items-center gap-3 p-3"
            >
              {/* Preview */}
              <div className="relative w-48 h-14 rounded-lg overflow-hidden shrink-0 border border-line bg-paper">
                <Image src={b.image_url} alt={`Banner ${i + 1}`} fill className="object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">Banner {i + 1}</p>
                <p className="text-xs text-muted truncate">{b.image_url}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={b.is_active}
                    onChange={e => toggleActive(b.id, e.target.checked)}
                    className="accent-rust w-3.5 h-3.5"
                  />
                  Active
                </label>
                <button
                  onClick={() => move(i, 'up')}
                  disabled={i === 0}
                  className="p-1.5 rounded-lg hover:bg-paper transition-colors disabled:opacity-30 text-muted"
                  title="Move up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => move(i, 'down')}
                  disabled={i === banners.length - 1}
                  className="p-1.5 rounded-lg hover:bg-paper transition-colors disabled:opacity-30 text-muted"
                  title="Move down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => deleteBanner(b.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
