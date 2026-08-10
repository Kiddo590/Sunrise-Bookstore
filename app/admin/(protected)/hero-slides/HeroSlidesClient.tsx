'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react'
import type { HeroSlide } from '@/types'

const BLANK = {
  eyebrow: '',
  heading: '',
  sub: '',
  cta: 'Shop Now',
  href: '/shop',
  bg: 'linear-gradient(120deg, #013909 0%, #074C17 100%)',
  emoji: '📚',
  is_active: true,
}

const BG_PRESETS = [
  { label: 'Brand green', value: 'linear-gradient(120deg, #013909 0%, #074C17 100%)' },
  { label: 'Dark navy', value: 'linear-gradient(120deg, #1b1c2b 0%, #2a1f3d 100%)' },
  { label: 'Orange', value: 'linear-gradient(120deg, #d97b18 0%, #f68b1e 100%)' },
  { label: 'Dark green', value: 'linear-gradient(120deg, #0d2018 0%, #1a3a2b 100%)' },
  { label: 'Red', value: 'linear-gradient(120deg, #a81020 0%, #e31837 100%)' },
  { label: 'Deep blue', value: 'linear-gradient(120deg, #0a1230 0%, #1a2050 100%)' },
  { label: 'Purple', value: 'linear-gradient(120deg, #2d1b69 0%, #4a2080 100%)' },
]

