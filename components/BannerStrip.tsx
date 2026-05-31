'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type Banner = { id: string; image_url: string }

export default function BannerStrip() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.json())
      .then((data: Banner[]) => { if (Array.isArray(data) && data.length) setBanners(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (banners.length < 2) return
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % banners.length)
        setVisible(true)
      }, 400)
    }, 5000)
    return () => clearInterval(t)
  }, [banners.length])

  if (!banners.length) return null

  return (
    <div className="w-full overflow-hidden mt-2 rounded" style={{ height: 120 }}>
      <div
        style={{
          transition: 'opacity 0.4s',
          opacity: visible ? 1 : 0,
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <Image
          src={banners[idx].image_url}
          alt="Promotion"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
