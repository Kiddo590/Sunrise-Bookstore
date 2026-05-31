'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  function toggle() {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    setDark(isDark)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex flex-col items-center text-white hover:text-rust transition-colors text-xs gap-0.5 px-1"
    >
      {dark ? <Sun size={22} /> : <Moon size={22} />}
      <span className="hidden sm:inline whitespace-nowrap">{dark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
