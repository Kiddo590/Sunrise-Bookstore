import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import FlashSaleClient from './FlashSaleClient'
import { money } from '@/lib/format'
import type { Book } from '@/types'

export default async function FlashSalePage() {
  const supabase = createServiceClient()

  const [{ data: setting }, { data: books }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'flash_sale_ends_at').single(),
    supabase.from('books').select('id, title, author, price_hard, price_ebook, discount_pct').eq('is_featured', true).order('title'),
  ])

  const endsAt = setting?.value ?? ''

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-ink text-2xl">⚡ Flash Sale</h1>
        <p className="text-muted text-sm mt-1">Set when the sale ends and see which books are currently featured.</p>
      </div>

      <FlashSaleClient endsAt={endsAt} />

      {/* Featured books list */}
      <div className="mt-8">
        <h2 className="font-semibold text-ink mb-3">
          Books in Flash Sales ({(books ?? []).length})
        </h2>
        {!books?.length ? (
          <p className="text-sm text-muted bg-paper2 border border-line rounded-xl p-5">
            No featured books yet. Go to <Link href="/admin/books" className="text-rust underline">Books</Link>, edit any book, tick <strong>Is Featured</strong>, set a discount %, and save.
          </p>
        ) : (
          <div className="bg-paper2 border border-line rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper">
                  <th className="text-left p-3 text-muted font-semibold">Book</th>
                  <th className="text-left p-3 text-muted font-semibold">Price</th>
                  <th className="text-left p-3 text-muted font-semibold">Discount</th>
                  <th className="text-left p-3 text-muted font-semibold">Sale price</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {(books as Book[]).map(b => {
                  const orig = b.price_hard ?? b.price_ebook ?? 0
                  const disc = b.discount_pct ?? 10
                  const sale = Math.round(orig * (1 - disc / 100))
                  return (
                    <tr key={b.id} className="border-b border-line last:border-0">
                      <td className="p-3">
                        <p className="font-medium text-ink">{b.title}</p>
                        <p className="text-xs text-muted">{b.author}</p>
                      </td>
                      <td className="p-3 text-muted">{orig ? money(orig) : '—'}</td>
                      <td className="p-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff3dc', color: '#013909' }}>
                          -{disc}%
                        </span>
                      </td>
                      <td className="p-3 font-bold" style={{ color: '#074C17' }}>{orig ? money(sale) : '—'}</td>
                      <td className="p-3">
                        <Link href={`/admin/books/${b.id}`} className="text-xs text-rust hover:underline">Edit</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
