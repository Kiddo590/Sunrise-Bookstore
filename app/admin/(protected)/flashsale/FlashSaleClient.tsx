'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function FlashSaleClient({ endsAt }: { endsAt: string }) {
  const [value, setValue] = useState(() => {
    if (!endsAt) return ''
    // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
    try {
      const d = new Date(endsAt)
      if (isNaN(d.getTime())) return ''
      return d.toISOString().slice(0, 16)
    } catch { return '' }
  })
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!value) return
    setSaving(true)
    const res = await fetch('/api/site-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'flash_sale_ends_at', value: new Date(value).toISOString() }),
    })
    if (res.ok) {
      toast.success('Sale end time saved — countdown on storefront updated')
    } else {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <div className="bg-paper2 border border-line rounded-xl p-5">
      <label className="text-sm font-semibold text-ink block mb-2">Flash sale ends at</label>
      <div className="flex gap-3 items-center flex-wrap">
        <input
          type="datetime-local"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
        />
        <button
          onClick={save}
          disabled={saving || !value}
          className="bg-rust text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      <p className="text-xs text-muted mt-2">
        The countdown on the storefront will count down to this exact date and time.
        When it reaches zero it shows "Sale ended".
      </p>
    </div>
  )
}
