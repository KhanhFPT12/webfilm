import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function range(page: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Phân trang">
      <button
        type="button"
        className="btn-icon border border-line bg-white"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Trang trước"
      >
        <ChevronLeft className="size-5" />
      </button>
      {range(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Trang ${p}`}
            className={`h-10 min-w-10 rounded-lg px-2 text-sm font-semibold transition-colors ${
              p === page ? "bg-deep text-white" : "border border-line bg-white text-ink hover:border-rose hover:text-deep"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className="btn-icon border border-line bg-white"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Trang sau"
      >
        <ChevronRight className="size-5" />
      </button>
    </nav>
  );
}
