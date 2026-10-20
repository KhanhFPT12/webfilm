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
        className="btn-icon size-9 rounded-lg border border-line bg-surface disabled:opacity-30"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Trang trước"
      >
        <ChevronLeft className="size-4" />
      </button>
      {range(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-xs text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Trang ${p}`}
            className={`h-9 min-w-9 rounded-lg px-2.5 text-xs font-semibold transition-colors ${
              p === page
                ? "bg-deep text-white shadow-xs"
                : "border border-line bg-surface text-ink hover:border-deep/40 hover:text-deep"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className="btn-icon size-9 rounded-lg border border-line bg-surface disabled:opacity-30"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Trang sau"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
