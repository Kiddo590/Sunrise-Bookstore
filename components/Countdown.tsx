'use client'

import { useEffect, useState } from 'react'

function getTimeToMidnight() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diff = Math.max(0, midnight.getTime() - now.getTime())
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { h, m, s }
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeToMidnight())

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeToMidnight()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-2 text-paper/70 text-sm">
      <span>Ends in</span>
      <span className="font-mono font-bold text-paper">
        {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
      </span>
    </div>
  )
}