export default function HeroSlidesClient({ slides: initial }: { slides: HeroSlide[] }) {
  const [slides, setSlides] = useState(initial)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<HeroSlide | null>(null)
  const [form, setForm] = useState({ ...BLANK })
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  function openNew() {
    setEditing(null)
    setForm({ ...BLANK })
    setFormOpen(true)
  }

  function openEdit(s: HeroSlide) {
    setEditing(s)
    setForm({
      eyebrow: s.eyebrow,
      heading: s.heading,
      sub: s.sub ?? '',
      cta: s.cta,
      href: s.href,
      bg: s.bg,
      emoji: s.emoji ?? '📚',
      is_active: s.is_active,
    })
    setFormOpen(true)
    setExpanded(s.id)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
    setForm({ ...BLANK })
  }

  async function handleSave() {
    if (!form.eyebrow.trim() || !form.heading.trim()) {
      toast.error('Label and heading are required')
      return
    }
    setSaving(true)
    const payload = {
      eyebrow: form.eyebrow.trim(),
      heading: form.heading.trim(),
      sub: form.sub.trim() || null,
      cta: form.cta.trim() || 'Shop Now',
      href: form.href.trim() || '/shop',
      bg: form.bg,
      emoji: form.emoji.trim() || null,
      is_active: form.is_active,
    }

    if (editing) {
      const res = await fetch(`/api/hero-slides/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSlides(prev => prev.map(s => s.id === editing.id ? { ...s, ...payload } : s))
        toast.success('Slide updated')
        closeForm()
      } else {
        const d = await res.json().catch(() => ({}))
        toast.error(d.error || 'Failed to update')
      }
    } else {
      const res = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const created = await res.json()
        setSlides(prev => [...prev, created])
        toast.success('Slide added')
        closeForm()
      } else {
        const d = await res.json().catch(() => ({}))
        toast.error(d.error || 'Failed to add')
      }
    }
    setSaving(false)
  }

  async function deleteSlide(id: string) {
    if (!confirm('Delete this slide?')) return
    const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setSlides(prev => prev.filter(s => s.id !== id))
      toast.success('Slide deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  async function toggleActive(id: string, value: boolean) {
    const res = await fetch(`/api/hero-slides/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: value }),
    })
    if (res.ok) {
      setSlides(prev => prev.map(s => s.id === id ? { ...s, is_active: value } : s))
    } else {
      toast.error('Failed to update')
    }
  }

  async function move(index: number, dir: 'up' | 'down') {
    const arr = [...slides]
    const swapIdx = dir === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= arr.length) return
    ;[arr[index], arr[swapIdx]] = [arr[swapIdx], arr[index]]
    await Promise.all([
      fetch(`/api/hero-slides/${arr[index].id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: index + 1 }),
      }),
      fetch(`/api/hero-slides/${arr[swapIdx].id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: swapIdx + 1 }),
      }),
    ])
    setSlides(arr)
  }

  const input = (label: string, key: keyof typeof form, placeholder = '', type = 'text') => (
    <div>
      <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-line rounded-xl px-3 py-2 text-sm bg-paper focus:outline-none focus:border-rust"
      />
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Add button */}
      {!formOpen && (
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-rust text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-rust-d transition-colors w-fit"
        >
          <Plus size={15} /> Add Slide
        </button>
      )}

      {/* Form */}
      {formOpen && (
        <div className="bg-paper2 border border-line rounded-xl p-5">
          <h2 className="font-semibold text-ink mb-4">{editing ? 'Edit Slide' : 'New Slide'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {input('Label (eyebrow) *', 'eyebrow', 'e.g. New Arrivals')}
            {input('Emoji', 'emoji', 'e.g. 📚')}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1">Heading *</label>
              <textarea
                value={form.heading}
                onChange={e => setForm(f => ({ ...f, heading: e.target.value }))}
                placeholder={'e.g. Fresh titles in\nstock this week'}
                rows={2}
                className="w-full border border-line rounded-xl px-3 py-2 text-sm bg-paper focus:outline-none focus:border-rust resize-none"
              />
              <p className="text-xs text-muted mt-0.5">Use a new line to break the heading into two lines</p>
            </div>
            <div className="sm:col-span-2">
              {input('Subtext', 'sub', 'e.g. Hardcopy & Ebook formats available')}
            </div>
            {input('Button text', 'cta', 'e.g. Shop Now')}
            {input('Button link', 'href', 'e.g. /shop')}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1">Background</label>
              <div className="flex flex-wrap gap-2">
                {BG_PRESETS.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, bg: p.value }))}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                    style={{
                      background: p.value,
                      color: '#fff',
                      borderColor: form.bg === p.value ? '#074C17' : 'transparent',
                      boxShadow: form.bg === p.value ? '0 0 0 2px #074C17' : 'none',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                className="accent-rust w-4 h-4"
              />
              <span className="text-sm text-ink">Active (visible on storefront)</span>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 rounded-xl overflow-hidden" style={{ height: 100, background: form.bg }}>
            <div className="relative h-full flex items-center px-5">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20 select-none">{form.emoji}</div>
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/20 text-white">{form.eyebrow || 'Label'}</span>
                <p className="font-bold text-white text-base mt-1 leading-tight whitespace-pre-line">{form.heading || 'Heading'}</p>
                {form.sub && <p className="text-white/60 text-xs mt-0.5">{form.sub}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-rust text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add slide'}
            </button>
            <button onClick={closeForm} className="text-sm text-muted hover:text-ink px-3 py-2">Cancel</button>
          </div>
        </div>
      )}

      {/* Slides list */}
      {slides.length === 0 ? (
        <div className="bg-paper2 border border-line rounded-xl p-8 text-center text-muted text-sm">
          No custom slides yet — the homepage shows the built-in default slides.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {slides.map((s, i) => (
            <div key={s.id} className="bg-paper2 border border-line rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                {/* Mini preview swatch */}
                <div
                  className="w-12 h-10 rounded-lg shrink-0 flex items-center justify-center text-xl"
                  style={{ background: s.bg }}
                >
                  {s.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{s.heading.replace('\n', ' ')}</p>
                  <p className="text-xs text-muted">{s.eyebrow} · {s.cta}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="flex items-center gap-1 text-xs text-muted cursor-pointer">
                    <input type="checkbox" checked={s.is_active} onChange={e => toggleActive(s.id, e.target.checked)} className="accent-rust w-3.5 h-3.5" />
                    Active
                  </label>
                  <button onClick={() => move(i, 'up')} disabled={i === 0} className="p-1.5 rounded hover:bg-paper transition-colors disabled:opacity-30 text-muted"><ArrowUp size={13} /></button>
                  <button onClick={() => move(i, 'down')} disabled={i === slides.length - 1} className="p-1.5 rounded hover:bg-paper transition-colors disabled:opacity-30 text-muted"><ArrowDown size={13} /></button>
                  <button onClick={() => openEdit(s)} className="text-xs font-semibold text-ink border border-line px-2.5 py-1 rounded-full hover:bg-paper transition-colors">Edit</button>
                  <button onClick={() => deleteSlide(s.id)} className="p-1.5 rounded hover:bg-red-50 transition-colors text-red-500"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
