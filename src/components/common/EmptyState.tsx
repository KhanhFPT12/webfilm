import { Film } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

/** Trạng thái trống được thiết kế nhã nhặn, tự nhiên. */
export function EmptyState({ title, description, action, icon }: Props) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-line bg-surface/60 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-sub text-muted">
        {icon ?? <Film className="size-6 text-rose" strokeWidth={1.75} />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      {description && <div className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{description}</div>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2.5">{action}</div>}
    </div>
  );
}
