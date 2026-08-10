'use client'

import { useEffect, useState } from 'react'

const quotes = [
  { text: "Until the lion learns to write, every story will glorify the hunter.", author: "Chinua Achebe" },
  { text: "The most courageous act is still to think for yourself. Aloud.", author: "Coco Chanel" },
  { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  { text: "Literature is a conversation between books across centuries and civilisations.", author: "Ngũgĩ wa Thiong'o" },
  { text: "The single story creates stereotypes, and the problem with stereotypes is not that they are untrue, but that they are incomplete.", author: "Chimamanda Ngozi Adichie" },
  { text: "We must all labour to enrich our motherland. The soil is rich if you know where to dig.", author: "Grace Ogola" },
  { text: "When you educate a woman, you educate a nation.", author: "Kenyan Proverb" },
  { text: "Stories can conquer fear, you know. They can make the heart bigger.", author: "Ben Okri" },
]

export default function QuoteBlock() {
  const [quote, setQuote] = useState<typeof quotes[0] | null>(null)

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  if (!quote) return null

  return (
    <div
      className="relative my-12 rounded-2xl overflow-hidden py-14 px-6"
      style={{ background: 'rgba(7,76,23,0.05)', borderLeft: '4px solid #013909' }}
    >
      {/* Oversized decorative quote mark */}
      <div
        className="absolute -top-4 left-4 font-display font-bold text-rust pointer-events-none select-none leading-none"
        style={{ fontSize: '9rem', opacity: 0.08, lineHeight: 1 }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="font-display italic text-2xl sm:text-3xl text-ink leading-relaxed mb-6">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-muted text-sm font-semibold uppercase tracking-widest">
          &mdash;&nbsp;<span style={{ fontVariant: 'small-caps' }}>{quote.author}</span>
        </p>
      </div>
    </div>
  )
}
