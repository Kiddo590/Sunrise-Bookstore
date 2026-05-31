function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden animate-pulse">
      <div className="bg-line" style={{ aspectRatio: '3/4' }} />
      <div className="p-3 space-y-2">
        <div className="h-2 bg-line rounded w-1/3" />
        <div className="h-3 bg-line rounded w-full" />
        <div className="h-3 bg-line rounded w-4/5" />
        <div className="h-5 bg-line rounded w-2/5 mt-1" />
      </div>
    </div>
  )
}

export default function ShopLoading() {
  return (
    <div className="bg-paper2 min-h-screen">
      {/* Header */}
      <div className="py-6 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, #1b1c2b 0%, #2d1f3d 100%)' }}>
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-2 bg-white/10 rounded w-36 mb-2" />
          <div className="h-7 bg-white/20 rounded w-44" />
          <div className="h-3 bg-white/10 rounded w-24 mt-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
