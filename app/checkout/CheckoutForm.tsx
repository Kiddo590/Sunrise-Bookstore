'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCart } from '@/components/CartProvider'
import FormatBadge from '@/components/FormatBadge'
import { money } from '@/lib/format'
import { waOrderLink } from '@/lib/whatsapp'

type Props = {
  userId: string
  defaultName: string
  defaultPhone: string
  defaultEmail: string
}

export default function CheckoutForm({ userId, defaultName, defaultPhone, defaultEmail }: Props) {
  const router = useRouter()
  const { cart, total, clearCart } = useCart()
  const [name, setName] = useState(defaultName)
  const [phone, setPhone] = useState(defaultPhone)
  const [email, setEmail] = useState(defaultEmail)
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error('Please fill in all required fields.')
      return
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty.')
      return
    }
    const waTab = window.open('', '_blank')
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_email: email || null,
          delivery_address: address,
          items: cart,
          total_kes: total,
          user_id: userId,
        }),
      })
      if (!res.ok) throw new Error('Failed to save order')

      const waLink = waOrderLink({ name, phone, address }, cart, total)
      if (waTab) {
        waTab.location.href = waLink
      } else {
        window.location.href = waLink
      }
      clearCart()
      toast.success('Order placed! Check WhatsApp — we\'ll confirm shortly. 📱')
      setTimeout(() => router.push('/account'), 2000)
    } catch {
      waTab?.close()
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-ink text-3xl mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-ink block mb-1">
              Full name <span className="text-rust">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Amina Njoroge"
              className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink block mb-1">
              Phone number <span className="text-rust">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="07XX XXX XXX — WhatsApp number preferred"
              className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink block mb-1">
              Email <span className="text-muted text-xs">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink block mb-1">
              Delivery address <span className="text-rust">*</span>
            </label>
            <textarea
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Estate, street, nearest landmark"
              rows={3}
              className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust resize-none"
            />
          </div>

          <div className="bg-paper2 border border-line rounded-xl p-4">
            <p className="text-ink text-sm">
              💵 <strong>Cash on Delivery</strong> — Pay when your books arrive. We&apos;ll confirm your order on WhatsApp.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || cart.length === 0}
            className="text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-50 text-base"
            style={{ backgroundColor: '#f68b1e' }}
          >
            {submitting ? 'Placing order…' : 'Place order & open WhatsApp →'}
          </button>
        </form>

        {/* Order summary */}
        <div className="bg-paper2 border border-line rounded-xl p-6 h-fit">
          <h2 className="font-display font-semibold text-ink text-xl mb-4">Order summary</h2>
          {cart.length === 0 ? (
            <p className="text-muted text-sm">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.uid} className="flex justify-between items-start gap-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-medium line-clamp-1">{item.title}</p>
                    <FormatBadge format={item.format} />
                  </div>
                  <p className="text-rust font-semibold shrink-0">{money(item.price)}</p>
                </div>
              ))}
              <div className="border-t border-line pt-3 flex justify-between">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-display font-bold text-rust text-xl">{money(total)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
