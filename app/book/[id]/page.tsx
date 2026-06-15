import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBookById, getApprovedReviewsForBook } from '@/lib/db'
import type { Review } from '@/types'
import BookCover from '@/components/BookCover'
import ReviewCard from '@/components/ReviewCard'
import StarRating from '@/components/StarRating'
import { money } from '@/lib/format'
import FormatSelector from './FormatSelector'
import ReviewFormClient from './ReviewFormClient'
import { ChevronRight, ClipboardList, Heart, MessageSquare, PackageCheck, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const book = await getBookById(id)
  if (!book) return { title: 'Book not found — Sunrise Bookstore' }
  return {
    title: `${book.title} by ${book.author} — Sunrise Bookstore`,
    description: book.description ?? undefined,
  }
}

export default async function BookPage({ params }: Props) {
  const { id } = await params

  const [book, reviews] = await Promise.all([
    getBookById(id),
    getApprovedReviewsForBook(id),
  ])

  if (!book) notFound()

  const avgRating =
    reviews.length > 0
      ? Math.round(reviews.reduce((sum, r: Review) => sum + r.rating, 0) / reviews.length)
      : 0
  const currentPrice = book.price_hard ?? book.price_ebook
  const discountPct = book.discount_pct ?? null
  const oldPrice = currentPrice && discountPct
    ? Math.round(currentPrice / (1 - discountPct / 100))
    : null
  const comparePrice = currentPrice ? Math.round(currentPrice * 1.39) : null

  return (
    <div className="bg-paper2 min-h-screen">
      <div className="w-full px-5 py-3">
        <nav className="flex items-center gap-2 text-lg text-ink mb-6 overflow-hidden" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-rust transition-colors shrink-0">Home</Link>
          <span className="text-line">/</span>
          <Link href="/shop" className="hover:text-rust transition-colors shrink-0">Books, Movies and Music</Link>
          <span className="text-line hidden sm:inline">/</span>
          <Link href="/shop" className="hidden sm:inline hover:text-rust transition-colors shrink-0">Education & Learning</Link>
          {book.category && (
            <>
              <span className="text-line">/</span>
              <Link href={`/shop?category=${encodeURIComponent(book.category)}`} className="hover:text-rust transition-colors shrink-0">
                {book.category}
              </Link>
            </>
          )}
          <span className="text-line">/</span>
          <span className="text-ink truncate">{book.title}</span>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] gap-6 items-start">
          <div className="bg-white rounded shadow-sm min-h-[630px] md:grid md:grid-cols-[460px_minmax(0,1fr)]">
            <div className="px-6 pt-6 pb-5 lg:border-r border-line">
              <div className="h-[460px] bg-white flex items-center justify-center overflow-hidden">
                <div className="w-[336px] h-[460px] max-w-full">
                  <BookCover book={book} height={460} fit="contain" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-5 mt-3 max-w-[192px]">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`h-[60px] border rounded overflow-hidden bg-white ${i === 0 ? 'border-rust' : 'border-line'}`}>
                    <BookCover book={book} height={58} fit="contain" />
                  </div>
                ))}
              </div>
              <div className="border-t border-line mt-7 pt-4">
                <p className="text-lg font-semibold uppercase text-ink mb-5">Share this product</p>
                <div className="flex gap-2">
                  <span className="w-10 h-10 rounded-full border border-ink flex items-center justify-center text-lg font-bold text-ink">f</span>
                  <span className="w-10 h-10 rounded-full border border-ink flex items-center justify-center text-lg font-bold text-ink">x</span>
                  <span className="w-10 h-10 rounded-full border border-ink flex items-center justify-center text-sm font-bold text-ink">wa</span>
                </div>
              </div>
            </div>

            <div className="px-6 pt-6 pb-4">
              <div className="border-b border-line pb-4 relative">
                <button className="absolute right-0 top-0 text-rust" aria-label="Add to wishlist">
                  <Heart size={34} strokeWidth={1.8} />
                </button>
                <h1 className="text-ink text-3xl leading-tight pr-12">{book.title}</h1>
              </div>

              <div className="py-4 border-b border-line">
                {currentPrice != null && (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-4xl font-bold text-rust">{money(currentPrice)}</p>
                    {oldPrice && (
                      <>
                        <span className="text-muted line-through text-xl">{money(oldPrice)}</span>
                        <span className="bg-rust/10 text-rust text-lg px-2 py-1 rounded">-{discountPct}%</span>
                      </>
                    )}
                  </div>
                )}
                <p className={`text-lg mt-3 ${book.in_stock ? 'text-ink' : 'text-red-600'}`}>
                  {book.in_stock ? 'In stock' : 'Out of stock'}
                </p>
                <p className="text-lg text-ink mt-2">+ shipping from <strong>KSh 90</strong> to CBD - UON/Globe/Koja/River Road</p>
                <div className="flex items-center gap-2 mt-3">
                  <StarRating rating={avgRating} />
                  <span className="text-xl text-muted">
                    {reviews.length > 0
                      ? `(${reviews.length} verified rating${reviews.length === 1 ? '' : 's'})`
                      : '(No ratings available)'}
                  </span>
                </div>
              </div>

              <div className="py-5 border-b border-line">
                <FormatSelector
                  book={book}
                  showFormat={false}
                  showWhatsApp
                  showNote={false}
                  buttonClassName="h-[72px] text-2xl"
                />
              </div>

              <div className="py-5 border-b border-line">
                <div className="flex justify-between gap-4 text-xl">
                  <p><strong>2 offers</strong> starting from <strong className="text-rust">{currentPrice ? money(currentPrice) : 'KSh 0'}</strong></p>
                  <a href="#compare-offers" className="text-blue-600">See More Offers</a>
                </div>
              </div>

              <div className="py-4">
                <h2 className="text-2xl uppercase text-ink mb-6">Promotions</h2>
                <div className="space-y-3 text-xl">
                  <p className="flex gap-3 text-blue-600">
                    <ShieldCheck className="text-blue-500 shrink-0" size={28} />
                    Easy and safer payments via the JumiaPay App.
                  </p>
                  <a href="#product-details" className="block text-blue-600 mt-28">Report incorrect product information</a>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded shadow-sm">
              <h2 className="text-2xl font-semibold uppercase text-ink p-4 border-b border-line">Delivery & Returns</h2>
              <div className="p-4 border-b border-line">
                <p className="text-2xl font-semibold text-ink">Choose your location</p>
                <div className="grid grid-cols-1 gap-6 mt-6">
                  <select className="border border-muted/60 rounded px-6 py-4 text-2xl bg-white text-ink">
                    <option>Nairobi</option>
                    <option>Kiambu</option>
                  </select>
                  <select className="border border-muted/60 rounded px-6 py-4 text-2xl bg-white text-ink">
                    <option>CBD - UON/Globe/Koja/River Road</option>
                    <option>Westlands</option>
                    <option>Kilimani</option>
                  </select>
                </div>
              </div>
              <div className="p-4 border-b border-line flex gap-3">
                <div className="w-14 h-14 rounded border border-line flex items-center justify-center shrink-0">
                  <PackageCheck size={32} />
                </div>
                <div className="text-lg">
                  <div className="flex justify-between gap-4">
                    <p className="text-2xl font-semibold text-ink">Pickup Station</p>
                    <span className="text-blue-600 text-base">Details</span>
                  </div>
                  <p>Delivery Fees <strong>KSh 90</strong></p>
                  <p>Ready for pickup within 1-2 business days after confirmation.</p>
                </div>
              </div>
              <div className="p-4 border-b border-line flex gap-3">
                <div className="w-14 h-14 rounded border border-line flex items-center justify-center shrink-0">
                  <Truck size={32} />
                </div>
                <div className="text-lg">
                  <div className="flex justify-between gap-4">
                    <p className="text-2xl font-semibold text-ink">Door Delivery</p>
                    <span className="text-blue-600 text-base">Details</span>
                  </div>
                  <p>Delivery Fees <strong>KSh 200</strong></p>
                  <p>Ready for delivery within 1-2 business days after confirmation.</p>
                </div>
              </div>
              <div className="p-4 flex gap-3">
                <div className="w-14 h-14 rounded border border-line flex items-center justify-center shrink-0">
                  <RotateCcw size={32} />
                </div>
                <div className="text-lg">
                  <p className="text-2xl font-semibold text-ink">Return Policy</p>
                  <p>Easy Return, Quick Refund. <span className="text-blue-600">Details</span></p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm">
              <h2 className="text-2xl font-semibold uppercase text-ink p-4 border-b border-line flex items-center justify-between">
                Seller Information
                <ChevronRight size={26} />
              </h2>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold text-ink">The Sunrise BookStore</p>
                    <p className="text-lg"><strong>90%</strong> Seller Score</p>
                    <p className="text-lg"><strong>33</strong> Followers</p>
                  </div>
                  <button className="bg-rust text-white px-6 py-3 rounded font-bold shadow-sm">Follow</button>
                </div>
                <div className="border-t border-line mt-4 pt-4">
                  <p className="text-2xl font-semibold mb-3">Seller Performance</p>
                  <p className="text-lg">Shipping speed: <strong>Average</strong></p>
                  <p className="text-lg">Customer Rating: <strong>Excellent</strong></p>
                  <p className="text-lg">Cancellation Rate: <strong>Very Low</strong></p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] gap-6 mt-6 items-start">
          <div className="space-y-6">
            <div id="compare-offers" className="bg-white rounded shadow-sm">
              <h2 className="text-3xl font-semibold text-ink p-6 border-b border-line">Compare Offers</h2>
              <div className="m-6 border border-line rounded p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold text-rust">{comparePrice ? money(comparePrice) : 'KSh 0'}</p>
                  <p className="text-lg text-muted mt-1">Sold by: The Sunrise BookStore | Seller Score: 90%</p>
                </div>
                <button className="bg-rust text-white font-bold px-8 py-4 rounded">Buy now</button>
              </div>
            </div>

            <div id="product-details" className="bg-white rounded shadow-sm">
              <h2 className="text-3xl font-semibold text-ink p-6 border-b border-line">Product details</h2>
              <div className="p-6 text-2xl text-ink leading-snug">
                {book.description ? (
                  <p>{book.description}</p>
                ) : (
                  <p>No product description has been added yet.</p>
                )}
              </div>
            </div>

            <div id="specifications" className="bg-white rounded shadow-sm">
              <h2 className="text-3xl font-semibold text-ink p-6 border-b border-line">Specifications</h2>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-2xl">
                <div className="border border-line rounded">
                  <h3 className="font-semibold uppercase text-ink p-6 border-b border-line">Key Features</h3>
                  <ol className="list-decimal pl-10 p-6 text-ink space-y-1">
                    <li>{book.category ?? 'Other'} book</li>
                    <li>{book.author}</li>
                    <li>{book.price_ebook != null ? 'Ebook format available' : 'Hardcopy format available'}</li>
                    <li>{book.title}</li>
                  </ol>
                </div>
                <div className="border border-line rounded">
                  <h3 className="font-semibold uppercase text-ink p-6 border-b border-line">What&apos;s in the box</h3>
                  <p className="p-6">1 Book</p>
                </div>
                <div className="border border-line rounded md:col-span-1">
                  <h3 className="font-semibold uppercase text-ink p-6 border-b border-line">Specifications</h3>
                  <ul className="p-6 space-y-3 text-ink">
                    <li><strong>SKU:</strong> SUN-{book.id.slice(0, 8).toUpperCase()}</li>
                    <li><strong>Weight (kg):</strong> 0.8</li>
                    <li><strong>Main Material:</strong> paper</li>
                    <li><strong>Shop Type:</strong> Sunrise Mall</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm">
              <h2 className="text-3xl font-semibold text-ink p-6 border-b border-line">Customers who viewed this also viewed</h2>
              <div className="p-6 flex gap-12 overflow-hidden">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-36 shrink-0">
                    <BookCover book={book} height={180} fit="contain" />
                    <p className="text-sm text-ink line-clamp-2 mt-2">{book.title}</p>
                    {currentPrice != null && <p className="font-bold text-rust">{money(currentPrice)}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div id="customer-feedback" className="bg-white rounded shadow-sm">
              <h2 className="text-3xl font-semibold text-ink p-6 border-b border-line">Customer Feedback</h2>
              <div className="p-6">
                {reviews.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {reviews.map(r => (
                      <ReviewCard key={r.id} review={r} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted text-xl">This product has no ratings yet.</p>
                  </div>
                )}
                <ReviewFormClient bookId={id} />
              </div>
            </div>
          </div>

          <aside className="hidden lg:block space-y-6 sticky top-28">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              {[
                ['Compare Offers', '#compare-offers', ShoppingBag],
                ['Product details', '#product-details', ClipboardList],
                ['Specifications', '#specifications', ClipboardList],
                ['Customer Feedback', '#customer-feedback', MessageSquare],
              ].map(([label, href, Icon], index) => {
                const IconComponent = Icon as typeof ShoppingBag
                return (
                  <a
                    key={label as string}
                    href={href as string}
                    className={`flex items-center gap-8 px-8 py-6 text-2xl border-b border-line last:border-b-0 ${
                      index === 0 ? 'bg-muted/20' : 'bg-white'
                    }`}
                  >
                    <IconComponent size={30} />
                    <span>{label as string}</span>
                  </a>
                )
              })}
            </div>

            <div className="bg-white rounded shadow-sm p-4">
              <div className="flex gap-5">
                <div className="w-28 shrink-0">
                  <BookCover book={book} height={145} fit="contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl text-ink line-clamp-1">{book.title}</h3>
                  {currentPrice != null && <p className="text-3xl font-bold text-rust mt-2">{money(currentPrice)}</p>}
                  {oldPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted line-through text-lg">{money(oldPrice)}</span>
                      <span className="bg-rust/10 text-rust text-base px-2 py-0.5 rounded">-{discountPct}%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <FormatSelector
                  book={book}
                  showFormat={false}
                  showWhatsApp
                  showNote={false}
                  buttonClassName="h-[60px] text-xl"
                />
              </div>
            </div>

            <div className="bg-white rounded shadow-sm">
              <div className="p-5 text-center">
                <p className="text-2xl">Questions about this product?</p>
                <a href="#customer-feedback" className="inline-flex items-center gap-2 text-rust text-2xl font-semibold mt-5">
                  <MessageSquare size={30} />
                  Chat
                </a>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
