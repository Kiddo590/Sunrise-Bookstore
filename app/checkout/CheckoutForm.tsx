'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCart } from '@/components/CartProvider'
import FormatBadge from '@/components/FormatBadge'
import { money } from '@/lib/format'
import { waOrderLink } from '@/lib/whatsapp'
import { KENYA_COUNTIES, getDeliveryFee } from '@/lib/kenyaCounties'
import type { OtherProduct } from '@/types'

type Props = {
  userId: string
  defaultName: string
  defaultPhone: string
  defaultEmail: string
  suggestedProducts: OtherProduct[]
}

export default function CheckoutForm({ userId, defaultName, defaultPhone, defaultEmail, suggestedProducts }: Props) {
  const router = useRouter()
  const { cart, total, clearCart, addOtherProduct } = useCart()
  const [name, setName] = useState(defaultName)
  const [phone, setPhone] = useState(defaultPhone)
  const [email, setEmail] = useState(defaultEmail)
  const [address, setAddress] = useState('')
  const [county, setCounty] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const deliveryFee = county ? getDeliveryFee(county) : 0
  const orderTotal = total + deliveryFee

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim() || !county) {
      toast.error('Please fill in all required fields.')
      return
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty.')
      return
    }
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
          county,
          delivery_fee: deliveryFee,
          items: cart,
          total_kes: orderTotal,
          user_id: userId,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Failed to save order')
      }

      const waLink = waOrderLink({ name, phone, address, county }, cart, orderTotal, deliveryFee)
      const anchor = document.createElement('a')
      anchor.href = waLink
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()

      clearCart()
      toast.success('Order placed! Check WhatsApp — we\'ll confirm shortly. 📱')
      setTimeout(() => router.push('/account'), 2000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
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
              County <span className="text-rust">*</span>
            </label>
            <select
              required
              value={county}
              onChange={e => setCounty(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
            >
              <option value="" disabled>Select your county</option>
              {KENYA_COUNTIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {county && (
              <p className="text-muted text-xs mt-1">
                Delivery fee: <strong className="text-ink">{money(deliveryFee)}</strong> {deliveryFee === 200 ? '(Nairobi & Kiambu)' : '(outside Nairobi & Kiambu)'}
              </p>
            )}
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
            disabled={submitting || cart.length === 0 || !county}
            className="text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-50 text-base"
            style={{ backgroundColor: '#f68b1e' }}
          >
            {submitting ? 'Placing order…' : 'Place order & open WhatsApp →'}
          </button>
        </form>

        {/* Right column: upsell + order summary */}
        <div className="flex flex-col gap-4 h-fit">
        {suggestedProducts.length > 0 && (
          <div className="bg-white border border-line rounded-xl p-5">
            <h2 className="font-display font-semibold text-ink text-base mb-3">Would you like to add?</h2>
            <div className="flex flex-col gap-2.5">
              {suggestedProducts.map(product => {
                const added = cart.some(i => i.productId === product.id)
                return (
                  <div key={product.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-ink font-medium line-clamp-1">{product.name}</p>
                      <p className="text-muted text-xs">{money(product.price_kes)}</p>
                    </div>
                    <button
                      type="button"
                      disabled={added}
                      onClick={() => addOtherProduct(product)}
                      className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors disabled:opacity-60 disabled:cursor-default"
                      style={added
                        ? { borderColor: '#3bb77e', color: '#3bb77e', backgroundColor: 'rgba(59,183,126,0.08)' }
                        : { borderColor: '#f68b1e', color: '#f68b1e' }}
                    >
                      {added ? 'Added ✓' : '+ Add'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

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
                    {item.format ? (
                      <FormatBadge format={item.format} />
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border bg-paper2 text-muted border-line">
                        🛍️ Add-on
                      </span>
                    )}
                  </div>
                  <p className="text-rust font-semibold shrink-0">{money(item.price)}</p>
                </div>
              ))}
              <div className="border-t border-line pt-3 flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-ink font-medium">{money(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Delivery fee</span>
                  <span className="text-ink font-medium">{county ? money(deliveryFee) : '—'}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-line">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="font-display font-bold text-rust text-xl">{money(orderTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}
