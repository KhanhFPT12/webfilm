import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  title: ReactNode;
  description?: ReactNode;
  crumbs?: { to: string; label: string }[];
  children?: ReactNode;
}

/** Dải tiêu đề trang thanh lịch, tối giản với nền ấm và viền tinh tế. */
export function PageHeader({ title, description, crumbs, children }: Props) {
  return (
    <div className="border-b border-line bg-sub/60">
      <div className="container-page py-6 sm:py-8">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2.5 text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="transition-colors hover:text-deep">
                  Trang chủ
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.to} className="flex items-center gap-1.5">
                  <span className="text-line" aria-hidden="true">/</span>
                  <Link to={c.to} className="transition-colors hover:text-deep">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {description && (
          <div className="mt-1.5 text-sm text-muted sm:text-[15px]">
            {description}
          </div>
        )}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
