'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-paper2 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: '#f68b1e' }}
          >
            <span className="text-white font-bold text-2xl font-display">S</span>
          </div>
          <h1 className="font-display font-bold text-ink text-2xl">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to your Sunrise account</p>
        </div>

        <div className="bg-paper rounded-2xl border border-line p-7 shadow-card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper2 focus:outline-none focus:border-rust"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper2 focus:outline-none focus:border-rust"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#f68b1e' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: '#f68b1e' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
