'use client'

import { useEffect, useState } from 'react'
import { StickyNote } from 'lucide-react'

type NotepadSettings = { enabled: boolean; text: string }

export default function Notepad() {
  const [settings, setSettings] = useState<NotepadSettings | null>(null)

  useEffect(() => {
    fetch('/api/site-settings?key=homepage_notepad')
      .then(r => r.json())
      .then(({ value }: { value: string | null }) => {
        if (!value) return
        try {
          setSettings(JSON.parse(value))
        } catch {}
      })
      .catch(() => {})
  }, [])

  if (!settings?.enabled || !settings.text.trim()) return null

  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm">
      <div
        className="shine px-4 py-3 flex items-center gap-2"
        style={{ background: 'linear-gradient(135deg, #f68b1e 0%, #c05000 100%)' }}
      >
        <StickyNote size={15} color="#fff" />
        <span className="text-white text-sm font-bold">Notepad</span>
      </div>
      <div className="p-4">
        <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">{settings.text}</p>
      </div>
    </div>
  )
}
