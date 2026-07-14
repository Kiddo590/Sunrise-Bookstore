'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Book, CartItem, OtherProduct } from '@/types'

type CartContextType = {
  cart: CartItem[]
  addItem: (book: Book, format: 'hardcopy' | 'ebook') => void
  addOtherProduct: (product: OtherProduct) => void
  removeItem: (uid: string) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sunrise_cart')
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        setCart(parsed.map(item => ({ kind: 'book', ...item })))
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('sunrise_cart', JSON.stringify(cart))
    }
  }, [cart, hydrated])

  function addItem(book: Book, format: 'hardcopy' | 'ebook') {
    const price = format === 'hardcopy' ? (book.price_hard ?? 0) : (book.price_ebook ?? 0)
    const item: CartItem = {
      uid: crypto.randomUUID(),
      kind: 'book',
      bookId: book.id,
      title: book.title,
      format,
      price,
      coverUrl: book.cover_url ?? undefined,
    }
    setCart(prev => [...prev, item])
  }

  function addOtherProduct(product: OtherProduct) {
    const item: CartItem = {
      uid: crypto.randomUUID(),
      kind: 'other',
      productId: product.id,
      title: product.name,
      price: product.price_kes,
      coverUrl: product.cover_url ?? undefined,
    }
    setCart(prev => [...prev, item])
  }

  function removeItem(uid: string) {
    setCart(prev => prev.filter(i => i.uid !== uid))
  }

  function clearCart() {
    setCart([])
  }

  const total = cart.reduce((sum, i) => sum + i.price, 0)
  const count = cart.length

  return (
    <CartContext.Provider value={{ cart, addItem, addOtherProduct, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
