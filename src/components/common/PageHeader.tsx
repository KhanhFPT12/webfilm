import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  title: ReactNode;
  description?: ReactNode;
  crumbs?: { to: string; label: string }[];
  children?: ReactNode;
}

/** Dải tiêu đề trang nền hồng pastel. */
export function PageHeader({ title, description, crumbs, children }: Props) {
  return (
    <div className="border-b border-line bg-pastel">
      <div className="container-page py-7 sm:py-9">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="rounded hover:text-deep">
                  Trang chủ
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.to} className="flex items-center gap-1.5">
                  <span aria-hidden="true">/</span>
                  <Link to={c.to} className="rounded hover:text-deep">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {description && <div className="mt-1.5 text-sm text-muted sm:text-base">{description}</div>}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
