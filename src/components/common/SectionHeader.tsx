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
    <div className="group/sh mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 id={id} className="section-title flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-deep group-hover/sh:animate-heartbeat" aria-hidden="true">
            <path d="M12 21s-8-4.9-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 6.1-8 11-8 11z" fill="currentColor" />
          </svg>
          {title}
        </h2>
        {subtitle && <p className="mt-1 pl-[30px] text-sm text-muted">{subtitle}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="group inline-flex shrink-0 items-center gap-0.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-deep ring-1 ring-line transition-all hover:bg-deep hover:text-white hover:ring-deep"
        >
          {linkLabel}
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
