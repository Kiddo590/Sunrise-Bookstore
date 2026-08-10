'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { HeroSlide } from '@/types'

const DEFAULT_SLIDES: Omit<HeroSlide, 'id' | 'position' | 'is_active'>[] = [
  {
    bg: 'linear-gradient(120deg, #013909 0%, #074C17 100%)',
    eyebrow: 'New Arrivals',
    heading: 'Fresh titles in\nstock this week',
    sub: 'Hardcopy & Ebook formats available',
    cta: 'Shop Now',
    href: '/shop',
    emoji: '📚',
  },
  {
    bg: 'linear-gradient(120deg, #074C17 0%, #013909 100%)',
    eyebrow: 'Instant Access',
    heading: 'Ebooks ready\nto download',
    sub: 'Read on any device, delivered in minutes',
    cta: 'Browse Ebooks',
    href: '/shop',
    emoji: '⚡',
  },
  {
    bg: 'linear-gradient(120deg, #0d2018 0%, #1a3a2b 100%)',
    eyebrow: 'Free Delivery',
    heading: 'Orders over\nKSh 2,000',
    sub: 'Free delivery anywhere in Nairobi CBD',
    cta: 'Order Now',
    href: '/shop',
    emoji: '🚚',
  },
  {
    bg: 'linear-gradient(120deg, #a81020 0%, #e31837 100%)',
    eyebrow: 'Flash Deals',
    heading: 'Up to 30% off\nselected titles',
    sub: 'Limited time — while stocks last',
    cta: 'See Deals',
    href: '/shop',
    emoji: '🔥',
  },
  {
    bg: 'linear-gradient(120deg, #0a1230 0%, #1a2050 100%)',
    eyebrow: "Can't find it?",
    heading: 'Request any\nbook you want',
    sub: "We'll source it and deliver to you",
    cta: 'Request a Book',
    href: '/request',
    emoji: '🔍',
  },
]

type Slide = { eyebrow: string; heading: string; sub: string | null; cta: string; href: string; bg: string; emoji: string | null }

export default function HeroBanner({ slides: initialSlides }: { slides?: Slide[] }) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides ?? DEFAULT_SLIDES)
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // If no slides were passed via props, try fetching from API
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) return
    fetch('/api/hero-slides')
      .then(r => r.json())
      .then((data: Slide[]) => { if (Array.isArray(data) && data.length) setSlides(data) })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [slides.length])

  const s = slides[index] ?? DEFAULT_SLIDES[0]
  // Accent for badge/button: sale-red bg → white, dark green bg → gold
  const accentColor = s.bg.includes('#e31837') || s.bg.includes('#a81020')
    ? '#ffffff'
    : '#E9A218'

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: 176 }}
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <div
        className="flex h-full"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${(index * 100) / slides.length}%)`,
          transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {slides.map((sl, i) => (
          <div
            key={i}
            className="relative flex items-center"
            style={{ width: `${100 / slides.length}%`, background: sl.bg, flexShrink: 0 }}
          >
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none"
              style={{ fontSize: 80, opacity: 0.15 }}
              aria-hidden="true"
            >
              {sl.emoji}
            </div>
            <div className="relative z-10 px-5 py-4">
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                style={{
                  backgroundColor: accentColor === '#ffffff' ? 'rgba(255,255,255,0.25)' : accentColor,
                  color: accentColor === '#ffffff' ? '#fff' : '#013909',
                }}
              >
                {sl.eyebrow}
              </span>
              <h2 className="font-bold text-white text-lg sm:text-2xl leading-tight mb-1.5 whitespace-pre-line">
                {sl.heading}
              </h2>
              {sl.sub && <p className="text-white/60 text-xs mb-3 max-w-[200px] leading-snug">{sl.sub}</p>}
              <Link
                href={sl.href}
                className="inline-block text-xs font-bold px-4 py-1.5 rounded transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: accentColor === '#ffffff' ? 'white' : accentColor,
                  color: '#013909',
                }}
              >
                {sl.cta} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === index ? 20 : 6,
              height: 6,
              backgroundColor: i === index ? '#E9A218' : 'rgba(255,255,255,0.5)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
