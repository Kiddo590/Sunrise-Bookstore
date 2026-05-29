import Link from 'next/link'
import StarRating from './StarRating'
import type { Review } from '@/types'

type Props = {
  review: Review
  bookTitle?: string
  bookId?: string
}

export default function ReviewCard({ review, bookTitle, bookId }: Props) {
  return (
    <div className="bg-paper2 border border-line rounded-xl p-4 flex flex-col gap-2">
      {bookTitle && bookId && (
        <Link href={`/book/${bookId}`} className="text-rust text-xs font-semibold hover:underline">
          {bookTitle}
        </Link>
      )}
      <div className="flex items-center gap-2">
        <StarRating rating={review.rating} />
        <span className="font-semibold text-ink text-sm">{review.reviewer}</span>
      </div>
      <p className="text-ink text-sm leading-relaxed">{review.body}</p>
      <p className="text-muted text-xs">
        {new Date(review.created_at).toLocaleDateString('en-KE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </div>
  )
}
