'use client'

import { useState, useEffect } from 'react'

const DEFAULTS = [
  '🚚 Free delivery on orders over KSh 2,000 within Nairobi CBD',
  '⚡ Ebooks delivered to your email — instantly after payment',
  '📱 Order via WhatsApp · Cash on Delivery available',
  '📚 New titles added every week — check our latest arrivals',
]

type Announcement = { id: string; message: string }

export default function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>(DEFAULTS)
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then((data: Announcement[]) => {
        if (Array.isArray(data) && data.length) {
          setMessages(data.map(a => a.message))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (messages.length < 2) return
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % messages.length)
        setVisible(true)
      }, 300)
    }, 5000)
    return () => clearInterval(t)
  }, [messages.length])

  return (
    <div
      className="text-white text-xs py-2 text-center font-medium overflow-hidden"
      style={{ backgroundColor: '#1b1c2b' }}
    >
      <span
        style={{
          display: 'inline-block',
          transition: 'opacity 0.3s',
          opacity: visible ? 1 : 0,
        }}
      >
        {messages[idx]}
      </span>
    </div>
  )
}
