'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { HeroSlide } from '@/types'

const DEFAULT_SLIDES: Omit<HeroSlide, 'id' | 'position' | 'is_active'>[] = [
  {
    bg: 'linear-gradient(120deg, #1b1c2b 0%, #2a1f3d 100%)',
    eyebrow: 'New Arrivals',
    heading: 'Fresh titles in<br />stock this week',
    sub: 'Hardcopy & Ebook formats available',
    cta: 'Shop Now',
    href: '/shop',
    emoji: '📚',
    image_url: null,
    image_public_id: null,
  },
  {
    bg: 'linear-gradient(120deg, #d97b18 0%, #f68b1e 100%)',
    eyebrow: 'Instant Access',
    heading: 'Ebooks ready<br />to download',
    sub: 'Read on any device, delivered in minutes',
    cta: 'Browse Ebooks',
    href: '/shop',
    emoji: '⚡',
    image_url: null,
    image_public_id: null,
  },
  {
    bg: 'linear-gradient(120deg, #0d2018 0%, #1a3a2b 100%)',
    eyebrow: 'Free Delivery',
    heading: 'Orders over<br />KSh 2,000',
    sub: 'Free delivery anywhere in Nairobi CBD',
    cta: 'Order Now',
    href: '/shop',
    emoji: '🚚',
    image_url: null,
    image_public_id: null,
  },
  {
    bg: 'linear-gradient(120deg, #a81020 0%, #e31837 100%)',
    eyebrow: 'Flash Deals',
    heading: 'Up to 30% off<br />selected titles',
    sub: 'Limited time — while stocks last',
    cta: 'See Deals',
    href: '/shop',
    emoji: '🔥',
    image_url: null,
    image_public_id: null,
  },
  {
    bg: 'linear-gradient(120deg, #0a1230 0%, #1a2050 100%)',
    eyebrow: "Can't find it?",
    heading: 'Request any<br />book you want',
    sub: "We'll source it and deliver to you",
    cta: 'Request a Book',
    href: '/request',
    emoji: '🔍',
    image_url: null,
    image_public_id: null,
  },
]

type Slide = {
  eyebrow: string
  heading: string
  sub: string | null
  cta: string
  href: string
  bg: string
  emoji: string | null
  image_url: string | null
}

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
  // Determine accent color for badge/button: light bg → dark text, dark bg → orange accent
  const accentColor = s.bg.includes('#f68b1e') || s.bg.includes('#d97b18') || s.bg.includes('#e31837') || s.bg.includes('#a81020')
    ? '#ffffff'
    : '#f68b1e'

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
            className="relative flex items-center bg-cover bg-center"
            style={
              sl.image_url
                ? { width: `${100 / slides.length}%`, backgroundImage: `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)), url(${sl.image_url})`, flexShrink: 0 }
                : { width: `${100 / slides.length}%`, background: sl.bg, flexShrink: 0 }
            }
          >
            {!sl.image_url && (
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none"
                style={{ fontSize: 80, opacity: 0.15 }}
                aria-hidden="true"
              >
                {sl.emoji}
              </div>
            )}
            <div className="relative z-10 px-5 py-4">
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                style={{
                  backgroundColor: accentColor === '#ffffff' ? 'rgba(255,255,255,0.25)' : accentColor,
                  color: '#fff',
                }}
              >
                {sl.eyebrow}
              </span>
              <h2
                className="font-bold text-white text-lg sm:text-2xl leading-tight mb-1.5"
                dangerouslySetInnerHTML={{ __html: sl.heading }}
              />
              {sl.sub && <p className="text-white/60 text-xs mb-3 max-w-[200px] leading-snug" dangerouslySetInnerHTML={{ __html: sl.sub }} />}
              <Link
                href={sl.href}
                className="inline-block text-xs font-bold px-4 py-1.5 rounded transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: accentColor === '#ffffff' ? 'white' : accentColor,
                  color: accentColor === '#ffffff' ? '#1b1c2b' : '#fff',
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
              backgroundColor: i === index ? '#f68b1e' : 'rgba(255,255,255,0.5)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
