import { CalendarDays, Globe2, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { useDocumentTitle } from "../hooks/useUtils";
import { COUNTRIES, GENRES, currentYear } from "../utils/catalog";

interface Props {
  kind: "genre" | "country";
}

/** Trang chỉ mục /the-loai và /quoc-gia */
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
        description={isGenre ? "Tìm phim theo cảm xúc và phong cách bạn muốn trải nghiệm." : "Khám phá điện ảnh khắp thế giới qua màn ảnh nhỏ."}
      >
        <div className="flex flex-wrap gap-2">
          <Link to="/the-loai" aria-current={isGenre ? "page" : undefined} className={`chip text-xs ${isGenre ? "chip-active" : "border-line bg-surface text-ink hover:border-deep/40 hover:text-deep"}`}>
            <Tags className="size-3.5" /> Thể loại
          </Link>
          <Link to="/quoc-gia" aria-current={!isGenre ? "page" : undefined} className={`chip text-xs ${!isGenre ? "chip-active" : "border-line bg-surface text-ink hover:border-deep/40 hover:text-deep"}`}>
            <Globe2 className="size-3.5" /> Quốc gia
          </Link>
        </div>
      </PageHeader>

      <div className="container-page space-y-12 py-8 sm:py-10">
        <section aria-labelledby="tax-list">
          <h2 id="tax-list" className="sr-only">
            Danh sách
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {(isGenre ? GENRES : COUNTRIES).map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/${isGenre ? "the-loai" : "quoc-gia"}/${c.slug}`}
                  className="group flex h-full flex-col justify-center rounded-xl border border-line bg-surface p-4 shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-deep/30 hover:shadow-sm"
                >
                  <span className="text-sm font-semibold text-ink group-hover:text-deep">{c.name}</span>
                  {c.note && <span className="mt-1 line-clamp-2 text-xs text-muted">{c.note}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="years-title">
          <h2 id="years-title" className="section-title flex items-center gap-2.5">
            <span className="h-4.5 w-1 rounded-full bg-deep" aria-hidden="true" />
            <CalendarDays className="size-4.5 text-deep" />
            <span>Theo năm phát hành</span>
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {years.map((y) => (
              <Link key={y} to={`/nam/${y}`} className="chip text-xs hover:border-deep/40 hover:text-deep">
                Năm {y}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
