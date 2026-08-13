import type { Metadata } from 'next'
import { getOtherProducts } from '@/lib/db'
import OtherProductCard from '@/components/OtherProductCard'

export const metadata: Metadata = {
  title: 'Other Products — The Flemela Bookstore',
  description: 'Stationery, electronics, and other products at The Flemela Bookstore.',
}

export default async function OthersPage() {
  const products = await getOtherProducts()

  return (
    <div className="bg-paper2 min-h-screen">
      <div className="shine py-6 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, #0d6e4b 0%, #0a5238 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">The Flemela Bookstore</p>
          <h1 className="font-bold text-white text-2xl sm:text-3xl">🛍️ Other Products</h1>
          <p className="text-white/60 text-sm mt-1">Stationery, electronics &amp; more</p>
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
