type Props = {
  title?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
}

export default function AdBanner({
  title = 'Your ad here',
  body = 'Book launches, author events, reading clubs welcome.',
  ctaLabel,
  ctaUrl,
}: Props) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-line">
      {/* Stripe texture bg */}
      <div
        className="absolute inset-0"
        style={{
          background: '#ece2d0',
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(192,92,32,0.05) 8px, rgba(192,92,32,0.05) 16px)',
        }}
      />

      <div className="relative p-8 text-center">
        {/* "Ad" badge */}
        <span className="inline-block bg-paper border border-line text-muted text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-4">
          Ad
        </span>

        <p className="font-display font-semibold text-ink text-xl mb-2">{title}</p>
        <p className="text-muted text-sm mb-5 max-w-sm mx-auto">{body}</p>

        {ctaLabel && ctaUrl ? (
          <a
            href={ctaUrl}
            className="inline-block bg-rust text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-rust-d transition-colors"
            style={{ boxShadow: '0 4px 12px rgba(192,92,32,0.3)' }}
          >
            {ctaLabel}
          </a>
        ) : (
          <p className="text-muted text-xs italic">Contact us on WhatsApp to advertise here.</p>
        )}
      </div>
    </div>
  )
}
