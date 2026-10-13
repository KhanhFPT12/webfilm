export function CardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="skeleton aspect-[2/3] w-full rounded-[var(--radius-card)]" />
      <div className="skeleton mt-3 h-4 w-4/5 rounded" />
      <div className="skeleton mt-2 h-3 w-1/2 rounded" />
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
    <div className="bg-pastel/60">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr]" role="status">
        <span className="sr-only">Đang tải thông tin phim…</span>
        <div className="skeleton mx-auto aspect-[2/3] w-52 rounded-xl md:w-full" />
        <div className="space-y-4">
          <div className="skeleton h-9 w-3/4 rounded" />
          <div className="skeleton h-5 w-1/3 rounded" />
          <div className="flex gap-2">
            <div className="skeleton h-7 w-16 rounded-md" />
            <div className="skeleton h-7 w-20 rounded-md" />
            <div className="skeleton h-7 w-14 rounded-md" />
          </div>
          <div className="skeleton h-24 w-full rounded" />
          <div className="flex gap-3">
            <div className="skeleton h-11 w-40 rounded-lg" />
            <div className="skeleton h-11 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
