'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'forgot'

export default function AdminLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
    } else if (!data.user) {
      setError('No user returned — check Supabase Authentication → Users')
    } else {
      router.push('/admin')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/admin/reset-password`
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (authError) {
      setError(authError.message)
    } else {
      setSuccess('Check your email for a password reset link.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-paper2 border border-line rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-9 h-9 rounded-full bg-rust flex items-center justify-center text-white font-display font-bold text-lg">
            S
          </span>
          <span className="font-display font-bold text-ink text-lg">
            {mode === 'login' ? 'Admin Login' : 'Reset Password'}
          </span>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-rust text-white font-semibold py-2.5 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
              className="text-sm text-muted hover:text-rust transition-colors text-center"
            >
              Forgot password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="flex flex-col gap-4">
            <p className="text-sm text-muted">Enter your admin email and we'll send you a reset link.</p>
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-rust text-white font-semibold py-2.5 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              className="text-sm text-muted hover:text-rust transition-colors text-center"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
