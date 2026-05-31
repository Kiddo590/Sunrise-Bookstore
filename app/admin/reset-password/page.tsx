'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      router.push('/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-paper2 border border-line rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-9 h-9 rounded-full bg-rust flex items-center justify-center text-white font-display font-bold text-lg">
            S
          </span>
          <span className="font-display font-bold text-ink text-lg">Set New Password</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-ink block mb-1">New password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink block mb-1">Confirm password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-rust text-white font-semibold py-2.5 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Set new password'}
          </button>
        </form>
      </div>
    </div>
  )
}
