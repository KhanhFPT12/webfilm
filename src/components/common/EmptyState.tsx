import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

/** Trạng thái trống: minh hoạ ô vé có trái tim, nhẹ nhàng. */
export function EmptyState({ title, description, action, icon }: Props) {
  return (
    <div className="bg-dots animate-fade flex flex-col items-center rounded-3xl border-2 border-dashed border-line bg-white/80 px-6 py-12 text-center">
      {icon ?? (
        <svg viewBox="0 0 96 64" className="animate-float h-16 w-24" style={{ ["--r" as string]: "-4deg" }} aria-hidden="true">
          <path
            d="M8 10a4 4 0 0 1 4-4h72a4 4 0 0 1 4 4v14a8 8 0 0 0 0 16v14a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V40a8 8 0 0 0 0-16z"
            fill="#FCE7F3"
            stroke="#F472B6"
            strokeWidth="2"
          />
          <path d="M66 8v48" stroke="#F472B6" strokeWidth="2" strokeDasharray="3 4" />
          <path d="M37 44s-11-6.5-11-14a5.7 5.7 0 0 1 11-3.4A5.7 5.7 0 0 1 48 30c0 7.5-11 14-11 14z" fill="#EC4899" />
        </svg>
      )}
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      {description && <div className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{description}</div>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
