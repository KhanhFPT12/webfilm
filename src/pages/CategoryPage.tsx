import type { ReactNode } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { PageHeader } from "../components/common/PageHeader";
import { Pagination } from "../components/common/Pagination";
import { MovieGrid } from "../components/movie/MovieGrid";
import { useCatalog, type CatalogSource } from "../hooks/useMovies";
import { useDocumentTitle } from "../hooks/useUtils";
import { COUNTRIES, GENRES, LIST_TYPES, MIN_YEAR, currentYear, findCountry, findGenre, type ListType } from "../utils/catalog";
import { formatNumber } from "../utils/formatters";
import { NotFoundPage } from "./NotFoundPage";

type Mode = "latest" | "list" | "genre" | "country" | "year";

interface Props {
  mode: Mode;
  listType?: ListType;
}

const FORMAT_TABS: { to: string; label: string }[] = [
  { to: "/phim-moi", label: "Mới cập nhật" },
  { to: "/phim-le", label: "Phim lẻ" },
  { to: "/phim-bo", label: "Phim bộ" },
  { to: "/tv-shows", label: "TV Shows" },
];

function ChipRow({ items, active, label }: { items: { to: string; label: string }[]; active: string; label: string }) {
  return (
    <nav aria-label={label} className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
      <ul className="flex gap-1.5 pb-1 sm:flex-wrap">
        {items.map((it) => (
          <li key={it.to} className="shrink-0">
            <Link
              to={it.to}
              aria-current={it.to === active ? "page" : undefined}
              className={`chip text-xs ${it.to === active ? "chip-active" : "border-line bg-surface text-ink hover:border-deep/40 hover:text-deep"}`}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function CategoryPage({ mode, listType }: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const page = Math.max(1, Number.parseInt(search.get("page") ?? "1", 10) || 1);

  let source: CatalogSource | null = null;
  let title = "";
  let note: string | undefined;
  let crumbs: { to: string; label: string }[] = [];
  let filters: ReactNode = null;
  let invalid: string | null = null;
  let activePath = "";

  const thisYear = currentYear();

  if (mode === "latest") {
    source = { kind: "latest" };
    title = "Phim mới cập nhật";
    note = "Những tác phẩm điện ảnh mới nhất vừa được đưa lên hệ thống.";
    activePath = "/phim-moi";
    crumbs = [{ to: activePath, label: "Phim mới" }];
  } else if (mode === "list" && listType) {
    source = { kind: "list", type: listType };
    title = LIST_TYPES[listType].name;
    note = LIST_TYPES[listType].note;
    activePath = `/${listType}`;
    crumbs = [{ to: activePath, label: title }];
  } else if (mode === "genre") {
    const genre = findGenre(params.slug);
    if (!genre) invalid = "Thể loại này không tồn tại hoặc chưa được API hỗ trợ.";
    else {
      source = { kind: "genre", slug: genre.slug };
      title = `Phim ${genre.name.toLowerCase()}`;
      note = genre.note;
      activePath = `/the-loai/${genre.slug}`;
      crumbs = [
        { to: "/the-loai", label: "Thể loại" },
        { to: activePath, label: genre.name },
      ];
      filters = (
        <ChipRow label="Chọn thể loại" active={activePath} items={GENRES.map((g) => ({ to: `/the-loai/${g.slug}`, label: g.name }))} />
      );
    }
  } else if (mode === "country") {
    const country = findCountry(params.slug);
    if (!country) invalid = "Quốc gia này không tồn tại hoặc chưa được API hỗ trợ.";
    else {
      source = { kind: "country", slug: country.slug };
      title = `Phim ${country.name}`;
      activePath = `/quoc-gia/${country.slug}`;
      crumbs = [
        { to: "/quoc-gia", label: "Quốc gia" },
        { to: activePath, label: country.name },
      ];
      filters = (
        <ChipRow label="Chọn quốc gia" active={activePath} items={COUNTRIES.map((c) => ({ to: `/quoc-gia/${c.slug}`, label: c.name }))} />
      );
    }
  } else if (mode === "year") {
    const year = Number.parseInt(params.year ?? "", 10);
    if (!year || year < MIN_YEAR || year > thisYear + 1 || String(year) !== params.year) {
      invalid = "Năm phát hành không hợp lệ.";
    } else {
      source = { kind: "year", year: String(year) };
      title = `Phim năm ${year}`;
      activePath = `/nam/${year}`;
      crumbs = [
        { to: "/the-loai", label: "Thể loại" },
        { to: activePath, label: `Năm ${year}` },
      ];
      filters = (
        <label className="inline-flex items-center gap-2 text-xs font-medium text-ink">
          Năm phát hành:
          <select className="h-9 rounded-lg border border-line bg-surface px-2.5 text-xs text-ink outline-none focus:border-deep" value={year} onChange={(e) => navigate(`/nam/${e.target.value}`)}>
            {Array.from({ length: thisYear - MIN_YEAR + 1 }, (_, i) => thisYear - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      );
    }
  }

  if (mode === "latest" || mode === "list") {
    filters = <ChipRow label="Định dạng phim" active={activePath} items={FORMAT_TABS} />;
  }

  useDocumentTitle(page > 1 ? `${title} – Trang ${page}` : title);
  const { data, loading, error, reload } = useCatalog(source, page);

  if (invalid) return <NotFoundPage message={invalid} />;

  const goTo = (p: number) => {
    const next = new URLSearchParams(search);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setSearch(next);
  };

  return (
    <>
      <PageHeader
        title={title}
        crumbs={crumbs}
        description={
          <div className="flex flex-wrap items-center gap-2">
            <span>{note}</span>
            {data && data.totalItems > 0 && (
              <span className="font-semibold text-deep">
                ({formatNumber(data.totalItems)} phim)
              </span>
            )}
          </div>
        }
      >
        {filters}
      </PageHeader>

      <div className="container-page py-8 sm:py-10">
        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : !loading && data && data.items.length === 0 ? (
          <EmptyState
            title="Chưa có phim nào ở mục này"
            description={page > 1 ? "Trang này không có phim. Hãy quay lại trang đầu nhé." : "Dữ liệu hiện chưa có sẵn cho mục này."}
            action={
              page > 1 ? (
                <button type="button" className="btn-primary" onClick={() => goTo(1)}>
                  Về trang 1
                </button>
              ) : (
                <Link className="btn-primary" to="/phim-moi">
                  Xem phim mới
                </Link>
              )
            }
          />
        ) : (
          <>
            {data && data.totalPages > 1 && (
              <p className="mb-4 text-xs text-muted">
                Trang {page} / {formatNumber(data.totalPages)}
              </p>
            )}
            <MovieGrid movies={data?.items} loading={loading} />
            {data && <Pagination page={page} totalPages={data.totalPages} onChange={goTo} />}
          </>
        )}
      </div>
    </>
  );
}
