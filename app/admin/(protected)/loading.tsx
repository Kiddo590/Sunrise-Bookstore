import Spinner from '@/components/Spinner'

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Spinner size={52} />
      <p className="text-muted text-sm">Loading…</p>
    </div>
  )
}
