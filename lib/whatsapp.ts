import type { CartItem, BookRequest } from '@/types'

const BASE = 'https://wa.me/254143304460'

export function waOrderLink(
  form: { name: string; phone: string; address: string; county: string },
  cart: CartItem[],
  total: number,
  deliveryFee: number
) {
  const lines = cart
    .map(i => `• ${i.title}${i.format ? ` (${i.format})` : ''} — KSh ${i.price.toLocaleString()}`)
    .join('\n')
  const msg = [
    `Hi Flemela Bookstore! I'd like to place an order:`,
    lines,
    `Delivery fee (${form.county}): KSh ${deliveryFee.toLocaleString()}`,
    `Total: KSh ${total.toLocaleString()}`,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    `County: ${form.county}`,
    `Delivery address: ${form.address}`,
    `Payment: Cash on Delivery`,
  ].join('\n')
  return `${BASE}?text=${encodeURIComponent(msg)}`
}

export function waHelpLink(msg = 'Hi Flemela Bookstore, I need help with an order.') {
  return `${BASE}?text=${encodeURIComponent(msg)}`
}

export function waRequestLink(req: BookRequest) {
  const msg = [
    `📚 Book Request:`,
    `Title: ${req.title}`,
    `Author: ${req.author ?? '—'}`,
    `Format: ${req.format}`,
    `Phone: ${req.phone}`,
    `Notes: ${req.notes ?? '—'}`,
  ].join('\n')
  return `${BASE}?text=${encodeURIComponent(msg)}`
}
