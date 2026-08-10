'use client'

import { useState } from 'react'

type Props = {
  rating: number
  max?: number
  interactive?: boolean
  onChange?: (n: number) => void
}

export default function StarRating({ rating, max = 5, interactive = false, onChange }: Props) {
  const [hovered, setHovered] = useState(0)

  const display = interactive && hovered ? hovered : rating

  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < display
        return (
          <span
            key={i}
            className={`text-base leading-none select-none ${
              interactive ? 'cursor-pointer' : ''
            }`}
            style={{ color: filled ? '#E9A218' : '#91B199' }}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(i + 1)}
          >
            ★
          </span>
        )
      })}
    </span>
  )
}
