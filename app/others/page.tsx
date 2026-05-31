import type { Metadata } from 'next'
import { getOtherProducts } from '@/lib/db'
import OtherProductCard from '@/components/OtherProductCard'

export const metadata: Metadata = {
  title: 'Other Products — The Sunrise BookStore',
  description: 'Stationery, electronics, and other products at The Sunrise BookStore.',
}

export default async function OthersPage() {
  const products = await getOtherProducts()

  return (
    <div className="bg-paper2 min-h-screen">
      <div style={{ backgroundColor: '#1b1c2b' }} className="py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-bold text-white text-xl sm:text-2xl">🛍️ Other Products</h1>
          <p className="text-white/50 text-sm mt-1">Stationery, electronics &amp; more</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        {products.length === 0 ? (
          <div className="text-center py-16 text-muted">No products available yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {products.map(p => (
              <OtherProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
