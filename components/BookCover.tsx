import Image from 'next/image'
import type { Book } from '@/types'

type Palette = {
  bg: string
  accent: string
  spine: string
  shape: string
}

const palettes: Record<string, Palette> = {
  Fiction: {
    bg: 'linear-gradient(155deg, #12203f 0%, #1e1040 60%, #2a0a3a 100%)',
    accent: 'rgba(130,150,255,0.18)',
    spine: 'rgba(180,180,255,0.18)',
    shape: 'rgba(100,120,220,0.22)',
  },
  Business: {
    bg: 'linear-gradient(155deg, #082215 0%, #0e3020 60%, #163828 100%)',
    accent: 'rgba(60,200,120,0.18)',
    spine: 'rgba(60,200,120,0.2)',
    shape: 'rgba(40,180,100,0.2)',
  },
  'Self-Help': {
    bg: 'linear-gradient(155deg, #280d40 0%, #3a0d28 60%, #440a1a 100%)',
    accent: 'rgba(200,80,200,0.2)',
    spine: 'rgba(200,100,220,0.2)',
    shape: 'rgba(180,60,180,0.22)',
  },
  Romance: {
    bg: 'linear-gradient(155deg, #3a0418 0%, #500820 60%, #5a0a28 100%)',
    accent: 'rgba(255,80,140,0.22)',
    spine: 'rgba(255,160,180,0.18)',
    shape: 'rgba(240,60,120,0.22)',
  },
  History: {
    bg: 'linear-gradient(155deg, #281500 0%, #3a2008 60%, #402808 100%)',
    accent: 'rgba(220,170,50,0.22)',
    spine: 'rgba(220,180,80,0.2)',
    shape: 'rgba(200,150,40,0.25)',
  },
  Children: {
    bg: 'linear-gradient(155deg, #082030 0%, #0a2840 60%, #0a3048 100%)',
    accent: 'rgba(60,220,220,0.22)',
    spine: 'rgba(80,220,220,0.2)',
    shape: 'rgba(40,200,200,0.25)',
  },
  Poetry: {
    bg: 'linear-gradient(155deg, #130830 0%, #1e0a48 60%, #280858 100%)',
    accent: 'rgba(160,100,255,0.22)',
    spine: 'rgba(160,120,255,0.2)',
    shape: 'rgba(140,80,255,0.22)',
  },
  Biography: {
    bg: 'linear-gradient(155deg, #1a0e00 0%, #2a1a04 60%, #321e06 100%)',
    accent: 'rgba(200,150,60,0.22)',
    spine: 'rgba(200,160,80,0.2)',
    shape: 'rgba(180,130,40,0.25)',
  },
  Science: {
    bg: 'linear-gradient(155deg, #040e28 0%, #081838 60%, #0a2040 100%)',
    accent: 'rgba(40,180,255,0.22)',
    spine: 'rgba(60,180,255,0.2)',
    shape: 'rgba(20,160,255,0.25)',
  },
}

const defaultPalette: Palette = {
  bg: 'linear-gradient(155deg, #0d1f17 0%, #1e3a2b 60%, #162e22 100%)',
  accent: 'rgba(80,200,120,0.18)',
  spine: 'rgba(100,200,130,0.18)',
  shape: 'rgba(60,180,100,0.22)',
}

type Props = {
  book: Book
  height?: number
}

export default function BookCover({ book, height = 200 }: Props) {
  if (book.cover_url) {
    return (
      <div className="relative w-full overflow-hidden group-hover:[transform:scale(1.02)] transition-transform duration-500" style={{ height }}>
        <Image
          src={book.cover_url}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
    )
  }

  const palette = palettes[book.category ?? ''] ?? defaultPalette

  return (
    <div
      className="relative w-full overflow-hidden group-hover:[transform:scale(1.02)] transition-transform duration-500"
      style={{ height, background: palette.bg }}
    >
      {/* Large decorative circle — top right */}
      <div
        className="absolute rounded-full"
        style={{
          width: height * 0.9,
          height: height * 0.9,
          top: '-20%',
          right: '-15%',
          background: palette.shape,
        }}
      />

      {/* Small accent circle — bottom left */}
      <div
        className="absolute rounded-full"
        style={{
          width: height * 0.4,
          height: height * 0.4,
          bottom: '-10%',
          left: '-8%',
          background: palette.accent,
        }}
      />

      {/* Diagonal accent stripe */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'repeating-linear-gradient(-55deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, transparent 1px, transparent 12px)',
        }}
      />

      {/* Left spine strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5"
        style={{ background: `linear-gradient(to right, ${palette.spine}, transparent)` }}
      />

      {/* Right inner shadow for depth */}
      <div
        className="absolute right-0 top-0 bottom-0 w-4"
        style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.25), transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-4 pt-5">
        {book.category && (
          <p
            className="text-[9px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60"
            style={{ color: 'white', fontFamily: 'var(--font-body)' }}
          >
            {book.category}
          </p>
        )}

        <p
          className="font-bold leading-tight flex-1"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'white',
            fontSize: height < 180 ? '0.9rem' : '1.1rem',
            lineHeight: '1.25',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {book.title}
        </p>

        <div className="mt-auto pt-3">
          <p
            className="text-[10px] font-semibold opacity-60 uppercase tracking-widest"
            style={{ color: 'white', fontFamily: 'var(--font-body)' }}
          >
            {book.author}
          </p>
          <p
            className="text-[8px] opacity-30 mt-1 tracking-widest font-bold uppercase"
            style={{ color: 'white', fontFamily: 'var(--font-body)' }}
          >
            Sunrise
          </p>
        </div>
      </div>
    </div>
  )
}
