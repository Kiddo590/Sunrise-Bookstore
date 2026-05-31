'use client'

import { useEffect, useState } from 'react'

function getTimeToMidnight() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  return Math.max(0, midnight.getTime() - now.getTime())
}

function msToHMS(ms: number) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return { h, m, s }
}

export default function Countdown() {
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    fetch('/api/site-settings?key=flash_sale_ends_at')
      .then(r => r.json())
      .then(({ value }) => {
        if (value) {
          const ts = new Date(value).getTime()
          if (!isNaN(ts) && ts > Date.now()) {
            setEndsAt(ts)
            setRemaining(ts - Date.now())
            return
          }
        }
        // fallback: count to midnight
        setRemaining(getTimeToMidnight())
      })
      .catch(() => setRemaining(getTimeToMidnight()))
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(prev => {
        if (endsAt) return Math.max(0, endsAt - Date.now())
        return Math.max(0, prev - 1000)
      })
    }, 1000)
    return () => clearInterval(id)
  }, [endsAt])

  const pad = (n: number) => String(n).padStart(2, '0')
  const { h, m, s } = msToHMS(remaining)

  if (remaining === 0) {
    return <span className="font-mono font-bold text-paper/50">Sale ended</span>
  }

  return (
    <div className="flex items-center gap-2 text-paper/70 text-sm">
      <span>Ends in</span>
      <span className="font-mono font-bold text-paper">
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  )
}
