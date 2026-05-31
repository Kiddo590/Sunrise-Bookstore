'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

type Announcement = {
  id: string
  message: string
  position: number
  is_active: boolean
}

export default function AdminAnnouncementsClient({ announcements: initial }: { announcements: Announcement[] }) {
  const [items, setItems] = useState(initial)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  async function add() {
    const msg = draft.trim()
    if (!msg) return
    setSaving(true)
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
    })
    const data = await res.json()
    if (res.ok) {
      setItems(prev => [...prev, data])
      setDraft('')
      toast.success('Announcement added')
    } else {
      toast.error(data.error || 'Failed to add')
    }
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this announcement?')) return
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setItems(prev => prev.filter(a => a.id !== id))
      toast.success('Deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  async function toggleActive(id: string, value: boolean) {
    const res = await fetch(`/api/announcements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: value }),
    })
    if (res.ok) {
      setItems(prev => prev.map(a => a.id === id ? { ...a, is_active: value } : a))
    } else {
      toast.error('Failed to update')
    }
  }

  async function move(index: number, dir: 'up' | 'down') {
    const newItems = [...items]
    const swapIdx = dir === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= newItems.length) return
    ;[newItems[index], newItems[swapIdx]] = [newItems[swapIdx], newItems[index]]
    await Promise.all([
      fetch(`/api/announcements/${newItems[index].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: index + 1 }),
      }),
      fetch(`/api/announcements/${newItems[swapIdx].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: swapIdx + 1 }),
      }),
    ])
    setItems(newItems)
  }

  async function saveEdit(id: string, message: string) {
    const res = await fetch(`/api/announcements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) toast.error('Failed to save')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add form */}
      <div className="bg-paper2 border border-line rounded-xl p-4 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="e.g. 🎉 Special offer this weekend — 20% off all ebooks!"
          className="flex-1 border border-line rounded-xl px-3 py-2 text-sm bg-paper focus:outline-none focus:border-rust"
          maxLength={120}
        />
        <button
          onClick={add}
          disabled={saving || !draft.trim()}
          className="flex items-center gap-1.5 bg-rust text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50 shrink-0"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="bg-paper2 border border-line rounded-xl p-8 text-center text-muted text-sm">
          No announcements yet — the strip will show the default store messages until you add some.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((a, i) => (
            <div
              key={a.id}
              className="bg-paper2 border border-line rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <input
                type="text"
                defaultValue={a.message}
                onBlur={e => saveEdit(a.id, e.target.value)}
                className="flex-1 min-w-0 text-sm text-ink bg-transparent border-none outline-none focus:bg-paper rounded px-1 py-0.5 transition-colors"
                maxLength={120}
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <label className="flex items-center gap-1 cursor-pointer text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={a.is_active}
                    onChange={e => toggleActive(a.id, e.target.checked)}
                    className="accent-rust w-3.5 h-3.5"
                  />
                  Active
                </label>
                <button
                  onClick={() => move(i, 'up')}
                  disabled={i === 0}
                  className="p-1.5 rounded-lg hover:bg-paper transition-colors disabled:opacity-30 text-muted"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  onClick={() => move(i, 'down')}
                  disabled={i === items.length - 1}
                  className="p-1.5 rounded-lg hover:bg-paper transition-colors disabled:opacity-30 text-muted"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted">
        Click any message text to edit it inline. Changes save automatically when you click away.
      </p>
    </div>
  )
}
