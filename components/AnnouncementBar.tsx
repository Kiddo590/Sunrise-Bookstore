'use client'

import { useState, useEffect } from 'react'

const messages = [
  '🚚 Free delivery on orders over KSh 2,000 within Nairobi CBD',
  '⚡ Ebooks delivered to your email — instantly after payment',
  '📱 Order via WhatsApp · Cash on Delivery available',
  '📚 New titles added every week — check our latest arrivals',
]

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % messages.length)
        setVisible(true)
      }, 300)
    }, 4000)
    return () => clearInterval(t)
  }, [])

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
