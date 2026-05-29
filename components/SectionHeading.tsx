import Link from 'next/link'

type Props = {
  title: string
  subtitle?: string
  eyebrow?: string
  action?: { label: string; href: string }
}

export default function SectionHeading({ title, subtitle, eyebrow, action }: Props) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="text-rust text-xs font-bold uppercase tracking-[0.15em] mb-2">{eyebrow}</p>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl leading-tight">
            {title}
          </h2>
          <div className="mt-2 h-[3px] w-10 bg-rust rounded-full" />
          {subtitle && (
            <p className="text-muted text-sm mt-3 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="shrink-0 text-rust text-sm font-semibold hover:underline mt-1"
          >
            {action.label} →
          </Link>
        )}
      </div>
    </div>
  )
}
