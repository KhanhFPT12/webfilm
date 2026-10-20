import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  title: ReactNode;
  subtitle?: string;
  to?: string;
  linkLabel?: string;
  id?: string;
}

export function SectionHeader({ title, subtitle, to, linkLabel = "Xem tất cả", id }: Props) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-line/60 pb-3">
      <div className="min-w-0">
        <h2 id={id} className="section-title flex items-center gap-2.5">
          <span className="h-4.5 w-1 rounded-full bg-deep" aria-hidden="true" />
          <span>{title}</span>
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="group inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold tracking-wide text-muted transition-colors hover:text-deep"
        >
          {linkLabel}
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
