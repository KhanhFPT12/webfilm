import { CalendarDays, Globe2, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { useDocumentTitle } from "../hooks/useUtils";
import { COUNTRIES, GENRES, currentYear } from "../utils/catalog";

interface Props {
  kind: "genre" | "country";
}

/** Trang chỉ mục /the-loai và /quoc-gia — chỉ liệt kê các mục đã xác minh với API. */
export function TaxonomyPage({ kind }: Props) {
  const isGenre = kind === "genre";
  useDocumentTitle(isGenre ? "Thể loại phim" : "Phim theo quốc gia");
  const thisYear = currentYear();
  const years = Array.from({ length: 12 }, (_, i) => thisYear - i);

  return (
    <>
      <PageHeader
        title={isGenre ? "Thể loại phim" : "Phim theo quốc gia"}
        crumbs={[{ to: isGenre ? "/the-loai" : "/quoc-gia", label: isGenre ? "Thể loại" : "Quốc gia" }]}
        description={isGenre ? "Hôm nay bạn muốn cười, khóc hay hồi hộp?" : "Đi vòng quanh thế giới qua màn ảnh."}
      >
        <div className="flex flex-wrap gap-2">
          <Link to="/the-loai" aria-current={isGenre ? "page" : undefined} className={`chip ${isGenre ? "chip-active" : "bg-surface"}`}>
            <Tags className="size-4" /> Thể loại
          </Link>
          <Link to="/quoc-gia" aria-current={!isGenre ? "page" : undefined} className={`chip ${!isGenre ? "chip-active" : "bg-surface"}`}>
            <Globe2 className="size-4" /> Quốc gia
          </Link>
        </div>
      </PageHeader>

      <div className="container-page space-y-12 py-10">
        <section aria-labelledby="tax-list">
          <h2 id="tax-list" className="sr-only">
            Danh sách
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {(isGenre ? GENRES : COUNTRIES).map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/${isGenre ? "the-loai" : "quoc-gia"}/${c.slug}`}
                  className="group flex h-full flex-col justify-center rounded-xl border border-line bg-surface px-4 py-4 shadow-[var(--shadow-card)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-rose"
                >
                  <span className="font-semibold text-ink group-hover:text-deep">{c.name}</span>
                  {c.note && <span className="mt-0.5 line-clamp-2 text-xs text-muted">{c.note}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="years-title">
          <h2 id="years-title" className="section-title flex items-center gap-2">
            <CalendarDays className="size-5 text-deep" /> Theo năm phát hành
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {years.map((y) => (
              <Link key={y} to={`/nam/${y}`} className="chip">
                {y}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
