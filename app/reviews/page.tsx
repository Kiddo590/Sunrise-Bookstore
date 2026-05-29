import type { Metadata } from 'next'
import { getAllApprovedReviews } from '@/lib/db'
import { waHelpLink } from '@/lib/whatsapp'
import ReviewCard from '@/components/ReviewCard'

export const metadata: Metadata = {
  title: 'What readers say — Sunrise Bookstore',
  description: 'Read reviews from our customers at Sunrise Bookstore, Nairobi.',
}

export default async function ReviewsPage() {
  const reviews = await getAllApprovedReviews()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-ink text-4xl mb-2">What readers say</h1>
      <p className="text-muted text-lg mb-10">Honest reviews from our Nairobi community.</p>

      {reviews.length === 0 ? (
        <p className="text-muted py-12 text-center">No reviews yet. Be the first!</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="break-inside-avoid">
              <ReviewCard
                review={r}
                bookTitle={r.books?.title}
                bookId={r.books?.id}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <a
          href={waHelpLink("Hi! I'd like to leave a review for a book I bought.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#25D366' }}
        >
          💬 Leave a review on WhatsApp
        </a>
      </div>
    </div>
  )
}
