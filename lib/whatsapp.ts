import type { CartItem, BookRequest } from '@/types'

const BASE = 'https://wa.me/254143304460'

export function waOrderLink(
  form: { name: string; phone: string; address: string },
  cart: CartItem[],
  total: number
) {
  const lines = cart
    .map(i => `• ${i.title} (${i.format}) — KSh ${i.price.toLocaleString()}`)
    .join('\n')
  const msg = [
    `Hi Sunrise Bookstore! I'd like to place an order:`,
    lines,
    `Total: KSh ${total.toLocaleString()}`,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    `Delivery address: ${form.address}`,
    `Payment: Cash on Delivery`,
  ].join('\n')
  return `${BASE}?text=${encodeURIComponent(msg)}`
}

export function waHelpLink(msg = 'Hi Sunrise Bookstore, I need help with an order.') {
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
