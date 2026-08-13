'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function NotepadClient({
  initialEnabled,
  initialText,
}: {
  initialEnabled: boolean
  initialText: string
}) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [text, setText] = useState(initialText)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const res = await fetch('/api/site-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'homepage_notepad', value: JSON.stringify({ enabled, text }) }),
    })
    if (res.ok) {
      toast.success('Notepad saved')
    } else {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <div className="bg-paper2 border border-line rounded-xl p-5 flex flex-col gap-4">
      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-ink">
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
          className="accent-rust w-4 h-4"
        />
        Enabled — show this note on the homepage
      </label>

      <div>
        <label className="text-sm font-semibold text-ink block mb-2">Note text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
          maxLength={500}
          placeholder={`e.g. "A reader lives a thousand lives before he dies." — George R.R. Martin`}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust resize-y"
        />
        <p className="text-xs text-muted mt-1">{text.length}/500</p>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="self-start bg-rust text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>

      <p className="text-xs text-muted">
        The note stays hidden on the homepage if left empty, even while enabled.
      </p>
    </div>
  )
}
