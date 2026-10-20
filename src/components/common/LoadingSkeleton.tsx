export function CardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-2.5">
      <div className="skeleton aspect-[2/3] w-full rounded-xl" />
      <div className="skeleton h-4 w-4/5 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  );
}

export function GridSkeleton({ count = 10, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={className} role="status" aria-live="polite">
      <span className="sr-only">Đang tải danh sách phim…</span>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="border-b border-line bg-sub/50">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]" role="status">
        <span className="sr-only">Đang tải thông tin phim…</span>
        <div className="skeleton mx-auto aspect-[2/3] w-48 rounded-xl sm:w-56 md:w-full" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-2/3 rounded-lg" />
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="flex gap-2">
            <div className="skeleton h-6 w-16 rounded" />
            <div className="skeleton h-6 w-20 rounded" />
            <div className="skeleton h-6 w-14 rounded" />
          </div>
          <div className="skeleton h-24 w-full rounded-lg" />
          <div className="flex gap-3">
            <div className="skeleton h-10 w-36 rounded-lg" />
            <div className="skeleton h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
