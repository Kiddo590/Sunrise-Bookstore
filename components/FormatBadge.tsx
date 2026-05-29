type Props = {
  format: 'hardcopy' | 'ebook'
}

export default function FormatBadge({ format }: Props) {
  if (format === 'hardcopy') {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md">
        📕 Hardcopy
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border"
      style={{ backgroundColor: 'rgba(30,58,43,0.08)', color: '#1e3a2b', borderColor: 'rgba(30,58,43,0.2)' }}
    >
      ⚡ Ebook
    </span>
  )
}
