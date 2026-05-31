import Spinner from '@/components/Spinner'

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5">
      <Spinner size={64} />
      <div className="text-center">
        <p className="font-display font-bold text-ink text-sm tracking-tight">The Sunrise BookStore</p>
        <p className="text-muted text-xs mt-0.5">Good books. Great prices.</p>
      </div>
    </div>
  )
}
