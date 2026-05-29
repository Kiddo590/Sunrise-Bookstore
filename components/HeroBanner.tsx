'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const slides = [
  {
    bg: 'linear-gradient(120deg, #1b1c2b 0%, #2a1f3d 100%)',
    eyebrow: 'New Arrivals',
    heading: 'Fresh titles in\nstock this week',
    sub: 'Hardcopy & Ebook formats available',
    cta: 'Shop Now',
    href: '/shop',
    accent: '#f68b1e',
    emoji: '📚',
  },
  {
    bg: 'linear-gradient(120deg, #d97b18 0%, #f68b1e 100%)',
    eyebrow: 'Instant Access',
    heading: 'Ebooks ready\nto download',
    sub: 'Read on any device, delivered in minutes',
    cta: 'Browse Ebooks',
    href: '/shop',
    accent: '#fff',
    emoji: '⚡',
  },
  {
    bg: 'linear-gradient(120deg, #0d2018 0%, #1a3a2b 100%)',
    eyebrow: 'Free Delivery',
    heading: 'Orders over\nKSh 2,000',
    sub: 'Free delivery anywhere in Nairobi CBD',
    cta: 'Order Now',
    href: '/shop',
    accent: '#f68b1e',
    emoji: '🚚',
  },
  {
    bg: 'linear-gradient(120deg, #a81020 0%, #e31837 100%)',
    eyebrow: 'Flash Deals',
    heading: 'Up to 30% off\nselected titles',
    sub: 'Limited time — while stocks last',
    cta: 'See Deals',
    href: '/shop',
    accent: '#fff',
    emoji: '🔥',
  },
  {
    bg: 'linear-gradient(120deg, #0a1230 0%, #1a2050 100%)',
    eyebrow: 'Can\'t find it?',
    heading: 'Request any\nbook you want',
    sub: 'We\'ll source it and deliver to you',
    cta: 'Request a Book',
    href: '/request',
    accent: '#f68b1e',
    emoji: '🔍',
  },
]

export default function HeroBanner() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function start() {
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, 3000)
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    start()
    return stop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: 176 }}
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      {/* Slides */}
      <div
        className="flex h-full"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${(index * 100) / slides.length}%)`,
          transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative flex items-center"
            style={{
              width: `${100 / slides.length}%`,
              background: s.bg,
              flexShrink: 0,
            }}
          >
            {/* Big emoji bg decoration */}
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none"
              style={{ fontSize: 80, opacity: 0.15 }}
              aria-hidden="true"
            >
              {s.emoji}
            </div>

            <div className="relative z-10 px-5 py-4">
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                style={{ backgroundColor: s.accent === '#fff' ? 'rgba(255,255,255,0.25)' : s.accent, color: '#fff' }}
              >
                {s.eyebrow}
              </span>
              <h2
                className="font-bold text-white text-lg sm:text-2xl leading-tight mb-1.5 whitespace-pre-line"
              >
                {s.heading}
              </h2>
              <p className="text-white/60 text-xs mb-3 max-w-[200px] leading-snug">{s.sub}</p>
              <Link
                href={s.href}
                className="inline-block text-xs font-bold px-4 py-1.5 rounded transition-opacity hover:opacity-90"
                style={{ backgroundColor: s.accent === '#fff' ? 'white' : s.accent, color: s.accent === '#fff' ? '#1b1c2b' : '#fff' }}
              >
                {s.cta} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === index ? 20 : 6,
              height: 6,
              backgroundColor: i === index ? '#f68b1e' : 'rgba(255,255,255,0.5)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
