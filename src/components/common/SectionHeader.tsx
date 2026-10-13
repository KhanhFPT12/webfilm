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
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 id={id} className="section-title flex items-center gap-2.5">
          <span className="h-5 w-1 shrink-0 rounded-full bg-deep" aria-hidden="true" />
          {title}
        </h2>
        {subtitle && <p className="mt-1 pl-3.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="group inline-flex shrink-0 items-center gap-0.5 rounded-md py-1 text-sm font-semibold text-deep hover:text-deeper"
        >
          {linkLabel}
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
